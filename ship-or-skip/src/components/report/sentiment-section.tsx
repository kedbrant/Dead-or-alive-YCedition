"use client";

import { useState } from "react";
import { RedditPost } from "@/lib/supabase/types";

interface SentimentSectionProps {
  summary: string;
  posts: RedditPost[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export function SentimentSection({
  summary,
  posts,
  sentimentBreakdown,
}: SentimentSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const totalPosts = posts.length;
  const displayedPosts = showAll ? posts : posts.slice(0, 5);
  const hasMore = totalPosts > 5;

  // Extract unique subreddits searched
  const subredditsSearched = [...new Set(posts.map((post) => post.subreddit))];

  // Determine overall sentiment
  const getOverallSentiment = (): {
    label: string;
    color: string;
    bgColor: string;
  } => {
    const { positive, negative } = sentimentBreakdown;
    if (positive >= 50) {
      return {
        label: "Positive",
        color: "text-green-500",
        bgColor: "bg-green-500",
      };
    }
    if (negative >= 50) {
      return {
        label: "Negative",
        color: "text-red-500",
        bgColor: "bg-red-500",
      };
    }
    return { label: "Mixed", color: "text-yellow-500", bgColor: "bg-yellow-500" };
  };

  const overallSentiment = getOverallSentiment();

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-1">COMMUNITY SENTIMENT</h2>
      <p className="text-foreground/60 text-sm mb-4">What people are saying</p>

      {/* Subreddits searched */}
      {subredditsSearched.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-foreground/50 mb-2">Subreddits analyzed:</p>
          <div className="flex flex-wrap gap-2">
            {subredditsSearched.map((sub) => (
              <span
                key={sub}
                className="px-2 py-1 bg-foreground/5 rounded-full text-xs text-foreground/70"
              >
                r/{sub}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment Breakdown */}
      {sentimentBreakdown && (
        <div className="mb-4">
          {/* Overall Sentiment Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${overallSentiment.bgColor}`} />
            <span className={`font-medium ${overallSentiment.color}`}>
              {overallSentiment.label} Sentiment
            </span>
          </div>

          {/* Detailed Breakdown */}
          <div className="flex gap-2">
            <div className="flex-1 text-center p-2 bg-green-500/10 rounded-lg">
              <div className="text-green-500 font-bold">
                {sentimentBreakdown.positive}%
              </div>
              <div className="text-xs text-foreground/60">Positive</div>
            </div>
            <div className="flex-1 text-center p-2 bg-gray-500/10 rounded-lg">
              <div className="text-gray-400 font-bold">
                {sentimentBreakdown.neutral}%
              </div>
              <div className="text-xs text-foreground/60">Neutral</div>
            </div>
            <div className="flex-1 text-center p-2 bg-red-500/10 rounded-lg">
              <div className="text-red-500 font-bold">
                {sentimentBreakdown.negative}%
              </div>
              <div className="text-xs text-foreground/60">Negative</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary / Key Insight */}
      <p className="text-foreground/80 mb-4">{summary}</p>

      {/* Reddit Posts */}
      {posts && posts.length > 0 ? (
        <div>
          <div className="space-y-2">
            {displayedPosts.map((post, index) => (
              <a
                key={index}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
              >
                <div className="font-medium text-sm line-clamp-2">
                  {post.title}
                </div>
                <div className="text-xs text-foreground/60 mt-1 flex items-center gap-2">
                  <span>r/{post.subreddit}</span>
                  <span>&bull;</span>
                  <span>{post.score} upvotes</span>
                  <span>&bull;</span>
                  <span>{post.comments} comments</span>
                </div>
              </a>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full py-2 px-4 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              {showAll ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Show less
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Show all {totalPosts} posts
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="text-foreground/60 text-sm italic">
          No community discussions found for this topic.
        </p>
      )}
    </div>
  );
}
