"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ValidationLoading } from "@/components/validation-loading";
import { PromptBox } from "@/components/ui/prompt-box";

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
      <main className="flex flex-col items-center gap-6 max-w-2xl w-full">
        {/* Hero Row: Logo + Text */}
        <div className="flex items-center gap-6 w-full">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="YC Archive"
            width={80}
            height={80}
            className="rounded-xl flex-shrink-0"
          />

          {/* Text */}
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Validate <span className="text-yc-orange">before</span> you build
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 mt-1">
              Your idea against the past, the present, and the market
            </p>
          </div>
        </div>

        {/* Idea Input */}
        <div className="w-full space-y-2">
          <PromptBox
            value={idea}
            onChange={(value) => {
              setIdea(value);
              if (error) setError(null);
            }}
            onSubmit={handleSubmit}
            placeholder={EXAMPLE_IDEA}
            disabled={isSubmitting}
          />
          <p className="text-center text-foreground/30 text-xs">YC-Archive.com</p>
          {error && (
            <div className="text-left space-y-2 px-2">
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
      </main>
    </div>
  );
}
