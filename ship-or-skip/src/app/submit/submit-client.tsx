"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitForm, SubmitFormData } from "@/components/submit/submit-form";

interface SubmitResult {
  idea_id: string;
  slug: string;
  share_url: string;
}

export function SubmitClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedHero, setSubmittedHero] = useState<string>("");

  const handleSubmit = async (data: SubmitFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit idea");
      }

      const result: SubmitResult = await response.json();
      setSubmitResult(result);
      setSubmittedHero(data.hero);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTweetTemplate = () => {
    const tweetText = `Would you ship this? 👀\n\n${submittedHero}\n\nVote on Ship or Skip:`;
    const encodedText = encodeURIComponent(tweetText);
    const encodedUrl = encodeURIComponent(submitResult?.share_url || "");
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  };

  const handleCopyLink = async () => {
    if (!submitResult?.share_url) return;

    try {
      await navigator.clipboard.writeText(submitResult.share_url);
    } catch {
      // Clipboard failed silently
    }
  };

  // Show success confirmation
  if (submitResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-[32px] font-bold mb-4">Pitch Submitted!</h2>
          <p className="text-[18px] text-foreground/80 mb-8">
            Your idea is now live. Share it and see what the crowd thinks!
          </p>

          {/* Shareable pitch page link */}
          <div className="bg-background/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground/60 mb-2">Your pitch page:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-background/50 px-3 py-2 rounded-lg text-ship truncate">
                {submitResult.share_url}
              </code>
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-surface border border-foreground/20 rounded-lg text-sm
                  transition-all duration-150
                  hover:border-foreground/40"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Share on Twitter/X */}
          <a
            href={generateTweetTemplate()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#1DA1F2] text-white font-bold rounded-xl mb-4
              transition-all duration-150
              hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] hover:scale-[1.02]
              active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>

          {/* Action links */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/pitch/${submitResult.slug}`}
              className="flex-1 px-6 py-4 bg-ship text-white font-bold rounded-xl text-center
                transition-all duration-150
                hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
                active:scale-[0.98]"
            >
              View Your Pitch
            </Link>
            <Link
              href="/vote"
              className="flex-1 px-6 py-4 border border-foreground/20 text-foreground font-bold rounded-xl text-center
                transition-all duration-150
                hover:border-foreground/40 hover:scale-[1.02]
                active:scale-[0.98]"
            >
              Vote on Ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show submit form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[480px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold mb-2">Submit Your Pitch</h1>
          <p className="text-[18px] text-foreground/80">
            Share your startup idea and see what the crowd thinks
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-skip/10 border border-skip/30 rounded-xl text-skip text-center">
            {error}
          </div>
        )}

        <SubmitForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        <p className="text-center text-sm text-foreground/40 mt-6">
          By submitting, you agree to let others vote on your idea.
        </p>
      </div>
    </div>
  );
}
