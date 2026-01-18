"use client";

import type { DiscoveredCompany, CompanyStatus } from "@/lib/supabase/types";

interface CompetitorsSectionProps {
  summary: string;
  companies: DiscoveredCompany[];
}

const statusStyles: Record<CompanyStatus, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-500/10", text: "text-green-500", label: "Active" },
  acquired: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Acquired" },
  dead: { bg: "bg-foreground/10", text: "text-foreground/50", label: "Shut Down" },
  unknown: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Unknown" },
};

export function CompetitorsSection({ summary, companies }: CompetitorsSectionProps) {
  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide mb-4">
        Competitor Landscape
      </h2>

      {/* AI Summary */}
      <p className="text-foreground/80 mb-4">{summary}</p>

      {/* Companies List */}
      <div className="space-y-3">
        {companies.slice(0, 8).map((company, index) => {
          const style = statusStyles[company.status];
          return (
            <div
              key={index}
              className="p-4 bg-foreground/5 rounded-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{company.name}</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    {company.description}
                  </div>
                </div>
                <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${style.bg} ${style.text}`}>
                  {style.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
