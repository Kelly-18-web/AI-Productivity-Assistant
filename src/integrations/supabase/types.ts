export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      emails: {
        Row: {
          audience: string
          body: string
          created_at: string
          id: string
          project_id: string
          status: string
          subject: string
          tone: string
        }
        Insert: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          project_id: string
          status?: string
          subject?: string
          tone?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          project_id?: string
          status?: string
          subject?: string
          tone?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_sources: {
        Row: {
          content: string
          created_at: string
          doc_type: string
          id: string
          project_id: string
          reference: string
          title: string
        }
        Insert: {
          content?: string
          created_at?: string
          doc_type?: string
          id?: string
          project_id: string
          reference?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          doc_type?: string
          id?: string
          project_id?: string
          reference?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_sources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          actions: Json
          analysis_state: string
          attendees: Json
          created_at: string
          decisions: Json
          id: string
          meeting_date: string
          project_id: string
          risks: Json
          summary: string
          title: string
          transcript: string
        }
        Insert: {
          actions?: Json
          analysis_state?: string
          attendees?: Json
          created_at?: string
          decisions?: Json
          id?: string
          meeting_date?: string
          project_id: string
          risks?: Json
          summary?: string
          title: string
          transcript?: string
        }
        Update: {
          actions?: Json
          analysis_state?: string
          attendees?: Json
          created_at?: string
          decisions?: Json
          id?: string
          meeting_date?: string
          project_id?: string
          risks?: Json
          summary?: string
          title?: string
          transcript?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string
          created_at: string
          description: string
          id: string
          name: string
          scope_summary: string
          status: string
        }
        Insert: {
          client?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          scope_summary?: string
          status?: string
        }
        Update: {
          client?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          scope_summary?: string
          status?: string
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          changelog: Json
          created_at: string
          feature: string
          guardrails: Json
          id: string
          name: string
          status: string
          template: string
          test_results: Json
          version: string
        }
        Insert: {
          changelog?: Json
          created_at?: string
          feature: string
          guardrails?: Json
          id?: string
          name: string
          status?: string
          template?: string
          test_results?: Json
          version?: string
        }
        Update: {
          changelog?: Json
          created_at?: string
          feature?: string
          guardrails?: Json
          id?: string
          name?: string
          status?: string
          template?: string
          test_results?: Json
          version?: string
        }
        Relationships: []
      }
      requirements: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          meeting_id: string | null
          priority: string
          project_id: string
          ref_code: string
          source_quote: string
          source_speaker: string
          status: string
          title: string
          validation_state: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          meeting_id?: string | null
          priority?: string
          project_id: string
          ref_code: string
          source_quote?: string
          source_speaker?: string
          status?: string
          title: string
          validation_state?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          meeting_id?: string | null
          priority?: string
          project_id?: string
          ref_code?: string
          source_quote?: string
          source_speaker?: string
          status?: string
          title?: string
          validation_state?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirements_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requirements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scope_changes: {
        Row: {
          confidence: string
          created_at: string
          evidence: Json
          id: string
          impact: string
          project_id: string
          rationale: string
          request_text: string
          requested_by: string
          response_letter: string
          status: string
          title: string
          verdict: string
        }
        Insert: {
          confidence?: string
          created_at?: string
          evidence?: Json
          id?: string
          impact?: string
          project_id: string
          rationale?: string
          request_text?: string
          requested_by?: string
          response_letter?: string
          status?: string
          title: string
          verdict?: string
        }
        Update: {
          confidence?: string
          created_at?: string
          evidence?: Json
          id?: string
          impact?: string
          project_id?: string
          rationale?: string
          request_text?: string
          requested_by?: string
          response_letter?: string
          status?: string
          title?: string
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "scope_changes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ai_rationale: string
          created_at: string
          detail: string
          due_date: string | null
          effort: string
          id: string
          owner: string
          priority: string
          project_id: string
          status: string
          story_id: string | null
          title: string
        }
        Insert: {
          ai_rationale?: string
          created_at?: string
          detail?: string
          due_date?: string | null
          effort?: string
          id?: string
          owner?: string
          priority?: string
          project_id: string
          status?: string
          story_id?: string | null
          title: string
        }
        Update: {
          ai_rationale?: string
          created_at?: string
          detail?: string
          due_date?: string | null
          effort?: string
          id?: string
          owner?: string
          priority?: string
          project_id?: string
          status?: string
          story_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "user_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stories: {
        Row: {
          acceptance_criteria: Json
          as_a: string
          created_at: string
          i_want: string
          id: string
          project_id: string
          ref_code: string
          requirement_id: string | null
          so_that: string
          status: string
          story_points: number
          title: string
          validation_state: string
        }
        Insert: {
          acceptance_criteria?: Json
          as_a?: string
          created_at?: string
          i_want?: string
          id?: string
          project_id: string
          ref_code: string
          requirement_id?: string | null
          so_that?: string
          status?: string
          story_points?: number
          title: string
          validation_state?: string
        }
        Update: {
          acceptance_criteria?: Json
          as_a?: string
          created_at?: string
          i_want?: string
          id?: string
          project_id?: string
          ref_code?: string
          requirement_id?: string | null
          so_that?: string
          status?: string
          story_points?: number
          title?: string
          validation_state?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stories_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
