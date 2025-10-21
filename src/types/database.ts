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
      action_items: {
        Row: {
          book_id: string
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          implementation_notes: string | null
          is_recurring: boolean | null
          note_id: string | null
          priority: Database["public"]["Enums"]["action_priority"] | null
          recurrence_pattern: string | null
          status: Database["public"]["Enums"]["action_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          implementation_notes?: string | null
          is_recurring?: boolean | null
          note_id?: string | null
          priority?: Database["public"]["Enums"]["action_priority"] | null
          recurrence_pattern?: string | null
          status?: Database["public"]["Enums"]["action_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          implementation_notes?: string | null
          is_recurring?: boolean | null
          note_id?: string | null
          priority?: Database["public"]["Enums"]["action_priority"] | null
          recurrence_pattern?: string | null
          status?: Database["public"]["Enums"]["action_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_concepts: {
        Row: {
          book_id: string
          concept_id: string
          created_at: string | null
          id: string
          note_id: string | null
          what_it_teaches: string | null
        }
        Insert: {
          book_id: string
          concept_id: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          what_it_teaches?: string | null
        }
        Update: {
          book_id?: string
          concept_id?: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          what_it_teaches?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_concepts_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_concepts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_concepts_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      book_relationships: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          notes: string | null
          related_book_id: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          strength: number | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          related_book_id: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          strength?: number | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          related_book_id?: string
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          strength?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_relationships_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_relationships_related_book_id_fkey"
            columns: ["related_book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_shelves: {
        Row: {
          added_at: string | null
          book_id: string
          id: string
          shelf_id: string
        }
        Insert: {
          added_at?: string | null
          book_id: string
          id?: string
          shelf_id: string
        }
        Update: {
          added_at?: string | null
          book_id?: string
          id?: string
          shelf_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_shelves_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_shelves_shelf_id_fkey"
            columns: ["shelf_id"]
            isOneToOne: false
            referencedRelation: "shelves"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_url: string | null
          created_at: string | null
          current_page: number | null
          date_abandoned: string | null
          date_added: string | null
          date_finished: string | null
          date_started: string | null
          dnf_reason: string | null
          edition: string | null
          format: string | null
          id: string
          is_archived: boolean | null
          is_favorite: boolean | null
          isbn: string | null
          language: string | null
          publication_year: number | null
          publisher: string | null
          rating: number | null
          reread_count: number | null
          review: string | null
          status: string | null
          tags: string[] | null
          title: string
          total_pages: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          cover_url?: string | null
          created_at?: string | null
          current_page?: number | null
          date_abandoned?: string | null
          date_added?: string | null
          date_finished?: string | null
          date_started?: string | null
          dnf_reason?: string | null
          edition?: string | null
          format?: string | null
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          isbn?: string | null
          language?: string | null
          publication_year?: number | null
          publisher?: string | null
          rating?: number | null
          reread_count?: number | null
          review?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          total_pages?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          cover_url?: string | null
          created_at?: string | null
          current_page?: number | null
          date_abandoned?: string | null
          date_added?: string | null
          date_finished?: string | null
          date_started?: string | null
          dnf_reason?: string | null
          edition?: string | null
          format?: string | null
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          isbn?: string | null
          language?: string | null
          publication_year?: number | null
          publisher?: string | null
          rating?: number | null
          reread_count?: number | null
          review?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concepts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          book_id: string
          created_at: string | null
          ease_factor: number | null
          format: Database["public"]["Enums"]["flashcard_format"] | null
          id: string
          interval_days: number | null
          last_reviewed_at: string | null
          mastery_level: number | null
          next_review_date: string | null
          note_id: string | null
          options: Json | null
          question: string
          times_correct: number | null
          times_incorrect: number | null
          times_reviewed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer: string
          book_id: string
          created_at?: string | null
          ease_factor?: number | null
          format?: Database["public"]["Enums"]["flashcard_format"] | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          note_id?: string | null
          options?: Json | null
          question: string
          times_correct?: number | null
          times_incorrect?: number | null
          times_reviewed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          book_id?: string
          created_at?: string | null
          ease_factor?: number | null
          format?: Database["public"]["Enums"]["flashcard_format"] | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          note_id?: string | null
          options?: Json | null
          question?: string
          times_correct?: number | null
          times_incorrect?: number | null
          times_reviewed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      life_applications: {
        Row: {
          action_item_id: string | null
          book_id: string
          concept: string
          created_at: string | null
          date_applied: string
          effectiveness_rating: number | null
          id: string
          note_id: string | null
          outcome: string | null
          situation: string
          updated_at: string | null
          user_id: string
          would_use_again: boolean | null
        }
        Insert: {
          action_item_id?: string | null
          book_id: string
          concept: string
          created_at?: string | null
          date_applied?: string
          effectiveness_rating?: number | null
          id?: string
          note_id?: string | null
          outcome?: string | null
          situation: string
          updated_at?: string | null
          user_id: string
          would_use_again?: boolean | null
        }
        Update: {
          action_item_id?: string | null
          book_id?: string
          concept?: string
          created_at?: string | null
          date_applied?: string
          effectiveness_rating?: number | null
          id?: string
          note_id?: string | null
          outcome?: string | null
          situation?: string
          updated_at?: string | null
          user_id?: string
          would_use_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "life_applications_action_item_id_fkey"
            columns: ["action_item_id"]
            isOneToOne: false
            referencedRelation: "action_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "life_applications_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "life_applications_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "life_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          book_id: string
          chapter: string | null
          color: string | null
          content: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_pinned: boolean | null
          is_private: boolean | null
          linked_note_ids: string[] | null
          note_type: Database["public"]["Enums"]["note_type"]
          page_number: number | null
          parent_note_id: string | null
          priority: Database["public"]["Enums"]["note_priority"] | null
          section: string | null
          session_id: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          chapter?: string | null
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          linked_note_ids?: string[] | null
          note_type: Database["public"]["Enums"]["note_type"]
          page_number?: number | null
          parent_note_id?: string | null
          priority?: Database["public"]["Enums"]["note_priority"] | null
          section?: string | null
          session_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          chapter?: string | null
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          linked_note_ids?: string[] | null
          note_type?: Database["public"]["Enums"]["note_type"]
          page_number?: number | null
          parent_note_id?: string | null
          priority?: Database["public"]["Enums"]["note_priority"] | null
          section?: string | null
          session_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
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
            foreignKeyName: "notes_parent_note_id_fkey"
            columns: ["parent_note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "reading_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          preferred_view: string | null
          reading_goal_monthly: number | null
          reading_goal_yearly: number | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          preferred_view?: string | null
          reading_goal_monthly?: number | null
          reading_goal_yearly?: number | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          preferred_view?: string | null
          reading_goal_monthly?: number | null
          reading_goal_yearly?: number | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_id: string
          created_at: string | null
          duration_minutes: number | null
          end_page: number | null
          end_time: string | null
          id: string
          is_active: boolean | null
          pages_read: number | null
          session_notes: string | null
          start_page: number | null
          start_time: string
          summary: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          duration_minutes?: number | null
          end_page?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          pages_read?: number | null
          session_notes?: string | null
          start_page?: number | null
          start_time: string
          summary?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          end_page?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          pages_read?: number | null
          session_notes?: string | null
          start_page?: number | null
          start_time?: string
          summary?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_queue: {
        Row: {
          book_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          interval_days: number | null
          note_id: string | null
          review_type: string | null
          scheduled_date: string
          snoozed_until: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interval_days?: number | null
          note_id?: string | null
          review_type?: string | null
          scheduled_date: string
          snoozed_until?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interval_days?: number | null
          note_id?: string | null
          review_type?: string | null
          scheduled_date?: string
          snoozed_until?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_queue_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shelves: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shelves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          cards_per_page: number | null
          compact_mode: boolean | null
          created_at: string | null
          daily_reading_reminder: boolean | null
          default_reading_speed: number | null
          export_format: string | null
          id: string
          include_private_notes: boolean | null
          profile_public: boolean | null
          reminder_time: string | null
          review_reminders: boolean | null
          session_auto_pause_minutes: number | null
          show_book_covers: boolean | null
          stats_public: boolean | null
          updated_at: string | null
        }
        Insert: {
          cards_per_page?: number | null
          compact_mode?: boolean | null
          created_at?: string | null
          daily_reading_reminder?: boolean | null
          default_reading_speed?: number | null
          export_format?: string | null
          id: string
          include_private_notes?: boolean | null
          profile_public?: boolean | null
          reminder_time?: string | null
          review_reminders?: boolean | null
          session_auto_pause_minutes?: number | null
          show_book_covers?: boolean | null
          stats_public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cards_per_page?: number | null
          compact_mode?: boolean | null
          created_at?: string | null
          daily_reading_reminder?: boolean | null
          default_reading_speed?: number | null
          export_format?: string | null
          id?: string
          include_private_notes?: boolean | null
          profile_public?: boolean | null
          reminder_time?: string | null
          review_reminders?: boolean | null
          session_auto_pause_minutes?: number | null
          show_book_covers?: boolean | null
          stats_public?: boolean | null
          updated_at?: string | null
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
      action_priority: "high" | "medium" | "low"
      action_status: "todo" | "in_progress" | "completed" | "cancelled"
      flashcard_format:
        | "multiple_choice"
        | "fill_blank"
        | "true_false"
        | "open_ended"
      note_priority: "urgent" | "important" | "interesting" | "none"
      note_type:
        | "idea"
        | "argument"
        | "action"
        | "quote"
        | "question"
        | "connection"
        | "disagreement"
        | "insight"
        | "data"
        | "example"
        | "reflection"
        | "definition"
      relationship_type:
        | "similar_to"
        | "contradicts"
        | "builds_on"
        | "referenced_in"
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_priority: ["high", "medium", "low"],
      action_status: ["todo", "in_progress", "completed", "cancelled"],
      flashcard_format: [
        "multiple_choice",
        "fill_blank",
        "true_false",
        "open_ended",
      ],
      note_priority: ["urgent", "important", "interesting", "none"],
      note_type: [
        "idea",
        "argument",
        "action",
        "quote",
        "question",
        "connection",
        "disagreement",
        "insight",
        "data",
        "example",
        "reflection",
        "definition",
      ],
      relationship_type: [
        "similar_to",
        "contradicts",
        "builds_on",
        "referenced_in",
      ],
    },
  },
} as const
