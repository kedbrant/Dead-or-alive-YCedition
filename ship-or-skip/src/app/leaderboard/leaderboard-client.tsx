"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import type { SourceOutcome } from "@/lib/supabase/types";

type LeaderboardType = "top" | "voted" | "controversial" | "biggest_misses" | "biggest_fools" | "favorites";

interface LeaderboardItem {
  id: string;
  slug: string;
  hero: string;
  subtitle: string;
  ship_percentage: number;
  total_votes: number;
  submitter_twitter: string | null;
  source: string;
  source_company: string | null;
  yc_slug: string | null;
  yc_name: string | null;
  source_outcome: SourceOutcome;
}

const TABS: { type: LeaderboardType; label: string }[] = [
  { type: "biggest_misses", label: "Biggest Misses" },
  { type: "biggest_fools", label: "Biggest Fools" },
  { type: "controversial", label: "Controversial" },
  { type: "favorites", label: "Crowd Favorites" },
];

export function LeaderboardClient() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("biggest_misses");
  const [items, setItems] = useState<LeaderboardItem[]>([]);
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
      setItems(data);
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
    setActiveTab(type);
  };

  const getDisplayName = (item: LeaderboardItem) => {
    // For YC companies, show the company name
    if (item.source === "yc" && item.yc_name) {
      return item.yc_name;
    }
    if (item.submitter_twitter) {
      return `@${item.submitter_twitter}`;
    }
    if (item.source_company) {
      return item.source_company;
    }
    if (item.source === "famous") {
      return "Famous";
    }
    return "User";
  };

  const getItemLink = (item: LeaderboardItem) => {
    // YC companies link to /company/[slug], others to /pitch/[slug]
    if (item.source === "yc" && item.yc_slug) {
      return `/company/${item.yc_slug}`;
    }
    return `/pitch/${item.slug}`;
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Leaderboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-foreground/20 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.type}
              onClick={() => handleTabChange(tab.type)}
              className={`flex-1 py-3 px-4 text-sm sm:text-base font-medium transition-colors ${
                activeTab === tab.type
                  ? "text-ship border-b-2 border-ship"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              No ideas to show yet.
            </p>
            <Link
              href="/vote"
              className="inline-block mt-4 px-6 py-3 bg-ship text-background font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Start Voting
            </Link>
          </div>
        )}

        {/* Leaderboard Rows */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={getItemLink(item)}
                className="block bg-surface rounded-lg p-4 hover:bg-surface/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/10 text-foreground/80 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Idea Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-ship transition-colors">
                        {item.hero}
                      </h3>
                      {item.source_outcome && (
                        <OutcomeBadge outcome={item.source_outcome} size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/60">
                      {getDisplayName(item)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`font-bold ${
                        item.ship_percentage >= 50 ? "text-ship" : "text-skip"
                      }`}
                    >
                      {item.ship_percentage}% 🚀
                    </p>
                    <p className="text-sm text-foreground/60">
                      {item.total_votes.toLocaleString()} votes
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/vote"
            className="px-6 py-3 bg-ship text-background font-semibold rounded-lg text-center hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Vote on Ideas
          </Link>
          <Link
            href="/submit"
            className="px-6 py-3 border border-foreground/20 text-foreground font-semibold rounded-lg text-center hover:border-foreground/40 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Submit Your Idea
          </Link>
        </div>
      </div>
    </div>
  );
}
