"use client";

import { useState } from "react";

// Example pitches for inspiration
const EXAMPLE_PITCHES = [
  "A marketplace for renting out your unused parking space to commuters",
  "AI-powered code review that catches bugs before they reach production",
  "A platform connecting local farmers directly with restaurant chefs",
  "Mobile app that helps people split bills and track shared expenses",
];

export function ValidateClient() {
  const [pitch, setPitch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (pitch.trim().length < 10) return;

    setIsAnalyzing(true);
    // TODO: US-015 will implement the results state after API is built
    try {
      // Placeholder for API call
      console.log("Analyzing pitch:", pitch);
    } catch (error) {
      console.error("Error analyzing pitch:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPitch(example);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-2">
            VALIDATE YOUR STARTUP PITCH
          </h1>
          <p className="text-[16px] md:text-[18px] text-foreground/70">
            See how your idea compares to 5,500 YC companies
          </p>
        </div>

        {/* Pitch Input Section */}
        <section className="mb-8">
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

            {/* Character count */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-foreground/50">
                {pitch.length} characters
              </span>
              <button
                onClick={handleAnalyze}
                disabled={pitch.trim().length < 10 || isAnalyzing}
                className="px-6 py-3 bg-ship text-background font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ship/90 transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
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
            {pitch.length > 0 && pitch.length < 10 && (
              <p className="text-sm text-skip mt-2">
                Enter at least 10 characters to analyze
              </p>
            )}
          </div>
        </section>

        {/* Example Pitches Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-foreground/80">
            Need inspiration? Try these examples:
          </h2>
          <div className="grid gap-3">
            {EXAMPLE_PITCHES.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left bg-surface hover:bg-surface/80 rounded-lg p-4 text-foreground/70 hover:text-foreground transition-colors border border-transparent hover:border-foreground/10"
              >
                <span className="text-foreground/40 mr-2">→</span>
                {example}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
