"use client";

import { useState } from "react";
import Link from "next/link";
import { YCCompanyMatch, SourceOutcome } from "@/lib/supabase/types";

interface HistoricalSectionProps {
  summary: string;
  companies: YCCompanyMatch[];
  outcomeCounts: {
    unicorn: number;
    acquired: number;
    dead: number;
    active: number;
  };
}

function getOutcomeEmoji(outcome: SourceOutcome): string {
  switch (outcome) {
    case "unicorn":
      return "🦄";
    case "acquired":
      return "🤝";
    case "dead":
      return "💀";
    case "active":
      return "🚀";
    default:
      return "❓";
  }
}

export function HistoricalSection({
  summary,
  companies,
  outcomeCounts,
}: HistoricalSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const totalCompanies = companies.length;
  const displayedCompanies = showAll ? companies : companies.slice(0, 5);
  const hasMore = totalCompanies > 5;

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-1">YC COMPANIES</h2>
      <p className="text-foreground/60 text-sm mb-4">
        Similar companies from 5,500+ YC startups
      </p>

      {/* Outcome Distribution */}
      {outcomeCounts && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-3 bg-foreground/5 rounded-xl">
            <div className="text-2xl mb-1">🦄</div>
            <div className="text-lg font-bold">{outcomeCounts.unicorn}</div>
            <div className="text-xs text-foreground/60">Unicorn</div>
          </div>
          <div className="text-center p-3 bg-foreground/5 rounded-xl">
            <div className="text-2xl mb-1">🤝</div>
            <div className="text-lg font-bold">{outcomeCounts.acquired}</div>
            <div className="text-xs text-foreground/60">Acquired</div>
          </div>
          <div className="text-center p-3 bg-foreground/5 rounded-xl">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-lg font-bold">{outcomeCounts.active}</div>
            <div className="text-xs text-foreground/60">Active</div>
          </div>
          <div className="text-center p-3 bg-foreground/5 rounded-xl">
            <div className="text-2xl mb-1">💀</div>
            <div className="text-lg font-bold">{outcomeCounts.dead}</div>
            <div className="text-xs text-foreground/60">Dead</div>
          </div>
        </div>
      )}

      <p className="text-foreground/80 mb-4">{summary}</p>

      {/* Similar Companies */}
      {companies && companies.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wide mb-3">
            Similar Companies ({totalCompanies})
          </h3>
          <div className="space-y-2">
            {displayedCompanies.map((company, index) => {
              const content = (
                <>
                  <span className="text-xl">{getOutcomeEmoji(company.outcome)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{company.name}</span>
                      {company.batch && (
                        <span className="text-xs text-foreground/60">
                          {company.batch}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 truncate">
                      {company.pitch}
                    </p>
                  </div>
                </>
              );

              // If company has a slug, make it clickable
              if (company.slug) {
                return (
                  <Link
                    key={index}
                    href={`/company/${company.slug}`}
                    className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                  >
                    {content}
                  </Link>
                );
              }

              // Fallback to non-clickable div
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg"
                >
                  {content}
                </div>
              );
            })}
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
                  Show all {totalCompanies} companies
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6 bg-foreground/5 rounded-xl">
          <p className="text-foreground/60">
            No similar YC companies found for this idea.
          </p>
          <p className="text-foreground/40 text-sm mt-1">
            This could indicate a novel opportunity in an unexplored space.
          </p>
        </div>
      )}
    </div>
  );
}
