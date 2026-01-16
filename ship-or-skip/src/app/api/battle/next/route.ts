import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea, BattleVote } from "@/lib/supabase/types";

/**
 * Battle company data returned to the client
 * Contains only the fields needed for display (no outcome reveal before voting)
 */
interface BattleCompany {
  id: string;
  hero: string;
  subtitle: string;
  yc_batch: string | null;
  yc_industry: string | null;
  yc_slug: string | null;
}

/**
 * Battle response containing two companies to compare
 */
interface BattleResponse {
  left: BattleCompany;
  right: BattleCompany;
  correct_answer: "left" | "right";
  battle_id: string; // Used to identify this battle when submitting vote
}

/**
 * GET /api/battle/next
 * Returns a battle matchup: winner (unicorn/acquired) vs loser (dead)
 * Randomizes left/right position
 * Excludes battles the session has already seen
 */
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

  // Get all battle pairs this session has already seen
  const { data: seenBattles, error: battlesError } = await supabase
    .from("battle_votes")
    .select("winner_idea_id, loser_idea_id")
    .eq("session_id", sessionId)
    .returns<Pick<BattleVote, "winner_idea_id" | "loser_idea_id">[]>();

  if (battlesError) {
    return NextResponse.json(
      { error: "Failed to fetch battle history" },
      { status: 500 }
    );
  }

  // Create set of seen pair keys for quick lookup
  const seenPairs = new Set<string>();
  for (const battle of seenBattles ?? []) {
    // Store both orderings since we track winner/loser not left/right
    seenPairs.add(`${battle.winner_idea_id}-${battle.loser_idea_id}`);
    seenPairs.add(`${battle.loser_idea_id}-${battle.winner_idea_id}`);
  }

  // Get winners (unicorns and acquired companies) from active pool
  const { data: winners, error: winnersError } = await supabase
    .from("ideas")
    .select("id, hero, subtitle, yc_batch, yc_industry, yc_slug")
    .eq("is_active", true)
    .eq("is_in_active_pool", true)
    .in("source_outcome", ["unicorn", "acquired"])
    .returns<Pick<Idea, "id" | "hero" | "subtitle" | "yc_batch" | "yc_industry" | "yc_slug">[]>();

  if (winnersError) {
    return NextResponse.json(
      { error: "Failed to fetch winner companies" },
      { status: 500 }
    );
  }

  // Get losers (dead companies) from active pool
  const { data: losers, error: losersError } = await supabase
    .from("ideas")
    .select("id, hero, subtitle, yc_batch, yc_industry, yc_slug")
    .eq("is_active", true)
    .eq("is_in_active_pool", true)
    .eq("source_outcome", "dead")
    .returns<Pick<Idea, "id" | "hero" | "subtitle" | "yc_batch" | "yc_industry" | "yc_slug">[]>();

  if (losersError) {
    return NextResponse.json(
      { error: "Failed to fetch loser companies" },
      { status: 500 }
    );
  }

  if (!winners || winners.length === 0 || !losers || losers.length === 0) {
    return NextResponse.json(
      { error: "Not enough companies for battle matchups" },
      { status: 404 }
    );
  }

  // Find an unseen pair
  let selectedWinner: typeof winners[0] | null = null;
  let selectedLoser: typeof losers[0] | null = null;

  // Shuffle arrays for randomness
  const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
  const shuffledLosers = [...losers].sort(() => Math.random() - 0.5);

  // Find first unseen pair
  for (const winner of shuffledWinners) {
    for (const loser of shuffledLosers) {
      const pairKey = `${winner.id}-${loser.id}`;
      if (!seenPairs.has(pairKey)) {
        selectedWinner = winner;
        selectedLoser = loser;
        break;
      }
    }
    if (selectedWinner) break;
  }

  if (!selectedWinner || !selectedLoser) {
    return NextResponse.json(
      { error: "No more battle matchups available" },
      { status: 404 }
    );
  }

  // Randomize left/right position (50/50 chance)
  const winnerOnLeft = Math.random() < 0.5;

  const left: BattleCompany = winnerOnLeft
    ? {
        id: selectedWinner.id,
        hero: selectedWinner.hero,
        subtitle: selectedWinner.subtitle,
        yc_batch: selectedWinner.yc_batch,
        yc_industry: selectedWinner.yc_industry,
        yc_slug: selectedWinner.yc_slug,
      }
    : {
        id: selectedLoser.id,
        hero: selectedLoser.hero,
        subtitle: selectedLoser.subtitle,
        yc_batch: selectedLoser.yc_batch,
        yc_industry: selectedLoser.yc_industry,
        yc_slug: selectedLoser.yc_slug,
      };

  const right: BattleCompany = winnerOnLeft
    ? {
        id: selectedLoser.id,
        hero: selectedLoser.hero,
        subtitle: selectedLoser.subtitle,
        yc_batch: selectedLoser.yc_batch,
        yc_industry: selectedLoser.yc_industry,
        yc_slug: selectedLoser.yc_slug,
      }
    : {
        id: selectedWinner.id,
        hero: selectedWinner.hero,
        subtitle: selectedWinner.subtitle,
        yc_batch: selectedWinner.yc_batch,
        yc_industry: selectedWinner.yc_industry,
        yc_slug: selectedWinner.yc_slug,
      };

  const correct_answer: "left" | "right" = winnerOnLeft ? "left" : "right";

  // Generate a unique battle ID for this matchup (used when submitting vote)
  const battle_id = `${selectedWinner.id}:${selectedLoser.id}:${correct_answer}`;

  const response: BattleResponse = {
    left,
    right,
    correct_answer,
    battle_id,
  };

  return NextResponse.json(response);
}
