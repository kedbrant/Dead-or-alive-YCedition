import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/supabase/types";
import { MIN_RESOLVED_VOTES } from "@/lib/scoring";

interface CompareResponse {
  user_oracle_score: number | null;
  user_resolved_votes: number;
  percentile_rank: number | null;
  average_oracle_score: number | null;
  total_qualified_players: number;
  is_qualified: boolean;
}

/**
 * GET /api/stats/compare
 * Returns percentile rankings and comparison data for the user's Oracle Score
 */
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("ship-or-skip-session")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "No session found" },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Get user's session data
  const { data: userSession, error: userError } = await supabase
    .from("sessions")
    .select("oracle_score, resolved_votes")
    .eq("id", sessionId)
    .single<Pick<Session, "oracle_score" | "resolved_votes">>();

  if (userError && userError.code !== "PGRST116") {
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }

  const userOracleScore = userSession?.oracle_score ?? null;
  const userResolvedVotes = userSession?.resolved_votes ?? 0;
  const isQualified = userResolvedVotes >= MIN_RESOLVED_VOTES;

  // Get all qualified players (10+ resolved votes) for comparison
  const { data: qualifiedPlayers, error: playersError } = await supabase
    .from("sessions")
    .select("oracle_score")
    .gte("resolved_votes", MIN_RESOLVED_VOTES)
    .not("oracle_score", "is", null)
    .returns<Pick<Session, "oracle_score">[]>();

  if (playersError) {
    return NextResponse.json(
      { error: "Failed to fetch comparison data" },
      { status: 500 }
    );
  }

  const players = qualifiedPlayers ?? [];
  const totalQualifiedPlayers = players.length;

  // Calculate percentile rank and average
  let percentileRank: number | null = null;
  let averageOracleScore: number | null = null;

  if (totalQualifiedPlayers > 0) {
    // Calculate average Oracle Score
    const sum = players.reduce((acc, p) => acc + (p.oracle_score ?? 0), 0);
    averageOracleScore = Math.round((sum / totalQualifiedPlayers) * 10) / 10;

    // Calculate percentile if user is qualified
    if (isQualified && userOracleScore !== null) {
      // Count how many players have a lower score than the user
      const playersWithLowerScore = players.filter(
        (p) => (p.oracle_score ?? 0) < userOracleScore
      ).length;

      // Percentile = (users with lower score / total users) * 100
      percentileRank = Math.round((playersWithLowerScore / totalQualifiedPlayers) * 100);
    }
  }

  const response: CompareResponse = {
    user_oracle_score: userOracleScore,
    user_resolved_votes: userResolvedVotes,
    percentile_rank: percentileRank,
    average_oracle_score: averageOracleScore,
    total_qualified_players: totalQualifiedPlayers,
    is_qualified: isQualified,
  };

  return NextResponse.json(response);
}
