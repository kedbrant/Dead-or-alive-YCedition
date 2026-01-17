"use client";

import { useState } from "react";
import { NewsArticle } from "@/lib/supabase/types";

interface MarketSectionProps {
  summary: string;
  articles: NewsArticle[];
}

export function MarketSection({ summary, articles }: MarketSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const totalArticles = articles.length;
  const displayedArticles = showAll ? articles : articles.slice(0, 5);
  const hasMore = totalArticles > 5;

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-1">CURRENT MARKET</h2>
      <p className="text-foreground/60 text-sm mb-4">
        What&apos;s happening right now
      </p>

      <p className="text-foreground/80 mb-4">{summary}</p>

      {/* News Articles */}
      {articles && articles.length > 0 ? (
        <div>
          <div className="space-y-2">
            {displayedArticles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
              >
                <div className="font-medium text-sm line-clamp-2">
                  {article.title}
                </div>
                <div className="text-xs text-foreground/60 mt-1">
                  {article.source} &bull; {article.date}
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
                  Show all {totalArticles} articles
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="text-foreground/60 text-sm italic">
          No recent news articles found for this topic.
        </p>
      )}
    </div>
  );
}
