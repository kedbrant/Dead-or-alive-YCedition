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

// Important short terms that should NOT be filtered out despite being 2 chars or less
const IMPORTANT_SHORT_TERMS = new Set([
  "ai", "ml", "vr", "ar", "xr", "ui", "ux", "api", "qr", "iot",
  "hr", "pr", "cx", "pm", "b2b", "b2c", "d2c", "p2p", "vc", "db", "os", "id", "crm", "erp"
]);

// Minimum similarity score to include a company (filters out weak matches)
// Requires ~3 keyword matches from 10 keywords to filter out weak single-field matches
const MIN_SIMILARITY_SCORE = 30;

/**
 * Parse YC batch string to a sortable number
 * "W24" -> 2024.0, "S24" -> 2024.5, "F24" -> 2024.7
 * Used for sorting by newest batch when scores are tied
 */
function parseBatchToNumber(batch: string): number {
  const match = batch.match(/^([WSF])(\d{2})$/i);
  if (!match) return 0;
  const [, season, year] = match;
  const fullYear = parseInt(year) + (parseInt(year) > 50 ? 1900 : 2000);
  const seasonOffset = season.toUpperCase() === 'W' ? 0 : season.toUpperCase() === 'S' ? 0.5 : 0.7;
  return fullYear + seasonOffset;
}

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
    .filter((word) =>
      !STOP_WORDS.has(word) &&
      (word.length > 2 || IMPORTANT_SHORT_TERMS.has(word))
    )
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Calculate similarity score between an idea and a company's pitch
 * Returns a score from 0-100 based on keyword matches
 * Enhanced to require matches across multiple fields for higher precision
 */
function calculateSimilarityScore(
  keywords: string[],
  hero: string,
  ycName: string | null,
  ycTags: string[] | null,
  ycIndustry: string | null,
  ycLongDescription: string | null
): number {
  if (keywords.length === 0) return 0;

  const heroLower = hero.toLowerCase();
  const nameLower = (ycName || "").toLowerCase();
  const industryLower = (ycIndustry || "").toLowerCase();
  const descLower = (ycLongDescription || "").toLowerCase();
  const tagsLower = (ycTags || []).map(t => t.toLowerCase());

  // Track which fields have matches for multi-field requirement
  const heroMatches = new Set<string>();
  const descMatches = new Set<string>();
  const tagMatches = new Set<string>();
  const nameMatches = new Set<string>();
  const industryMatches = new Set<string>();

  for (const kw of keywords) {
    if (heroLower.includes(kw)) heroMatches.add(kw);
    if (descLower.includes(kw)) descMatches.add(kw);
    if (nameLower.includes(kw)) nameMatches.add(kw);
    if (industryLower.includes(kw)) industryMatches.add(kw);
    if (tagsLower.some(tag => tag.includes(kw) || kw.includes(tag))) tagMatches.add(kw);
  }

  // Count keywords that match in 2+ different fields (higher quality matches)
  let multiFieldMatchCount = 0;
  let singleFieldMatchCount = 0;

  for (const kw of keywords) {
    let fieldCount = 0;
    if (heroMatches.has(kw)) fieldCount++;
    if (descMatches.has(kw)) fieldCount++;
    if (tagMatches.has(kw)) fieldCount++;
    if (nameMatches.has(kw)) fieldCount++;
    if (industryMatches.has(kw)) fieldCount++;

    if (fieldCount >= 2) {
      multiFieldMatchCount++;
    } else if (fieldCount === 1) {
      singleFieldMatchCount++;
    }
  }

  // Multi-field matches are worth more (2x weight)
  const effectiveMatches = multiFieldMatchCount * 2 + singleFieldMatchCount;
  const maxPossible = keywords.length * 2; // If all keywords matched in 2+ fields

  // Bonus for tag matches (strong semantic signal)
  const tagBonus = tagMatches.size * 0.5;
  // Bonus for name matches
  const nameBonus = nameMatches.size * 0.3;

  const baseSimilarity = effectiveMatches / maxPossible;
  const bonuses = (tagBonus + nameBonus) / keywords.length;
  const totalSimilarity = Math.min(1, baseSimilarity + bonuses);

  return Math.round(totalSimilarity * 100);
}

/**
 * Search YC companies for similar ideas
 *
 * @param idea - The startup idea to search for similar companies
 * @param aiSearchTerms - Optional AI-generated semantic search terms for better matching
 * @returns Array of matching YC companies with similarity scores, sorted by score descending
 */
export async function searchYCCompanies(idea: string, aiSearchTerms?: string[]): Promise<YCCompanyMatch[]> {
  const supabase = createServerSupabaseClient();
  const keywords = extractKeywords(idea);

  // Combine extracted keywords with AI-generated semantic terms for better coverage
  const allSearchTerms = [
    ...keywords,
    ...(aiSearchTerms || []).map(t => t.toLowerCase())
  ];

  // Deduplicate search terms
  const uniqueSearchTerms = [...new Set(allSearchTerms)];

  if (uniqueSearchTerms.length === 0) {
    return [];
  }

  // Build ILIKE conditions for multiple fields to find relevant companies
  const heroConditions = uniqueSearchTerms.map((kw) => `hero.ilike.%${kw}%`);
  const nameConditions = uniqueSearchTerms.map((kw) => `yc_name.ilike.%${kw}%`);
  const industryConditions = uniqueSearchTerms.map((kw) => `yc_industry.ilike.%${kw}%`);
  const descConditions = uniqueSearchTerms.map((kw) => `yc_long_description.ilike.%${kw}%`);
  const searchConditions = [...heroConditions, ...nameConditions, ...industryConditions, ...descConditions].join(",");

  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("yc_name, yc_batch, hero, source_outcome, yc_team_size, yc_slug, yc_tags, yc_industry, yc_long_description")
    .eq("source", "yc")
    .or(searchConditions)
    .limit(100) // Fetch more to ensure we get 20 quality matches after scoring
    .returns<Idea[]>();

  if (error || !ideas) {
    console.error("Error searching YC companies:", error);
    return [];
  }

  // Calculate similarity scores using both original keywords and AI terms
  const matches: YCCompanyMatch[] = ideas.map((item) => ({
    name: item.yc_name || item.hero.slice(0, 50),
    batch: item.yc_batch || "Unknown",
    pitch: item.hero,
    outcome: item.source_outcome,
    team_size: item.yc_team_size,
    slug: item.yc_slug || "",
    similarity_score: calculateSimilarityScore(
      uniqueSearchTerms,
      item.hero,
      item.yc_name,
      item.yc_tags,
      item.yc_industry,
      item.yc_long_description
    ),
  }));

  // Filter out weak matches and sort by score (primary) then batch date (secondary, newest wins ties)
  return matches
    .filter((m) => m.similarity_score >= MIN_SIMILARITY_SCORE)
    .sort((a, b) => {
      const scoreDiff = b.similarity_score - a.similarity_score;
      if (scoreDiff !== 0) return scoreDiff;
      return parseBatchToNumber(b.batch) - parseBatchToNumber(a.batch);
    })
    .slice(0, 20);
}
