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
      institutions: {
        Row: {
          id: string
          name: string
          type: "cc" | "university"
          state: string
          city: string | null
          abbreviation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: "cc" | "university"
          state: string
          city?: string | null
          abbreviation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: "cc" | "university"
          state?: string
          city?: string | null
          abbreviation?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          institution_id: string
          code: string
          title: string
          units: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          institution_id: string
          code: string
          title: string
          units: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          institution_id?: string
          code?: string
          title?: string
          units?: number
          description?: string | null
          created_at?: string
        }
      }
      articulation_agreements: {
        Row: {
          id: string
          cc_course_id: string
          university_course_id: string
          cc_institution_id: string
          university_institution_id: string
          major: string | null
          effective_year: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cc_course_id: string
          university_course_id: string
          cc_institution_id: string
          university_institution_id: string
          major?: string | null
          effective_year: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cc_course_id?: string
          university_course_id?: string
          cc_institution_id?: string
          university_institution_id?: string
          major?: string | null
          effective_year?: number
          notes?: string | null
          created_at?: string
        }
      }
      prerequisites: {
        Row: {
          id: string
          course_id: string
          prerequisite_course_id: string
          is_corequisite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          prerequisite_course_id: string
          is_corequisite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          prerequisite_course_id?: string
          is_corequisite?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      transfer_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          cc_institution_id: string
          target_institution_id: string
          target_major: string
          status: "draft" | "active" | "completed"
          plan_data: Json | null
          chat_history: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          cc_institution_id: string
          target_institution_id: string
          target_major: string
          status?: "draft" | "active" | "completed"
          plan_data?: Json | null
          chat_history?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          cc_institution_id?: string
          target_institution_id?: string
          target_major?: string
          status?: "draft" | "active" | "completed"
          plan_data?: Json | null
          chat_history?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      plan_courses: {
        Row: {
          id: string
          plan_id: string
          course_id: string | null
          semester_number: number
          status: "planned" | "in_progress" | "completed" | "cancelled" | "waitlisted" | "failed"
          alternative_for: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          course_id?: string | null
          semester_number: number
          status?: "planned" | "in_progress" | "completed" | "cancelled" | "waitlisted" | "failed"
          alternative_for?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          course_id?: string | null
          semester_number?: number
          status?: "planned" | "in_progress" | "completed" | "cancelled" | "waitlisted" | "failed"
          alternative_for?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      failure_events: {
        Row: {
          id: string
          plan_id: string
          plan_course_id: string
          failure_type: "cancelled" | "waitlisted" | "failed"
          resolution: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          plan_course_id: string
          failure_type: "cancelled" | "waitlisted" | "failed"
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          plan_course_id?: string
          failure_type?: "cancelled" | "waitlisted" | "failed"
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
        }
      }
      playbooks: {
        Row: {
          id: string
          user_id: string
          cc_institution_id: string
          target_institution_id: string
          target_major: string
          transfer_year: number
          outcome: "transferred" | "in_progress" | "changed_direction"
          verification_status: "pending" | "verified" | "rejected"
          playbook_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cc_institution_id: string
          target_institution_id: string
          target_major: string
          transfer_year: number
          outcome: "transferred" | "in_progress" | "changed_direction"
          verification_status?: "pending" | "verified" | "rejected"
          playbook_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cc_institution_id?: string
          target_institution_id?: string
          target_major?: string
          transfer_year?: number
          outcome?: "transferred" | "in_progress" | "changed_direction"
          verification_status?: "pending" | "verified" | "rejected"
          playbook_data?: Json | null
          created_at?: string
        }
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
  }
}
