"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { liveState } from "@/lib/live-state"
import {
  Send,
  Hash,
  Smile,
  Paperclip,
  Phone,
  Video,
  Settings,
  Search,
  MoreVertical,
  Circle,
  AlertCircle,
  Rocket,
  Brain,
  Code,
  BookOpen,
  Coffee,
  Moon,
  Wifi,
  WifiOff,
} from "lucide-react"

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: number
  reactions?: { [emoji: string]: string[] }
  edited?: boolean
  editedAt?: number
}

interface Channel {
  id: string
  name: string
  description: string
  type: "public" | "private" | "direct"
  icon: React.ReactNode
  unreadCount: number
  lastMessage?: Message
}

interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "away" | "busy" | "offline"
  role: string
}

export default function StudentWorkspace() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedChannel, setSelectedChannel] = useState<string>("general")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [typing, setTyping] = useState<{ [userId: string]: number }>({})
  const [isTyping, setIsTyping] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isConnected, setIsConnected] = useState(true)

  const channels: Channel[] = [
    {
      id: "general",
      name: "general",
      description: "General discussions and announcements",
      type: "public",
      icon: <Hash className="h-4 w-4" />,
      unreadCount: 0,
    },
    {
      id: "project-team",
      name: "project-team",
      description: "Project collaboration and updates",
      type: "public",
      icon: <Rocket className="h-4 w-4" />,
      unreadCount: 2,
    },
    {
      id: "ai-research",
      name: "ai-research",
      description: "AI and Machine Learning discussions",
      type: "public",
      icon: <Brain className="h-4 w-4" />,
      unreadCount: 0,
    },
    {
      id: "code-review",
      name: "code-review",
      description: "Code reviews and technical discussions",
      type: "public",
      icon: <Code className="h-4 w-4" />,
      unreadCount: 1,
    },
    {
      id: "study-group",
      name: "study-group",
      description: "Study sessions and academic help",
      type: "public",
      icon: <BookOpen className="h-4 w-4" />,
      unreadCount: 0,
    },
  ]

  const reactions = ["❤️", "👍", "😂", "😮", "😢", "🔥", "🎉", "👏"]

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    initializeWorkspace()
    setupLiveListeners()

    return () => {
      cleanupLiveListeners()
    }
  }, [user, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Handle typing indicator
    if (isTyping) {
      liveState.setTyping(selectedChannel, user!.id, true)
      const timeout = setTimeout(() => {
        setIsTyping(false)
        liveState.setTyping(selectedChannel, user!.id, false)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [isTyping, selectedChannel, user])

  const initializeWorkspace = () => {
    // Add current user to online users
    if (user) {
      const currentUser: User = {
        id: user.id,
        name: user.name,
        avatar: user.avatar_url,
        status: "online",
        role: user.role,
      }
      liveState.addUser(currentUser)
    }

    // Load messages for selected channel
    loadMessages(selectedChannel)
    loadOnlineUsers()
  }

  const setupLiveListeners = () => {
    liveState.on("message_added", handleNewMessage)
    liveState.on("user_updated", handleUserUpdate)
    liveState.on("user_removed", handleUserRemoved)
    liveState.on("typing_updated", handleTypingUpdate)
    liveState.on("announcement_added", handleAnnouncement)
  }

  const cleanupLiveListeners = () => {
    liveState.off("message_added", handleNewMessage)
    liveState.off("user_updated", handleUserUpdate)
    liveState.off("user_removed", handleUserRemoved)
    liveState.off("typing_updated", handleTypingUpdate)
    liveState.off("announcement_added", handleAnnouncement)
  }

  const handleNewMessage = (data: { channelId: string; message: Message }) => {
    if (data.channelId === selectedChannel) {
      setMessages((prev) => [...prev, data.message])
    }

    // Show toast for mentions or important messages
    if (data.message.content.includes(`@${user?.name}`) && data.message.userId !== user?.id) {
      toast({
        title: "You were mentioned!",
        description: `${data.message.userName}: ${data.message.content.substring(0, 50)}...`,
      })
    }
  }

  const handleUserUpdate = (userData: User) => {
    setOnlineUsers((prev) => {
      const existing = prev.find((u) => u.id === userData.id)
      if (existing) {
        return prev.map((u) => (u.id === userData.id ? userData : u))
      } else {
        return [...prev, userData]
      }
    })
  }

  const handleUserRemoved = (data: { userId: string }) => {
    setOnlineUsers((prev) => prev.filter((u) => u.id !== data.userId))
  }

  const handleTypingUpdate = (data: { channelId: string; typing: { [userId: string]: number } }) => {
    if (data.channelId === selectedChannel) {
      setTyping(data.typing)
    }
  }

  const handleAnnouncement = (announcement: any) => {
    toast({
      title: "📢 New Announcement",
      description: announcement.title,
    })
  }

  const loadMessages = (channelId: string) => {
    const channelMessages = liveState.getMessages(channelId)
    setMessages(channelMessages)
  }

  const loadOnlineUsers = () => {
    const users = liveState.getUsers()
    setOnlineUsers(users.filter((u: User) => u.status !== "offline"))
  }

  const sendMessage = () => {
    if (!message.trim() || !user) return

    const newMessage: Omit<Message, "id" | "timestamp"> = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar_url,
      content: message.trim(),
    }

    liveState.addMessage(selectedChannel, newMessage)
    setMessage("")
    setIsTyping(false)
    liveState.setTyping(selectedChannel, user.id, false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else if (!isTyping) {
      setIsTyping(true)
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (!user) return

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions }
          if (!reactions[emoji]) {
            reactions[emoji] = []
          }

          const userIndex = reactions[emoji].indexOf(user.id)
          if (userIndex >= 0) {
            reactions[emoji].splice(userIndex, 1)
            if (reactions[emoji].length === 0) {
              delete reactions[emoji]
            }
          } else {
            reactions[emoji].push(user.id)
          }

          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

  const typingUsers = Object.keys(typing)
    .filter((userId) => userId !== user?.id && Date.now() - typing[userId] < 5000)
    .map((userId) => onlineUsers.find((u) => u.id === userId))
    .filter(Boolean) as User[]

  if (!user || user.role !== "student") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need student access to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Workspace</h2>
            <div className="flex items-center gap-2">
              <div className={`${isConnected ? "text-green-500" : "text-red-500"}`}>
                {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">CHANNELS</h3>
              {channels
                .filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((channel) => (
                  <Button
                    key={channel.id}
                    variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => {
                      setSelectedChannel(channel.id)
                      loadMessages(channel.id)
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="text-muted-foreground">{channel.icon}</div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{channel.description}</div>
                      </div>
                      {channel.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">{channel.unreadCount}</Badge>
                      )}
                    </div>
                  </Button>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Online Users */}
        <div className="border-t border-border p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">ONLINE — {onlineUsers.length}</h3>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">{channels.find((c) => c.id === selectedChannel)?.icon}</div>
              <div>
                <h3 className="font-semibold">#{channels.find((c) => c.id === selectedChannel)?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {channels.find((c) => c.id === selectedChannel)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={msg.userAvatar || "/placeholder.svg"} alt={msg.userName} />
                      <AvatarFallback>
                        {msg.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        {msg.edited && (
                          <Badge variant="outline" className="text-xs">
                            edited
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <Button
                              key={emoji}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => addReaction(msg.id, emoji)}
                            >
                              {emoji} {users.length}
                            </Button>
                          ))}
                        </div>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <div className="flex gap-1">
                          {reactions.slice(0, 4).map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-xs hover:bg-muted"
                              onClick={() => addReaction(msg.id, emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {typingUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                    <span>
                      {typingUsers.map((u) => u.name).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${channels.find((c) => c.id === selectedChannel)?.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} disabled={!message.trim()} className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
