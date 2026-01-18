"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ValidationLoading } from "@/components/validation-loading";

const EXAMPLE_IDEA = "A marketplace connecting homeowners with people who want to rent their spare rooms";

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


  // Show loading state when validating
  if (isSubmitting) {
    return <ValidationLoading />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <main className="flex flex-col items-center gap-6 max-w-2xl text-center w-full">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="YC Archive"
          width={100}
          height={100}
          className="rounded-xl"
        />

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Validate ideas against the <span className="text-yc-orange">past</span> and the <span className="text-yc-orange">present</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-foreground/70 max-w-lg">
          Compare your idea against 5,500+ YC companies and real-time market signals
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
              placeholder={EXAMPLE_IDEA}
              rows={2}
              className="w-full px-4 py-4 bg-surface border border-foreground/20 rounded-xl text-lg
                placeholder:text-foreground/40
                focus:outline-none focus:border-yc-orange focus:ring-1 focus:ring-yc-orange
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
            className="w-1/2 mx-auto block bg-yc-orange text-background font-bold text-lg px-8 py-4 rounded-xl
              hover:shadow-[0_0_20px_rgba(255,102,0,0.5)] hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? "Analyzing..." : "Validate My Idea"}
          </button>
        </form>
      </main>
    </div>
  );
}
