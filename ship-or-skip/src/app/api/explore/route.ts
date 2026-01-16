import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

// Non-nullable outcome type for filtering
type OutcomeFilter = "unicorn" | "acquired" | "dead" | "active";

// Fields to select for company listing
const COMPANY_SELECT_FIELDS = `
  slug,
  yc_name,
  yc_batch,
  hero,
  source_outcome,
  yc_industry,
  yc_team_size,
  ship_percentage,
  total_votes,
  created_at
`;

type SortOption = "newest" | "team_size" | "votes";

interface ExploreResponse {
  companies: Pick<
    Idea,
    | "slug"
    | "yc_name"
    | "yc_batch"
    | "hero"
    | "source_outcome"
    | "yc_industry"
    | "yc_team_size"
    | "ship_percentage"
    | "total_votes"
  >[];
  total: number;
  stats: {
    total: number;
    unicorns: number;
    dead: number;
  };
}

/**
 * GET /api/explore
 * Search, filter, sort, and paginate YC companies
 *
 * Query params:
 * - search: Search term for company name or pitch (ILIKE)
 * - outcome: Filter by source_outcome (unicorn, acquired, dead, active)
 * - industry: Filter by yc_industry
 * - batch: Filter by batch year (e.g., "2024" matches "W24", "S24")
 * - sort: Sort order (newest, team_size, votes)
 * - page: Page number (1-indexed, default: 1)
 * - limit: Results per page (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);

  // Parse query params
  const search = searchParams.get("search")?.trim() || "";
  const outcome = searchParams.get("outcome") || "all";
  const industry = searchParams.get("industry") || "all";
  const batch = searchParams.get("batch") || "all";
  const sort = (searchParams.get("sort") || "newest") as SortOption;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  // Build base query for YC companies only
  let query = supabase
    .from("ideas")
    .select(COMPANY_SELECT_FIELDS, { count: "exact" })
    .eq("source", "yc");

  // Apply search filter (ILIKE on hero and yc_name)
  if (search) {
    query = query.or(`hero.ilike.%${search}%,yc_name.ilike.%${search}%`);
  }

  // Apply outcome filter
  if (outcome !== "all") {
    query = query.eq("source_outcome", outcome as OutcomeFilter);
  }

  // Apply industry filter
  if (industry !== "all") {
    query = query.eq("yc_industry", industry);
  }

  // Apply batch filter (match year part of batch like W24, S24)
  if (batch !== "all") {
    // Convert full year to two-digit format: "2024" -> "24"
    const yearShort = batch.slice(-2);
    // Match batches like W24 or S24
    query = query.or(`yc_batch.ilike.W${yearShort},yc_batch.ilike.S${yearShort}`);
  }

  // Apply sorting
  switch (sort) {
    case "team_size":
      query = query.order("yc_team_size", { ascending: false, nullsFirst: false });
      break;
    case "votes":
      query = query.order("total_votes", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  // Execute query
  const { data: companies, count, error } = await query;

  if (error) {
    console.error("Explore API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }

  // Build stats query with same filters (except pagination)
  let statsQuery = supabase
    .from("ideas")
    .select("source_outcome", { count: "exact" })
    .eq("source", "yc");

  // Apply same filters for stats
  if (search) {
    statsQuery = statsQuery.or(`hero.ilike.%${search}%,yc_name.ilike.%${search}%`);
  }
  if (outcome !== "all") {
    statsQuery = statsQuery.eq("source_outcome", outcome as OutcomeFilter);
  }
  if (industry !== "all") {
    statsQuery = statsQuery.eq("yc_industry", industry);
  }
  if (batch !== "all") {
    const yearShort = batch.slice(-2);
    statsQuery = statsQuery.or(`yc_batch.ilike.W${yearShort},yc_batch.ilike.S${yearShort}`);
  }

  const { data: statsData } = await statsQuery;

  // Calculate stats from filtered results
  let unicorns = 0;
  let dead = 0;

  if (statsData) {
    for (const item of statsData) {
      if (item.source_outcome === "unicorn") unicorns++;
      if (item.source_outcome === "dead") dead++;
    }
  }

  const response: ExploreResponse = {
    companies: companies || [],
    total: count || 0,
    stats: {
      total: count || 0,
      unicorns,
      dead,
    },
  };

  return NextResponse.json(response);
}
