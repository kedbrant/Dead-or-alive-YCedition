"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ValidationLoading } from "@/components/validation-loading";

const EXAMPLE_IDEAS = [
  "A marketplace connecting homeowners with people who want to rent their spare rooms",
  "AI-powered code review tool that catches bugs before they reach production",
  "Subscription box for healthy snacks delivered to your office",
];

// Error types for different handling
interface ValidationError {
  message: string;
  isRateLimited?: boolean;
  isRetryable?: boolean;
}

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!idea.trim() || idea.trim().length < 10) {
      setError({
        message: "Please describe your idea in more detail (at least 10 characters)",
        isRetryable: false
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();

        // Handle rate limiting specifically
        if (response.status === 429) {
          throw {
            message: data.error || "Too many requests. Please wait a moment and try again.",
            isRateLimited: true,
            isRetryable: true
          };
        }

        // Handle server errors (retryable)
        if (response.status >= 500) {
          throw {
            message: data.error || "Server error. Please try again.",
            isRetryable: true
          };
        }

        // Handle client errors (not retryable)
        throw {
          message: data.error || "Failed to validate idea",
          isRetryable: false
        };
      }

      const data = await response.json();
      router.push(`/report/${data.id}`);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err as ValidationError);
      } else {
        setError({
          message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
          isRetryable: true
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit();
  };

  const handleExampleClick = (example: string) => {
    setIdea(example);
    setError(null);
  };

  // Show loading state when validating
  if (isSubmitting) {
    return <ValidationLoading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center w-full">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="YC Archive"
            width={80}
            height={80}
            className="rounded-2xl shadow-2xl"
            priority
          />
        </Link>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          VALIDATE YOUR STARTUP IDEA
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-foreground/70 max-w-lg">
          Against 5,500 YC companies + live market data
        </p>

        {/* Idea Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <textarea
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe your startup idea..."
              rows={4}
              className="w-full px-4 py-4 bg-surface border border-foreground/20 rounded-xl text-lg
                placeholder:text-foreground/40
                focus:outline-none focus:border-ship focus:ring-1 focus:ring-ship
                transition-colors resize-none"
            />
            {error && (
              <div className="text-left space-y-2">
                <p className="text-skip text-sm">
                  {error.isRateLimited && "⏱️ "}
                  {error.message}
                </p>
                {error.isRetryable && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                  >
                    Try again
                  </button>
                )}
              </div>
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
            {isSubmitting ? "Analyzing..." : "Validate My Idea"}
          </button>
        </form>

        {/* Example Ideas */}
        <div className="w-full space-y-3">
          <p className="text-sm text-foreground/50 uppercase tracking-wide">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_IDEAS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left px-4 py-3 bg-surface/50 border border-foreground/10 rounded-lg
                  text-sm text-foreground/70 hover:text-foreground hover:border-foreground/20
                  transition-colors"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-sm">
            <span className="text-purple-400">🏢</span>
            <span className="text-foreground/80">5,500+ YC startups</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-sm">
            <span className="text-purple-400">📰</span>
            <span className="text-foreground/80">Live news feed</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-sm">
            <span className="text-purple-400">💬</span>
            <span className="text-foreground/80">Reddit sentiment</span>
          </div>
        </div>
      </main>
    </div>
  );
}
