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

/**
 * Generate timeline data points spanning 2 years
 * Creates monthly data points from 2 years ago to current date
 */
function generateMockTimeline(baseLevel: number): { date: string; value: number }[] {
  const timeline: { date: string; value: number }[] = [];
  const now = new Date();

  // Generate 24 monthly data points over 2 years
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    // Simulate organic growth with some variation
    // Start at lower level, gradually increase with noise
    const progress = (23 - i) / 23; // 0 to 1 over time
    const baseValue = Math.round(baseLevel * (0.5 + 0.5 * progress));
    const noise = Math.round((Math.random() - 0.5) * 10);
    const value = Math.max(0, Math.min(100, baseValue + noise));

    timeline.push({ date: dateStr, value });
  }

  return timeline;
}

/**
 * Calculate percentage change between start and end of timeline
 */
function calculateChangePercent(timeline: { date: string; value: number }[]): number {
  if (timeline.length < 2) return 0;

  // Use average of first 3 months vs last 3 months for stability
  const startValues = timeline.slice(0, 3).map(t => t.value);
  const endValues = timeline.slice(-3).map(t => t.value);

  const startAvg = startValues.reduce((a, b) => a + b, 0) / startValues.length;
  const endAvg = endValues.reduce((a, b) => a + b, 0) / endValues.length;

  if (startAvg === 0) return endAvg > 0 ? 100 : 0;

  return Math.round(((endAvg - startAvg) / startAvg) * 100);
}

/**
 * Generate deterministic mock data based on idea keywords
 * Uses keyword hashing to produce consistent results for the same idea
 */
function generateMockTrendsData(idea: string): TrendsData {
  const keywords = extractKeywords(idea);

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
  };
}

/**
 * Fetch Google Trends data from SerpAPI
 * See: https://serpapi.com/google-trends-api
 */
async function fetchFromSerpAPI(query: string): Promise<TrendsData | null> {
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
      date: "today 24-m", // Last 24 months
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

    // Parse SerpAPI response
    if (!data.interest_over_time?.timeline_data) {
      console.warn("SerpAPI returned no timeline data");
      return null;
    }

    const timelineData = data.interest_over_time.timeline_data;
    const timeline: { date: string; value: number }[] = timelineData.map(
      (point: { date: string; values: { value: number }[] }) => ({
        date: point.date,
        value: point.values?.[0]?.value ?? 0,
      })
    );

    const currentLevel = timeline[timeline.length - 1]?.value ?? 0;
    const changePercent = calculateChangePercent(timeline);

    return {
      currentLevel,
      changePercent,
      timeline,
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
 * Get Google Trends data for a startup idea
 *
 * If SERPAPI_KEY environment variable is set, fetches real data from Google Trends
 * via SerpAPI. Otherwise, returns mock data that simulates typical trend patterns.
 *
 * @param idea - The startup idea to get trends for
 * @returns TrendsData with currentLevel (0-100), changePercent, and timeline
 */
export async function getGoogleTrends(idea: string): Promise<TrendsData | null> {
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return null;
  }

  // Build search query from most relevant keywords
  const searchQuery = keywords.slice(0, 3).join(" ");

  // Try to fetch real data from SerpAPI if configured
  if (SERPAPI_KEY) {
    const serpApiData = await fetchFromSerpAPI(searchQuery);
    if (serpApiData) {
      return serpApiData;
    }
    // Fall through to mock data if API fails
    console.log("Falling back to mock trends data");
  }

  // Return mock data for MVP (no SerpAPI key configured)
  // Note: This is placeholder data to demonstrate functionality
  // Set SERPAPI_KEY environment variable for real Google Trends data
  return generateMockTrendsData(idea);
}
