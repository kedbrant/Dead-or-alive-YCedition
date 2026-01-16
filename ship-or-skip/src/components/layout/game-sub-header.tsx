"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Stats {
  total_votes: number;
  oracle_score: number | null;
  votes_until_oracle: number;
}

export function GameSubHeader() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const statsResponse = await fetch("/api/stats");

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
        // Calculate streak from voting pattern (simple heuristic)
        // For now, we'll use total_votes as a proxy since we don't have a streak field
        setStreak(Math.min(data.total_votes, 5)); // Cap at 5 for display
      }
    } catch {
      // Silently fail - sub-header is not critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for oracle score updates (dispatched from voting-client)
  useEffect(() => {
    const handleOracleUpdate = () => {
      fetchData();
    };

    window.addEventListener("oracle-score-update", handleOracleUpdate);
    return () => window.removeEventListener("oracle-score-update", handleOracleUpdate);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="bg-surface/50 border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 w-16 bg-foreground/10 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-foreground/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface/50 border-b border-foreground/10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            {/* Streak */}
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <span className="text-foreground/70">{streak}</span>
            </div>

            {/* Oracle Score */}
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔮</span>
              {stats?.oracle_score !== null && stats?.oracle_score !== undefined ? (
                <span className="text-purple-400 font-semibold">{stats.oracle_score}%</span>
              ) : (
                <span className="text-foreground/50 text-xs">
                  Vote {stats?.votes_until_oracle ?? 10} more
                </span>
              )}
            </div>

            {/* Achievements - link to stats page */}
            <Link
              href="/stats"
              className="flex items-center gap-1.5 hover:text-ship transition-colors"
            >
              <span className="text-base">🏆</span>
              <span className="text-foreground/70 text-xs">Stats</span>
            </Link>
          </div>

          {/* Battle Mode Toggle */}
          <Link
            href="/battle"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-background/50 border border-foreground/20
              hover:border-foreground/40 hover:bg-foreground/5
              transition-all text-sm font-medium"
          >
            <span className="text-base">⚔️</span>
            <span className="hidden sm:inline">Battle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
