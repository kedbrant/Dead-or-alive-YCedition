import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea, BattleVoteInsert, BattleVote } from "@/lib/supabase/types";

interface BattleVoteRequest {
  session_id: string;
  battle_id: string; // Format: "winner_id:loser_id:correct_answer"
  user_choice: "left" | "right";
}

interface BattleVoteResponse {
  is_correct: boolean;
  correct_answer: "left" | "right";
  left: {
    id: string;
    hero: string;
    yc_name: string | null;
    yc_logo_url: string | null;
    yc_slug: string | null;
    source_outcome: string | null;
    isWinner: boolean;
  };
  right: {
    id: string;
    hero: string;
    yc_name: string | null;
    yc_logo_url: string | null;
    yc_slug: string | null;
    source_outcome: string | null;
    isWinner: boolean;
  };
  crowd_accuracy: number;
}

/**
 * POST /api/battle/vote
 * Records a battle vote and returns the result with company reveal
 */
export async function POST(request: NextRequest) {
  let body: BattleVoteRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { session_id, battle_id, user_choice } = body;

  if (!session_id || !battle_id || !user_choice) {
    return NextResponse.json(
      { error: "session_id, battle_id, and user_choice are required" },
      { status: 400 }
    );
  }

  if (user_choice !== "left" && user_choice !== "right") {
    return NextResponse.json(
      { error: "user_choice must be 'left' or 'right'" },
      { status: 400 }
    );
  }

  // Parse battle_id: "winner_id:loser_id:correct_answer"
  const parts = battle_id.split(":");
  if (parts.length !== 3) {
    return NextResponse.json(
      { error: "Invalid battle_id format" },
      { status: 400 }
    );
  }

  const [winner_idea_id, loser_idea_id, correct_answer] = parts;

  if (correct_answer !== "left" && correct_answer !== "right") {
    return NextResponse.json(
      { error: "Invalid correct_answer in battle_id" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Fetch both companies
  const { data: companies, error: companiesError } = await supabase
    .from("ideas")
    .select("id, hero, yc_name, yc_logo_url, yc_slug, source_outcome")
    .in("id", [winner_idea_id, loser_idea_id])
    .returns<Pick<Idea, "id" | "hero" | "yc_name" | "yc_logo_url" | "yc_slug" | "source_outcome">[]>();

  if (companiesError || !companies || companies.length !== 2) {
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }

  const winner = companies.find((c) => c.id === winner_idea_id);
  const loser = companies.find((c) => c.id === loser_idea_id);

  if (!winner || !loser) {
    return NextResponse.json(
      { error: "Companies not found" },
      { status: 404 }
    );
  }

  // Determine which side the winner is on
  const winnerOnLeft = correct_answer === "left";
  const is_correct = user_choice === correct_answer;

  // Record the vote
  const battleVote: BattleVoteInsert = {
    session_id,
    winner_idea_id,
    loser_idea_id,
    user_choice,
    correct_answer: correct_answer as "left" | "right",
    is_correct,
  };

  const { error: insertError } = await supabase
    .from("battle_votes")
    .insert(battleVote);

  if (insertError) {
    // Ignore duplicate constraint errors (user already voted on this pair)
    if (!insertError.message.includes("unique_battle_pair")) {
      return NextResponse.json(
        { error: "Failed to record vote" },
        { status: 500 }
      );
    }
  }

  // Calculate crowd accuracy for this battle pair
  const { data: battleStats, error: statsError } = await supabase
    .from("battle_votes")
    .select("is_correct")
    .eq("winner_idea_id", winner_idea_id)
    .eq("loser_idea_id", loser_idea_id)
    .returns<Pick<BattleVote, "is_correct">[]>();

  let crowd_accuracy = 50; // Default if no stats
  if (!statsError && battleStats && battleStats.length > 0) {
    const correctCount = battleStats.filter((v) => v.is_correct).length;
    crowd_accuracy = (correctCount / battleStats.length) * 100;
  }

  const response: BattleVoteResponse = {
    is_correct,
    correct_answer: correct_answer as "left" | "right",
    left: winnerOnLeft
      ? {
          id: winner.id,
          hero: winner.hero,
          yc_name: winner.yc_name,
          yc_logo_url: winner.yc_logo_url,
          yc_slug: winner.yc_slug,
          source_outcome: winner.source_outcome,
          isWinner: true,
        }
      : {
          id: loser.id,
          hero: loser.hero,
          yc_name: loser.yc_name,
          yc_logo_url: loser.yc_logo_url,
          yc_slug: loser.yc_slug,
          source_outcome: loser.source_outcome,
          isWinner: false,
        },
    right: winnerOnLeft
      ? {
          id: loser.id,
          hero: loser.hero,
          yc_name: loser.yc_name,
          yc_logo_url: loser.yc_logo_url,
          yc_slug: loser.yc_slug,
          source_outcome: loser.source_outcome,
          isWinner: false,
        }
      : {
          id: winner.id,
          hero: winner.hero,
          yc_name: winner.yc_name,
          yc_logo_url: winner.yc_logo_url,
          yc_slug: winner.yc_slug,
          source_outcome: winner.source_outcome,
          isWinner: true,
        },
    crowd_accuracy,
  };

  return NextResponse.json(response);
}
