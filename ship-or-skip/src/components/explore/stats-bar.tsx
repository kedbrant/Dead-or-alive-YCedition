"use client";

interface StatsBarProps {
  total: number;
  unicorns: number;
  dead: number;
  loading?: boolean;
}

export function StatsBar({
  total,
  unicorns,
  dead,
  loading = false,
}: StatsBarProps) {
  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="h-5 w-24 bg-foreground/10 rounded animate-pulse" />
          <span className="text-foreground/40">|</span>
          <div className="h-5 w-20 bg-foreground/10 rounded animate-pulse" />
          <span className="text-foreground/40">|</span>
          <div className="h-5 w-16 bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center justify-center gap-4 text-sm md:text-base">
        <span className="font-medium">
          {total.toLocaleString()} companies
        </span>
        <span className="text-foreground/40">|</span>
        <span>
          <span className="mr-1">🦄</span>
          {unicorns.toLocaleString()} unicorns
        </span>
        <span className="text-foreground/40">|</span>
        <span>
          <span className="mr-1">💀</span>
          {dead.toLocaleString()} dead
        </span>
      </div>
    </div>
  );
}
