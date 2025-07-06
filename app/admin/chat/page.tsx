"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Send,
  Paperclip,
  Smile,
  Users,
  Search,
  Phone,
  Video,
  MoreVertical,
  Hash,
  Lock,
  Plus,
  Settings,
  Pin,
  Reply,
  Download,
  File,
  AlertCircle,
} from "lucide-react"

interface Message {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    role: string
    isOnline: boolean
  }
  timestamp: string
  type: "text" | "image" | "file" | "link"
  attachments?: {
    name: string
    url: string
    type: string
    size?: string
  }[]
  reactions?: {
    emoji: string
    users: string[]
  }[]
  isEdited?: boolean
  replyTo?: string
}

interface Channel {
  id: string
  name: string
  description: string
  type: "public" | "private" | "direct"
  members: number
  isActive: boolean
  lastMessage?: {
    content: string
    timestamp: string
    author: string
  }
  unreadCount: number
}

export default function AdminChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  const mockChannels: Channel[] = [
    {
      id: "general",
      name: "general",
      description: "General discussions and announcements",
      type: "public",
      members: 245,
      isActive: true,
      lastMessage: {
        content: "Welcome to the new chat system!",
        timestamp: "2024-01-20T10:30:00Z",
        author: "Dr. Sarah Johnson",
      },
      unreadCount: 3,
    },
    {
      id: "projects",
      name: "projects",
      description: "Project discussions and updates",
      type: "public",
      members: 189,
      isActive: true,
      lastMessage: {
        content: "Great progress on the AI Music Composer!",
        timestamp: "2024-01-20T09:15:00Z",
        author: "Alex Rodriguez",
      },
      unreadCount: 1,
    },
    {
      id: "announcements",
      name: "announcements",
      description: "Official announcements only",
      type: "public",
      members: 312,
      isActive: true,
      lastMessage: {
        content: "System maintenance scheduled for tonight",
        timestamp: "2024-01-19T16:45:00Z",
        author: "Admin",
      },
      unreadCount: 0,
    },
    {
      id: "ai-research",
      name: "ai-research",
      description: "AI and Machine Learning discussions",
      type: "private",
      members: 45,
      isActive: true,
      lastMessage: {
        content: "Check out this new research paper",
        timestamp: "2024-01-19T14:20:00Z",
        author: "Prof. Michael Chen",
      },
      unreadCount: 5,
    },
  ]

  const mockMessages: Message[] = [
    {
      id: "1",
      content: "Welcome everyone to our new workspace chat! 🎉",
      author: {
        id: "admin-1",
        name: "Dr. Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
        role: "Admin",
        isOnline: true,
      },
      timestamp: "2024-01-20T10:30:00Z",
      type: "text",
      reactions: [
        { emoji: "🎉", users: ["user1", "user2", "user3"] },
        { emoji: "👏", users: ["user4", "user5"] },
      ],
    },
    {
      id: "2",
      content: "This looks amazing! Can we share files here?",
      author: {
        id: "student-1",
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
        role: "Student",
        isOnline: true,
      },
      timestamp: "2024-01-20T10:32:00Z",
      type: "text",
    },
    {
      id: "3",
      content: "Yes! You can share files, images, and links. Here's our project documentation:",
      author: {
        id: "teacher-1",
        name: "Prof. Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        role: "Teacher",
        isOnline: false,
      },
      timestamp: "2024-01-20T10:35:00Z",
      type: "file",
      attachments: [
        {
          name: "Project_Guidelines.pdf",
          url: "#",
          type: "pdf",
          size: "2.4 MB",
        },
      ],
    },
    {
      id: "4",
      content: "Perfect! This will make collaboration so much easier. 🚀",
      author: {
        id: "student-2",
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
        role: "Student",
        isOnline: true,
      },
      timestamp: "2024-01-20T10:38:00Z",
      type: "text",
      reactions: [{ emoji: "🚀", users: ["admin-1", "teacher-1"] }],
    },
  ]

  const mockOnlineUsers = [
    {
      id: "admin-1",
      name: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
      role: "Admin",
      status: "online",
    },
    {
      id: "student-1",
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      role: "Student",
      status: "online",
    },
    {
      id: "student-2",
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
      role: "Student",
      status: "online",
    },
  ]

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setChannels(mockChannels)
      setActiveChannel("general")
      setMessages(mockMessages)
      setOnlineUsers(mockOnlineUsers)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      author: {
        id: user?.id || "",
        name: user?.name || "",
        avatar: user?.avatar || "",
        role: user?.role || "",
        isOnline: true,
      },
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate real-time message delivery
    toast({
      title: "Message Sent! 💬",
      description: "Your message has been delivered to the channel.",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "public":
        return <Hash className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      case "direct":
        return <Users className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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
    <div className="h-[calc(100vh-5rem)] flex">
      {/* Sidebar */}
      <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workspace Chat</h2>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search channels..." className="pl-10" />
          </div>
        </div>

        {/* Channels List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">CHANNELS</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {channels.map((channel) => (
              <motion.button
                key={channel.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeChannel === channel.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => setActiveChannel(channel.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.type)}
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{channel.unreadCount}</Badge>
                  )}
                </div>
                {channel.lastMessage && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {channel.lastMessage.author}: {channel.lastMessage.content}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </ScrollArea>

        {/* Online Users */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">ONLINE — {onlineUsers.length}</h3>
          <div className="space-y-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getChannelIcon(channels.find((c) => c.id === activeChannel)?.type || "public")}
              <div>
                <h2 className="font-semibold">{channels.find((c) => c.id === activeChannel)?.name || "general"}</h2>
                <p className="text-sm text-muted-foreground">
                  {channels.find((c) => c.id === activeChannel)?.members || 0} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Pin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showDate =
                index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp)

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center gap-4 my-6">
                      <Separator className="flex-1" />
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(message.timestamp)}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                  )}

                  <motion.div
                    className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={message.author.avatar || "/placeholder.svg"} alt={message.author.name} />
                      <AvatarFallback>
                        {message.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{message.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.author.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        {message.isEdited && <span className="text-xs text-muted-foreground">(edited)</span>}
                      </div>

                      <div className="text-sm leading-relaxed">{message.content}</div>

                      {message.attachments && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                              <File className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{attachment.name}</span>
                              {attachment.size && (
                                <span className="text-xs text-muted-foreground">({attachment.size})</span>
                              )}
                              <Button variant="ghost" size="sm" className="ml-auto">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, i) => (
                            <Button key={i} variant="outline" size="sm" className="h-6 px-2 text-xs">
                              {reaction.emoji} {reaction.users.length}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Reply className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder={`Message #${channels.find((c) => c.id === activeChannel)?.name || "general"}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
