"use client";

import { useState } from "react";

interface OracleScoreCardProps {
  score: number;
  correctPredictions: number;
  resolvedVotes: number;
  correctShips: number;
  correctSkips: number;
  wrongPredictions: number;
  percentileRank?: number | null;
  twitterHandle?: string | null;
}

export function OracleScoreCard({
  score,
  correctPredictions,
  resolvedVotes,
  correctShips,
  correctSkips,
  wrongPredictions,
  percentileRank,
  twitterHandle,
}: OracleScoreCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `My Oracle Score: ${score.toFixed(0)}% on Ship or Skip! I correctly predicted ${correctPredictions} out of ${resolvedVotes} YC startup outcomes. Can you spot the unicorns?`;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${baseUrl}/vote`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Oracle Score",
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

  const generateTweetUrl = () => {
    const tweetText = `My Oracle Score: ${score.toFixed(0)}% on Ship or Skip! I correctly predicted ${correctPredictions} out of ${resolvedVotes} YC startup outcomes. Can you spot the unicorns?`;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const encodedText = encodeURIComponent(tweetText);
    const encodedUrl = encodeURIComponent(`${baseUrl}/vote`);
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-6 shadow-2xl border border-purple-500/30">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔮</div>
          <h2 className="text-xl font-bold text-white/80">Oracle Score</h2>
          {twitterHandle && (
            <p className="text-purple-300 text-sm">@{twitterHandle}</p>
          )}
        </div>

        {/* Main Score */}
        <div className="text-center mb-6">
          <p className="text-7xl font-bold text-white mb-1">
            {score.toFixed(0)}%
          </p>
          <p className="text-purple-200 text-sm">
            {correctPredictions} of {resolvedVotes} predictions correct
          </p>
        </div>

        {/* Percentile Rank */}
        {percentileRank !== undefined && percentileRank !== null && (
          <div className="text-center mb-6 py-3 bg-white/10 rounded-xl">
            <p className="text-lg font-semibold text-white">
              Better than {percentileRank.toFixed(0)}% of players
            </p>
          </div>
        )}

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{correctShips}</p>
            <p className="text-xs text-purple-200">Ships Hit</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{correctSkips}</p>
            <p className="text-xs text-purple-200">Skips Hit</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{wrongPredictions}</p>
            <p className="text-xs text-purple-200">Missed</p>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center text-purple-300 text-xs">
          shiporskip.io
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mt-4 space-y-2">
        <a
          href={generateTweetUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#1DA1F2] text-white font-semibold rounded-xl
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
          className="w-full px-6 py-3 bg-white/10 text-white font-semibold rounded-xl
            transition-all duration-150
            hover:bg-white/20 hover:scale-[1.02]
            active:scale-[0.98]"
        >
          {copied ? "Copied to Clipboard!" : "Copy Share Link"}
        </button>
      </div>
    </div>
  );
}
