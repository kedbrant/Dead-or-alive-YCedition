/**
 * Validation API - Fetches data from all sources to validate a startup idea
 *
 * Data sources fetched in parallel:
 * - YC companies (from database)
 * - Product Hunt
 * - News (Serper)
 * - Competitors (Serper)
 * - Reddit (RSS)
 * - Hacker News (RSS)
 * - Google Trends (SerpAPI) - placeholder, not yet implemented
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";
import {
  fetchNews,
  searchReddit,
  searchHackerNews,
  searchProductHunt,
  discoverCompetitors,
  type NewsArticle,
  type RedditPost,
  type HackerNewsPost,
  type PHProduct,
  type DiscoveredCompany,
} from "@/lib/data-sources";

// YC Company type for search results
type YCCompanyResult = Pick<
  Idea,
  | "id"
  | "yc_name"
  | "yc_slug"
  | "yc_batch"
  | "yc_status"
  | "yc_industry"
  | "hero"
  | "subtitle"
  | "source_outcome"
>;

// Validation request body
interface ValidateRequestBody {
  idea: string;
}

// Validation response types
interface ValidationReport {
  idea: string;
  timestamp: string;
  ycCompanies: YCCompanyResult[];
  phProducts: PHProduct[];
  competitors: DiscoveredCompany[];
  news: NewsArticle[];
  redditPosts: RedditPost[];
  hnPosts: HackerNewsPost[];
  trends: null; // Placeholder for Google Trends (SerpAPI) - not yet implemented
}

interface ValidateResponse {
  success: true;
  report: ValidationReport;
}

interface ValidateErrorResponse {
  success: false;
  error: string;
}

/**
 * Search YC companies that match the idea
 * Uses text search on hero and subtitle fields
 */
async function searchYCCompanies(idea: string): Promise<YCCompanyResult[]> {
  const supabase = createServerSupabaseClient();

  // Extract keywords from idea for search
  const keywords = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 5)
    .join(" | "); // PostgreSQL OR operator for text search

  if (!keywords) {
    return [];
  }

  try {
    // Search for YC companies matching the idea
    // Using ilike for flexible matching
    const searchPattern = `%${idea.split(/\s+/).slice(0, 3).join("%")}%`;

    const { data, error } = await supabase
      .from("ideas")
      .select(
        "id, yc_name, yc_slug, yc_batch, yc_status, yc_industry, hero, subtitle, source_outcome"
      )
      .eq("source", "yc")
      .eq("is_active", true)
      .or(`hero.ilike.${searchPattern},subtitle.ilike.${searchPattern}`)
      .limit(20)
      .returns<YCCompanyResult[]>();

    if (error) {
      console.error("Error searching YC companies:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error searching YC companies:", error);
    return [];
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ValidateResponse | ValidateErrorResponse>> {
  let body: ValidateRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { idea } = body;

  // Validate required field
  if (!idea || typeof idea !== "string") {
    return NextResponse.json(
      { success: false, error: "idea is required and must be a string" },
      { status: 400 }
    );
  }

  // Validate idea length
  if (idea.length > 500) {
    return NextResponse.json(
      { success: false, error: "idea must be 500 characters or less" },
      { status: 400 }
    );
  }

  const trimmedIdea = idea.trim();
  if (trimmedIdea.length < 10) {
    return NextResponse.json(
      { success: false, error: "idea must be at least 10 characters" },
      { status: 400 }
    );
  }

  try {
    // Fetch all data sources in parallel
    const [
      ycCompanies,
      phProducts,
      competitors,
      news,
      redditPosts,
      hnPosts,
    ] = await Promise.all([
      searchYCCompanies(trimmedIdea),
      searchProductHunt(trimmedIdea),
      discoverCompetitors(trimmedIdea),
      fetchNews(trimmedIdea),
      searchReddit(trimmedIdea),
      searchHackerNews(trimmedIdea),
    ]);

    // Build the validation report
    const report: ValidationReport = {
      idea: trimmedIdea,
      timestamp: new Date().toISOString(),
      ycCompanies,
      phProducts,
      competitors,
      news,
      redditPosts,
      hnPosts,
      trends: null, // Placeholder for Google Trends (SerpAPI) - not yet implemented
    };

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error validating idea:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate idea" },
      { status: 500 }
    );
  }
}
