"use client";

import { useState, useEffect, useCallback } from "react";
import { VoteButtons, VoteType } from "./vote-buttons";

interface CompanyVoteCtaProps {
  ideaId: string;
  companyName: string;
  sessionId: string;
  initialShipPercentage: number;
}

interface VoteResult {
  ship_percentage: number;
  total_votes: number;
  user_agreed_with_crowd: boolean;
}

export function CompanyVoteCta({
  ideaId,
  companyName,
  sessionId,
  initialShipPercentage,
}: CompanyVoteCtaProps) {
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [shipPercentage, setShipPercentage] = useState(initialShipPercentage);

  const checkVoteStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/ideas/vote/check?idea_id=${ideaId}&session_id=${sessionId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.has_voted) {
          setHasVoted(true);
          setUserVote(data.vote);
        }
      }
    } catch {
      // Silently fail - user can try voting
    } finally {
      setLoading(false);
    }
  }, [ideaId, sessionId]);

  useEffect(() => {
    checkVoteStatus();
  }, [checkVoteStatus]);

  const handleVote = async (vote: VoteType) => {
    if (voting || hasVoted) return;

    setVoting(true);
    setUserVote(vote);

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea_id: ideaId,
          vote,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record vote");
      }

      const result = await response.json();
      setVoteResult(result);
      setHasVoted(true);
      setShipPercentage(result.ship_percentage);

      // Dispatch event to update navbar Oracle Score
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("oracle-score-update"));
      }
    } catch {
      // Vote failed - user can try again
      setUserVote(null);
    } finally {
      setVoting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-foreground/10 rounded w-2/3 mx-auto mb-4" />
        <div className="h-14 bg-foreground/10 rounded w-full" />
      </div>
    );
  }

  // Already voted state
  if (hasVoted) {
    const userAgreed =
      (userVote === "ship" && shipPercentage >= 50) ||
      (userVote === "skip" && shipPercentage < 50);

    return (
      <div className="bg-surface rounded-2xl p-6 text-center">
        <div className="text-foreground/60 mb-3">Your vote</div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
              userVote === "ship"
                ? "bg-ship/20 text-ship"
                : "bg-skip/20 text-skip"
            }`}
          >
            {userVote === "ship" ? "🚀 Shipped" : "💀 Skipped"}
          </span>
        </div>
        <p className="text-sm text-foreground/60">
          {userAgreed ? (
            <span className="text-ship">✓ You agreed with the crowd</span>
          ) : (
            <span className="text-skip">✗ You went against the crowd</span>
          )}
        </p>
        {voteResult && (
          <p className="text-xs text-foreground/40 mt-2">
            Updated: {voteResult.ship_percentage}% ship · {voteResult.total_votes.toLocaleString()} votes
          </p>
        )}
      </div>
    );
  }

  // Vote CTA state
  return (
    <div className="bg-surface rounded-2xl p-6">
      <h2 className="text-lg font-bold text-center mb-4">
        Would you have shipped {companyName}?
      </h2>
      <VoteButtons onVote={handleVote} disabled={voting} />
      {voting && (
        <p className="text-center text-foreground/60 mt-4 animate-pulse">
          Recording your vote...
        </p>
      )}
    </div>
  );
}
