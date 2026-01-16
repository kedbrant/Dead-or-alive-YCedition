"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VoteType } from "./vote-buttons";
import { OutcomeBadge } from "./outcome-badge";
import { SourceOutcome } from "@/lib/supabase/types";

interface RevealOverlayProps {
  shipPercentage: number;
  totalVotes: number;
  userVote: VoteType;
  userAgreedWithCrowd: boolean;
  sourceCompany?: string | null;
  sourceOutcome?: string | null;
  submitterTwitter?: string | null;
  link?: string | null;
  isExiting?: boolean;
  onNext: () => void;
  onShare: () => void;
  // YC company fields
  ycName?: string | null;
  ycLogoUrl?: string | null;
  ycSlug?: string | null;
  source?: string | null;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

function getOutcomeLabel(outcome: string): { text: string; color: string } {
  // Handle revenue-based outcomes from TrustMRR
  if (outcome.includes("$1M") || outcome.includes("$2M") || outcome.includes("$7M") || outcome.includes("$8M")) {
    return { text: `${outcome} 🚀`, color: "text-ship" };
  }
  if (outcome.includes("$100k") || outcome.includes("$200k") || outcome.includes("$300k") || outcome.includes("$400k") || outcome.includes("$500k") || outcome.includes("$700k")) {
    return { text: `${outcome} 📈`, color: "text-ship" };
  }
  if (outcome.includes("$") && outcome.includes("k")) {
    return { text: `${outcome} 💰`, color: "text-foreground/80" };
  }
  if (outcome === "growing") {
    return { text: "Growing 🌱", color: "text-foreground/80" };
  }
  // Legacy YC outcomes
  switch (outcome) {
    case "ipo":
      return { text: "IPO 📈", color: "text-ship" };
    case "acquired":
      return { text: "Acquired 🤝", color: "text-ship" };
    case "active":
      return { text: "Active 🚀", color: "text-ship" };
    case "dead":
      return { text: "Dead 💀", color: "text-skip" };
    default:
      return { text: outcome, color: "text-foreground/80" };
  }
}

export function RevealOverlay({
  shipPercentage,
  totalVotes,
  userVote: _userVote,
  userAgreedWithCrowd,
  sourceCompany,
  sourceOutcome,
  submitterTwitter,
  link,
  isExiting = false,
  onNext,
  onShare,
  ycName,
  ycLogoUrl,
  ycSlug,
  source,
}: RevealOverlayProps) {
  void _userVote;
  const [imgError, setImgError] = useState(false);
  const emoji = shipPercentage >= 50 ? "🚀" : "💀";
  const crowdVerdict = shipPercentage >= 50 ? "shipped" : "skipped";
  const outcomeInfo = sourceOutcome ? getOutcomeLabel(sourceOutcome) : null;
  const isYcCompany = source === "yc";

  // Display name: YC name for YC companies, sourceCompany for others
  const displayName = isYcCompany && ycName ? ycName : sourceCompany;
  // Logo URL: YC logo for YC companies, favicon from link for others
  const logoUrl = isYcCompany && ycLogoUrl ? ycLogoUrl : (link ? getFaviconUrl(link) : null);
  const initial = (displayName || "?")[0].toUpperCase();

  return (
    <div className={`w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-8 text-center transition-all duration-200 ${isExiting ? "opacity-0 scale-95" : "animate-fade-in"}`}>
      {/* Company info - displayed prominently */}
      {displayName && (
        <div className="mb-6">
          {/* Company logo */}
          <div className="mb-4">
            {logoUrl && !imgError ? (
              link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-110 transition-transform"
                >
                  <Image
                    src={logoUrl}
                    alt={displayName || "Company"}
                    width={80}
                    height={80}
                    className="rounded-xl shadow-lg mx-auto"
                    unoptimized
                    onError={() => setImgError(true)}
                  />
                </a>
              ) : (
                <Image
                  src={logoUrl}
                  alt={displayName || "Company"}
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg mx-auto"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              )
            ) : (
              <div className="w-20 h-20 rounded-xl bg-foreground/10 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-foreground/40">{initial}</span>
              </div>
            )}
          </div>

          {/* Company name */}
          <h2 className="text-[28px] font-bold mb-3">{displayName}</h2>

          {/* Outcome badge for YC companies */}
          {isYcCompany && sourceOutcome && (
            <div className="mb-3">
              <OutcomeBadge outcome={sourceOutcome as SourceOutcome} size="lg" />
            </div>
          )}

          {/* Twitter handle for user submissions */}
          {!isYcCompany && submitterTwitter && (
            <a
              href={`https://twitter.com/${submitterTwitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              <Image
                src={`https://unavatar.io/twitter/${submitterTwitter}`}
                alt={submitterTwitter}
                width={24}
                height={24}
                className="rounded-full"
                unoptimized
              />
              <span>@{submitterTwitter}</span>
            </a>
          )}

          {/* Legacy outcome text for non-YC companies */}
          {!isYcCompany && outcomeInfo && (
            <p className={`mt-2 font-semibold ${outcomeInfo.color}`}>
              {outcomeInfo.text}
            </p>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mb-6 p-4 bg-background/50 rounded-xl">
        <span className="text-[48px] font-bold">
          {shipPercentage}% {emoji}
        </span>
        <p className="text-foreground/60 mt-2">
          of {totalVotes.toLocaleString()} voters {crowdVerdict} this
        </p>
      </div>

      {/* User agreement message */}
      <div className="mb-6">
        {userAgreedWithCrowd ? (
          <p className="text-ship font-semibold text-lg">
            ✓ You agreed with the crowd
          </p>
        ) : (
          <p className="text-skip font-semibold text-lg">
            ✗ You went against the crowd
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Read More link for YC companies */}
        {isYcCompany && ycSlug && (
          <Link
            href={`/company/${ycSlug}`}
            className="flex-1 min-h-12 px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-xl
              transition-all duration-150 flex items-center justify-center gap-2
              hover:bg-foreground/10 hover:border-foreground/40"
          >
            Read More
          </Link>
        )}
        {/* Visit link for non-YC companies with link */}
        {!isYcCompany && link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-12 px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-xl
              transition-all duration-150 flex items-center justify-center gap-2
              hover:bg-foreground/10 hover:border-foreground/40"
          >
            Visit 🔗
          </a>
        )}
        <button
          onClick={onShare}
          className="flex-1 min-h-12 px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-semibold rounded-xl
            transition-all duration-150
            hover:bg-foreground/10 hover:border-foreground/40"
        >
          Share 📤
        </button>
        <button
          onClick={onNext}
          className="flex-1 min-h-12 px-6 py-3 bg-ship text-white font-semibold rounded-xl
            transition-all duration-150
            hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
            active:scale-[0.98]"
        >
          Next →
        </button>
      </div>
      {/* Keyboard hint - hidden on mobile */}
      <div className="hidden sm:block text-center text-foreground/40 text-sm mt-4">
        Press → or Enter for next
      </div>
    </div>
  );
}
