"use client";

export type VoteType = "ship" | "skip";

interface VoteButtonsProps {
  onVote: (vote: VoteType) => void;
  disabled?: boolean;
}

export function VoteButtons({ onVote, disabled = false }: VoteButtonsProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onVote("skip")}
          disabled={disabled}
          className="flex-1 min-h-16 px-8 py-4 bg-skip text-white font-bold text-lg rounded-xl
            transition-all duration-150
            hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          Skip 💀
        </button>
        <button
          onClick={() => onVote("ship")}
          disabled={disabled}
          className="flex-1 min-h-16 px-8 py-4 bg-ship text-white font-bold text-lg rounded-xl
            transition-all duration-150
            hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          Ship 🚀
        </button>
      </div>
      {/* Keyboard hints - hidden on mobile */}
      <div className="hidden sm:flex justify-center gap-8 text-foreground/40 text-sm">
        <span>← Skip</span>
        <span>Ship →</span>
      </div>
    </div>
  );
}
