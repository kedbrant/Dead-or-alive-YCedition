import OpenAI from "openai";
import { extractKeywords } from "./yc";
import type { RedditPost } from "@/lib/supabase/types";

// Fallback subreddits when AI suggestion is unavailable
// These are customer-focused general communities, not entrepreneur communities
const FALLBACK_SUBREDDITS = ["technology", "gadgets", "productivity", "InternetIsBeautiful", "LifeProTips"];

// Request timeout in milliseconds
const FETCH_TIMEOUT = 10000;

// User-Agent header for Reddit RSS feeds
const USER_AGENT = "Mozilla/5.0 (compatible; YCArchive/1.0; +https://ycarchive.com)";

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
 * Use AI to suggest relevant subreddits for the target customers of this idea
 * Returns subreddits where potential customers would discuss their problems
 */
async function suggestSubreddits(idea: string): Promise<string[]> {
  const openai = getOpenAIClient();
  if (!openai) {
    return FALLBACK_SUBREDDITS;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at identifying Reddit communities. Given a startup idea, suggest 4-6 subreddits where the TARGET CUSTOMERS would discuss their problems and needs.

IMPORTANT: Focus on CUSTOMER communities, not entrepreneur/business communities. We want to understand what customers are saying about the problem, not what founders say about running businesses.

For example:
- Room rental marketplace → r/roommates, r/personalfinance, r/landlord, r/realestate, r/frugal
- Pet sitting app → r/dogs, r/cats, r/pets, r/petcare, r/travel
- Fitness tracking app → r/fitness, r/running, r/loseit, r/bodybuilding

Respond with ONLY a JSON array of subreddit names (without r/ prefix), no explanation.
Example: ["roommates", "personalfinance", "landlord", "realestate"]`,
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
      return FALLBACK_SUBREDDITS;
    }

    const subreddits = JSON.parse(response) as string[];
    if (Array.isArray(subreddits) && subreddits.length > 0) {
      return subreddits.slice(0, 6);
    }
    return FALLBACK_SUBREDDITS;
  } catch (error) {
    console.warn("Failed to get AI subreddit suggestions:", error);
    return FALLBACK_SUBREDDITS;
  }
}

/**
 * Parse Reddit RSS feed XML to extract post data
 * RSS feeds don't include score/comments, so we estimate based on position
 */
function parseRSSFeed(xml: string, subreddit: string): RedditPost[] {
  const posts: RedditPost[] = [];

  // Simple regex-based XML parsing for RSS items
  const itemRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const titleRegex = /<title>([\s\S]*?)<\/title>/;
  const linkRegex = /<link href="([^"]+)"/;

  let match;
  let position = 0;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = item.match(titleRegex);
    const linkMatch = item.match(linkRegex);

    if (titleMatch && linkMatch) {
      // Decode HTML entities in title
      const title = titleMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      const url = linkMatch[1];

      // Skip if it's just the subreddit link, not a post
      if (url.includes("/comments/")) {
        posts.push({
          subreddit,
          title,
          score: Math.max(1, 100 - position * 10), // Estimate score based on position
          comments: Math.max(0, 20 - position * 2), // Estimate comments
          url,
        });
        position++;
      }
    }

    // Limit to 10 posts per subreddit
    if (posts.length >= 10) break;
  }

  return posts;
}

/**
 * Search a single subreddit for posts matching the given query using RSS feed
 */
async function searchSubreddit(
  subreddit: string,
  query: string
): Promise<RedditPost[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    // Reddit RSS search endpoint - bypasses API restrictions
    const url = new URL(`https://www.reddit.com/r/${subreddit}/search.rss`);
    url.searchParams.set("q", query);
    url.searchParams.set("restrict_sr", "on");
    url.searchParams.set("sort", "relevance");
    url.searchParams.set("t", "year");
    url.searchParams.set("limit", "10");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Reddit RSS error for r/${subreddit}: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const xml = await response.text();
    return parseRSSFeed(xml, subreddit);
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      console.warn(`Reddit RSS timeout for r/${subreddit}`);
    } else {
      console.warn(`Reddit RSS error for r/${subreddit}:`, err);
    }

    return [];
  }
}

/**
 * Search Reddit for discussions about the idea topic
 * Uses AI to suggest relevant customer-focused subreddits based on the idea
 *
 * @param idea - The startup idea to search for
 * @param precomputedSubreddits - Optional pre-computed subreddits from initial analysis
 * @returns Array of Reddit posts sorted by score descending, max 15 posts
 */
export async function searchReddit(idea: string, precomputedSubreddits?: string[]): Promise<RedditPost[]> {
  // Extract keywords from idea for search query
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return [];
  }

  // Use pre-computed subreddits if provided, otherwise generate them
  const subreddits = precomputedSubreddits && precomputedSubreddits.length > 0
    ? precomputedSubreddits
    : await suggestSubreddits(idea);

  // Build search query from keywords (join with space for Reddit search)
  const searchQuery = keywords.slice(0, 5).join(" ");

  // Search all subreddits in parallel
  const searchPromises = subreddits.map((sub) =>
    searchSubreddit(sub, searchQuery)
  );

  try {
    const results = await Promise.all(searchPromises);

    // Flatten results from all subreddits
    const allPosts = results.flat();

    // Sort by score descending and return top 15
    return allPosts.sort((a, b) => b.score - a.score).slice(0, 15);
  } catch (err) {
    console.error("Error searching Reddit:", err);
    return [];
  }
}
