"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import { SourceOutcome } from "@/lib/supabase/types";

interface BattleCompanyResult {
  id: string;
  hero: string;
  yc_name: string | null;
  yc_logo_url: string | null;
  yc_slug: string | null;
  source_outcome: SourceOutcome;
  isWinner: boolean;
}

interface BattleResultProps {
  left: BattleCompanyResult;
  right: BattleCompanyResult;
  userChoice: "left" | "right";
  isCorrect: boolean;
  crowdAccuracy: number;
  onNext: () => void;
}

function CompanyReveal({ company }: { company: BattleCompanyResult }) {
  const displayName = company.yc_name || "Unknown Company";
  const logoUrl = company.yc_logo_url;
  const initial = displayName.charAt(0).toUpperCase();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`
        flex flex-col items-center p-4 rounded-xl
        ${company.isWinner ? "bg-ship/10 border-2 border-ship/30" : "bg-skip/10 border-2 border-skip/30"}
      `}
    >
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-3 overflow-hidden border border-foreground/10 relative">
        {logoUrl && !imgError ? (
          <Image
            src={logoUrl}
            alt={displayName}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-bold text-foreground/50">{initial}</span>
        )}
      </div>

      {/* Company name */}
      <h3 className="text-lg font-bold text-center mb-2">{displayName}</h3>

      {/* Outcome badge */}
      <OutcomeBadge outcome={company.source_outcome} size="md" />

      {/* Winner/Loser label */}
      <div
        className={`
          mt-3 text-xs font-bold
          ${company.isWinner ? "text-ship" : "text-skip"}
        `}
      >
        {company.isWinner ? "WINNER" : "LOSER"}
      </div>

      {/* Link to company page */}
      {company.yc_slug && (
        <Link
          href={`/company/${company.yc_slug}`}
          className="mt-3 text-xs text-foreground/60 hover:text-foreground underline"
        >
          View Details
        </Link>
      )}
    </div>
  );
}

export function BattleResult({
  left,
  right,
  userChoice,
  isCorrect,
  crowdAccuracy,
  onNext,
}: BattleResultProps) {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Result header */}
      <div className="text-center mb-6">
        <div
          className={`
            text-4xl mb-2
          `}
        >
          {isCorrect ? "🎯" : "😬"}
        </div>
        <h2
          className={`
            text-2xl font-bold mb-1
            ${isCorrect ? "text-ship" : "text-skip"}
          `}
        >
          {isCorrect ? "Correct!" : "Wrong!"}
        </h2>
        <p className="text-foreground/70">
          {isCorrect
            ? "You spotted the winner!"
            : "The other one was more successful."}
        </p>
      </div>

      {/* Company reveals */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <CompanyReveal company={left} />
        <CompanyReveal company={right} />
      </div>

      {/* Your choice indicator */}
      <div className="text-center text-sm text-foreground/60 mb-4">
        You chose: <span className="font-medium">{userChoice === "left" ? left.yc_name : right.yc_name}</span>
      </div>

      {/* Crowd accuracy */}
      <div className="text-center mb-6 p-4 bg-surface/50 rounded-xl border border-foreground/10">
        <div className="text-3xl font-bold text-foreground mb-1">
          {crowdAccuracy.toFixed(0)}%
        </div>
        <div className="text-sm text-foreground/60">
          of players got this right
        </div>
      </div>

      {/* Next button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="
            px-8 py-3 bg-ship text-white font-semibold rounded-full
            hover:bg-ship/90 hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-150
          "
        >
          Next Battle
        </button>
      </div>
    </div>
  );
}
