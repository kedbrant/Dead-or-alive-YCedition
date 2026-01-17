import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ReportInsert,
  ReportData,
  YCCompanyMatch,
  NewsArticle,
  RedditPost,
  TrendsData,
  SourceOutcome,
  Idea,
} from "@/lib/supabase/types";

// Minimum idea length requirement
const MIN_IDEA_LENGTH = 10;

// Stop words to filter out during keyword extraction
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "need", "that", "this",
  "these", "those", "i", "you", "he", "she", "it", "we", "they", "what",
  "which", "who", "whom", "whose", "where", "when", "why", "how", "all",
  "each", "every", "both", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "also", "now", "your", "my", "our", "their", "its", "his", "her",
]);

interface ValidateRequestBody {
  idea: string;
}

/**
 * Extract keywords from idea text for searching
 */
function extractKeywords(idea: string): string[] {
  return idea
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Search YC companies for similar ideas
 * (Full implementation in US-003)
 */
async function searchYCCompanies(idea: string): Promise<YCCompanyMatch[]> {
  const supabase = createServerSupabaseClient();
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return [];
  }

  // Build ILIKE conditions for each keyword
  const searchConditions = keywords.map((kw) => `hero.ilike.%${kw}%`).join(",");

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("yc_name, yc_batch, hero, source_outcome, yc_team_size, yc_slug")
    .eq("source", "yc")
    .or(searchConditions)
    .limit(20)
    .returns<Idea[]>();

  if (error || !ideas) {
    console.error("Error searching YC companies:", error);
    return [];
  }

  // Calculate simple similarity score based on keyword matches
  return ideas.map((item) => {
    const heroLower = item.hero.toLowerCase();
    const matchCount = keywords.filter((kw) => heroLower.includes(kw)).length;
    const similarity = matchCount / keywords.length;

    return {
      name: item.yc_name || item.hero.slice(0, 50),
      batch: item.yc_batch || "Unknown",
      pitch: item.hero,
      outcome: item.source_outcome,
      team_size: item.yc_team_size,
      slug: item.yc_slug || "",
      similarity_score: Math.round(similarity * 100),
    };
  }).sort((a, b) => b.similarity_score - a.similarity_score);
}

/**
 * Fetch recent news about the idea topic
 * (Full implementation in US-004)
 */
async function fetchRecentNews(_idea: string): Promise<NewsArticle[]> {
  // Stub implementation - will be enhanced in US-004
  // Returns empty array for now as RSS fetching requires additional setup
  return [];
}

/**
 * Search Reddit for discussions
 * (Full implementation in US-005)
 */
async function searchReddit(_idea: string): Promise<RedditPost[]> {
  // Stub implementation - will be enhanced in US-005
  // Returns empty array for now as Reddit API requires rate limiting handling
  return [];
}

/**
 * Get Google Trends data
 * (Full implementation in US-006)
 */
async function getGoogleTrends(_idea: string): Promise<TrendsData | null> {
  // Stub implementation - will be enhanced in US-006
  // Returns mock data for MVP
  return {
    currentLevel: 65,
    changePercent: 15,
    timeline: [
      { date: "2024-01", value: 45 },
      { date: "2024-06", value: 55 },
      { date: "2025-01", value: 65 },
    ],
  };
}

/**
 * Generate AI analysis of the aggregated data
 * (Full implementation in US-007)
 */
async function generateAnalysis(
  idea: string,
  companies: YCCompanyMatch[],
  _news: NewsArticle[],
  _reddit: RedditPost[],
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
          "Market analysis pending. News data will be incorporated in future updates.",
        articles: [],
      },
      sentiment: {
        summary:
          "Community sentiment analysis pending. Reddit data will be incorporated in future updates.",
        posts: [],
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
