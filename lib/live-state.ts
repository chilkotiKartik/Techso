// Global state manager for live updates
class LiveStateManager {
  private events: Map<string, EventCallback[]> = new Map()
  private storage: Storage | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.storage = window.localStorage
      // Listen for storage changes across tabs
      window.addEventListener("storage", this.handleStorageChange.bind(this))
    }
  }

  // Subscribe to events
  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }

  // Unsubscribe from events
  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Emit events
  emit(event: string, data: any) {
    // Emit to local listeners
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }

    // Store in localStorage for cross-tab communication
    if (this.storage) {
      const eventData = {
        event,
        data,
        timestamp: Date.now(),
      }
      this.storage.setItem(`live_event_${event}`, JSON.stringify(eventData))
    }
  }

  // Handle storage changes from other tabs
  private handleStorageChange(e: StorageEvent) {
    if (e.key?.startsWith("live_event_")) {
      const event = e.key.replace("live_event_", "")
      if (e.newValue) {
        try {
          const eventData = JSON.parse(e.newValue)
          const callbacks = this.events.get(event)
          if (callbacks) {
            callbacks.forEach((callback) => callback(eventData.data))
          }
        } catch (error) {
          console.error("Error parsing live event:", error)
        }
      }
    }
  }

  // Get data from storage
  getData(key: string) {
    if (!this.storage) return null
    try {
      const data = this.storage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error getting data:", error)
      return null
    }
  }

  // Set data in storage
  setData(key: string, data: any) {
    if (!this.storage) return
    try {
      this.storage.setItem(key, JSON.stringify(data))
      this.emit("data_updated", { key, data })
    } catch (error) {
      console.error("Error setting data:", error)
    }
  }

  // Remove data from storage
  removeData(key: string) {
    if (!this.storage) return
    this.storage.removeItem(key)
    this.emit("data_removed", { key })
  }

  // Get all users
  getUsers() {
    return this.getData("live_users") || []
  }

  // Add user
  addUser(user: any) {
    const users = this.getUsers()
    const existingIndex = users.findIndex((u: any) => u.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user, lastSeen: Date.now() }
    } else {
      users.push({ ...user, lastSeen: Date.now() })
    }
    this.setData("live_users", users)
    this.emit("user_updated", user)
  }

  // Remove user
  removeUser(userId: string) {
    const users = this.getUsers().filter((u: any) => u.id !== userId)
    this.setData("live_users", users)
    this.emit("user_removed", { userId })
  }

  // Update user status
  updateUserStatus(userId: string, status: string) {
    const users = this.getUsers()
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex >= 0) {
      users[userIndex].status = status
      users[userIndex].lastSeen = Date.now()
      this.setData("live_users", users)
      this.emit("user_status_updated", { userId, status })
    }
  }

  // Chat methods
  getMessages(channelId: string) {
    return this.getData(`chat_messages_${channelId}`) || []
  }

  addMessage(channelId: string, message: any) {
    const messages = this.getMessages(channelId)
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    messages.push(newMessage)
    this.setData(`chat_messages_${channelId}`, messages)
    this.emit("message_added", { channelId, message: newMessage })
    return newMessage
  }

  // Typing indicators
  setTyping(channelId: string, userId: string, isTyping: boolean) {
    const typingKey = `typing_${channelId}`
    const typing = this.getData(typingKey) || {}

    if (isTyping) {
      typing[userId] = Date.now()
    } else {
      delete typing[userId]
    }

    this.setData(typingKey, typing)
    this.emit("typing_updated", { channelId, typing })
  }

  getTyping(channelId: string) {
    const typing = this.getData(`typing_${channelId}`) || {}
    const now = Date.now()
    // Remove old typing indicators (older than 5 seconds)
    Object.keys(typing).forEach((userId) => {
      if (now - typing[userId] > 5000) {
        delete typing[userId]
      }
    })
    return typing
  }

  // Announcements
  getAnnouncements() {
    return this.getData("live_announcements") || []
  }

  addAnnouncement(announcement: any) {
    const announcements = this.getAnnouncements()
    const newAnnouncement = {
      ...announcement,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    announcements.unshift(newAnnouncement)
    this.setData("live_announcements", announcements)
    this.emit("announcement_added", newAnnouncement)
    return newAnnouncement
  }

  // System stats
  updateSystemStats(stats: any) {
    this.setData("system_stats", { ...stats, lastUpdated: Date.now() })
    this.emit("system_stats_updated", stats)
  }

  getSystemStats() {
    return (
      this.getData("system_stats") || {
        connectedUsers: 0,
        activeChats: 0,
        systemHealth: "operational",
        uptime: "99.9%",
        lastUpdated: Date.now(),
      }
    )
  }
}

// Create singleton instance
export const liveState = new LiveStateManager()

// Helper hooks for React components
export const useLiveState = () => {
  return liveState
}

export default liveState

type EventCallback = (data: any) => void

// Live chat message interface
export interface LiveMessage {
  id: string
  channelId: string
  userId: string
  userName: string
  userAvatar: string
  userRole: string
  content: string
  timestamp: number
  type: "text" | "image" | "file" | "system"
  reactions?: { emoji: string; users: string[] }[]
  isEdited?: boolean
  replyTo?: string
}

// Live announcement interface
export interface LiveAnnouncement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "urgent"
  audience: "all" | "students" | "teachers" | "admins"
  createdBy: string
  createdAt: number
  isActive: boolean
  priority: "low" | "medium" | "high"
}

// Live project submission interface
export interface LiveProjectSubmission {
  id: string
  projectTitle: string
  studentId: string
  studentName: string
  teamMembers: string[]
  description: string
  githubLink?: string
  demoLink?: string
  status: "pending" | "approved" | "rejected" | "revision"
  submittedAt: number
  reviewedAt?: number
  reviewedBy?: string
  score?: number
  feedback?: string
}
