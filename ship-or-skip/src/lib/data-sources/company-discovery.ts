/**
 * Company discovery data source using AI + Serper
 * Discovers non-YC competitors using anchor company + search strategy
 */

import { searchWeb, SerperResult } from '../serper';
import OpenAI from 'openai';

export type CompanyStatus = 'active' | 'acquired' | 'dead' | 'unknown';

export interface DiscoveredCompany {
  name: string;
  description: string;
  status: CompanyStatus;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Use AI to identify one well-known competitor as an anchor for searches
 * @param idea - The startup idea to find a competitor for
 * @returns The name of a well-known competitor, or null if none found
 */
export async function getAnchorCompany(idea: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a startup and business analyst. Given a startup idea, identify ONE well-known company that operates in the same space or solves a similar problem.

Choose a company that:
- Is widely recognized in the industry
- Would be considered a competitor or alternative
- Has a clear, searchable company name

Respond with ONLY the company name, nothing else. No explanations, no quotes, just the company name.
If you cannot identify any relevant company, respond with "NONE".`,
        },
        {
          role: 'user',
          content: idea,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const result = response.choices[0]?.message?.content?.trim();

    if (!result || result === 'NONE') {
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error getting anchor company:', error);
    return null;
  }
}

/**
 * Extract keywords from an idea for searching
 * @param idea - The startup idea
 * @returns Keywords suitable for search
 */
function extractKeywords(idea: string): string {
  // Remove common words and keep key terms
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'that', 'which', 'who', 'whom',
    'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'so', 'up',
    'out', 'if', 'about', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'than', 'too', 'very', 'just', 'app', 'platform', 'tool',
    'software', 'service', 'solution', 'helps', 'help', 'allows', 'allow',
    'enables', 'enable', 'lets', 'let', 'makes', 'make', 'using', 'use',
  ]);

  return idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 5)
    .join(' ');
}

/**
 * Use AI to extract structured company data from search results
 * @param searchResults - Raw search results from Serper
 * @param idea - The original idea for context
 * @returns Array of discovered companies with structured data
 */
export async function extractCompaniesWithAI(
  searchResults: SerperResult[],
  idea: string
): Promise<DiscoveredCompany[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return [];
  }

  if (searchResults.length === 0) {
    return [];
  }

  try {
    // Format search results for the AI
    const formattedResults = searchResults
      .map((r, i) => `${i + 1}. Title: ${r.title}\n   URL: ${r.link}\n   Snippet: ${r.snippet}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a business analyst. Extract companies from search results that are relevant competitors or alternatives to the given startup idea.

For each company found, determine:
1. Company name (just the name, no Inc./LLC/etc.)
2. Brief description (1 sentence, what they do)
3. Status: "active" (operating), "acquired" (bought by another company), "dead" (shut down/defunct), or "unknown"

Rules:
- Only include REAL companies, not generic categories or lists
- Skip news sites, review sites, and aggregator sites themselves (G2, Capterra are sources, not competitors)
- Maximum 8 companies
- Focus on direct competitors that solve similar problems

Respond in JSON format:
{
  "companies": [
    {"name": "Company Name", "description": "What they do", "status": "active"}
  ]
}

If no relevant companies found, respond with: {"companies": []}`,
        },
        {
          role: 'user',
          content: `Startup idea: ${idea}\n\nSearch results:\n${formattedResults}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content) as { companies: DiscoveredCompany[] };

    // Validate and clean the response
    return (parsed.companies || [])
      .filter(
        (c) =>
          c.name &&
          typeof c.name === 'string' &&
          c.description &&
          typeof c.description === 'string'
      )
      .map((c) => ({
        name: c.name.trim(),
        description: c.description.trim(),
        status: ['active', 'acquired', 'dead', 'unknown'].includes(c.status)
          ? c.status
          : 'unknown',
      }))
      .slice(0, 8);
  } catch (error) {
    console.error('Error extracting companies with AI:', error);
    return [];
  }
}

/**
 * Discover competitors for a startup idea using AI anchor + Serper searches
 * @param idea - The startup idea to find competitors for
 * @param knownCompetitors - Optional array of known competitor names from AI analysis
 * @returns Array of discovered companies with name, description, and status
 */
export async function discoverCompetitors(
  idea: string,
  knownCompetitors?: string[]
): Promise<DiscoveredCompany[]> {
  try {
    // Step 1: Determine anchor companies
    // Use known competitors if provided, otherwise ask AI for one
    let anchors: string[] = [];

    if (knownCompetitors && knownCompetitors.length > 0) {
      // Use first 2 known competitors as anchors
      anchors = knownCompetitors.slice(0, 2);
    } else {
      // Fallback to AI-generated anchor
      const anchorCompany = await getAnchorCompany(idea);
      if (anchorCompany) {
        anchors = [anchorCompany];
      }
    }

    // Step 2: Perform searches in parallel
    const searchPromises: Promise<SerperResult[]>[] = [];

    // Search for alternatives to each anchor company
    for (const anchor of anchors) {
      searchPromises.push(
        searchWeb(`${anchor} alternatives 2024 2025`)
      );
    }

    // Search G2/Capterra for keyword matches
    const keywords = extractKeywords(idea);
    if (keywords) {
      searchPromises.push(
        searchWeb(`site:g2.com OR site:capterra.com ${keywords}`)
      );
    }

    // If no searches possible, return empty
    if (searchPromises.length === 0) {
      return [];
    }

    // Execute searches in parallel
    const searchResultsArrays = await Promise.all(searchPromises);

    // Combine and dedupe results by URL
    const seenUrls = new Set<string>();
    const combinedResults: SerperResult[] = [];

    for (const results of searchResultsArrays) {
      for (const result of results) {
        if (!seenUrls.has(result.link)) {
          seenUrls.add(result.link);
          combinedResults.push(result);
        }
      }
    }

    // Step 3: Extract company data with AI
    let companies = await extractCompaniesWithAI(combinedResults, idea);

    // Step 4: Add known competitors that weren't found in search results
    if (knownCompetitors && knownCompetitors.length > 0) {
      const foundNames = new Set(companies.map(c => c.name.toLowerCase()));
      for (const competitor of knownCompetitors) {
        if (!foundNames.has(competitor.toLowerCase())) {
          companies.push({
            name: competitor,
            description: `Known competitor in this space`,
            status: 'active',
          });
        }
      }
    }

    return companies.slice(0, 10);
  } catch (error) {
    console.error('Error discovering competitors:', error);
    return [];
  }
}
