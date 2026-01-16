"use client";

interface InsightFlag {
  type: "green" | "red" | "yellow";
  message: string;
}

interface InsightsFlagsProps {
  flags: InsightFlag[];
}

function getFlagIcon(type: InsightFlag["type"]): string {
  switch (type) {
    case "green":
      return "🟢";
    case "red":
      return "🔴";
    case "yellow":
      return "🟡";
  }
}

function getFlagStyle(type: InsightFlag["type"]): string {
  switch (type) {
    case "green":
      return "bg-ship/10 border-ship/30 text-ship";
    case "red":
      return "bg-skip/10 border-skip/30 text-skip";
    case "yellow":
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500";
  }
}

export function InsightsFlags({ flags }: InsightsFlagsProps) {
  if (flags.length === 0) {
    return null;
  }

  // Sort flags: green first, then yellow, then red
  const sortedFlags = [...flags].sort((a, b) => {
    const order = { green: 0, yellow: 1, red: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <section className="bg-surface rounded-xl p-6">
      <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">
        Key Insights
      </h2>

      <div className="space-y-3">
        {sortedFlags.map((flag, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getFlagStyle(flag.type)}`}
          >
            <span className="text-lg flex-shrink-0">{getFlagIcon(flag.type)}</span>
            <p className="text-sm leading-relaxed">{flag.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
