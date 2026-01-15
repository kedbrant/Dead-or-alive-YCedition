export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Source outcome type for YC companies
export type SourceOutcome = "unicorn" | "acquired" | "dead" | "active" | null;

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
