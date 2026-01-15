"use client";

interface BattleCardProps {
  hero: string;
  subtitle: string;
  yc_batch: string | null;
  yc_industry: string | null;
  isSelected?: boolean;
  isWinner?: boolean;
  isLoser?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function BattleCard({
  hero,
  subtitle,
  yc_batch,
  yc_industry,
  isSelected = false,
  isWinner = false,
  isLoser = false,
  onClick,
  disabled = false,
}: BattleCardProps) {
  const getBorderStyle = () => {
    if (isWinner) return "border-ship ring-2 ring-ship/50";
    if (isLoser) return "border-skip ring-2 ring-skip/50";
    if (isSelected) return "border-foreground/50 ring-2 ring-foreground/30";
    return "border-foreground/10 hover:border-foreground/30";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full bg-gradient-to-br from-surface to-surface/80 rounded-2xl p-5
        border-2 transition-all duration-200
        ${getBorderStyle()}
        ${!disabled ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : "cursor-default"}
        ${disabled && !isWinner && !isLoser ? "opacity-60" : ""}
        flex flex-col text-left min-h-[200px]
      `}
    >
      {/* Quote mark */}
      <div className="text-3xl text-foreground/10 font-serif leading-none mb-1 select-none">&ldquo;</div>

      {/* Hero pitch */}
      <h3 className="text-lg font-bold leading-tight mb-2 flex-grow">
        {hero}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-foreground/70 leading-relaxed mb-3 line-clamp-2">
        {subtitle}
      </p>

      {/* YC info */}
      {(yc_batch || yc_industry) && (
        <div className="text-xs text-foreground/50 mt-auto pt-2 border-t border-foreground/10">
          {yc_batch && <span>YC {yc_batch}</span>}
          {yc_batch && yc_industry && <span> • </span>}
          {yc_industry && <span>{yc_industry}</span>}
        </div>
      )}

      {/* Winner/Loser indicator */}
      {isWinner && (
        <div className="mt-2 text-xs font-bold text-ship flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          MORE SUCCESSFUL
        </div>
      )}
      {isLoser && (
        <div className="mt-2 text-xs font-bold text-skip flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          LESS SUCCESSFUL
        </div>
      )}
    </button>
  );
}
