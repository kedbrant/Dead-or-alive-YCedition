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
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Left: Score Ring + Label */}
      <div className="flex-shrink-0 text-center">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              className="stroke-foreground/10"
            />
            {/* Score ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
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
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-sm text-foreground/60">/100</span>
            </div>
          </div>
        </div>
        {/* Classification label */}
        <div className="mt-2">
          <span className={`text-lg font-bold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Right: Score Reasoning */}
      <div className="flex-1 flex items-center">
        <p className="text-foreground/80 leading-relaxed">
          {scoreReasoning}
        </p>
      </div>
    </div>
  );
}
