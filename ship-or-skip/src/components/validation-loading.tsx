"use client";

import { useEffect, useState } from "react";

interface DataSource {
  id: string;
  label: string;
  icon: string;
  delayMs: number;
}

const DATA_SOURCES: DataSource[] = [
  { id: "yc", label: "Searching YC database", icon: "🏢", delayMs: 0 },
  { id: "news", label: "Fetching live news", icon: "📰", delayMs: 1500 },
  { id: "reddit", label: "Analyzing Reddit sentiment", icon: "💬", delayMs: 3000 },
  { id: "trends", label: "Checking market trends", icon: "📈", delayMs: 4500 },
  { id: "ai", label: "Generating AI analysis", icon: "🤖", delayMs: 6000 },
];

export function ValidationLoading() {
  const [completedSources, setCompletedSources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    DATA_SOURCES.forEach((source) => {
      const timer = setTimeout(() => {
        setCompletedSources((prev) => new Set([...prev, source.id]));
      }, source.delayMs);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8 max-w-md text-center w-full">
        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-foreground/10" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-yc-orange animate-spin" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Analyzing your idea...</h1>
          <p className="text-foreground/60 text-sm">
            Usually takes 10-15 seconds
          </p>
        </div>

        {/* Data Sources Checklist */}
        <div className="w-full bg-surface rounded-xl border border-foreground/10 p-4 space-y-3">
          {DATA_SOURCES.map((source) => {
            const isCompleted = completedSources.has(source.id);
            const isLoading = !isCompleted;

            return (
              <div
                key={source.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCompleted ? "bg-yc-orange/10" : "bg-foreground/5"
                }`}
              >
                {/* Icon */}
                <span className="text-lg">{source.icon}</span>

                {/* Label */}
                <span
                  className={`flex-1 text-left text-sm transition-colors ${
                    isCompleted ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {source.label}
                </span>

                {/* Status Indicator */}
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-yc-orange animate-spin" />
                ) : (
                  <svg
                    className="w-5 h-5 text-yc-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Message */}
        <p className="text-foreground/50 text-xs">
          We&apos;re searching through 5,500+ YC companies and live market data
        </p>
      </div>
    </div>
  );
}
