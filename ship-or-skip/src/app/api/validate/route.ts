import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  findSimilarCompanies,
  SimilarityCompany,
  SimilarCompanyResult,
  detectIndustry,
} from "@/lib/similarity";

// Fields to select for similarity matching
const COMPANY_SELECT_FIELDS = `
  slug,
  yc_name,
  yc_batch,
  hero,
  source_outcome,
  yc_industry,
  yc_team_size,
  ship_percentage,
  total_votes
`;

interface ValidateRequest {
  pitch: string;
}

interface CategoryStats {
  total: number;
  unicorn_pct: number;
  acquired_pct: number;
  dead_pct: number;
  active_pct: number;
}

interface IndustryInsights {
  detected_industry: string | null;
  total_in_industry: number;
  unicorn_rate: number;
  dead_rate: number;
  active_rate: number;
  avg_unicorn_rate: number; // Overall YC average for comparison
}

interface InsightFlag {
  type: "green" | "red" | "yellow";
  message: string;
}

interface ValidateResponse {
  similar_companies: SimilarCompanyResult[];
  category_stats: CategoryStats;
  viability_score: number;
  industry_insights: IndustryInsights;
  flags: InsightFlag[];
  competition_level: number; // 0-100
  top_unicorn: SimilarCompanyResult | null;
}

/**
 * POST /api/validate
 * Accepts a pitch and returns similar YC companies with similarity scores
 * plus category stats, viability score, and insights.
 */
export async function POST(request: NextRequest) {
  let body: ValidateRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { pitch } = body;

  // Validate pitch
  if (!pitch || typeof pitch !== "string") {
    return NextResponse.json(
      { error: "Pitch is required" },
      { status: 400 }
    );
  }

  const trimmedPitch = pitch.trim();
  if (trimmedPitch.length < 10) {
    return NextResponse.json(
      { error: "Pitch must be at least 10 characters" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Fetch all YC companies from database
  const { data: companies, error } = await supabase
    .from("ideas")
    .select(COMPANY_SELECT_FIELDS)
    .eq("source", "yc");

  if (error) {
    console.error("Validate API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }

  if (!companies || companies.length === 0) {
    return NextResponse.json({
      similar_companies: [],
      category_stats: {
        total: 0,
        unicorn_pct: 0,
        acquired_pct: 0,
        dead_pct: 0,
        active_pct: 0,
      },
      viability_score: 50,
      industry_insights: {
        detected_industry: null,
        total_in_industry: 0,
        unicorn_rate: 0,
        dead_rate: 0,
        active_rate: 0,
        avg_unicorn_rate: 0,
      },
      flags: [],
      competition_level: 0,
      top_unicorn: null,
    } as ValidateResponse);
  }

  const typedCompanies = companies as SimilarityCompany[];

  // Find similar companies using the similarity algorithm
  const similarCompanies = findSimilarCompanies(trimmedPitch, typedCompanies);

  // Calculate category stats from similar companies
  const categoryStats = calculateCategoryStats(similarCompanies);

  // Detect industry from pitch
  const detectedIndustry = detectIndustry(trimmedPitch);

  // Calculate industry insights
  const industryInsights = calculateIndustryInsights(
    detectedIndustry,
    typedCompanies
  );

  // Calculate viability score
  const viabilityScore = calculateViabilityScore(
    similarCompanies,
    categoryStats,
    industryInsights
  );

  // Generate insight flags
  const flags = generateFlags(
    categoryStats,
    industryInsights,
    similarCompanies.length
  );

  // Calculate competition level
  const competitionLevel = calculateCompetitionLevel(
    industryInsights,
    similarCompanies.length
  );

  // Find top unicorn from similar companies
  const topUnicorn = similarCompanies.find(
    (c) => c.company.source_outcome === "unicorn"
  ) || null;

  const response: ValidateResponse = {
    similar_companies: similarCompanies,
    category_stats: categoryStats,
    viability_score: viabilityScore,
    industry_insights: industryInsights,
    flags,
    competition_level: competitionLevel,
    top_unicorn: topUnicorn,
  };

  return NextResponse.json(response);
}

/**
 * Calculate outcome distribution percentages from similar companies
 */
function calculateCategoryStats(
  similarCompanies: SimilarCompanyResult[]
): CategoryStats {
  const total = similarCompanies.length;

  if (total === 0) {
    return {
      total: 0,
      unicorn_pct: 0,
      acquired_pct: 0,
      dead_pct: 0,
      active_pct: 0,
    };
  }

  let unicorns = 0;
  let acquired = 0;
  let dead = 0;
  let active = 0;

  for (const result of similarCompanies) {
    switch (result.company.source_outcome) {
      case "unicorn":
        unicorns++;
        break;
      case "acquired":
        acquired++;
        break;
      case "dead":
        dead++;
        break;
      case "active":
        active++;
        break;
    }
  }

  return {
    total,
    unicorn_pct: Math.round((unicorns / total) * 100),
    acquired_pct: Math.round((acquired / total) * 100),
    dead_pct: Math.round((dead / total) * 100),
    active_pct: Math.round((active / total) * 100),
  };
}

/**
 * Calculate industry-specific insights
 */
function calculateIndustryInsights(
  detectedIndustry: string | null,
  allCompanies: SimilarityCompany[]
): IndustryInsights {
  // Calculate overall YC averages
  const totalCompanies = allCompanies.length;
  const totalUnicorns = allCompanies.filter(
    (c) => c.source_outcome === "unicorn"
  ).length;
  const avgUnicornRate =
    totalCompanies > 0
      ? Math.round((totalUnicorns / totalCompanies) * 100)
      : 0;

  if (!detectedIndustry) {
    return {
      detected_industry: null,
      total_in_industry: 0,
      unicorn_rate: 0,
      dead_rate: 0,
      active_rate: 0,
      avg_unicorn_rate: avgUnicornRate,
    };
  }

  // Filter companies by detected industry
  const industryCompanies = allCompanies.filter(
    (c) => c.yc_industry?.toLowerCase() === detectedIndustry.toLowerCase()
  );

  const total = industryCompanies.length;
  if (total === 0) {
    return {
      detected_industry: detectedIndustry,
      total_in_industry: 0,
      unicorn_rate: 0,
      dead_rate: 0,
      active_rate: 0,
      avg_unicorn_rate: avgUnicornRate,
    };
  }

  const unicorns = industryCompanies.filter(
    (c) => c.source_outcome === "unicorn"
  ).length;
  const dead = industryCompanies.filter(
    (c) => c.source_outcome === "dead"
  ).length;
  const active = industryCompanies.filter(
    (c) => c.source_outcome === "active"
  ).length;

  return {
    detected_industry: detectedIndustry,
    total_in_industry: total,
    unicorn_rate: Math.round((unicorns / total) * 100),
    dead_rate: Math.round((dead / total) * 100),
    active_rate: Math.round((active / total) * 100),
    avg_unicorn_rate: avgUnicornRate,
  };
}

/**
 * Calculate viability score (0-100)
 * Based on similar companies' outcomes and industry performance
 */
function calculateViabilityScore(
  similarCompanies: SimilarCompanyResult[],
  categoryStats: CategoryStats,
  industryInsights: IndustryInsights
): number {
  let score = 50; // Start at neutral

  // Factor 1: Similar companies' success rate (+/- 20 points)
  if (categoryStats.total > 0) {
    const successRate = categoryStats.unicorn_pct + categoryStats.acquired_pct;
    const failRate = categoryStats.dead_pct;
    score += (successRate - failRate) * 0.2;
  }

  // Factor 2: Industry unicorn rate vs average (+/- 15 points)
  if (industryInsights.detected_industry && industryInsights.total_in_industry > 0) {
    const industryBonus =
      (industryInsights.unicorn_rate - industryInsights.avg_unicorn_rate) * 1.5;
    score += Math.max(-15, Math.min(15, industryBonus));
  }

  // Factor 3: Number of similar companies (validation of market)
  if (similarCompanies.length >= 5) {
    score += 5; // Market is validated
  } else if (similarCompanies.length === 0) {
    score -= 5; // Uncharted territory (risky)
  }

  // Factor 4: High match scores indicate proven concept
  const avgScore =
    similarCompanies.length > 0
      ? similarCompanies.reduce((sum, c) => sum + c.score, 0) /
        similarCompanies.length
      : 0;
  if (avgScore > 50) {
    score += 5;
  }

  // Factor 5: Presence of unicorns in similar companies
  const hasUnicorn = similarCompanies.some(
    (c) => c.company.source_outcome === "unicorn"
  );
  if (hasUnicorn) {
    score += 10;
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate insight flags based on analysis
 */
function generateFlags(
  categoryStats: CategoryStats,
  industryInsights: IndustryInsights,
  similarCount: number
): InsightFlag[] {
  const flags: InsightFlag[] = [];

  // Green flags
  if (categoryStats.unicorn_pct >= 10) {
    flags.push({
      type: "green",
      message: `High unicorn rate among similar companies (${categoryStats.unicorn_pct}%)`,
    });
  }

  if (
    industryInsights.detected_industry &&
    industryInsights.unicorn_rate > industryInsights.avg_unicorn_rate
  ) {
    flags.push({
      type: "green",
      message: `${industryInsights.detected_industry} has above-average unicorn rate (${industryInsights.unicorn_rate}% vs ${industryInsights.avg_unicorn_rate}% avg)`,
    });
  }

  if (categoryStats.unicorn_pct + categoryStats.acquired_pct >= 30) {
    flags.push({
      type: "green",
      message: `Strong exit potential - ${categoryStats.unicorn_pct + categoryStats.acquired_pct}% of similar companies had successful exits`,
    });
  }

  // Red flags
  if (categoryStats.dead_pct >= 50) {
    flags.push({
      type: "red",
      message: `High failure rate - ${categoryStats.dead_pct}% of similar companies are dead`,
    });
  }

  if (
    industryInsights.detected_industry &&
    industryInsights.dead_rate >= 30
  ) {
    flags.push({
      type: "red",
      message: `${industryInsights.detected_industry} has a ${industryInsights.dead_rate}% failure rate`,
    });
  }

  // Yellow flags (warnings)
  if (similarCount === 0) {
    flags.push({
      type: "yellow",
      message: "No similar YC companies found - this could be a blue ocean or unproven market",
    });
  }

  if (
    industryInsights.detected_industry &&
    industryInsights.total_in_industry > 100
  ) {
    flags.push({
      type: "yellow",
      message: `Crowded space - ${industryInsights.total_in_industry} YC companies in ${industryInsights.detected_industry}`,
    });
  }

  if (similarCount > 0 && categoryStats.unicorn_pct === 0) {
    flags.push({
      type: "yellow",
      message: "No unicorns among similar companies yet",
    });
  }

  return flags;
}

/**
 * Calculate competition level (0-100)
 */
function calculateCompetitionLevel(
  industryInsights: IndustryInsights,
  similarCount: number
): number {
  let level = 0;

  // Industry saturation
  if (industryInsights.total_in_industry > 0) {
    // Scale: 0-50 companies = low, 50-150 = medium, 150+ = high
    level += Math.min(50, Math.round(industryInsights.total_in_industry / 3));
  }

  // Similar companies factor
  level += Math.min(30, similarCount * 3);

  // Active competitors factor
  const activeRate = industryInsights.active_rate;
  level += Math.round(activeRate * 0.2);

  return Math.min(100, level);
}
