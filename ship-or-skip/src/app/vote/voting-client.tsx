"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IdeaCard, CardAnimationState } from "@/components/voting/idea-card";
import { VoteButtons, VoteType } from "@/components/voting/vote-buttons";
import { RevealOverlay } from "@/components/voting/reveal-overlay";
import { SwipeContainer } from "@/components/voting/swipe-container";

interface Idea {
  id: string;
  hero: string;
  subtitle: string;
  source: string;
  yc_batch: string | null;
  yc_industry: string | null;
}

interface VoteResult {
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

interface VotingClientProps {
  sessionId: string;
}

export function VotingClient({ sessionId }: VotingClientProps) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [noMoreIdeas, setNoMoreIdeas] = useState(false);
  const [cardAnimationState, setCardAnimationState] = useState<CardAnimationState>("visible");
  const [showResults, setShowResults] = useState(false);
  const [resultsExiting, setResultsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextIdea = useCallback(async () => {
    setLoading(true);
    setVoteResult(null);
    setUserVote(null);
    setShowResults(false);
    setResultsExiting(false);
    setCardAnimationState("visible");
    setError(null);

    try {
      const response = await fetch(`/api/ideas/next?session_id=${sessionId}`);

      if (response.status === 404) {
        setNoMoreIdeas(true);
        setIdea(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch idea");
      }

      const data = await response.json();
      setIdea(data);
      setNoMoreIdeas(false);
      // Trigger entrance animation
      setCardAnimationState("entering");
    } catch {
      setError("Failed to load ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchNextIdea();
  }, [fetchNextIdea]);

  const handleVote = useCallback(async (vote: VoteType) => {
    if (!idea || voting) return;

    setVoting(true);
    setUserVote(vote);

    // Trigger exit animation based on vote direction
    setCardAnimationState(vote === "ship" ? "exiting-ship" : "exiting-skip");

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea_id: idea.id,
          vote,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record vote");
      }

      const result = await response.json();
      setVoteResult(result);

      // Dispatch event to update Oracle Score in navbar
      window.dispatchEvent(new CustomEvent("oracle-score-update"));

      // Wait for exit animation (250ms) then show results
      setTimeout(() => {
        setShowResults(true);
      }, 250);
    } catch {
      setError("Failed to record vote. Please try again.");
      setUserVote(null);
      setCardAnimationState("visible");
    } finally {
      setVoting(false);
    }
  }, [idea, voting, sessionId]);

  const handleNext = useCallback(() => {
    // Trigger exit animation first
    setResultsExiting(true);
    // Wait for animation to complete, then fetch next
    setTimeout(() => {
      fetchNextIdea();
    }, 200);
  }, [fetchNextIdea]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!idea) return;

      // On results page: arrow keys or Enter/Space to go next
      if (showResults) {
        if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      // On voting page: left/right arrows to vote
      if (voting) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleVote("skip");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleVote("ship");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [voting, showResults, idea, handleVote, handleNext]);

  const handleShare = () => {
    if (!idea || !voteResult || !userVote) return;

    const isYcCompany = voteResult.source === "yc";
    const companyName = isYcCompany && voteResult.yc_name ? voteResult.yc_name : (voteResult.source_company || "this startup");
    const voteAction = userVote === "ship" ? "shipped" : "skipped";

    // Generate outcome text for YC companies
    let outcomeText = "";
    if (isYcCompany && voteResult.source_outcome) {
      switch (voteResult.source_outcome) {
        case "unicorn":
          outcomeText = " - it became a UNICORN! 🦄";
          break;
        case "acquired":
          outcomeText = " - it got ACQUIRED! 💰";
          break;
        case "dead":
          outcomeText = " - it's DEAD! 💀";
          break;
        case "active":
          outcomeText = " - it's still ACTIVE! 🚀";
          break;
      }
    }

    const text = `I ${voteAction} ${companyName} on Ship or Skip${outcomeText}

Test your predictions → `;
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    if (navigator.share) {
      navigator.share({
        title: "Ship or Skip",
        text,
        url,
      }).catch(() => {
        // User cancelled or share failed
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `${text}${url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        // Could show a toast here if we had one
      }).catch(() => {});
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-foreground/10 rounded w-3/4 mx-auto mb-4" />
            <div className="h-5 bg-foreground/10 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !idea) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-[24px] font-bold mb-4">Something went wrong</h2>
          <p className="text-[16px] text-foreground/80 mb-6">{error}</p>
          <button
            onClick={fetchNextIdea}
            className="inline-block px-8 py-4 bg-ship text-white font-bold text-lg rounded-xl
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No more ideas state
  if (noMoreIdeas) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <h2 className="text-[32px] font-bold mb-4">🎉 All done!</h2>
          <p className="text-[18px] text-foreground/80 mb-8">
            You&apos;ve voted on all available ideas. Check back later for more!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-ship text-white font-bold text-lg rounded-xl
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Main voting UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      {/* Inline error banner */}
      {error && idea && (
        <div className="w-full max-w-[480px] mx-auto bg-skip/10 border border-skip/30 rounded-xl p-4 text-center">
          <p className="text-skip text-sm">{error}</p>
        </div>
      )}

      {idea && !showResults && (
        <>
          <SwipeContainer onSwipe={handleVote} disabled={voting}>
            <IdeaCard idea={idea} animationState={cardAnimationState} />
          </SwipeContainer>
          <VoteButtons onVote={handleVote} disabled={voting} />
        </>
      )}

      {idea && voteResult && userVote && showResults && (
        <RevealOverlay
          shipPercentage={voteResult.ship_percentage}
          totalVotes={voteResult.total_votes}
          userVote={userVote}
          userAgreedWithCrowd={voteResult.user_agreed_with_crowd}
          sourceCompany={voteResult.source_company}
          sourceOutcome={voteResult.source_outcome}
          submitterTwitter={voteResult.submitter_twitter}
          link={voteResult.link}
          isExiting={resultsExiting}
          onNext={handleNext}
          onShare={handleShare}
          ycName={voteResult.yc_name}
          ycLogoUrl={voteResult.yc_logo_url}
          ycSlug={voteResult.yc_slug}
          source={voteResult.source}
        />
      )}
    </div>
  );
}
