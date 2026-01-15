import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Vote, Idea, Session, VoteInsert, SessionInsert, IdeaUpdate, SessionUpdate } from "@/lib/supabase/types";

interface VoteRequestBody {
  idea_id: string;
  vote: "ship" | "skip";
  session_id: string;
}

interface VoteResponse {
  ship_percentage: number;
  total_votes: number;
  user_agreed_with_crowd: boolean;
  source_company?: string | null;
  source_outcome?: string | null;
  submitter_twitter?: string | null;
  link?: string | null;
  // YC company fields for reveal
  yc_name?: string | null;
  yc_logo_url?: string | null;
  yc_slug?: string | null;
  source?: string | null;
}

export async function POST(request: NextRequest) {
  let body: VoteRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { idea_id, vote, session_id } = body;

  // Validate required fields
  if (!idea_id || !vote || !session_id) {
    return NextResponse.json(
      { error: "idea_id, vote, and session_id are required" },
      { status: 400 }
    );
  }

  if (vote !== "ship" && vote !== "skip") {
    return NextResponse.json(
      { error: "vote must be 'ship' or 'skip'" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Check if this session has already voted on this idea
  const { data: existingVotes, error: existingVoteError } = await supabase
    .from("votes")
    .select("*")
    .eq("idea_id", idea_id)
    .eq("session_id", session_id)
    .limit(1)
    .returns<Vote[]>();

  if (existingVoteError) {
    return NextResponse.json(
      { error: "Failed to check existing vote" },
      { status: 500 }
    );
  }

  const existingVote = existingVotes && existingVotes.length > 0 ? existingVotes[0] : null;

  // Get the idea data
  const { data: ideas, error: ideaError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", idea_id)
    .limit(1)
    .returns<Idea[]>();

  if (ideaError || !ideas || ideas.length === 0) {
    return NextResponse.json(
      { error: "Idea not found" },
      { status: 404 }
    );
  }

  const idea = ideas[0];

  // If already voted, return existing results without recording again
  if (existingVote) {
    const userVotedShip = existingVote.vote === "ship";
    const crowdVotedShip = idea.ship_percentage >= 50;
    const userAgreedWithCrowd = userVotedShip === crowdVotedShip;

    const response: VoteResponse = {
      ship_percentage: idea.ship_percentage,
      total_votes: idea.total_votes,
      user_agreed_with_crowd: userAgreedWithCrowd,
      source_company: idea.source_company,
      source_outcome: idea.source_outcome,
      submitter_twitter: idea.submitter_twitter,
      link: idea.link,
      yc_name: idea.yc_name,
      yc_logo_url: idea.yc_logo_url,
      yc_slug: idea.yc_slug,
      source: idea.source,
    };

    return NextResponse.json(response);
  }

  // Record the new vote (use fresh client to avoid type inference issues)
  const writeClient = createServerSupabaseClient();
  const voteInsert: VoteInsert = {
    idea_id,
    session_id,
    vote,
  };
  const { error: insertVoteError } = await writeClient
    .from("votes")
    .insert(voteInsert);

  if (insertVoteError) {
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }

  // Calculate new idea stats
  const newShipCount = vote === "ship" ? idea.ship_count + 1 : idea.ship_count;
  const newSkipCount = vote === "skip" ? idea.skip_count + 1 : idea.skip_count;
  const newTotalVotes = idea.total_votes + 1;
  const newShipPercentage = Math.round((newShipCount / newTotalVotes) * 100);

  // Update idea stats
  const ideaUpdate: IdeaUpdate = {
    ship_count: newShipCount,
    skip_count: newSkipCount,
    total_votes: newTotalVotes,
    ship_percentage: newShipPercentage,
  };
  const { error: updateIdeaError } = await writeClient
    .from("ideas")
    .update(ideaUpdate)
    .eq("id", idea_id);

  if (updateIdeaError) {
    return NextResponse.json(
      { error: "Failed to update idea stats" },
      { status: 500 }
    );
  }

  // Determine if user agreed with crowd (using new stats)
  const userVotedShip = vote === "ship";
  const crowdVotedShip = newShipPercentage >= 50;
  const userAgreedWithCrowd = userVotedShip === crowdVotedShip;

  // Update or create session stats
  const { data: existingSessions, error: sessionFetchError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", session_id)
    .limit(1)
    .returns<Session[]>();

  if (sessionFetchError) {
    // Non-critical error - we can still return the vote result
    console.error("Failed to fetch session:", sessionFetchError);
  }

  const existingSession = existingSessions && existingSessions.length > 0 ? existingSessions[0] : null;

  if (existingSession) {
    // Update existing session
    const sessionUpdate: SessionUpdate = {
      total_votes: existingSession.total_votes + 1,
      ship_votes: existingSession.ship_votes + (vote === "ship" ? 1 : 0),
      skip_votes: existingSession.skip_votes + (vote === "skip" ? 1 : 0),
      crowd_agreements: existingSession.crowd_agreements + (userAgreedWithCrowd ? 1 : 0),
      last_activity_at: new Date().toISOString(),
    };
    const { error: updateSessionError } = await writeClient
      .from("sessions")
      .update(sessionUpdate)
      .eq("id", session_id);

    if (updateSessionError) {
      console.error("Failed to update session:", updateSessionError);
    }
  } else {
    // Create new session
    const sessionInsert: SessionInsert = {
      id: session_id,
      total_votes: 1,
      ship_votes: vote === "ship" ? 1 : 0,
      skip_votes: vote === "skip" ? 1 : 0,
      crowd_agreements: userAgreedWithCrowd ? 1 : 0,
      last_activity_at: new Date().toISOString(),
    };
    const { error: insertSessionError } = await writeClient
      .from("sessions")
      .insert(sessionInsert);

    if (insertSessionError) {
      console.error("Failed to create session:", insertSessionError);
    }
  }

  const response: VoteResponse = {
    ship_percentage: newShipPercentage,
    total_votes: newTotalVotes,
    user_agreed_with_crowd: userAgreedWithCrowd,
    source_company: idea.source_company,
    source_outcome: idea.source_outcome,
    submitter_twitter: idea.submitter_twitter,
    link: idea.link,
    yc_name: idea.yc_name,
    yc_logo_url: idea.yc_logo_url,
    yc_slug: idea.yc_slug,
    source: idea.source,
  };

  return NextResponse.json(response);
}
