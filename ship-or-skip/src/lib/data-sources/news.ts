/**
 * News data source using Serper API (Google News)
 * Replaces SerpAPI to save budget for Google Trends
 */

import { searchNews, SerperResult } from '../serper';

export interface NewsArticle {
  title: string;
  link: string;
  snippet: string;
  date: string | null;
  source: string;
}

/**
 * Parse a relative date string (e.g., "2 days ago", "1 hour ago") into a Date object
 */
function parseRelativeDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  const now = new Date();
  const lower = dateStr.toLowerCase();

  // Try to parse relative dates like "2 days ago", "1 hour ago", etc.
  const match = lower.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2];

    const date = new Date(now);
    switch (unit) {
      case 'second':
        date.setSeconds(date.getSeconds() - amount);
        break;
      case 'minute':
        date.setMinutes(date.getMinutes() - amount);
        break;
      case 'hour':
        date.setHours(date.getHours() - amount);
        break;
      case 'day':
        date.setDate(date.getDate() - amount);
        break;
      case 'week':
        date.setDate(date.getDate() - amount * 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - amount);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - amount);
        break;
    }
    return date;
  }

  // Try to parse as ISO date or other standard format
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Check if a date is within the last N days
 */
function isWithinDays(date: Date | null, days: number): boolean {
  if (!date) return true; // Include items without dates

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);

  return date >= cutoff;
}

/**
 * Fetch news articles related to a query using Serper API
 * @param query - Search query (e.g., startup idea or topic)
 * @returns Array of NewsArticle objects (max 10, last 30 days)
 */
export async function fetchNews(query: string): Promise<NewsArticle[]> {
  try {
    const results = await searchNews(query);

    if (!results || results.length === 0) {
      return [];
    }

    // Filter to last 30 days and transform to NewsArticle format
    const articles: NewsArticle[] = results
      .map((result: SerperResult) => {
        const parsedDate = parseRelativeDate(result.date);
        return {
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          date: parsedDate ? parsedDate.toISOString() : result.date || null,
          source: extractSource(result.link),
          _parsedDate: parsedDate,
        };
      })
      .filter((article) => isWithinDays(article._parsedDate, 30))
      .map(({ _parsedDate, ...article }) => article) // Remove internal field
      .slice(0, 10); // Return top 10 most relevant

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

/**
 * Extract the source domain from a URL
 */
function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. prefix and return domain
    return hostname.replace(/^www\./, '');
  } catch {
    return 'Unknown';
  }
}
