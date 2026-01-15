export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
          source_outcome: string | null;
          submitter_twitter: string | null;
          submitter_session_id: string | null;
          link: string | null;
          ship_count: number;
          skip_count: number;
          total_votes: number;
          ship_percentage: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          hero: string;
          subtitle: string;
          source?: string;
          source_company?: string | null;
          source_batch?: string | null;
          source_outcome?: string | null;
          submitter_twitter?: string | null;
          submitter_session_id?: string | null;
          link?: string | null;
          ship_count?: number;
          skip_count?: number;
          total_votes?: number;
          ship_percentage?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          hero?: string;
          subtitle?: string;
          source?: string;
          source_company?: string | null;
          source_batch?: string | null;
          source_outcome?: string | null;
          submitter_twitter?: string | null;
          submitter_session_id?: string | null;
          link?: string | null;
          ship_count?: number;
          skip_count?: number;
          total_votes?: number;
          ship_percentage?: number;
          is_active?: boolean;
          created_at?: string;
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
        };
        Insert: {
          id?: string;
          idea_id: string;
          session_id: string;
          vote: "ship" | "skip";
          created_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          session_id?: string;
          vote?: "ship" | "skip";
          created_at?: string;
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
