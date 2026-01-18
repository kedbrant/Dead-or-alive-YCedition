"use client";

import { useState } from "react";
import Link from "next/link";
import type { YCCompanyMatch, SourceOutcome, DiscoveredCompany, PHProduct, CompanyStatus } from "@/lib/supabase/types";

interface CompetitorAnalysisSectionProps {
  // YC Companies
  ycSummary: string;
  ycCompanies: YCCompanyMatch[];
  outcomeCounts: {
    unicorn: number;
    acquired: number;
    dead: number;
    active: number;
  };
  // Discovered Competitors
  competitorsSummary?: string;
  competitors?: DiscoveredCompany[];
  // Product Hunt
  phSummary?: string;
  phProducts?: PHProduct[];
}

function getOutcomeEmoji(outcome: SourceOutcome): string {
  switch (outcome) {
    case "unicorn": return "🦄";
    case "acquired": return "🤝";
    case "dead": return "💀";
    case "active": return "🚀";
    default: return "❓";
  }
}

const statusStyles: Record<CompanyStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-500/10", text: "text-green-500", label: "Active" },
  acquired: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Acquired" },
  dead: { bg: "bg-foreground/10", text: "text-foreground/50", label: "Shut Down" },
  unknown: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Unknown" },
};

interface CollapsibleSectionProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, count, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-foreground/10 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-foreground/5 rounded-lg px-2 -mx-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-sm text-foreground/50">({count})</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-5 h-5 text-foreground/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function CompetitorAnalysisSection({
  ycSummary,
  ycCompanies,
  outcomeCounts,
  competitorsSummary,
  competitors,
  phSummary,
  phProducts,
}: CompetitorAnalysisSectionProps) {
  const hasCompetitors = competitors && competitors.length > 0;
  const hasProducts = phProducts && phProducts.length > 0;

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-1">COMPETITOR ANALYSIS</h2>
      <p className="text-foreground/60 text-sm mb-4">
        Similar companies across YC, market, and recent launches
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

      {/* YC Companies Section */}
      <CollapsibleSection title="YC Companies" count={ycCompanies.length} defaultOpen={true}>
        <p className="text-foreground/70 text-sm mb-3">{ycSummary}</p>
        {ycCompanies.length > 0 ? (
          <div className="space-y-2">
            {ycCompanies.slice(0, 8).map((company, index) => {
              const content = (
                <>
                  <span className="text-xl">{getOutcomeEmoji(company.outcome)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{company.name}</span>
                      {company.batch && (
                        <span className="text-xs text-foreground/60">{company.batch}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 truncate">{company.pitch}</p>
                  </div>
                </>
              );

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

              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 bg-foreground/5 rounded-xl">
            <p className="text-foreground/60 text-sm">No similar YC companies found.</p>
          </div>
        )}
      </CollapsibleSection>

      {/* Other Competitors Section */}
      {hasCompetitors && (
        <CollapsibleSection title="Other Competitors" count={competitors.length} defaultOpen={true}>
          <p className="text-foreground/70 text-sm mb-3">{competitorsSummary}</p>
          <div className="space-y-2">
            {competitors.slice(0, 8).map((company, index) => {
              const style = statusStyles[company.status];
              return (
                <div key={index} className="flex items-start justify-between gap-4 p-3 bg-foreground/5 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{company.name}</div>
                    <div className="text-sm text-foreground/60 mt-1">{company.description}</div>
                  </div>
                  <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
                    {style.label}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Product Hunt Section */}
      {hasProducts && (
        <CollapsibleSection title="Product Hunt Launches" count={phProducts.length} defaultOpen={true}>
          <p className="text-foreground/70 text-sm mb-3">{phSummary}</p>
          <div className="space-y-2">
            {phProducts.slice(0, 8).map((product, index) => (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{product.name}</div>
                  <div className="text-sm text-foreground/60 mt-1 line-clamp-2">{product.tagline}</div>
                </div>
                {product.votesCount > 0 && (
                  <div className="flex-shrink-0 flex items-center gap-1 bg-yc-orange/10 text-yc-orange px-2 py-1 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    {product.votesCount}
                  </div>
                )}
              </a>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
