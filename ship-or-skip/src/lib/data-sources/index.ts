/**
 * Data sources module
 * Provides unified access to external data for idea validation
 */

export { fetchNews, type NewsArticle } from './news';
export {
  discoverCompetitors,
  getAnchorCompany,
  extractCompaniesWithAI,
  type DiscoveredCompany,
  type CompanyStatus,
} from './company-discovery';
export {
  searchReddit,
  searchHackerNews,
  type RedditPost,
  type HackerNewsPost,
} from './reddit';
export { searchProductHunt, type PHProduct } from './producthunt';
export {
  generateAnalysis,
  type AnalysisInput,
  type AnalysisResult,
  type MarketAnalysis,
  type CompetitorAnalysis,
  type ProductHuntAnalysis,
  type SentimentAnalysis,
  type YCCompanyForAnalysis,
} from './analysis';
