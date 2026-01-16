"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { BattleCard } from "@/components/battle/battle-card";
import { BattleResult } from "@/components/battle/battle-result";
import { SourceOutcome } from "@/lib/supabase/types";

interface BattleCompany {
  id: string;
  hero: string;
  subtitle: string;
  yc_batch: string | null;
  yc_industry: string | null;
  yc_slug: string | null;
}

interface BattleData {
  left: BattleCompany;
  right: BattleCompany;
  correct_answer: "left" | "right";
  battle_id: string;
}

interface BattleResultData {
  is_correct: boolean;
  correct_answer: "left" | "right";
  left: {
    id: string;
    hero: string;
    yc_name: string | null;
    yc_logo_url: string | null;
    yc_slug: string | null;
    source_outcome: SourceOutcome;
    isWinner: boolean;
  };
  right: {
    id: string;
    hero: string;
    yc_name: string | null;
    yc_logo_url: string | null;
    yc_slug: string | null;
    source_outcome: SourceOutcome;
    isWinner: boolean;
  };
  crowd_accuracy: number;
}

interface BattleClientProps {
  sessionId: string;
}

export function BattleClient({ sessionId }: BattleClientProps) {
  const [battle, setBattle] = useState<BattleData | null>(null);
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null);
  const [result, setResult] = useState<BattleResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noBattles, setNoBattles] = useState(false);

  const fetchBattle = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedSide(null);

    try {
      const response = await fetch(`/api/battle/next?session_id=${sessionId}`);
      if (response.status === 404) {
        setNoBattles(true);
        setBattle(null);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch battle");
      }
      const data: BattleData = await response.json();
      setBattle(data);
      setNoBattles(false);
    } catch {
      setError("Failed to load battle. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle]);

  const handleSelectSide = (side: "left" | "right") => {
    if (voting || result) return;
    setSelectedSide(side);
  };

  const handleSubmitVote = async () => {
    if (!battle || !selectedSide || voting) return;

    setVoting(true);
    setError(null);

    try {
      const response = await fetch("/api/battle/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          battle_id: battle.battle_id,
          user_choice: selectedSide,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      const data: BattleResultData = await response.json();
      setResult(data);
    } catch {
      setError("Failed to submit vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  const handleNextBattle = () => {
    fetchBattle();
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading battle...</p>
        </div>
      </main>
    );
  }

  // No more battles state
  if (noBattles) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold mb-2">Battle Champion!</h1>
          <p className="text-foreground/70 mb-6">
            You&apos;ve completed all available battles. Check back later for more matchups!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/vote"
              className="px-6 py-3 bg-ship text-white font-semibold rounded-full hover:bg-ship/90 transition-all"
            >
              Try Ship or Skip
            </Link>
            <Link
              href="/leaderboard"
              className="px-6 py-3 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-all"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error && !battle) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-skip mb-4">{error}</p>
          <button
            onClick={fetchBattle}
            className="px-6 py-2 bg-foreground/10 rounded-full hover:bg-foreground/20 transition-all"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Show result
  if (result) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <BattleResult
          left={result.left}
          right={result.right}
          userChoice={selectedSide!}
          isCorrect={result.is_correct}
          crowdAccuracy={result.crowd_accuracy}
          onNext={handleNextBattle}
        />
      </main>
    );
  }

  // Show battle
  if (!battle) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Question */}
        <h1 className="text-2xl font-bold text-center mb-8">
          Which startup was more successful?
        </h1>

        {/* Battle cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <BattleCard
            hero={battle.left.hero}
            subtitle={battle.left.subtitle}
            yc_batch={battle.left.yc_batch}
            yc_industry={battle.left.yc_industry}
            isSelected={selectedSide === "left"}
            onClick={() => handleSelectSide("left")}
            disabled={voting}
          />
          <BattleCard
            hero={battle.right.hero}
            subtitle={battle.right.subtitle}
            yc_batch={battle.right.yc_batch}
            yc_industry={battle.right.yc_industry}
            isSelected={selectedSide === "right"}
            onClick={() => handleSelectSide("right")}
            disabled={voting}
          />
        </div>

        {/* VS indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-foreground/10 font-bold text-foreground/50">
            VS
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-center text-skip mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmitVote}
            disabled={!selectedSide || voting}
            className={`
              px-8 py-3 font-semibold rounded-full transition-all duration-150
              ${selectedSide
                ? "bg-ship text-white hover:bg-ship/90 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
              }
            `}
          >
            {voting ? "Submitting..." : selectedSide ? "Confirm Choice" : "Select a Company"}
          </button>
        </div>

        {/* Help text */}
        <p className="text-center text-foreground/50 text-sm mt-4">
          Click on a card to select it, then confirm your choice
        </p>
      </div>
    </main>
  );
}
