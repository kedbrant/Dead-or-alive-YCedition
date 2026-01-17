import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { searchYCCompanies } from "@/lib/data-sources/yc";
import { fetchRecentNews } from "@/lib/data-sources/news";
import { searchReddit } from "@/lib/data-sources/reddit";
import { getGoogleTrends } from "@/lib/data-sources/trends";
import { generateAnalysis } from "@/lib/ai/openai";
import { analyzeIdea } from "@/lib/ai/idea-analysis";
import type { ReportInsert } from "@/lib/supabase/types";

// Minimum idea length requirement
const MIN_IDEA_LENGTH = 10;

// Maximum idea length requirement (prevent abuse)
const MAX_IDEA_LENGTH = 5000;

interface ValidateRequestBody {
  idea: string;
}

// Track partial failures for logging
interface DataFetchResult<T> {
  data: T;
  failed: boolean;
  source: string;
}

// Wrapper to catch individual data source failures
async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  source: string
): Promise<DataFetchResult<T>> {
  try {
    const data = await fetcher();
    return { data, failed: false, source };
  } catch (err) {
    console.warn(`Data source ${source} failed:`, err);
    return { data: fallback, failed: true, source };
  }
}

export async function POST(request: NextRequest) {
  let body: ValidateRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { idea } = body;

  // Validate idea is present and long enough
  if (!idea || typeof idea !== "string") {
    return NextResponse.json({ error: "idea is required" }, { status: 400 });
  }

  const trimmedIdea = idea.trim();

  if (trimmedIdea.length < MIN_IDEA_LENGTH) {
    return NextResponse.json(
      { error: `Idea must be at least ${MIN_IDEA_LENGTH} characters` },
      { status: 400 }
    );
  }

  // Validate idea is not too long (prevent abuse)
  if (trimmedIdea.length > MAX_IDEA_LENGTH) {
    return NextResponse.json(
      { error: `Idea must be ${MAX_IDEA_LENGTH} characters or less` },
      { status: 400 }
    );
  }

  try {
    // First, get AI analysis (initial take + search terms + subreddits)
    // This single call extracts all the context we need for better data fetching
    const analysis = await analyzeIdea(trimmedIdea);

    // Fetch data from multiple sources in parallel with individual error handling
    // This allows partial failures - if Reddit is down, we still get YC, news, and trends
    // Use AI-generated search terms and subreddits for better relevance
    const [companiesResult, newsResult, redditResult, trendsResult] = await Promise.all([
      fetchWithFallback(() => searchYCCompanies(trimmedIdea, analysis.ycSearchTerms), [], "YC Companies"),
      fetchWithFallback(() => fetchRecentNews(trimmedIdea), [], "News"),
      fetchWithFallback(() => searchReddit(trimmedIdea, analysis.subreddits), [], "Reddit"),
      fetchWithFallback(() => getGoogleTrends(trimmedIdea, analysis.searchTerms), null, "Trends"),
    ]);

    const companies = companiesResult.data;
    const news = newsResult.data;
    const reddit = redditResult.data;
    const trends = trendsResult.data;

    // Log partial failures for monitoring (but continue with available data)
    const failedSources = [companiesResult, newsResult, redditResult, trendsResult]
      .filter(r => r.failed)
      .map(r => r.source);

    if (failedSources.length > 0) {
      console.warn(`Partial data fetch failures: ${failedSources.join(", ")}`);
    }

    // Generate AI analysis using OpenAI GPT-4o
    const reportData = await generateAnalysis({
      idea: trimmedIdea,
      initialTake: analysis.initialTake,
      companies,
      news,
      reddit,
      trends,
    });

    // Save report to database
    const supabase = createServerSupabaseClient();

    const reportInsert: ReportInsert = {
      idea: trimmedIdea,
      score: reportData.score,
      report_data: reportData,
    };

    const { data: insertedReport, error: insertError } = await supabase
      .from("reports")
      .insert(reportInsert)
      .select("id")
      .single();

    if (insertError || !insertedReport) {
      console.error("Error saving report:", insertError);
      return NextResponse.json(
        { error: "Failed to save report" },
        { status: 500 }
      );
    }

    // Return report ID for redirect
    return NextResponse.json({
      id: insertedReport.id,
      score: reportData.score,
      sections: reportData.sections,
    });
  } catch (err) {
    console.error("Validation error:", err);

    // Check for rate limiting errors from OpenAI
    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      if (message.includes("rate limit") || message.includes("too many requests")) {
        return NextResponse.json(
          { error: "We're experiencing high demand. Please wait a moment and try again." },
          { status: 429 }
        );
      }

      // Check for timeout errors
      if (message.includes("timeout") || message.includes("timed out")) {
        return NextResponse.json(
          { error: "The request took too long. Please try again." },
          { status: 504 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { error: "Something went wrong while validating your idea. Please try again." },
      { status: 500 }
    );
  }
}
