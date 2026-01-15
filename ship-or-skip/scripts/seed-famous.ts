/**
 * Seed script for famous startup ideas
 * Run with: npx tsx scripts/seed-famous.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * These can be in .env.local file in the ship-or-skip directory
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

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

// Generate URL-friendly slug from hero text
function generateSlug(hero: string): string {
  return hero
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface FamousStartup {
  hero: string;
  subtitle: string;
  source_company: string;
  source_outcome: "success" | "failure" | "acquired" | "shutdown";
}

// Famous startups data - mix of massive successes and notable failures
const famousStartups: FamousStartup[] = [
  // Massive Successes
  {
    hero: "Rent out air mattresses in your apartment to strangers",
    subtitle: "Travelers sleep on inflatable beds in hosts' homes for $80/night",
    source_company: "Airbnb",
    source_outcome: "success",
  },
  {
    hero: "Get a stranger to drive you around in their personal car",
    subtitle: "Push a button, get picked up by a random person with a car",
    source_company: "Uber",
    source_outcome: "success",
  },
  {
    hero: "Let anyone process credit cards with 7 lines of code",
    subtitle: "Developers can accept payments by copying some JavaScript",
    source_company: "Stripe",
    source_outcome: "success",
  },
  {
    hero: "Search the entire internet instantly",
    subtitle: "Type anything and find relevant web pages in milliseconds",
    source_company: "Google",
    source_outcome: "success",
  },
  {
    hero: "Let anyone sell their junk to strangers online",
    subtitle: "Auction platform where random people bid on used items",
    source_company: "eBay",
    source_outcome: "success",
  },
  {
    hero: "Watch random videos uploaded by anyone on the internet",
    subtitle: "Free streaming site where people share homemade clips",
    source_company: "YouTube",
    source_outcome: "acquired",
  },
  {
    hero: "Send 280 characters of text to the world",
    subtitle: "Microblogging where you share your random thoughts publicly",
    source_company: "Twitter",
    source_outcome: "acquired",
  },
  {
    hero: "Put your entire college life online for classmates to see",
    subtitle: "Students share photos and posts with people at their university",
    source_company: "Facebook",
    source_outcome: "success",
  },
  {
    hero: "Store all your files on someone else's computer",
    subtitle: "Sync folders to the cloud and access them from any device",
    source_company: "Dropbox",
    source_outcome: "success",
  },
  {
    hero: "Send disappearing photos to your friends",
    subtitle: "Pictures that self-destruct after a few seconds of viewing",
    source_company: "Snapchat",
    source_outcome: "success",
  },
  {
    hero: "Buy shoes online without trying them on",
    subtitle: "Order shoes via website, free returns if they don't fit",
    source_company: "Zappos",
    source_outcome: "acquired",
  },
  {
    hero: "Let strangers drive your packages across the country",
    subtitle: "Crowdsourced delivery where anyone can be a driver",
    source_company: "DoorDash",
    source_outcome: "success",
  },
  {
    hero: "Work from a shared office with random strangers",
    subtitle: "Rent a desk in a trendy coworking space by the month",
    source_company: "WeWork",
    source_outcome: "failure",
  },
  {
    hero: "Stream whatever music you want for $10/month",
    subtitle: "Unlimited access to millions of songs on any device",
    source_company: "Spotify",
    source_outcome: "success",
  },
  {
    hero: "Electric cars that drive themselves",
    subtitle: "Battery-powered vehicles with autopilot features",
    source_company: "Tesla",
    source_outcome: "success",
  },

  // Notable Failures and Controversies
  {
    hero: "Get blood tests done with just a finger prick",
    subtitle: "Revolutionary diagnostic technology using tiny blood samples",
    source_company: "Theranos",
    source_outcome: "shutdown",
  },
  {
    hero: "Rent expensive clothes instead of buying them",
    subtitle: "Subscription service for designer fashion items",
    source_company: "Rent the Runway",
    source_outcome: "failure",
  },
  {
    hero: "Meal kits delivered to your door with recipes",
    subtitle: "Pre-portioned ingredients so you can cook fancy dinners",
    source_company: "Blue Apron",
    source_outcome: "failure",
  },
  {
    hero: "WiFi-connected juicer that squeezes pre-made juice packs",
    subtitle: "Expensive machine that presses proprietary fruit pouches",
    source_company: "Juicero",
    source_outcome: "shutdown",
  },
  {
    hero: "Get your groceries delivered in 10 minutes",
    subtitle: "Ultra-fast delivery from dark stores in urban areas",
    source_company: "Gopuff",
    source_outcome: "failure",
  },
  {
    hero: "Scooters you can rent and leave anywhere",
    subtitle: "Electric scooters scattered around the city for quick rides",
    source_company: "Bird",
    source_outcome: "failure",
  },
  {
    hero: "A bank with no branches, just an app",
    subtitle: "Digital-only banking with no physical locations",
    source_company: "Chime",
    source_outcome: "success",
  },
  {
    hero: "Video chat with doctors from your phone",
    subtitle: "Skip the waiting room, see a physician via app",
    source_company: "Teladoc",
    source_outcome: "success",
  },
  {
    hero: "Shave club that mails you razors monthly",
    subtitle: "Dollar subscription for cheap razor blade deliveries",
    source_company: "Dollar Shave Club",
    source_outcome: "acquired",
  },
  {
    hero: "Exercise bike that streams live fitness classes",
    subtitle: "Expensive stationary bike with subscription workout videos",
    source_company: "Peloton",
    source_outcome: "failure",
  },
  {
    hero: "Buy now, pay later for online shopping",
    subtitle: "Split purchases into 4 installments with no interest",
    source_company: "Klarna",
    source_outcome: "success",
  },
  {
    hero: "Dating app where women message first",
    subtitle: "Only women can initiate conversation after matching",
    source_company: "Bumble",
    source_outcome: "success",
  },
  {
    hero: "Rent other people's cars when they're not using them",
    subtitle: "Peer-to-peer car rental marketplace",
    source_company: "Turo",
    source_outcome: "success",
  },
  {
    hero: "Glasses delivered to your home to try on",
    subtitle: "Order 5 frames, pick one, send the rest back free",
    source_company: "Warby Parker",
    source_outcome: "success",
  },
  {
    hero: "Mattress in a box shipped to your door",
    subtitle: "Compressed foam mattress with 100-night trial",
    source_company: "Casper",
    source_outcome: "failure",
  },
];

async function seedFamousStartups() {
  console.log("Starting to seed famous startups...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const startup of famousStartups) {
    const slug = generateSlug(startup.hero);

    // Upsert: insert if not exists, update if exists (by slug)
    const { error } = await supabase
      .from("ideas")
      .upsert(
        {
          slug,
          hero: startup.hero,
          subtitle: startup.subtitle,
          source: "famous",
          source_company: startup.source_company,
          source_outcome: startup.source_outcome,
          is_active: true,
        },
        {
          onConflict: "slug",
          ignoreDuplicates: false,
        }
      )
      .select("id, slug");

    if (error) {
      console.error(`Error upserting ${startup.source_company}:`, error.message);
      errorCount++;
    } else {
      console.log(`✓ ${startup.source_company}: ${slug}`);
      successCount++;
    }
  }

  console.log("\n--- Seed Complete ---");
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total startups: ${famousStartups.length}`);
}

// Run the seed function
seedFamousStartups()
  .then(() => {
    console.log("\nSeed script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
