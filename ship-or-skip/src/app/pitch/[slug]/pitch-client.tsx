"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IdeaCard, CardAnimationState } from "@/components/voting/idea-card";
import { VoteButtons, VoteType } from "@/components/voting/vote-buttons";
import { SwipeContainer } from "@/components/voting/swipe-container";

interface PitchData {
  id: string;
  hero: string;
  subtitle: string;
  submitter_twitter: string | null;
  ship_percentage: number;
  total_votes: number;
  created_at: string;
}

interface VoteResult {
  ship_percentage: number;
  total_votes: number;
  user_agreed_with_crowd: boolean;
}

interface PitchClientProps {
  slug: string;
  sessionId: string;
}

export function PitchClient({ slug, sessionId }: PitchClientProps) {
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [cardAnimationState, setCardAnimationState] = useState<CardAnimationState>("visible");

  const fetchPitch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pitch/${slug}`);

      if (response.status === 404) {
        setError("Pitch not found");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch pitch");
      }

      const data: PitchData = await response.json();
      setPitch(data);
      // Trigger entrance animation
      setCardAnimationState("entering");

      // Check if user has already voted on this idea
      const voteCheckResponse = await fetch(
        `/api/ideas/vote/check?idea_id=${data.id}&session_id=${sessionId}`
      );

      if (voteCheckResponse.ok) {
        const voteCheckData = await voteCheckResponse.json();
        if (voteCheckData.has_voted) {
          setHasVoted(true);
          setUserVote(voteCheckData.vote);
          // Show results since they already voted
          setVoteResult({
            ship_percentage: data.ship_percentage,
            total_votes: data.total_votes,
            user_agreed_with_crowd:
              (voteCheckData.vote === "ship" && data.ship_percentage >= 50) ||
              (voteCheckData.vote === "skip" && data.ship_percentage < 50),
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [slug, sessionId]);

  useEffect(() => {
    fetchPitch();
  }, [fetchPitch]);

  const handleVote = async (vote: VoteType) => {
    if (!pitch || voting || hasVoted) return;

    setVoting(true);
    setUserVote(vote);

    try {
      const response = await fetch("/api/ideas/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea_id: pitch.id,
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

      // Update pitch with new vote counts
      setPitch((prev) =>
        prev
          ? {
              ...prev,
              ship_percentage: result.ship_percentage,
              total_votes: result.total_votes,
            }
          : null
      );
    } catch (err) {
      console.error("Error voting:", err);
      setUserVote(null);
    } finally {
      setVoting(false);
    }
  };

  const generateTweetTemplate = () => {
    if (!pitch) return "";

    const tweetText = `I just voted on "${pitch.hero}" on Ship or Skip! ${pitch.ship_percentage}% would ship it. What do you think?`;
    const encodedText = encodeURIComponent(tweetText);
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_BASE_URL || ""}/pitch/${slug}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  };

  const handleShare = () => {
    if (!pitch) return;

    const text = `I just voted on "${pitch.hero}" on Ship or Skip! ${pitch.ship_percentage}% would ship it.`;
    const url = window.location.href;

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
      const shareText = `${text}\n${url}`;
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-foreground/10 rounded w-1/4 mx-auto mb-4" />
            <div className="h-8 bg-foreground/10 rounded w-3/4 mx-auto mb-4" />
            <div className="h-5 bg-foreground/10 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="text-6xl mb-6">🤔</div>
          <h2 className="text-[32px] font-bold mb-4">Pitch Not Found</h2>
          <p className="text-[18px] text-foreground/80 mb-8">
            This pitch doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/vote"
            className="inline-block px-8 py-4 bg-ship text-white font-bold text-lg rounded-xl
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Vote on Other Ideas
          </Link>
        </div>
      </div>
    );
  }

  if (!pitch) return null;

  const emoji = pitch.ship_percentage >= 50 ? "🚀" : "💀";
  const crowdVerdict = pitch.ship_percentage >= 50 ? "shipped" : "skipped";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      {/* Submitter attribution */}
      {pitch.submitter_twitter && (
        <div className="text-center">
          <a
            href={`https://twitter.com/${pitch.submitter_twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            @{pitch.submitter_twitter}&apos;s pitch
          </a>
        </div>
      )}

      {/* Idea Card with swipe support */}
      {!hasVoted && !voteResult ? (
        <SwipeContainer onSwipe={handleVote} disabled={voting}>
          <IdeaCard idea={pitch} animationState={cardAnimationState} />
        </SwipeContainer>
      ) : (
        <IdeaCard idea={pitch} animationState={cardAnimationState} />
      )}

      {/* Vote buttons (if not voted) */}
      {!hasVoted && !voteResult && (
        <VoteButtons onVote={handleVote} disabled={voting} />
      )}

      {/* Results (after voting) */}
      {voteResult && (
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-8 text-center animate-fade-in">
          {/* Main percentage display */}
          <div className="mb-6">
            <span className="text-[48px] font-bold">
              {voteResult.ship_percentage}% {emoji}
            </span>
            <p className="text-foreground/60 mt-2">
              of {voteResult.total_votes.toLocaleString()} voters {crowdVerdict}{" "}
              this
            </p>
          </div>

          {/* User agreement message */}
          {userVote && (
            <div className="mb-6">
              {voteResult.user_agreed_with_crowd ? (
                <p className="text-ship font-semibold text-lg">
                  ✓ You agreed with the crowd
                </p>
              ) : (
                <p className="text-skip font-semibold text-lg">
                  ✗ You went against the crowd
                </p>
              )}
            </div>
          )}

          {/* Share button */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleShare}
              className="w-full min-h-12 px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-xl
                transition-all duration-150
                hover:bg-foreground/10 hover:border-foreground/40"
            >
              Share 📤
            </button>

            <a
              href={generateTweetTemplate()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#1DA1F2] text-white font-semibold rounded-xl
                transition-all duration-150
                hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] hover:scale-[1.02]
                active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="w-full max-w-[480px] mx-auto flex flex-col sm:flex-row gap-3">
        <Link
          href="/vote"
          className="flex-1 px-6 py-4 bg-ship text-white font-bold rounded-xl text-center
            transition-all duration-150
            hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
            active:scale-[0.98]"
        >
          Vote on More Ideas
        </Link>
        <Link
          href="/submit"
          className="flex-1 px-6 py-4 border border-foreground/20 text-foreground font-bold rounded-xl text-center
            transition-all duration-150
            hover:border-foreground/40 hover:scale-[1.02]
            active:scale-[0.98]"
        >
          Submit Your Own
        </Link>
      </div>
    </div>
  );
}
