"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Search,
  Users,
  Hash,
  Bell,
  Pin,
  Settings,
  Plus,
  AlertCircle,
  MessageSquare,
  Lock,
  Rocket,
} from "lucide-react"

interface ChatMessage {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    role: string
    status: "online" | "offline" | "away"
  }
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  reactions?: { emoji: string; count: number; users: string[] }[]
  isEdited?: boolean
  replyTo?: string
}

interface ChatChannel {
  id: string
  name: string
  description: string
  type: "general" | "project" | "announcement" | "private"
  members: number
  unread: number
  lastMessage?: string
  lastActivity: string
  isPrivate: boolean
  isPinned: boolean
}

export default function StudentChat() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedChannel, setSelectedChannel] = useState<string>("general")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadChatData()
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addRandomMessage()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatData = async () => {
    try {
      // Mock channels data
      const mockChannels: ChatChannel[] = [
        {
          id: "general",
          name: "General",
          description: "General discussions and announcements",
          type: "general",
          members: 1247,
          unread: 3,
          lastMessage: "Welcome to the new semester!",
          lastActivity: "2 minutes ago",
          isPrivate: false,
          isPinned: true,
        },
        {
          id: "ai-ml-projects",
          name: "AI/ML Projects",
          description: "Artificial Intelligence and Machine Learning discussions",
          type: "project",
          members: 234,
          unread: 12,
          lastMessage: "Check out this new transformer model...",
          lastActivity: "5 minutes ago",
          isPrivate: false,
          isPinned: true,
        },
        {
          id: "web-dev",
          name: "Web Development",
          description: "Frontend and Backend development discussions",
          type: "project",
          members: 189,
          unread: 0,
          lastMessage: "React 19 is amazing!",
          lastActivity: "1 hour ago",
          isPrivate: false,
          isPinned: false,
        },
        {
          id: "research-papers",
          name: "Research Papers",
          description: "Share and discuss research papers",
          type: "project",
          members: 156,
          unread: 5,
          lastMessage: "New paper on quantum computing",
          lastActivity: "3 hours ago",
          isPrivate: false,
          isPinned: false,
        },
        {
          id: "announcements",
          name: "Announcements",
          description: "Official announcements from faculty",
          type: "announcement",
          members: 1247,
          unread: 1,
          lastMessage: "Assignment deadline extended",
          lastActivity: "1 day ago",
          isPrivate: false,
          isPinned: true,
        },
      ]

      // Mock messages data
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          user: {
            id: "admin",
            name: "Dr. Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
            role: "Faculty",
            status: "online",
          },
          content: "Welcome everyone to the new semester! 🎉 We have some exciting projects lined up.",
          timestamp: "10:30 AM",
          type: "text",
          reactions: [
            { emoji: "👏", count: 15, users: ["user1", "user2"] },
            { emoji: "🎉", count: 8, users: ["user3"] },
          ],
        },
        {
          id: "2",
          user: {
            id: "student1",
            name: "Alex Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
            role: "Student",
            status: "online",
          },
          content: "Excited to work on the AI music composer project! Anyone interested in collaborating?",
          timestamp: "10:35 AM",
          type: "text",
          reactions: [{ emoji: "🚀", count: 5, users: ["user4", "user5"] }],
        },
        {
          id: "3",
          user: {
            id: "student2",
            name: "Maya Patel",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
            role: "Student",
            status: "online",
          },
          content: "I'm working on a mental health companion app. Would love to get feedback from the community!",
          timestamp: "10:42 AM",
          type: "text",
        },
        {
          id: "4",
          user: {
            id: "current",
            name: user?.name || "You",
            avatar: user?.avatar_url || "/placeholder.svg",
            role: "Student",
            status: "online",
          },
          content: "This platform is amazing! Great work on the development team. 💯",
          timestamp: "10:45 AM",
          type: "text",
          reactions: [{ emoji: "❤️", count: 3, users: ["user6"] }],
        },
      ]

      // Mock online users
      const mockOnlineUsers = [
        {
          id: "1",
          name: "Alex Rodriguez",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
          status: "online",
          activity: "Working on AI project",
        },
        {
          id: "2",
          name: "Maya Patel",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
          status: "online",
          activity: "In research mode",
        },
        {
          id: "3",
          name: "Dr. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
          status: "online",
          activity: "Available for questions",
        },
        {
          id: "4",
          name: "Team Alpha",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
          status: "away",
          activity: "In meeting",
        },
      ]

      setChannels(mockChannels)
      setMessages(mockMessages)
      setOnlineUsers(mockOnlineUsers)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading chat data:", error)
      toast({
        title: "Error",
        description: "Failed to load chat data. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const addRandomMessage = () => {
    const randomUsers = [
      {
        id: "random1",
        name: "Krishna Kumar",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        role: "Student",
        status: "online" as const,
      },
      {
        id: "random2",
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        role: "Student",
        status: "online" as const,
      },
    ]

    const randomMessages = [
      "Just pushed my latest code to GitHub! 🚀",
      "Anyone free for a quick code review?",
      "Found an interesting research paper on quantum computing",
      "Working late on the project tonight 💪",
      "Coffee break anyone? ☕",
      "Great presentation today!",
      "Need help with React hooks, anyone available?",
    ]

    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)]
    const randomContent = randomMessages[Math.floor(Math.random() * randomMessages.length)]

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: randomUser,
      content: randomContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        id: user?.id || "current",
        name: user?.name || "You",
        avatar: user?.avatar_url || "/placeholder.svg",
        role: "Student",
        status: "online",
      },
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the channel.",
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Hash className="h-4 w-4" />
      case "project":
        return <Rocket className="h-4 w-4" />
      case "announcement":
        return <Bell className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredChannels = channels.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Chat...</h2>
          <p className="text-muted-foreground">Connecting to team channels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              Team Chat
            </h1>
            <p className="text-muted-foreground">Collaborate with your team in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              {onlineUsers.length} Online
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Chat Interface */}
      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar - Channels */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-1 p-4">
                  {filteredChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={selectedChannel === channel.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-3 hover:bg-accent/50"
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.type)}
                          {channel.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{channel.name}</span>
                            {channel.unread > 0 && (
                              <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {channel.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{channel.lastMessage}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full bg-card/50 backdrop-blur-sm flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getChannelIcon(channels.find((c) => c.id === selectedChannel)?.type || "general")}
                  <div>
                    <CardTitle className="text-lg">
                      {channels.find((c) => c.id === selectedChannel)?.name || "General"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {channels.find((c) => c.id === selectedChannel)?.members} members •{" "}
                      {channels.find((c) => c.id === selectedChannel)?.description}
                    </CardDescription>
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
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-400px)] p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 group hover:bg-accent/30 p-2 rounded-lg transition-colors ${
                          msg.user.id === user?.id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={msg.user.avatar || "/placeholder.svg"} alt={msg.user.name} />
                          <AvatarFallback>
                            {msg.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${msg.user.id === user?.id ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {msg.user.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                            {msg.isEdited && <span className="text-xs text-muted-foreground">(edited)</span>}
                          </div>
                          <div
                            className={`bg-accent/50 rounded-lg p-3 ${msg.user.id === user?.id ? "bg-primary/10" : ""}`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {msg.reactions.map((reaction, reactionIndex) => (
                                <Button
                                  key={reactionIndex}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-accent"
                                >
                                  {reaction.emoji} {reaction.count}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Online Users Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Online ({onlineUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-2 p-4">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            user.status === "online"
                              ? "bg-green-500"
                              : user.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
