import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Vote, Idea, SourceOutcome } from "@/lib/supabase/types";

// Weighted distribution for outcome categories
// More engaging outcomes (unicorns, dead) shown more frequently
const OUTCOME_WEIGHTS: Record<NonNullable<SourceOutcome>, number> = {
  unicorn: 0.4,   // 40% - most engaging (success stories)
  dead: 0.3,      // 30% - second most engaging (failures to spot)
  acquired: 0.15, // 15% - interesting but less dramatic
  active: 0.15,   // 15% - no known outcome yet
};

/**
 * Select an idea using weighted random selection by source_outcome
 * Falls back to any available idea if the selected category is exhausted
 */
function selectWeightedIdea(ideas: Idea[]): Idea | null {
  if (ideas.length === 0) return null;

  // Group ideas by outcome
  const byOutcome: Record<string, Idea[]> = {
    unicorn: [],
    dead: [],
    acquired: [],
    active: [],
  };

  for (const idea of ideas) {
    const outcome = idea.source_outcome ?? "active";
    if (outcome in byOutcome) {
      byOutcome[outcome].push(idea);
    }
  }

  // Determine available outcomes (categories with at least one idea)
  const availableOutcomes = Object.keys(OUTCOME_WEIGHTS).filter(
    (outcome) => byOutcome[outcome].length > 0
  );

  if (availableOutcomes.length === 0) return null;

  // Adjust weights for available outcomes only
  const adjustedWeights: Record<string, number> = {};
  let totalWeight = 0;

  for (const outcome of availableOutcomes) {
    adjustedWeights[outcome] = OUTCOME_WEIGHTS[outcome as NonNullable<SourceOutcome>];
    totalWeight += adjustedWeights[outcome];
  }

  // Normalize weights
  for (const outcome of availableOutcomes) {
    adjustedWeights[outcome] /= totalWeight;
  }

  // Select outcome category using weighted random
  let randomValue = Math.random();
  let selectedOutcome = availableOutcomes[0];

  for (const outcome of availableOutcomes) {
    randomValue -= adjustedWeights[outcome];
    if (randomValue <= 0) {
      selectedOutcome = outcome;
      break;
    }
  }

  // Within the selected outcome, use weighted random by inverse vote count
  // (ideas with fewer votes get higher priority)
  const categoryIdeas = byOutcome[selectedOutcome];

  if (categoryIdeas.length === 1) {
    return categoryIdeas[0];
  }

  const weights = categoryIdeas.map((idea) => 1 / (idea.total_votes + 1));
  const categoryTotalWeight = weights.reduce((sum, w) => sum + w, 0);

  let categoryRandom = Math.random() * categoryTotalWeight;
  let selectedIdea = categoryIdeas[0];

  for (let i = 0; i < categoryIdeas.length; i++) {
    categoryRandom -= weights[i];
    if (categoryRandom <= 0) {
      selectedIdea = categoryIdeas[i];
      break;
    }
  }

  return selectedIdea;
}

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

  // Get all ideas from active pool that the user hasn't voted on yet
  // Only return ideas where is_in_active_pool=true
  const { data: ideas, error: ideasError } = votedIdeaIds.length > 0
    ? await supabase
        .from("ideas")
        .select("*")
        .eq("is_active", true)
        .eq("is_in_active_pool", true)
        .not("id", "in", `(${votedIdeaIds.join(",")})`)
        .returns<Idea[]>()
    : await supabase
        .from("ideas")
        .select("*")
        .eq("is_active", true)
        .eq("is_in_active_pool", true)
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

  // Select idea using weighted distribution by source_outcome
  const selectedIdea = selectWeightedIdea(ideas);

  if (!selectedIdea) {
    return NextResponse.json(
      { error: "No more ideas to vote on" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: selectedIdea.id,
    hero: selectedIdea.hero,
    subtitle: selectedIdea.subtitle,
  });
}
