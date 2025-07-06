import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const db = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
    return { data, error }
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()
    return { data, error }
  },

  async createUser(userData: any) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()
    return { data, error }
  },

  // Assignments
  async getAssignments(userId?: string) {
    let query = supabase
      .from("assignments")
      .select(`
        *,
        created_by_user:users!assignments_created_by_fkey(name, avatar_url),
        submissions:assignment_submissions(*)
      `)
      .order("due_date", { ascending: true })

    if (userId) {
      query = query.or(`created_by.eq.${userId}`)
    }

    const { data, error } = await query
    return { data, error }
  },

  async getAssignment(id: string) {
    const { data, error } = await supabase
      .from("assignments")
      .select(`
        *,
        created_by_user:users!assignments_created_by_fkey(name, avatar_url),
        submissions:assignment_submissions(
          *,
          student:users!assignment_submissions_student_id_fkey(name, avatar_url)
        )
      `)
      .eq("id", id)
      .single()
    return { data, error }
  },

  async createAssignment(assignmentData: any) {
    const { data, error } = await supabase.from("assignments").insert([assignmentData]).select().single()
    return { data, error }
  },

  async submitAssignment(submissionData: any) {
    const { data, error } = await supabase.from("assignment_submissions").upsert([submissionData]).select().single()
    return { data, error }
  },

  async updateSubmission(id: string, updates: any) {
    const { data, error } = await supabase.from("assignment_submissions").update(updates).eq("id", id).select().single()
    return { data, error }
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        created_by_user:users!projects_created_by_fkey(name, avatar_url),
        members:project_members(
          user:users(name, avatar_url)
        )
      `)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  async createProject(projectData: any) {
    const { data, error } = await supabase.from("projects").insert([projectData]).select().single()
    return { data, error }
  },

  // Achievements
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId)
    return { data, error }
  },

  async updateAchievementProgress(userId: string, achievementId: string, progress: number) {
    const { data, error } = await supabase
      .from("user_achievements")
      .upsert([
        {
          user_id: userId,
          achievement_id: achievementId,
          progress,
          earned: progress >= 100,
          earned_at: progress >= 100 ? new Date().toISOString() : null,
        },
      ])
      .select()
    return { data, error }
  },

  // Chat
  async getMessages(channelId: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
    return { data, error }
  },

  async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select(`
        *,
        user:users(name, avatar_url)
      `)
      .single()
    return { data, error }
  },

  // Announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select(`
        *,
        created_by_user:users!announcements_created_by_fkey(name, avatar_url)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    return { data, error }
  },

  async createAnnouncement(announcementData: any) {
    const { data, error } = await supabase.from("announcements").insert([announcementData]).select().single()
    return { data, error }
  },

  // Activity logs
  async logActivity(activityData: any) {
    const { data, error } = await supabase.from("activity_logs").insert([activityData])
    return { data, error }
  },
}

// Real-time subscriptions
export const subscriptions = {
  onAssignmentSubmissions(callback: (payload: any) => void) {
    return supabase
      .channel("assignment_submissions")
      .on("postgres_changes", { event: "*", schema: "public", table: "assignment_submissions" }, callback)
      .subscribe()
  },

  onMessages(channelId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`messages_${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `channel_id=eq.${channelId}` },
        callback,
      )
      .subscribe()
  },

  onAnnouncements(callback: (payload: any) => void) {
    return supabase
      .channel("announcements")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "announcements" }, callback)
      .subscribe()
  },
}
