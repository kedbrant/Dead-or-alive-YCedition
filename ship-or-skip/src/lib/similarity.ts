import { SourceOutcome } from "./supabase/types";

// Industry keywords mapping - maps keywords to YC industry categories
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Fintech": [
    "payment", "payments", "banking", "bank", "finance", "financial", "fintech",
    "lending", "loan", "loans", "credit", "insurance", "investing", "investment",
    "crypto", "cryptocurrency", "blockchain", "defi", "wallet", "money", "trading"
  ],
  "Healthcare": [
    "health", "healthcare", "medical", "medicine", "doctor", "hospital", "patient",
    "diagnosis", "therapy", "clinical", "biotech", "pharma", "drug", "wellness",
    "mental health", "telemedicine", "telehealth"
  ],
  "B2B Software and Services": [
    "saas", "b2b", "enterprise", "software", "platform", "api", "automation",
    "workflow", "productivity", "crm", "erp", "analytics", "dashboard", "tool"
  ],
  "Consumer": [
    "consumer", "shopping", "retail", "ecommerce", "e-commerce", "marketplace",
    "food", "delivery", "restaurant", "fashion", "clothing", "travel", "booking",
    "social", "dating", "entertainment", "gaming", "game", "music", "video"
  ],
  "Education": [
    "education", "learning", "school", "university", "student", "teacher", "course",
    "training", "edtech", "tutoring", "classroom", "curriculum"
  ],
  "Real Estate and Construction": [
    "real estate", "property", "housing", "home", "apartment", "rent", "rental",
    "construction", "building", "architecture", "mortgage"
  ],
  "Industrials": [
    "manufacturing", "factory", "industrial", "supply chain", "logistics",
    "warehouse", "shipping", "freight", "robotics", "automation", "hardware"
  ],
  "Government": [
    "government", "civic", "public sector", "municipal", "federal", "compliance",
    "regulation", "policy"
  ],
};

/**
 * Detects the most likely industry based on pitch keywords
 */
export function detectIndustry(pitch: string): string | null {
  const lowerPitch = pitch.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerPitch.includes(keyword)) {
        // Longer keywords are more specific, give them more weight
        score += keyword.length > 5 ? 2 : 1;
      }
    }
    if (score > 0) {
      scores[industry] = score;
    }
  }

  // Find the industry with the highest score
  let bestIndustry: string | null = null;
  let bestScore = 0;

  for (const [industry, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIndustry = industry;
    }
  }

  return bestIndustry;
}

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
