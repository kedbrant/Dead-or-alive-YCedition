import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session, Vote } from "@/lib/supabase/types";
import { getOracleScoreBreakdown, MIN_RESOLVED_VOTES } from "@/lib/scoring";

interface StatsResponse {
  total_votes: number;
  ship_votes: number;
  skip_votes: number;
  crowd_agreements: number;
  ship_rate: number;
  crowd_agreement_rate: number;
  twitter_handle: string | null;
  // Oracle Score fields
  oracle_score: number | null;
  resolved_votes: number;
  correct_predictions: number;
  correct_ships: number;
  correct_skips: number;
  wrong_predictions: number;
  votes_until_oracle: number;
}

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("ship-or-skip-session")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "No session found" },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .limit(1)
    .returns<Session[]>();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }

  // If no session exists yet, return empty stats
  if (!sessions || sessions.length === 0) {
    const emptyStats: StatsResponse = {
      total_votes: 0,
      ship_votes: 0,
      skip_votes: 0,
      crowd_agreements: 0,
      ship_rate: 0,
      crowd_agreement_rate: 0,
      twitter_handle: null,
      oracle_score: null,
      resolved_votes: 0,
      correct_predictions: 0,
      correct_ships: 0,
      correct_skips: 0,
      wrong_predictions: 0,
      votes_until_oracle: MIN_RESOLVED_VOTES,
    };
    return NextResponse.json(emptyStats);
  }

  const session = sessions[0];

  const shipRate = session.total_votes > 0
    ? Math.round((session.ship_votes / session.total_votes) * 100)
    : 0;

  const crowdAgreementRate = session.total_votes > 0
    ? Math.round((session.crowd_agreements / session.total_votes) * 100)
    : 0;

  // Fetch user's votes to calculate Oracle Score
  const { data: votes } = await supabase
    .from("votes")
    .select("vote, is_correct, idea_outcome")
    .eq("session_id", sessionId)
    .returns<Pick<Vote, "vote" | "is_correct" | "idea_outcome">[]>();

  // Calculate Oracle Score breakdown
  const breakdown = getOracleScoreBreakdown(votes || []);
  const votesUntilOracle = Math.max(0, MIN_RESOLVED_VOTES - breakdown.resolvedVotes);

  const response: StatsResponse = {
    total_votes: session.total_votes,
    ship_votes: session.ship_votes,
    skip_votes: session.skip_votes,
    crowd_agreements: session.crowd_agreements,
    ship_rate: shipRate,
    crowd_agreement_rate: crowdAgreementRate,
    twitter_handle: session.twitter_handle,
    oracle_score: breakdown.oracleScore,
    resolved_votes: breakdown.resolvedVotes,
    correct_predictions: breakdown.correctPredictions,
    correct_ships: breakdown.correctShips,
    correct_skips: breakdown.correctSkips,
    wrong_predictions: breakdown.wrongPredictions,
    votes_until_oracle: votesUntilOracle,
  };

  return NextResponse.json(response);
}
