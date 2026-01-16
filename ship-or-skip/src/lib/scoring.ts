import type { Vote, SourceOutcome } from "./supabase/types";

/**
 * Outcomes that count as "resolved" for Oracle Score calculation.
 * Active companies don't have a known outcome yet.
 */
const RESOLVED_OUTCOMES: SourceOutcome[] = ["unicorn", "dead", "acquired"];

/**
 * Minimum number of resolved votes required to calculate Oracle Score.
 * This prevents meaningless scores from small sample sizes.
 */
export const MIN_RESOLVED_VOTES = 10;

/**
 * Calculates the Oracle Score from a list of votes.
 * Oracle Score = (correct predictions / resolved votes) * 100
 *
 * Only votes on resolved companies count (unicorn, dead, acquired).
 * Active companies are excluded since their outcome is unknown.
 *
 * @param votes - Array of vote records with is_correct and idea_outcome
 * @returns Oracle Score as percentage (0-100), or null if under minimum threshold
 *
 * @example
 * // 7 correct out of 10 resolved votes
 * calculateOracleScore(votes) // returns 70
 *
 * @example
 * // Only 5 resolved votes (below minimum of 10)
 * calculateOracleScore(votes) // returns null
 */
export function calculateOracleScore(
  votes: Pick<Vote, "is_correct" | "idea_outcome">[]
): number | null {
  // Filter to only resolved votes (unicorn, dead, acquired)
  const resolvedVotes = votes.filter(
    (vote) =>
      vote.idea_outcome !== null &&
      RESOLVED_OUTCOMES.includes(vote.idea_outcome)
  );

  // Need minimum number of resolved votes for meaningful score
  if (resolvedVotes.length < MIN_RESOLVED_VOTES) {
    return null;
  }

  // Count correct predictions
  const correctCount = resolvedVotes.filter(
    (vote) => vote.is_correct === true
  ).length;

  // Calculate percentage
  const score = (correctCount / resolvedVotes.length) * 100;

  // Round to 1 decimal place for display
  return Math.round(score * 10) / 10;
}

/**
 * Get detailed breakdown of Oracle Score calculation.
 * Useful for stats display showing correct ships, correct skips, etc.
 *
 * @param votes - Array of vote records
 * @returns Breakdown object with counts and score
 */
export function getOracleScoreBreakdown(
  votes: Pick<Vote, "vote" | "is_correct" | "idea_outcome">[]
): {
  totalVotes: number;
  resolvedVotes: number;
  correctPredictions: number;
  correctShips: number;
  correctSkips: number;
  wrongPredictions: number;
  oracleScore: number | null;
} {
  // Filter to resolved votes
  const resolvedVotes = votes.filter(
    (vote) =>
      vote.idea_outcome !== null &&
      RESOLVED_OUTCOMES.includes(vote.idea_outcome)
  );

  // Count correct ships (shipped a unicorn or acquired company)
  const correctShips = resolvedVotes.filter(
    (vote) =>
      vote.vote === "ship" &&
      vote.is_correct === true
  ).length;

  // Count correct skips (skipped a dead company)
  const correctSkips = resolvedVotes.filter(
    (vote) =>
      vote.vote === "skip" &&
      vote.is_correct === true
  ).length;

  const correctPredictions = correctShips + correctSkips;
  const wrongPredictions = resolvedVotes.length - correctPredictions;

  return {
    totalVotes: votes.length,
    resolvedVotes: resolvedVotes.length,
    correctPredictions,
    correctShips,
    correctSkips,
    wrongPredictions,
    oracleScore: calculateOracleScore(resolvedVotes),
  };
}
