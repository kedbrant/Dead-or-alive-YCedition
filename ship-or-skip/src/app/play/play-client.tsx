"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VotingClient } from "./voting-client";

type GameMode = "classic" | "battle" | null;

interface PlayClientProps {
  sessionId: string;
}

export function PlayClient({ sessionId }: PlayClientProps) {
  const router = useRouter();
  const [handle, setHandle] = useState<string | null>(null);
  const [inputHandle, setInputHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);

  // Check if user already has a handle registered
  useEffect(() => {
    async function checkHandle() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          if (data.twitter_handle) {
            setHandle(data.twitter_handle);
          }
        }
      } catch {
        // Ignore error, just show registration form
      } finally {
        setLoading(false);
      }
    }
    checkHandle();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanHandle = inputHandle.replace(/^@/, "").trim();
    if (!cleanHandle) {
      setError("Please enter your X handle");
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      const response = await fetch("/api/session/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          twitter_handle: cleanHandle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const data = await response.json();
      setHandle(data.handle);
    } catch {
      setError("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-foreground/10 rounded w-3/4 mx-auto mb-4" />
            <div className="h-5 bg-foreground/10 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Handle registration form
  if (!handle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-[28px] font-bold mb-3">
              Ready to play?
            </h1>
            <p className="text-[16px] text-foreground/70">
              Enter your X handle to track your predictions and compete on the leaderboard.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-foreground/80 mb-2">
                Your X (Twitter) Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">
                  @
                </span>
                <input
                  id="handle"
                  type="text"
                  value={inputHandle}
                  onChange={(e) => setInputHandle(e.target.value)}
                  placeholder="yourhandle"
                  className="w-full pl-9 pr-4 py-4 bg-background border border-foreground/20 rounded-xl
                    text-[16px] placeholder:text-foreground/40
                    focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
                    transition-colors"
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {error && (
              <p className="text-skip text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={registering || !inputHandle.trim()}
              className="w-full py-4 bg-ship text-white font-bold text-lg rounded-xl
                transition-all duration-150
                hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {registering ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "Start Playing"
              )}
            </button>
          </form>

          <p className="text-center text-foreground/50 text-sm mt-6">
            Your handle is used for the leaderboard and to credit your submissions.
          </p>
        </div>
      </div>
    );
  }

  // Game mode selection
  if (!gameMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Mode</h1>
            <p className="text-foreground/60">How do you want to play?</p>
          </div>

          <div className="grid gap-4">
            {/* Classic Mode */}
            <button
              onClick={() => setGameMode("classic")}
              className="group bg-surface border-2 border-foreground/10 rounded-2xl p-6 text-left
                hover:border-ship hover:bg-ship/5 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">🎯</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-ship transition-colors">
                    Classic Mode
                  </h2>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    Swipe through real YC startup pitches one at a time. Vote Ship or Skip,
                    then see the actual outcome. Build your Oracle Score by correctly predicting
                    which startups succeeded.
                  </p>
                  <div className="flex gap-4 mt-3 text-xs text-foreground/50">
                    <span>🔮 Build Oracle Score</span>
                    <span>📊 Track your stats</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Battle Mode */}
            <button
              onClick={() => router.push("/battle")}
              className="group bg-surface border-2 border-foreground/10 rounded-2xl p-6 text-left
                hover:border-purple-500 hover:bg-purple-500/5 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">⚔️</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    Battle Mode
                  </h2>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    Two startups go head-to-head. Pick which one was more successful.
                    Test your instincts with direct comparisons between real companies
                    and their outcomes.
                  </p>
                  <div className="flex gap-4 mt-3 text-xs text-foreground/50">
                    <span>🆚 Head-to-head</span>
                    <span>⚡ Fast decisions</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has handle and selected classic mode, show voting
  return <VotingClient sessionId={sessionId} />;
}
