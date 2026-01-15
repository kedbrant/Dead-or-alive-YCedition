/**
 * Pool Expansion Utility Script
 * Run with: npx tsx scripts/expand-pool.ts [count] [outcome]
 *
 * Expands the active pool by adding more YC companies.
 * Companies are prioritized by team_size (bigger companies first).
 *
 * Arguments:
 *   count    - Number of companies to add (default: 50)
 *   outcome  - Filter by source_outcome: unicorn, acquired, dead, active (optional)
 *
 * Examples:
 *   npx tsx scripts/expand-pool.ts           # Add 50 companies of any outcome
 *   npx tsx scripts/expand-pool.ts 100       # Add 100 companies
 *   npx tsx scripts/expand-pool.ts 25 unicorn # Add 25 unicorns
 *   npx tsx scripts/expand-pool.ts 50 dead   # Add 50 dead companies
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * These can be in .env.local file in the ship-or-skip directory
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
import type { SourceOutcome } from "../src/lib/supabase/types";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing environment variables");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  console.error("Add these to ship-or-skip/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Expand the active pool by adding companies that aren't already in it.
 * Prioritizes by team_size descending (bigger companies first).
 *
 * @param supabase - Supabase client instance
 * @param count - Number of companies to add to the pool
 * @param outcomeFilter - Optional filter by source_outcome
 * @returns Number of companies successfully added
 */
export async function expandActivePool(
  supabaseClient: SupabaseClient,
  count: number,
  outcomeFilter?: SourceOutcome | null
): Promise<number> {
  console.log(`\nExpanding active pool...`);
  console.log(`  Target count: ${count}`);
  console.log(`  Outcome filter: ${outcomeFilter || "none (all outcomes)"}`);

  // Build query for companies not in active pool
  let query = supabaseClient
    .from("ideas")
    .select("id, yc_name, yc_team_size, source_outcome")
    .eq("is_active", true)
    .eq("source", "yc")
    .eq("is_in_active_pool", false)
    .order("yc_team_size", { ascending: false, nullsFirst: false })
    .limit(count);

  // Apply outcome filter if provided
  if (outcomeFilter) {
    query = query.eq("source_outcome", outcomeFilter);
  }

  const { data: candidates, error: selectError } = await query;

  if (selectError) {
    console.error("Error fetching candidates:", selectError.message);
    return 0;
  }

  if (!candidates || candidates.length === 0) {
    console.log("No candidates found matching criteria.");
    return 0;
  }

  console.log(`Found ${candidates.length} candidates to add.`);

  // Update all candidates to be in the active pool
  const idsToUpdate = candidates.map((c) => c.id);
  const now = new Date().toISOString();

  const { error: updateError, count: updatedCount } = await supabaseClient
    .from("ideas")
    .update({
      is_in_active_pool: true,
      pool_added_at: now,
    })
    .in("id", idsToUpdate);

  if (updateError) {
    console.error("Error updating pool:", updateError.message);
    return 0;
  }

  const addedCount = updatedCount ?? candidates.length;
  console.log(`Successfully added ${addedCount} companies to active pool.`);

  // Log summary of what was added
  const outcomeCounts: Record<string, number> = {};
  for (const candidate of candidates) {
    const outcome = candidate.source_outcome || "unknown";
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
  }

  console.log("\nBreakdown by outcome:");
  for (const [outcome, count] of Object.entries(outcomeCounts)) {
    console.log(`  ${outcome}: ${count}`);
  }

  return addedCount;
}

/**
 * Get current pool statistics
 */
async function getPoolStats(): Promise<void> {
  console.log("\n=== Current Pool Statistics ===");

  // Total in pool
  const { count: inPool } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("is_in_active_pool", true)
    .eq("source", "yc");

  // Total not in pool
  const { count: notInPool } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("is_in_active_pool", false)
    .eq("source", "yc")
    .eq("is_active", true);

  console.log(`In active pool: ${inPool || 0}`);
  console.log(`Available to add: ${notInPool || 0}`);

  // Breakdown by outcome in pool
  console.log("\nIn pool by outcome:");
  for (const outcome of ["unicorn", "acquired", "dead", "active"]) {
    const { count } = await supabase
      .from("ideas")
      .select("*", { count: "exact", head: true })
      .eq("is_in_active_pool", true)
      .eq("source", "yc")
      .eq("source_outcome", outcome);
    console.log(`  ${outcome}: ${count || 0}`);
  }

  // Breakdown by outcome not in pool
  console.log("\nAvailable to add by outcome:");
  for (const outcome of ["unicorn", "acquired", "dead", "active"]) {
    const { count } = await supabase
      .from("ideas")
      .select("*", { count: "exact", head: true })
      .eq("is_in_active_pool", false)
      .eq("source", "yc")
      .eq("is_active", true)
      .eq("source_outcome", outcome);
    console.log(`  ${outcome}: ${count || 0}`);
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  const count = args[0] ? parseInt(args[0], 10) : 50;
  const outcomeArg = args[1]?.toLowerCase();

  // Validate count
  if (isNaN(count) || count <= 0) {
    console.error("Error: count must be a positive number");
    process.exit(1);
  }

  // Validate outcome if provided
  const validOutcomes = ["unicorn", "acquired", "dead", "active"];
  let outcomeFilter: SourceOutcome | null = null;
  if (outcomeArg) {
    if (!validOutcomes.includes(outcomeArg)) {
      console.error(`Error: Invalid outcome. Must be one of: ${validOutcomes.join(", ")}`);
      process.exit(1);
    }
    outcomeFilter = outcomeArg as SourceOutcome;
  }

  // Show current stats
  await getPoolStats();

  // Expand the pool
  const added = await expandActivePool(supabase, count, outcomeFilter);

  if (added > 0) {
    // Show updated stats
    await getPoolStats();
  }

  console.log("\nDone!");
}

main().catch(console.error);
