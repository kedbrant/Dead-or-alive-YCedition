"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type LeaderboardType = "voters" | "most_ships";

interface VoterItem {
  id: string;
  twitter_handle: string | null;
  total_votes: number;
  ship_votes: number;
  skip_votes: number;
  crowd_agreements: number;
  oracle_score: number | null;
  resolved_votes: number | null;
}

const TABS: { type: LeaderboardType; label: string }[] = [
  { type: "voters", label: "Top Voters" },
  { type: "most_ships", label: "Most Ships" },
];

const DEFAULT_TAB: LeaderboardType = "voters";

function isValidTab(tab: string | null): tab is LeaderboardType {
  return tab !== null && TABS.some((t) => t.type === tab);
}

export function LeaderboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab = isValidTab(tabParam) ? tabParam : DEFAULT_TAB;

  const [voters, setVoters] = useState<VoterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (type: LeaderboardType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leaderboard?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      setVoters(data);
    } catch {
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, fetchLeaderboard]);

  const handleTabChange = (type: LeaderboardType) => {
    router.push(`/leaderboard?tab=${type}`, { scroll: false });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Leaderboard
        </h1>

        {/* Tab Navigation - scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex border-b border-foreground/20 mb-6 min-w-max sm:min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => handleTabChange(tab.type)}
                className={`py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.type
                    ? "text-ship border-b-2 border-ship"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-foreground/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-foreground/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-foreground/10 rounded w-1/2" />
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-foreground/10 rounded w-16 mb-2" />
                    <div className="h-4 bg-foreground/10 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-skip/10 border border-skip/30 rounded-lg p-4 text-center">
            <p className="text-skip">{error}</p>
            <button
              onClick={() => fetchLeaderboard(activeTab)}
              className="mt-2 text-foreground/60 hover:text-foreground underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && voters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              No voters yet. Be the first!
            </p>
            <Link
              href="/play"
              className="inline-block mt-4 px-6 py-3 bg-ship text-background font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Start Voting
            </Link>
          </div>
        )}

        {/* Voters Leaderboard Rows */}
        {!loading && !error && voters.length > 0 && (
          <div className="space-y-2">
            {voters.map((voter, index) => (
              <div
                key={voter.id}
                className="bg-surface rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 text-foreground/80 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Voter Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {voter.twitter_handle ? `@${voter.twitter_handle}` : "Anonymous Voter"}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      {voter.ship_votes} ships • {voter.skip_votes} skips
                    </p>
                  </div>

                  {/* Stats - show ships for most_ships tab, votes for voters tab */}
                  <div className="text-right flex-shrink-0">
                    {activeTab === "most_ships" ? (
                      <p className="font-bold text-ship">
                        {voter.ship_votes.toLocaleString()} 🚀
                      </p>
                    ) : (
                      <p className="font-bold text-ship">
                        {voter.total_votes.toLocaleString()} votes
                      </p>
                    )}
                    {voter.oracle_score !== null && voter.resolved_votes && voter.resolved_votes >= 10 && (
                      <p className="text-sm text-foreground/60">
                        🔮 {voter.oracle_score}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/play"
            className="px-6 py-3 bg-ship text-background font-semibold rounded-lg text-center hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Start Playing
          </Link>
        </div>
      </div>
    </div>
  );
}
