"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [companyCount, setCompanyCount] = useState<number | null>(null);
  const [featuredCompany, setFeaturedCompany] = useState<string | null>(null);
  const [featuredSkipPct, setFeaturedSkipPct] = useState<number | null>(null);

  // Fetch landing stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/landing-stats");
        if (response.ok) {
          const data = await response.json();
          setCompanyCount(data.company_count);
          if (data.featured_has_votes) {
            setFeaturedCompany(data.featured_company_name);
            setFeaturedSkipPct(data.featured_skip_percentage);
          }
        }
      } catch {
        // Silently fail - will show fallback
      }
    }
    fetchStats();
  }, []);

  // Format company count (e.g., "5,500+")
  const displayCount = companyCount
    ? `${Math.floor(companyCount / 100) * 100}+`
    : "5,500+";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Ship or Skip"
          width={120}
          height={120}
          className="rounded-2xl shadow-2xl"
          priority
        />

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Can you spot a <span className="text-purple-500">unicorn</span>?
        </h1>

        {/* Hook stat */}
        <div className="bg-surface rounded-2xl px-6 py-4">
          <p className="text-lg sm:text-xl">
            <span className="text-skip font-bold">
              {featuredSkipPct !== null ? `${featuredSkipPct}%` : "67%"}
            </span>{" "}
            would have skipped {featuredCompany || "Airbnb"}.
          </p>
          <p className="text-sm text-foreground/60 mt-1">
            {displayCount} real YC startups. What would you have invested in?
          </p>
        </div>

        {/* Three CTAs */}
        <div className="grid gap-4 w-full">
          {/* Explore CTA */}
          <Link
            href="/explore"
            className="group bg-surface border border-foreground/10 rounded-xl p-5 hover:border-purple-500/50 hover:bg-surface/80 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">🔍</span>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-foreground group-hover:text-purple-400 transition-colors">
                  Explore Companies
                </h2>
                <p className="text-sm text-foreground/60 mt-1">
                  Search and filter {displayCount} YC startups. Discover unicorns, acquisitions, and what didn&apos;t make it.
                </p>
              </div>
              <span className="text-foreground/30 group-hover:text-purple-400 transition-colors">
                →
              </span>
            </div>
          </Link>

          {/* Validate CTA */}
          <Link
            href="/validate"
            className="group bg-surface border border-foreground/10 rounded-xl p-5 hover:border-ship/50 hover:bg-surface/80 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-foreground group-hover:text-ship transition-colors">
                  Validate Your Pitch
                </h2>
                <p className="text-sm text-foreground/60 mt-1">
                  Compare your startup idea to YC history. See similar companies and their outcomes.
                </p>
              </div>
              <span className="text-foreground/30 group-hover:text-ship transition-colors">
                →
              </span>
            </div>
          </Link>

          {/* Play CTA */}
          <Link
            href="/play"
            className="group bg-ship/10 border border-ship/30 rounded-xl p-5 hover:border-ship hover:bg-ship/20 transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">🎮</span>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-ship">
                  Start Playing
                </h2>
                <p className="text-sm text-foreground/60 mt-1">
                  Swipe through real pitches. Vote Ship or Skip. Build your Oracle Score.
                </p>
              </div>
              <span className="text-ship/50 group-hover:text-ship transition-colors">
                →
              </span>
            </div>
          </Link>
        </div>

        {/* Secondary links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/60">
          <Link href="/submit" className="hover:text-foreground underline">
            Submit your startup
          </Link>
          <span className="text-foreground/30">•</span>
          <Link href="/stats" className="hover:text-foreground underline">
            Check your stats
          </Link>
        </div>
      </main>
    </div>
  );
}
