"use client";

import Link from "next/link";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import { SimilarCompanyResult } from "@/lib/similarity";

interface SimilarCompaniesProps {
  companies: SimilarCompanyResult[];
}

export function SimilarCompanies({ companies }: SimilarCompaniesProps) {
  if (companies.length === 0) {
    return (
      <section className="bg-surface rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">SIMILAR YC COMPANIES (0 found)</h2>
        <div className="text-center py-8">
          <p className="text-foreground/60 text-lg mb-2">
            No similar companies found
          </p>
          <p className="text-foreground/40 text-sm">
            Try adjusting your pitch to be more specific or use different keywords
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">
        SIMILAR YC COMPANIES ({companies.length} found)
      </h2>
      <div className="grid gap-4">
        {companies.map((result) => (
          <SimilarCompanyCard key={result.company.slug} result={result} />
        ))}
      </div>
    </section>
  );
}

interface SimilarCompanyCardProps {
  result: SimilarCompanyResult;
}

function SimilarCompanyCard({ result }: SimilarCompanyCardProps) {
  const { company, score } = result;

  return (
    <div className="bg-surface rounded-xl p-6 border border-transparent hover:border-foreground/10 transition-all">
      {/* Top row: Badge, Batch, and Similarity Score */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {company.source_outcome && (
            <OutcomeBadge outcome={company.source_outcome} size="sm" />
          )}
          {company.yc_batch && (
            <span className="text-sm font-medium text-foreground/60">
              {company.yc_batch}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-ship">
          Similarity: {score}%
        </span>
      </div>

      {/* Company name */}
      <h3 className="text-lg font-bold mb-2">
        {company.yc_name || "Unknown Company"}
      </h3>

      {/* One-liner pitch */}
      <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
        {company.hero}
      </p>

      {/* View button */}
      <Link
        href={`/company/${company.slug}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm font-medium transition-colors"
      >
        View Company
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
