"use client";

interface IndustryInsightsProps {
  detected_industry: string | null;
  total_in_industry: number;
  unicorn_rate: number;
  dead_rate: number;
  active_rate: number;
  avg_unicorn_rate: number;
  competition_level: number;
}

export function IndustryInsights({
  detected_industry,
  total_in_industry,
  unicorn_rate,
  dead_rate,
  active_rate,
  avg_unicorn_rate,
  competition_level,
}: IndustryInsightsProps) {
  if (!detected_industry) {
    return (
      <section className="bg-surface rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">
          Industry Analysis
        </h2>
        <p className="text-foreground/60 text-center py-4">
          Could not detect a specific industry from your pitch.
          <br />
          <span className="text-sm">Try adding more industry-specific keywords.</span>
        </p>
      </section>
    );
  }

  const unicornComparison = unicorn_rate - avg_unicorn_rate;
  const isAboveAverage = unicornComparison > 0;

  return (
    <section className="bg-surface rounded-xl p-6">
      <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">
        Industry Analysis
      </h2>

      {/* Detected Industry */}
      <div className="text-center mb-6">
        <span className="text-2xl mb-2 block">📁</span>
        <h3 className="text-xl font-bold mb-1">{detected_industry}</h3>
        <p className="text-sm text-foreground/60">
          {total_in_industry.toLocaleString()} YC companies in this space
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{unicorn_rate}%</div>
          <div className="text-xs text-foreground/50">Unicorn Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground/80">{active_rate}%</div>
          <div className="text-xs text-foreground/50">Still Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-skip">{dead_rate}%</div>
          <div className="text-xs text-foreground/50">Failed</div>
        </div>
      </div>

      {/* Unicorn Rate Comparison */}
      <div className="bg-background/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground/70">Unicorn Rate vs YC Average</span>
          <span className={`text-sm font-semibold ${isAboveAverage ? "text-ship" : "text-skip"}`}>
            {isAboveAverage ? "+" : ""}{unicornComparison}%
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/50">
          <span>{detected_industry}: {unicorn_rate}%</span>
          <span>•</span>
          <span>YC Avg: {avg_unicorn_rate}%</span>
        </div>
      </div>

      {/* Competition Level */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground/70">Competition Level</span>
          <span className="text-sm font-semibold">
            {competition_level < 30 ? "Low" : competition_level < 60 ? "Medium" : "High"}
          </span>
        </div>
        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              competition_level < 30
                ? "bg-ship"
                : competition_level < 60
                ? "bg-yellow-500"
                : "bg-skip"
            }`}
            style={{ width: `${competition_level}%` }}
          />
        </div>
      </div>
    </section>
  );
}
