# Ship or Skip: Engagement Features PRD

## Overview

This document specifies engagement features to add to Ship or Skip. These features are designed to increase session length, daily return rate, and shareability.

| Feature | Purpose | Effort | Priority |
|---------|---------|--------|----------|
| **Achievements** | Instant gratification + progression | Medium | **#1 — BUILD FIRST** |
| Streaks | Daily retention | Low | #2 |
| Personal Stats/DNA | Shareability + self-discovery | Low-Medium | #3 |
| Head-to-Head Battles | New game mode + engagement | Medium | #4 |

---

# Feature 0: Achievements (BUILD FIRST)

## 0.1 Philosophy

**ACHIEVEMENTS MUST BE MASSIVELY SATISFYING.**

Every achievement unlock should feel like winning. The user should think "holy shit that was cool" and immediately want to earn the next one.

**Key principles:**
- Unlock achievements FAST (first one within 30 seconds)
- Animation should be DRAMATIC (screen takeover, not subtle toast)
- Sound should be POWERFUL (satisfying audio feedback)
- Progression should be VISIBLE (always show next achievement)
- Sharing should be EFFORTLESS (one tap to tweet)

## 0.2 Achievement Categories

### Voting Milestones
Rewarded for total votes cast.

| Votes | Achievement | Title | Icon | Rarity |
|-------|-------------|-------|------|--------|
| 1 | First Blood | "Cast your first vote" | 🗳️ | Common |
| 5 | Getting Started | "You're warming up" | 🌱 | Common |
| 10 | Double Digits | "Now we're talking" | 🔟 | Common |
| 25 | Quarter Century | "25 ideas judged" | 🎯 | Uncommon |
| 50 | Half Century | "50 ideas judged" | ⚡ | Uncommon |
| 100 | Centurion | "100 ideas judged" | 💯 | Rare |
| 250 | Veteran | "250 ideas judged" | 🎖️ | Rare |
| 500 | Elite Judge | "500 ideas judged" | 👑 | Epic |
| 1000 | Legendary | "1000 ideas judged" | 🏆 | Legendary |

### Ship/Skip Behavior
Rewarded for voting patterns.

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| 5 Ships in a row | Optimist | "5 ships in a row" | 🚀 | Common |
| 10 Ships in a row | Super Optimist | "10 ships in a row" | 🌟 | Uncommon |
| 5 Skips in a row | Skeptic | "5 skips in a row" | 🧐 | Common |
| 10 Skips in a row | Grim Reaper | "10 skips in a row" | 💀 | Uncommon |
| 50% exactly on 20+ votes | Perfectly Balanced | "Thanos would be proud" | ⚖️ | Rare |
| 80%+ ship rate (50+ votes) | Eternal Optimist | "You believe in everything" | ☀️ | Rare |
| 80%+ skip rate (50+ votes) | Dream Crusher | "Nothing gets past you" | 🔨 | Rare |

### Crowd Alignment
Rewarded for matching (or not matching) the crowd.

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| First crowd match | Hivemind | "You agreed with the crowd" | 🐝 | Common |
| 5 crowd matches in a row | Conformist | "Great minds think alike" | 🤝 | Uncommon |
| 10 crowd matches in a row | Mind Reader | "You ARE the crowd" | 🧠 | Rare |
| First crowd disagree | Free Thinker | "You went against the grain" | 🌊 | Common |
| 5 disagrees in a row | Contrarian | "Against all odds" | ⚔️ | Uncommon |
| 10 disagrees in a row | Lone Wolf | "You stand alone" | 🐺 | Rare |

### Discovery Achievements
Rewarded for finding special content.

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| Vote on a unicorn (YC) | Unicorn Hunter | "You judged a $1B+ company" | 🦄 | Uncommon |
| Vote on 5 unicorns | Unicorn Collector | "5 unicorns judged" | 🦄 | Rare |
| Vote on a dead startup | Gravedigger | "You found one that didn't make it" | ⚰️ | Common |
| Ship a dead startup | Fooled | "You shipped a failure" | 🤡 | Uncommon |
| Skip a unicorn | Missed Opportunity | "You passed on a unicorn" | 😬 | Uncommon |
| Ship a unicorn | Visionary | "You would have backed a winner" | 👁️ | Uncommon |
| Ship 5 unicorns | Oracle | "5 unicorns you believed in" | 🔮 | Epic |

### Submission Achievements
Rewarded for submitting ideas.

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| Submit first idea | Founder | "You pitched your first idea" | 💡 | Common |
| Idea gets 10 votes | Getting Traction | "10 people judged your idea" | 📈 | Common |
| Idea gets 50 votes | Trending | "50 people judged your idea" | 🔥 | Uncommon |
| Idea gets 100 votes | Viral Pitch | "100 people judged your idea" | 💥 | Rare |
| Idea gets 500 votes | Famous | "500 people judged your idea" | ⭐ | Epic |
| Idea gets 70%+ ship rate | Crowd Favorite | "The people love it" | ❤️ | Rare |
| Idea gets 30%- ship rate | Tough Crowd | "Not everyone's a believer" | 💔 | Uncommon |

### Streak Achievements
Rewarded for maintaining streaks.

| Streak | Achievement | Title | Icon | Rarity |
|--------|-------------|-------|------|--------|
| 3 days | On Fire | "3 day streak" | 🔥 | Common |
| 7 days | Week Warrior | "7 day streak" | 🔥 | Uncommon |
| 14 days | Fortnight | "14 day streak" | 🔥 | Rare |
| 30 days | Monthly Master | "30 day streak" | 🏅 | Epic |
| 50 days | Unstoppable | "50 day streak" | 💎 | Epic |
| 100 days | Legendary Streak | "100 day streak" | 👑 | Legendary |

### Battle Achievements
Rewarded for head-to-head battles.

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| First battle | Challenger | "First head-to-head battle" | ⚔️ | Common |
| 10 battles | Gladiator | "10 battles fought" | 🗡️ | Uncommon |
| 50 battles | Warlord | "50 battles fought" | 🛡️ | Rare |
| 5 crowd agrees in battles | Battle Sage | "5 battle agreements" | 🎯 | Uncommon |
| Pick the #1 ranked idea | Top Picker | "You picked the best" | 🥇 | Rare |

### Secret Achievements
Hidden until unlocked (surprise factor).

| Condition | Achievement | Title | Icon | Rarity |
|-----------|-------------|-------|------|--------|
| Vote at 3 AM | Night Owl | "Voting at 3 AM" | 🦉 | Rare |
| Vote on first day of month | Fresh Start | "New month, new votes" | 📅 | Uncommon |
| 69% ship rate exactly | Nice | "Nice." | 😏 | Rare |
| Vote 100 times in one session | Marathon | "100 votes in one session" | 🏃 | Epic |
| First vote ever on the platform | Pioneer | "Among the first" | 🚩 | Legendary |

## 0.3 Achievement Unlock Experience

### THE MOMENT OF UNLOCK

**This is the most important part. The unlock must feel INCREDIBLE.**

**Sequence (1.5-2 seconds total):**

```
1. Screen dims slightly (100ms)
       ↓
2. Achievement badge BURSTS onto center of screen (200ms)
   - Starts at 150% scale
   - Bounces down to 100%
   - Gold particles explode outward
       ↓
3. Icon pulses with glow effect (300ms)
       ↓
4. Title text fades in below icon (200ms)
   - "ACHIEVEMENT UNLOCKED"
   - Achievement name in large text
       ↓
5. Sound effect plays
   - Satisfying "DING" + whoosh
   - Layered: chime + bass hit + sparkle
       ↓
6. Confetti bursts from edges (500ms)
   - Colors match achievement rarity
       ↓
7. Buttons fade in (200ms)
   - [Share] [Continue]
       ↓
8. If not interacted, auto-dismiss after 3s
   - Badge slides to corner showing "NEW"
```

### Visual Design

**Achievement Card (center screen takeover):**

```
┌─────────────────────────────────────────┐
│                                         │
│          ✨ ACHIEVEMENT UNLOCKED ✨      │
│                                         │
│                 🦄                       │
│              (large)                    │
│                                         │
│           UNICORN HUNTER                │
│                                         │
│      "You judged a $1B+ company"        │
│                                         │
│   ┌─────────────┐  ┌─────────────┐     │
│   │   SHARE     │  │  CONTINUE   │     │
│   └─────────────┘  └─────────────┘     │
│                                         │
└─────────────────────────────────────────┘

[Confetti particles everywhere]
[Screen has slight dark overlay]
[Card has glowing border animation]
```

### Rarity Tiers (Visual Distinction)

| Tier | Color | Border | Particle Effect | Sound |
|------|-------|--------|-----------------|-------|
| Common | Bronze (#CD7F32) | Solid bronze | Small sparkles | Simple chime |
| Uncommon | Silver (#C0C0C0) | Solid silver | Medium sparkles | Chime + whoosh |
| Rare | Gold (#FFD700) | Glowing gold | Gold explosion | Full fanfare |
| Epic | Purple (#8B5CF6) | Pulsing purple | Purple lightning | Epic fanfare |
| Legendary | Rainbow gradient | Animated rainbow | Full fireworks | Orchestral hit |

## 0.4 Sound Design

**CRITICAL: Sound makes or breaks the dopamine hit.**

Each achievement tier has distinct audio:

**Common Achievement:**
```
- Quick "ding" (high pitch)
- Duration: 0.5s
- Vibe: Satisfying but not overwhelming
```

**Uncommon Achievement:**
```
- "Ding" + rising whoosh
- Duration: 0.8s
- Vibe: Slightly more exciting
```

**Rare Achievement:**
```
- Fanfare chord (major)
- Shimmer/sparkle overlay
- Duration: 1.2s
- Vibe: "You did something cool"
```

**Epic Achievement:**
```
- Full fanfare
- Bass drop undertone
- Duration: 1.5s
- Vibe: "Holy shit"
```

**Legendary Achievement:**
```
- Orchestral swell
- Multiple chime layers
- Reverb tail
- Duration: 2s
- Vibe: "Legendary moment"
```

**Sound files needed:**
```
/public/sounds/
├── achievement-common.mp3
├── achievement-uncommon.mp3
├── achievement-rare.mp3
├── achievement-epic.mp3
├── achievement-legendary.mp3
└── achievement-secret.mp3    (special "mystery" sound)
```

## 0.5 Progress Indicators

Users should ALWAYS see what's coming next.

### Progress Bar (shown after each vote)

```
┌─────────────────────────────────────┐
│ Next: CENTURION 💯                  │
│ ████████████████░░░░ 82/100 votes   │
└─────────────────────────────────────┘
```

### Achievement Preview

When close to unlocking (90%+), show teaser:

```
┌─────────────────────────────────────┐
│ 🔓 ALMOST UNLOCKED                  │
│                                     │
│ 💯 Centurion                        │
│ "100 ideas judged"                  │
│                                     │
│ Just 3 more votes!                  │
└─────────────────────────────────────┘
```

### Achievement Gallery

Dedicated page showing all achievements:

```
┌─────────────────────────────────────────────────────────┐
│  YOUR ACHIEVEMENTS                     12/47 unlocked   │
│                                                         │
│  VOTING                                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ 🗳️  │ │ 🌱  │ │ 🔟  │ │ 🎯  │ │ 🔒  │              │
│  │ ✓   │ │ ✓   │ │ ✓   │ │ ✓   │ │     │              │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘              │
│                                                         │
│  DISCOVERY                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│  │ 🦄  │ │ 🔒  │ │ ⚰️  │ │ 🔒  │ │ 🔒  │              │
│  │ ✓   │ │     │ │ ✓   │ │     │ │     │              │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘              │
│                                                         │
│  SECRET                                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐                              │
│  │ ❓  │ │ ❓  │ │ ❓  │   3 secret achievements       │
│  │     │ │     │ │     │   remain undiscovered        │
│  └─────┘ └─────┘ └─────┘                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 0.6 Data Model

### Achievements Definition Table

```sql
CREATE TABLE achievement_definitions (
    id TEXT PRIMARY KEY,              -- e.g., "votes_100"
    name TEXT NOT NULL,               -- "Centurion"
    description TEXT NOT NULL,        -- "100 ideas judged"
    icon TEXT NOT NULL,               -- "💯"
    category TEXT NOT NULL,           -- "voting", "discovery", "streak", etc.
    rarity TEXT NOT NULL,             -- "common", "uncommon", "rare", "epic", "legendary"
    is_secret BOOLEAN DEFAULT false,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Player Achievements Table

```sql
CREATE TABLE player_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    session_id TEXT,                  -- For anonymous users
    achievement_id TEXT REFERENCES achievement_definitions(id),
    unlocked_at TIMESTAMP DEFAULT NOW(),
    shared BOOLEAN DEFAULT false,
    UNIQUE(player_id, achievement_id),
    UNIQUE(session_id, achievement_id)
);

CREATE INDEX idx_player_achievements_player ON player_achievements(player_id);
CREATE INDEX idx_player_achievements_session ON player_achievements(session_id);
```

### Achievement Progress Table

```sql
CREATE TABLE achievement_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    session_id TEXT,
    
    -- Voting progress
    total_votes INTEGER DEFAULT 0,
    ships_in_a_row INTEGER DEFAULT 0,
    skips_in_a_row INTEGER DEFAULT 0,
    max_ships_in_a_row INTEGER DEFAULT 0,
    max_skips_in_a_row INTEGER DEFAULT 0,
    
    -- Crowd progress
    crowd_agrees_in_a_row INTEGER DEFAULT 0,
    crowd_disagrees_in_a_row INTEGER DEFAULT 0,
    
    -- Discovery progress
    unicorns_voted INTEGER DEFAULT 0,
    unicorns_shipped INTEGER DEFAULT 0,
    unicorns_skipped INTEGER DEFAULT 0,
    dead_startups_voted INTEGER DEFAULT 0,
    dead_startups_shipped INTEGER DEFAULT 0,
    
    -- Session progress
    votes_this_session INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(player_id),
    UNIQUE(session_id)
);
```

## 0.7 Achievement Check Logic

```javascript
// Called after every vote
async function checkAchievements(userId, voteData) {
    const progress = await getProgress(userId);
    const newAchievements = [];
    
    // Update progress
    progress.total_votes += 1;
    progress.votes_this_session += 1;
    
    if (voteData.vote === 'ship') {
        progress.ships_in_a_row += 1;
        progress.skips_in_a_row = 0;
    } else {
        progress.skips_in_a_row += 1;
        progress.ships_in_a_row = 0;
    }
    
    if (voteData.matched_crowd) {
        progress.crowd_agrees_in_a_row += 1;
        progress.crowd_disagrees_in_a_row = 0;
    } else {
        progress.crowd_disagrees_in_a_row += 1;
        progress.crowd_agrees_in_a_row = 0;
    }
    
    if (voteData.idea_outcome === 'unicorn') {
        progress.unicorns_voted += 1;
        if (voteData.vote === 'ship') {
            progress.unicorns_shipped += 1;
        } else {
            progress.unicorns_skipped += 1;
        }
    }
    
    // Check voting milestones
    const voteMilestones = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
    for (const milestone of voteMilestones) {
        if (progress.total_votes === milestone) {
            newAchievements.push(`votes_${milestone}`);
        }
    }
    
    // Check streak achievements
    if (progress.ships_in_a_row === 5) newAchievements.push('ships_5_row');
    if (progress.ships_in_a_row === 10) newAchievements.push('ships_10_row');
    if (progress.skips_in_a_row === 5) newAchievements.push('skips_5_row');
    if (progress.skips_in_a_row === 10) newAchievements.push('skips_10_row');
    
    // Check crowd achievements
    if (progress.crowd_agrees_in_a_row === 1) newAchievements.push('crowd_first_agree');
    if (progress.crowd_agrees_in_a_row === 5) newAchievements.push('crowd_agree_5');
    if (progress.crowd_agrees_in_a_row === 10) newAchievements.push('crowd_agree_10');
    if (progress.crowd_disagrees_in_a_row === 1) newAchievements.push('crowd_first_disagree');
    if (progress.crowd_disagrees_in_a_row === 5) newAchievements.push('crowd_disagree_5');
    if (progress.crowd_disagrees_in_a_row === 10) newAchievements.push('crowd_disagree_10');
    
    // Check discovery achievements
    if (progress.unicorns_voted === 1) newAchievements.push('unicorn_first');
    if (progress.unicorns_voted === 5) newAchievements.push('unicorn_5');
    if (progress.unicorns_shipped === 1) newAchievements.push('unicorn_shipped');
    if (progress.unicorns_shipped === 5) newAchievements.push('unicorn_shipped_5');
    if (progress.unicorns_skipped === 1) newAchievements.push('unicorn_skipped');
    
    // Check secret achievements
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 4 && !hasAchievement(userId, 'night_owl')) {
        newAchievements.push('night_owl');
    }
    
    if (progress.votes_this_session === 100) {
        newAchievements.push('marathon');
    }
    
    // Save progress
    await saveProgress(progress);
    
    // Unlock new achievements
    const unlockedAchievements = [];
    for (const achievementId of newAchievements) {
        if (!await hasAchievement(userId, achievementId)) {
            await unlockAchievement(userId, achievementId);
            const achievement = await getAchievementDefinition(achievementId);
            unlockedAchievements.push(achievement);
        }
    }
    
    return unlockedAchievements;
}
```

## 0.8 UI Components

### AchievementUnlockModal

The big moment. Full-screen takeover.

```typescript
interface AchievementUnlockModalProps {
    achievement: {
        id: string;
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    };
    onClose: () => void;
    onShare: () => void;
}
```

**Animation keyframes:**

```css
@keyframes achievement-burst {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
    }
    70% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes icon-pulse {
    0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 10px gold);
    }
    50% {
        transform: scale(1.1);
        filter: drop-shadow(0 0 20px gold);
    }
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes glow-border {
    0%, 100% {
        box-shadow: 0 0 20px var(--rarity-color);
    }
    50% {
        box-shadow: 0 0 40px var(--rarity-color), 0 0 60px var(--rarity-color);
    }
}
```

### AchievementProgressBar

Shows progress to next achievement.

```
┌─────────────────────────────────────┐
│ 💯 Centurion                        │
│ ████████████████░░░░ 82/100         │
└─────────────────────────────────────┘
```

### AchievementGallery

Grid of all achievements (locked and unlocked).

### AchievementBadge

Small badge for showing on profile/leaderboard.

### AchievementShareCard

Generated image for sharing.

```
┌─────────────────────────────────────┐
│                                     │
│     🏆 ACHIEVEMENT UNLOCKED         │
│                                     │
│              🦄                      │
│                                     │
│        UNICORN HUNTER               │
│                                     │
│  "You judged a $1B+ company"        │
│                                     │
│        shiporskip.io                │
│                                     │
└─────────────────────────────────────┘
```

## 0.9 Multiple Achievements Queue

If multiple achievements unlock at once (e.g., 5th vote triggers both "Getting Started" and "5 Ships in a Row"), show them sequentially:

```javascript
const [achievementQueue, setAchievementQueue] = useState([]);
const [currentAchievement, setCurrentAchievement] = useState(null);

// When achievements unlock
function handleNewAchievements(achievements) {
    setAchievementQueue(prev => [...prev, ...achievements]);
}

// Process queue
useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
        setCurrentAchievement(achievementQueue[0]);
        setAchievementQueue(prev => prev.slice(1));
    }
}, [currentAchievement, achievementQueue]);

// On dismiss
function handleDismiss() {
    setCurrentAchievement(null);
    // Next in queue will auto-show via useEffect
}
```

## 0.10 API Endpoints

```
GET /api/achievements
    Query: ?session_id=X or ?player_id=Y
    → Returns all unlocked achievements + progress

GET /api/achievements/progress
    → Returns progress toward next achievements

GET /api/achievements/definitions
    → Returns all achievement definitions (for gallery)

POST /api/achievements/share/[id]
    → Marks achievement as shared, returns share data

GET /api/achievements/[id]/og
    → Returns dynamic OG image for achievement
```

## 0.11 Sound Files to Create/Source

Need these audio files:

| File | Duration | Vibe |
|------|----------|------|
| `achievement-common.mp3` | 0.5s | Quick satisfying ding |
| `achievement-uncommon.mp3` | 0.8s | Ding + whoosh |
| `achievement-rare.mp3` | 1.2s | Fanfare chord |
| `achievement-epic.mp3` | 1.5s | Full fanfare + bass |
| `achievement-legendary.mp3` | 2.0s | Orchestral swell |
| `achievement-secret.mp3` | 1.0s | Mystery reveal sound |

**Sources:**
- Freesound.org (free, attribution)
- Mixkit.co (free)
- Custom creation in GarageBand/Logic

## 0.12 Confetti Library

Use `canvas-confetti` for the particle effects:

```bash
npm install canvas-confetti
```

```javascript
import confetti from 'canvas-confetti';

function fireConfetti(rarity) {
    const colors = {
        common: ['#CD7F32', '#B87333'],
        uncommon: ['#C0C0C0', '#A8A8A8'],
        rare: ['#FFD700', '#FFA500'],
        epic: ['#8B5CF6', '#7C3AED'],
        legendary: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF']
    };
    
    confetti({
        particleCount: rarity === 'legendary' ? 200 : 100,
        spread: rarity === 'legendary' ? 180 : 70,
        colors: colors[rarity],
        origin: { y: 0.6 }
    });
    
    // For legendary, fire from multiple angles
    if (rarity === 'legendary') {
        setTimeout(() => {
            confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: colors[rarity] });
            confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: colors[rarity] });
        }, 200);
    }
}
```

## 0.13 Testing Checklist

Before launch, verify:

- [ ] First vote triggers "First Blood" achievement
- [ ] Modal appears with full animation
- [ ] Sound plays correctly (and can be muted)
- [ ] Confetti renders without lag
- [ ] Rarity colors/effects are distinct
- [ ] Share button generates correct image
- [ ] Progress bar updates in real-time
- [ ] Gallery shows locked/unlocked correctly
- [ ] Secret achievements stay hidden until unlocked
- [ ] Multiple achievements queue and show sequentially
- [ ] Mobile performance is smooth (60fps)
- [ ] Auto-dismiss works after 3s of no interaction

---

## Important: No User Accounts

**Ship or Skip does not have user accounts or authentication.**

Users simply enter their Twitter/X handle to play. This handle is used to:
- Fetch their avatar (via Unavatar.io)
- Display their name on leaderboards
- Track their stats and achievements
- Credit their submitted ideas

**Yes, someone could impersonate another user.** We don't care for now — it's just a game with nothing to lose. If it becomes a problem later, we can add Twitter OAuth verification.

**How identity works:**

```
User enters: @naval
    ↓
We fetch: unavatar.io/twitter/naval (avatar)
    ↓
We store: twitter_handle = "naval"
    ↓
All stats tied to that handle
    ↓
If someone else enters "naval" on another device,
they see/continue the same stats
```

**Session vs Handle:**
- Anonymous sessions track short-term activity
- Twitter handle links sessions to persistent stats
- User can play anonymously, then "claim" stats by entering handle

---

# Feature 1: Streaks

## 1.1 Overview

Users maintain a streak by voting on a minimum number of ideas each day. Streaks are displayed prominently and create daily return habits.

## 1.2 Core Mechanics

**Streak Rules:**
- Vote on **5+ ideas** in a day = streak maintained
- Miss a day = streak resets to 0
- Day resets at midnight (user's local timezone or UTC)

**Streak Display:**
```
🔥 12 day streak
```

**Streak Progress (within a day):**
```
🔥 3/5 votes today — 2 more to keep your streak
```

## 1.3 User Flows

### Active Streak User

```
User opens app
    ↓
See streak badge in header: "🔥 12"
    ↓
If not yet voted today:
    - Show progress: "Vote on 5 ideas to keep your streak"
    ↓
After 5 votes:
    - Celebration: "🔥 Streak maintained! Day 13 tomorrow"
    ↓
Continue voting (streak already safe)
```

### Streak at Risk

```
User opens app at 10 PM
    ↓
Warning banner:
┌─────────────────────────────────────┐
│ ⚠️ Your 12-day streak expires in    │
│ 2 hours! Vote on 5 ideas to save it │
│                        [Vote Now →] │
└─────────────────────────────────────┘
```

### Streak Lost

```
User returns after missing a day
    ↓
Message:
┌─────────────────────────────────────┐
│ 💔 Your 12-day streak ended         │
│                                     │
│ Start a new streak today!           │
│                        [Vote Now →] │
└─────────────────────────────────────┘
    ↓
Streak resets to 0
```

## 1.4 Streak Milestones

Special recognition at milestone streaks:

| Days | Badge | Message |
|------|-------|---------|
| 3 | 🔥 | "Getting warmed up!" |
| 7 | 🔥🔥 | "One week strong!" |
| 14 | 🔥🔥🔥 | "Two weeks! You're dedicated" |
| 30 | 🏆 | "Monthly master!" |
| 50 | 💎 | "Streak legend!" |
| 100 | 👑 | "Ship or Skip royalty!" |

Milestone achievements are shareable:

```
┌─────────────────────────────────────┐
│                                     │
│  🔥🔥🔥 14 DAY STREAK 🔥🔥🔥          │
│                                     │
│  I've voted on startup ideas for    │
│  14 days straight on Ship or Skip   │
│                                     │
│  Can you beat my streak?            │
│  shiporskip.io                      │
│                                     │
│  [Share to Twitter]                 │
│                                     │
└─────────────────────────────────────┘
```

## 1.5 Data Model

### Players Table (additions)

```sql
ALTER TABLE players ADD COLUMN current_streak INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN longest_streak INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN last_vote_date DATE;
ALTER TABLE players ADD COLUMN streak_updated_at TIMESTAMP;

CREATE INDEX idx_players_current_streak ON players(current_streak DESC);
CREATE INDEX idx_players_longest_streak ON players(longest_streak DESC);
```

### Sessions Table (additions)

```sql
ALTER TABLE sessions ADD COLUMN current_streak INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN longest_streak INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN last_vote_date DATE;
ALTER TABLE sessions ADD COLUMN votes_today INTEGER DEFAULT 0;
```

## 1.6 Streak Logic (Pseudocode)

```javascript
function updateStreak(user, voteDate) {
    const today = voteDate.toDateString();
    const lastVote = user.last_vote_date?.toDateString();
    
    // First vote ever
    if (!lastVote) {
        user.votes_today = 1;
        user.last_vote_date = voteDate;
        return;
    }
    
    // Same day - increment daily count
    if (today === lastVote) {
        user.votes_today += 1;
        
        // Check if streak threshold reached
        if (user.votes_today === 5) {
            user.current_streak += 1;
            user.longest_streak = Math.max(user.longest_streak, user.current_streak);
        }
        return;
    }
    
    // Next day - check if streak continues
    const yesterday = new Date(voteDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastVote === yesterday.toDateString()) {
        // Continuing streak, but need 5 votes today
        user.votes_today = 1;
        user.last_vote_date = voteDate;
        // Streak only increments when they hit 5 votes
    } else {
        // Streak broken - reset
        user.current_streak = 0;
        user.votes_today = 1;
        user.last_vote_date = voteDate;
    }
}
```

## 1.7 UI Components

### StreakBadge

Small badge shown in navbar and profile:

```
┌──────────┐
│ 🔥 12    │
└──────────┘
```

### StreakProgress

Shown when user hasn't completed daily votes:

```
┌─────────────────────────────────────┐
│ 🔥 Keep your streak alive!          │
│ ████████░░ 4/5 votes today          │
└─────────────────────────────────────┘
```

### StreakCelebration

Modal/toast when streak milestone hit:

```
┌─────────────────────────────────────┐
│                                     │
│         🔥🔥 7 DAY STREAK 🔥🔥        │
│                                     │
│      One week strong! Keep it up.   │
│                                     │
│  [Share]              [Keep Voting] │
│                                     │
└─────────────────────────────────────┘
```

## 1.8 API Endpoints

```
GET /api/streak
    → Returns: { current_streak, longest_streak, votes_today, votes_needed, streak_expires_at }

POST /api/streak/check
    → Called on each vote
    → Updates streak status
    → Returns: { streak_maintained, new_milestone?, current_streak }
```

---

# Feature 2: Personal Stats / DNA

## 2.1 Overview

Users get deep analytics on their voting patterns, creating a "voting personality" profile that's fun to explore and share.

## 2.2 Stats Tracked

### Core Metrics

| Stat | Description | Calculation |
|------|-------------|-------------|
| **Total Votes** | All-time votes cast | Count of votes |
| **Ship Rate** | % of ideas user ships | ship_votes / total_votes |
| **Crowd Agreement** | % matching majority | agreements / total_votes |
| **Oracle Score** | Unicorn prediction accuracy | (Requires prediction mode) |

### Pattern Analysis

| Pattern | Description | How Detected |
|---------|-------------|--------------|
| **Category Bias** | Which categories user ships/skips most | Track category per vote |
| **Optimist/Pessimist** | Ships more or less than average | Compare to global ship rate |
| **Contrarian/Conformist** | Agrees or disagrees with crowd | Crowd agreement % |
| **Batch Bias** | Prefers newer or older ideas | Track batch year per vote |

## 2.3 The DNA Profile

A shareable personality summary:

```
┌─────────────────────────────────────┐
│                                     │
│       YOUR SHIP OR SKIP DNA         │
│                                     │
│  🚀 The Optimist                    │
│  You ship 71% of ideas              │
│  (average is 54%)                   │
│                                     │
│  ───────────────────────────────    │
│                                     │
│  🤖 AI Believer                     │
│  You ship 94% of AI startups        │
│                                     │
│  🛒 Marketplace Skeptic             │
│  You skip 78% of marketplaces       │
│                                     │
│  🎯 Crowd Follower                  │
│  You agree with majority 73%        │
│                                     │
│  🔮 Oracle Score: 847               │
│  Top 12% of predictors              │
│                                     │
│  ───────────────────────────────    │
│                                     │
│  Based on 234 votes                 │
│                                     │
│  [Share Your DNA]                   │
│                                     │
└─────────────────────────────────────┘
```

## 2.4 Personality Types

Based on ship rate and crowd agreement:

| Ship Rate | Crowd Agreement | Type | Emoji |
|-----------|-----------------|------|-------|
| High (>65%) | High (>65%) | "The Cheerleader" | 📣 |
| High (>65%) | Low (<45%) | "The Contrarian Optimist" | 🎲 |
| Low (<45%) | High (>65%) | "The Careful Critic" | 🔍 |
| Low (<45%) | Low (<45%) | "The Lone Wolf" | 🐺 |
| Medium | Medium | "The Balanced Judge" | ⚖️ |
| Very High (>80%) | Any | "The Eternal Optimist" | ☀️ |
| Very Low (<25%) | Any | "The Grim Reaper" | 💀 |

## 2.5 Category Breakdown

Show ship rate by category:

```
Your Category Breakdown:

AI & ML          ████████████████░░░░ 89% ship
Fintech          ████████████░░░░░░░░ 67% ship
Dev Tools        ██████████░░░░░░░░░░ 58% ship
Consumer         ████████░░░░░░░░░░░░ 45% ship
Marketplace      ████░░░░░░░░░░░░░░░░ 22% ship
```

## 2.6 Data Model

### Player Stats Table

```sql
CREATE TABLE player_stats (
    player_id UUID REFERENCES players(id) PRIMARY KEY,
    total_votes INTEGER DEFAULT 0,
    ship_votes INTEGER DEFAULT 0,
    skip_votes INTEGER DEFAULT 0,
    crowd_agreements INTEGER DEFAULT 0,
    
    -- Category breakdowns (JSONB for flexibility)
    category_votes JSONB DEFAULT '{}',
    -- Example: {"AI": {"ship": 45, "skip": 5}, "Fintech": {"ship": 20, "skip": 15}}
    
    -- Batch year breakdowns
    batch_year_votes JSONB DEFAULT '{}',
    -- Example: {"2020": {"ship": 30, "skip": 10}, "2015": {"ship": 5, "skip": 20}}
    
    -- Computed personality (updated periodically)
    personality_type TEXT,
    personality_emoji TEXT,
    
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Session Stats Table

```sql
CREATE TABLE session_stats (
    session_id TEXT PRIMARY KEY,
    total_votes INTEGER DEFAULT 0,
    ship_votes INTEGER DEFAULT 0,
    skip_votes INTEGER DEFAULT 0,
    crowd_agreements INTEGER DEFAULT 0,
    category_votes JSONB DEFAULT '{}',
    batch_year_votes JSONB DEFAULT '{}',
    personality_type TEXT,
    personality_emoji TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 2.7 Stats Calculation Logic

```javascript
function calculatePersonality(stats) {
    const shipRate = stats.ship_votes / stats.total_votes;
    const crowdRate = stats.crowd_agreements / stats.total_votes;
    
    // Determine personality type
    if (shipRate > 0.80) {
        return { type: "The Eternal Optimist", emoji: "☀️" };
    }
    if (shipRate < 0.25) {
        return { type: "The Grim Reaper", emoji: "💀" };
    }
    if (shipRate > 0.65 && crowdRate > 0.65) {
        return { type: "The Cheerleader", emoji: "📣" };
    }
    if (shipRate > 0.65 && crowdRate < 0.45) {
        return { type: "The Contrarian Optimist", emoji: "🎲" };
    }
    if (shipRate < 0.45 && crowdRate > 0.65) {
        return { type: "The Careful Critic", emoji: "🔍" };
    }
    if (shipRate < 0.45 && crowdRate < 0.45) {
        return { type: "The Lone Wolf", emoji: "🐺" };
    }
    return { type: "The Balanced Judge", emoji: "⚖️" };
}

function getTopCategories(categoryVotes) {
    const categories = Object.entries(categoryVotes).map(([cat, votes]) => ({
        category: cat,
        shipRate: votes.ship / (votes.ship + votes.skip),
        totalVotes: votes.ship + votes.skip
    }));
    
    // Sort by most extreme (highest and lowest ship rates)
    const sorted = categories
        .filter(c => c.totalVotes >= 5) // Minimum sample size
        .sort((a, b) => Math.abs(b.shipRate - 0.5) - Math.abs(a.shipRate - 0.5));
    
    return {
        loveMost: sorted.filter(c => c.shipRate > 0.6).slice(0, 2),
        hateMost: sorted.filter(c => c.shipRate < 0.4).slice(0, 2)
    };
}
```

## 2.8 UI Components

### StatsPage

Full-page stats view at `/stats`:

```
┌─────────────────────────────────────┐
│  YOUR VOTING DNA                    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ☀️ The Eternal Optimist     │    │
│  │ You see potential everywhere│    │
│  └─────────────────────────────┘    │
│                                     │
│  OVERVIEW                           │
│  ┌─────────┬─────────┬─────────┐    │
│  │ 234     │ 71%     │ 68%     │    │
│  │ votes   │ ship    │ crowd   │    │
│  │         │ rate    │ agree   │    │
│  └─────────┴─────────┴─────────┘    │
│                                     │
│  CATEGORY BREAKDOWN                 │
│  AI & ML        ████████████ 89%    │
│  Fintech        ████████░░░░ 67%    │
│  Marketplace    ███░░░░░░░░░ 22%    │
│                                     │
│  INSIGHTS                           │
│  • You're more optimistic than 83%  │
│    of voters                        │
│  • You love AI startups             │
│  • You're skeptical of marketplaces │
│                                     │
│  [Share Your DNA]                   │
│                                     │
└─────────────────────────────────────┘
```

### ShareableDNACard

Generated image for sharing:

```
┌─────────────────────────────────────┐
│  SHIP OR SKIP DNA                   │
│                                     │
│  ☀️ The Eternal Optimist            │
│                                     │
│  🚀 71% ship rate                   │
│  🎯 68% crowd agreement             │
│  🤖 Loves AI startups               │
│                                     │
│  What's your voting personality?    │
│  shiporskip.io                      │
│                                     │
└─────────────────────────────────────┘
```

## 2.9 API Endpoints

```
GET /api/stats
    Query: ?session_id=X or ?player_id=Y
    → Returns full stats object

GET /api/stats/summary
    → Returns quick summary for display in UI

GET /api/stats/compare
    → Returns how user compares to global averages

GET /api/stats/og
    → Returns dynamically generated OG image for sharing
```

## 2.10 Minimum Votes for Stats

- **Basic stats** (ship rate, total): Available immediately
- **Personality type**: Requires 20+ votes
- **Category breakdown**: Requires 5+ votes per category to show
- **Percentile rankings**: Requires 50+ votes

Show progress toward unlocking:

```
┌─────────────────────────────────────┐
│ Vote on 12 more ideas to unlock     │
│ your full personality profile       │
│ ████████░░░░░░░░░░░░ 8/20           │
└─────────────────────────────────────┘
```

---

# Feature 3: Achievements & Emblems

## 3.1 Overview

Unlockable achievements that reward specific behaviors and milestones. Each achievement has a custom emblem (badge icon) that displays on the user's profile, creating collectibility and flex potential.

## 3.2 Achievement Categories

| Category | Description |
|----------|-------------|
| **Voting Milestones** | Total votes cast |
| **Streak Achievements** | Consecutive day streaks |
| **Accuracy & Skill** | Prediction and crowd agreement |
| **Submission Achievements** | Ideas submitted and their performance |
| **Battle Achievements** | Head-to-head battle performance |
| **Special & Rare** | Unique or time-limited achievements |

## 3.3 Achievement List

### Voting Milestones

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **First Vote** | Cast 1 vote | 🗳️ | Common |
| **Getting Started** | Cast 10 votes | 🌱 | Common |
| **Regular Voter** | Cast 50 votes | 📊 | Common |
| **Century Club** | Cast 100 votes | 💯 | Uncommon |
| **Power Voter** | Cast 250 votes | ⚡ | Uncommon |
| **Vote Machine** | Cast 500 votes | 🤖 | Rare |
| **Thousand Strong** | Cast 1,000 votes | 🏆 | Rare |
| **Legend** | Cast 5,000 votes | 👑 | Legendary |

### Streak Achievements

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **First Streak** | 3-day streak | 🔥 | Common |
| **Week Warrior** | 7-day streak | 📅 | Uncommon |
| **Fortnight Fighter** | 14-day streak | ⚔️ | Uncommon |
| **Monthly Master** | 30-day streak | 🌙 | Rare |
| **Streak Demon** | 50-day streak | 😈 | Rare |
| **Unstoppable** | 100-day streak | 💎 | Legendary |

### Accuracy & Skill

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **Crowd Pleaser** | 70%+ crowd agreement (50+ votes) | 🎯 | Uncommon |
| **Mind Reader** | 80%+ crowd agreement (100+ votes) | 🔮 | Rare |
| **The Contrarian** | <30% crowd agreement (50+ votes) | 🐺 | Uncommon |
| **Unicorn Spotter** | Correctly ship 5 actual unicorns | 🦄 | Rare |
| **Graveyard Keeper** | Correctly skip 10 dead startups | 💀 | Uncommon |
| **Perfect 10** | 10 correct predictions in a row | 🎱 | Rare |
| **Oracle** | 20 correct predictions in a row | 🏛️ | Legendary |

### Submission Achievements

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **Idea Generator** | Submit first idea | 💡 | Common |
| **Prolific Pitcher** | Submit 5 ideas | 📝 | Uncommon |
| **Idea Machine** | Submit 10 ideas | 🏭 | Rare |
| **Crowd Favorite** | Get 70%+ ship rate on an idea | ⭐ | Uncommon |
| **Viral Idea** | Get 1,000+ votes on an idea | 🚀 | Rare |
| **Top 10** | Have an idea in top 10 leaderboard | 🥇 | Rare |
| **Number One** | Have #1 idea on leaderboard | 👑 | Legendary |

### Battle Achievements

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **First Blood** | Win first battle vote | ⚔️ | Common |
| **Battle Tested** | Vote in 25 battles | 🛡️ | Uncommon |
| **Gladiator** | Vote in 100 battles | 🗡️ | Rare |
| **Battle Sage** | 75%+ crowd agreement in battles (50+ battles) | 🧙 | Rare |
| **Kingmaker** | Vote for eventual #1 ranked idea 10 times | 👑 | Legendary |

### Special & Rare

| Achievement | Requirement | Emblem | Rarity |
|-------------|-------------|--------|--------|
| **Early Adopter** | Vote in first week of launch | 🌅 | Rare |
| **Night Owl** | Vote between 2-5 AM local time | 🦉 | Uncommon |
| **Speed Demon** | Vote on 50 ideas in one session | ⚡ | Uncommon |
| **The OG** | Be among first 100 users | 🏴 | Legendary |
| **Completionist** | Unlock 20 achievements | 🎖️ | Rare |
| **Achievement Hunter** | Unlock 30 achievements | 🏅 | Legendary |

## 3.4 Emblem Design System

### Visual Style

All emblems follow consistent design:
- **Size:** 64x64px base, scalable
- **Style:** Flat vector, single primary color + white
- **Background:** Circular or rounded square badge shape
- **Rarity glow:** Border color indicates rarity

### Rarity Colors

| Rarity | Border Color | Background |
|--------|--------------|------------|
| Common | #71717A (gray) | #27272A |
| Uncommon | #22C55E (green) | #14532D |
| Rare | #3B82F6 (blue) | #1E3A8A |
| Legendary | #EAB308 (gold) | #854D0E |

### Emblem Display

```
┌─────────────────────────────────────┐
│  ┌─────┐                            │
│  │ 🏆  │  Century Club              │
│  │     │  Cast 100 votes            │
│  └─────┘  Unlocked: Jan 15, 2026    │
│           ████ Uncommon             │
└─────────────────────────────────────┘
```

## 3.5 Profile Display

Achievements appear on the user's stats profile:

```
┌─────────────────────────────────────┐
│  @naval's Profile                   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ☀️ The Eternal Optimist     │    │
│  │ 🔥 47-day streak            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ACHIEVEMENTS (12/35)               │
│                                     │
│  Featured Emblems:                  │
│  ┌─────┬─────┬─────┐               │
│  │ 👑  │ 🦄  │ 🔥  │               │
│  └─────┴─────┴─────┘               │
│                                     │
│  Recent Unlocks:                    │
│  🏆 Century Club — 2 days ago       │
│  🎯 Crowd Pleaser — 5 days ago      │
│                                     │
│  [View All Achievements]            │
│                                     │
└─────────────────────────────────────┘
```

### Featured Emblems

Users can choose up to **3 emblems** to display prominently on their profile. These appear:
- On their stats page
- Next to their name on leaderboards
- On their pitch pages
- In share cards

```
┌─────────────────────────────────────┐
│ #3  @naval  [👑][🦄][🔥]            │
│     1,247 votes • 73% accuracy      │
└─────────────────────────────────────┘
```

## 3.6 Achievement Unlock Flow

### Unlock Notification

When an achievement is unlocked:

```
┌─────────────────────────────────────┐
│                                     │
│  🎉 ACHIEVEMENT UNLOCKED!           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │          🦄                 │    │
│  │                             │    │
│  │    Unicorn Spotter          │    │
│  │                             │    │
│  │  Correctly shipped 5        │    │
│  │  actual unicorns            │    │
│  │                             │    │
│  │  ████ Rare                  │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Share]  [Set as Featured]  [OK]   │
│                                     │
└─────────────────────────────────────┘
```

### Progress Tracking

For achievements in progress, show how close they are:

```
┌─────────────────────────────────────┐
│  🔒 Vote Machine                    │
│  Cast 500 votes                     │
│  ████████████░░░░░░░░ 347/500       │
│  ████ Rare                          │
└─────────────────────────────────────┘
```

## 3.7 Achievements Page

Full page showing all achievements:

```
┌─────────────────────────────────────┐
│  ACHIEVEMENTS                       │
│  12 of 35 unlocked                  │
│                                     │
│  Filter: [All] [Unlocked] [Locked]  │
│                                     │
│  VOTING MILESTONES                  │
│  ┌─────┬─────┬─────┬─────┐         │
│  │ 🗳️✓│ 🌱✓ │ 📊✓ │ 💯✓ │         │
│  ├─────┼─────┼─────┼─────┤         │
│  │ ⚡🔒│ 🤖🔒│ 🏆🔒│ 👑🔒│         │
│  └─────┴─────┴─────┴─────┘         │
│                                     │
│  STREAK ACHIEVEMENTS                │
│  ┌─────┬─────┬─────┬─────┐         │
│  │ 🔥✓ │ 📅✓ │ ⚔️🔒│ 🌙🔒│         │
│  └─────┴─────┴─────┴─────┘         │
│                                     │
│  ... more categories ...            │
│                                     │
└─────────────────────────────────────┘
```

## 3.8 Data Model

### Achievements Definition Table

```sql
CREATE TABLE achievement_definitions (
    id TEXT PRIMARY KEY,              -- e.g., "century_club"
    name TEXT NOT NULL,               -- "Century Club"
    description TEXT NOT NULL,        -- "Cast 100 votes"
    category TEXT NOT NULL,           -- "voting", "streak", "accuracy", etc.
    emblem TEXT NOT NULL,             -- "🏆" or icon identifier
    rarity TEXT NOT NULL,             -- "common", "uncommon", "rare", "legendary"
    requirement_type TEXT NOT NULL,   -- "vote_count", "streak_days", etc.
    requirement_value INTEGER NOT NULL, -- 100
    sort_order INTEGER DEFAULT 0
);
```

### User Achievements Table

```sql
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twitter_handle TEXT NOT NULL,
    achievement_id TEXT REFERENCES achievement_definitions(id),
    unlocked_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(twitter_handle, achievement_id)
);

CREATE INDEX idx_user_achievements_handle ON user_achievements(twitter_handle);
CREATE INDEX idx_user_achievements_time ON user_achievements(unlocked_at DESC);
```

### Featured Emblems Table

```sql
CREATE TABLE featured_emblems (
    twitter_handle TEXT PRIMARY KEY,
    emblem_1 TEXT REFERENCES achievement_definitions(id),
    emblem_2 TEXT REFERENCES achievement_definitions(id),
    emblem_3 TEXT REFERENCES achievement_definitions(id),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Players Table (additions)

```sql
ALTER TABLE players ADD COLUMN achievement_count INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN latest_achievement_id TEXT;
ALTER TABLE players ADD COLUMN latest_achievement_at TIMESTAMP;
```

## 3.9 Achievement Check Logic

```javascript
// Run after each vote
async function checkAchievements(twitterHandle, stats) {
    const unlockedIds = await getUserAchievementIds(twitterHandle);
    const allAchievements = await getAllAchievements();
    
    const newUnlocks = [];
    
    for (const achievement of allAchievements) {
        // Skip if already unlocked
        if (unlockedIds.includes(achievement.id)) continue;
        
        // Check if requirement met
        const met = checkRequirement(achievement, stats);
        
        if (met) {
            await unlockAchievement(twitterHandle, achievement.id);
            newUnlocks.push(achievement);
        }
    }
    
    return newUnlocks;
}

function checkRequirement(achievement, stats) {
    switch (achievement.requirement_type) {
        case 'vote_count':
            return stats.total_votes >= achievement.requirement_value;
        case 'streak_days':
            return stats.current_streak >= achievement.requirement_value;
        case 'crowd_agreement_percent':
            return stats.total_votes >= 50 && 
                   (stats.crowd_agreements / stats.total_votes) >= achievement.requirement_value / 100;
        case 'ideas_submitted':
            return stats.ideas_submitted >= achievement.requirement_value;
        case 'ship_rate_above':
            return stats.total_votes >= 50 &&
                   (stats.ship_votes / stats.total_votes) >= achievement.requirement_value / 100;
        // ... more types
        default:
            return false;
    }
}
```

## 3.10 API Endpoints

```
GET /api/achievements
    → Returns all achievement definitions

GET /api/achievements/[handle]
    → Returns user's unlocked achievements

GET /api/achievements/[handle]/progress
    → Returns progress toward locked achievements

POST /api/achievements/[handle]/featured
    Body: { emblem_1, emblem_2, emblem_3 }
    → Sets featured emblems for profile

GET /api/achievements/check
    Query: ?handle=X
    → Manually trigger achievement check (usually automatic)
```

## 3.11 UI Components

### AchievementBadge

Single achievement display:

```jsx
<AchievementBadge
    emblem="🏆"
    name="Century Club"
    rarity="uncommon"
    unlocked={true}
    size="sm" // sm, md, lg
/>
```

### AchievementGrid

Grid of achievements by category:

```jsx
<AchievementGrid
    achievements={achievements}
    unlocked={unlockedIds}
    onSelect={handleSelect}
/>
```

### AchievementUnlockModal

Celebration modal on unlock:

```jsx
<AchievementUnlockModal
    achievement={newAchievement}
    onShare={handleShare}
    onSetFeatured={handleSetFeatured}
    onClose={handleClose}
/>
```

### FeaturedEmblems

Display selected emblems:

```jsx
<FeaturedEmblems
    emblems={["👑", "🦄", "🔥"]}
    size="md"
/>
```

### AchievementProgress

Progress bar toward achievement:

```jsx
<AchievementProgress
    achievement={achievement}
    current={347}
    required={500}
/>
```

## 3.12 Shareable Achievement Card

```
┌─────────────────────────────────────┐
│                                     │
│  🎉 ACHIEVEMENT UNLOCKED            │
│                                     │
│           🦄                        │
│                                     │
│     Unicorn Spotter                 │
│     ████ Rare                       │
│                                     │
│  @naval on Ship or Skip             │
│  shiporskip.io                      │
│                                     │
└─────────────────────────────────────┘
```

---

# Feature 4: Head-to-Head Battles

## 4.1 Overview

A new game mode where users choose between two ideas. Creates tournament-style rankings and a different engagement dynamic than simple Ship/Skip.

## 4.2 Core Mechanics

**The Choice:**
Two ideas shown side by side. User picks which one they'd rather ship. No "both" or "neither" — forced choice.

**The Result:**
- Winner gets +1 win
- Loser gets +1 loss
- ELO-style ranking calculated

**The Outcome:**
Ideas get ranked by win rate, creating a definitive "Top Ideas" leaderboard.

## 4.3 User Flow

### Battle Screen

```
┌─────────────────────────────────────────────────────────┐
│                    WHICH WOULD YOU SHIP?                │
│                                                         │
│  ┌───────────────────┐    ┌───────────────────┐        │
│  │                   │    │                   │        │
│  │ "AI that writes   │ VS │ "Uber for dog     │        │
│  │  your emails"     │    │  walking"         │        │
│  │                   │    │                   │        │
│  │ Never write cold  │    │ On-demand walks   │        │
│  │ outreach again    │    │ in 15 minutes     │        │
│  │                   │    │                   │        │
│  │    [SHIP THIS]    │    │    [SHIP THIS]    │        │
│  │                   │    │                   │        │
│  └───────────────────┘    └───────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Result Reveal

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         🏆 67% agreed with you                          │
│                                                         │
│  ┌───────────────────┐    ┌───────────────────┐        │
│  │    ✓ WINNER       │    │                   │        │
│  │                   │    │                   │        │
│  │ "AI that writes   │    │ "Uber for dog     │        │
│  │  your emails"     │    │  walking"         │        │
│  │                   │    │                   │        │
│  │  Win rate: 73%    │    │  Win rate: 45%    │        │
│  │  Rank: #12        │    │  Rank: #89        │        │
│  │                   │    │                   │        │
│  └───────────────────┘    └───────────────────┘        │
│                                                         │
│              [Next Battle]    [Share Result]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 4.4 Matchmaking Logic

**Random with constraints:**
- Don't match ideas with vastly different vote counts (unfair)
- Prefer matching ideas in similar ranking tiers
- Don't show same matchup to same user twice
- Mix in user-submitted ideas with YC ideas

**Matchmaking algorithm:**

```javascript
function getMatchup(sessionId) {
    // Get ideas user hasn't seen in battles
    const unseenIdeas = await getUnseenBattleIdeas(sessionId);
    
    // Group into tiers by current win rate
    const tiers = groupByWinRate(unseenIdeas);
    
    // Pick a tier (weight toward middle tiers for competitive matches)
    const tier = weightedRandomTier(tiers);
    
    // Pick two random ideas from that tier
    const [idea1, idea2] = pickTwo(tier);
    
    return { idea1, idea2 };
}
```

## 4.5 ELO Rating System

Each idea has an ELO rating (like chess). Wins against higher-rated ideas = bigger gain.

```javascript
function calculateNewElo(winnerElo, loserElo, K = 32) {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
    
    const newWinnerElo = winnerElo + K * (1 - expectedWinner);
    const newLoserElo = loserElo + K * (0 - expectedLoser);
    
    return { newWinnerElo, newLoserElo };
}
```

**Starting ELO:** 1000 for all ideas

## 4.6 Data Model

### Ideas Table (additions)

```sql
ALTER TABLE ideas ADD COLUMN battle_wins INTEGER DEFAULT 0;
ALTER TABLE ideas ADD COLUMN battle_losses INTEGER DEFAULT 0;
ALTER TABLE ideas ADD COLUMN battle_total INTEGER DEFAULT 0;
ALTER TABLE ideas ADD COLUMN battle_win_rate FLOAT DEFAULT 0;
ALTER TABLE ideas ADD COLUMN elo_rating INTEGER DEFAULT 1000;

CREATE INDEX idx_ideas_elo ON ideas(elo_rating DESC);
CREATE INDEX idx_ideas_battle_win_rate ON ideas(battle_win_rate DESC);
```

### Battles Table

```sql
CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    player_id UUID REFERENCES players(id),
    idea_1_id UUID REFERENCES ideas(id) NOT NULL,
    idea_2_id UUID REFERENCES ideas(id) NOT NULL,
    winner_id UUID REFERENCES ideas(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_battles_session ON battles(session_id);
CREATE INDEX idx_battles_ideas ON battles(idea_1_id, idea_2_id);
```

### Player/Session Battle Stats

```sql
ALTER TABLE players ADD COLUMN battle_votes INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN battle_crowd_agreements INTEGER DEFAULT 0;

ALTER TABLE sessions ADD COLUMN battle_votes INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN battle_crowd_agreements INTEGER DEFAULT 0;
```

## 4.7 Battle Leaderboard

New leaderboard view: "Battle Rankings"

```
┌─────────────────────────────────────────────────────────┐
│  BATTLE RANKINGS                                        │
│                                                         │
│  Rank │ Idea                    │ Win Rate │ Battles   │
│  ─────┼─────────────────────────┼──────────┼───────────│
│  #1   │ "AI code assistant"     │ 84%      │ 1,247     │
│  #2   │ "Stripe for Africa"     │ 81%      │ 892       │
│  #3   │ "AI that writes emails" │ 78%      │ 2,103     │
│  #4   │ "Notion for teams"      │ 76%      │ 756       │
│  #5   │ "Uber for groceries"    │ 73%      │ 1,891     │
│  ...                                                    │
│                                                         │
│  Your idea: #34 (67% win rate)                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 4.8 UI Components

### BattleCard

Side-by-side idea display:

```
┌───────────────────┐
│                   │
│  "Hero text"      │
│                   │
│  Subtitle text    │
│                   │
│  [SHIP THIS]      │
│                   │
└───────────────────┘
```

### BattleResult

Overlay showing outcome:

```
┌─────────────────────────────────────┐
│                                     │
│  🏆 73% of voters agreed            │
│                                     │
│  Winner: "AI that writes emails"    │
│  Rank: #12 (+3)                     │
│                                     │
│  [Next Battle]  [Share]             │
│                                     │
└─────────────────────────────────────┘
```

### BattleLeaderboard

Rankings table with win rates.

### ModeToggle

Switch between regular voting and battle mode:

```
┌─────────────────────────────────────┐
│  [Ship/Skip]        [⚔️ Battles]    │
└─────────────────────────────────────┘
```

## 4.9 API Endpoints

```
GET /api/battle/next
    Query: ?session_id=X
    → Returns: { battle_id, idea_1, idea_2 }

POST /api/battle/vote
    Body: { battle_id, winner_id, session_id }
    → Records battle result
    → Updates ELO ratings
    → Returns: { 
        crowd_winner_id, 
        crowd_percentage,
        idea_1_new_rank,
        idea_2_new_rank,
        user_agreed 
      }

GET /api/battle/leaderboard
    Query: ?limit=50
    → Returns ideas ranked by ELO or win rate

GET /api/battle/stats
    Query: ?session_id=X
    → Returns user's battle stats
```

## 4.10 Pages & Routes

Add to existing routes:

| Route | Page | Description |
|-------|------|-------------|
| `/battle` | Battle Mode | Head-to-head voting |
| `/leaderboard/battles` | Battle Rankings | Ideas ranked by win rate |

## 4.11 Entry Points to Battle Mode

1. **Nav link:** "⚔️ Battles" in main navigation
2. **After regular voting:** "Try Battle Mode" prompt after 10 votes
3. **Landing page:** Feature battle mode as alternative game
4. **Deep link:** Direct link to `/battle`

## 4.12 Shareable Moments

**After a battle:**
```
In a head-to-head battle, 73% chose:

"AI that writes your emails"

over

"Uber for dog walking"

Which would you ship? → shiporskip.io/battle
```

**Battle stats:**
```
My Ship or Skip Battle Stats:

⚔️ 47 battles judged
🎯 71% crowd agreement
🏆 My best pick: "AI code assistant" (Rank #3)

shiporskip.io/battle
```

---

# Implementation Priority

## Phase 0: Achievements (Days 1-3) — BUILD FIRST

This is the highest priority. Achievements create instant gratification from vote #1.

**Tasks:**
1. Create database tables (definitions, player_achievements, progress)
2. Seed achievement definitions
3. Build achievement check logic (runs after every vote)
4. Build AchievementUnlockModal with full animation
5. Add sound effects (source or create)
6. Add confetti integration
7. Build progress indicator component
8. Build achievement gallery page
9. Add share functionality for achievements
10. Test on mobile for performance

## Phase 1: Streaks (Days 3-4)

Low effort, high impact on retention.

**Tasks:**
1. Add streak fields to database
2. Implement streak logic in vote API
3. Build StreakBadge component
4. Build StreakProgress component
5. Add streak display to navbar
6. Build streak milestone celebration
7. Add share functionality for milestones

## Phase 2: Personal Stats/DNA (Days 4-6)

Medium effort, high shareability.

**Tasks:**
1. Add stats tables to database
2. Track category and batch data on votes
3. Build personality calculation logic
4. Build StatsPage
5. Build category breakdown visualization
6. Build ShareableDNACard
7. Add OG image generation for stats
8. Implement minimum vote requirements

## Phase 3: Head-to-Head Battles (Days 6-9)

Medium effort, new engagement mode.

**Tasks:**
1. Add battle fields to database
2. Create battles table
3. Implement matchmaking logic
4. Implement ELO calculation
5. Build BattleCard component
6. Build battle page
7. Build BattleResult component
8. Build battle leaderboard
9. Add mode toggle
10. Add share functionality
11. Add battle-related achievements

---

# Success Metrics

## Achievements (PRIMARY)

| Metric | Target |
|--------|--------|
| % of users who get 1st achievement | 100% (by design) |
| % of users with 5+ achievements | 50% |
| Avg achievements per session | 3+ |
| Achievement unlock shares | 15% of unlocks |
| Session length increase | +40% vs no achievements |

## Streaks

| Metric | Target |
|--------|--------|
| % of users with 3+ day streak | 25% |
| % of users with 7+ day streak | 10% |
| Daily return rate | +20% vs baseline |

## Personal Stats/DNA

| Metric | Target |
|--------|--------|
| % of users who view stats page | 40% |
| % of stats pages shared | 15% |
| Avg votes to unlock personality | 20 (target threshold) |

## Head-to-Head Battles

| Metric | Target |
|--------|--------|
| % of users who try battle mode | 30% |
| Battles per session | 8+ |
| Battle result shares | 10% of battles |

---

# File Structure Additions

```
app/
├── achievements/
│   └── page.tsx                    # Achievement gallery
├── battle/
│   └── page.tsx                    # Battle mode
├── stats/
│   └── page.tsx                    # Personal stats/DNA
├── api/
│   ├── achievements/
│   │   ├── route.ts                # Get all + user achievements
│   │   ├── progress/route.ts       # Get progress toward next
│   │   └── [id]/
│   │       └── og/route.ts         # Dynamic OG image
│   ├── streak/
│   │   └── route.ts
│   ├── stats/
│   │   ├── route.ts
│   │   └── og/route.ts
│   └── battle/
│       ├── next/route.ts
│       ├── vote/route.ts
│       └── leaderboard/route.ts

components/
├── achievements/
│   ├── achievement-unlock-modal.tsx   # THE BIG MOMENT — must be incredible
│   ├── achievement-progress-bar.tsx   # Progress toward next achievement
│   ├── achievement-gallery.tsx        # Grid of all achievements
│   ├── achievement-badge.tsx          # Small badge display
│   ├── achievement-share-card.tsx     # For sharing unlocks
│   └── confetti-burst.tsx             # Confetti effect wrapper
├── streak/
│   ├── streak-badge.tsx
│   ├── streak-progress.tsx
│   └── streak-celebration.tsx
├── stats/
│   ├── stats-overview.tsx
│   ├── personality-card.tsx
│   ├── category-breakdown.tsx
│   └── shareable-dna-card.tsx
├── battle/
│   ├── battle-card.tsx
│   ├── battle-versus.tsx
│   ├── battle-result.tsx
│   └── mode-toggle.tsx

lib/
├── achievements/
│   ├── definitions.ts              # All achievement definitions
│   ├── checker.ts                  # Check logic after each vote
│   ├── sounds.ts                   # Sound effect utilities
│   └── confetti.ts                 # Confetti configurations by rarity
├── streak/
│   └── calculator.ts
├── stats/
│   ├── personality.ts
│   └── calculator.ts
├── battle/
│   ├── matchmaking.ts
│   └── elo.ts

public/
├── sounds/
│   ├── achievement-common.mp3
│   ├── achievement-uncommon.mp3
│   ├── achievement-rare.mp3
│   ├── achievement-epic.mp3
│   ├── achievement-legendary.mp3
│   └── achievement-secret.mp3
```

---

# Summary

| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| **Achievements** | Medium (3 days) | **HIGHEST — instant dopamine** | **#1** |
| Streaks | Low (2 days) | High retention | #2 |
| Personal Stats/DNA | Medium (2 days) | High shareability | #3 |
| Head-to-Head Battles | Medium (3 days) | High engagement | #4 |

**Total estimated time:** 10-12 days post-MVP

**Key insight:** Achievements must feel INCREDIBLE. The unlock animation is the most important piece of UI in this entire feature set. If users don't feel a rush of dopamine when they unlock an achievement, the whole system fails.

**Remember: No user accounts.** All features work with Twitter handle as the only identifier. Users enter their handle, we fetch their avatar, and all stats/achievements are tied to that handle. Simple, frictionless, slightly exploitable — but we don't care for now.

These features transform Ship or Skip from a "visit once" tool into an engaging daily habit with multiple modes of play, collectible achievements, and strong share mechanics.
