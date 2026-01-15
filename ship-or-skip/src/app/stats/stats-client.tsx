"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface UserStats {
  total_votes: number;
  ship_votes: number;
  skip_votes: number;
  crowd_agreements: number;
  ship_rate: number;
  crowd_agreement_rate: number;
  twitter_handle: string | null;
  // Oracle Score fields
  oracle_score: number | null;
  resolved_votes: number;
  correct_predictions: number;
  correct_ships: number;
  correct_skips: number;
  wrong_predictions: number;
  votes_until_oracle: number;
}

export function StatsClient() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        if (response.status === 401) {
          // No session yet - show empty state
          setStats({
            total_votes: 0,
            ship_votes: 0,
            skip_votes: 0,
            crowd_agreements: 0,
            ship_rate: 0,
            crowd_agreement_rate: 0,
            twitter_handle: null,
            oracle_score: null,
            resolved_votes: 0,
            correct_predictions: 0,
            correct_ships: 0,
            correct_skips: 0,
            wrong_predictions: 0,
            votes_until_oracle: 10,
          });
          return;
        }
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch {
      setError("Failed to load your stats. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const generateTweetTemplate = () => {
    if (!stats || stats.total_votes === 0) return "";

    let tweetText = "";
    if (stats.oracle_score !== null) {
      tweetText = `My Oracle Score: ${stats.oracle_score}% on Ship or Skip! I correctly predicted ${stats.correct_predictions} out of ${stats.resolved_votes} YC startup outcomes. Can you spot the unicorns?`;
    } else {
      tweetText = `My Ship or Skip stats: ${stats.total_votes} ideas voted, ${stats.ship_rate}% shipped, ${stats.crowd_agreement_rate}% crowd agreement. Think you can beat my instincts?`;
    }
    const encodedText = encodeURIComponent(tweetText);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const encodedUrl = encodeURIComponent(`${baseUrl}/vote`);
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  };

  const handleShare = async () => {
    if (!stats || stats.total_votes === 0) return;

    let shareText = "";
    if (stats.oracle_score !== null) {
      shareText = `My Oracle Score: ${stats.oracle_score}% on Ship or Skip! I correctly predicted ${stats.correct_predictions} out of ${stats.resolved_votes} YC startup outcomes.`;
    } else {
      shareText = `My Ship or Skip stats: ${stats.total_votes} ideas voted, ${stats.ship_rate}% shipped, ${stats.crowd_agreement_rate}% crowd agreement.`;
    }
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${baseUrl}/vote`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Ship or Skip Stats",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard failed
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-[480px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Your Stats
          </h1>
          <div className="bg-surface rounded-2xl p-8 animate-pulse">
            <div className="space-y-6">
              <div className="h-24 bg-foreground/10 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-foreground/10 rounded-xl" />
                <div className="h-20 bg-foreground/10 rounded-xl" />
              </div>
              <div className="h-20 bg-foreground/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-[480px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Your Stats
          </h1>
          <div className="bg-skip/10 border border-skip/30 rounded-xl p-6 text-center">
            <p className="text-skip mb-4">{error}</p>
            <button
              onClick={fetchStats}
              className="text-foreground/60 hover:text-foreground underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no votes yet
  if (!stats || stats.total_votes === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-[32px] font-bold mb-4">No Stats Yet</h1>
          <p className="text-[18px] text-foreground/80 mb-8">
            Start voting on startup ideas to track your stats!
          </p>
          <Link
            href="/vote"
            className="inline-block w-full px-6 py-4 bg-ship text-white font-bold rounded-xl
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Start Voting
          </Link>
        </div>
      </div>
    );
  }

  // Stats display
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-[480px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Your Stats
        </h1>

        <div className="bg-surface rounded-2xl p-6 sm:p-8">
          {/* User profile */}
          {stats.twitter_handle && (
            <div className="flex flex-col items-center mb-8">
              <a
                href={`https://twitter.com/${stats.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Image
                  src={`https://unavatar.io/twitter/${stats.twitter_handle}`}
                  alt={stats.twitter_handle}
                  width={80}
                  height={80}
                  className="rounded-full mb-3 group-hover:ring-2 ring-ship transition-all"
                  unoptimized
                />
              </a>
              <a
                href={`https://twitter.com/${stats.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold hover:text-ship transition-colors"
              >
                @{stats.twitter_handle}
              </a>
            </div>
          )}

          {/* Oracle Score - Hero metric */}
          {stats.oracle_score !== null ? (
            <div className="text-center mb-8 p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl border border-purple-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🔮</span>
                <p className="text-foreground/80 font-semibold">Oracle Score</p>
              </div>
              <p className="text-6xl font-bold text-purple-400 mb-2">
                {stats.oracle_score}%
              </p>
              <p className="text-foreground/60 text-sm">
                {stats.correct_predictions} of {stats.resolved_votes} predictions correct
              </p>
              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="bg-background/30 rounded-lg p-2">
                  <p className="text-ship font-bold">{stats.correct_ships}</p>
                  <p className="text-foreground/50">Ships Hit</p>
                </div>
                <div className="bg-background/30 rounded-lg p-2">
                  <p className="text-ship font-bold">{stats.correct_skips}</p>
                  <p className="text-foreground/50">Skips Hit</p>
                </div>
                <div className="bg-background/30 rounded-lg p-2">
                  <p className="text-skip font-bold">{stats.wrong_predictions}</p>
                  <p className="text-foreground/50">Missed</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8 p-6 bg-background/30 rounded-2xl border border-foreground/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl opacity-50">🔮</span>
                <p className="text-foreground/60 font-semibold">Oracle Score</p>
              </div>
              <p className="text-4xl font-bold text-foreground/30 mb-2">Locked</p>
              <p className="text-foreground/60 text-sm">
                Vote on {stats.votes_until_oracle} more YC companies to unlock
              </p>
              {stats.resolved_votes > 0 && (
                <div className="mt-3 bg-foreground/5 rounded-lg p-2">
                  <p className="text-xs text-foreground/50">
                    Progress: {stats.resolved_votes}/10 resolved votes
                  </p>
                  <div className="w-full bg-foreground/10 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(stats.resolved_votes / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main stat - Ideas Voted */}
          <div className="text-center mb-8">
            <p className="text-foreground/60 text-sm mb-1">Ideas Voted</p>
            <p className="text-6xl font-bold text-ship">
              {stats.total_votes.toLocaleString()}
            </p>
          </div>

          {/* Ship vs Skip breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-background/50 rounded-xl p-4 text-center">
              <p className="text-foreground/60 text-sm mb-1">Shipped</p>
              <p className="text-3xl font-bold text-ship">
                {stats.ship_votes.toLocaleString()}
              </p>
              <p className="text-ship text-sm">{stats.ship_rate}% 🚀</p>
            </div>
            <div className="bg-background/50 rounded-xl p-4 text-center">
              <p className="text-foreground/60 text-sm mb-1">Skipped</p>
              <p className="text-3xl font-bold text-skip">
                {stats.skip_votes.toLocaleString()}
              </p>
              <p className="text-skip text-sm">{100 - stats.ship_rate}% 💀</p>
            </div>
          </div>

          {/* Crowd Agreement */}
          <div className="bg-background/50 rounded-xl p-4 text-center mb-8">
            <p className="text-foreground/60 text-sm mb-1">Crowd Agreement</p>
            <p className="text-4xl font-bold">
              <span className={stats.crowd_agreement_rate >= 50 ? "text-ship" : "text-skip"}>
                {stats.crowd_agreement_rate}%
              </span>
            </p>
            <p className="text-foreground/60 text-sm mt-1">
              You agreed with the crowd on {stats.crowd_agreements.toLocaleString()} ideas
            </p>
          </div>

          {/* Share button */}
          <div className="space-y-3">
            <a
              href={generateTweetTemplate()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#1DA1F2] text-white font-bold rounded-xl
                transition-all duration-150
                hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] hover:scale-[1.02]
                active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>

            <button
              onClick={handleShare}
              className="w-full px-6 py-4 border border-foreground/20 text-foreground font-bold rounded-xl
                transition-all duration-150
                hover:border-foreground/40 hover:scale-[1.02]
                active:scale-[0.98]"
            >
              {copied ? "Copied!" : "Share Stats"}
            </button>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/vote"
            className="flex-1 px-6 py-4 bg-ship text-white font-bold rounded-xl text-center
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Keep Voting
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 px-6 py-4 border border-foreground/20 text-foreground font-bold rounded-xl text-center
              transition-all duration-150
              hover:border-foreground/40 hover:scale-[1.02]
              active:scale-[0.98]"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
