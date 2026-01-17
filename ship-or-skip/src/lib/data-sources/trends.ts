import OpenAI from "openai";
import type { TrendsData } from "@/lib/supabase/types";
import { extractKeywords } from "./yc";

/**
 * SerpAPI configuration
 * To enable real Google Trends data:
 * 1. Get an API key from https://serpapi.com
 * 2. Set SERPAPI_KEY environment variable
 */
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE_URL = "https://serpapi.com/search.json";

// Lazily initialized OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Use AI to generate relevant Google Trends search terms for the idea
 * Returns 2-3 word phrases that people would actually search for
 */
async function generateSearchTerms(idea: string): Promise<string[]> {
  const openai = getOpenAIClient();
  if (!openai) {
    // Fallback to basic keyword extraction
    return extractKeywords(idea).slice(0, 3);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You generate Google Trends search terms. Given a startup idea, return 2-3 search phrases that potential customers would actually search for on Google.

Rules:
- Each phrase should be 2-3 words
- Focus on what customers search for, not business terms
- Be specific to the core product/service
- No generic terms like "app", "platform", "service"

Example:
Idea: "A marketplace to buy and sell horses"
Output: ["buy horses", "horses for sale", "horse trading"]

Respond with ONLY a JSON array of strings, no explanation.`,
        },
        {
          role: "user",
          content: idea,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return extractKeywords(idea).slice(0, 3);
    }

    const terms = JSON.parse(response) as string[];
    if (Array.isArray(terms) && terms.length > 0) {
      return terms.slice(0, 3);
    }
    return extractKeywords(idea).slice(0, 3);
  } catch (error) {
    console.warn("Failed to generate AI search terms:", error);
    return extractKeywords(idea).slice(0, 3);
  }
}

/**
 * Generate timeline data points spanning 1 year
 * Creates weekly data points from 1 year ago to current date (matches SerpAPI)
 */
function generateMockTimeline(baseLevel: number): { date: string; value: number }[] {
  const timeline: { date: string; value: number }[] = [];
  const now = new Date();

  // Generate ~52 weekly data points over 1 year (matches SerpAPI format)
  for (let i = 52; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
    const dateStr = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${date.getFullYear()}`;

    // Simulate realistic fluctuation around the base level
    // Small random walk with mean reversion - no artificial growth trend
    const noise = Math.round((Math.random() - 0.5) * 15);
    const seasonalVariation = Math.round(Math.sin(i / 8) * 5); // slight seasonal pattern
    const value = Math.max(5, Math.min(100, baseLevel + noise + seasonalVariation));

    timeline.push({ date: dateStr, value });
  }

  return timeline;
}

/**
 * Calculate percentage change between start and end of timeline
 * Capped at ±100% to avoid unrealistic numbers
 */
function calculateChangePercent(timeline: { date: string; value: number }[]): number {
  if (timeline.length < 6) return 0;

  // Use average of first quarter vs last quarter for stability
  const quarterLength = Math.floor(timeline.length / 4);
  const startValues = timeline.slice(0, quarterLength).map(t => t.value);
  const endValues = timeline.slice(-quarterLength).map(t => t.value);

  const startAvg = startValues.reduce((a, b) => a + b, 0) / startValues.length;
  const endAvg = endValues.reduce((a, b) => a + b, 0) / endValues.length;

  // Avoid division by zero - use a minimum baseline
  const baseline = Math.max(startAvg, 10);

  const changePercent = Math.round(((endAvg - baseline) / baseline) * 100);

  // Cap at ±100% to keep it realistic
  return Math.max(-100, Math.min(100, changePercent));
}

/**
 * Generate deterministic mock data based on idea keywords
 * Uses keyword hashing to produce consistent results for the same idea
 */
function generateMockTrendsData(idea: string): TrendsData {
  const keywords = extractKeywords(idea);
  const searchKeywords = keywords.slice(0, 3);

  // Create a simple hash from keywords for deterministic but varied results
  let hash = 0;
  const keywordStr = keywords.join("");
  for (let i = 0; i < keywordStr.length; i++) {
    hash = ((hash << 5) - hash) + keywordStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate base level between 30-80 based on hash
  const baseLevel = 30 + Math.abs(hash % 51);

  // Generate timeline
  const timeline = generateMockTimeline(baseLevel);

  // Calculate actual change from timeline
  const changePercent = calculateChangePercent(timeline);

  // Current level is the last timeline value
  const currentLevel = timeline[timeline.length - 1].value;

  return {
    currentLevel,
    changePercent,
    timeline,
    keywords: searchKeywords,
    isRealData: false,
  };
}

/**
 * Fetch Google Trends data from SerpAPI
 * See: https://serpapi.com/google-trends-api
 */
async function fetchFromSerpAPI(query: string, keywords: string[]): Promise<TrendsData | null> {
  if (!SERPAPI_KEY) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const params = new URLSearchParams({
      api_key: SERPAPI_KEY,
      engine: "google_trends",
      q: query,
      data_type: "TIMESERIES",
      date: "today 12-m", // Last 12 months (max supported by SerpAPI)
    });

    const response = await fetch(`${SERPAPI_BASE_URL}?${params}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`SerpAPI request failed: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.warn("SerpAPI error:", data.error);
      return null;
    }

    // Parse SerpAPI response
    if (!data.interest_over_time?.timeline_data) {
      console.warn("SerpAPI returned no timeline data");
      return null;
    }

    const timelineData = data.interest_over_time.timeline_data;
    const timeline: { date: string; value: number }[] = timelineData.map(
      (point: { date: string; values: { extracted_value: number }[] }) => ({
        date: point.date,
        value: point.values?.[0]?.extracted_value ?? 0,
      })
    );

    const currentLevel = timeline[timeline.length - 1]?.value ?? 0;
    const changePercent = calculateChangePercent(timeline);

    return {
      currentLevel,
      changePercent,
      timeline,
      keywords,
      isRealData: true,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("SerpAPI request timeout");
    } else {
      console.warn("SerpAPI error:", error);
    }
    return null;
  }
}

/**
 * Aggregate trends data from multiple search term results
 * Uses highest currentLevel and averages timeline values
 */
function aggregateTrendsData(results: TrendsData[]): TrendsData {
  if (results.length === 0) {
    throw new Error("Cannot aggregate empty results");
  }

  if (results.length === 1) {
    return results[0];
  }

  // Find the highest current level across all terms
  const maxCurrentLevel = Math.max(...results.map(r => r.currentLevel));

  // Collect all keywords (filter out undefined)
  const allKeywords = [...new Set(results.flatMap(r => r.keywords || []))];

  // Average the timeline values across all results
  // Use the timeline from the result with highest currentLevel as base
  const bestResult = results.find(r => r.currentLevel === maxCurrentLevel) || results[0];
  const baseTimeline = bestResult.timeline;

  const aggregatedTimeline = baseTimeline.map((point, index) => {
    const values = results
      .map(r => r.timeline[index]?.value)
      .filter((v): v is number => v !== undefined);
    const avgValue = values.length > 0
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : point.value;
    return { date: point.date, value: avgValue };
  });

  const changePercent = calculateChangePercent(aggregatedTimeline);

  return {
    currentLevel: maxCurrentLevel,
    changePercent,
    timeline: aggregatedTimeline,
    keywords: allKeywords,
    isRealData: true,
  };
}

/**
 * Get Google Trends data for a startup idea
 *
 * If SERPAPI_KEY environment variable is set, fetches real data from Google Trends
 * via SerpAPI. Otherwise, returns mock data that simulates typical trend patterns.
 *
 * @param idea - The startup idea to get trends for
 * @param precomputedTerms - Optional pre-computed search terms from initial analysis
 * @returns TrendsData with currentLevel (0-100), changePercent, and timeline
 */
export async function getGoogleTrends(idea: string, precomputedTerms?: string[]): Promise<TrendsData | null> {
  // Use pre-computed terms if provided, otherwise generate them
  const searchTerms = precomputedTerms && precomputedTerms.length > 0
    ? precomputedTerms
    : await generateSearchTerms(idea);

  if (searchTerms.length === 0) {
    return null;
  }

  // Try to fetch real data from SerpAPI if configured
  if (SERPAPI_KEY) {
    // Make parallel SerpAPI calls for all search terms
    const serpApiPromises = searchTerms.map(term =>
      fetchFromSerpAPI(term, [term])
    );
    const results = await Promise.all(serpApiPromises);
    const validResults = results.filter((r): r is TrendsData => r !== null);

    if (validResults.length > 0) {
      // Aggregate results from all search terms
      return aggregateTrendsData(validResults);
    }
    // Fall through to mock data if all API calls fail
    console.log("Falling back to mock trends data");
  }

  // Return mock data for MVP (no SerpAPI key configured)
  // Note: This is placeholder data to demonstrate functionality
  // Set SERPAPI_KEY environment variable for real Google Trends data
  return generateMockTrendsData(idea);
}
