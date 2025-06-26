"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { liveState } from "@/lib/live-state"
import {
  Users,
  MessageSquare,
  Shield,
  TrendingUp,
  AlertCircle,
  Clock,
  Wifi,
  Database,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
  Power,
  Circle,
  Moon,
  Coffee,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "online" | "away" | "busy" | "offline"
  avatar?: string
  lastSeen: number
  currentChannel?: string
}

interface SystemStats {
  connectedUsers: number
  activeChats: number
  messagesPerHour: number
  systemHealth: "operational" | "warning" | "critical"
  uptime: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
}

interface Activity {
  id: string
  type: "user_joined" | "user_left" | "message_sent" | "project_created" | "assignment_submitted"
  userId: string
  userName: string
  description: string
  timestamp: number
  metadata?: any
}

export default function AdminLiveControl() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [connectedUsers, setConnectedUsers] = useState<User[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats>({
    connectedUsers: 0,
    activeChats: 0,
    messagesPerHour: 0,
    systemHealth: "operational",
    uptime: "99.9%",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0,
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    initializeLiveControl()
    setupLiveListeners()

    const interval = setInterval(() => {
      if (autoRefresh) {
        refreshData()
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      cleanupLiveListeners()
    }
  }, [user, router, autoRefresh])

  const initializeLiveControl = () => {
    loadConnectedUsers()
    loadSystemStats()
    loadRecentActivity()
  }

  const setupLiveListeners = () => {
    liveState.on("user_updated", handleUserUpdate)
    liveState.on("user_removed", handleUserRemoved)
    liveState.on("message_added", handleMessageAdded)
    liveState.on("system_stats_updated", handleSystemStatsUpdate)
  }

  const cleanupLiveListeners = () => {
    liveState.off("user_updated", handleUserUpdate)
    liveState.off("user_removed", handleUserRemoved)
    liveState.off("message_added", handleMessageAdded)
    liveState.off("system_stats_updated", handleSystemStatsUpdate)
  }

  const handleUserUpdate = (userData: User) => {
    setConnectedUsers((prev) => {
      const existing = prev.find((u) => u.id === userData.id)
      if (existing) {
        return prev.map((u) => (u.id === userData.id ? userData : u))
      } else {
        return [...prev, userData]
      }
    })

    // Add to activity feed
    addActivity({
      type: "user_joined",
      userId: userData.id,
      userName: userData.name,
      description: `${userData.name} joined the platform`,
    })
  }

  const handleUserRemoved = (data: { userId: string }) => {
    const user = connectedUsers.find((u) => u.id === data.userId)
    if (user) {
      addActivity({
        type: "user_left",
        userId: user.id,
        userName: user.name,
        description: `${user.name} left the platform`,
      })
    }
    setConnectedUsers((prev) => prev.filter((u) => u.id !== data.userId))
  }

  const handleMessageAdded = (data: { channelId: string; message: any }) => {
    addActivity({
      type: "message_sent",
      userId: data.message.userId,
      userName: data.message.userName,
      description: `Sent message in #${data.channelId}`,
      metadata: { channelId: data.channelId, content: data.message.content.substring(0, 50) },
    })
  }

  const handleSystemStatsUpdate = (stats: SystemStats) => {
    setSystemStats(stats)
  }

  const loadConnectedUsers = () => {
    const users = liveState.getUsers()
    setConnectedUsers(users)
  }

  const loadSystemStats = () => {
    // Simulate real-time system stats
    const stats: SystemStats = {
      connectedUsers: connectedUsers.length,
      activeChats: 5,
      messagesPerHour: Math.floor(Math.random() * 200) + 50,
      systemHealth: "operational",
      uptime: "99.9%",
      cpuUsage: Math.floor(Math.random() * 30) + 20,
      memoryUsage: Math.floor(Math.random() * 40) + 30,
      diskUsage: Math.floor(Math.random() * 20) + 60,
      networkLatency: Math.floor(Math.random() * 20) + 10,
    }
    setSystemStats(stats)
    liveState.updateSystemStats(stats)
  }

  const loadRecentActivity = () => {
    // Load from localStorage or initialize
    const savedActivity = localStorage.getItem("admin_activity_feed")
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity))
    }
  }

  const addActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }

    setRecentActivity((prev) => {
      const updated = [newActivity, ...prev].slice(0, 50) // Keep only last 50 activities
      localStorage.setItem("admin_activity_feed", JSON.stringify(updated))
      return updated
    })
  }

  const refreshData = () => {
    loadConnectedUsers()
    loadSystemStats()
  }

  const broadcastToAll = async () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a broadcast message.",
        variant: "destructive",
      })
      return
    }

    setIsBroadcasting(true)
    try {
      // Simulate broadcast delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const announcement = {
        title: "Admin Broadcast",
        content: broadcastMessage,
        type: "info",
        audience: "all",
        createdBy: user?.id,
      }

      liveState.addAnnouncement(announcement)
      setBroadcastMessage("")

      toast({
        title: "Broadcast Sent! 📢",
        description: "Your message has been sent to all connected users.",
      })

      addActivity({
        type: "message_sent",
        userId: user!.id,
        userName: user!.name,
        description: "Sent broadcast message to all users",
        metadata: { content: broadcastMessage.substring(0, 50) },
      })
    } catch (error) {
      toast({
        title: "Broadcast Failed",
        description: "Failed to send broadcast message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBroadcasting(false)
    }
  }

  const changeUserStatus = (userId: string, newStatus: "online" | "away" | "busy" | "offline") => {
    liveState.updateUserStatus(userId, newStatus)
    const user = connectedUsers.find((u) => u.id === userId)
    if (user) {
      toast({
        title: "Status Updated",
        description: `${user.name}'s status changed to ${newStatus}`,
      })

      addActivity({
        type: "user_joined",
        userId: user.id,
        userName: user.name,
        description: `Status changed to ${newStatus}`,
      })
    }
  }

  const kickUser = (userId: string) => {
    const user = connectedUsers.find((u) => u.id === userId)
    if (user) {
      liveState.removeUser(userId)
      toast({
        title: "User Removed",
        description: `${user.name} has been removed from the platform.`,
      })

      addActivity({
        type: "user_left",
        userId: user.id,
        userName: user.name,
        description: `Removed by admin`,
      })
    }
  }

  const promoteUser = (userId: string) => {
    const user = connectedUsers.find((u) => u.id === userId)
    if (user) {
      // Update user role (in real app, this would update the database)
      const updatedUser = { ...user, role: "admin" }
      liveState.addUser(updatedUser)

      toast({
        title: "User Promoted",
        description: `${user.name} has been promoted to admin.`,
      })

      addActivity({
        type: "user_joined",
        userId: user.id,
        userName: user.name,
        description: `Promoted to admin`,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "away":
        return "text-yellow-500"
      case "busy":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Circle className="h-3 w-3 fill-current" />
      case "away":
        return <Moon className="h-3 w-3 fill-current" />
      case "busy":
        return <Coffee className="h-3 w-3 fill-current" />
      default:
        return <Circle className="h-3 w-3 fill-current opacity-50" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "operational":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Control Panel</h1>
          <p className="text-muted-foreground">Monitor and manage the platform in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <Power className="h-4 w-4" /> : <Power className="h-4 w-4 opacity-50" />}
            Auto Refresh
          </Button>
        </div>
      </motion.div>

      {/* System Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          {
            title: "Connected Users",
            value: systemStats.connectedUsers.toString(),
            icon: <Users className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Active Chats",
            value: systemStats.activeChats.toString(),
            icon: <MessageSquare className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Messages/Hour",
            value: systemStats.messagesPerHour.toString(),
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-purple-500",
          },
          {
            title: "System Health",
            value: systemStats.systemHealth,
            icon: <Shield className="h-5 w-5" />,
            color: getHealthColor(systemStats.systemHealth),
          },
          {
            title: "Uptime",
            value: systemStats.uptime,
            icon: <Clock className="h-5 w-5" />,
            color: "text-orange-500",
          },
          {
            title: "Network",
            value: `${systemStats.networkLatency}ms`,
            icon: <Network className="h-5 w-5" />,
            color: "text-pink-500",
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* System Performance */}
      <motion.div
        className="grid md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { title: "CPU Usage", value: systemStats.cpuUsage, icon: <Cpu className="h-4 w-4" />, color: "bg-blue-500" },
          { title: "Memory", value: systemStats.memoryUsage, icon: <HardDrive className="h-4 w-4" />, color: "bg-green-500" },
          { title: "Disk Usage", value: systemStats.diskUsage, icon: <Database className="h-4 w-4" />, color: "bg-orange-500" },
          { title: "Network", value: systemStats.networkLatency, icon: <Wifi className="h-4 w-4" />, color: "bg-purple-500", suffix: "ms" },
        ].map((metric, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>
                <span className="text-sm font-bold">
                  {metric.value}{metric.suffix || "%"}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${metric.color} transition-all duration-500`}
                  style={{ width: `${metric.suffix ? Math.min(metric.value * 5, 100) : metric.value}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Connected Users */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-card/50 backdrop-blur-sm rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connected Users
            </h2>
            <ul className="space-y-3">
              {connectedUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <span className={`font-medium ${getStatusColor(user.status)}`}>{user.name}</span>
                    <span className="text-xs text-muted-foreground">({user.role})</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => changeUserStatus(user.id, "away")}>Away</Button>
                    <Button size="sm" variant="outline" onClick={() => changeUserStatus(user.id, "busy")}>Busy</Button>
                    <Button size="sm" variant="outline" onClick={() => changeUserStatus(user.id, "online")}>Online</Button>
                    <Button size="sm" variant="destructive" onClick={() => kickUser(user.id)}>Kick</Button>
                    <Button size="sm" variant="secondary" onClick={() => promoteUser(user.id)}>Promote</Button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-card/50 backdrop-blur-sm rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </h2>
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium">{activity.userName}</span>
                  <span className="text-muted-foreground">{activity.description}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Broadcast Message */}
          <motion.div
            className="bg-card/50 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Broadcast Message
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type your message..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                disabled={isBroadcasting}
              />
              <Button onClick={broadcastToAll} disabled={isBroadcasting}>
                {isBroadcasting ? "Sending..." : "Send"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
