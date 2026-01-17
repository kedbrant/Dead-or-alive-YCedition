import type { NewsArticle } from "@/lib/supabase/types";
import { extractKeywords } from "./yc";

// RSS feed URLs for news sources
const GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss/search";
const TECHCRUNCH_RSS = "https://techcrunch.com/feed/";

// 30 days in milliseconds
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Parse an RSS XML string to extract article items
 * Uses simple regex-based parsing to avoid external dependencies
 */
function parseRssXml(
  xml: string,
  sourceName: string
): { title: string; link: string; pubDate: string }[] {
  const items: { title: string; link: string; pubDate: string }[] = [];

  // Match <item>...</item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    // Extract title (handle CDATA)
    const titleMatch = itemContent.match(
      /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/
    );
    // Extract link
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    // Extract pubDate
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1].trim(),
        link: linkMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : "",
      });
    }
  }

  return items.map((item) => ({ ...item, sourceName }));
}

/**
 * Extract actual article URL from Google News redirect URL
 * Google News URLs are in format: https://news.google.com/rss/articles/...
 */
function cleanGoogleNewsUrl(url: string): string {
  // Google News URLs redirect, but we return them as-is since they still work
  return url;
}

/**
 * Fetch RSS feed with error handling
 */
async function fetchRss(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; YCArchiveBot/1.0; +https://ycarchive.com)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`RSS fetch failed for ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`RSS fetch timeout for ${url}`);
    } else {
      console.warn(`RSS fetch error for ${url}:`, error);
    }
    return null;
  }
}

/**
 * Build Google News RSS search URL
 * Encodes the search query for RSS feed
 */
function buildGoogleNewsUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query);
  // Add "startup" or "tech" to improve relevance
  return `${GOOGLE_NEWS_RSS_BASE}?q=${encodedQuery}+startup+OR+tech&hl=en-US&gl=US&ceid=US:en`;
}

/**
 * Check if a date is within the last 30 days
 */
function isWithinLast30Days(dateStr: string): boolean {
  if (!dateStr) return false;

  try {
    const date = new Date(dateStr);
    const now = Date.now();
    return now - date.getTime() <= THIRTY_DAYS_MS;
  } catch {
    return false;
  }
}

/**
 * Format date string for consistent display
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];

  try {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

/**
 * Filter TechCrunch articles by relevance to the idea keywords
 */
function filterByRelevance(
  articles: { title: string; link: string; pubDate: string }[],
  keywords: string[]
): { title: string; link: string; pubDate: string }[] {
  if (keywords.length === 0) return articles;

  return articles.filter((article) => {
    const titleLower = article.title.toLowerCase();
    // Article must contain at least one keyword
    return keywords.some((kw) => titleLower.includes(kw));
  });
}

/**
 * Fetch recent news articles about the idea topic from RSS feeds
 *
 * @param idea - The startup idea to search for related news
 * @returns Array of news articles from the last 30 days, max 10 articles
 */
export async function fetchRecentNews(idea: string): Promise<NewsArticle[]> {
  const keywords = extractKeywords(idea);

  if (keywords.length === 0) {
    return [];
  }

  // Create a search query from the most relevant keywords (first 3-4)
  const searchQuery = keywords.slice(0, 4).join(" ");

  // Fetch from multiple sources in parallel
  const [googleNewsXml, techCrunchXml] = await Promise.all([
    fetchRss(buildGoogleNewsUrl(searchQuery)),
    fetchRss(TECHCRUNCH_RSS),
  ]);

  const allArticles: NewsArticle[] = [];

  // Parse Google News results
  if (googleNewsXml) {
    const googleItems = parseRssXml(googleNewsXml, "Google News");

    for (const item of googleItems) {
      if (isWithinLast30Days(item.pubDate)) {
        allArticles.push({
          title: item.title,
          source: "Google News",
          date: formatDate(item.pubDate),
          url: cleanGoogleNewsUrl(item.link),
        });
      }
    }
  }

  // Parse TechCrunch results (filter by relevance since it's a general feed)
  if (techCrunchXml) {
    const techCrunchItems = parseRssXml(techCrunchXml, "TechCrunch");
    const relevantItems = filterByRelevance(techCrunchItems, keywords);

    for (const item of relevantItems) {
      if (isWithinLast30Days(item.pubDate)) {
        allArticles.push({
          title: item.title,
          source: "TechCrunch",
          date: formatDate(item.pubDate),
          url: item.link,
        });
      }
    }
  }

  // Sort by date (newest first) and return top 10
  return allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}
