import { SourceOutcome } from "./supabase/types";

// Stop words to filter out during tokenization
const STOP_WORDS = new Set([
  "the",
  "for",
  "and",
  "that",
  "with",
  "your",
  "a",
  "an",
  "to",
  "of",
  "is",
  "in",
  "on",
]);

// Company type for similarity matching
export interface SimilarityCompany {
  slug: string;
  yc_name: string | null;
  yc_batch: string | null;
  hero: string;
  source_outcome: SourceOutcome;
  yc_industry: string | null;
  yc_team_size: number | null;
  ship_percentage: number;
  total_votes: number;
}

// Result type for similar company matches
export interface SimilarCompanyResult {
  company: SimilarityCompany;
  score: number; // Percentage (0-100)
}

/**
 * Tokenizes text for similarity matching:
 * - Converts to lowercase
 * - Removes punctuation
 * - Splits on spaces
 * - Filters out stop words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split on whitespace
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));
}

/**
 * Calculates similarity between two sets of tokens.
 * Returns matching tokens / user tokens as a ratio.
 */
function calculateSimilarity(
  userTokens: string[],
  companyTokens: string[]
): number {
  if (userTokens.length === 0) return 0;

  const companyTokenSet = new Set(companyTokens);
  let matchingCount = 0;

  for (const token of userTokens) {
    if (companyTokenSet.has(token)) {
      matchingCount++;
    }
  }

  return matchingCount / userTokens.length;
}

/**
 * Finds YC companies with similar pitches to the user's pitch.
 *
 * @param userPitch - The user's pitch text to compare
 * @param companies - Array of companies to search through
 * @returns Top 10 matches with score > 20%, sorted by score descending
 */
export function findSimilarCompanies(
  userPitch: string,
  companies: SimilarityCompany[]
): SimilarCompanyResult[] {
  const userTokens = tokenize(userPitch);

  if (userTokens.length === 0) {
    return [];
  }

  const results: SimilarCompanyResult[] = [];

  for (const company of companies) {
    const companyTokens = tokenize(company.hero);
    const similarity = calculateSimilarity(userTokens, companyTokens);

    // Filter results with score > 0.2 (20% match)
    if (similarity > 0.2) {
      results.push({
        company,
        score: Math.round(similarity * 100), // Convert to percentage
      });
    }
  }

  // Sort by score descending and return top 10
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}
