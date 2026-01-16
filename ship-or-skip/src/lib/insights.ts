import type { SourceOutcome } from "./supabase/types";
import type { VoteType } from "@/components/voting/vote-buttons";

/**
 * Returns contextual insight copy based on user vote and company outcome.
 * Used in the reveal overlay to give users feedback on their prediction.
 *
 * @param userVote - The user's vote: "ship" or "skip"
 * @param outcome - The company's actual outcome: unicorn, acquired, dead, or active
 * @param companyName - The company name to include in some messages
 * @returns A string with the insight message including relevant emoji
 */
export function getInsightCopy(
  userVote: VoteType,
  outcome: SourceOutcome,
  companyName: string
): string {
  // Handle null or unknown outcomes
  if (!outcome) {
    return "";
  }

  // User shipped a unicorn - great prediction!
  if (userVote === "ship" && outcome === "unicorn") {
    return "🎯 Nice call! You spotted a winner.";
  }

  // User skipped a unicorn - dramatic miss
  if (userVote === "skip" && outcome === "unicorn") {
    return "😬 You would have passed on a massive success.";
  }

  // User shipped a dead company - got fooled
  if (userVote === "ship" && outcome === "dead") {
    return `💸 You got fooled. ${companyName} didn't make it.`;
  }

  // User skipped a dead company - good instincts
  if (userVote === "skip" && outcome === "dead") {
    return "🎯 Good instincts. This one failed.";
  }

  // Active company - no outcome yet
  if (outcome === "active") {
    return "⏳ Still operating. Time will tell if you're right.";
  }

  // Acquired - neutral message either way
  if (outcome === "acquired") {
    return `💰 ${companyName} was acquired. Decent outcome.`;
  }

  // Fallback for any unexpected case
  return "";
}
