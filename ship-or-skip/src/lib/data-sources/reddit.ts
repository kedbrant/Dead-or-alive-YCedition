import { extractKeywords } from "./yc";
import type { RedditPost } from "@/lib/supabase/types";

// Subreddits to search for startup-related discussions
const SUBREDDITS = ["startups", "SaaS", "Entrepreneur", "smallbusiness"];

// Request timeout in milliseconds
const FETCH_TIMEOUT = 10000;

// User-Agent header required by Reddit API
const USER_AGENT = "YCArchive/1.0 (Idea Validation Tool)";

interface RedditSearchResponse {
  kind: string;
  data: {
    children: Array<{
      kind: string;
      data: {
        subreddit: string;
        title: string;
        score: number;
        num_comments: number;
        permalink: string;
        id: string;
        created_utc: number;
      };
    }>;
  };
}

/**
 * Search a single subreddit for posts matching the given query
 */
async function searchSubreddit(
  subreddit: string,
  query: string
): Promise<RedditPost[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    // Reddit JSON API search endpoint
    const url = new URL(`https://www.reddit.com/r/${subreddit}/search.json`);
    url.searchParams.set("q", query);
    url.searchParams.set("restrict_sr", "on"); // Restrict to this subreddit
    url.searchParams.set("sort", "relevance");
    url.searchParams.set("t", "year"); // Posts from the last year
    url.searchParams.set("limit", "10"); // Get 10 per subreddit

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Rate limited or other error - return empty array gracefully
      console.warn(
        `Reddit API error for r/${subreddit}: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: RedditSearchResponse = await response.json();

    if (!data?.data?.children) {
      return [];
    }

    // Map Reddit response to RedditPost format
    return data.data.children.map((child) => ({
      subreddit: child.data.subreddit,
      title: child.data.title,
      score: child.data.score,
      comments: child.data.num_comments,
      url: `https://www.reddit.com${child.data.permalink}`,
    }));
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      console.warn(`Reddit API timeout for r/${subreddit}`);
    } else {
      console.warn(`Reddit API error for r/${subreddit}:`, err);
    }

    return [];
  }
}

/**
 * Search Reddit for discussions about the idea topic
 * Searches multiple startup-related subreddits and returns the top posts
 *
 * @param idea - The startup idea to search for
 * @returns Array of Reddit posts sorted by score descending, max 15 posts
 */
export async function searchReddit(idea: string): Promise<RedditPost[]> {
  // Extract keywords from idea for search query
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return [];
  }

  // Build search query from keywords (join with space for Reddit search)
  const searchQuery = keywords.slice(0, 5).join(" ");

  // Search all subreddits in parallel
  const searchPromises = SUBREDDITS.map((sub) =>
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
