"use client";

interface ViabilityScoreProps {
  score: number;
  similarCount: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-ship";
  if (score >= 50) return "text-yellow-500";
  return "text-skip";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 50) return "Moderate";
  if (score >= 40) return "Challenging";
  return "High Risk";
}

function getScoreEmoji(score: number): string {
  if (score >= 80) return "🚀";
  if (score >= 70) return "✨";
  if (score >= 60) return "👍";
  if (score >= 50) return "🤔";
  if (score >= 40) return "⚠️";
  return "💀";
}

export function ViabilityScore({ score, similarCount }: ViabilityScoreProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const emoji = getScoreEmoji(score);

  // Calculate ring progress (score out of 100)
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <section className="bg-surface rounded-xl p-6">
      <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-6 text-center">
        Viability Score
      </h2>

      <div className="flex flex-col items-center">
        {/* Circular progress indicator */}
        <div className="relative w-32 h-32 mb-4">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-foreground/10"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={color}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease-out",
              }}
            />
          </svg>
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color}`}>{score}</span>
            <span className="text-xs text-foreground/50">/100</span>
          </div>
        </div>

        {/* Label */}
        <div className="text-center mb-4">
          <span className="text-2xl mr-2">{emoji}</span>
          <span className={`text-xl font-bold ${color}`}>{label}</span>
        </div>

        {/* Basis */}
        <p className="text-sm text-foreground/60 text-center">
          Based on {similarCount} similar YC companies
        </p>
      </div>
    </section>
  );
}
