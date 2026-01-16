"use client";

import { useState, useEffect } from "react";

interface PitchInputProps {
  onSubmit: (pitch: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export function PitchInput({ onSubmit, loading = false, initialValue = "" }: PitchInputProps) {
  const [pitch, setPitch] = useState(initialValue);

  // Sync with initialValue when it changes (e.g., when example pitch is clicked)
  useEffect(() => {
    setPitch(initialValue);
  }, [initialValue]);

  const charCount = pitch.length;
  const isValid = pitch.trim().length >= 10;

  const handleSubmit = () => {
    if (isValid && !loading) {
      onSubmit(pitch.trim());
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6">
      <label htmlFor="pitch-input" className="sr-only">
        Enter your pitch
      </label>
      <textarea
        id="pitch-input"
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        placeholder="Enter your one-liner pitch..."
        className="w-full h-40 bg-background rounded-lg p-4 text-foreground placeholder:text-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-ship/50 border border-foreground/10"
      />

      {/* Character count and submit button */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-foreground/50">
          {charCount} characters
        </span>
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="px-6 py-3 bg-ship text-background font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ship/90 transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              🔍 Analyze Pitch
            </>
          )}
        </button>
      </div>

      {/* Minimum length hint */}
      {charCount > 0 && charCount < 10 && (
        <p className="text-sm text-skip mt-2">
          Enter at least 10 characters to analyze
        </p>
      )}
    </div>
  );
}
