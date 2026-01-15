"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [showHandleInput, setShowHandleInput] = useState(false);
  const [handle, setHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartClick = () => {
    setShowHandleInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handle.trim()) {
      setError("Please enter your Twitter/X handle");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get or create session ID from cookie
      const sessionId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ship-or-skip-session="))
        ?.split("=")[1];

      // If no session exists yet, we'll let the middleware create it
      // and register after redirect. For now, create a temporary one.
      const finalSessionId = sessionId || crypto.randomUUID();

      if (!sessionId) {
        // Set the cookie client-side if it doesn't exist
        document.cookie = `ship-or-skip-session=${finalSessionId}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }

      const response = await fetch("/api/session/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: finalSessionId,
          twitter_handle: handle,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      router.push("/vote");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Ship or Skip"
          width={160}
          height={160}
          className="rounded-2xl shadow-2xl"
          priority
        />

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Would you ship or skip this startup?
        </h1>

        {/* Hook stat */}
        <div className="bg-surface rounded-2xl px-6 py-4">
          <p className="text-lg sm:text-xl">
            <span className="text-skip font-bold">73%</span> would have skipped
            Airbnb&apos;s pitch
          </p>
        </div>

        {/* CTA Button or Handle Input */}
        {!showHandleInput ? (
          <button
            onClick={handleStartClick}
            className="bg-ship text-background font-bold text-lg px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
          >
            Start Voting
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="handle" className="text-sm text-foreground/70">
                Enter your X/Twitter handle to get started
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">
                  @
                </span>
                <input
                  id="handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="yourhandle"
                  autoFocus
                  autoComplete="off"
                  className="w-full pl-9 pr-4 py-4 bg-surface border border-foreground/20 rounded-xl text-lg
                    placeholder:text-foreground/30
                    focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
                    transition-colors"
                />
              </div>
              {error && (
                <p className="text-skip text-sm">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ship text-background font-bold text-lg px-8 py-4 rounded-xl
                hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Loading..." : "Let's Go"}
            </button>
          </form>
        )}

        {/* How it works */}
        <div className="text-foreground/70 space-y-2 mt-4">
          <p className="text-sm font-medium uppercase tracking-wide text-foreground/50">
            How it works
          </p>
          <div className="space-y-1 text-sm sm:text-base">
            <p>Swipe through real startup pitches</p>
            <p>Vote Ship or Skip on each idea</p>
            <p>See what the crowd thinks</p>
            <p>Submit your own pitch</p>
          </div>
        </div>
      </main>
    </div>
  );
}
