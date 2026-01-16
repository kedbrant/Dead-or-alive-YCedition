import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  findSimilarCompanies,
  SimilarityCompany,
  SimilarCompanyResult,
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

interface ValidateResponse {
  similar_companies: SimilarCompanyResult[];
  category_stats: CategoryStats;
}

/**
 * POST /api/validate
 * Accepts a pitch and returns similar YC companies with similarity scores
 * plus category stats for the matched companies.
 *
 * Body:
 * - pitch: string (minimum 10 characters)
 *
 * Returns:
 * - similar_companies: Array of companies with similarity scores
 * - category_stats: Outcome distribution of similar companies
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
    } as ValidateResponse);
  }

  // Find similar companies using the similarity algorithm
  const similarCompanies = findSimilarCompanies(
    trimmedPitch,
    companies as SimilarityCompany[]
  );

  // Calculate category stats from similar companies
  const categoryStats = calculateCategoryStats(similarCompanies);

  const response: ValidateResponse = {
    similar_companies: similarCompanies,
    category_stats: categoryStats,
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
