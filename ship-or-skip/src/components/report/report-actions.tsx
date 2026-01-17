"use client";

import Link from "next/link";
import { useState } from "react";

interface ReportActionsProps {
  reportId: string;
  score: number;
}

export function ReportActions({ reportId, score }: ReportActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl =
    (process.env.NEXT_PUBLIC_BASE_URL || "https://ycarchive.com") +
    `/report/${reportId}`;
  const shareText = `I just validated my startup idea and got a score of ${score}/100! Check it out:`;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleCopyLink}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface border border-foreground/20 text-foreground font-bold rounded-xl
          transition-all duration-150
          hover:border-foreground/40 hover:scale-[1.02]
          active:scale-[0.98]"
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-green-500"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
            </svg>
            Copy Link
          </>
        )}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#1DA1F2] text-white font-bold rounded-xl
          transition-all duration-150
          hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] hover:scale-[1.02]
          active:scale-[0.98]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>

      <Link
        href="/"
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-ship text-white font-bold rounded-xl
          transition-all duration-150
          hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
          active:scale-[0.98]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Validate Another Idea
      </Link>
    </div>
  );
}
