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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          note_id: string
          outcome: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          note_id: string
          outcome?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          note_id?: string
          outcome?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string
          date_added: string
          date_finished: string | null
          id: string
          one_sentence_takeaway: string | null
          rating: number | null
          status: string
          title: string
          total_reading_time: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author: string
          cover_image_url?: string | null
          created_at?: string
          date_added?: string
          date_finished?: string | null
          id?: string
          one_sentence_takeaway?: string | null
          rating?: number | null
          status?: string
          title: string
          total_reading_time?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          date_added?: string
          date_finished?: string | null
          id?: string
          one_sentence_takeaway?: string | null
          rating?: number | null
          status?: string
          title?: string
          total_reading_time?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      note_relationships: {
        Row: {
          created_at: string
          created_by_user_id: string
          id: string
          note_id_1: string
          note_id_2: string
          relationship_type: string | null
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          id?: string
          note_id_1: string
          note_id_2: string
          relationship_type?: string | null
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          id?: string
          note_id_1?: string
          note_id_2?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_relationships_note_id_1_fkey"
            columns: ["note_id_1"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_relationships_note_id_2_fkey"
            columns: ["note_id_2"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_tags: {
        Row: {
          created_at: string
          id: string
          note_id: string
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          book_id: string
          content: string
          created_at: string
          has_voice_note: boolean | null
          id: string
          is_action_item: boolean | null
          session_id: string | null
          transcription: string | null
          updated_at: string
          user_id: string
          voice_note_duration: number | null
          voice_note_url: string | null
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string
          has_voice_note?: boolean | null
          id?: string
          is_action_item?: boolean | null
          session_id?: string | null
          transcription?: string | null
          updated_at?: string
          user_id: string
          voice_note_duration?: number | null
          voice_note_url?: string | null
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string
          has_voice_note?: boolean | null
          id?: string
          is_action_item?: boolean | null
          session_id?: string | null
          transcription?: string | null
          updated_at?: string
          user_id?: string
          voice_note_duration?: number | null
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          background_sound: string | null
          book_id: string
          created_at: string
          duration: number | null
          end_time: string | null
          focus_mode_used: boolean | null
          id: string
          key_insight: string | null
          session_mood: string | null
          start_time: string
          user_id: string
        }
        Insert: {
          background_sound?: string | null
          book_id: string
          created_at?: string
          duration?: number | null
          end_time?: string | null
          focus_mode_used?: boolean | null
          id?: string
          key_insight?: string | null
          session_mood?: string | null
          start_time?: string
          user_id: string
        }
        Update: {
          background_sound?: string | null
          book_id?: string
          created_at?: string
          duration?: number | null
          end_time?: string | null
          focus_mode_used?: boolean | null
          id?: string
          key_insight?: string | null
          session_mood?: string | null
          start_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          tag_name: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_name: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_name?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          default_background_sound: string | null
          default_focus_mode: boolean | null
          id: string
          theme_preference: string | null
          updated_at: string
          user_id: string
          voice_note_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          default_background_sound?: string | null
          default_focus_mode?: boolean | null
          id?: string
          theme_preference?: string | null
          updated_at?: string
          user_id: string
          voice_note_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          default_background_sound?: string | null
          default_focus_mode?: boolean | null
          id?: string
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
          voice_note_enabled?: boolean | null
        }
        Relationships: []
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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

// Helper types for easier use
export type Book = Tables<'books'>
export type Session = Tables<'sessions'>
export type Note = Tables<'notes'>
export type Action = Tables<'actions'>
export type Tag = Tables<'tags'>
export type NoteTag = Tables<'note_tags'>
export type NoteRelationship = Tables<'note_relationships'>
export type UserSettings = Tables<'user_settings'>
