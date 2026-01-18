/**
 * AI Analysis module for idea validation
 * Analyzes data from all sources to generate comprehensive insights
 */

import OpenAI from 'openai';
import type { NewsArticle } from './news';
import type { RedditPost, HackerNewsPost } from './reddit';
import type { PHProduct } from './producthunt';
import type { DiscoveredCompany } from './company-discovery';

// YC Company type (subset for analysis)
export interface YCCompanyForAnalysis {
  yc_name: string | null;
  yc_batch: string | null;
  yc_status: string | null;
  yc_industry: string | null;
  hero: string | null;
  subtitle: string | null;
  source_outcome: string | null;
}

// Input data for analysis
export interface AnalysisInput {
  idea: string;
  ycCompanies: YCCompanyForAnalysis[];
  phProducts: PHProduct[];
  competitors: DiscoveredCompany[];
  news: NewsArticle[];
  redditPosts: RedditPost[];
  hnPosts: HackerNewsPost[];
}

// Analysis result sections
export interface MarketAnalysis {
  summary: string;
  marketSize: string;
  growthTrend: string;
  keyInsights: string[];
}

export interface CompetitorAnalysis {
  summary: string;
  directCompetitors: number;
  ycCompetitors: number;
  competitiveAdvantages: string[];
  risks: string[];
}

export interface ProductHuntAnalysis {
  summary: string;
  launchCount: number;
  averageVotes: number;
  topProducts: string[];
  marketValidation: string;
}

export interface SentimentAnalysis {
  summary: string;
  overallSentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  redditSentiment: string;
  hackerNewsSentiment: string;
  keyThemes: string[];
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  verdict: 'strong' | 'moderate' | 'weak' | 'risky';
  summary: string;
  market: MarketAnalysis;
  competition: CompetitorAnalysis;
  productHunt: ProductHuntAnalysis;
  sentiment: SentimentAnalysis;
  recommendations: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Format YC companies for the AI prompt
 */
function formatYCCompanies(companies: YCCompanyForAnalysis[]): string {
  if (companies.length === 0) {
    return 'No similar YC companies found.';
  }

  return companies
    .slice(0, 10)
    .map((c) => {
      const status = c.source_outcome || c.yc_status || 'unknown';
      return `- ${c.yc_name} (${c.yc_batch || 'unknown batch'}, ${status}): ${c.hero || c.subtitle || 'No description'}`;
    })
    .join('\n');
}

/**
 * Format Product Hunt products for the AI prompt
 */
function formatPHProducts(products: PHProduct[]): string {
  if (products.length === 0) {
    return 'No similar Product Hunt launches found.';
  }

  return products
    .slice(0, 10)
    .map((p) => `- ${p.name} (${p.votesCount} votes): ${p.tagline}`)
    .join('\n');
}

/**
 * Format discovered competitors for the AI prompt
 */
function formatCompetitors(competitors: DiscoveredCompany[]): string {
  if (competitors.length === 0) {
    return 'No direct competitors discovered.';
  }

  return competitors
    .map((c) => `- ${c.name} (${c.status}): ${c.description}`)
    .join('\n');
}

/**
 * Format news articles for the AI prompt
 */
function formatNews(news: NewsArticle[]): string {
  if (news.length === 0) {
    return 'No recent news found.';
  }

  return news
    .slice(0, 8)
    .map((n) => `- ${n.title} (${n.source}, ${n.date}): ${n.snippet}`)
    .join('\n');
}

/**
 * Format Reddit posts for the AI prompt
 */
function formatRedditPosts(posts: RedditPost[]): string {
  if (posts.length === 0) {
    return 'No relevant Reddit discussions found.';
  }

  return posts
    .slice(0, 8)
    .map((p) => `- [${p.source}] ${p.title}`)
    .join('\n');
}

/**
 * Format Hacker News posts for the AI prompt
 */
function formatHNPosts(posts: HackerNewsPost[]): string {
  if (posts.length === 0) {
    return 'No relevant Hacker News discussions found.';
  }

  return posts
    .slice(0, 8)
    .map((p) => `- ${p.title} (${p.date})`)
    .join('\n');
}

/**
 * Generate comprehensive AI analysis of a startup idea
 * Analyzes Product Hunt launches, competitors, and community sentiment from HN
 *
 * @param input - All data sources for analysis
 * @returns Structured analysis result with scores and insights
 */
export async function generateAnalysis(
  input: AnalysisInput
): Promise<AnalysisResult | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return null;
  }

  const { idea, ycCompanies, phProducts, competitors, news, redditPosts, hnPosts } = input;

  // Calculate some stats for the analysis
  const avgPHVotes =
    phProducts.length > 0
      ? Math.round(phProducts.reduce((sum, p) => sum + p.votesCount, 0) / phProducts.length)
      : 0;

  const ycCompetitorCount = ycCompanies.length;
  const activeCompetitors = competitors.filter((c) => c.status === 'active').length;
  const deadCompetitors = competitors.filter((c) => c.status === 'dead').length;

  const systemPrompt = `You are an expert startup analyst and venture capital advisor. Analyze the following startup idea and all the market data provided to give a comprehensive assessment.

Your analysis should be data-driven, citing specific examples from the provided data when making claims.

IMPORTANT GUIDELINES:
1. Product Hunt analysis: Look at existing launches, their traction (votes), and what this indicates about market demand
2. Competitor landscape: Consider both YC companies and discovered competitors. Note the ratio of active vs dead companies as a market signal
3. Community sentiment: Analyze both Reddit and Hacker News discussions. HN is particularly valuable for tech-savvy audience sentiment
4. Be honest about risks and challenges - don't sugarcoat
5. Provide actionable recommendations

Respond in JSON format with this exact structure:
{
  "overallScore": <number 0-100>,
  "verdict": "<strong|moderate|weak|risky>",
  "summary": "<2-3 sentence overall assessment>",
  "market": {
    "summary": "<market overview>",
    "marketSize": "<estimated market size or 'Unknown'>",
    "growthTrend": "<growing|stable|declining|emerging>",
    "keyInsights": ["<insight1>", "<insight2>", "<insight3>"]
  },
  "competition": {
    "summary": "<competitive landscape summary>",
    "directCompetitors": <number>,
    "ycCompetitors": <number>,
    "competitiveAdvantages": ["<advantage1>", "<advantage2>"],
    "risks": ["<risk1>", "<risk2>"]
  },
  "productHunt": {
    "summary": "<PH landscape summary>",
    "launchCount": <number of similar launches>,
    "averageVotes": <average votes>,
    "topProducts": ["<product1>", "<product2>"],
    "marketValidation": "<what PH data suggests about market>",
  },
  "sentiment": {
    "summary": "<overall sentiment summary>",
    "overallSentiment": "<positive|neutral|negative|mixed>",
    "redditSentiment": "<reddit community sentiment>",
    "hackerNewsSentiment": "<HN community sentiment>",
    "keyThemes": ["<theme1>", "<theme2>", "<theme3>"]
  },
  "recommendations": ["<recommendation1>", "<recommendation2>", "<recommendation3>"]
}`;

  const userPrompt = `STARTUP IDEA:
${idea}

=== DATA SOURCES ===

YC COMPANIES (similar startups from Y Combinator):
${formatYCCompanies(ycCompanies)}

PRODUCT HUNT LAUNCHES (similar products launched):
${formatPHProducts(phProducts)}

DISCOVERED COMPETITORS (non-YC companies in this space):
${formatCompetitors(competitors)}

RECENT NEWS:
${formatNews(news)}

REDDIT DISCUSSIONS:
${formatRedditPosts(redditPosts)}

HACKER NEWS DISCUSSIONS:
${formatHNPosts(hnPosts)}

=== STATISTICS ===
- YC companies in this space: ${ycCompetitorCount}
- Product Hunt launches found: ${phProducts.length}
- Average PH votes: ${avgPHVotes}
- Discovered competitors: ${competitors.length} (${activeCompetitors} active, ${deadCompetitors} dead)
- Reddit discussions: ${redditPosts.length}
- Hacker News posts: ${hnPosts.length}
- Recent news articles: ${news.length}

Please provide your comprehensive analysis.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in AI response');
      return null;
    }

    const parsed = JSON.parse(content) as AnalysisResult;

    // Validate and ensure required fields
    return {
      overallScore: Math.min(100, Math.max(0, parsed.overallScore || 50)),
      verdict: ['strong', 'moderate', 'weak', 'risky'].includes(parsed.verdict)
        ? parsed.verdict
        : 'moderate',
      summary: parsed.summary || 'Analysis completed.',
      market: {
        summary: parsed.market?.summary || 'Market analysis unavailable.',
        marketSize: parsed.market?.marketSize || 'Unknown',
        growthTrend: parsed.market?.growthTrend || 'unknown',
        keyInsights: parsed.market?.keyInsights || [],
      },
      competition: {
        summary: parsed.competition?.summary || 'Competition analysis unavailable.',
        directCompetitors: parsed.competition?.directCompetitors ?? competitors.length,
        ycCompetitors: parsed.competition?.ycCompetitors ?? ycCompanies.length,
        competitiveAdvantages: parsed.competition?.competitiveAdvantages || [],
        risks: parsed.competition?.risks || [],
      },
      productHunt: {
        summary: parsed.productHunt?.summary || 'Product Hunt analysis unavailable.',
        launchCount: parsed.productHunt?.launchCount ?? phProducts.length,
        averageVotes: parsed.productHunt?.averageVotes ?? avgPHVotes,
        topProducts: parsed.productHunt?.topProducts || [],
        marketValidation: parsed.productHunt?.marketValidation || 'Insufficient data.',
      },
      sentiment: {
        summary: parsed.sentiment?.summary || 'Sentiment analysis unavailable.',
        overallSentiment: ['positive', 'neutral', 'negative', 'mixed'].includes(
          parsed.sentiment?.overallSentiment
        )
          ? parsed.sentiment.overallSentiment
          : 'neutral',
        redditSentiment: parsed.sentiment?.redditSentiment || 'No Reddit data available.',
        hackerNewsSentiment: parsed.sentiment?.hackerNewsSentiment || 'No Hacker News data available.',
        keyThemes: parsed.sentiment?.keyThemes || [],
      },
      recommendations: parsed.recommendations || [],
    };
  } catch (error) {
    console.error('Error generating analysis:', error);
    return null;
  }
}
