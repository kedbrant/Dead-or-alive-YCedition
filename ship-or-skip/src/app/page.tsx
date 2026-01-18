"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_CHARS = 200;
const EXAMPLE_IDEA = "AI that writes cold outreach emails";

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillExample = () => {
    setIdea(EXAMPLE_IDEA);
    setError(null);
  };

  const charCount = idea.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idea.trim()) {
      setError("Please enter your startup idea");
      return;
    }

    if (isOverLimit) {
      setError("Idea is too long. Please keep it under 200 characters.");
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
        throw new Error(data.error || "Failed to validate idea");
      }

      const data = await response.json();
      // Navigate to report page with the report ID
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="flex flex-col items-center w-full max-w-xl text-center">
        {/* Logo */}
        <span className="text-2xl font-bold tracking-tight mb-8">
          YC-ARCHIVE
        </span>

        {/* Headline */}
        <h1 className="text-[40px] sm:text-[48px] font-bold leading-tight mb-4">
          Validate Your Startup Idea
        </h1>

        {/* Subhead */}
        <p className="text-xl font-normal text-foreground-secondary mb-10">
          Against 5,500+ YC companies and live market data
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Textarea with character counter */}
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea..."
              rows={3}
              className="w-full min-h-[56px] px-4 py-3 bg-surface border border-border rounded-xl text-base
                placeholder:text-foreground-secondary
                focus:outline-none focus:border-focus-ring focus:ring-1 focus:ring-focus-ring
                transition-colors resize-none"
            />
            {/* Character counter */}
            <span
              className={`absolute bottom-3 right-3 text-sm ${
                isOverLimit ? "text-skip" : "text-foreground-secondary"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-skip text-sm text-left">{error}</p>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting || isOverLimit}
            className="w-full bg-button-bg text-button-text font-bold text-lg px-8 py-4 rounded-xl
              hover:opacity-90 active:scale-[0.98]
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? "Validating..." : "Validate My Idea"}
          </button>
        </form>

        {/* Example text */}
        <p className="mt-6 text-sm text-foreground-secondary">
          Try:{" "}
          <button
            type="button"
            onClick={fillExample}
            className="text-foreground hover:opacity-80 underline underline-offset-2 transition-colors"
          >
            &ldquo;{EXAMPLE_IDEA}&rdquo;
          </button>
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary">
            <span>📊</span>
            <span>5,500+ YC startups</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary">
            <span>📈</span>
            <span>Live trends</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary">
            <span>💬</span>
            <span>Real sentiment</span>
          </span>
        </div>
      </main>
    </div>
  );
}
