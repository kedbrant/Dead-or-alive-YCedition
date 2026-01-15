# Product Requirements Document: Ship or Skip

## 1. Overview

### 1.1 Product Name
**Ship or Skip** — *Would you build this startup?*

### 1.2 One-Liner
Tinder for startup ideas. Swipe through real pitches, see what the crowd thinks, submit your own.

### 1.3 Core Value Proposition
Validate your startup idea in 10 words. See if the crowd would ship it or skip it. Discover how wrong you'd be about billion-dollar companies.

### 1.4 Target Users
- Founders validating ideas
- Aspiring entrepreneurs
- Startup Twitter / X community
- VCs and angels (for entertainment)
- Anyone curious about startups

### 1.5 Success Metrics
- Ideas voted on per session (target: 15+)
- Ideas submitted per day (target: 50+)
- Social shares (target: 500+ in first week)
- Return rate within 7 days (target: 30%+)

---

## 2. Game Mechanics

### 2.1 Core Loop

```
SEE IDEA → VOTE → REVEAL → REPEAT
```

1. **SEE**: Player views a startup idea (hero + subtitle)
2. **VOTE**: Player swipes/taps: Ship 🚀 or Skip 💀
3. **REVEAL**: Show crowd results (% and total votes)
4. **REPEAT**: Next idea

### 2.2 Idea Format

Every idea has exactly two components:

| Field | Description | Limit |
|-------|-------------|-------|
| **Hero** | The main pitch headline | 60 characters max |
| **Subtitle** | Supporting one-liner | 100 characters max |

**Examples:**
```
Hero: "AI that writes your emails"
Subtitle: "Never write cold outreach again"

Hero: "Rent rooms from local hosts"
Subtitle: "Travel like you live there"

Hero: "Payment infrastructure for the internet"
Subtitle: "Accept payments in minutes, not weeks"
```

### 2.3 Voting Options

| Option | Meaning | Visual |
|--------|---------|--------|
| **Ship 🚀** | "I'd build this" / "This could work" | Green / Right swipe |
| **Skip 💀** | "I'd pass" / "This won't work" | Red / Left swipe |

### 2.4 Reveal Data

After each vote, show:
- **Percentage**: "73% Ship" or "68% Skip"
- **Total votes**: "2,847 votes"
- **User's alignment**: "You agreed with the crowd" or "You went against the crowd"

### 2.5 User Stats Tracked

- Total ideas voted on
- Ship rate (how often user votes Ship)
- Crowd agreement rate (how often user matches majority)
- Ideas submitted
- Best performing submitted idea

---

## 3. User Flows

### 3.1 First-Time Voter (Anonymous)

```
Landing Page
    - Headline: "Would you ship this startup?"
    - Hook: "73% would have skipped Airbnb's pitch"
    - [Start Voting] button
    ↓
Voting Screen
    - Show idea card (hero + subtitle)
    - Two buttons: [Skip 💀] [Ship 🚀]
    - Or: swipe left/right
    ↓
Reveal
    - "67% Ship 🚀"
    - "1,234 votes"
    - "You agreed with the crowd" (or not)
    ↓
[Next Idea] button
    ↓
After 10 votes: prompt to submit own idea or continue
    ↓
After 20 votes: prompt to add Twitter handle for leaderboard
```

### 3.2 Submitting an Idea

```
[Submit Your Idea] button (in nav or after voting)
    ↓
Submit Form
    - Hero input (60 char max)
    - Subtitle input (100 char max)
    - Twitter handle (optional, for credit)
    - [Submit for Voting] button
    ↓
Confirmation
    - "Your idea is live!"
    - "Come back to see how it performs"
    - Shareable link to track results
    ↓
Return to voting
```

### 3.3 Checking Your Idea's Performance

```
My Ideas page (or direct link)
    ↓
Shows all submitted ideas with:
    - Hero + subtitle
    - Current Ship %
    - Total votes
    - Rank among all ideas
    ↓
[Share Results] button per idea
```

### 3.4 Leaderboard Flow

```
Leaderboard Page
    ↓
Tabs: [Top Ideas] [Most Voted] [Controversial]
    ↓
Top Ideas:
    Rank | Idea (hero) | Ship % | Votes | Submitter
    #1   | "AI for X"  | 94%    | 5.2k  | @pmarca
    #2   | "Uber for Y"| 91%    | 3.8k  | @naval
    ↓
Controversial = closest to 50/50 split
```

### 3.5 Share Flow

**After voting session:**
```
[See Your Stats] button
    ↓
Stats Card:
    - "You voted on 34 ideas"
    - "Your ship rate: 61%"
    - "You agreed with the crowd 72% of the time"
    ↓
[Share Stats] → Twitter/copy link
```

**After submitting idea:**
```
Idea Results Card:
    - "AI that writes your emails"
    - "78% said Ship 🚀"
    - "1,847 votes"
    ↓
[Share Results] → Twitter/copy link
```

---

## 4. Data Model

### 4.1 Ideas Table

```sql
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,         -- URL-friendly slug for pitch page
    hero TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    source TEXT DEFAULT 'user',        -- 'user', 'yc', 'famous'
    source_company TEXT,               -- e.g., "Airbnb" for YC ideas
    source_batch TEXT,                 -- e.g., "W09" for YC ideas
    source_outcome TEXT,               -- 'unicorn', 'success', 'dead', 'unknown'
    submitter_twitter TEXT,            -- Twitter handle without @
    ship_count INTEGER DEFAULT 0,
    skip_count INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    ship_percentage FLOAT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ideas_slug ON ideas(slug);
CREATE INDEX idx_ideas_total_votes ON ideas(total_votes DESC);
CREATE INDEX idx_ideas_ship_percentage ON ideas(ship_percentage DESC);
CREATE INDEX idx_ideas_source ON ideas(source);
CREATE INDEX idx_ideas_submitter ON ideas(submitter_twitter);
```

### 4.2 Votes Table

```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES ideas(id) NOT NULL,
    session_id TEXT NOT NULL,          -- Anonymous session tracking
    player_id UUID REFERENCES players(id),  -- Optional, if registered
    vote TEXT NOT NULL,                -- 'ship' or 'skip'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_votes_unique ON votes(idea_id, session_id);
CREATE INDEX idx_votes_idea ON votes(idea_id);
CREATE INDEX idx_votes_session ON votes(session_id);
CREATE INDEX idx_votes_player ON votes(player_id);
```

### 4.3 Players Table

```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twitter_handle TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    total_votes INTEGER DEFAULT 0,
    ship_votes INTEGER DEFAULT 0,
    crowd_agreements INTEGER DEFAULT 0,
    ideas_submitted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_players_total_votes ON players(total_votes DESC);
CREATE INDEX idx_players_ideas_submitted ON players(ideas_submitted DESC);
```

### 4.4 Sessions Table (for anonymous tracking)

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,               -- UUID stored in cookie
    total_votes INTEGER DEFAULT 0,
    ship_votes INTEGER DEFAULT 0,
    crowd_agreements INTEGER DEFAULT 0,
    player_id UUID REFERENCES players(id),  -- Linked if they register
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.5 Leaderboard Views

```sql
-- Top ideas by ship percentage (minimum 100 votes)
CREATE VIEW leaderboard_top_ideas AS
SELECT 
    id,
    hero,
    subtitle,
    source,
    source_company,
    submitter_twitter,
    ship_percentage,
    total_votes
FROM ideas
WHERE total_votes >= 100 AND is_active = true
ORDER BY ship_percentage DESC, total_votes DESC
LIMIT 100;

-- Most voted ideas
CREATE VIEW leaderboard_most_voted AS
SELECT 
    id,
    hero,
    subtitle,
    source,
    source_company,
    submitter_twitter,
    ship_percentage,
    total_votes
FROM ideas
WHERE is_active = true
ORDER BY total_votes DESC
LIMIT 100;

-- Most controversial (closest to 50%)
CREATE VIEW leaderboard_controversial AS
SELECT 
    id,
    hero,
    subtitle,
    source,
    source_company,
    submitter_twitter,
    ship_percentage,
    total_votes,
    ABS(ship_percentage - 50) as controversy_score
FROM ideas
WHERE total_votes >= 100 AND is_active = true
ORDER BY controversy_score ASC
LIMIT 100;
```

---

## 5. Pre-Seeded Data

### 5.1 Data Sources

**Primary: YC Companies from YCDB**
- ~2,000+ companies with one-liner descriptions
- Already in hero + subtitle format
- Known outcomes (unicorn, success, dead)

**Secondary: Famous Startups**
- Add ~50 iconic companies manually
- Include controversial ones people would skip
- Airbnb, Uber, Stripe, etc.

### 5.2 YC Data Mapping

From YCDB scrape:
```javascript
{
    hero: company.name,                    // Or extract from description
    subtitle: company.description,
    source: 'yc',
    source_company: company.name,
    source_batch: company.batch,
    source_outcome: mapStatus(company.status)  // 'unicorn', 'success', 'dead'
}
```

### 5.3 Famous Startups to Pre-Load

| Company | Hero | Subtitle | Outcome |
|---------|------|----------|---------|
| Airbnb | "Rent rooms from strangers" | "Travel like you live there" | unicorn |
| Uber | "Tap a button, get a ride" | "Your private driver" | unicorn |
| Stripe | "Payments for developers" | "Accept money in 7 lines of code" | unicorn |
| WeWork | "Office space as a service" | "Community workspaces for creators" | dead |
| Theranos | "Blood tests from a finger prick" | "Lab results in hours, not days" | dead |
| Juicero | "Fresh juice at the press of a button" | "The Keurig of cold-pressed juice" | dead |
| Quibi | "Premium shows for your phone" | "Quick bites of entertainment" | dead |

The magic: **People will Skip the unicorns and Ship the failures.**

### 5.4 Reveal Enhancement for Known Outcomes

After voting on YC/famous ideas, the reveal can show:

```
┌─────────────────────────────────────┐
│          67% Ship 🚀                │
│          2,847 votes                │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  This was Airbnb (YC W09)           │
│  Now worth $80B+ 🦄                 │
│                                     │
└─────────────────────────────────────┘
```

Or for failures:
```
┌─────────────────────────────────────┐
│          81% Ship 🚀                │
│          1,923 votes                │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  This was Juicero                   │
│  Shut down in 2017 💀               │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. Personal Pitch Pages (Viral Engine)

This is the core growth mechanic. Every submitted idea gets a dedicated shareable URL that founders can promote.

### 6.1 The Personal Pitch URL

```
shiporskip.io/pitch/[slug]
```

Example: `shiporskip.io/pitch/ai-email-writer`

### 6.2 What the Pitch Page Shows

**Before voting:**
```
┌─────────────────────────────────────┐
│                                     │
│    [Avatar] @anton's pitch          │
│                                     │
│  ───────────────────────────────    │
│                                     │
│    "AI that writes your emails"     │
│                                     │
│    Never write cold outreach again  │
│                                     │
│                                     │
│   [💀 SKIP]          [🚀 SHIP]      │
│                                     │
└─────────────────────────────────────┘
```

**After voting (reveal):**
```
┌─────────────────────────────────────┐
│                                     │
│    [Avatar] @anton's pitch          │
│                                     │
│  ───────────────────────────────    │
│                                     │
│    "AI that writes your emails"     │
│                                     │
│    Never write cold outreach again  │
│                                     │
│  ───────────────────────────────    │
│                                     │
│          🚀 78% SHIP                │
│          1,847 votes                │
│                                     │
│  ───────────────────────────────    │
│                                     │
│   [Vote on more ideas]              │
│   [Submit your own pitch]           │
│                                     │
└─────────────────────────────────────┘
```

### 6.3 The Viral Loop

```
Founder submits idea
    ↓
Gets personal pitch URL: shiporskip.io/pitch/ai-email-writer
    ↓
Tweets: "Would you ship my startup idea? Vote here → [link]"
    ↓
Followers click, vote Ship or Skip
    ↓
See results, get hooked, vote on more ideas
    ↓
Submit their own pitch
    ↓
Tweet their own link
    ↓
Repeat ♻️
```

### 6.4 Auto-Generated Tweet Templates

**On submission (before votes):**
```
Would you ship my startup idea?

"AI that writes your emails"

Vote here → shiporskip.io/pitch/ai-email-writer
```

**After getting votes (results):**
```
78% of people would ship my startup idea 🚀

"AI that writes your emails"

Would you? → shiporskip.io/pitch/ai-email-writer
```

**Milestone tweets (auto-prompted):**

At 100 votes:
```
My startup pitch just hit 100 votes on Ship or Skip

Current results: 73% Ship 🚀

Join the vote → shiporskip.io/pitch/ai-email-writer
```

At 1000 votes:
```
1,000 people voted on my startup idea

The verdict: 81% said Ship It 🚀

What do you think? → shiporskip.io/pitch/ai-email-writer
```

### 6.5 Pitch Page Features

| Feature | Description |
|---------|-------------|
| Real-time vote count | Updates as votes come in |
| Founder attribution | Shows Twitter handle + avatar |
| Social proof | "X people voted in the last hour" |
| OG image | Dynamic image with idea + current results |
| One-click voting | No signup required to vote |
| Post-vote CTAs | "Vote on more" / "Submit your own" |

### 6.6 Dynamic OG Image for Sharing

When the pitch URL is shared on Twitter/LinkedIn, show a dynamic preview:

```
┌─────────────────────────────────────┐
│  SHIP OR SKIP                       │
│                                     │
│  "AI that writes your emails"       │
│                                     │
│  🚀 78% Ship • 1,847 votes          │
│                                     │
│  Would you ship it?                 │
│                                     │
└─────────────────────────────────────┘
```

This image updates as votes come in, so re-sharing shows new results.

---

## 7. Pages & Routes

### 7.1 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, hook stat, start CTA |
| `/vote` | Voting | Core swipe/vote experience |
| `/submit` | Submit | Add your own idea |
| `/pitch/[slug]` | Personal Pitch | Shareable pitch page (THE VIRAL ENGINE) |
| `/leaderboard` | Leaderboard | Top ideas, most voted, controversial |
| `/my-ideas` | My Ideas | Track your submitted ideas |
| `/stats` | My Stats | Your voting stats |
| `/about` | About | How it works |

### 7.2 API Routes

```
GET /api/pitch/[slug]
    → Returns idea with full stats for pitch page
    → Returns: { id, hero, subtitle, twitter_handle, avatar_url, ship_percentage, total_votes, created_at }

GET /api/pitch/[slug]/og
    → Returns dynamically generated OG image for social sharing

GET /api/ideas/next
    Query: ?session_id=X
    → Returns random idea not yet voted on by this session
    → Weighted toward ideas with fewer votes (for balance)
    → Returns: { id, hero, subtitle }

POST /api/ideas/vote
    Body: { idea_id, vote, session_id }
    → Records vote
    → Updates idea counts
    → Updates session stats
    → Returns: { 
        ship_percentage, 
        total_votes, 
        user_agreed_with_crowd,
        source_company?,      // If YC/famous
        source_outcome?       // If known
      }

POST /api/ideas/submit
    Body: { hero, subtitle, twitter_handle? }
    → Creates new idea
    → Returns: { idea_id, share_url }

GET /api/ideas/[id]
    → Returns idea with full stats

GET /api/leaderboard
    Query: ?type=top|voted|controversial&limit=50
    → Returns ranked ideas

GET /api/session/[id]/stats
    → Returns session voting stats

GET /api/player/[handle]/ideas
    → Returns ideas submitted by player
```

---

## 7. Components

### 7.1 Core Components

**IdeaCard**
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│    "AI that writes your emails"     │
│                                     │
│    Never write cold outreach again  │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**VoteButtons**
```
┌───────────────┐    ┌───────────────┐
│      💀       │    │      🚀       │
│     SKIP      │    │     SHIP      │
└───────────────┘    └───────────────┘
```

**RevealOverlay**
```
┌─────────────────────────────────────┐
│                                     │
│          🚀 73% SHIP                │
│                                     │
│          2,847 votes                │
│                                     │
│    You agreed with the crowd ✓     │
│                                     │
│  ─────────────────────────────────  │
│  This was Stripe (YC S09) 🦄        │
│                                     │
│   [Share]              [Next →]     │
│                                     │
└─────────────────────────────────────┘
```

**SubmitForm**
```
┌─────────────────────────────────────┐
│  Your Startup Idea                  │
│                                     │
│  Hero (the headline)                │
│  ┌─────────────────────────────┐    │
│  │ AI that writes your emails  │    │
│  └─────────────────────────────┘    │
│  42/60 characters                   │
│                                     │
│  Subtitle (one line explanation)    │
│  ┌─────────────────────────────┐    │
│  │ Never write cold outreach   │    │
│  └─────────────────────────────┘    │
│  67/100 characters                  │
│                                     │
│  Twitter handle (optional)          │
│  ┌─────────────────────────────┐    │
│  │ @yourhandle                 │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Submit for Voting 🚀]             │
│                                     │
└─────────────────────────────────────┘
```

**StatsCard**
```
┌─────────────────────────────────────┐
│  Your Voting Stats                  │
│                                     │
│  🗳️  47 ideas voted                 │
│  🚀  61% ship rate                  │
│  🎯  74% crowd agreement            │
│                                     │
│  [Share Stats]                      │
│                                     │
└─────────────────────────────────────┘
```

**LeaderboardRow**
```
┌─────────────────────────────────────┐
│ #1  "AI for cold emails"            │
│     94% Ship • 5.2k votes • @maker  │
└─────────────────────────────────────┘
```

### 7.2 Layout Components

**Navbar**
```
[Logo]        [Vote] [Submit] [Leaderboard] [My Stats]
```

**MobileNav**
```
[← Back]      Ship or Skip      [Menu ≡]
```

---

## 8. Design Specifications

### 8.1 Visual Identity

**Vibe:** Bold, playful, fast. Dating app meets startup culture.

**Color Palette:**
```
Background:     #0A0A0A (near black)
Surface:        #18181B (card background)
Border:         #27272A (subtle borders)

Ship (green):   #22C55E
Skip (red):     #EF4444
Accent:         #8B5CF6 (purple)

Text Primary:   #FFFFFF
Text Secondary: #A1A1AA
Text Muted:     #71717A
```

### 8.2 Typography

```
Font Family: Inter (Google Fonts)

Hero Text:   32px / Bold / -1% tracking
Subtitle:    18px / Regular / 0 tracking
Stats:       48px / Bold (for percentages)
Body:        16px / Regular
Small:       14px / Regular
Caption:     12px / Medium
```

### 8.3 Card Design

**Idea Card:**
- Full width on mobile, max 480px on desktop
- Rounded corners (16px)
- Subtle shadow
- Centered text
- Generous padding (48px vertical)

**Vote Buttons:**
- Large tap targets (min 64px height)
- Full width on mobile, side-by-side on desktop
- Glow effect on hover
- Satisfying press animation

### 8.4 Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Card entrance | Slide up + fade | 300ms |
| Card exit (ship) | Slide right + fade | 250ms |
| Card exit (skip) | Slide left + fade | 250ms |
| Button hover | Glow + scale 1.02 | 150ms |
| Button press | Scale 0.98 | 100ms |
| Reveal overlay | Fade in | 200ms |
| Percentage count | Number roll up | 600ms |
| Next card | Slide in from right | 300ms |

### 8.5 Swipe Gestures (Mobile)

- Swipe right = Ship 🚀
- Swipe left = Skip 💀
- Swipe threshold: 100px
- Visual feedback: card tilts and shows icon during swipe
- Rubber band effect if swipe cancelled

---

## 9. Viral Mechanics

### 9.1 The Core Hook

**"You would have skipped Airbnb."**

Most people will:
- Skip ideas that became unicorns (skepticism)
- Ship ideas that failed (optimism bias)

This creates shareable "I was wrong" moments.

### 9.2 Shareable Stats

**After voting session:**
```
I voted on 47 startup ideas on Ship or Skip

🚀 My ship rate: 61%
🎯 Crowd agreement: 74%
😅 I would have skipped 3 unicorns

Think you'd do better? shiporskip.io
```

**After submitting idea:**
```
I pitched my startup idea in 12 words:

"AI that writes your emails"

🚀 78% said Ship It
📊 1,847 votes

What do you think? shiporskip.io/idea/xxx
```

**Controversial reveal:**
```
Only 34% would have shipped Airbnb's original pitch:

"Rent rooms from strangers"

Would you? shiporskip.io
```

### 9.3 Viral Loops

**Loop 1: Voting → Sharing Wrong Guesses**
```
Vote on ideas → Get famous ones "wrong" → Share embarrassing result → Friends come vote
```

**Loop 2: Submit → Track → Share**
```
Submit idea → Share link → Friends vote → Come back to check results → Submit another
```

**Loop 3: Leaderboard Competition**
```
See top ideas → Want to beat them → Submit your idea → Promote to get votes
```

### 9.4 Built-in Viral Prompts

After voting on a unicorn you skipped:
> "You would have passed on a $10B company. Share your shame?"

After your idea hits 1000 votes:
> "Your idea is trending! Share it to get more votes."

After hitting 74%+ ship rate:
> "The crowd loves your idea. Share the results?"

---

## 10. Technical Architecture

### 10.1 Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth | None (session-based + optional Twitter handle) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Avatars | Unavatar.io |

### 10.2 State Management

**Client-side:**
- Current idea being viewed
- Vote state (voted or not)
- Session stats (running totals)
- Swipe gesture state

**Server-side:**
- All votes and ideas in Supabase
- Session tracking via cookie
- Real-time vote counts

### 10.3 Performance Considerations

**Speed:**
- Preload next 3 ideas while viewing current
- Optimistic UI updates on vote
- Cache leaderboard with 60s TTL

**Scale:**
- Rate limit votes (1/sec per session)
- Rate limit submissions (10/day per session)
- Supabase connection pooling

### 10.4 Anti-Gaming Measures

- One vote per idea per session (enforced in DB)
- Minimum time between votes (1 second)
- Submission rate limiting
- Profanity filter on submissions
- Manual review queue for flagged content

---

## 12. MVP Scope (48 Hours)

### 12.1 Must Have (Launch Blockers)

- [ ] Landing page with hook stat
- [ ] Core voting flow (see idea → vote → reveal)
- [ ] Ship/Skip buttons (mobile: swipe optional)
- [ ] Reveal with % and vote count
- [ ] Pre-seeded with 500+ YC ideas
- [ ] 50+ famous startup ideas with outcomes
- [ ] Reveal shows company name + outcome for known ideas
- [ ] Submit your own idea form
- [ ] **Personal pitch page (`/pitch/[slug]`) — THE VIRAL ENGINE**
- [ ] **Auto-generated tweet templates for pitch pages**
- [ ] Basic leaderboard (top ideas by ship %)
- [ ] Session tracking (don't show same idea twice)
- [ ] Mobile responsive
- [ ] Share card generation
- [ ] Deploy to Vercel

### 12.2 Should Have (If Time Permits)

- [ ] Swipe gestures on mobile
- [ ] User stats tracking (ship rate, crowd agreement)
- [ ] Multiple leaderboard tabs
- [ ] "My Ideas" page to track submissions
- [ ] Animations (card transitions, number roll)
- [ ] Twitter handle for attribution
- [ ] **Dynamic OG images for pitch pages (updates with vote count)**
- [ ] **Real-time vote updates on pitch page**

### 12.3 Won't Have (Post-Launch)

- [ ] User accounts / auth
- [ ] Comments on ideas
- [ ] Categories / filtering
- [ ] Daily featured ideas
- [ ] Email notifications
- [ ] Idea editing

---

## 13. 48-Hour Build Plan

### Phase 1: Foundation (Hours 0-8)

**Hour 0-2: Project Setup**
- Initialize Next.js with App Router
- Configure Tailwind with custom theme
- Set up Supabase project
- Create database tables
- Environment variables

**Hour 2-5: Data Seeding**
- Write YCDB scraper (reuse from Dead or Alive)
- Map to hero/subtitle format
- Add 50 famous startups manually
- Tag outcomes (unicorn, success, dead)
- Seed Supabase with 500+ ideas

**Hour 5-8: Core Components**
- Build IdeaCard component
- Build VoteButtons component
- Build RevealOverlay component
- Basic page layout

### Phase 2: Voting & Submit Flow (Hours 8-18)

**Hour 8-11: Voting API**
- `/api/ideas/next` — random idea selection
- `/api/ideas/vote` — record vote, return results
- Session ID generation and tracking
- "Already voted" filtering

**Hour 11-14: Voting Screen**
- Wire up components to API
- Implement vote submission
- Build reveal state with results
- Show company name + outcome for known ideas
- "Next idea" flow

**Hour 14-16: Submit Flow**
- Submit form with validation
- Character counters
- Slug generation (URL-friendly)
- Submission API
- Success confirmation with pitch page link

**Hour 16-18: Session Tracking**
- Cookie-based session management
- Track ideas seen per session
- Running stats (votes, ship rate)

### Phase 3: Pitch Pages & Social (Hours 18-32)

**Hour 18-22: Personal Pitch Pages (VIRAL ENGINE)**
- `/pitch/[slug]` route
- Pitch page UI (card + vote + results)
- Slug generation on submit
- Vote on pitch page updates idea stats
- Post-vote CTAs (vote more, submit own)

**Hour 22-25: Share Features**
- Auto-generated tweet templates
- Copy link functionality
- Share buttons on pitch page
- Twitter share with pre-filled text

**Hour 25-28: Leaderboard**
- Leaderboard API endpoints
- Leaderboard page
- Top ideas display
- Link to pitch pages from leaderboard

**Hour 28-32: Landing Page**
- Hero section with hook stat
- How it works
- Live stats (total votes, ideas)
- Strong CTAs

### Phase 4: Polish & Launch (Hours 32-48)

**Hour 32-38: Polish**
- Card animations
- Button feedback
- Loading states
- Error handling
- Mobile testing

**Hour 38-42: Testing**
- Cross-browser testing
- Mobile testing (iOS, Android)
- Edge cases
- Fix critical bugs

**Hour 42-46: Infrastructure**
- Vercel deployment
- Custom domain
- Production environment
- Rate limiting

**Hour 46-48: Launch Prep**
- OG image
- Twitter thread draft
- Demo GIF
- Final bug sweep

---

## 14. File Structure

```
ship-or-skip/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── vote/
│   │   └── page.tsx                # Voting screen
│   ├── submit/
│   │   └── page.tsx                # Submit idea
│   ├── pitch/
│   │   └── [slug]/
│   │       ├── page.tsx            # Personal pitch page (VIRAL ENGINE)
│   │       └── og/
│   │           └── route.tsx       # Dynamic OG image generation
│   ├── leaderboard/
│   │   └── page.tsx                # Leaderboard
│   ├── my-ideas/
│   │   └── page.tsx                # Track submitted ideas
│   ├── stats/
│   │   └── page.tsx                # User voting stats
│   ├── api/
│   │   ├── ideas/
│   │   │   ├── next/route.ts
│   │   │   ├── vote/route.ts
│   │   │   ├── submit/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── pitch/
│   │   │   └── [slug]/route.ts     # Pitch page data
│   │   ├── leaderboard/route.ts
│   │   └── session/
│   │       └── [id]/route.ts
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── voting/
│   │   ├── idea-card.tsx
│   │   ├── vote-buttons.tsx
│   │   ├── reveal-overlay.tsx
│   │   ├── swipe-container.tsx
│   │   └── stats-bar.tsx
│   ├── pitch/
│   │   ├── pitch-card.tsx          # Pitch page card with owner info
│   │   ├── pitch-results.tsx       # Results display for pitch page
│   │   └── share-prompt.tsx        # Tweet templates and share buttons
│   ├── submit/
│   │   └── submit-form.tsx
│   ├── leaderboard/
│   │   ├── leaderboard-table.tsx
│   │   └── idea-row.tsx
│   ├── share/
│   │   └── share-card.tsx
│   └── layout/
│       ├── navbar.tsx
│       └── footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── session/
│   │   └── manager.ts
│   ├── ideas/
│   │   └── selection.ts
│   └── utils.ts
├── scripts/
│   ├── scrape-ycdb.ts
│   └── seed-famous.ts
├── public/
│   ├── og-image.png
│   └── icons/
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 15. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://shiporskip.io

# Optional
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx
```

---

## 16. Launch Strategy

### 15.1 Domain Ideas

- shiporskip.io
- shiporskip.co
- shipskip.com
- wouldyoushipit.com

### 15.2 Launch Tweet Template

```
I built Ship or Skip in 48 hours.

Tinder for startup ideas. Swipe to vote.

The twist? 67% of voters would have SKIPPED Airbnb's pitch.

Would you have shipped these billion-dollar ideas?

→ shiporskip.io

Built for @thibaultll's Mini-Tools test.
```

### 15.3 Viral Hooks

1. **The shame angle:** "You would have skipped Airbnb"
2. **The validation angle:** "78% said Ship my idea"
3. **The competition:** "My idea is #3 on the leaderboard"
4. **The controversy:** "Only 34% would ship Uber's pitch"
5. **The build in public:** "48 hours from idea to launch"

### 15.4 Content Ideas

Twitter threads to post:
- "I showed people 10 famous startup pitches. Here's what they voted."
- "The most controversial startup ideas according to 10,000 votes"
- "Would you have shipped these YC unicorns?"

---

## 17. Success Criteria

### Minimum Bar (Pass)

- Voting flow works smoothly
- 500+ ideas to vote on
- Reveals show % and vote count
- Submit flow works
- Basic leaderboard
- Mobile responsive

### Impressive (Strong Pass)

- Smooth animations
- Swipe gestures work
- Famous idea reveals show outcome
- Share cards work
- 1000+ votes in first day

### Outstanding (Hire Signal)

- Polished micro-interactions
- User stats tracking
- Multiple leaderboard views
- Viral tweet with 100+ RTs
- Ideas submitted by real users

---

## 18. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Cold start (no votes) | Pre-seed with 500+ ideas; fake initial vote counts if needed |
| Spam submissions | Rate limit; profanity filter; manual review queue |
| Gaming votes | One vote per session per idea; rate limiting |
| Low engagement | Hook with famous startup reveals; gamify with stats |
| YCDB blocks scraping | Scrape once, store locally |

---

## 19. Post-Launch Ideas (Backlog)

1. **Categories** — Filter by industry (AI, Fintech, etc.)
2. **Daily challenge** — "Today's 10 ideas" everyone votes on
3. **Idea battles** — Two ideas head-to-head
4. **Founder mode** — Submit with Stripe verification for credibility
5. **Comments** — Let people explain their votes
6. **Trends** — Show ideas gaining momentum
7. **Email digest** — "Your idea got 500 new votes this week"

---

## 20. Quick Reference

### Key URLs

- Data source: https://www.ycdb.co/
- Avatar service: https://unavatar.io/twitter/{handle}

### Idea Character Limits

- Hero: 60 characters
- Subtitle: 100 characters

### Vote Values

- `ship` — User thinks idea could work
- `skip` — User would pass on the idea

### Source Types

- `yc` — Scraped from YCDB
- `famous` — Manually added famous startups
- `user` — User submitted

### Outcome Types (for known ideas)

- `unicorn` — $1B+ valuation
- `success` — Profitable / acquired well
- `dead` — Shut down
- `unknown` — Outcome not tracked

---

## 21. Famous Startups Seed Data

```javascript
const famousStartups = [
  {
    hero: "Rent rooms from strangers",
    subtitle: "Travel like you live there",
    source_company: "Airbnb",
    source_outcome: "unicorn"
  },
  {
    hero: "Tap a button, get a ride",
    subtitle: "Your private driver",
    source_company: "Uber",
    source_outcome: "unicorn"
  },
  {
    hero: "Payment infrastructure for developers",
    subtitle: "Accept payments in 7 lines of code",
    source_company: "Stripe",
    source_outcome: "unicorn"
  },
  {
    hero: "Send money to anyone with email",
    subtitle: "The new way to pay online",
    source_company: "PayPal",
    source_outcome: "unicorn"
  },
  {
    hero: "Search the world's information",
    subtitle: "Organize and make it accessible",
    source_company: "Google",
    source_outcome: "unicorn"
  },
  {
    hero: "Share photos with friends",
    subtitle: "Capture and share the world's moments",
    source_company: "Instagram",
    source_outcome: "unicorn"
  },
  {
    hero: "Short videos for the mobile generation",
    subtitle: "Make your day",
    source_company: "TikTok",
    source_outcome: "unicorn"
  },
  {
    hero: "Office space as a service",
    subtitle: "Community workspaces for creators",
    source_company: "WeWork",
    source_outcome: "dead"
  },
  {
    hero: "Blood tests from a finger prick",
    subtitle: "Lab results in hours, not days",
    source_company: "Theranos",
    source_outcome: "dead"
  },
  {
    hero: "Fresh juice at the press of a button",
    subtitle: "The Keurig of cold-pressed juice",
    source_company: "Juicero",
    source_outcome: "dead"
  },
  {
    hero: "Premium shows for your phone",
    subtitle: "Quick bites of entertainment",
    source_company: "Quibi",
    source_outcome: "dead"
  },
  {
    hero: "Deliver anything in your city",
    subtitle: "Your city at your fingertips",
    source_company: "DoorDash",
    source_outcome: "unicorn"
  },
  {
    hero: "Cloud storage for all your files",
    subtitle: "Your stuff, anywhere",
    source_company: "Dropbox",
    source_outcome: "success"
  },
  {
    hero: "Real-time team messaging",
    subtitle: "Where work happens",
    source_company: "Slack",
    source_outcome: "unicorn"
  },
  {
    hero: "Watch live video game streams",
    subtitle: "See what everyone's playing",
    source_company: "Twitch",
    source_outcome: "unicorn"
  },
  {
    hero: "Ship code faster with AI",
    subtitle: "Your AI pair programmer",
    source_company: "GitHub Copilot",
    source_outcome: "success"
  },
  {
    hero: "Electric cars for everyone",
    subtitle: "Accelerate sustainable transport",
    source_company: "Tesla",
    source_outcome: "unicorn"
  },
  {
    hero: "Colonize Mars",
    subtitle: "Make humanity multi-planetary",
    source_company: "SpaceX",
    source_outcome: "unicorn"
  },
  {
    hero: "Buy and sell cryptocurrency",
    subtitle: "The easiest place to trade crypto",
    source_company: "Coinbase",
    source_outcome: "unicorn"
  },
  {
    hero: "Personal notes that think with you",
    subtitle: "A second brain for your ideas",
    source_company: "Notion",
    source_outcome: "unicorn"
  }
];
```

---

**Now go build it. Ship fast, make people feel dumb for skipping unicorns, and watch them share their shame.** 🚀💀
