import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea, Session } from "@/lib/supabase/types";

type LeaderboardType = "top" | "voted" | "controversial" | "biggest_misses" | "biggest_fools" | "favorites" | "user_submissions" | "voters" | "most_ships";

// Type for idea leaderboard response items
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

// Type for voter leaderboard response items
type VoterLeaderboardItem = Pick<
  Session,
  | "id"
  | "twitter_handle"
  | "total_votes"
  | "ship_votes"
  | "skip_votes"
  | "crowd_agreements"
  | "oracle_score"
  | "resolved_votes"
>;

const DEFAULT_LIMIT = 20;
const MIN_VOTES_YC_LEADERBOARD = 50;
const MIN_VOTES_USER_SUBMISSIONS = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "top") as LeaderboardType;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || DEFAULT_LIMIT), 100) : DEFAULT_LIMIT;

  // Validate type parameter
  const validTypes = ["top", "voted", "controversial", "biggest_misses", "biggest_fools", "favorites", "user_submissions", "voters", "most_ships"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Handle voters leaderboard separately (different table)
  if (type === "voters") {
    const voterSelectFields = "id, twitter_handle, total_votes, ship_votes, skip_votes, crowd_agreements, oracle_score, resolved_votes";

    const { data: voters, error: voterError } = await supabase
      .from("sessions")
      .select(voterSelectFields)
      .gte("total_votes", 1) // Only show users who have voted
      .order("total_votes", { ascending: false })
      .limit(limit)
      .returns<VoterLeaderboardItem[]>();

    if (voterError) {
      return NextResponse.json(
        { error: "Failed to fetch voters leaderboard" },
        { status: 500 }
      );
    }

    return NextResponse.json(voters ?? []);
  }

  // Handle most_ships leaderboard (ideas sorted by absolute ship votes count)
  if (type === "most_ships") {
    const { data: ideas, error: ideasError } = await supabase
      .from("ideas")
      .select(selectFields)
      .eq("is_active", true)
      .gte("total_votes", MIN_VOTES_YC_LEADERBOARD)
      .order("total_votes", { ascending: false })
      .limit(500)
      .returns<LeaderboardItem[]>();

    if (ideasError) {
      return NextResponse.json(
        { error: "Failed to fetch most ships leaderboard" },
        { status: 500 }
      );
    }

    // Calculate ship votes and sort by absolute count
    const sortedByShipVotes = (ideas ?? [])
      .map(idea => ({
        ...idea,
        ship_votes: Math.round(idea.total_votes * idea.ship_percentage / 100)
      }))
      .sort((a, b) => b.ship_votes - a.ship_votes)
      .slice(0, limit);

    return NextResponse.json(sortedByShipVotes);
  }

  // Ideas leaderboard types
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
      // Requires minimum 50 votes to appear
      // We'll sort in JS since Supabase doesn't support ABS() in order
      query = query.gte("total_votes", MIN_VOTES_YC_LEADERBOARD);
      break;

    case "biggest_misses":
      // Unicorns that got skipped the most (lowest ship_percentage)
      query = query
        .eq("source_outcome", "unicorn")
        .gte("total_votes", MIN_VOTES_YC_LEADERBOARD)
        .order("ship_percentage", { ascending: true });
      break;

    case "biggest_fools":
      // Dead companies that got shipped the most (highest ship_percentage)
      query = query
        .eq("source_outcome", "dead")
        .gte("total_votes", MIN_VOTES_YC_LEADERBOARD)
        .order("ship_percentage", { ascending: false });
      break;

    case "favorites":
      // Crowd Favorites - highest ship_percentage overall with minimum 50 votes
      query = query
        .gte("total_votes", MIN_VOTES_YC_LEADERBOARD)
        .order("ship_percentage", { ascending: false });
      break;

    case "user_submissions":
      // User-submitted ideas (not YC companies) with minimum 20 votes
      query = query
        .eq("source", "user")
        .gte("total_votes", MIN_VOTES_USER_SUBMISSIONS)
        .order("total_votes", { ascending: false });
      break;
  }

  const { data: ideas, error } = await query
    .limit(type === "controversial" ? 500 : limit) // Fetch more for controversial to sort client-side
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
      .slice(0, limit);
  }

  return NextResponse.json(results);
}
