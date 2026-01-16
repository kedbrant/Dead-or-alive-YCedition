"use client";

interface CategoryStatsProps {
  total: number;
  unicorn_pct: number;
  acquired_pct: number;
  dead_pct: number;
  active_pct: number;
}

export function CategoryStats({
  total,
  unicorn_pct,
  acquired_pct,
  dead_pct,
  active_pct,
}: CategoryStatsProps) {
  const categories = [
    { label: "Unicorn", emoji: "🦄", pct: unicorn_pct, color: "bg-yellow-500" },
    { label: "Acquired", emoji: "🤝", pct: acquired_pct, color: "bg-blue-500" },
    { label: "Dead", emoji: "💀", pct: dead_pct, color: "bg-red-500" },
    { label: "Active", emoji: "🚀", pct: active_pct, color: "bg-green-500" },
  ];

  if (total === 0) {
    return (
      <section className="bg-surface rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">CATEGORY STATS</h2>
        <p className="text-foreground/60 text-center py-4">
          No statistics available
        </p>
      </section>
    );
  }

  return (
    <section className="bg-surface rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">CATEGORY STATS</h2>

      {/* Total count */}
      <p className="text-foreground/70 mb-6">
        Based on <span className="font-semibold text-foreground">{total}</span>{" "}
        similar companies
      </p>

      {/* Percentage summary line */}
      <div className="flex items-center justify-center gap-2 text-lg mb-6 flex-wrap">
        {categories.map((cat, index) => (
          <span key={cat.label} className="flex items-center gap-1">
            <span>{cat.emoji}</span>
            <span className="font-semibold">{cat.pct}%</span>
            {index < categories.length - 1 && (
              <span className="text-foreground/30 ml-2">|</span>
            )}
          </span>
        ))}
      </div>

      {/* Visual bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-foreground/10">
        {categories.map(
          (cat) =>
            cat.pct > 0 && (
              <div
                key={cat.label}
                className={`${cat.color} transition-all`}
                style={{ width: `${cat.pct}%` }}
                title={`${cat.label}: ${cat.pct}%`}
              />
            )
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <span className="text-sm text-foreground/70">
              {cat.emoji} {cat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
