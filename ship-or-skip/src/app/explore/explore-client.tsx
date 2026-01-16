"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SearchBar } from "@/components/explore/search-bar";
import { FilterBar } from "@/components/explore/filter-bar";
import { StatsBar } from "@/components/explore/stats-bar";
import { CompanyCard } from "@/components/explore/company-card";
import { SourceOutcome } from "@/lib/supabase/types";

interface FilterState {
  outcome: string;
  industry: string;
  batch: string;
  sort: string;
}

interface Company {
  slug: string;
  yc_name: string;
  yc_batch: string | null;
  hero: string;
  source_outcome: SourceOutcome;
  yc_industry: string | null;
  yc_team_size: number | null;
  ship_percentage: number;
  total_votes: number;
}

interface StatsState {
  total: number;
  unicorns: number;
  dead: number;
}

interface ExploreApiResponse {
  companies: Company[];
  total: number;
  stats: StatsState;
}

const LIMIT = 20;

export function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    outcome: "all",
    industry: "all",
    batch: "all",
    sort: "newest",
  });
  const [stats, setStats] = useState<StatsState>({
    total: 0,
    unicorns: 0,
    dead: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref for the sentinel element that triggers loading more
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch companies from API
  const fetchCompanies = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (filters.outcome !== "all") params.set("outcome", filters.outcome);
        if (filters.industry !== "all") params.set("industry", filters.industry);
        if (filters.batch !== "all") params.set("batch", filters.batch);
        params.set("sort", filters.sort);
        params.set("page", pageNum.toString());
        params.set("limit", LIMIT.toString());

        const response = await fetch(`/api/explore?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch companies");

        const data: ExploreApiResponse = await response.json();

        if (append) {
          setCompanies((prev) => [...prev, ...data.companies]);
        } else {
          setCompanies(data.companies);
          setStats(data.stats);
        }

        // Check if there are more results
        const totalLoaded = append
          ? companies.length + data.companies.length
          : data.companies.length;
        setHasMore(totalLoaded < data.total);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, filters, companies.length]
  );

  // Fetch industries for filter dropdown
  useEffect(() => {
    async function fetchIndustries() {
      setIndustriesLoading(true);
      try {
        const response = await fetch("/api/explore/industries");
        if (response.ok) {
          const data = await response.json();
          setIndustries(data.industries || []);
        }
      } catch (error) {
        console.error("Error fetching industries:", error);
      } finally {
        setIndustriesLoading(false);
      }
    }
    fetchIndustries();
  }, []);

  // Fetch initial data and reset on filter/search change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchCompanies(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchCompanies(nextPage, true);
        }
      },
      {
        rootMargin: "100px", // Trigger 100px before reaching bottom
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, page, fetchCompanies]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
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
              // Loading skeleton - matches CompanyCard layout to prevent shift
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-surface rounded-xl p-6 animate-pulse"
                  >
                    {/* Top row: Badge and Batch placeholder */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-6 w-16 bg-foreground/10 rounded-full" />
                      <div className="h-4 w-10 bg-foreground/10 rounded" />
                    </div>
                    {/* Company name placeholder */}
                    <div className="h-6 bg-foreground/10 rounded w-2/5 mb-2" />
                    {/* Pitch placeholder (two lines) */}
                    <div className="h-4 bg-foreground/10 rounded w-full mb-2" />
                    <div className="h-4 bg-foreground/10 rounded w-3/4 mb-4" />
                    {/* Bottom row: Industry, Team size, Vote stats */}
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-24 bg-foreground/10 rounded" />
                      <div className="h-4 w-12 bg-foreground/10 rounded" />
                      <div className="h-4 w-32 bg-foreground/10 rounded ml-auto" />
                    </div>
                  </div>
                ))}
              </>
            ) : companies.length > 0 ? (
              // Company cards with fade-in animation
              <div className="animate-fade-in">
                {companies.map((company, index) => (
                  <div
                    key={company.slug}
                    className="mb-4 last:mb-0 animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
                  >
                    <CompanyCard
                      slug={company.slug}
                      name={company.yc_name}
                      batch={company.yc_batch}
                      pitch={company.hero}
                      outcome={company.source_outcome}
                      industry={company.yc_industry}
                      teamSize={company.yc_team_size}
                      shipPercentage={company.ship_percentage}
                      totalVotes={company.total_votes}
                    />
                  </div>
                ))}

                {/* Sentinel element for infinite scroll */}
                <div ref={sentinelRef} className="h-4" />

                {/* Loading more spinner */}
                {loadingMore && (
                  <div className="flex justify-center py-6 animate-fade-in">
                    <div className="flex items-center gap-3 text-foreground/60">
                      <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground/60 rounded-full animate-spin" />
                      <span>Loading more companies...</span>
                    </div>
                  </div>
                )}

                {/* End of results message */}
                {!hasMore && companies.length > 0 && (
                  <div className="text-center py-6 text-foreground/50 text-sm animate-fade-in">
                    You&apos;ve reached the end ({companies.length.toLocaleString()} companies)
                  </div>
                )}
              </div>
            ) : (
              // Empty state - no results with fade-in
              <div className="bg-surface rounded-xl p-8 text-center animate-fade-in">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">
                  No companies found
                </h3>
                <p className="text-foreground/60 text-sm">
                  Try adjusting your search or filters to find what you&apos;re looking for
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
