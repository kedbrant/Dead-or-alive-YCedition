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
  ycSearchTerms: string[]; // Semantic keywords for YC company search (e.g., "machine learning" for "AI")
}

// Customer-focused general communities, not entrepreneur communities
const FALLBACK_SUBREDDITS = ["technology", "gadgets", "productivity", "InternetIsBeautiful", "LifeProTips"];

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
    const words = idea.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return {
      initialTake: "Let's analyze this idea against historical data and current market signals.",
      searchTerms: idea.split(" ").filter(w => w.length > 3).slice(0, 3),
      subreddits: FALLBACK_SUBREDDITS,
      ycSearchTerms: words.slice(0, 5),
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

4. **ycSearchTerms**: 4-6 keywords to find similar YC companies. Include:
   - The core technology/approach (e.g., "machine learning", "artificial intelligence" for "AI")
   - The industry/domain (e.g., "video", "social media", "content creation")
   - Related concepts that might be in company descriptions
   - Example for "AI video for social media": ["machine learning", "artificial intelligence", "video", "social media", "content creation", "video editing"]
   - Example for "VR fitness app": ["virtual reality", "fitness", "exercise", "gaming", "health"]

Respond with ONLY valid JSON, no markdown:
{"initialTake": "...", "searchTerms": ["...", "..."], "subreddits": ["...", "..."], "ycSearchTerms": ["...", "..."]}`
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
    const words = idea.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return {
      initialTake: analysis.initialTake || "Let's analyze this idea against the data.",
      searchTerms: Array.isArray(analysis.searchTerms) ? analysis.searchTerms.slice(0, 3) : [],
      subreddits: Array.isArray(analysis.subreddits) ? analysis.subreddits.slice(0, 6) : FALLBACK_SUBREDDITS,
      ycSearchTerms: Array.isArray(analysis.ycSearchTerms) ? analysis.ycSearchTerms.slice(0, 6) : words.slice(0, 5),
    };
  } catch (error) {
    console.warn("Failed to analyze idea:", error);
    const words = idea.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return {
      initialTake: "Let's analyze this idea against historical data and current market signals.",
      searchTerms: idea.split(" ").filter(w => w.length > 3).slice(0, 3),
      subreddits: FALLBACK_SUBREDDITS,
      ycSearchTerms: words.slice(0, 5),
    };
  }
}
