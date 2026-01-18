/**
 * Product Hunt data source using Serper web search
 * Searches site:producthunt.com for products similar to the idea
 */

import { searchWeb } from '../serper';

export interface PHProduct {
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  createdAt: string;
  website: string | null;
}

/**
 * Extract keywords from idea for search
 */
function extractKeywords(idea: string): string {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'that', 'which', 'this', 'app',
    'platform', 'tool', 'software', 'service', 'solution', 'helps', 'using',
  ]);

  return idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 4)
    .join(' ');
}

/**
 * Search Product Hunt for products related to a query using Serper
 * @param query - Search query (e.g., startup idea or topic)
 * @returns Array of PHProduct objects (max 10)
 */
export async function searchProductHunt(query: string): Promise<PHProduct[]> {
  const keywords = extractKeywords(query);

  if (!keywords) {
    return [];
  }

  try {
    // Search Product Hunt via Serper
    const searchResults = await searchWeb(`site:producthunt.com ${keywords}`);

    if (searchResults.length === 0) {
      return [];
    }

    // Parse search results into PHProduct format
    const products: PHProduct[] = searchResults
      .filter((result) => result.link.includes('producthunt.com/posts/'))
      .slice(0, 10)
      .map((result) => {
        // Extract product name from title (usually "Product Name - Tagline")
        const titleParts = result.title.split(' - ');
        const name = titleParts[0]?.replace(' | Product Hunt', '').trim() || 'Unknown';
        const tagline = titleParts[1]?.replace(' | Product Hunt', '').trim() || result.snippet;

        return {
          name,
          tagline: tagline || result.snippet,
          url: result.link,
          votesCount: 0, // Not available from search results
          createdAt: result.date || new Date().toISOString(),
          website: null,
        };
      });

    return products;
  } catch (error) {
    console.error('Error searching Product Hunt:', error);
    return [];
  }
}
