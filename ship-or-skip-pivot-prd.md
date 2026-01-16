# Ship or Skip: Pivot PRD

## The Pitch

**"Can you predict startup success from just a pitch?"**

We analyzed 5,500+ Y Combinator companies and their real outcomes. 67% of people would have passed on Airbnb. Test your prediction skills and discover the stories behind the world's most famous startups.

---

## What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Core concept | "Tinder for startup ideas" | "Predict startup success" |
| Data source | User submissions + TrustMRR | 5,500+ YC companies with real outcomes |
| Ship/Skip meaning | Ambiguous | "Will this succeed?" |
| Scoring | None | Oracle Score (prediction accuracy) |
| Educational value | None | Full company deep dives |
| Battle mode | "Which would you ship?" | "Which was more successful?" |
| Leaderboard | Ideas ranked by ship % | Multiple: Surprises, Controversial, etc. |

---

## Tibo's Constraints: How We Hit Them

| Constraint | How We Deliver |
|------------|----------------|
| **Data-Driven** | 5,500+ YC companies with real outcomes, team sizes, industries, batch data |
| **Viral Potential** | "I would have skipped Airbnb" moments, Oracle Score sharing, prediction streaks |
| **Resilient** | Static data in our DB, no external API dependencies at runtime |
| **Gorgeous** | Beautiful reveal animations, company deep dives, achievement celebrations |

---

## Core Game Loop

```
See pitch (one-liner only)
    ↓
Vote: Ship (will succeed) or Skip (will fail)
    ↓
Reveal: Company name + actual outcome + crowd vote %
    ↓
[Read More] → Full company deep dive
    ↓
Next pitch (or share result)
```

---

## 1. The Vote

### What Users See (Before Voting)

```
┌─────────────────────────────────────────┐
│                                         │
│  "Book accommodations around            │
│   the world"                            │
│                                         │
│   YC W09 • Consumer                     │
│                                         │
│   Will this startup succeed?            │
│                                         │
│   [💀 SKIP]          [🚀 SHIP]          │
│                                         │
└─────────────────────────────────────────┘
```

**Shown:**
- One-liner pitch (hero text)
- Batch year
- Industry category

**Hidden:**
- Company name
- Logo
- Outcome
- Team size
- Everything else

### What Ship/Skip Means

| Vote | Meaning | User is predicting... |
|------|---------|----------------------|
| 🚀 **Ship** | "This will succeed" | Unicorn, IPO, or major acquisition |
| 💀 **Skip** | "This will fail" | Shutdown, failure, obscurity |

---

## 2. The Reveal

### Reveal Screen

```
┌─────────────────────────────────────────┐
│                                         │
│         You voted SKIP                  │
│                                         │
│  ────────────────────────────────────   │
│                                         │
│         [Airbnb Logo]                   │
│                                         │
│         AIRBNB                          │
│         🦄 UNICORN                      │
│                                         │
│  ────────────────────────────────────   │
│                                         │
│   😬 You would have passed on a         │
│      $80B+ company                      │
│                                         │
│   34% Ship • 66% Skip                   │
│   2,847 votes                           │
│                                         │
│  ────────────────────────────────────   │
│                                         │
│   [Read More]  [Share]  [Next →]        │
│                                         │
└─────────────────────────────────────────┘
```

### Outcome Badges

| Outcome | Badge | Criteria |
|---------|-------|----------|
| Unicorn | 🦄 | `top_company = true` OR `status = 'Public'` |
| Acquired | 💰 | `status = 'Acquired'` |
| Dead | 💀 | `status = 'Inactive'` |
| Active | ✅ | `status = 'Active'` (no prediction score) |

### Dynamic Insight Copy

```javascript
function getInsightCopy(userVote, outcome, shipPercentage, companyName) {
    // User shipped a unicorn
    if (userVote === 'ship' && outcome === 'unicorn') {
        return `🎯 Nice call! You spotted a winner.`;
    }
    
    // User skipped a unicorn
    if (userVote === 'skip' && outcome === 'unicorn') {
        return `😬 You would have passed on a massive success.`;
    }
    
    // User shipped a dead company
    if (userVote === 'ship' && outcome === 'dead') {
        return `💸 You got fooled. ${companyName} didn't make it.`;
    }
    
    // User skipped a dead company
    if (userVote === 'skip' && outcome === 'dead') {
        return `🎯 Good instincts. This one failed.`;
    }
    
    // User voted on active company (no outcome yet)
    if (outcome === 'active') {
        return `⏳ Still operating. Time will tell if you're right.`;
    }
    
    // Acquired - partial win either way
    if (outcome === 'acquired') {
        return `💰 ${companyName} was acquired. Decent outcome.`;
    }
}
```

---

## 3. Oracle Score (Prediction Accuracy)

### How It Works

Users earn an "Oracle Score" based on prediction accuracy on companies with known outcomes.

```javascript
function calculateOracleScore(votes) {
    // Only count votes on resolved companies
    const resolvedVotes = votes.filter(v => 
        ['unicorn', 'dead', 'acquired'].includes(v.idea.source_outcome)
    );
    
    if (resolvedVotes.length < 10) {
        return null; // Not enough data
    }
    
    const correct = resolvedVotes.filter(v => {
        if (v.vote === 'ship' && ['unicorn', 'acquired'].includes(v.idea.source_outcome)) {
            return true; // Shipped a success
        }
        if (v.vote === 'skip' && v.idea.source_outcome === 'dead') {
            return true; // Skipped a failure
        }
        return false;
    });
    
    return Math.round((correct.length / resolvedVotes.length) * 100);
}
```

### Oracle Score Display

```
┌─────────────────────────────────────────┐
│                                         │
│   YOUR ORACLE SCORE                     │
│                                         │
│         🔮 73%                          │
│                                         │
│   You correctly predicted 73 out of     │
│   100 startup outcomes.                 │
│                                         │
│   Better than 81% of players.           │
│                                         │
│   ✅ 42 correct Ships                   │
│   ✅ 31 correct Skips                   │
│   ❌ 27 wrong predictions               │
│                                         │
└─────────────────────────────────────────┘
```

### Shareable Oracle Card

```
🔮 My Ship or Skip Oracle Score: 73%

I correctly predicted 73 out of 100 YC startup outcomes.

Can you beat me? → shiporskip.io
```

---

## 4. Company Deep Dive Pages

**Route:** `/company/[slug]` (dynamic, loads on demand)

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to voting                                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Logo]  AIRBNB                        🦄 UNICORN    │  │
│  │          "Book accommodations around the world"      │  │
│  │                                                      │  │
│  │  YC W09 • Consumer • Travel • San Francisco          │  │
│  │                                                      │  │
│  │  [Visit Website]  [YC Profile]                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────┐  ┌────────────────────────────┐    │
│  │ CROWD PREDICTION   │  │ COMPANY STATS              │    │
│  │                    │  │                            │    │
│  │  🚀 34% Ship       │  │ 👥 6,132 employees         │    │
│  │  💀 66% Skip       │  │ 📅 Founded 2008            │    │
│  │                    │  │ 🏷️ Marketplace, Travel     │    │
│  │  2,847 votes       │  │ 📍 San Francisco, CA       │    │
│  │                    │  │ 📊 Status: Public (IPO)    │    │
│  │  "Most people      │  │                            │    │
│  │   would have       │  │                            │    │
│  │   passed!"         │  │                            │    │
│  └────────────────────┘  └────────────────────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ABOUT                                                │  │
│  │                                                      │  │
│  │ Founded in August of 2008 and based in San           │  │
│  │ Francisco, California, Airbnb is a trusted           │  │
│  │ community marketplace for people to list,            │  │
│  │ discover, and book unique accommodations...          │  │
│  │                                                      │  │
│  │ [Show more]                                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ THE INSIGHT                                          │  │
│  │                                                      │  │
│  │ "66% of voters would have SKIPPED Airbnb.            │  │
│  │  This became one of the most valuable companies      │  │
│  │  in Y Combinator history."                           │  │
│  │                                                      │  │
│  │ 🦄 Top 1% of YC companies by valuation               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SIMILAR COMPANIES                                    │  │
│  │                                                      │  │
│  │ [Vrbo] [Booking.com] [Getaround]                     │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │ Would you have shipped Airbnb?                       │  │
│  │                                                      │  │
│  │ [🚀 Ship]              [💀 Skip]                     │  │
│  │                                                      │  │
│  │ [Share]  [Vote on more →]                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dynamic Loading

```javascript
// app/company/[slug]/page.tsx

export default async function CompanyPage({ params }) {
    const { slug } = params;
    
    // Fetch on demand - no pre-generation
    const company = await db.ideas.findOne({ slug });
    
    if (!company) {
        notFound();
    }
    
    // Get vote stats
    const voteStats = {
        ship_percentage: company.ship_percentage,
        total_votes: company.total_votes
    };
    
    return <CompanyDetailView company={company} voteStats={voteStats} />;
}

// No generateStaticParams = fully dynamic
// Pages only exist when visited
```

---

## 5. Active Pool System

### The Problem

5,500 companies = votes spread too thin. Most would have <10 votes forever.

### The Solution

Control how many companies are in active rotation.

```sql
ALTER TABLE ideas ADD COLUMN is_in_active_pool BOOLEAN DEFAULT false;
ALTER TABLE ideas ADD COLUMN pool_added_at TIMESTAMP;
```

### Initial Pool: 200 Companies

| Category | Count | Selection Criteria |
|----------|-------|-------------------|
| Unicorns | 50 | Top companies by team size |
| Dead (famous) | 50 | Known failures, interesting stories |
| Acquired | 30 | Clear exits |
| Active (promising) | 50 | Large team size, recent batches |
| User submissions | 20 | Reserved slots |
| **Total** | **200** | |

### Selection Within Pool

```javascript
function selectNextIdea(sessionId) {
    const seenIds = await getSeenIdeas(sessionId);
    
    // Weighted distribution within active pool
    const rand = Math.random();
    let outcomeFilter;
    
    if (rand < 0.40) {
        // 40% unicorns (the hook)
        outcomeFilter = 'unicorn';
    } else if (rand < 0.70) {
        // 30% dead (the drama)
        outcomeFilter = 'dead';
    } else if (rand < 0.85) {
        // 15% acquired
        outcomeFilter = 'acquired';
    } else {
        // 15% active (no outcome yet)
        outcomeFilter = 'active';
    }
    
    return db.ideas.findOne({
        is_in_active_pool: true,
        source_outcome: outcomeFilter,
        id: { $nin: seenIds }
    });
}
```

### Pool Expansion Schedule

| Milestone | Pool Size | Trigger |
|-----------|-----------|---------|
| Launch | 200 | — |
| Week 2 | 300 | Avg votes/company > 30 |
| Week 3 | 400 | Avg votes/company > 30 |
| Week 4 | 500 | Avg votes/company > 30 |
| Ongoing | +100/week | As needed |

### Admin Control

```javascript
// Expand pool by adding more companies
async function expandPool(count, criteria) {
    const newCompanies = await db.ideas
        .find({
            is_in_active_pool: false,
            ...criteria
        })
        .sort({ source_team_size: -1 })
        .limit(count);
    
    await db.ideas.updateMany(
        { id: { $in: newCompanies.map(c => c.id) } },
        { 
            is_in_active_pool: true, 
            pool_added_at: new Date() 
        }
    );
    
    return newCompanies.length;
}

// Examples:
// expandPool(50, { source_outcome: 'dead' });
// expandPool(25, { source_outcome: 'unicorn' });
```

---

## 6. Battle Mode

### New Concept

"Which startup was MORE successful?"

Two companies with known outcomes. User predicts which did better.

### Battle Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           WHICH STARTUP WAS MORE SUCCESSFUL?                │
│                                                             │
│  ┌───────────────────┐      ┌───────────────────┐          │
│  │                   │      │                   │          │
│  │ "Book places to   │  VS  │ "Premium short    │          │
│  │  stay around the  │      │  shows for your   │          │
│  │  world"           │      │  phone"           │          │
│  │                   │      │                   │          │
│  │   YC W09          │      │   2020            │          │
│  │                   │      │                   │          │
│  │  [PICK THIS]      │      │  [PICK THIS]      │          │
│  │                   │      │                   │          │
│  └───────────────────┘      └───────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Battle Reveal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ✅ CORRECT!                              │
│                                                             │
│  ┌───────────────────┐      ┌───────────────────┐          │
│  │                   │      │                   │          │
│  │  [Logo] AIRBNB    │      │  [Logo] QUIBI     │          │
│  │                   │      │                   │          │
│  │  🦄 UNICORN       │      │  💀 DEAD          │          │
│  │                   │      │                   │          │
│  │  $80B+ valuation  │      │  Shut down in     │          │
│  │  6,132 employees  │      │  6 months after   │          │
│  │                   │      │  raising $1.75B   │          │
│  │                   │      │                   │          │
│  └───────────────────┘      └───────────────────┘          │
│                                                             │
│            82% of players got this right                    │
│                                                             │
│  [Read about Airbnb]  [Read about Quibi]  [Next Battle →]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Battle Matchmaking

```javascript
async function createBattle(sessionId) {
    const seenBattlePairs = await getSeenBattles(sessionId);
    
    // Get a winner (unicorn or acquired)
    const winner = await db.ideas.findOne({
        is_in_active_pool: true,
        source_outcome: { $in: ['unicorn', 'acquired'] },
    });
    
    // Get a loser (dead)
    const loser = await db.ideas.findOne({
        is_in_active_pool: true,
        source_outcome: 'dead',
    });
    
    // Randomize positions
    const isWinnerLeft = Math.random() > 0.5;
    
    return {
        left: isWinnerLeft ? winner : loser,
        right: isWinnerLeft ? loser : winner,
        correct_answer: isWinnerLeft ? 'left' : 'right'
    };
}
```

### Battle Scoring

```javascript
function updateBattleStats(userId, isCorrect) {
    if (isCorrect) {
        user.battle_correct += 1;
        user.battle_streak += 1;
        user.battle_best_streak = Math.max(
            user.battle_best_streak, 
            user.battle_streak
        );
    } else {
        user.battle_streak = 0;
    }
    user.battle_total += 1;
}
```

---

## 7. Leaderboards

### Multiple Leaderboard Views

**Tab 1: Biggest Misses**
Unicorns that got skipped the most

```sql
SELECT * FROM ideas 
WHERE source_outcome = 'unicorn' 
AND total_votes >= 50
ORDER BY ship_percentage ASC 
LIMIT 20;
```

**Tab 2: Biggest Fools**
Dead companies that got shipped the most

```sql
SELECT * FROM ideas 
WHERE source_outcome = 'dead' 
AND total_votes >= 50
ORDER BY ship_percentage DESC 
LIMIT 20;
```

**Tab 3: Most Controversial**
Closest to 50/50 split

```sql
SELECT * FROM ideas 
WHERE total_votes >= 50
ORDER BY ABS(ship_percentage - 50) ASC 
LIMIT 20;
```

**Tab 4: Crowd Favorites**
Highest ship percentage

```sql
SELECT * FROM ideas 
WHERE total_votes >= 50
ORDER BY ship_percentage DESC 
LIMIT 20;
```

**Tab 5: User Submissions**
Top user-submitted ideas

```sql
SELECT * FROM ideas 
WHERE source = 'user'
AND total_votes >= 20
ORDER BY total_votes DESC 
LIMIT 20;
```

### Leaderboard Card

```
┌─────────────────────────────────────────────────────────────┐
│  BIGGEST MISSES                                             │
│  Unicorns the crowd would have skipped                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #1  Airbnb                                          │   │
│  │     "Book accommodations around the world"          │   │
│  │     🦄 Unicorn • Only 34% would ship • 2.8k votes   │   │
│  │                                      [Read More →]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ #2  Stripe                                          │   │
│  │     "Payments infrastructure for the internet"      │   │
│  │     🦄 Unicorn • Only 41% would ship • 1.9k votes   │   │
│  │                                      [Read More →]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... more ...                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Personal Pitch Pages (User Submissions)

Users can still submit their own ideas for crowd validation.

### Submit Flow

```
┌─────────────────────────────────────────┐
│                                         │
│  SUBMIT YOUR STARTUP IDEA               │
│                                         │
│  Pitch (60 chars max)                   │
│  ┌─────────────────────────────────┐   │
│  │ AI that writes your emails      │   │
│  └─────────────────────────────────┘   │
│                                    42/60│
│                                         │
│  Description (optional, 100 chars)      │
│  ┌─────────────────────────────────┐   │
│  │ Never write cold outreach again │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Your Twitter/X handle                  │
│  ┌─────────────────────────────────┐   │
│  │ @yourhandle                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Submit for Voting]                    │
│                                         │
└─────────────────────────────────────────┘
```

### Personal Pitch Page

**Route:** `/pitch/[slug]`

Same as before — users get a shareable page for their idea.

```
┌─────────────────────────────────────────┐
│                                         │
│    [Avatar] @anton's pitch              │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│    "AI that writes your emails"         │
│                                         │
│    Never write cold outreach again      │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│          🚀 78% SHIP                    │
│          1,847 votes                    │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│   [Vote on more ideas]                  │
│   [Submit your own pitch]               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Achievements System

### Priority #1 Engagement Feature

Achievements trigger immediately from vote #1.

### Key Achievements

| Achievement | Trigger | Rarity |
|-------------|---------|--------|
| First Blood | 1st vote | Common |
| Getting Started | 5 votes | Common |
| Centurion | 100 votes | Rare |
| Unicorn Hunter | Vote on a unicorn | Uncommon |
| Visionary | Ship a unicorn | Uncommon |
| Missed Opportunity | Skip a unicorn | Uncommon |
| Gravedigger | Vote on a dead startup | Common |
| Fooled | Ship a dead startup | Uncommon |
| Oracle | 80%+ prediction accuracy (50+ resolved votes) | Epic |
| Battle Champion | 10 battle streak | Rare |

### Unlock Experience

**MUST BE MASSIVELY SATISFYING.**

- Full screen takeover
- Rarity-based particle effects
- Distinct sound per tier
- Share button

See Engagement Features PRD for full spec.

---

## 10. Data Model

### Ideas Table

```sql
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    
    -- Display fields
    hero TEXT NOT NULL,                    -- One-liner pitch
    subtitle TEXT,                         -- Short description
    
    -- Source tracking
    source TEXT DEFAULT 'user',            -- 'user' | 'yc'
    
    -- YC company data (full)
    yc_id INTEGER,
    yc_name TEXT,                          -- "Airbnb"
    yc_slug TEXT,                          -- "airbnb"
    yc_batch TEXT,                         -- "W09"
    yc_status TEXT,                        -- "Public", "Active", "Inactive", "Acquired"
    yc_logo_url TEXT,
    yc_website TEXT,
    yc_long_description TEXT,
    yc_team_size INTEGER,
    yc_industry TEXT,
    yc_subindustry TEXT,
    yc_tags TEXT[],
    yc_location TEXT,
    yc_launched_at TIMESTAMP,
    yc_is_top_company BOOLEAN DEFAULT false,
    
    -- Computed outcome
    source_outcome TEXT,                   -- 'unicorn', 'acquired', 'dead', 'active'
    
    -- User submissions
    submitter_twitter TEXT,
    
    -- Pool management
    is_in_active_pool BOOLEAN DEFAULT false,
    pool_added_at TIMESTAMP,
    
    -- Voting stats
    ship_count INTEGER DEFAULT 0,
    skip_count INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    ship_percentage FLOAT DEFAULT 0,
    
    -- Battle stats
    battle_wins INTEGER DEFAULT 0,
    battle_losses INTEGER DEFAULT 0,
    
    -- Management
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ideas_active_pool ON ideas(is_in_active_pool) 
    WHERE is_in_active_pool = true;
CREATE INDEX idx_ideas_outcome ON ideas(source_outcome);
CREATE INDEX idx_ideas_source ON ideas(source);
CREATE INDEX idx_ideas_slug ON ideas(slug);
```

### Votes Table

```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES ideas(id),
    session_id TEXT NOT NULL,
    player_id UUID REFERENCES players(id),
    vote TEXT NOT NULL,                    -- 'ship' | 'skip'
    idea_outcome TEXT,                     -- Snapshot of outcome at vote time
    is_correct BOOLEAN,                    -- Was prediction correct?
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(idea_id, session_id)
);

CREATE INDEX idx_votes_session ON votes(session_id);
CREATE INDEX idx_votes_player ON votes(player_id);
```

### Battles Table

```sql
CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    player_id UUID REFERENCES players(id),
    left_idea_id UUID REFERENCES ideas(id),
    right_idea_id UUID REFERENCES ideas(id),
    correct_answer TEXT NOT NULL,          -- 'left' | 'right'
    user_answer TEXT,                      -- 'left' | 'right'
    is_correct BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Players Table

```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twitter_handle TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    
    -- Vote stats
    total_votes INTEGER DEFAULT 0,
    ship_votes INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    resolved_votes INTEGER DEFAULT 0,      -- Votes on companies with known outcomes
    oracle_score FLOAT,                    -- Prediction accuracy %
    
    -- Battle stats
    battle_total INTEGER DEFAULT 0,
    battle_correct INTEGER DEFAULT 0,
    battle_streak INTEGER DEFAULT 0,
    battle_best_streak INTEGER DEFAULT 0,
    
    -- Streaks
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_vote_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 11. Pages & Routes

| Route | Page | Dynamic? |
|-------|------|----------|
| `/` | Landing page | No |
| `/vote` | Main voting game | No |
| `/battle` | Battle mode | No |
| `/leaderboard` | Leaderboards (tabbed) | No |
| `/company/[slug]` | Company deep dive | **Yes** |
| `/pitch/[slug]` | User submission page | **Yes** |
| `/submit` | Submit your idea | No |
| `/stats` | Your stats + Oracle Score | No |
| `/achievements` | Achievement gallery | No |

---

## 12. API Routes

```
# Voting
GET  /api/ideas/next         → Next idea from active pool
POST /api/ideas/vote         → Submit vote, return reveal data

# Battles
GET  /api/battle/next        → Get battle matchup
POST /api/battle/vote        → Submit battle answer

# Company data
GET  /api/company/[slug]     → Full company data

# User submissions
POST /api/ideas/submit       → Submit new idea
GET  /api/pitch/[slug]       → Get pitch page data

# Stats
GET  /api/stats              → User stats + Oracle Score
GET  /api/leaderboard        → Leaderboard data

# Achievements
GET  /api/achievements       → User achievements + progress
```

---

## 13. YC Data Import

### Source

```
https://yc-oss.github.io/api/companies/all.json
```

### Import Script

```javascript
// scripts/import-yc-data.ts

const YC_API = 'https://yc-oss.github.io/api/companies/all.json';

async function importYCCompanies() {
    console.log('Fetching YC companies...');
    const response = await fetch(YC_API);
    const companies = await response.json();
    
    console.log(`Found ${companies.length} companies`);
    
    const ideas = companies
        .filter(c => c.one_liner && c.one_liner.length >= 10)
        .map(company => ({
            slug: slugify(`${company.one_liner}-${company.slug}`),
            hero: truncate(company.one_liner, 60),
            subtitle: truncate(company.long_description, 100),
            source: 'yc',
            yc_id: company.id,
            yc_name: company.name,
            yc_slug: company.slug,
            yc_batch: company.batch,
            yc_status: company.status,
            yc_logo_url: company.small_logo_thumb_url,
            yc_website: company.website,
            yc_long_description: company.long_description,
            yc_team_size: company.team_size,
            yc_industry: company.industry,
            yc_subindustry: company.subindustry,
            yc_tags: company.tags,
            yc_location: company.all_locations,
            yc_launched_at: company.launched_at 
                ? new Date(company.launched_at * 1000) 
                : null,
            yc_is_top_company: company.top_company,
            source_outcome: getOutcome(company),
            is_in_active_pool: false  // Will be set separately
        }));
    
    // Insert all
    const { error } = await supabase.from('ideas').insert(ideas);
    
    if (error) {
        console.error('Import error:', error);
    } else {
        console.log(`Imported ${ideas.length} companies`);
    }
    
    // Set initial active pool
    await setInitialPool();
}

function getOutcome(company) {
    if (company.top_company) return 'unicorn';
    if (company.status === 'Public') return 'unicorn';
    if (company.status === 'Acquired') return 'acquired';
    if (company.status === 'Inactive') return 'dead';
    return 'active';
}

async function setInitialPool() {
    // Mark 200 companies as active
    
    // 50 unicorns
    await supabase.rpc('add_to_pool', { 
        outcome: 'unicorn', 
        count: 50 
    });
    
    // 50 dead
    await supabase.rpc('add_to_pool', { 
        outcome: 'dead', 
        count: 50 
    });
    
    // 30 acquired
    await supabase.rpc('add_to_pool', { 
        outcome: 'acquired', 
        count: 30 
    });
    
    // 50 active
    await supabase.rpc('add_to_pool', { 
        outcome: 'active', 
        count: 50 
    });
    
    console.log('Initial pool of 200 set');
}
```

---

## 14. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | None (Twitter handle only) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Sounds | Local MP3 files |
| Confetti | canvas-confetti |

---

## 15. File Structure

```
ship-or-skip/
├── app/
│   ├── page.tsx                        # Landing
│   ├── vote/page.tsx                   # Voting game
│   ├── battle/page.tsx                 # Battle mode
│   ├── leaderboard/page.tsx            # Leaderboards
│   ├── company/[slug]/page.tsx         # Company deep dive (DYNAMIC)
│   ├── pitch/[slug]/page.tsx           # User pitch page (DYNAMIC)
│   ├── submit/page.tsx                 # Submit idea
│   ├── stats/page.tsx                  # User stats
│   ├── achievements/page.tsx           # Achievement gallery
│   ├── api/
│   │   ├── ideas/
│   │   │   ├── next/route.ts
│   │   │   ├── vote/route.ts
│   │   │   └── submit/route.ts
│   │   ├── battle/
│   │   │   ├── next/route.ts
│   │   │   └── vote/route.ts
│   │   ├── company/[slug]/route.ts
│   │   ├── leaderboard/route.ts
│   │   ├── stats/route.ts
│   │   └── achievements/route.ts
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── voting/
│   │   ├── idea-card.tsx
│   │   ├── vote-buttons.tsx
│   │   ├── reveal-overlay.tsx
│   │   └── outcome-badge.tsx
│   ├── battle/
│   │   ├── battle-card.tsx
│   │   ├── battle-versus.tsx
│   │   └── battle-result.tsx
│   ├── company/
│   │   ├── company-header.tsx
│   │   ├── company-stats.tsx
│   │   ├── vote-stats-card.tsx
│   │   ├── insight-card.tsx
│   │   └── similar-companies.tsx
│   ├── achievements/
│   │   ├── achievement-unlock-modal.tsx
│   │   ├── achievement-badge.tsx
│   │   └── achievement-gallery.tsx
│   ├── leaderboard/
│   │   ├── leaderboard-tabs.tsx
│   │   └── leaderboard-card.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── progress-bar.tsx
│
├── lib/
│   ├── db.ts                           # Supabase client
│   ├── pool.ts                         # Active pool logic
│   ├── scoring.ts                      # Oracle score calculation
│   ├── insights.ts                     # Dynamic insight copy
│   ├── achievements.ts                 # Achievement checking
│   └── utils.ts
│
├── scripts/
│   └── import-yc-data.ts               # One-time import
│
├── public/
│   └── sounds/
│       ├── achievement-common.mp3
│       ├── achievement-uncommon.mp3
│       ├── achievement-rare.mp3
│       ├── achievement-epic.mp3
│       └── achievement-legendary.mp3
│
└── types/
    └── index.ts
```

---

## 16. MVP Scope

### Must Have (Launch Blockers)

- [ ] Landing page with hook stat
- [ ] Core voting flow with reveal
- [ ] YC data imported (5,500 companies)
- [ ] Active pool system (200 companies)
- [ ] Outcome badges (🦄 💀 💰 ✅)
- [ ] Dynamic insight copy on reveal
- [ ] Company deep dive page (`/company/[slug]`)
- [ ] Oracle Score calculation
- [ ] Basic leaderboard (Biggest Misses)
- [ ] User idea submission
- [ ] Personal pitch pages (`/pitch/[slug]`)
- [ ] Session tracking
- [ ] Mobile responsive
- [ ] Deploy to Vercel

### Should Have

- [ ] Battle mode
- [ ] Full achievement system with animations
- [ ] Multiple leaderboard tabs
- [ ] Similar companies on deep dive
- [ ] Share cards with OG images
- [ ] Streak tracking

### Won't Have (Post-Launch)

- [ ] User accounts / OAuth
- [ ] Comments
- [ ] Collections / themed rounds
- [ ] Admin dashboard
- [ ] Pool expansion automation

---

## 17. Launch Strategy

### Domain

`shiporskip.io`

### Launch Tweet

```
I built Ship or Skip in 48 hours.

We analyzed 5,500 YC companies. Can you predict which became unicorns?

The twist: 67% of people would have SKIPPED Airbnb's pitch.

What's your Oracle Score? → shiporskip.io
```

### Viral Hooks

1. **"I would have skipped Airbnb"** — Shame/surprise moment
2. **Oracle Score** — Shareable prediction accuracy
3. **Battle Mode** — "I got 15 in a row"
4. **Pitch Pages** — Founders share for validation
5. **Deep Dives** — Educational content people share

---

## 18. Success Metrics

| Metric | Target (Week 1) |
|--------|-----------------|
| Total votes | 10,000+ |
| Unique visitors | 2,000+ |
| Avg votes per session | 15+ |
| Company pages viewed | 1,000+ |
| Ideas submitted | 100+ |
| Twitter shares | 200+ |
| Return visitors (D1) | 20% |

---

## 19. Summary

Ship or Skip is now a **data-driven startup prediction game** with real outcomes, educational content, and viral sharing mechanics.

**The transformation:**

| Before | After |
|--------|-------|
| Empty voting game | 5,500 real companies |
| No right/wrong | Oracle Score tracking |
| No educational value | Deep dive pages |
| Votes spread thin | Controlled 200-company pool |
| Meaningless leaderboard | "Biggest Misses" + "Biggest Fools" |
| Ambiguous concept | "Predict startup success" |

**The pitch that wins:**

> "67% would have skipped Airbnb. Can you spot a unicorn from just a pitch? Test your Oracle Score."
