interface ScoreDisplayProps {
  score: number;
  scoreReasoning: string;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Risky";
  return "Caution";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return "stroke-green-500";
  if (score >= 60) return "stroke-yellow-500";
  if (score >= 40) return "stroke-orange-500";
  return "stroke-red-500";
}

function getScoreBgGlow(score: number): string {
  if (score >= 80) return "shadow-[0_0_60px_rgba(34,197,94,0.15)]";
  if (score >= 60) return "shadow-[0_0_60px_rgba(234,179,8,0.15)]";
  if (score >= 40) return "shadow-[0_0_60px_rgba(249,115,22,0.15)]";
  return "shadow-[0_0_60px_rgba(239,68,68,0.15)]";
}

export function ScoreDisplay({ score, scoreReasoning }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className={`bg-surface rounded-2xl p-8 text-center ${getScoreBgGlow(score)}`}>
      {/* Score Ring Gauge with Score Inside */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-foreground/10"
          />
          {/* Score ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={getScoreRingColor(score)}
            style={{
              transition: "stroke-dasharray 0.5s ease-out",
            }}
          />
        </svg>
        {/* Score inside the circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xl text-foreground/60">/100</span>
          </div>
        </div>
      </div>

      {/* Classification label below the circle */}
      <div className="mb-6">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      </div>

      {/* Score Reasoning */}
      <p className="text-foreground/80 max-w-md mx-auto leading-relaxed">
        {scoreReasoning}
      </p>
    </div>
  );
}
