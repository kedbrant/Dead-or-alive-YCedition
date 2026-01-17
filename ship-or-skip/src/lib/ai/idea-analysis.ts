import OpenAI from "openai";

// Lazily initialized OpenAI client
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

export interface IdeaAnalysis {
  initialTake: string; // Quick assessment mentioning competitors, market reality
  searchTerms: string[]; // 2-3 word phrases for Google Trends
  subreddits: string[]; // Customer-focused subreddits (without r/ prefix)
}

const FALLBACK_SUBREDDITS = ["startups", "smallbusiness", "Entrepreneur"];

/**
 * Analyze a startup idea and extract:
 * 1. Initial take - quick assessment with competitor awareness
 * 2. Search terms - relevant phrases for Google Trends
 * 3. Subreddits - customer-focused communities
 */
export async function analyzeIdea(idea: string): Promise<IdeaAnalysis> {
  const openai = getOpenAIClient();

  if (!openai) {
    // Fallback when OpenAI is not configured
    return {
      initialTake: "Let's analyze this idea against historical data and current market signals.",
      searchTerms: idea.split(" ").filter(w => w.length > 3).slice(0, 3),
      subreddits: FALLBACK_SUBREDDITS,
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You analyze startup ideas. Given an idea, provide:

1. **initialTake**: A brief 1-2 sentence assessment that:
   - Acknowledges the market reality (mention specific competitors if obvious, e.g., "LinkedIn dominates professional networking")
   - Sets expectations ("This is a competitive space" or "This is an emerging opportunity")
   - Ends with something like "Let's see what the data shows."
   - Be honest but not discouraging

2. **searchTerms**: 2-3 Google search phrases (2-3 words each) that potential CUSTOMERS would search for. Focus on the problem/need, not the solution.
   - Example for "horse marketplace": ["buy horses", "horses for sale", "horse trading"]
   - Example for "AI code review": ["code review tools", "automated code review", "find code bugs"]

3. **subreddits**: 4-6 subreddit names where TARGET CUSTOMERS discuss their problems (not entrepreneur subreddits).
   - Example for "horse marketplace": ["Horses", "Equestrian", "HorseTrading", "farming"]
   - Example for "AI code review": ["programming", "webdev", "coding", "softwaredevelopment"]

Respond with ONLY valid JSON, no markdown:
{"initialTake": "...", "searchTerms": ["...", "..."], "subreddits": ["...", "..."]}`
        },
        {
          role: "user",
          content: idea,
        },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("Empty response from OpenAI");
    }

    const analysis = JSON.parse(response) as IdeaAnalysis;

    // Validate and sanitize
    return {
      initialTake: analysis.initialTake || "Let's analyze this idea against the data.",
      searchTerms: Array.isArray(analysis.searchTerms) ? analysis.searchTerms.slice(0, 3) : [],
      subreddits: Array.isArray(analysis.subreddits) ? analysis.subreddits.slice(0, 6) : FALLBACK_SUBREDDITS,
    };
  } catch (error) {
    console.warn("Failed to analyze idea:", error);
    return {
      initialTake: "Let's analyze this idea against historical data and current market signals.",
      searchTerms: idea.split(" ").filter(w => w.length > 3).slice(0, 3),
      subreddits: FALLBACK_SUBREDDITS,
    };
  }
}
