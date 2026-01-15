/**
 * Seed script for achievement definitions
 * Run with: npx tsx scripts/seed-achievements.ts
 *
 * This script seeds the achievement_definitions table with YC-themed achievements.
 * It can be run multiple times safely (uses upsert on id).
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * These can be in .env.local file in the ship-or-skip directory
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";
import type { AchievementRarity, AchievementCategory } from "../src/lib/supabase/types";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing environment variables");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  console.error("Add these to ship-or-skip/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  trigger_type: string;
  trigger_threshold: number;
}

// Achievement definitions - YC-themed and general voting achievements
const achievements: AchievementDef[] = [
  // Core YC-themed achievements (from US-027)
  {
    id: "unicorn_hunter",
    name: "Unicorn Hunter",
    description: "Vote on a unicorn company",
    icon: "star",
    rarity: "uncommon",
    category: "outcome",
    trigger_type: "unicorn_voted",
    trigger_threshold: 1,
  },
  {
    id: "visionary",
    name: "Visionary",
    description: "Ship a startup that became a unicorn",
    icon: "eye",
    rarity: "uncommon",
    category: "outcome",
    trigger_type: "unicorn_shipped",
    trigger_threshold: 1,
  },
  {
    id: "missed_opportunity",
    name: "Missed Opportunity",
    description: "Skip a startup that became a unicorn",
    icon: "x-circle",
    rarity: "uncommon",
    category: "outcome",
    trigger_type: "unicorn_skipped",
    trigger_threshold: 1,
  },
  {
    id: "gravedigger",
    name: "Gravedigger",
    description: "Vote on a startup that failed",
    icon: "skull",
    rarity: "common",
    category: "outcome",
    trigger_type: "dead_voted",
    trigger_threshold: 1,
  },
  {
    id: "fooled",
    name: "Fooled",
    description: "Ship a startup that later failed",
    icon: "mask",
    rarity: "uncommon",
    category: "outcome",
    trigger_type: "dead_shipped",
    trigger_threshold: 1,
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Achieve 80%+ prediction accuracy with 50+ resolved votes",
    icon: "crystal-ball",
    rarity: "epic",
    category: "special",
    trigger_type: "oracle_score_80",
    trigger_threshold: 50,
  },

  // Additional outcome-based achievements
  {
    id: "good_instincts",
    name: "Good Instincts",
    description: "Correctly skip a startup that failed",
    icon: "check-circle",
    rarity: "common",
    category: "outcome",
    trigger_type: "dead_skipped",
    trigger_threshold: 1,
  },
  {
    id: "deal_maker",
    name: "Deal Maker",
    description: "Vote on a startup that got acquired",
    icon: "handshake",
    rarity: "common",
    category: "outcome",
    trigger_type: "acquired_voted",
    trigger_threshold: 1,
  },

  // Voting milestone achievements
  {
    id: "first_vote",
    name: "First Vote",
    description: "Cast your first prediction",
    icon: "rocket",
    rarity: "common",
    category: "voting",
    trigger_type: "total_votes",
    trigger_threshold: 1,
  },
  {
    id: "prediction_spree",
    name: "Prediction Spree",
    description: "Cast 10 predictions",
    icon: "zap",
    rarity: "common",
    category: "voting",
    trigger_type: "total_votes",
    trigger_threshold: 10,
  },
  {
    id: "venture_scout",
    name: "Venture Scout",
    description: "Cast 50 predictions",
    icon: "search",
    rarity: "uncommon",
    category: "voting",
    trigger_type: "total_votes",
    trigger_threshold: 50,
  },
  {
    id: "veteran_vc",
    name: "Veteran VC",
    description: "Cast 100 predictions",
    icon: "award",
    rarity: "rare",
    category: "voting",
    trigger_type: "total_votes",
    trigger_threshold: 100,
  },
];

async function seedAchievements() {
  console.log("Starting to seed achievement definitions...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const achievement of achievements) {
    // Upsert: insert if not exists, update if exists (by id)
    const { error } = await supabase
      .from("achievement_definitions")
      .upsert(
        {
          ...achievement,
          is_active: true,
        },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error(`Error upserting ${achievement.id}:`, error.message);
      errorCount++;
    } else {
      const rarityEmoji = {
        common: "⚪",
        uncommon: "🟢",
        rare: "🔵",
        epic: "🟣",
        legendary: "🟡",
      };
      console.log(
        `${rarityEmoji[achievement.rarity]} ${achievement.name} (${achievement.rarity})`
      );
      successCount++;
    }
  }

  console.log("\n--- Seed Complete ---");
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total achievements: ${achievements.length}`);

  // Show summary by rarity
  console.log("\n--- By Rarity ---");
  const byRarity = achievements.reduce(
    (acc, a) => {
      acc[a.rarity] = (acc[a.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  Object.entries(byRarity).forEach(([rarity, count]) => {
    console.log(`  ${rarity}: ${count}`);
  });

  // Show summary by category
  console.log("\n--- By Category ---");
  const byCategory = achievements.reduce(
    (acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
}

// Run the seed function
seedAchievements()
  .then(() => {
    console.log("\nSeed script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
