"use client";

import { TrendsData } from "@/lib/supabase/types";

interface TrendsSectionProps {
  summary: string;
  data: TrendsData | null;
}

function getBarColor(value: number): string {
  if (value >= 80) return "bg-green-500";
  if (value >= 60) return "bg-yellow-500";
  if (value >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function getTrendIndicator(changePercent: number): {
  label: string;
  color: string;
  icon: "up" | "down" | "stable";
} {
  if (changePercent >= 50) {
    return { label: "Growing rapidly", color: "text-green-500", icon: "up" };
  }
  if (changePercent >= 10) {
    return { label: "Growing", color: "text-green-400", icon: "up" };
  }
  if (changePercent >= -10) {
    return { label: "Stable", color: "text-yellow-500", icon: "stable" };
  }
  if (changePercent >= -50) {
    return { label: "Declining", color: "text-orange-500", icon: "down" };
  }
  return { label: "Declining rapidly", color: "text-red-500", icon: "down" };
}

function getInterestLevel(currentLevel: number): {
  label: string;
  color: string;
} {
  if (currentLevel >= 80) {
    return { label: "Very High", color: "text-green-500" };
  }
  if (currentLevel >= 60) {
    return { label: "High", color: "text-green-400" };
  }
  if (currentLevel >= 40) {
    return { label: "Moderate", color: "text-yellow-500" };
  }
  if (currentLevel >= 20) {
    return { label: "Low", color: "text-orange-500" };
  }
  return { label: "Very Low", color: "text-red-500" };
}

export function TrendsSection({ summary, data }: TrendsSectionProps) {
  if (!data) {
    return (
      <div className="bg-surface rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-1">MARKET TRENDS</h2>
        <p className="text-foreground/60 text-sm mb-4">
          Search interest over time
        </p>
        <p className="text-foreground/60 text-sm italic">
          Trends data not available for this topic.
        </p>
        {summary && <p className="text-foreground/80 mt-4">{summary}</p>}
      </div>
    );
  }

  const trendIndicator = getTrendIndicator(data.changePercent);
  const interestLevel = getInterestLevel(data.currentLevel);

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-1">MARKET TRENDS</h2>
      <p className="text-foreground/60 text-sm mb-4">
        Search interest over time
      </p>

      {/* Current Level and Change */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{data.currentLevel}</span>
            <span className="text-foreground/60">/100</span>
          </div>
          <p className={`text-sm ${interestLevel.color}`}>
            {interestLevel.label} interest
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-medium flex items-center gap-1 justify-end ${trendIndicator.color}`}
          >
            {trendIndicator.icon === "up" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trendIndicator.icon === "down" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trendIndicator.icon === "stable" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>
              {data.changePercent >= 0 ? "+" : ""}
              {data.changePercent}%
            </span>
          </div>
          <p className={`text-sm ${trendIndicator.color}`}>
            {trendIndicator.label}
          </p>
        </div>
      </div>

      {/* Trend Line Chart */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="mb-4">
          {/* SVG Line Chart */}
          <div className="relative h-32 w-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line
                x1="0"
                y1="10"
                x2="100"
                y2="10"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="20"
                x2="100"
                y2="20"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="30"
                x2="100"
                y2="30"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="0.5"
              />

              {/* Area fill */}
              <path
                d={`M0,40 ${data.timeline
                  .map((point, index) => {
                    const x = (index / (data.timeline.length - 1)) * 100;
                    const y = 40 - (point.value / 100) * 40;
                    return `L${x},${y}`;
                  })
                  .join(" ")} L100,40 Z`}
                fill="url(#trendGradient)"
                opacity="0.3"
              />

              {/* Line */}
              <polyline
                points={data.timeline
                  .map((point, index) => {
                    const x = (index / (data.timeline.length - 1)) * 100;
                    const y = 40 - (point.value / 100) * 40;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Gradient definitions */}
              <defs>
                <linearGradient
                  id="trendGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between text-xs text-foreground/40 mt-1">
            <span>
              {data.timeline[0]?.date || "Start"}
            </span>
            <span>
              {data.timeline[data.timeline.length - 1]?.date || "Now"}
            </span>
          </div>
        </div>
      )}

      {/* Bar Chart Alternative (shows if no timeline or as supplementary view) */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="h-20 flex items-end gap-0.5 mb-4">
          {data.timeline.map((point, index) => (
            <div
              key={index}
              className={`flex-1 ${getBarColor(point.value)} opacity-60 rounded-t transition-all hover:opacity-80`}
              style={{ height: `${Math.max(point.value, 5)}%` }}
              title={`${point.date}: ${point.value}/100`}
            />
          ))}
        </div>
      )}

      {/* AI Summary / Key Insight */}
      <p className="text-foreground/80">{summary}</p>
    </div>
  );
}
