import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

type LeaderboardType = "top" | "voted" | "controversial" | "biggest_misses";

// Type for leaderboard response items
type LeaderboardItem = Pick<
  Idea,
  | "id"
  | "slug"
  | "hero"
  | "subtitle"
  | "ship_percentage"
  | "total_votes"
  | "submitter_twitter"
  | "source"
  | "source_company"
  | "yc_slug"
  | "yc_name"
  | "source_outcome"
>;

const LIMIT = 20;
const MIN_VOTES_YC_LEADERBOARD = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "top") as LeaderboardType;

  // Validate type parameter
  const validTypes = ["top", "voted", "controversial", "biggest_misses"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  const selectFields = "id, slug, hero, subtitle, ship_percentage, total_votes, submitter_twitter, source, source_company, yc_slug, yc_name, source_outcome";

  let query = supabase
    .from("ideas")
    .select(selectFields)
    .eq("is_active", true);

  switch (type) {
    case "top":
      // Highest ship_percentage
      query = query
        .order("ship_percentage", { ascending: false });
      break;

    case "voted":
      // Most total_votes
      query = query.order("total_votes", { ascending: false });
      break;

    case "controversial":
      // Closest to 50% ship_percentage (most divided opinions)
      // We'll sort in JS since Supabase doesn't support ABS() in order
      query = query.gt("total_votes", 0);
      break;

    case "biggest_misses":
      // Unicorns that got skipped the most (lowest ship_percentage)
      query = query
        .eq("source_outcome", "unicorn")
        .gte("total_votes", MIN_VOTES_YC_LEADERBOARD)
        .order("ship_percentage", { ascending: true });
      break;
  }

  const { data: ideas, error } = await query
    .limit(type === "controversial" ? 500 : LIMIT) // Fetch more for controversial to sort client-side
    .returns<LeaderboardItem[]>();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }

  let results = ideas ?? [];

  // For controversial, sort by absolute distance from 50%
  if (type === "controversial") {
    results = results
      .sort(
        (a, b) =>
          Math.abs(a.ship_percentage - 50) - Math.abs(b.ship_percentage - 50)
      )
      .slice(0, LIMIT);
  }

  return NextResponse.json(results);
}
