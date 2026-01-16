import Link from "next/link";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import { SourceOutcome } from "@/lib/supabase/types";

interface CompanyCardProps {
  slug: string;
  name: string;
  batch: string | null;
  pitch: string;
  outcome: SourceOutcome;
  industry: string | null;
  teamSize: number | null;
  shipPercentage: number;
  totalVotes: number;
}

export function CompanyCard({
  slug,
  name,
  batch,
  pitch,
  outcome,
  industry,
  teamSize,
  shipPercentage,
  totalVotes,
}: CompanyCardProps) {
  // Format batch as 'W09' or 'S21'
  const formattedBatch = batch || "";

  return (
    <Link href={`/company/${slug}`} className="block group">
      <div className="bg-surface rounded-xl p-6 transition-all duration-200 hover:bg-surface/80 hover:shadow-lg border border-transparent hover:border-foreground/10">
        {/* Top row: Badge and Batch */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {outcome && <OutcomeBadge outcome={outcome} size="sm" />}
            {formattedBatch && (
              <span className="text-sm font-medium text-foreground/60">
                {formattedBatch}
              </span>
            )}
          </div>
        </div>

        {/* Company name */}
        <h3 className="text-lg font-bold mb-2 group-hover:text-ship transition-colors">
          {name}
        </h3>

        {/* One-liner pitch */}
        <p className="text-foreground/80 text-sm mb-4 line-clamp-2">{pitch}</p>

        {/* Bottom row: Industry, Team size, Vote stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/60">
          {industry && (
            <span className="flex items-center gap-1">
              <span>📁</span>
              <span>{industry}</span>
            </span>
          )}
          {teamSize && teamSize > 0 && (
            <span className="flex items-center gap-1">
              <span>👥</span>
              <span>{teamSize}</span>
            </span>
          )}
          {totalVotes > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <span className="text-ship">{shipPercentage}% Ship</span>
              <span>•</span>
              <span>{totalVotes.toLocaleString()} votes</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
