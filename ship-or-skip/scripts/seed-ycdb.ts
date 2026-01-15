/**
 * Seed script for YC startup ideas from YCDB (YC-OSS API)
 * Run with: npx tsx scripts/seed-ycdb.ts
 *
 * Fetches YC company data from the public YC-OSS API and seeds the database
 * with 500+ YC startup ideas.
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * These can be in .env.local file in the ship-or-skip directory
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

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

// Interface for YC company data from the API
interface YCCompany {
  id: string;
  name: string;
  slug: string;
  one_liner: string;
  long_description: string;
  batch: string;
  status: string;
  top_company: boolean;
  industry: string;
  subindustry: string;
  team_size: number;
  website: string;
  all_locations: string;
  tags: string[];
}

// Generate URL-friendly slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Map YC company status to our source_outcome format
function mapStatus(status: string): string {
  const statusLower = status?.toLowerCase() || "";

  if (statusLower === "acquired") return "acquired";
  if (statusLower === "inactive" || statusLower === "dead") return "shutdown";
  if (statusLower === "active" || statusLower === "public") return "success";

  // Default to success for unknown/active companies
  return "success";
}

// Create a compelling hero line from company data
function createHeroLine(company: YCCompany): string {
  // If one_liner exists and is short enough, use it
  if (company.one_liner && company.one_liner.length <= 60) {
    return company.one_liner;
  }

  // If one_liner is too long, truncate intelligently
  if (company.one_liner && company.one_liner.length > 60) {
    // Try to cut at a word boundary
    const truncated = company.one_liner.substring(0, 57);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 40) {
      return truncated.substring(0, lastSpace) + "...";
    }
    return truncated + "...";
  }

  // Fallback to company name
  return company.name;
}

// Create subtitle from company data
function createSubtitle(company: YCCompany): string {
  // If we used one_liner for hero, use long_description for subtitle
  if (company.one_liner && company.one_liner.length <= 60) {
    // Use the start of long_description if available
    if (company.long_description) {
      const desc = company.long_description;
      if (desc.length <= 100) return desc;

      // Truncate at word boundary
      const truncated = desc.substring(0, 97);
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > 60) {
        return truncated.substring(0, lastSpace) + "...";
      }
      return truncated + "...";
    }

    // Fallback to industry/tags info
    if (company.industry) {
      return `${company.industry} startup${company.batch ? ` from YC ${company.batch}` : ""}`;
    }
  }

  // If we used name for hero, use one_liner for subtitle
  if (company.one_liner) {
    if (company.one_liner.length <= 100) return company.one_liner;

    const truncated = company.one_liner.substring(0, 97);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 60) {
      return truncated.substring(0, lastSpace) + "...";
    }
    return truncated + "...";
  }

  // Fallback to industry info
  if (company.industry) {
    return `${company.industry} company`;
  }

  return "A YC-backed startup";
}

async function fetchYCCompanies(): Promise<YCCompany[]> {
  console.log("Fetching YC companies from API...");

  const response = await fetch(YC_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch YC data: ${response.status} ${response.statusText}`);
  }

  const companies: YCCompany[] = await response.json();
  console.log(`Fetched ${companies.length} companies from YC-OSS API`);

  return companies;
}

function filterValidCompanies(companies: YCCompany[]): YCCompany[] {
  return companies.filter((company) => {
    // Must have a name
    if (!company.name) return false;

    // Must have either one_liner or long_description
    if (!company.one_liner && !company.long_description) return false;

    // Filter out companies with very short/generic descriptions
    const desc = company.one_liner || company.long_description || "";
    if (desc.length < 10) return false;

    return true;
  });
}

async function seedYCCompanies() {
  console.log("Starting to seed YC companies...\n");

  // Fetch companies from API
  const allCompanies = await fetchYCCompanies();

  // Filter to valid companies with good descriptions
  const validCompanies = filterValidCompanies(allCompanies);
  console.log(`Found ${validCompanies.length} companies with valid descriptions\n`);

  // Prioritize companies: top companies first, then by batch (newer first)
  const sortedCompanies = validCompanies.sort((a, b) => {
    // Top companies first
    if (a.top_company && !b.top_company) return -1;
    if (!a.top_company && b.top_company) return 1;

    // Then sort by batch (newer first)
    const batchA = a.batch || "";
    const batchB = b.batch || "";
    return batchB.localeCompare(batchA);
  });

  // Take up to 600 companies (more than 500+ requirement)
  const companiesToSeed = sortedCompanies.slice(0, 600);

  console.log(`Seeding ${companiesToSeed.length} YC companies...\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Process in batches of 50 for better performance
  const batchSize = 50;

  for (let i = 0; i < companiesToSeed.length; i += batchSize) {
    const batch = companiesToSeed.slice(i, i + batchSize);

    const records = batch.map((company) => {
      const hero = createHeroLine(company);
      const subtitle = createSubtitle(company);
      const slug = generateSlug(company.name);

      return {
        slug,
        hero,
        subtitle,
        source: "yc",
        source_company: company.name,
        source_batch: company.batch || null,
        source_outcome: mapStatus(company.status),
        is_active: true,
      };
    });

    // Upsert batch
    const { data, error } = await supabase
      .from("ideas")
      .upsert(records, {
        onConflict: "slug",
        ignoreDuplicates: false,
      })
      .select("id, slug");

    if (error) {
      console.error(`Error upserting batch ${i / batchSize + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✓ Batch ${i / batchSize + 1}: ${batch.length} companies`);
    }
  }

  console.log("\n--- Seed Complete ---");
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total YC companies seeded: ${companiesToSeed.length}`);
}

// Run the seed function
seedYCCompanies()
  .then(() => {
    console.log("\nSeed script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
