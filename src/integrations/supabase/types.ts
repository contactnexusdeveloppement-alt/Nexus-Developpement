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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      call_booking_notes: {
        Row: {
          call_booking_id: string
          call_outcome: string | null
          call_summary: string | null
          callback_date: string | null
          created_at: string | null
          follow_up_actions: string | null
          id: string
          internal_notes: string | null
          updated_at: string | null
        }
        Insert: {
          call_booking_id: string
          call_outcome?: string | null
          call_summary?: string | null
          callback_date?: string | null
          created_at?: string | null
          follow_up_actions?: string | null
          id?: string
          internal_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          call_booking_id?: string
          call_outcome?: string | null
          call_summary?: string | null
          callback_date?: string | null
          created_at?: string | null
          follow_up_actions?: string | null
          id?: string
          internal_notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_booking_notes_call_booking_id_fkey"
            columns: ["call_booking_id"]
            isOneToOne: true
            referencedRelation: "call_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      call_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          duration: number
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          status: string
          time_slot: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          duration?: number
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          status?: string
          time_slot: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          duration?: number
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          time_slot?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_call_notes: {
        Row: {
          app_main_features: string | null
          automation_users: string | null
          call_date: string | null
          call_notes: string | null
          call_status: string | null
          client_accepted: boolean | null
          competitors: string | null
          content_ready: boolean | null
          created_at: string | null
          current_tools: string | null
          delivery_methods: string | null
          deposit_amount: number | null
          deposit_received: boolean | null
          domain_name: string | null
          elements_to_avoid: string | null
          estimated_delivery_date: string | null
          estimated_pages: number | null
          estimated_start_date: string | null
          estimated_volume: string | null
          example_sites: string | null
          execution_frequency: string | null
          existing_brand_guidelines: boolean | null
          existing_tagline: string | null
          has_domain: boolean | null
          has_existing_logo: boolean | null
          has_hosting: boolean | null
          hosting_details: string | null
          id: string
          inspirations: string | null
          logo_received_by_email: boolean | null
          main_contact_name: string | null
          main_contact_role: string | null
          multilingual_languages: string | null
          needs_analytics: boolean | null
          needs_authentication: boolean | null
          needs_blog: boolean | null
          needs_booking: boolean | null
          needs_camera_access: boolean | null
          needs_chat: boolean | null
          needs_contact_form: boolean | null
          needs_gallery: boolean | null
          needs_geolocation: boolean | null
          needs_invoicing: boolean | null
          needs_multilingual: boolean | null
          needs_newsletter: boolean | null
          needs_offline_mode: boolean | null
          needs_payment: boolean | null
          needs_professional_photos: boolean | null
          needs_push_notifications: boolean | null
          needs_social_integration: boolean | null
          needs_stock_management: boolean | null
          needs_store_publication: boolean | null
          needs_training: boolean | null
          needs_user_accounts: boolean | null
          other_features: string | null
          payment_methods: string | null
          preferred_colors: string | null
          preferred_communication: string | null
          preferred_fonts: string | null
          price_details: string | null
          product_count: number | null
          project_objectives: string | null
          proposed_price: number | null
          quote_request_id: string
          recurring_budget: string | null
          seo_important: boolean | null
          seo_keywords: string | null
          social_media_presence: string | null
          style_preferences: string | null
          target_audience: string | null
          target_platforms: string | null
          tasks_to_automate: string | null
          third_party_integrations: string | null
          updated_at: string | null
          urgency_level: string | null
          urgent_deadline: string | null
          validation_availability: string | null
          wants_maintenance_contract: boolean | null
          who_updates_after: string | null
        }
        Insert: {
          app_main_features?: string | null
          automation_users?: string | null
          call_date?: string | null
          call_notes?: string | null
          call_status?: string | null
          client_accepted?: boolean | null
          competitors?: string | null
          content_ready?: boolean | null
          created_at?: string | null
          current_tools?: string | null
          delivery_methods?: string | null
          deposit_amount?: number | null
          deposit_received?: boolean | null
          domain_name?: string | null
          elements_to_avoid?: string | null
          estimated_delivery_date?: string | null
          estimated_pages?: number | null
          estimated_start_date?: string | null
          estimated_volume?: string | null
          example_sites?: string | null
          execution_frequency?: string | null
          existing_brand_guidelines?: boolean | null
          existing_tagline?: string | null
          has_domain?: boolean | null
          has_existing_logo?: boolean | null
          has_hosting?: boolean | null
          hosting_details?: string | null
          id?: string
          inspirations?: string | null
          logo_received_by_email?: boolean | null
          main_contact_name?: string | null
          main_contact_role?: string | null
          multilingual_languages?: string | null
          needs_analytics?: boolean | null
          needs_authentication?: boolean | null
          needs_blog?: boolean | null
          needs_booking?: boolean | null
          needs_camera_access?: boolean | null
          needs_chat?: boolean | null
          needs_contact_form?: boolean | null
          needs_gallery?: boolean | null
          needs_geolocation?: boolean | null
          needs_invoicing?: boolean | null
          needs_multilingual?: boolean | null
          needs_newsletter?: boolean | null
          needs_offline_mode?: boolean | null
          needs_payment?: boolean | null
          needs_professional_photos?: boolean | null
          needs_push_notifications?: boolean | null
          needs_social_integration?: boolean | null
          needs_stock_management?: boolean | null
          needs_store_publication?: boolean | null
          needs_training?: boolean | null
          needs_user_accounts?: boolean | null
          other_features?: string | null
          payment_methods?: string | null
          preferred_colors?: string | null
          preferred_communication?: string | null
          preferred_fonts?: string | null
          price_details?: string | null
          product_count?: number | null
          project_objectives?: string | null
          proposed_price?: number | null
          quote_request_id: string
          recurring_budget?: string | null
          seo_important?: boolean | null
          seo_keywords?: string | null
          social_media_presence?: string | null
          style_preferences?: string | null
          target_audience?: string | null
          target_platforms?: string | null
          tasks_to_automate?: string | null
          third_party_integrations?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          urgent_deadline?: string | null
          validation_availability?: string | null
          wants_maintenance_contract?: boolean | null
          who_updates_after?: string | null
        }
        Update: {
          app_main_features?: string | null
          automation_users?: string | null
          call_date?: string | null
          call_notes?: string | null
          call_status?: string | null
          client_accepted?: boolean | null
          competitors?: string | null
          content_ready?: boolean | null
          created_at?: string | null
          current_tools?: string | null
          delivery_methods?: string | null
          deposit_amount?: number | null
          deposit_received?: boolean | null
          domain_name?: string | null
          elements_to_avoid?: string | null
          estimated_delivery_date?: string | null
          estimated_pages?: number | null
          estimated_start_date?: string | null
          estimated_volume?: string | null
          example_sites?: string | null
          execution_frequency?: string | null
          existing_brand_guidelines?: boolean | null
          existing_tagline?: string | null
          has_domain?: boolean | null
          has_existing_logo?: boolean | null
          has_hosting?: boolean | null
          hosting_details?: string | null
          id?: string
          inspirations?: string | null
          logo_received_by_email?: boolean | null
          main_contact_name?: string | null
          main_contact_role?: string | null
          multilingual_languages?: string | null
          needs_analytics?: boolean | null
          needs_authentication?: boolean | null
          needs_blog?: boolean | null
          needs_booking?: boolean | null
          needs_camera_access?: boolean | null
          needs_chat?: boolean | null
          needs_contact_form?: boolean | null
          needs_gallery?: boolean | null
          needs_geolocation?: boolean | null
          needs_invoicing?: boolean | null
          needs_multilingual?: boolean | null
          needs_newsletter?: boolean | null
          needs_offline_mode?: boolean | null
          needs_payment?: boolean | null
          needs_professional_photos?: boolean | null
          needs_push_notifications?: boolean | null
          needs_social_integration?: boolean | null
          needs_stock_management?: boolean | null
          needs_store_publication?: boolean | null
          needs_training?: boolean | null
          needs_user_accounts?: boolean | null
          other_features?: string | null
          payment_methods?: string | null
          preferred_colors?: string | null
          preferred_communication?: string | null
          preferred_fonts?: string | null
          price_details?: string | null
          product_count?: number | null
          project_objectives?: string | null
          proposed_price?: number | null
          quote_request_id?: string
          recurring_budget?: string | null
          seo_important?: boolean | null
          seo_keywords?: string | null
          social_media_presence?: string | null
          style_preferences?: string | null
          target_audience?: string | null
          target_platforms?: string | null
          tasks_to_automate?: string | null
          third_party_integrations?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          urgent_deadline?: string | null
          validation_availability?: string | null
          wants_maintenance_contract?: boolean | null
          who_updates_after?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_call_notes_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: true
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      client_statuses: {
        Row: {
          client_email: string
          created_at: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_email: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_email?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          budget: string | null
          business_type: string | null
          consent_given: boolean
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          project_details: string | null
          services: string[]
          status: string
          timeline: string | null
        }
        Insert: {
          budget?: string | null
          business_type?: string | null
          consent_given?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          project_details?: string | null
          services: string[]
          status?: string
          timeline?: string | null
        }
        Update: {
          budget?: string | null
          business_type?: string | null
          consent_given?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          project_details?: string | null
          services?: string[]
          status?: string
          timeline?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_booked_slots: {
        Args: { p_booking_date: string }
        Returns: {
          duration: number
          time_slot: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
