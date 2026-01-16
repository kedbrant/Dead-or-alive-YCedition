"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [companyCount, setCompanyCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch landing stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/landing-stats");
        if (response.ok) {
          const data = await response.json();
          setCompanyCount(data.company_count);
        }
      } catch {
        // Silently fail - will show fallback
      }
    }
    fetchStats();
  }, []);

  // Format company count (e.g., "5,400+")
  const displayCount = companyCount
    ? `${Math.floor(companyCount / 100) * 100}+`
    : "5,400+";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  // Focus input on / key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center w-full">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="YC Startup Database"
          width={80}
          height={80}
          className="rounded-xl shadow-lg"
          priority
        />

        {/* Headline - emphasis on data */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            <span className="text-ship">{displayCount}</span> YC Startups
          </h1>
          <p className="text-foreground/60 text-lg sm:text-xl max-w-md mx-auto">
            Search outcomes, discover unicorns, and see what failed.
            Real data from Y Combinator companies.
          </p>
        </div>

        {/* Search Bar - wider */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40"
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
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, pitches, industries..."
              className="w-full pl-14 pr-28 py-5 bg-surface border border-foreground/20 rounded-2xl
                text-lg placeholder:text-foreground/40
                focus:outline-none focus:border-ship focus:ring-2 focus:ring-ship/20
                transition-all shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-ship text-white font-semibold rounded-xl
                hover:bg-ship/90 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick filters */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/explore?outcome=unicorn"
            className="px-4 py-2 bg-surface border border-foreground/10 rounded-full text-sm
              hover:border-purple-500/50 hover:text-purple-400 transition-colors"
          >
            🦄 Unicorns
          </Link>
          <Link
            href="/explore?outcome=dead"
            className="px-4 py-2 bg-surface border border-foreground/10 rounded-full text-sm
              hover:border-skip/50 hover:text-skip transition-colors"
          >
            💀 Dead
          </Link>
          <Link
            href="/explore?outcome=acquired"
            className="px-4 py-2 bg-surface border border-foreground/10 rounded-full text-sm
              hover:border-blue-500/50 hover:text-blue-400 transition-colors"
          >
            🤝 Acquired
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-foreground/10 my-2" />

        {/* Other features */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-foreground/60">
          <Link href="/play" className="hover:text-ship transition-colors underline underline-offset-2">
            Play the prediction game
          </Link>
          <span className="text-foreground/30">•</span>
          <Link href="/validate" className="hover:text-ship transition-colors underline underline-offset-2">
            Validate your startup idea
          </Link>
        </div>
      </main>
    </div>
  );
}
