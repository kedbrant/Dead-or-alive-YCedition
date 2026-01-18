/**
 * Reddit data source using RSS feeds
 * RSS is free and unlimited vs API rate limits
 */

import Parser from 'rss-parser';

export interface RedditPost {
  title: string;
  link: string;
  date: string | null;
  source: string; // subreddit name
  snippet: string;
}

export interface HackerNewsPost {
  title: string;
  link: string;
  date: string | null;
  source: 'Hacker News';
  snippet: string;
}

// Subreddits to search for startup-related discussions
const SUBREDDITS = ['startups', 'SaaS', 'Entrepreneur', 'smallbusiness'];

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['content', 'content'],
    ],
  },
});

/**
 * Extract a snippet from the RSS item content
 */
function extractSnippet(item: Parser.Item): string {
  // Try content:encoded first, then content, then title
  const content =
    (item as Record<string, unknown>).contentEncoded ||
    (item as Record<string, unknown>).content ||
    item.contentSnippet ||
    item.title ||
    '';

  // Strip HTML tags and limit length
  const text = String(content)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > 300 ? text.substring(0, 297) + '...' : text;
}

/**
 * Fetch Reddit posts from a single subreddit using RSS
 */
async function fetchFromSubreddit(
  subreddit: string,
  query: string
): Promise<RedditPost[]> {
  try {
    // Reddit RSS search URL format
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.reddit.com/r/${subreddit}/search.rss?q=${encodedQuery}&sort=relevance&limit=10`;

    const feed = await parser.parseURL(url);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items.map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      source: `r/${subreddit}`,
      snippet: extractSnippet(item),
    }));
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error);
    return [];
  }
}

/**
 * Search Reddit for posts related to a query across multiple subreddits
 * Uses RSS feeds for unlimited free access
 * @param query - Search query (e.g., startup idea or topic)
 * @returns Array of RedditPost objects sorted by date descending
 */
export async function searchReddit(query: string): Promise<RedditPost[]> {
  try {
    // Fetch from all subreddits in parallel
    const results = await Promise.all(
      SUBREDDITS.map((sub) => fetchFromSubreddit(sub, query))
    );

    // Flatten and combine all posts
    const allPosts = results.flat();

    // Sort by date descending (newest first)
    allPosts.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return allPosts;
  } catch (error) {
    console.error('Error searching Reddit:', error);
    return [];
  }
}

/**
 * Search Hacker News for posts related to a query using hnrss.org
 * @param query - Search query (e.g., startup idea or topic)
 * @returns Array of top 15 HackerNewsPost objects
 */
export async function searchHackerNews(
  query: string
): Promise<HackerNewsPost[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://hnrss.org/newest?q=${encodedQuery}&count=15`;

    const feed = await parser.parseURL(url);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items.map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      source: 'Hacker News' as const,
      snippet: extractSnippet(item),
    }));
  } catch (error) {
    console.error('Error searching Hacker News:', error);
    return [];
  }
}
