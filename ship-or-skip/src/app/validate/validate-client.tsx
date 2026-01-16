"use client";

import { useState } from "react";
import Link from "next/link";
import { PitchInput } from "@/components/validate/pitch-input";
import { SimilarCompanies } from "@/components/validate/similar-companies";
import { CategoryStats } from "@/components/validate/category-stats";
import { SimilarCompanyResult } from "@/lib/similarity";

// Example pitches for inspiration
const EXAMPLE_PITCHES = [
  "A marketplace for renting out your unused parking space to commuters",
  "AI-powered code review that catches bugs before they reach production",
  "A platform connecting local farmers directly with restaurant chefs",
  "Mobile app that helps people split bills and track shared expenses",
];

interface CategoryStatsData {
  total: number;
  unicorn_pct: number;
  acquired_pct: number;
  dead_pct: number;
  active_pct: number;
}

interface ValidateResults {
  similar_companies: SimilarCompanyResult[];
  category_stats: CategoryStatsData;
}

// Skeleton components for loading state
function CategoryStatsSkeleton() {
  return (
    <section className="bg-surface rounded-xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-foreground/10 rounded mb-4" />
      <div className="h-4 w-64 bg-foreground/10 rounded mb-6" />
      <div className="flex items-center justify-center gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-16 bg-foreground/10 rounded" />
        ))}
      </div>
      <div className="h-4 w-full bg-foreground/10 rounded-full mb-4" />
      <div className="flex justify-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-20 bg-foreground/10 rounded" />
        ))}
      </div>
    </section>
  );
}

function SimilarCompanyCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl p-6 animate-pulse">
      {/* Top row: Badge and score */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-20 bg-foreground/10 rounded-full" />
          <div className="h-4 w-12 bg-foreground/10 rounded" />
        </div>
        <div className="h-4 w-24 bg-foreground/10 rounded" />
      </div>
      {/* Company name */}
      <div className="h-6 w-48 bg-foreground/10 rounded mb-2" />
      {/* Pitch */}
      <div className="h-4 w-full bg-foreground/10 rounded mb-2" />
      <div className="h-4 w-3/4 bg-foreground/10 rounded mb-4" />
      {/* Button */}
      <div className="h-10 w-32 bg-foreground/10 rounded-lg" />
    </div>
  );
}

function SimilarCompaniesSkeleton() {
  return (
    <section>
      <div className="h-6 w-64 bg-foreground/10 rounded mb-4 animate-pulse" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <SimilarCompanyCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function ValidateClient() {
  const [pitch, setPitch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ValidateResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (submittedPitch: string) => {
    setPitch(submittedPitch);
    setIsAnalyzing(true);
    setError(null);
    setResults(null); // Clear previous results to show loading state

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pitch: submittedPitch }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze pitch");
      }

      const data: ValidateResults = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error analyzing pitch:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPitch(example);
  };

  const handleEdit = () => {
    setResults(null);
  };

  // Loading state - show skeleton while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-[32px] md:text-[40px] font-bold mb-2">
              ANALYZING YOUR PITCH
            </h1>
            <p className="text-[16px] md:text-[18px] text-foreground/70">
              Comparing against 5,500+ YC companies...
            </p>
          </div>

          {/* User's Pitch Section - show the pitch being analyzed */}
          <section className="bg-surface rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">YOUR PITCH</h2>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <div className="w-4 h-4 border-2 border-foreground/30 border-t-ship rounded-full animate-spin" />
                Analyzing...
              </div>
            </div>
            <p className="text-foreground/80 text-lg">{pitch}</p>
          </section>

          {/* Category Stats Skeleton */}
          <div className="mb-6">
            <CategoryStatsSkeleton />
          </div>

          {/* Similar Companies Skeleton */}
          <div className="mb-8">
            <SimilarCompaniesSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Results state - show after successful analysis
  if (results) {
    const submitUrl = `/submit?pitch=${encodeURIComponent(pitch)}`;

    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-[32px] md:text-[40px] font-bold mb-2">
              VALIDATION RESULTS
            </h1>
            <p className="text-[16px] md:text-[18px] text-foreground/70">
              Here&apos;s how your pitch compares to YC companies
            </p>
          </div>

          {/* User's Pitch Section */}
          <section className="bg-surface rounded-xl p-6 mb-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">YOUR PITCH</h2>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>
            <p className="text-foreground/80 text-lg">{pitch}</p>
          </section>

          {/* Category Stats Section */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CategoryStats
              total={results.category_stats.total}
              unicorn_pct={results.category_stats.unicorn_pct}
              acquired_pct={results.category_stats.acquired_pct}
              dead_pct={results.category_stats.dead_pct}
              active_pct={results.category_stats.active_pct}
            />
          </div>

          {/* Similar Companies Section */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <SimilarCompanies companies={results.similar_companies} />
          </div>

          {/* Submit CTA Section */}
          <section className="bg-surface rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h2 className="text-xl font-bold mb-2">
              Want the crowd&apos;s opinion?
            </h2>
            <p className="text-foreground/70 mb-6">
              Submit your pitch to let thousands of people vote on whether they
              would Ship or Skip your startup idea.
            </p>
            <Link
              href={submitUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ship hover:bg-ship/90 text-white rounded-lg font-semibold transition-colors"
            >
              Submit for Crowd Voting
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </div>
    );
  }

  // Input state - initial state
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-2">
            VALIDATE YOUR STARTUP PITCH
          </h1>
          <p className="text-[16px] md:text-[18px] text-foreground/70">
            See how your idea compares to 5,500 YC companies
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-xl" role="img" aria-label="Error">⚠️</span>
              <div className="flex-1">
                <p className="text-red-400 font-medium mb-1">Analysis failed</p>
                <p className="text-red-400/80 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Pitch Input Section */}
        <section className="mb-8">
          <PitchInput
            onSubmit={handleAnalyze}
            loading={isAnalyzing}
            initialValue={pitch}
          />
        </section>

        {/* Example Pitches Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-foreground/80">
            Need inspiration? Try these examples:
          </h2>
          <div className="grid gap-3">
            {EXAMPLE_PITCHES.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left bg-surface hover:bg-surface/80 rounded-lg p-4 text-foreground/70 hover:text-foreground transition-colors border border-transparent hover:border-foreground/10"
              >
                <span className="text-foreground/40 mr-2">→</span>
                {example}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
