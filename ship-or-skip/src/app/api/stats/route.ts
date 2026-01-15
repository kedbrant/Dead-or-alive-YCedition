import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/supabase/types";

interface StatsResponse {
  total_votes: number;
  ship_votes: number;
  skip_votes: number;
  crowd_agreements: number;
  ship_rate: number;
  crowd_agreement_rate: number;
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

  const response: StatsResponse = {
    total_votes: session.total_votes,
    ship_votes: session.ship_votes,
    skip_votes: session.skip_votes,
    crowd_agreements: session.crowd_agreements,
    ship_rate: shipRate,
    crowd_agreement_rate: crowdAgreementRate,
  };

  return NextResponse.json(response);
}
