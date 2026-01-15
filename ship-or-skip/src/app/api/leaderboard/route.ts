import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

type LeaderboardType = "top" | "voted" | "controversial";

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
>;

const LIMIT = 50;
const MIN_VOTES_FOR_TOP = 100;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "top") as LeaderboardType;

  // Validate type parameter
  if (!["top", "voted", "controversial"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Must be 'top', 'voted', or 'controversial'" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("ideas")
    .select(
      "id, slug, hero, subtitle, ship_percentage, total_votes, submitter_twitter, source, source_company"
    )
    .eq("is_active", true);

  switch (type) {
    case "top":
      // Highest ship_percentage with minimum 100 votes
      query = query
        .gte("total_votes", MIN_VOTES_FOR_TOP)
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
