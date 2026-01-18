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
export { searchReddit, type RedditPost } from './reddit';
