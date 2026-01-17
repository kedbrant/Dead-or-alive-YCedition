# Idea Validator: Focused Pivot PRD

## The Pivot

**From:** Scattered platform (game + explore + validate)
**To:** One thing, done well: AI-powered idea validation

---

## The Product

**One input. One report.**

User pastes their startup idea → We search multiple data sources → AI generates a validation report with insights and infographics.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              VALIDATE YOUR STARTUP IDEA                     │
│                                                             │
│         Against 5,500 YC companies + live market data       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  "AI that automatically responds to customer        │   │
│  │   support tickets"                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                 [Validate My Idea]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Sources

### 1. Historical: YC Database (5,500+ companies)
- Similar companies that tried this before
- Their outcomes (unicorn/dead/acquired/active)
- When they tried (batch year)
- How big they got (team size)

### 2. Live: News & Media
- Recent articles about this space
- Funding announcements in the category
- Market trends

**Sources:**
- Google News RSS
- TechCrunch RSS
- Hacker News API

### 3. Live: Community Sentiment
- Reddit discussions about the problem/solution
- Twitter/X conversations
- Product Hunt launches in the space

**Sources:**
- Reddit API (search relevant subreddits)
- Twitter/X API (if available) or scrape
- Product Hunt API

### 4. Live: Market Signals
- Google Trends for related keywords
- Search volume trends

---

## The Report

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  VALIDATION REPORT                                          │
│  "AI that automatically responds to customer support"       │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  📊 OVERALL SCORE                                           │
│                                                             │
│              ┌─────────────────┐                            │
│              │                 │                            │
│              │       67        │                            │
│              │    /100         │                            │
│              │                 │                            │
│              │  MODERATE       │                            │
│              └─────────────────┘                            │
│                                                             │
│  Validated market with significant competition.             │
│  Differentiation is critical.                               │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  🏛️ HISTORICAL ANALYSIS                                     │
│  Based on 5,500+ YC companies                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  12 similar companies found                         │   │
│  │                                                     │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │   │
│  │  │ 🦄 │ │ 💰 │ │ 💀 │ │ ✅ │                       │   │
│  │  │ 2  │ │ 3  │ │ 4  │ │ 3  │                       │   │
│  │  └────┘ └────┘ └────┘ └────┘                       │   │
│  │  17%     25%    33%    25%                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  KEY INSIGHT: 2 unicorns emerged (Intercom, Zendesk).      │
│  But 4 companies failed — mostly due to inability to       │
│  differentiate from incumbents.                             │
│                                                             │
│  Similar companies:                                         │
│  • 🦄 Intercom (S11) — "Customer messaging platform"       │
│  • 🦄 Zendesk (W09) — "Customer service software"          │
│  • 💀 Assist (S15) — "AI customer support" — FAILED        │
│  • 💀 Directly (W16) — "AI support agents" — FAILED        │
│  [Show all 12]                                              │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  📰 CURRENT MARKET                                          │
│  What's happening right now                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  RECENT NEWS (last 30 days)                         │   │
│  │                                                     │   │
│  │  • "Intercom launches AI copilot for support"       │   │
│  │    TechCrunch, 3 days ago                           │   │
│  │                                                     │   │
│  │  • "Sierra AI raises $175M for customer service"    │   │
│  │    Forbes, 1 week ago                               │   │
│  │                                                     │   │
│  │  • "Zendesk reports 40% AI adoption among users"    │   │
│  │    VentureBeat, 2 weeks ago                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  KEY INSIGHT: Heavy incumbent activity. Major players      │
│  are actively investing in AI. New entrant needs clear     │
│  wedge (vertical focus, pricing, specific use case).       │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  💬 COMMUNITY SENTIMENT                                     │
│  What people are saying                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  REDDIT (r/startups, r/SaaS, r/customerservice)    │   │
│  │                                                     │   │
│  │  Top pain points mentioned:                         │   │
│  │  • "AI responses feel robotic" (47 mentions)       │   │
│  │  • "Integration with existing tools" (31 mentions) │   │
│  │  • "Pricing is insane" (28 mentions)               │   │
│  │                                                     │   │
│  │  Sentiment: Mixed (54% positive, 46% negative)     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  KEY INSIGHT: Users want AI support but current solutions  │
│  feel robotic. Opportunity in "human-like" positioning.    │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  📈 MARKET TRENDS                                           │
│  Search interest over time                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  "AI customer support" — Google Trends              │   │
│  │                                                     │   │
│  │  100│                                    ╭──        │   │
│  │     │                              ╭─────╯          │   │
│  │   50│                    ╭─────────╯                │   │
│  │     │  ──────────────────╯                          │   │
│  │    0└────────────────────────────────────           │   │
│  │     2020  2021  2022  2023  2024  2025              │   │
│  │                                                     │   │
│  │  📈 +340% growth since 2022                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  KEY INSIGHT: Rapidly growing search interest.             │
│  Market timing is good — but competition is aware.         │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  ✅ RECOMMENDATIONS                                         │
│                                                             │
│  Based on our analysis:                                     │
│                                                             │
│  1. DIFFERENTIATE OR DIE                                   │
│     12 YC companies tried this. 4 failed competing         │
│     head-on with incumbents. Find a wedge.                 │
│                                                             │
│  2. CONSIDER VERTICAL FOCUS                                │
│     "AI support for [specific industry]" has less          │
│     competition than general-purpose.                       │
│                                                             │
│  3. TIMING IS NOW                                          │
│     Search interest up 340%. But window is closing         │
│     as incumbents add AI features.                         │
│                                                             │
│  4. PRICE AS DIFFERENTIATOR                                │
│     Reddit users complain about pricing. Affordable        │
│     option could capture SMB market.                       │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  [Download Report PDF]  [Share]  [Validate Another Idea]   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scoring System

### Overall Score (0-100)

Weighted composite of:

| Factor | Weight | What it measures |
|--------|--------|------------------|
| Historical survival rate | 25% | % of similar YC companies that didn't die |
| Market growth | 25% | Google Trends trajectory |
| Competition density | 25% | Inverse of how crowded (fewer = better) |
| Sentiment | 15% | Reddit/community positivity |
| Timing | 10% | Recent funding activity (hot = good, but also competitive) |

### Score Bands

| Score | Label | Meaning |
|-------|-------|---------|
| 80-100 | 🟢 Strong | Clear opportunity, low competition, growing market |
| 60-79 | 🟡 Moderate | Validated market, needs differentiation |
| 40-59 | 🟠 Risky | Crowded or high failure rate historically |
| 0-39 | 🔴 Caution | Graveyard category or declining market |

---

## Technical Architecture

### Flow

```
User Input (idea)
      │
      ▼
┌─────────────────────────────────────────┐
│           PARALLEL DATA FETCH           │
├─────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │   YC    │ │  News   │ │ Reddit  │   │
│  │ Search  │ │   RSS   │ │   API   │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │         │
│       ▼           ▼           ▼         │
│  ┌─────────────────────────────────┐   │
│  │      Aggregate Raw Data         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│            AI ANALYSIS                  │
├─────────────────────────────────────────┤
│  Claude/GPT processes:                  │
│  • Summarize similar companies          │
│  • Extract key insights from news       │
│  • Analyze sentiment from Reddit        │
│  • Generate recommendations             │
│  • Calculate overall score              │
└─────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────┐
│         REPORT GENERATION               │
├─────────────────────────────────────────┤
│  • Format as structured sections        │
│  • Generate infographic data            │
│  • Render interactive report            │
└─────────────────────────────────────────┘
```

### API Route

```javascript
// POST /api/validate
// Body: { idea: string }

export async function POST(request: Request) {
    const { idea } = await request.json();
    
    // 1. Parallel data fetching
    const [ycResults, newsResults, redditResults, trendsData] = await Promise.all([
        searchYCCompanies(idea),
        fetchRecentNews(idea),
        searchReddit(idea),
        getGoogleTrends(idea)
    ]);
    
    // 2. AI analysis
    const analysis = await generateAnalysis({
        idea,
        ycResults,
        newsResults,
        redditResults,
        trendsData
    });
    
    // 3. Return structured report
    return Response.json({
        score: analysis.overallScore,
        sections: {
            historical: analysis.historical,
            market: analysis.market,
            sentiment: analysis.sentiment,
            trends: analysis.trends,
            recommendations: analysis.recommendations
        }
    });
}
```

### AI Prompt Structure

```javascript
const systemPrompt = `You are a startup analyst. Given data about a startup idea, generate a validation report.

You will receive:
1. The user's idea
2. Similar YC companies and their outcomes
3. Recent news articles
4. Reddit discussions
5. Google Trends data

Generate:
1. Overall score (0-100) with reasoning
2. Historical analysis summary (what happened to similar companies)
3. Market analysis summary (what's happening now)
4. Sentiment analysis summary (what people are saying)
5. 3-5 specific recommendations

Be direct. No fluff. Cite specific data points.`;

const userPrompt = `
IDEA: "${idea}"

YC COMPANIES (similar):
${ycResults.map(c => `- ${c.name} (${c.batch}): "${c.pitch}" — ${c.outcome}`).join('\n')}

RECENT NEWS:
${newsResults.map(n => `- "${n.title}" — ${n.source}, ${n.date}`).join('\n')}

REDDIT DISCUSSIONS:
${redditResults.map(r => `- r/${r.subreddit}: "${r.title}" (${r.score} upvotes)`).join('\n')}

GOOGLE TRENDS:
- Search interest change: ${trendsData.changePercent}% over 2 years
- Current interest level: ${trendsData.currentLevel}/100

Generate the validation report.`;
```

---

## Data Source Implementation

### 1. YC Search (existing)

```javascript
async function searchYCCompanies(idea) {
    const tokens = tokenize(idea);
    
    const { data } = await supabase
        .from('ideas')
        .select('*')
        .or(tokens.map(t => `hero.ilike.%${t}%`).join(','))
        .eq('source', 'yc')
        .limit(20);
    
    return data.map(c => ({
        name: c.yc_name,
        batch: c.yc_batch,
        pitch: c.hero,
        outcome: c.source_outcome,
        teamSize: c.yc_team_size
    }));
}
```

### 2. News RSS

```javascript
async function fetchRecentNews(idea) {
    const query = encodeURIComponent(idea);
    
    const feeds = [
        `https://news.google.com/rss/search?q=${query}&hl=en-US`,
        `https://techcrunch.com/feed/?s=${query}`,
    ];
    
    const results = await Promise.all(feeds.map(async (feed) => {
        const response = await fetch(feed);
        const xml = await response.text();
        return parseRSS(xml);
    }));
    
    return results
        .flat()
        .filter(item => isRecent(item.date, 30)) // last 30 days
        .slice(0, 10);
}
```

### 3. Reddit Search

```javascript
async function searchReddit(idea) {
    const query = encodeURIComponent(idea);
    const subreddits = ['startups', 'SaaS', 'Entrepreneur', 'smallbusiness'];
    
    const results = await Promise.all(subreddits.map(async (sub) => {
        const response = await fetch(
            `https://www.reddit.com/r/${sub}/search.json?q=${query}&sort=relevance&limit=10`
        );
        const data = await response.json();
        return data.data.children.map(c => ({
            subreddit: sub,
            title: c.data.title,
            score: c.data.score,
            comments: c.data.num_comments,
            url: c.data.url
        }));
    }));
    
    return results.flat().sort((a, b) => b.score - a.score).slice(0, 15);
}
```

### 4. Google Trends (via SerpAPI or similar)

```javascript
async function getGoogleTrends(idea) {
    // Use SerpAPI or similar service
    const response = await fetch(
        `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(idea)}&api_key=${SERP_API_KEY}`
    );
    const data = await response.json();
    
    return {
        currentLevel: data.interest_over_time?.current || 50,
        changePercent: calculateChange(data.interest_over_time?.timeline),
        timeline: data.interest_over_time?.timeline || []
    };
}
```

---

## UI Simplification

### Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Logo] SHIP OR SKIP                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│                                                             │
│                VALIDATE YOUR STARTUP IDEA                   │
│                                                             │
│        Against 5,500 YC companies + live market data        │
│                                                             │
│                                                             │
│        ┌───────────────────────────────────────────┐       │
│        │                                           │       │
│        │  Describe your startup idea...            │       │
│        │                                           │       │
│        │                                           │       │
│        └───────────────────────────────────────────┘       │
│                                                             │
│                   [Validate My Idea]                        │
│                                                             │
│                                                             │
│        Example: "AI that writes cold emails"                │
│                                                             │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │ 🏛️ 5,500+   │  │ 📰 Live     │  │ 💬 Reddit   │        │
│   │ YC startups │  │ news feed   │  │ sentiment   │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│          We analyze the past AND the present.               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Routes

| Route | What |
|-------|------|
| `/` | Landing page with input |
| `/report/[id]` | Generated report (shareable) |

**That's it. Two routes.**

---

## What We're Hiding

- ❌ Explore tab (gone)
- ❌ Game/voting (gone)
- ❌ Leaderboards (gone)
- ❌ Battle mode (gone)
- ❌ Achievements (gone)
- ❌ User submissions (gone)

**One input. One output.**

---

## New Value Proposition

**Before:** "Here's a database, figure it out yourself"

**After:** "Paste your idea, get an AI-powered validation report with historical data, live news, community sentiment, and actionable recommendations"

---

## Implementation Priority

### Day 1: Core Infrastructure
1. Simplify to single landing page
2. Set up AI integration (Claude API)
3. Build report generation endpoint

### Day 2: Data Sources
1. YC search (already done)
2. News RSS aggregation
3. Reddit API integration
4. Google Trends (or mock for MVP)

### Day 3: Report UI
1. Score display with gauge
2. Section cards (historical, market, sentiment, trends)
3. Recommendations list
4. Share functionality

---

## Example Reports

### High Score Example (85/100)

**Idea:** "Payroll for Latin America"

- Historical: 3 similar YC companies, 2 successful (Deel, Remote)
- Market: Growing search interest, recent funding rounds
- Sentiment: Strong demand signals on Reddit
- Competition: Exists but market is huge and underserved

### Low Score Example (35/100)

**Idea:** "Social network for dog owners"

- Historical: 7 similar YC companies, 6 failed
- Market: Declining search interest
- Sentiment: "Another one?" fatigue on Reddit
- Competition: Nextdoor/Facebook Groups already do this

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Pages | 5+ tabs | 2 routes |
| Input | Multiple entry points | Single text field |
| Output | Raw data to interpret | AI-generated report |
| Value | "Here's data" | "Here's what this means for you" |
| Shareable | Not really | Yes, each report has URL |

**The pitch:**

> "Validate your startup idea against 5,500 YC companies and live market data. One input, one AI-powered report."
