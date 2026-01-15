import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Vote } from "@/lib/supabase/types";

type VoteCheck = Pick<Vote, "id" | "vote">;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ideaId = searchParams.get("idea_id");
  const sessionId = searchParams.get("session_id");

  if (!ideaId || !sessionId) {
    return NextResponse.json(
      { error: "idea_id and session_id are required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Check if vote exists
  const { data: votes, error } = await supabase
    .from("votes")
    .select("id, vote")
    .eq("idea_id", ideaId)
    .eq("session_id", sessionId)
    .limit(1)
    .returns<VoteCheck[]>();

  if (error) {
    return NextResponse.json(
      { error: "Failed to check vote" },
      { status: 500 }
    );
  }

  if (votes && votes.length > 0) {
    return NextResponse.json({
      has_voted: true,
      vote: votes[0].vote,
    });
  }

  return NextResponse.json({
    has_voted: false,
  });
}
