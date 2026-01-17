import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { searchYCCompanies } from "@/lib/data-sources/yc";
import { fetchRecentNews } from "@/lib/data-sources/news";
import { searchReddit } from "@/lib/data-sources/reddit";
import { getGoogleTrends } from "@/lib/data-sources/trends";
import type {
  ReportInsert,
  ReportData,
  YCCompanyMatch,
  NewsArticle,
  RedditPost,
  TrendsData,
} from "@/lib/supabase/types";

// Minimum idea length requirement
const MIN_IDEA_LENGTH = 10;

interface ValidateRequestBody {
  idea: string;
}

/**
 * Generate AI analysis of the aggregated data
 * (Full implementation in US-007)
 */
async function generateAnalysis(
  idea: string,
  companies: YCCompanyMatch[],
  news: NewsArticle[],
  reddit: RedditPost[],
  trends: TrendsData | null
): Promise<ReportData> {
  // Count outcomes from similar companies
  const outcomeCounts = { unicorn: 0, acquired: 0, dead: 0, active: 0 };
  for (const company of companies) {
    if (company.outcome && company.outcome in outcomeCounts) {
      outcomeCounts[company.outcome as keyof typeof outcomeCounts]++;
    }
  }

  // Calculate a preliminary score based on available data
  // This will be replaced with OpenAI analysis in US-007
  let score = 50; // Base score

  // Adjust based on similar companies outcomes
  if (companies.length > 0) {
    const successRate =
      (outcomeCounts.unicorn + outcomeCounts.acquired) / companies.length;
    const failRate = outcomeCounts.dead / companies.length;
    score += Math.round((successRate - failRate) * 30);
  }

  // Adjust based on trends if available
  if (trends && trends.changePercent > 0) {
    score += Math.min(10, Math.round(trends.changePercent / 5));
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    idea,
    score,
    scoreReasoning: `Based on analysis of ${companies.length} similar YC companies and market trends. ${outcomeCounts.unicorn} became unicorns, ${outcomeCounts.acquired} were acquired, ${outcomeCounts.dead} failed, and ${outcomeCounts.active} are still active.`,
    sections: {
      historical: {
        summary:
          companies.length > 0
            ? `Found ${companies.length} similar companies in YC's history. The success rate suggests ${score >= 60 ? "promising" : "challenging"} market conditions.`
            : "No closely similar YC companies found. This could indicate a novel opportunity or unproven market.",
        companies,
        outcomeCounts,
      },
      market: {
        summary:
          news.length > 0
            ? `Found ${news.length} recent news articles related to this space. Recent coverage suggests ${news.length >= 5 ? "active" : "moderate"} media interest in this market.`
            : "No recent news articles found for this topic. This could indicate a niche market or emerging opportunity with limited media coverage.",
        articles: news,
      },
      sentiment: {
        summary:
          reddit.length > 0
            ? `Found ${reddit.length} relevant discussions across startup communities on Reddit. ${
                reddit.length >= 5
                  ? "Active community interest suggests this topic resonates with founders and users."
                  : "Limited discussions found - this may be an emerging space or niche market."
              }`
            : "No relevant Reddit discussions found. This could indicate a novel concept or niche market with limited online discourse.",
        posts: reddit,
        sentimentBreakdown: { positive: 33, negative: 33, neutral: 34 },
      },
      trends: {
        summary: trends
          ? `Search interest has changed by ${trends.changePercent}% recently, indicating ${trends.changePercent > 0 ? "growing" : "declining"} market interest.`
          : "Trends data not available for this topic.",
        data: trends,
      },
      recommendations: [
        {
          title: "Study Similar Companies",
          description:
            companies.length > 0
              ? `Review the ${Math.min(5, companies.length)} most similar YC companies to understand what worked and what didn't.`
              : "Research existing solutions in adjacent markets to identify potential competitors and partners.",
        },
        {
          title: "Validate Market Demand",
          description:
            "Conduct customer interviews to validate that the problem you're solving is a real pain point worth paying to solve.",
        },
        {
          title: "Define Your Differentiation",
          description:
            "Clearly articulate what makes your approach unique compared to existing solutions in this space.",
        },
      ],
    },
  };
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

  try {
    // Fetch data from multiple sources in parallel
    const [companies, news, reddit, trends] = await Promise.all([
      searchYCCompanies(trimmedIdea),
      fetchRecentNews(trimmedIdea),
      searchReddit(trimmedIdea),
      getGoogleTrends(trimmedIdea),
    ]);

    // Generate AI analysis
    const reportData = await generateAnalysis(
      trimmedIdea,
      companies,
      news,
      reddit,
      trends
    );

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
    return NextResponse.json(
      { error: "Failed to validate idea" },
      { status: 500 }
    );
  }
}
