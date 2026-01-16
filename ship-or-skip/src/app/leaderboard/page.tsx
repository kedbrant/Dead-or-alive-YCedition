import { Suspense } from "react";
import { LeaderboardClient } from "./leaderboard-client";

function LeaderboardLoading() {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          Leaderboard
        </h1>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-foreground/10 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-foreground/10 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-foreground/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardLoading />}>
      <LeaderboardClient />
    </Suspense>
  );
}
