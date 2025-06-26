import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student"
  department?: string
  year?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  domain: string
  team_lead_id: string
  team_members: string[]
  progress: number
  status: "active" | "completed" | "on-hold"
  created_at: string
  updated_at: string
  likes: number
  views: number
  image_url?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  created_by: string
  target_audience: "all" | "students" | "specific"
  status: "active" | "completed" | "draft"
  attachments?: string[]
  created_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content: string
  attachments?: string[]
  submitted_at: string
  grade?: number
  feedback?: string
}

export interface ChatMessage {
  id: string
  channel_id: string
  user_id: string
  content: string
  message_type: "text" | "file" | "image"
  attachments?: string[]
  created_at: string
  edited_at?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "urgent"
  audience: "all" | "students" | "teachers" | "admins"
  created_by: string
  created_at: string
  is_active: boolean
}
