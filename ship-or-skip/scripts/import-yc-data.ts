/**
 * YC Data Import Script
 * Run with: npx tsx scripts/import-yc-data.ts
 *
 * Fetches all companies from https://yc-oss.github.io/api/companies/all.json
 * and imports them into the ideas table with proper YC field mapping.
 *
 * Features:
 * - Filters companies with valid one_liners (>= 10 chars)
 * - Computes source_outcome from status/top_company
 * - Creates unique slugs using slugify on one_liner + yc_slug
 * - Uses upsert with onConflict on yc_id to allow re-running
 * - Batch inserts in chunks to avoid timeout
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * These can be in .env.local file in the ship-or-skip directory
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
import type { YCCompanyRaw, SourceOutcome, IdeaInsert } from "../src/lib/supabase/types";

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

// YC-OSS API endpoint for all companies
const YC_API_URL = "https://yc-oss.github.io/api/companies/all.json";

/**
 * Generate URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Create unique slug from one_liner + yc_slug
 */
function createUniqueSlug(oneLiner: string, ycSlug: string): string {
  // Use first ~30 chars of one_liner slugified + yc_slug for uniqueness
  const heroSlug = slugify(oneLiner.substring(0, 30));
  return `${heroSlug}-${ycSlug}`.substring(0, 100);
}

/**
 * Compute source_outcome from status and top_company flag
 *
 * Logic from PRD:
 * - top_company=true OR status='Public' -> 'unicorn'
 * - status='Acquired' -> 'acquired'
 * - status='Inactive' -> 'dead'
 * - else -> 'active'
 */
function computeSourceOutcome(status: string, topCompany: boolean): SourceOutcome {
  // Unicorn: top company OR public (IPO'd)
  if (topCompany || status === "Public") {
    return "unicorn";
  }

  // Acquired
  if (status === "Acquired") {
    return "acquired";
  }

  // Dead: Inactive status
  if (status === "Inactive") {
    return "dead";
  }

  // Active: everything else (Active status or unknown)
  return "active";
}

/**
 * Truncate text to max length at word boundary
 */
function truncateAtWord(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Fetch all YC companies from the API
 */
async function fetchYCCompanies(): Promise<YCCompanyRaw[]> {
  console.log("Fetching YC companies from API...");
  console.log(`URL: ${YC_API_URL}\n`);

  const response = await fetch(YC_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch YC data: ${response.status} ${response.statusText}`);
  }

  const companies: YCCompanyRaw[] = await response.json();
  console.log(`Fetched ${companies.length} companies from YC-OSS API\n`);

  return companies;
}

/**
 * Filter companies to those with valid one_liners (>= 10 chars)
 */
function filterValidCompanies(companies: YCCompanyRaw[]): YCCompanyRaw[] {
  return companies.filter((company) => {
    // Must have one_liner with at least 10 characters
    if (!company.one_liner || company.one_liner.length < 10) {
      return false;
    }

    // Must have a name and slug
    if (!company.name || !company.slug) {
      return false;
    }

    return true;
  });
}

/**
 * Transform YC company data to idea insert record
 */
function transformToIdea(company: YCCompanyRaw): IdeaInsert {
  const sourceOutcome = computeSourceOutcome(company.status, company.top_company);

  // Create hero line: use full one_liner (no truncation)
  const hero = company.one_liner;

  // Create subtitle: truncate long_description to 500 chars
  const subtitle = company.long_description
    ? truncateAtWord(company.long_description, 500)
    : `${company.industry || "Technology"} startup from YC ${company.batch || ""}`.trim();

  // Create unique slug
  const slug = createUniqueSlug(company.one_liner, company.slug);

  return {
    slug,
    hero,
    subtitle,
    source: "yc",
    source_company: company.name,
    source_batch: company.batch || null,
    source_outcome: sourceOutcome,
    is_active: true,
    // YC-specific fields
    yc_id: String(company.id),
    yc_name: company.name,
    yc_slug: company.slug,
    yc_batch: company.batch || null,
    yc_status: company.status || null,
    yc_logo_url: company.small_logo_thumb_url || null,
    yc_website: company.website || null,
    yc_long_description: company.long_description || null,
    yc_team_size: company.team_size || null,
    yc_industry: company.industry || null,
    yc_subindustry: company.subindustry || null,
    yc_tags: company.tags || null,
    yc_location: company.all_locations || null,
    yc_launched_at: company.launched_at
      ? new Date(company.launched_at * 1000).toISOString()
      : null,
    yc_is_top_company: company.top_company || false,
    // Not in active pool by default
    is_in_active_pool: false,
    pool_added_at: null,
  };
}

/**
 * Main import function
 */
async function importYCData(): Promise<void> {
  console.log("=== YC Data Import Script ===\n");

  // Fetch all companies
  const allCompanies = await fetchYCCompanies();

  // Filter to companies with valid one_liners
  const validCompanies = filterValidCompanies(allCompanies);
  console.log(`Filtered to ${validCompanies.length} companies with valid one_liners (>= 10 chars)\n`);

  // Count outcomes for reporting
  const outcomeCounts = {
    unicorn: 0,
    acquired: 0,
    dead: 0,
    active: 0,
  };

  // Transform all companies to idea records
  const ideaRecords = validCompanies.map((company) => {
    const idea = transformToIdea(company);
    if (idea.source_outcome) {
      outcomeCounts[idea.source_outcome]++;
    }
    return idea;
  });

  console.log("Outcome distribution:");
  console.log(`  Unicorns: ${outcomeCounts.unicorn}`);
  console.log(`  Acquired: ${outcomeCounts.acquired}`);
  console.log(`  Dead: ${outcomeCounts.dead}`);
  console.log(`  Active: ${outcomeCounts.active}`);
  console.log();

  // Insert in batches of 100 to avoid timeout
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  console.log(`Importing ${ideaRecords.length} companies in batches of ${batchSize}...\n`);

  for (let i = 0; i < ideaRecords.length; i += batchSize) {
    const batch = ideaRecords.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(ideaRecords.length / batchSize);

    // Use upsert with onConflict on slug (which has a unique constraint) to allow re-running
    // We create unique slugs from one_liner + yc_slug so they're deterministic across runs
    const { error } = await supabase.from("ideas").upsert(batch, {
      onConflict: "slug",
    });

    if (error) {
      console.error(`✗ Batch ${batchNum}/${totalBatches}: Error - ${error.message}`);
      errorCount += batch.length;
    } else {
      console.log(`✓ Batch ${batchNum}/${totalBatches}: ${batch.length} companies imported`);
      successCount += batch.length;
    }
  }

  console.log("\n=== Import Complete ===");
  console.log(`Total processed: ${ideaRecords.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`\nOutcome breakdown:`);
  console.log(`  Unicorns: ${outcomeCounts.unicorn}`);
  console.log(`  Acquired: ${outcomeCounts.acquired}`);
  console.log(`  Dead: ${outcomeCounts.dead}`);
  console.log(`  Active: ${outcomeCounts.active}`);
}

/**
 * Set initial active pool with 200 companies:
 * - 50 unicorns (sorted by team_size desc)
 * - 50 dead companies
 * - 30 acquired
 * - 70 active
 */
export async function setInitialActivePool(): Promise<void> {
  console.log("\n=== Setting Initial Active Pool ===\n");

  const poolConfig = [
    { outcome: "unicorn", count: 50, description: "unicorns" },
    { outcome: "dead", count: 50, description: "dead companies" },
    { outcome: "acquired", count: 30, description: "acquired companies" },
    { outcome: "active", count: 70, description: "active companies" },
  ];

  let totalAdded = 0;

  for (const config of poolConfig) {
    // Fetch companies of this outcome type, sorted by team_size desc (biggest first)
    const { data: companies, error: fetchError } = await supabase
      .from("ideas")
      .select("id, yc_name, yc_team_size")
      .eq("source", "yc")
      .eq("source_outcome", config.outcome)
      .eq("is_in_active_pool", false)
      .order("yc_team_size", { ascending: false, nullsFirst: false })
      .limit(config.count);

    if (fetchError) {
      console.error(`Error fetching ${config.description}:`, fetchError.message);
      continue;
    }

    if (!companies || companies.length === 0) {
      console.log(`No available ${config.description} to add to pool`);
      continue;
    }

    // Update these companies to be in the active pool
    const companyIds = companies.map((c) => c.id);
    const { error: updateError } = await supabase
      .from("ideas")
      .update({
        is_in_active_pool: true,
        pool_added_at: new Date().toISOString(),
      })
      .in("id", companyIds);

    if (updateError) {
      console.error(`Error updating ${config.description}:`, updateError.message);
      continue;
    }

    console.log(`✓ Added ${companies.length} ${config.description} to active pool`);
    totalAdded += companies.length;
  }

  console.log(`\nTotal companies added to active pool: ${totalAdded}`);
}

/**
 * Expand the active pool by adding more companies
 * @param count Number of companies to add
 * @param outcomeFilter Optional filter for specific outcome type ('unicorn' | 'acquired' | 'dead' | 'active')
 * @returns Number of companies actually added
 */
export async function expandActivePool(
  count: number,
  outcomeFilter?: SourceOutcome
): Promise<number> {
  console.log(`\n=== Expanding Active Pool ===`);
  console.log(`Adding ${count} companies${outcomeFilter ? ` (${outcomeFilter} only)` : ""}\n`);

  // Build query - fetch companies not in pool, optionally filtered by outcome
  let query = supabase
    .from("ideas")
    .select("id, yc_name, yc_team_size")
    .eq("source", "yc")
    .eq("is_in_active_pool", false)
    .order("yc_team_size", { ascending: false, nullsFirst: false })
    .limit(count);

  // Apply outcome filter if specified
  if (outcomeFilter) {
    query = query.eq("source_outcome", outcomeFilter);
  }

  const { data: companies, error: fetchError } = await query;

  if (fetchError) {
    console.error("Error fetching companies for pool expansion:", fetchError.message);
    return 0;
  }

  if (!companies || companies.length === 0) {
    console.log("No available companies to add to pool");
    return 0;
  }

  // Update these companies to be in the active pool
  const companyIds = companies.map((c) => c.id);
  const { error: updateError } = await supabase
    .from("ideas")
    .update({
      is_in_active_pool: true,
      pool_added_at: new Date().toISOString(),
    })
    .in("id", companyIds);

  if (updateError) {
    console.error("Error updating companies for pool:", updateError.message);
    return 0;
  }

  console.log(`✓ Added ${companies.length} companies to active pool`);
  return companies.length;
}

// Run the import
importYCData()
  .then(async () => {
    // Ask if user wants to set initial pool
    console.log("\nYC data import complete.");

    // Also run setInitialActivePool
    await setInitialActivePool();
  })
  .then(() => {
    console.log("\nImport script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
