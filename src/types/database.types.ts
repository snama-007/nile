export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      users_public: {
        Row: {
          handle: string
          name: string | null
          created_at: string
        }
        Insert: {
          handle: string
          name?: string | null
          created_at?: string
        }
        Update: {
          handle?: string
          name?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          user_handle: string
          vendor_id: string
          task_type: 'info' | 'action' | 'payment' | 'reminder' | 'approval' | 'handoff' | 'confirm' | 'warning' | 'complete'
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_handle: string
          vendor_id: string
          task_type: 'info' | 'action' | 'payment' | 'reminder' | 'approval' | 'handoff' | 'confirm' | 'warning' | 'complete'
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_handle?: string
          vendor_id?: string
          task_type?: 'info' | 'action' | 'payment' | 'reminder' | 'approval' | 'handoff' | 'confirm' | 'warning' | 'complete'
          status?: string
          created_at?: string
        }
      }
      updates: {
        Row: {
          id: string
          task_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          message?: string
          created_at?: string
        }
      }
    }
  }
}

