import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { YCCompanyMatch, Idea } from "@/lib/supabase/types";

// Stop words to filter out during keyword extraction
const STOP_WORDS = new Set([
  // Common words
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "need", "that", "this",
  "these", "those", "i", "you", "he", "she", "it", "we", "they", "what",
  "which", "who", "whom", "whose", "where", "when", "why", "how", "all",
  "each", "every", "both", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "also", "now", "your", "my", "our", "their", "its", "his", "her",
  // Generic verbs (too broad)
  "want", "wants", "wanted", "get", "gets", "getting", "got",
  "use", "uses", "used", "using", "let", "lets", "allow", "allows",
  "give", "gives", "take", "takes", "buy", "buys", "sell", "sells",
  "find", "finds", "show", "shows", "try", "tries", "start", "starts",
  "help", "helps", "connect", "connects", "connecting", "provide", "provides",
  // Generic startup/tech terms (too broad for matching)
  "app", "platform", "software", "service", "tool", "company", "startup",
  "business", "product", "solution", "market", "marketplace", "users", "customers",
  "powered", "based", "driven", "enabled", "helps",
  "make", "makes", "making", "create", "creates", "creating", "build", "builds",
  "building", "new", "better", "easy", "simple", "fast", "smart",
  "intelligent", "automated", "automatic", "digital", "online", "web",
  "mobile", "cloud", "data", "tech", "technology", "modern", "next",
  "generation", "innovative", "innovation", "revolutionary", "disruptive",
  "world", "global", "local", "people", "anyone", "everyone", "way",
  "time", "first", "best", "top", "leading", "fastest", "easiest",
]);

// Minimum similarity score to include a company (filters out weak matches)
const MIN_SIMILARITY_SCORE = 15;

/**
 * Extract keywords from idea text for searching
 * Tokenizes the idea into lowercase words, removes stop words,
 * and returns the top 10 most relevant keywords
 */
export function extractKeywords(idea: string): string[] {
  return idea
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Calculate similarity score between an idea and a company's pitch
 * Returns a score from 0-100 based on keyword matches
 */
function calculateSimilarityScore(
  keywords: string[],
  hero: string,
  ycName: string | null
): number {
  if (keywords.length === 0) return 0;

  const heroLower = hero.toLowerCase();
  const nameLower = (ycName || "").toLowerCase();

  let matchCount = 0;
  let nameMatchBonus = 0;

  for (const kw of keywords) {
    // Check if keyword appears in hero text
    if (heroLower.includes(kw)) {
      matchCount++;
    }
    // Bonus for matching company name
    if (nameLower.includes(kw)) {
      nameMatchBonus += 0.5;
    }
  }

  // Calculate base similarity as percentage of keywords matched
  const baseSimilarity = matchCount / keywords.length;

  // Add name match bonus (capped)
  const totalSimilarity = Math.min(1, baseSimilarity + nameMatchBonus / keywords.length);

  return Math.round(totalSimilarity * 100);
}

/**
 * Search YC companies for similar ideas
 *
 * @param idea - The startup idea to search for similar companies
 * @returns Array of matching YC companies with similarity scores, sorted by score descending
 */
export async function searchYCCompanies(idea: string): Promise<YCCompanyMatch[]> {
  const supabase = createServerSupabaseClient();
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return [];
  }

  // Build ILIKE conditions for each keyword on both hero and yc_name fields
  const heroConditions = keywords.map((kw) => `hero.ilike.%${kw}%`);
  const nameConditions = keywords.map((kw) => `yc_name.ilike.%${kw}%`);
  const searchConditions = [...heroConditions, ...nameConditions].join(",");

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("yc_name, yc_batch, hero, source_outcome, yc_team_size, yc_slug")
    .eq("source", "yc")
    .or(searchConditions)
    .limit(50) // Fetch more to ensure we get 20 quality matches after scoring
    .returns<Idea[]>();

  if (error || !ideas) {
    console.error("Error searching YC companies:", error);
    return [];
  }

  // Calculate similarity scores and map to YCCompanyMatch format
  const matches: YCCompanyMatch[] = ideas.map((item) => ({
    name: item.yc_name || item.hero.slice(0, 50),
    batch: item.yc_batch || "Unknown",
    pitch: item.hero,
    outcome: item.source_outcome,
    team_size: item.yc_team_size,
    slug: item.yc_slug || "",
    similarity_score: calculateSimilarityScore(keywords, item.hero, item.yc_name),
  }));

  // Filter out weak matches and sort by similarity score descending
  return matches
    .filter((m) => m.similarity_score >= MIN_SIMILARITY_SCORE)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 20);
}
