# Ship or Skip: Explore & Validate PRD

## The Transformation

**From:** Entertainment (game)  
**To:** Utility (tool) + Entertainment (game)

---

## New Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 SHIP OR SKIP        [Explore] [Validate] [Play] [Submit]│
└─────────────────────────────────────────────────────────────┘
```

### Game Sub-Header (Only on `/play`)

```
┌─────────────────────────────────────────────────────────────┐
│  🔥 12 streak │ 🔮 73% Oracle │ 🏆 14/47 │ [⚔️ Battle]      │
└─────────────────────────────────────────────────────────────┘
```

Keeps game stats out of Explore/Validate for clean experience.

---

## Tab 1: Explore

### Purpose

Search and filter 5,500+ YC companies.

### Route

`/explore`

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 SHIP OR SKIP        [Explore] [Validate] [Play] [Submit]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EXPLORE 5,500+ YC STARTUPS                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search companies, pitches...                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Outcome ▼] [Industry ▼] [Batch ▼] [Sort ▼]               │
│                                                             │
│  📊 5,571 companies │ 🦄 127 unicorns │ 💀 1,247 dead      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🦄  AIRBNB                                   W09    │   │
│  │     "Book accommodations around the world"          │   │
│  │     Consumer • 6,132 employees                      │   │
│  │     🚀 34% Ship  💀 66% Skip  •  2.8k votes        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💀  JUICERO                                  W14    │   │
│  │     "Fresh juice at the press of a button"          │   │
│  │     Consumer • Hardware                             │   │
│  │     🚀 71% Ship  💀 29% Skip  •  3.1k votes        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ... infinite scroll ...                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Search

Simple ILIKE on `hero` and `yc_name`:

```javascript
const { data } = await supabase
    .from('ideas')
    .select('*')
    .or(`hero.ilike.%${query}%,yc_name.ilike.%${query}%`)
    .limit(20);
```

### Filters

**Outcome:**
- All
- 🦄 Unicorns
- 💰 Acquired  
- 💀 Dead
- ✅ Active

**Industry:**
- All
- B2B
- Consumer
- Fintech
- Healthcare
- (populated from data)

**Batch:**
- All
- 2024, 2023, 2022... 2005

**Sort:**
- Newest
- Team size
- Most votes

### Stats Bar

Updates with current filter:

```
📊 312 companies │ 🦄 23 (7%) │ 💀 89 (29%)
```

---

## Tab 2: Validate

### Purpose

Paste your pitch → See similar YC companies → See category stats.

### Route

`/validate`

### Initial State

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 SHIP OR SKIP        [Explore] [Validate] [Play] [Submit]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│               VALIDATE YOUR STARTUP PITCH                   │
│                                                             │
│         See how your idea compares to 5,500 YC companies    │
│                                                             │
│         ┌───────────────────────────────────────────┐      │
│         │ Enter your one-liner pitch...             │      │
│         └───────────────────────────────────────────┘      │
│                                                             │
│                    [Analyze My Pitch]                       │
│                                                             │
│         Examples:                                           │
│         • "Uber for dog walking"                            │
│         • "AI-powered customer support"                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Results State

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 SHIP OR SKIP        [Explore] [Validate] [Play] [Submit]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  YOUR PITCH                                        [Edit]   │
│  "AI that automatically responds to support tickets"        │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  🔍 SIMILAR YC COMPANIES (7 found)                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🦄  INTERCOM (S11)                                  │   │
│  │     "Customer messaging platform"                   │   │
│  │     Similarity: 84%                    [View →]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅  ADA (W16)                                       │   │
│  │     "AI-powered customer service automation"        │   │
│  │     Similarity: 91%                    [View →]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💀  ASSIST (S15)                                    │   │
│  │     "AI assistant for customer support"             │   │
│  │     Similarity: 87%                    [View →]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  📊 CATEGORY STATS                                          │
│                                                             │
│  Similar companies in YC: 23                                │
│                                                             │
│  🦄 13% │ 💰 17% │ 💀 35% │ ✅ 35%                         │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│                                                             │
│  [Submit for Crowd Voting]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Similarity Algorithm

Simple keyword matching:

```javascript
function findSimilarCompanies(userPitch, allCompanies) {
    const userTokens = tokenize(userPitch);
    
    const scored = allCompanies.map(company => {
        const companyTokens = tokenize(company.hero);
        const matches = userTokens.filter(t => companyTokens.includes(t));
        const score = matches.length / userTokens.length;
        return { company, score };
    });
    
    return scored
        .filter(s => s.score > 0.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

function tokenize(text) {
    const STOP_WORDS = ['the', 'for', 'and', 'that', 'with', 'your', 'a', 'an', 'to', 'of'];
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2)
        .filter(word => !STOP_WORDS.includes(word));
}
```

### Category Stats

Count outcomes for similar companies:

```javascript
function getCategoryStats(similarCompanies) {
    const total = similarCompanies.length;
    return {
        total,
        unicorn_pct: Math.round(similarCompanies.filter(c => c.source_outcome === 'unicorn').length / total * 100),
        acquired_pct: Math.round(similarCompanies.filter(c => c.source_outcome === 'acquired').length / total * 100),
        dead_pct: Math.round(similarCompanies.filter(c => c.source_outcome === 'dead').length / total * 100),
        active_pct: Math.round(similarCompanies.filter(c => c.source_outcome === 'active').length / total * 100),
    };
}
```

---

## Tab 3: Play

### Route

`/play`

### Sub-Header

Only visible on Play:

```
┌─────────────────────────────────────────────────────────────┐
│  🔥 12 streak │ 🔮 73% Oracle │ 🏆 14/47 │ [⚔️ Battle]      │
└─────────────────────────────────────────────────────────────┘
```

```typescript
function GameSubHeader({ streak, oracleScore, achievements, onBattleToggle }) {
    return (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b">
            <div className="flex items-center gap-6">
                <span>🔥 {streak} streak</span>
                <span>🔮 {oracleScore ?? '—'}% Oracle</span>
                <span>🏆 {achievements.unlocked}/{achievements.total}</span>
            </div>
            <button onClick={onBattleToggle}>⚔️ Battle</button>
        </div>
    );
}
```

---

## API Routes

```
GET /api/explore?search=&outcome=&industry=&batch=&sort=&page=
    → { companies: [], total: number, stats: {} }

POST /api/validate
    Body: { pitch: string }
    → { similar_companies: [], category_stats: {} }
```

---

## File Structure

```
app/
├── explore/page.tsx
├── validate/page.tsx
├── play/page.tsx
├── api/
│   ├── explore/route.ts
│   └── validate/route.ts

components/
├── layout/
│   ├── main-header.tsx
│   └── game-sub-header.tsx
├── explore/
│   ├── search-bar.tsx
│   ├── filter-bar.tsx
│   ├── company-card.tsx
│   └── stats-bar.tsx
├── validate/
│   ├── pitch-input.tsx
│   ├── similar-companies.tsx
│   └── category-stats.tsx
```

---

## Implementation

### Day 1: Explore

1. `/explore` route
2. Search bar
3. Filter bar (4 dropdowns)
4. Company card list
5. Stats bar
6. Infinite scroll

### Day 2: Validate

1. `/validate` route
2. Pitch input
3. Similarity matching
4. Similar companies list
5. Category stats display
6. Submit CTA

### Day 3: Navigation

1. Main header with tabs
2. Move game to `/play`
3. Game sub-header (conditional)
4. Update links

---

## Summary

| Tab | What | Value |
|-----|------|-------|
| **Explore** | Search + filter companies | Find who's in your space |
| **Validate** | Compare pitch to history | See who tried this before |
| **Play** | Prediction game | Viral hook |

Game drives acquisition. Tools drive retention.
