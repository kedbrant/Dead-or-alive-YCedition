"use client";

import { VoteType } from "./vote-buttons";

interface RevealOverlayProps {
  shipPercentage: number;
  totalVotes: number;
  userVote: VoteType;
  userAgreedWithCrowd: boolean;
  sourceCompany?: string | null;
  sourceOutcome?: string | null;
  onNext: () => void;
  onShare: () => void;
}

export function RevealOverlay({
  shipPercentage,
  totalVotes,
  userVote: _userVote,
  userAgreedWithCrowd,
  sourceCompany,
  sourceOutcome,
  onNext,
  onShare,
}: RevealOverlayProps) {
  // userVote is available in props for future use (e.g., showing "You voted Ship/Skip")
  void _userVote;
  const emoji = shipPercentage >= 50 ? "🚀" : "💀";
  const crowdVerdict = shipPercentage >= 50 ? "shipped" : "skipped";

  return (
    <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-8 text-center animate-fade-in">
      {/* Main percentage display */}
      <div className="mb-6">
        <span className="text-[48px] font-bold">
          {shipPercentage}% {emoji}
        </span>
        <p className="text-foreground/60 mt-2">
          of {totalVotes.toLocaleString()} voters {crowdVerdict} this
        </p>
      </div>

      {/* User agreement message */}
      <div className="mb-6">
        {userAgreedWithCrowd ? (
          <p className="text-ship font-semibold text-lg">
            ✓ You agreed with the crowd
          </p>
        ) : (
          <p className="text-skip font-semibold text-lg">
            ✗ You went against the crowd
          </p>
        )}
      </div>

      {/* Source info for known ideas */}
      {sourceCompany && (
        <div className="mb-6 p-4 bg-background/50 rounded-xl">
          <p className="text-foreground/60 text-sm">This was</p>
          <p className="font-bold text-lg">{sourceCompany}</p>
          {sourceOutcome && (
            <p className="text-foreground/80 mt-1">{sourceOutcome}</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onShare}
          className="flex-1 min-h-12 px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-xl
            transition-all duration-150
            hover:bg-foreground/10 hover:border-foreground/40"
        >
          Share 📤
        </button>
        <button
          onClick={onNext}
          className="flex-1 min-h-12 px-6 py-3 bg-ship text-white font-semibold rounded-xl
            transition-all duration-150
            hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
            active:scale-[0.98]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
