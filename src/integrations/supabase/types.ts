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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_deletion_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          line1: string
          name: string
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          line1: string
          name: string
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          line1?: string
          name?: string
          phone?: string
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string
          id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          id: string
          image_key: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          id: string
          image_key?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          id?: string
          image_key?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          ends_at: string
          id: string
          max_discount_paise: number
          min_subtotal_paise: number
          percent: number
          starts_at: string
        }
        Insert: {
          active?: boolean
          code: string
          ends_at: string
          id?: string
          max_discount_paise: number
          min_subtotal_paise?: number
          percent: number
          starts_at: string
        }
        Update: {
          active?: boolean
          code?: string
          ends_at?: string
          id?: string
          max_discount_paise?: number
          min_subtotal_paise?: number
          percent?: number
          starts_at?: string
        }
        Relationships: []
      }
      fulfillments: {
        Row: {
          carrier: string | null
          id: string
          item_id: string
          order_id: string
          status: string
          supplier_id: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          carrier?: string | null
          id?: string
          item_id: string
          order_id: string
          status?: string
          supplier_id?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          id?: string
          item_id?: string
          order_id?: string
          status?: string
          supplier_id?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fulfillments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fulfillments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fulfillments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          product_id: string
          quantity: number
          reserved: number
        }
        Insert: {
          product_id: string
          quantity?: number
          reserved?: number
        }
        Update: {
          product_id?: string
          quantity?: number
          reserved?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          actor_id: string | null
          created_at: string
          delta: number
          id: string
          product_id: string
          reason: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          delta: number
          id?: string
          product_id: string
          reason: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          delta?: number
          id?: string
          product_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          fulfillment_model: string
          id: string
          name: string
          order_id: string
          product_id: string
          quantity: number
          return_days: number
          sku: string
          tax_bps: number
          unit_price_paise: number
        }
        Insert: {
          fulfillment_model: string
          id?: string
          name: string
          order_id: string
          product_id: string
          quantity: number
          return_days?: number
          sku: string
          tax_bps: number
          unit_price_paise: number
        }
        Update: {
          fulfillment_model?: string
          id?: string
          name?: string
          order_id?: string
          product_id?: string
          quantity?: number
          return_days?: number
          sku?: string
          tax_bps?: number
          unit_price_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_requests: {
        Row: {
          created_at: string
          id: string
          kind: string
          order_id: string
          reason: string
          staff_note: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          order_id: string
          reason: string
          staff_note?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          order_id?: string
          reason?: string
          staff_note?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_snapshot: Json | null
          cod_collected_at: string | null
          cod_collection_reference: string | null
          created_at: string
          delivered_at: string | null
          discount_paise: number
          id: string
          idempotency_key: string | null
          payment_method: string
          payment_status: string
          reservation_expires_at: string | null
          shipping_paise: number
          status: string
          subtotal_paise: number
          tax_paise: number
          total_paise: number
          user_id: string | null
        }
        Insert: {
          address_snapshot?: Json | null
          cod_collected_at?: string | null
          cod_collection_reference?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_paise?: number
          id?: string
          idempotency_key?: string | null
          payment_method?: string
          payment_status?: string
          reservation_expires_at?: string | null
          shipping_paise?: number
          status?: string
          subtotal_paise?: number
          tax_paise?: number
          total_paise: number
          user_id?: string | null
        }
        Update: {
          address_snapshot?: Json | null
          cod_collected_at?: string | null
          cod_collection_reference?: string | null
          created_at?: string
          delivered_at?: string | null
          discount_paise?: number
          id?: string
          idempotency_key?: string | null
          payment_method?: string
          payment_status?: string
          reservation_expires_at?: string | null
          shipping_paise?: number
          status?: string
          subtotal_paise?: number
          tax_paise?: number
          total_paise?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhook_events: {
        Row: {
          event_type: string
          id: string
          received_at: string
          result: string
        }
        Insert: {
          event_type: string
          id: string
          received_at?: string
          result: string
        }
        Update: {
          event_type?: string
          id?: string
          received_at?: string
          result?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_paise: number
          id: string
          order_id: string
          provider_order_id: string
          provider_payment_id: string | null
          status: string
        }
        Insert: {
          amount_paise: number
          id?: string
          order_id: string
          provider_order_id: string
          provider_payment_id?: string | null
          status?: string
        }
        Update: {
          amount_paise?: number
          id?: string
          order_id?: string
          provider_order_id?: string
          provider_payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          object_path: string
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          object_path: string
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          object_path?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          id: string
          name: string
          price_paise: number
          product_id: string
          sku: string
        }
        Insert: {
          active?: boolean
          id?: string
          name: string
          price_paise: number
          product_id: string
          sku: string
        }
        Update: {
          active?: boolean
          id?: string
          name?: string
          price_paise?: number
          product_id?: string
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          fulfillment_model: string
          id: string
          image_key: string
          is_demo: boolean
          name: string
          price_paise: number
          return_days: number
          sku: string
          status: string
          tax_bps: number | null
          tax_inclusive: boolean
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string
          fulfillment_model?: string
          id: string
          image_key: string
          is_demo?: boolean
          name: string
          price_paise: number
          return_days?: number
          sku: string
          status?: string
          tax_bps?: number | null
          tax_inclusive?: boolean
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          fulfillment_model?: string
          id?: string
          image_key?: string
          is_demo?: boolean
          name?: string
          price_paise?: number
          return_days?: number
          sku?: string
          status?: string
          tax_bps?: number | null
          tax_inclusive?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          phone: string | null
          preferences: Json
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          phone?: string | null
          preferences?: Json
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          phone?: string | null
          preferences?: Json
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_paise: number
          completed_at: string | null
          created_at: string
          id: string
          order_id: string
          request_id: string
          status: string
          transfer_reference: string | null
        }
        Insert: {
          amount_paise: number
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id: string
          request_id: string
          status?: string
          transfer_reference?: string | null
        }
        Update: {
          amount_paise?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id?: string
          request_id?: string
          status?: string
          transfer_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "order_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_rules: {
        Row: {
          active: boolean
          cod_enabled: boolean
          fee_paise: number
          id: string
          max_days: number
          min_days: number
          pincode: string
        }
        Insert: {
          active?: boolean
          cod_enabled?: boolean
          fee_paise: number
          id?: string
          max_days: number
          min_days: number
          pincode: string
        }
        Update: {
          active?: boolean
          cod_enabled?: boolean
          fee_paise?: number
          id?: string
          max_days?: number
          min_days?: number
          pincode?: string
        }
        Relationships: []
      }
      supplier_products: {
        Row: {
          available: boolean
          cost_paise: number
          dispatch_sla_days: number | null
          id: string
          product_id: string
          return_rules: string | null
          supplier_id: string
          supplier_sku: string
        }
        Insert: {
          available?: boolean
          cost_paise: number
          dispatch_sla_days?: number | null
          id?: string
          product_id: string
          return_rules?: string | null
          supplier_id: string
          supplier_sku: string
        }
        Update: {
          available?: boolean
          cost_paise?: number
          dispatch_sla_days?: number | null
          id?: string
          product_id?: string
          return_rules?: string | null
          supplier_id?: string
          supplier_sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_tasks: {
        Row: {
          attempts: number
          due_at: string | null
          fulfillment_id: string
          id: string
          last_error: string | null
          next_attempt_at: string
          status: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          due_at?: string | null
          fulfillment_id: string
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          status?: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          due_at?: string | null
          fulfillment_id?: string
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          status?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_tasks_fulfillment_id_fkey"
            columns: ["fulfillment_id"]
            isOneToOne: true
            referencedRelation: "fulfillments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_tasks_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          approved: boolean
          contact_email: string | null
          created_at: string
          id: string
          manual_fulfillment: boolean
          name: string
        }
        Insert: {
          approved?: boolean
          contact_email?: string | null
          created_at?: string
          id?: string
          manual_fulfillment?: boolean
          name: string
        }
        Update: {
          approved?: boolean
          contact_email?: string | null
          created_at?: string
          id?: string
          manual_fulfillment?: boolean
          name?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          product_id: string
          user_id: string
        }
        Insert: {
          product_id: string
          user_id: string
        }
        Update: {
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_inventory: {
        Args: { _delta: number; _product: string; _reason: string }
        Returns: undefined
      }
      check_delivery: { Args: { _pincode: string }; Returns: Json }
      collect_cod: {
        Args: { _amount: number; _order: string; _reference: string }
        Returns: undefined
      }
      complete_cod_refund: {
        Args: { _id: string; _reference: string }
        Returns: undefined
      }
      complete_cod_request: {
        Args: { _note: string; _request: string }
        Returns: undefined
      }
      place_cod_order: {
        Args: {
          _address: Json
          _coupon: string
          _expected: number
          _items: Json
          _key: string
        }
        Returns: string
      }
      prepare_account_deletion: { Args: never; Returns: undefined }
      preview_coupon: { Args: { _code: string; _items: Json }; Returns: Json }
      quote_cod_order: {
        Args: { _coupon?: string; _items: Json; _pincode: string }
        Returns: Json
      }
      record_captured_payment: {
        Args: {
          _amount: number
          _event: string
          _payment: string
          _provider_order: string
        }
        Returns: undefined
      }
      release_unpaid_order: { Args: { _order: string }; Returns: undefined }
      request_order_action: {
        Args: { _kind: string; _order: string; _reason: string }
        Returns: string
      }
      reserve_customer_order: {
        Args: { _address: string; _items: Json; _key: string; _user: string }
        Returns: string
      }
      review_order_request: {
        Args: { _id: string; _note: string; _status: string }
        Returns: undefined
      }
      scrub_retained_requests: { Args: never; Returns: undefined }
      staff_has_role: { Args: { allowed: string[] }; Returns: boolean }
      update_fulfillment: {
        Args: {
          _carrier: string
          _id: string
          _status: string
          _tracking: string
          _url: string
        }
        Returns: undefined
      }
      update_supplier_task: {
        Args: { _action: string; _id: string; _note: string }
        Returns: undefined
      }
      update_support_ticket: {
        Args: { _id: string; _status: string }
        Returns: undefined
      }
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
