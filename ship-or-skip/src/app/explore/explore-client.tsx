"use client";

import { useState, useCallback } from "react";
import { SearchBar } from "@/components/explore/search-bar";
import { FilterBar } from "@/components/explore/filter-bar";
import { StatsBar } from "@/components/explore/stats-bar";

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
  const [searchQuery, setSearchQuery] = useState("");
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
  const [industries] = useState<string[]>([]);
  const [industriesLoading] = useState(false);

  // Suppress unused variable warnings - these will be used in future stories
  void searchQuery;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // TODO: Trigger API call with search query
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    // TODO: Trigger API call with new filters
  }, []);

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
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Filter Bar Section */}
        <section className="mb-6">
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            industries={industries}
            industriesLoading={industriesLoading}
          />
        </section>

        {/* Stats Bar Section */}
        <section className="mb-6">
          <StatsBar
            total={stats.total}
            unicorns={stats.unicorns}
            dead={stats.dead}
            loading={loading}
          />
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
