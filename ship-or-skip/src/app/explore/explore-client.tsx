"use client";

import { useState } from "react";

// Placeholder component interfaces for future implementation
interface SearchState {
  query: string;
}

interface FilterState {
  outcome: string;
  industry: string;
  batch: string;
  sort: string;
}

interface StatsState {
  total: number;
  unicorns: number;
  dead: number;
}

export function ExploreClient() {
  // State placeholders for future components
  const [search, setSearch] = useState<SearchState>({ query: "" });
  const [filters, setFilters] = useState<FilterState>({
    outcome: "all",
    industry: "all",
    batch: "all",
    sort: "newest",
  });
  const [stats] = useState<StatsState>({
    total: 5571,
    unicorns: 127,
    dead: 1247,
  });
  const [loading] = useState(false);

  // Suppress unused variable warnings - these will be used in future stories
  void search;
  void setSearch;
  void filters;
  void setFilters;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-2">
            EXPLORE 5,500+ YC STARTUPS
          </h1>
          <p className="text-[16px] md:text-[18px] text-foreground/70">
            Search, filter, and discover the complete YC company database
          </p>
        </div>

        {/* Search Bar Section */}
        <section className="mb-6">
          <div className="bg-surface rounded-xl p-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search companies, pitches..."
                className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/20 rounded-lg
                  text-foreground placeholder:text-foreground/50
                  focus:outline-none focus:border-ship transition-colors"
                disabled
              />
            </div>
            <p className="text-xs text-foreground/40 mt-2 text-center">
              Search functionality coming soon
            </p>
          </div>
        </section>

        {/* Filter Bar Section */}
        <section className="mb-6">
          <div className="bg-surface rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Outcome Filter */}
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  Outcome
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                    text-foreground text-sm
                    focus:outline-none focus:border-ship transition-colors"
                  disabled
                >
                  <option>All</option>
                  <option>Unicorns</option>
                  <option>Acquired</option>
                  <option>Dead</option>
                  <option>Active</option>
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  Industry
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                    text-foreground text-sm
                    focus:outline-none focus:border-ship transition-colors"
                  disabled
                >
                  <option>All</option>
                </select>
              </div>

              {/* Batch Filter */}
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  Batch
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                    text-foreground text-sm
                    focus:outline-none focus:border-ship transition-colors"
                  disabled
                >
                  <option>All</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs text-foreground/60 mb-1">
                  Sort
                </label>
                <select
                  className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
                    text-foreground text-sm
                    focus:outline-none focus:border-ship transition-colors"
                  disabled
                >
                  <option>Newest</option>
                  <option>Team size</option>
                  <option>Most votes</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-foreground/40 mt-2 text-center">
              Filter functionality coming soon
            </p>
          </div>
        </section>

        {/* Stats Bar Section */}
        <section className="mb-6">
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center justify-center gap-4 text-sm md:text-base">
              <span className="font-medium">
                {stats.total.toLocaleString()} companies
              </span>
              <span className="text-foreground/40">|</span>
              <span>
                <span className="mr-1">🦄</span>
                {stats.unicorns.toLocaleString()} unicorns
              </span>
              <span className="text-foreground/40">|</span>
              <span>
                <span className="mr-1">💀</span>
                {stats.dead.toLocaleString()} dead
              </span>
            </div>
          </div>
        </section>

        {/* Company List Section */}
        <section>
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-surface rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-foreground/10 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-foreground/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-foreground/10 rounded w-1/2" />
                  </div>
                ))}
              </>
            ) : (
              // Placeholder for company list
              <div className="bg-surface rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">
                  Company list coming soon
                </h3>
                <p className="text-foreground/60 text-sm">
                  Search and filter YC companies will be available in upcoming
                  updates
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
