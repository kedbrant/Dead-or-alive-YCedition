import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { searchYCCompanies } from "@/lib/data-sources/yc";
import { fetchRecentNews } from "@/lib/data-sources/news";
import { searchReddit } from "@/lib/data-sources/reddit";
import { getGoogleTrends } from "@/lib/data-sources/trends";
import { generateAnalysis } from "@/lib/ai/openai";
import type { ReportInsert } from "@/lib/supabase/types";

// Minimum idea length requirement
const MIN_IDEA_LENGTH = 10;

interface ValidateRequestBody {
  idea: string;
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

    // Generate AI analysis using OpenAI GPT-4o
    const reportData = await generateAnalysis({
      idea: trimmedIdea,
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
    return NextResponse.json(
      { error: "Failed to validate idea" },
      { status: 500 }
    );
  }
}
