import OpenAI from "openai";
import type {
  ReportData,
  YCCompanyMatch,
  NewsArticle,
  RedditPost,
  TrendsData,
} from "@/lib/supabase/types";

// Lazily initialized OpenAI client (defer to runtime to avoid build errors)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Input data structure for analysis
export interface AnalysisInput {
  idea: string;
  companies: YCCompanyMatch[];
  news: NewsArticle[];
  reddit: RedditPost[];
  trends: TrendsData | null;
}

// Expected structure from OpenAI response
interface AIAnalysisResponse {
  score: number;
  scoreReasoning: string;
  historicalSummary: string;
  marketSummary: string;
  sentimentSummary: string;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trendsSummary: string;
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

// System prompt for the startup analyst
const SYSTEM_PROMPT = `You are an expert startup analyst with deep knowledge of Y Combinator companies, market dynamics, and startup success factors. Your role is to analyze startup ideas against historical data and current market signals.

You will receive:
1. A startup idea description
2. Historical data: Similar YC companies with their outcomes (unicorn, acquired, dead, active)
3. Market data: Recent news articles about the space
4. Sentiment data: Reddit discussions from startup communities
5. Trends data: Google Trends interest over time

Your analysis must be:
- Data-driven: Base your conclusions on the provided data
- Honest: Don't sugarcoat bad signals
- Actionable: Give specific, useful recommendations
- Balanced: Acknowledge both opportunities and risks

Respond with a JSON object containing your analysis.`;

// Build the user prompt with all data
function buildUserPrompt(data: AnalysisInput): string {
  const { idea, companies, news, reddit, trends } = data;

  // Summarize company outcomes
  const outcomeCounts = { unicorn: 0, acquired: 0, dead: 0, active: 0 };
  for (const company of companies) {
    if (company.outcome && company.outcome in outcomeCounts) {
      outcomeCounts[company.outcome as keyof typeof outcomeCounts]++;
    }
  }

  // Build company list (top 10 for context)
  const companyList = companies
    .slice(0, 10)
    .map(
      (c) =>
        `- ${c.name} (${c.batch}): "${c.pitch}" - Outcome: ${c.outcome || "unknown"}`
    )
    .join("\n");

  // Build news list
  const newsList =
    news.length > 0
      ? news
          .slice(0, 8)
          .map((n) => `- [${n.source}] ${n.title} (${n.date})`)
          .join("\n")
      : "No recent news found.";

  // Build Reddit list
  const redditList =
    reddit.length > 0
      ? reddit
          .slice(0, 10)
          .map(
            (r) =>
              `- r/${r.subreddit}: "${r.title}" (Score: ${r.score}, Comments: ${r.comments})`
          )
          .join("\n")
      : "No relevant Reddit discussions found.";

  // Build trends summary
  const trendsSummary = trends
    ? `Current interest level: ${trends.currentLevel}/100, Change over 2 years: ${trends.changePercent > 0 ? "+" : ""}${trends.changePercent}%`
    : "Trends data not available.";

  return `## Startup Idea
${idea}

## Historical Data (YC Companies)
Found ${companies.length} similar companies in YC's history.
Outcome breakdown: ${outcomeCounts.unicorn} unicorns, ${outcomeCounts.acquired} acquired, ${outcomeCounts.dead} failed, ${outcomeCounts.active} active

Top similar companies:
${companyList || "No similar companies found."}

## Recent Market News
${newsList}

## Community Sentiment (Reddit)
${redditList}

## Google Trends
${trendsSummary}

---

Based on this data, provide your analysis as a JSON object with:
{
  "score": <number 0-100, where 80+ is strong, 60-79 moderate, 40-59 risky, 0-39 caution>,
  "scoreReasoning": "<2-3 sentence explanation of the score>",
  "historicalSummary": "<2-3 sentences about what YC company history reveals>",
  "marketSummary": "<2-3 sentences about current market signals from news>",
  "sentimentSummary": "<2-3 sentences about community sentiment from Reddit>",
  "sentimentBreakdown": { "positive": <0-100>, "negative": <0-100>, "neutral": <0-100> },
  "trendsSummary": "<2-3 sentences about trend trajectory>",
  "recommendations": [
    { "title": "<short action title>", "description": "<specific actionable advice>" },
    // 3-5 recommendations
  ]
}

Be specific and reference the actual data provided. Do not make up companies or statistics.`;
}

// Generate fallback analysis when OpenAI is unavailable
function generateFallbackAnalysis(data: AnalysisInput): ReportData {
  const { idea, companies, news, reddit, trends } = data;

  // Count outcomes
  const outcomeCounts = { unicorn: 0, acquired: 0, dead: 0, active: 0 };
  for (const company of companies) {
    if (company.outcome && company.outcome in outcomeCounts) {
      outcomeCounts[company.outcome as keyof typeof outcomeCounts]++;
    }
  }

  // Calculate a basic score
  let score = 50;
  if (companies.length > 0) {
    const successRate =
      (outcomeCounts.unicorn + outcomeCounts.acquired) / companies.length;
    const failRate = outcomeCounts.dead / companies.length;
    score += Math.round((successRate - failRate) * 30);
  }
  if (trends && trends.changePercent > 0) {
    score += Math.min(10, Math.round(trends.changePercent / 5));
  }
  score = Math.max(0, Math.min(100, score));

  return {
    idea,
    score,
    scoreReasoning: `Preliminary score based on ${companies.length} similar YC companies. ${outcomeCounts.unicorn} unicorns, ${outcomeCounts.acquired} acquired, ${outcomeCounts.dead} failed. AI analysis unavailable.`,
    sections: {
      historical: {
        summary:
          companies.length > 0
            ? `Found ${companies.length} similar companies in YC history. Success indicators suggest ${score >= 60 ? "promising" : "challenging"} conditions.`
            : "No closely similar YC companies found. This could indicate a novel opportunity.",
        companies,
        outcomeCounts,
      },
      market: {
        summary:
          news.length > 0
            ? `Found ${news.length} recent articles. ${news.length >= 5 ? "Active" : "Moderate"} media coverage suggests ${news.length >= 5 ? "high" : "growing"} market interest.`
            : "Limited recent news coverage for this topic.",
        articles: news,
      },
      sentiment: {
        summary:
          reddit.length > 0
            ? `Found ${reddit.length} relevant discussions. Community interest indicates ${reddit.length >= 5 ? "active" : "emerging"} discussion around this space.`
            : "Limited community discussions found for this topic.",
        posts: reddit,
        sentimentBreakdown: { positive: 33, negative: 33, neutral: 34 },
      },
      trends: {
        summary: trends
          ? `Interest has ${trends.changePercent > 0 ? "grown" : "declined"} by ${Math.abs(trends.changePercent)}% over 2 years.`
          : "Trends data not available.",
        data: trends,
      },
      recommendations: [
        {
          title: "Study Similar Companies",
          description:
            companies.length > 0
              ? `Analyze the ${Math.min(5, companies.length)} most similar YC companies to understand success patterns.`
              : "Research adjacent markets to identify potential competitors.",
        },
        {
          title: "Validate Market Demand",
          description:
            "Conduct customer interviews to confirm the problem is worth solving.",
        },
        {
          title: "Define Differentiation",
          description:
            "Articulate what makes your approach unique vs. existing solutions.",
        },
      ],
    },
  };
}

/**
 * Generate AI-powered analysis of startup idea using OpenAI GPT-4o
 * Falls back to basic analysis if OpenAI is unavailable
 */
export async function generateAnalysis(data: AnalysisInput): Promise<ReportData> {
  const { idea, companies, news, reddit, trends } = data;

  // Check if OpenAI API key is configured
  const openai = getOpenAIClient();
  if (!openai) {
    console.warn("OpenAI API key not configured, using fallback analysis");
    return generateFallbackAnalysis(data);
  }

  try {
    const userPrompt = buildUserPrompt(data);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      console.error("Empty response from OpenAI");
      return generateFallbackAnalysis(data);
    }

    // Parse the JSON response
    const aiResponse: AIAnalysisResponse = JSON.parse(responseText);

    // Validate score is in range
    const score = Math.max(0, Math.min(100, Math.round(aiResponse.score)));

    // Count outcomes for the report
    const outcomeCounts = { unicorn: 0, acquired: 0, dead: 0, active: 0 };
    for (const company of companies) {
      if (company.outcome && company.outcome in outcomeCounts) {
        outcomeCounts[company.outcome as keyof typeof outcomeCounts]++;
      }
    }

    // Build the report data structure
    const reportData: ReportData = {
      idea,
      score,
      scoreReasoning: aiResponse.scoreReasoning,
      sections: {
        historical: {
          summary: aiResponse.historicalSummary,
          companies,
          outcomeCounts,
        },
        market: {
          summary: aiResponse.marketSummary,
          articles: news,
        },
        sentiment: {
          summary: aiResponse.sentimentSummary,
          posts: reddit,
          sentimentBreakdown: aiResponse.sentimentBreakdown || {
            positive: 33,
            negative: 33,
            neutral: 34,
          },
        },
        trends: {
          summary: aiResponse.trendsSummary,
          data: trends,
        },
        recommendations: aiResponse.recommendations.slice(0, 5),
      },
    };

    return reportData;
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    return generateFallbackAnalysis(data);
  }
}
