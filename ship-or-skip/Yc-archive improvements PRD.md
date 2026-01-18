# YC-Archive: Improvements PRD

**Version:** 2.1  
**Date:** January 2025  
**Status:** Ready for Implementation  
**Context:** Core idea validation flow exists. This PRD covers data architecture changes, new data sources, execution polish, and homepage redesign.

---

## What Exists Today

- ✅ Idea input → Validation report flow
- ✅ YC database search (5,500+ companies)
- ✅ Google Trends integration
- ✅ Google News search
- ✅ Reddit discussions
- ✅ AI-generated report with score

## What This PRD Adds

1. **Optimized API architecture** — Split SerpAPI/Serper to maximize free tiers
2. **New data sources** — Product Hunt, Hacker News, tech blogs, company discovery
3. **RSS migration** — Move Reddit to RSS (free, unlimited)
4. **Execution polish** — Comprehensive checklist for flawless UX
5. **Homepage redesign** — MEGA-sleek, single-purpose landing

---

# Part 1: Data Architecture

## Current vs New

| Source | Current | New | Benefit |
|--------|---------|-----|---------|
| Google Trends | SerpAPI | SerpAPI | No change |
| Google News | SerpAPI | **Serper** | Save SerpAPI budget |
| Company Discovery | None | **Serper** | Find non-YC competitors |
| Reddit | SerpAPI | **RSS** | Unlimited, free |
| Hacker News | None | **RSS** | New source, free |
| Tech Blogs | None | **RSS** | New source, free |
| Product Hunt | None | **PH API** | Launched products, free |
| YC Database | Supabase | Supabase | No change |

## API Budget

| API | Monthly Limit | Searches/Validation | Max Validations |
|-----|---------------|---------------------|-----------------|
| SerpAPI | 250 | 1 (Trends only) | 250 |
| Serper | 2,500 | 3 (News + Companies) | 833 |
| RSS | Unlimited | 0 | ∞ |
| Product Hunt | 6,250 pts/15min | 0 | ∞ |
| Supabase | Unlimited | 0 | ∞ |

**Bottleneck:** 250 validations/month (SerpAPI for Trends)

## Implementation

### Environment Variables

```env
# Existing
SERPAPI_KEY=xxx

# New
SERPER_API_KEY=xxx
PRODUCTHUNT_TOKEN=xxx
```

### Serper Integration

```typescript
// lib/serper.ts

const SERPER_API_KEY = process.env.SERPER_API_KEY;

interface SerperResult {
    title: string;
    link: string;
    snippet: string;
    date?: string;
}

export async function searchNews(query: string): Promise<SerperResult[]> {
    const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: query,
            num: 10
        })
    });
    
    const data = await response.json();
    return data.news || [];
}

export async function searchWeb(query: string): Promise<SerperResult[]> {
    const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: query,
            num: 10
        })
    });
    
    const data = await response.json();
    return data.organic || [];
}
```

### Company Discovery (via Serper)

```typescript
// lib/company-discovery.ts

export async function discoverCompetitors(idea: string) {
    // Step 1: Get anchor company from AI (free)
    const anchor = await getAnchorCompany(idea);
    
    // Step 2: Search for alternatives (1 Serper search)
    const alternatives = await searchWeb(`${anchor} alternatives 2024 2025`);
    
    // Step 3: Search G2/Capterra (1 Serper search)
    const reviews = await searchWeb(
        `site:g2.com OR site:capterra.com ${extractKeywords(idea)}`
    );
    
    // Step 4: AI extracts structured company data
    const companies = await extractCompaniesWithAI([...alternatives, ...reviews]);
    
    return companies;
}

async function getAnchorCompany(idea: string): Promise<string> {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        messages: [{
            role: 'user',
            content: `Name ONE well-known company that does: "${idea}". Just the company name, nothing else.`
        }]
    });
    
    return response.content[0].text.trim();
}

async function extractCompaniesWithAI(searchResults: SerperResult[]) {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
            role: 'user',
            content: `Extract companies from these search results. Return JSON array:
            
${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}

Format:
{
    "companies": [
        { "name": "...", "description": "...", "status": "active|acquired|dead|unknown" }
    ]
}`
        }]
    });
    
    return JSON.parse(response.content[0].text).companies;
}
```

---

# Part 2: RSS Integration

## RSS Sources

### Reddit (Search)

| Subreddit | URL |
|-----------|-----|
| r/startups | `https://www.reddit.com/r/startups/search.rss?q={query}&sort=relevance&limit=10` |
| r/SaaS | `https://www.reddit.com/r/SaaS/search.rss?q={query}&sort=relevance&limit=10` |
| r/Entrepreneur | `https://www.reddit.com/r/Entrepreneur/search.rss?q={query}&sort=relevance&limit=10` |
| r/smallbusiness | `https://www.reddit.com/r/smallbusiness/search.rss?q={query}&sort=relevance&limit=10` |

### Hacker News

| Feed | URL |
|------|-----|
| Search | `https://hnrss.org/newest?q={query}&count=15` |

### Tech News (for trending context)

| Source | URL |
|--------|-----|
| TechCrunch | `https://techcrunch.com/feed/` |
| VentureBeat | `https://venturebeat.com/feed/` |
| TechMeme | `https://www.techmeme.com/feed.xml` |

## Implementation

```typescript
// lib/rss.ts

import Parser from 'rss-parser';

const parser = new Parser();

interface RSSItem {
    title: string;
    link: string;
    date: string;
    source: string;
    snippet?: string;
}

export async function searchReddit(query: string): Promise<RSSItem[]> {
    const subreddits = ['startups', 'SaaS', 'Entrepreneur', 'smallbusiness'];
    
    const results = await Promise.all(subreddits.map(async (sub) => {
        const url = `https://www.reddit.com/r/${sub}/search.rss?q=${encodeURIComponent(query)}&sort=relevance&limit=10`;
        
        try {
            const feed = await parser.parseURL(url);
            return feed.items.map(item => ({
                title: item.title || '',
                link: item.link || '',
                date: item.pubDate || '',
                source: `r/${sub}`,
                snippet: item.contentSnippet?.slice(0, 200)
            }));
        } catch (error) {
            console.error(`Reddit RSS failed for r/${sub}:`, error);
            return [];
        }
    }));
    
    return results.flat().sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export async function searchHackerNews(query: string): Promise<RSSItem[]> {
    const url = `https://hnrss.org/newest?q=${encodeURIComponent(query)}&count=15`;
    
    try {
        const feed = await parser.parseURL(url);
        return feed.items.map(item => ({
            title: item.title || '',
            link: item.link || '',
            date: item.pubDate || '',
            source: 'Hacker News',
            snippet: item.contentSnippet?.slice(0, 200)
        }));
    } catch (error) {
        console.error('HN RSS failed:', error);
        return [];
    }
}
```

---

# Part 3: Product Hunt Integration

## API Details

- **Auth:** OAuth2 with client credentials
- **Rate limit:** 6,250 complexity points / 15 minutes
- **Cost:** Free

## Implementation

```typescript
// lib/producthunt.ts

const PH_TOKEN = process.env.PRODUCTHUNT_TOKEN;

interface PHProduct {
    name: string;
    tagline: string;
    url: string;
    votesCount: number;
    createdAt: string;
}

export async function searchProductHunt(query: string): Promise<PHProduct[]> {
    const graphqlQuery = `
        query SearchProducts($query: String!) {
            posts(first: 10, query: $query) {
                edges {
                    node {
                        id
                        name
                        tagline
                        url
                        votesCount
                        createdAt
                        website
                    }
                }
            }
        }
    `;
    
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PH_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: graphqlQuery,
            variables: { query }
        })
    });
    
    const data = await response.json();
    
    return data.data.posts.edges.map(({ node }: any) => ({
        name: node.name,
        tagline: node.tagline,
        url: node.website || node.url,
        votesCount: node.votesCount,
        createdAt: node.createdAt
    }));
}
```

---

# Part 4: Updated Validation Flow

## API Route

```typescript
// app/api/validate/route.ts

export async function POST(request: Request) {
    const { idea } = await request.json();
    
    // Parallel fetch all data sources
    const [
        ycCompanies,
        phProducts,
        trends,
        news,
        competitors,
        redditPosts,
        hnPosts
    ] = await Promise.all([
        searchYCDatabase(idea),           // Supabase - free
        searchProductHunt(idea),          // PH API - free
        searchGoogleTrends(idea),         // SerpAPI - 1 search
        searchNews(idea),                 // Serper - 1 search
        discoverCompetitors(idea),        // Serper - 2 searches
        searchReddit(idea),               // RSS - free
        searchHackerNews(idea)            // RSS - free
    ]);
    
    // AI analysis
    const analysis = await generateAnalysis({
        idea,
        ycCompanies,
        phProducts,
        trends,
        news,
        competitors,
        redditPosts,
        hnPosts
    });
    
    // Save report
    const report = await saveReport({
        idea,
        data: { ycCompanies, phProducts, trends, news, competitors, redditPosts, hnPosts },
        analysis
    });
    
    return Response.json({ reportId: report.id, analysis });
}
```

## Cost Per Validation

| Source | API | Searches |
|--------|-----|----------|
| YC Database | Supabase | 0 |
| Product Hunt | PH API | 0 |
| Google Trends | SerpAPI | 1 |
| Google News | Serper | 1 |
| Company Discovery | Serper | 2 |
| Reddit | RSS | 0 |
| Hacker News | RSS | 0 |
| **TOTAL** | | **1 SerpAPI + 3 Serper** |

---

# Part 5: Homepage Redesign

## Design Goal

MEGA-sleek. Single purpose. No distractions.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│                                                                             │
│                                                                             │
│                           ┌─────────────────┐                               │
│                           │    YC-ARCHIVE   │                               │
│                           └─────────────────┘                               │
│                                                                             │
│                                                                             │
│                    VALIDATE YOUR STARTUP IDEA                               │
│                                                                             │
│           Against 5,500+ YC companies and live market data                  │
│                                                                             │
│                                                                             │
│     ┌───────────────────────────────────────────────────────────────┐      │
│     │                                                               │      │
│     │  Describe your startup idea...                                │      │
│     │                                                               │      │
│     └───────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                         [ Validate My Idea ]                                │
│                                                                             │
│                                                                             │
│              Try: "AI that writes cold outreach emails"                     │
│                                                                             │
│                                                                             │
│                                                                             │
│     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                │
│     │  📊 5,500+  │     │  📈 Live    │     │  💬 Real    │                │
│     │  YC startups│     │  trends     │     │  sentiment  │                │
│     └─────────────┘     └─────────────┘     └─────────────┘                │
│                                                                             │
│                                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Design Specs

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | System/Inter | 24px | 700 |
| Headline | System/Inter | 48px | 700 |
| Subhead | System/Inter | 20px | 400 |
| Input | System/Inter | 18px | 400 |
| Button | System/Inter | 16px | 600 |
| Example | System/Inter | 14px | 400 |

### Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | #FFFFFF | #0A0A0A |
| Text Primary | #0A0A0A | #FAFAFA |
| Text Secondary | #6B7280 | #9CA3AF |
| Input BG | #F9FAFB | #18181B |
| Input Border | #E5E7EB | #27272A |
| Input Focus | #3B82F6 | #3B82F6 |
| Button BG | #0A0A0A | #FAFAFA |
| Button Text | #FFFFFF | #0A0A0A |

### Spacing

| Element | Value |
|---------|-------|
| Page padding | 24px (mobile), 48px (desktop) |
| Section gap | 48px |
| Input height | 56px |
| Button height | 48px |
| Border radius | 12px |

### Animations

| Element | Animation |
|---------|-----------|
| Page load | Fade in, 300ms |
| Input focus | Border color, 150ms |
| Button hover | Background darken, 150ms |
| Button click | Scale 0.98, 100ms |

## Component

```tsx
// app/page.tsx

export default function Home() {
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idea.trim() || loading) return;
        
        setLoading(true);
        
        try {
            const res = await fetch('/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea: idea.trim() })
            });
            
            const { reportId } = await res.json();
            router.push(`/report/${reportId}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            {/* Logo */}
            <div className="mb-12">
                <h1 className="text-2xl font-bold tracking-tight">YC-ARCHIVE</h1>
            </div>
            
            {/* Headline */}
            <div className="text-center mb-12 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Validate Your Startup Idea
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Against 5,500+ YC companies and live market data
                </p>
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
                <div className="relative">
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Describe your startup idea..."
                        className="w-full h-32 px-4 py-4 text-lg border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        maxLength={200}
                        disabled={loading}
                    />
                    <span className="absolute bottom-3 right-3 text-sm text-gray-400">
                        {idea.length}/200
                    </span>
                </div>
                
                <button
                    type="submit"
                    disabled={!idea.trim() || loading}
                    className="w-full mt-4 h-12 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Analyzing...' : 'Validate My Idea'}
                </button>
            </form>
            
            {/* Example */}
            <p className="text-sm text-gray-500 mb-16">
                Try: <button 
                    onClick={() => setIdea('AI that writes cold outreach emails')}
                    className="text-gray-700 dark:text-gray-300 hover:underline"
                >
                    "AI that writes cold outreach emails"
                </button>
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">5,500+ YC startups</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-sm font-medium">Live trends</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-sm font-medium">Real sentiment</div>
                </div>
            </div>
        </main>
    );
}
```

---

# Part 6: Execution Checklist

## 🎯 Core Functionality

### Input
- [ ] Placeholder text with example
- [ ] Character limit (200) with visible counter
- [ ] Empty input shows helpful prompt
- [ ] Special characters handled (quotes, &, <, >)
- [ ] Input trimmed of whitespace
- [ ] Submit button disabled while processing
- [ ] Submit works with Enter key (Cmd+Enter for textarea)
- [ ] Loading state shows immediately

### Report Generation
- [ ] Loading shows progress steps
- [ ] Each section loads progressively
- [ ] Skeleton loaders while loading
- [ ] If one source fails, others still show
- [ ] Timeout after 30s with graceful error
- [ ] Empty states for each section
- [ ] Report has unique shareable URL
- [ ] Report persists on refresh

### Data Quality
- [ ] YC companies show accurate outcomes
- [ ] Trends shows actual graph
- [ ] News articles are recent (last 30 days)
- [ ] Reddit/HN posts are relevant
- [ ] Similar companies actually match
- [ ] Score calculation is consistent
- [ ] No duplicate companies
- [ ] Company logos load or show fallback

---

## 🎨 Visual Polish

### Layout
- [ ] Mobile responsive (375px)
- [ ] Tablet responsive (768px)
- [ ] Desktop (1920px)
- [ ] No horizontal scroll
- [ ] Consistent spacing (8px grid)
- [ ] Cards have consistent border radius
- [ ] Clear visual hierarchy

### Typography
- [ ] Font loads fast (system font preferred)
- [ ] Body text 16px minimum
- [ ] Line height 1.5-1.6
- [ ] Numbers aligned in tables

### Colors & Contrast
- [ ] WCAG AA contrast (4.5:1)
- [ ] Colorblind-friendly outcome badges
- [ ] Dark mode works
- [ ] Focus states visible
- [ ] Error = red, Success = green

### Animations
- [ ] Button hover states
- [ ] Button active states
- [ ] Smooth loading spinner
- [ ] No janky transitions
- [ ] Score gauge animates
- [ ] No layout shift (CLS = 0)

### Icons & Images
- [ ] Consistent icon set (Lucide)
- [ ] Icons not pixelated
- [ ] Logo fallbacks for companies
- [ ] Images have alt text
- [ ] Favicon set
- [ ] OG image set

---

## ⚡ Performance

### Speed
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] TTI < 3.5s
- [ ] Images optimized (WebP)
- [ ] Fonts don't block render

### Error Handling
- [ ] API timeout doesn't crash
- [ ] Network error shows friendly message
- [ ] Rate limit handled
- [ ] Invalid response handled
- [ ] Error boundaries in place

---

## 📱 Mobile

### Touch
- [ ] Buttons 44px minimum
- [ ] Adequate spacing between targets
- [ ] No hover-only interactions

### Layout
- [ ] Input full width
- [ ] Cards stack vertically
- [ ] Charts resize
- [ ] No text cut off

---

## 🔗 Sharing & SEO

### Social
- [ ] OG title compelling
- [ ] OG description clear
- [ ] OG image 1200x630px
- [ ] Twitter card works
- [ ] LinkedIn preview works
- [ ] Share buttons work

### SEO
- [ ] Page title descriptive
- [ ] Meta description set
- [ ] Heading hierarchy correct (one H1)

---

## 🧪 Testing

### Manual
- [ ] Test 10 different idea types
- [ ] Test on real phone
- [ ] Test with slow network
- [ ] Test rapid submissions
- [ ] Test back/forward buttons
- [ ] Test refresh on report page
- [ ] Test shared URL in incognito

---

## 📝 Content & Copy

### Microcopy
- [ ] Buttons have clear labels
- [ ] Errors are helpful, not technical
- [ ] Empty states guide to action
- [ ] Loading messages set expectations

### Quality Examples

**Bad loading:**
```
Loading...
```

**Good loading:**
```
✓ Searching 5,500+ YC companies
✓ Fetching market trends
◐ Scanning recent news...
○ Analyzing community sentiment

[━━━━━━━━━━━━━━━━░░░░░░░░░░░░] 60%
```

**Bad empty state:**
```
No results.
```

**Good empty state:**
```
📭 No similar YC companies found

This could mean:
• Your idea is truly novel
• Try broader keywords

We still found news and discussions below.
```

**Bad error:**
```
Error 500: Internal Server Error
```

**Good error:**
```
😅 Something went wrong

We couldn't complete your validation. 
This is usually temporary.

[Try Again]
```

---

## 🚀 Launch Readiness

### Pre-Launch
- [ ] Domain configured, SSL works
- [ ] Environment variables set
- [ ] Rate limiting in place
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics enabled

### Launch Day
- [ ] Test full flow on production
- [ ] Test on multiple devices
- [ ] Monitor errors for first 24h
- [ ] Have rollback plan

---

# Summary

## Data Sources (Updated)

| Source | API | Cost |
|--------|-----|------|
| Google Trends | SerpAPI | 1/validation |
| Google News | Serper | 1/validation |
| Company Discovery | Serper | 2/validation |
| YC Database | Supabase | Free |
| Product Hunt | PH API | Free |
| Reddit | RSS | Free |
| Hacker News | RSS | Free |

## Key Deliverables

1. **Serper integration** — News + company discovery
2. **RSS integration** — Reddit + HN
3. **Product Hunt integration** — Launched products
4. **Homepage redesign** — Sleek single-input
5. **Execution polish** — All checklist items

## Definition of Done

A feature is "done" when:
1. Works in Chrome, Safari, Firefox
2. Works on mobile
3. Has loading, error, and empty states
4. No console errors
5. A stranger could use it without instructions