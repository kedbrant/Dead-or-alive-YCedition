/**
 * Achievement checking and progress tracking utilities
 * US-028: Update achievement progress tracking for outcomes
 */

import type {
  AchievementProgress,
  AchievementProgressUpdate,
  AchievementDefinition,
  SourceOutcome,
} from "@/lib/supabase/types";

/**
 * Mapping of trigger_type to achievement progress field
 */
const TRIGGER_TO_FIELD: Record<string, keyof AchievementProgress> = {
  unicorn_voted: "unicorns_voted",
  unicorn_shipped: "unicorns_shipped",
  unicorn_skipped: "unicorns_skipped",
  dead_voted: "dead_voted",
  dead_shipped: "dead_shipped",
  dead_skipped: "dead_skipped",
  acquired_voted: "acquired_voted",
  acquired_shipped: "acquired_shipped",
  acquired_skipped: "acquired_skipped",
  total_votes: "total_votes",
};

/**
 * Get progress updates based on vote and outcome
 * Returns an object with increments for relevant counters
 */
export function getProgressUpdates(
  vote: "ship" | "skip",
  outcome: SourceOutcome
): AchievementProgressUpdate {
  const updates: AchievementProgressUpdate = {
    total_votes: 1, // Will be incremented in SQL
    updated_at: new Date().toISOString(),
  };

  if (!outcome) return updates;

  switch (outcome) {
    case "unicorn":
      updates.unicorns_voted = 1;
      if (vote === "ship") {
        updates.unicorns_shipped = 1;
      } else {
        updates.unicorns_skipped = 1;
      }
      break;
    case "dead":
      updates.dead_voted = 1;
      if (vote === "ship") {
        updates.dead_shipped = 1;
      } else {
        updates.dead_skipped = 1;
      }
      break;
    case "acquired":
      updates.acquired_voted = 1;
      if (vote === "ship") {
        updates.acquired_shipped = 1;
      } else {
        updates.acquired_skipped = 1;
      }
      break;
    // "active" companies don't trigger outcome-based achievements
  }

  return updates;
}

/**
 * Check which achievements should be unlocked based on current progress
 * Returns array of achievement IDs that should be newly unlocked
 */
export function checkAchievements(
  progress: AchievementProgress,
  definitions: AchievementDefinition[],
  unlockedAchievementIds: string[],
  oracleScore?: number | null,
  resolvedVotes?: number
): string[] {
  const newlyUnlocked: string[] = [];

  for (const def of definitions) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(def.id)) {
      continue;
    }

    // Skip if not active
    if (!def.is_active) {
      continue;
    }

    // Check if achievement should be unlocked
    const shouldUnlock = checkSingleAchievement(
      def,
      progress,
      oracleScore,
      resolvedVotes
    );

    if (shouldUnlock) {
      newlyUnlocked.push(def.id);
    }
  }

  return newlyUnlocked;
}

/**
 * Check if a single achievement should be unlocked
 */
function checkSingleAchievement(
  def: AchievementDefinition,
  progress: AchievementProgress,
  oracleScore?: number | null,
  resolvedVotes?: number
): boolean {
  const { trigger_type, trigger_threshold } = def;

  // Special case: Oracle achievement (80%+ with 50+ resolved votes)
  if (trigger_type === "oracle_score_80") {
    return (
      oracleScore !== null &&
      oracleScore !== undefined &&
      oracleScore >= 80 &&
      resolvedVotes !== undefined &&
      resolvedVotes >= trigger_threshold
    );
  }

  // Standard trigger types - check against progress fields
  const field = TRIGGER_TO_FIELD[trigger_type];
  if (!field) {
    return false;
  }

  const currentValue = progress[field];
  if (typeof currentValue !== "number") {
    return false;
  }

  return currentValue >= trigger_threshold;
}

/**
 * Get newly triggered achievements after a vote
 * This combines progress updates and achievement checking
 */
export interface AchievementCheckResult {
  newlyUnlocked: string[];
  progressUpdates: AchievementProgressUpdate;
}

export function processVoteForAchievements(
  vote: "ship" | "skip",
  outcome: SourceOutcome,
  currentProgress: AchievementProgress,
  definitions: AchievementDefinition[],
  unlockedAchievementIds: string[],
  oracleScore?: number | null,
  resolvedVotes?: number
): AchievementCheckResult {
  // Get incremental updates
  const progressUpdates = getProgressUpdates(vote, outcome);

  // Create simulated updated progress for checking
  const simulatedProgress: AchievementProgress = {
    ...currentProgress,
    total_votes: currentProgress.total_votes + (progressUpdates.total_votes || 0),
    unicorns_voted: currentProgress.unicorns_voted + (progressUpdates.unicorns_voted || 0),
    unicorns_shipped: currentProgress.unicorns_shipped + (progressUpdates.unicorns_shipped || 0),
    unicorns_skipped: currentProgress.unicorns_skipped + (progressUpdates.unicorns_skipped || 0),
    dead_voted: currentProgress.dead_voted + (progressUpdates.dead_voted || 0),
    dead_shipped: currentProgress.dead_shipped + (progressUpdates.dead_shipped || 0),
    dead_skipped: currentProgress.dead_skipped + (progressUpdates.dead_skipped || 0),
    acquired_voted: currentProgress.acquired_voted + (progressUpdates.acquired_voted || 0),
    acquired_shipped: currentProgress.acquired_shipped + (progressUpdates.acquired_shipped || 0),
    acquired_skipped: currentProgress.acquired_skipped + (progressUpdates.acquired_skipped || 0),
  };

  // Check which achievements are newly unlocked
  const newlyUnlocked = checkAchievements(
    simulatedProgress,
    definitions,
    unlockedAchievementIds,
    oracleScore,
    resolvedVotes
  );

  return {
    newlyUnlocked,
    progressUpdates,
  };
}

/**
 * Create initial progress record for a new session
 */
export function createInitialProgress(sessionId: string): AchievementProgress {
  return {
    id: "", // Will be set by database
    session_id: sessionId,
    total_votes: 0,
    unicorns_voted: 0,
    unicorns_shipped: 0,
    unicorns_skipped: 0,
    dead_voted: 0,
    dead_shipped: 0,
    dead_skipped: 0,
    acquired_voted: 0,
    acquired_shipped: 0,
    acquired_skipped: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
