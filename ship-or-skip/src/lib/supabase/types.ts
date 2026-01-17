export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Source outcome type for YC companies
export type SourceOutcome = "unicorn" | "acquired" | "dead" | "active" | null;

// Report section types for idea validation
export interface YCCompanyMatch {
  name: string;
  batch: string;
  pitch: string;
  outcome: SourceOutcome;
  team_size: number | null;
  slug: string;
  similarity_score: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  date: string;
  url: string;
}

export interface RedditPost {
  subreddit: string;
  title: string;
  score: number;
  comments: number;
  url: string;
}

export interface TrendsData {
  currentLevel: number;
  changePercent: number;
  timeline: { date: string; value: number }[];
}

export interface ReportSection {
  summary: string;
  data?: unknown;
}

export interface ReportData {
  idea: string;
  score: number;
  scoreReasoning: string;
  sections: {
    historical: ReportSection & { companies: YCCompanyMatch[]; outcomeCounts: { unicorn: number; acquired: number; dead: number; active: number } };
    market: ReportSection & { articles: NewsArticle[] };
    sentiment: ReportSection & { posts: RedditPost[]; sentimentBreakdown: { positive: number; negative: number; neutral: number } };
    trends: ReportSection & { data: TrendsData | null };
    recommendations: { title: string; description: string }[];
  };
}

export type Database = {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string;
          slug: string;
          hero: string;
          subtitle: string;
          source: string;
          source_company: string | null;
          source_batch: string | null;
          source_outcome: SourceOutcome;
          submitter_twitter: string | null;
          submitter_session_id: string | null;
          link: string | null;
          ship_count: number;
          skip_count: number;
          total_votes: number;
          ship_percentage: number;
          is_active: boolean;
          created_at: string;
          // YC company fields
          yc_id: string | null;
          yc_name: string | null;
          yc_slug: string | null;
          yc_batch: string | null;
          yc_status: string | null;
          yc_logo_url: string | null;
          yc_website: string | null;
          yc_long_description: string | null;
          yc_team_size: number | null;
          yc_industry: string | null;
          yc_subindustry: string | null;
          yc_tags: string[] | null;
          yc_location: string | null;
          yc_launched_at: string | null;
          yc_is_top_company: boolean;
          // Active pool management
          is_in_active_pool: boolean;
          pool_added_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          hero: string;
          subtitle: string;
          source?: string;
          source_company?: string | null;
          source_batch?: string | null;
          source_outcome?: SourceOutcome;
          submitter_twitter?: string | null;
          submitter_session_id?: string | null;
          link?: string | null;
          ship_count?: number;
          skip_count?: number;
          total_votes?: number;
          ship_percentage?: number;
          is_active?: boolean;
          created_at?: string;
          // YC company fields
          yc_id?: string | null;
          yc_name?: string | null;
          yc_slug?: string | null;
          yc_batch?: string | null;
          yc_status?: string | null;
          yc_logo_url?: string | null;
          yc_website?: string | null;
          yc_long_description?: string | null;
          yc_team_size?: number | null;
          yc_industry?: string | null;
          yc_subindustry?: string | null;
          yc_tags?: string[] | null;
          yc_location?: string | null;
          yc_launched_at?: string | null;
          yc_is_top_company?: boolean;
          // Active pool management
          is_in_active_pool?: boolean;
          pool_added_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          hero?: string;
          subtitle?: string;
          source?: string;
          source_company?: string | null;
          source_batch?: string | null;
          source_outcome?: SourceOutcome;
          submitter_twitter?: string | null;
          submitter_session_id?: string | null;
          link?: string | null;
          ship_count?: number;
          skip_count?: number;
          total_votes?: number;
          ship_percentage?: number;
          is_active?: boolean;
          created_at?: string;
          // YC company fields
          yc_id?: string | null;
          yc_name?: string | null;
          yc_slug?: string | null;
          yc_batch?: string | null;
          yc_status?: string | null;
          yc_logo_url?: string | null;
          yc_website?: string | null;
          yc_long_description?: string | null;
          yc_team_size?: number | null;
          yc_industry?: string | null;
          yc_subindustry?: string | null;
          yc_tags?: string[] | null;
          yc_location?: string | null;
          yc_launched_at?: string | null;
          yc_is_top_company?: boolean;
          // Active pool management
          is_in_active_pool?: boolean;
          pool_added_at?: string | null;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          idea_id: string;
          session_id: string;
          vote: "ship" | "skip";
          created_at: string;
          // Vote correctness tracking
          is_correct: boolean | null;
          idea_outcome: SourceOutcome;
        };
        Insert: {
          id?: string;
          idea_id: string;
          session_id: string;
          vote: "ship" | "skip";
          created_at?: string;
          // Vote correctness tracking
          is_correct?: boolean | null;
          idea_outcome?: SourceOutcome;
        };
        Update: {
          id?: string;
          idea_id?: string;
          session_id?: string;
          vote?: "ship" | "skip";
          created_at?: string;
          // Vote correctness tracking
          is_correct?: boolean | null;
          idea_outcome?: SourceOutcome;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          twitter_handle: string | null;
          total_votes: number;
          ship_votes: number;
          skip_votes: number;
          crowd_agreements: number;
          created_at: string;
          last_activity_at: string;
          // Oracle Score tracking
          oracle_score: number | null;
          resolved_votes: number;
          correct_predictions: number;
        };
        Insert: {
          id?: string;
          twitter_handle?: string | null;
          total_votes?: number;
          ship_votes?: number;
          skip_votes?: number;
          crowd_agreements?: number;
          created_at?: string;
          last_activity_at?: string;
          // Oracle Score tracking
          oracle_score?: number | null;
          resolved_votes?: number;
          correct_predictions?: number;
        };
        Update: {
          id?: string;
          twitter_handle?: string | null;
          total_votes?: number;
          ship_votes?: number;
          skip_votes?: number;
          crowd_agreements?: number;
          created_at?: string;
          last_activity_at?: string;
          // Oracle Score tracking
          oracle_score?: number | null;
          resolved_votes?: number;
          correct_predictions?: number;
        };
        Relationships: [];
      };
      battle_votes: {
        Row: {
          id: string;
          session_id: string;
          winner_idea_id: string;
          loser_idea_id: string;
          user_choice: "left" | "right";
          correct_answer: "left" | "right";
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          winner_idea_id: string;
          loser_idea_id: string;
          user_choice: "left" | "right";
          correct_answer: "left" | "right";
          is_correct: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          winner_idea_id?: string;
          loser_idea_id?: string;
          user_choice?: "left" | "right";
          correct_answer?: "left" | "right";
          is_correct?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      achievement_definitions: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          category: "voting" | "outcome" | "streak" | "social" | "special";
          trigger_type: string;
          trigger_threshold: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          category: "voting" | "outcome" | "streak" | "social" | "special";
          trigger_type: string;
          trigger_threshold?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          category?: "voting" | "outcome" | "streak" | "social" | "special";
          trigger_type?: string;
          trigger_threshold?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      achievement_progress: {
        Row: {
          id: string;
          session_id: string;
          total_votes: number;
          unicorns_voted: number;
          unicorns_shipped: number;
          unicorns_skipped: number;
          dead_voted: number;
          dead_shipped: number;
          dead_skipped: number;
          acquired_voted: number;
          acquired_shipped: number;
          acquired_skipped: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          total_votes?: number;
          unicorns_voted?: number;
          unicorns_shipped?: number;
          unicorns_skipped?: number;
          dead_voted?: number;
          dead_shipped?: number;
          dead_skipped?: number;
          acquired_voted?: number;
          acquired_shipped?: number;
          acquired_skipped?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          total_votes?: number;
          unicorns_voted?: number;
          unicorns_shipped?: number;
          unicorns_skipped?: number;
          dead_voted?: number;
          dead_shipped?: number;
          dead_skipped?: number;
          acquired_voted?: number;
          acquired_shipped?: number;
          acquired_skipped?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_achievements: {
        Row: {
          id: string;
          session_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          idea: string;
          score: number;
          report_data: ReportData;
          created_at: string;
        };
        Insert: {
          id?: string;
          idea: string;
          score: number;
          report_data: ReportData;
          created_at?: string;
        };
        Update: {
          id?: string;
          idea?: string;
          score?: number;
          report_data?: ReportData;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience type exports
export type Idea = Database["public"]["Tables"]["ideas"]["Row"];
export type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"];
export type IdeaUpdate = Database["public"]["Tables"]["ideas"]["Update"];

export type Vote = Database["public"]["Tables"]["votes"]["Row"];
export type VoteInsert = Database["public"]["Tables"]["votes"]["Insert"];
export type VoteUpdate = Database["public"]["Tables"]["votes"]["Update"];

export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type SessionInsert = Database["public"]["Tables"]["sessions"]["Insert"];
export type SessionUpdate = Database["public"]["Tables"]["sessions"]["Update"];

export type BattleVote = Database["public"]["Tables"]["battle_votes"]["Row"];
export type BattleVoteInsert = Database["public"]["Tables"]["battle_votes"]["Insert"];
export type BattleVoteUpdate = Database["public"]["Tables"]["battle_votes"]["Update"];

export type AchievementDefinition = Database["public"]["Tables"]["achievement_definitions"]["Row"];
export type AchievementDefinitionInsert = Database["public"]["Tables"]["achievement_definitions"]["Insert"];
export type AchievementDefinitionUpdate = Database["public"]["Tables"]["achievement_definitions"]["Update"];

export type AchievementProgress = Database["public"]["Tables"]["achievement_progress"]["Row"];
export type AchievementProgressInsert = Database["public"]["Tables"]["achievement_progress"]["Insert"];
export type AchievementProgressUpdate = Database["public"]["Tables"]["achievement_progress"]["Update"];

export type SessionAchievement = Database["public"]["Tables"]["session_achievements"]["Row"];
export type SessionAchievementInsert = Database["public"]["Tables"]["session_achievements"]["Insert"];
export type SessionAchievementUpdate = Database["public"]["Tables"]["session_achievements"]["Update"];

export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];
export type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"];

// Achievement rarity and category types for convenience
export type AchievementRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type AchievementCategory = "voting" | "outcome" | "streak" | "social" | "special";

/**
 * Raw YC company data from the YC-OSS API
 * Source: https://yc-oss.github.io/api/companies/all.json
 */
export interface YCCompanyRaw {
  id: number;
  name: string;
  slug: string;
  former_names: string[];
  small_logo_thumb_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  highlight_black: boolean;
  highlight_latinx: boolean;
  highlight_women: boolean;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  tags_highlighted: string[];
  top_company: boolean;
  isHiring: boolean;
  nonprofit: boolean;
  batch: string;
  status: string; // 'Public', 'Active', 'Inactive', 'Acquired'
  industries: string[];
  regions: string[];
  stage: string;
  app_video_public: boolean;
  demo_day_video_public: boolean;
  app_answers: null;
  question_answers: boolean;
  // Added by API processor
  url?: string;
  api?: string;
}
