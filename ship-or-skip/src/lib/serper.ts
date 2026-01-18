/**
 * Serper API client for Google News and Web search
 * Free tier: 2,500 searches/month (vs SerpAPI's 250)
 *
 * API docs: https://serper.dev/docs
 */

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

interface SerperNewsResponse {
  news?: Array<{
    title: string;
    link: string;
    snippet: string;
    date?: string;
  }>;
}

interface SerperSearchResponse {
  organic?: Array<{
    title: string;
    link: string;
    snippet: string;
    date?: string;
  }>;
}

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_NEWS_URL = 'https://google.serper.dev/news';
const SERPER_SEARCH_URL = 'https://google.serper.dev/search';

/**
 * Search Google News using Serper API
 * @param query - Search query string
 * @returns Array of SerperResult objects
 */
export async function searchNews(query: string): Promise<SerperResult[]> {
  if (!SERPER_API_KEY) {
    console.error('SERPER_API_KEY not configured');
    return [];
  }

  try {
    const response = await fetch(SERPER_NEWS_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
      console.error(`Serper news API error: ${response.status}`);
      return [];
    }

    const data: SerperNewsResponse = await response.json();

    return (data.news || []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date,
    }));
  } catch (error) {
    console.error('Serper news search error:', error);
    return [];
  }
}

/**
 * Search Google Web using Serper API
 * @param query - Search query string
 * @returns Array of SerperResult objects
 */
export async function searchWeb(query: string): Promise<SerperResult[]> {
  if (!SERPER_API_KEY) {
    console.error('SERPER_API_KEY not configured');
    return [];
  }

  try {
    const response = await fetch(SERPER_SEARCH_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
      console.error(`Serper search API error: ${response.status}`);
      return [];
    }

    const data: SerperSearchResponse = await response.json();

    return (data.organic || []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      date: item.date,
    }));
  } catch (error) {
    console.error('Serper web search error:', error);
    return [];
  }
}
