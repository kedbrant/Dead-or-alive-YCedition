import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Vote, Idea } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Get all idea IDs this session has already voted on
  const { data: votedIdeas, error: votesError } = await supabase
    .from("votes")
    .select("*")
    .eq("session_id", sessionId)
    .returns<Vote[]>();

  if (votesError) {
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }

  const votedIdeaIds = (votedIdeas ?? []).map((v) => v.idea_id);

  // Get all active ideas the user hasn't voted on yet
  // Order by total_votes ascending to prioritize ideas with fewer votes (balancing)
  const { data: ideas, error: ideasError } = votedIdeaIds.length > 0
    ? await supabase
        .from("ideas")
        .select("*")
        .eq("is_active", true)
        .not("id", "in", `(${votedIdeaIds.join(",")})`)
        .order("total_votes", { ascending: true })
        .returns<Idea[]>()
    : await supabase
        .from("ideas")
        .select("*")
        .eq("is_active", true)
        .order("total_votes", { ascending: true })
        .returns<Idea[]>();

  if (ideasError) {
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }

  if (!ideas || ideas.length === 0) {
    return NextResponse.json(
      { error: "No more ideas to vote on" },
      { status: 404 }
    );
  }

  // Weighted random selection: ideas with fewer votes have higher chance
  // Use inverse weight (1 / (total_votes + 1)) to avoid division by zero
  const weights = ideas.map((idea) => 1 / (idea.total_votes + 1));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let randomValue = Math.random() * totalWeight;
  let selectedIdea = ideas[0];

  for (let i = 0; i < ideas.length; i++) {
    randomValue -= weights[i];
    if (randomValue <= 0) {
      selectedIdea = ideas[i];
      break;
    }
  }

  return NextResponse.json({
    id: selectedIdea.id,
    hero: selectedIdea.hero,
    subtitle: selectedIdea.subtitle,
  });
}
