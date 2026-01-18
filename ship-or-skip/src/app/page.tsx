"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MAX_CHARS = 200;
const EXAMPLE_IDEA = "AI that writes cold outreach emails";

// Data source loading states
type LoadingStatus = "pending" | "loading" | "complete";

interface DataSourceState {
  id: string;
  label: string;
  status: LoadingStatus;
}

const INITIAL_SOURCES: DataSourceState[] = [
  { id: "yc", label: "YC companies", status: "pending" },
  { id: "trends", label: "Market trends", status: "pending" },
  { id: "news", label: "Recent news", status: "pending" },
  { id: "sentiment", label: "Community sentiment", status: "pending" },
];

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<DataSourceState[]>(INITIAL_SOURCES);

  // Simulate loading progress for data sources
  useEffect(() => {
    if (!isSubmitting) {
      // Reset sources when not submitting
      setDataSources(INITIAL_SOURCES);
      return;
    }

    // Simulate staggered loading of data sources
    const timings = [
      { id: "yc", startDelay: 100, completeDelay: 2000 },
      { id: "trends", startDelay: 200, completeDelay: 4000 },
      { id: "news", startDelay: 300, completeDelay: 3000 },
      { id: "sentiment", startDelay: 400, completeDelay: 5000 },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timings.forEach(({ id, startDelay, completeDelay }) => {
      // Set to loading
      timeouts.push(
        setTimeout(() => {
          setDataSources((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: "loading" } : s))
          );
        }, startDelay)
      );
      // Set to complete
      timeouts.push(
        setTimeout(() => {
          setDataSources((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: "complete" } : s))
          );
        }, completeDelay)
      );
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isSubmitting]);

  const fillExample = () => {
    setIdea(EXAMPLE_IDEA);
    setError(null);
  };

  const charCount = idea.length;
  const isOverLimit = charCount > MAX_CHARS;

  // Calculate progress percentage based on completed sources
  const completedCount = dataSources.filter((s) => s.status === "complete").length;
  const progressPercent = Math.round((completedCount / dataSources.length) * 100);

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

      // Generate a unique report ID and save to localStorage
      const reportId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(`report_${reportId}`, JSON.stringify(data.report));

      // Navigate to report page
      router.push(`/report/${reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  // Loading state UI
  if (isSubmitting) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 animate-page-fade-in">
        <main className="flex flex-col items-center w-full max-w-md text-center">
          {/* Logo */}
          <span className="text-2xl font-bold tracking-tight mb-8">
            YC-ARCHIVE
          </span>

          {/* Loading heading */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Analyzing your idea...
          </h2>

          {/* Progress bar */}
          <div className="w-full bg-surface border border-border rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-focus-ring h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Data sources checklist */}
          <div className="w-full space-y-3 mb-8">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-lg"
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {source.status === "pending" && (
                    <div className="w-4 h-4 rounded-full border-2 border-foreground-secondary" />
                  )}
                  {source.status === "loading" && (
                    <div className="w-4 h-4 rounded-full border-2 border-focus-ring border-t-transparent animate-spin" />
                  )}
                  {source.status === "complete" && (
                    <svg
                      className="w-5 h-5 text-ship"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-sm font-medium ${
                    source.status === "complete"
                      ? "text-foreground"
                      : "text-foreground-secondary"
                  }`}
                >
                  {source.label}
                </span>
              </div>
            ))}
          </div>

          {/* Hint text */}
          <p className="text-sm text-foreground-secondary">
            Usually takes 10-15 seconds
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 animate-page-fade-in">
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
                transition-[border-color,box-shadow] duration-150 ease-out resize-none"
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
              hover:opacity-90 active:scale-[0.98] btn-animate
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100"
          >
            Validate My Idea
          </button>
        </form>

        {/* Example text */}
        <p className="mt-6 text-sm text-foreground-secondary">
          Try:{" "}
          <button
            type="button"
            onClick={fillExample}
            className="text-foreground hover:opacity-80 underline underline-offset-2 transition-opacity duration-150"
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
