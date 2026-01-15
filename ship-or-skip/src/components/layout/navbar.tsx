"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const navLinks = [
  { href: "/vote", label: "Vote" },
  { href: "/battle", label: "Battle" },
  { href: "/submit", label: "Submit" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/stats", label: "Stats" },
];

const MIN_RESOLVED_VOTES = 10;

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [oracleScore, setOracleScore] = useState<number | null>(null);
  const [resolvedVotes, setResolvedVotes] = useState<number>(0);

  const fetchOracleScore = useCallback(async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.resolved_votes >= MIN_RESOLVED_VOTES && data.oracle_score !== null) {
          setOracleScore(data.oracle_score);
          setResolvedVotes(data.resolved_votes);
        } else {
          setOracleScore(null);
          setResolvedVotes(data.resolved_votes || 0);
        }
      }
    } catch {
      // Silently fail - score won't be shown
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchOracleScore();
  }, [fetchOracleScore]);

  // Re-fetch when navigating (to update after votes)
  useEffect(() => {
    fetchOracleScore();
  }, [pathname, fetchOracleScore]);

  // Listen for custom event to refresh score after voting
  useEffect(() => {
    const handleScoreUpdate = () => {
      fetchOracleScore();
    };
    window.addEventListener("oracle-score-update", handleScoreUpdate);
    return () => {
      window.removeEventListener("oracle-score-update", handleScoreUpdate);
    };
  }, [fetchOracleScore]);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Ship or Skip"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-ship ${
                  pathname === link.href
                    ? "text-ship"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Oracle Score Display */}
            {oracleScore !== null && (
              <Link
                href="/stats"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 rounded-full text-sm font-semibold text-purple-400 hover:bg-purple-600/30 transition-colors"
                title="Your Oracle Score - prediction accuracy"
              >
                <span>🔮</span>
                <span>{oracleScore.toFixed(0)}%</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden min-w-11 min-h-11 p-2 text-foreground/70 hover:text-foreground transition-colors flex items-center justify-center"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-4 border-t border-foreground/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`min-h-11 flex items-center px-3 py-2 text-base font-medium transition-colors rounded-lg hover:text-ship hover:bg-foreground/5 ${
                    pathname === link.href
                      ? "text-ship"
                      : "text-foreground/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Oracle Score Display */}
              {oracleScore !== null && (
                <Link
                  href="/stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="min-h-11 flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg bg-purple-600/20 text-purple-400 mt-2"
                >
                  <span>🔮</span>
                  <span>Oracle Score: {oracleScore.toFixed(0)}%</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
