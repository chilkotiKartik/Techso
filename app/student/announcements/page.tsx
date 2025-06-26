"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Search,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
  AlertCircle,
  Megaphone,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  Eye,
  Pin,
  Clock,
  User,
  Tag,
} from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "urgent" | "event"
  priority: "low" | "medium" | "high" | "critical"
  author: {
    id: string
    name: string
    avatar: string
    role: string
  }
  createdAt: string
  updatedAt?: string
  expiresAt?: string
  tags: string[]
  isRead: boolean
  isPinned: boolean
  isBookmarked: boolean
  audience: string[]
  attachments?: string[]
  reactions: { type: string; count: number; userReacted: boolean }[]
  views: number
  comments: number
}

export default function StudentAnnouncements() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadAnnouncements()
  }, [user, router])

  useEffect(() => {
    filterAnnouncements()
  }, [announcements, searchTerm, typeFilter, priorityFilter])

  const loadAnnouncements = async () => {
    try {
      // Mock announcements data
      const mockAnnouncements: Announcement[] = [
        {
          id: "1",
          title: "🎉 New Semester Welcome & Important Updates",
          content:
            "Welcome to the new semester! We're excited to announce several new features and opportunities for our students. This semester brings enhanced project collaboration tools, new research opportunities, and expanded mentorship programs. Please review the attached guidelines and mark your calendars for the orientation session.",
          type: "info",
          priority: "high",
          author: {
            id: "admin1",
            name: "Dr. Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
            role: "Dean of Innovation",
          },
          createdAt: "2024-01-15T10:00:00Z",
          tags: ["welcome", "semester", "updates", "orientation"],
          isRead: false,
          isPinned: true,
          isBookmarked: false,
          audience: ["all-students"],
          reactions: [
            { type: "👏", count: 45, userReacted: false },
            { type: "🎉", count: 32, userReacted: true },
            { type: "❤️", count: 18, userReacted: false },
          ],
          views: 1247,
          comments: 23,
        },
        {
          id: "2",
          title: "⚠️ Assignment Deadline Extension - ML Fundamentals",
          content:
            "Due to the complexity of the current Machine Learning assignment and student feedback, we're extending the deadline by one week. The new submission date is February 25th, 11:59 PM. Use this extra time to refine your models and improve your documentation. Office hours have been extended to provide additional support.",
          type: "warning",
          priority: "critical",
          author: {
            id: "prof1",
            name: "Prof. Michael Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
            role: "ML Professor",
          },
          createdAt: "2024-01-18T14:30:00Z",
          expiresAt: "2024-02-25T23:59:00Z",
          tags: ["assignment", "deadline", "machine-learning", "extension"],
          isRead: true,
          isPinned: true,
          isBookmarked: true,
          audience: ["ml-students"],
          reactions: [
            { type: "🙏", count: 67, userReacted: true },
            { type: "😅", count: 23, userReacted: false },
            { type: "👍", count: 41, userReacted: false },
          ],
          views: 892,
          comments: 45,
        },
        {
          id: "3",
          title: "🚀 New Research Collaboration Opportunity with Google",
          content:
            "Exciting news! We've partnered with Google Research for a new collaborative project on Quantum Machine Learning. Selected students will have the opportunity to work directly with Google researchers on cutting-edge quantum algorithms. Applications are now open for interested students with strong backgrounds in quantum computing and machine learning.",
          type: "success",
          priority: "high",
          author: {
            id: "admin2",
            name: "Dr. Priya Sharma",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
            role: "Research Director",
          },
          createdAt: "2024-01-20T09:15:00Z",
          tags: ["research", "google", "quantum", "collaboration", "opportunity"],
          isRead: false,
          isPinned: false,
          isBookmarked: false,
          audience: ["research-students", "quantum-students"],
          reactions: [
            { type: "🚀", count: 89, userReacted: false },
            { type: "🤩", count: 56, userReacted: false },
            { type: "🔥", count: 34, userReacted: false },
          ],
          views: 1456,
          comments: 78,
        },
        {
          id: "4",
          title: "📅 Upcoming Tech Talk: 'The Future of AI in Healthcare'",
          content:
            "Join us for an inspiring tech talk by Dr. Rajesh Kumar, Chief AI Officer at Apollo Hospitals, on 'The Future of AI in Healthcare'. Learn about the latest developments in medical AI, real-world applications, and career opportunities in healthcare technology. The session includes a Q&A segment and networking opportunity.",
          type: "event",
          priority: "medium",
          author: {
            id: "events",
            name: "Events Team",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
            role: "Event Coordinator",
          },
          createdAt: "2024-01-22T16:45:00Z",
          expiresAt: "2024-02-05T18:00:00Z",
          tags: ["tech-talk", "healthcare", "ai", "networking", "career"],
          isRead: false,
          isPinned: false,
          isBookmarked: false,
          audience: ["all-students"],
          reactions: [
            { type: "📚", count: 28, userReacted: false },
            { type: "👨‍⚕️", count: 15, userReacted: false },
            { type: "💡", count: 22, userReacted: false },
          ],
          views: 634,
          comments: 12,
        },
        {
          id: "5",
          title: "🏆 Congratulations to Our Hackathon Winners!",
          content:
            "Congratulations to Team Alpha for winning the Annual Innovation Hackathon with their groundbreaking 'Smart Campus' solution! Special recognition goes to all participating teams for their creativity and technical excellence. Prize distribution ceremony will be held next Friday. Check out the winning projects in our showcase gallery.",
          type: "success",
          priority: "medium",
          author: {
            id: "admin3",
            name: "Innovation Hub Team",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
            role: "Hub Coordinator",
          },
          createdAt: "2024-01-25T11:20:00Z",
          tags: ["hackathon", "winners", "innovation", "awards", "celebration"],
          isRead: true,
          isPinned: false,
          isBookmarked: false,
          audience: ["all-students"],
          reactions: [
            { type: "🎉", count: 156, userReacted: true },
            { type: "👏", count: 89, userReacted: false },
            { type: "🏆", count: 67, userReacted: false },
          ],
          views: 2341,
          comments: 94,
        },
      ]

      setAnnouncements(mockAnnouncements)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading announcements:", error)
      toast({
        title: "Error",
        description: "Failed to load announcements. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const filterAnnouncements = () => {
    let filtered = announcements

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((announcement) => announcement.type === typeFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((announcement) => announcement.priority === priorityFilter)
    }

    // Sort by pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredAnnouncements(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "urgent":
        return <Zap className="h-5 w-5" />
      case "event":
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      case "success":
        return "bg-green-500"
      case "urgent":
        return "bg-red-500"
      case "event":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-red-500 bg-red-500/10"
      case "high":
        return "border-orange-500 bg-orange-500/10"
      case "medium":
        return "border-yellow-500 bg-yellow-500/10"
      case "low":
        return "border-green-500 bg-green-500/10"
      default:
        return "border-gray-500 bg-gray-500/10"
    }
  }

  const toggleBookmark = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id ? { ...announcement, isBookmarked: !announcement.isBookmarked } : announcement,
      ),
    )
    toast({
      title: "Bookmark Updated",
      description: "Announcement bookmark status has been updated.",
    })
  }

  const toggleReaction = (announcementId: string, reactionType: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? {
              ...announcement,
              reactions: announcement.reactions.map((reaction) =>
                reaction.type === reactionType
                  ? {
                      ...reaction,
                      count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
                      userReacted: !reaction.userReacted,
                    }
                  : reaction,
              ),
            }
          : announcement,
      ),
    )
  }

  const markAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => (announcement.id === id ? { ...announcement, isRead: true } : announcement)),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

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
          <h2 className="text-xl font-semibold mb-2">Loading Announcements...</h2>
          <p className="text-muted-foreground">Fetching the latest updates...</p>
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
              <Megaphone className="h-8 w-8 text-primary" />
              Announcements
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest news and important information</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500 text-white">{announcements.filter((a) => !a.isRead).length} Unread</Badge>
            <Badge className="bg-yellow-500 text-white">{announcements.filter((a) => a.isPinned).length} Pinned</Badge>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements, tags, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Announcements Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters to see more announcements."
                : "There are no announcements at the moment."}
            </p>
          </motion.div>
        ) : (
          filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  !announcement.isRead ? "border-l-4 border-l-primary" : ""
                } ${getPriorityColor(announcement.priority)}`}
                onClick={() => markAsRead(announcement.id)}
              >
                {announcement.isPinned && (
                  <div className="absolute top-4 right-4">
                    <Pin className="h-4 w-4 text-yellow-500" />
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={announcement.author.avatar || "/placeholder.svg"}
                        alt={announcement.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded-full ${getTypeColor(announcement.type)} text-white`}>
                          {getTypeIcon(announcement.type)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {announcement.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {announcement.priority.toUpperCase()}
                        </Badge>
                        {!announcement.isRead && <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>}
                      </div>

                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{announcement.title}</h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3">{announcement.content}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {announcement.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{announcement.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{announcement.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{announcement.comments}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(announcement.id)
                            }}
                          >
                            {announcement.isBookmarked ? (
                              <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>

                          <div className="flex items-center gap-1">
                            {announcement.reactions.map((reaction) => (
                              <Button
                                key={reaction.type}
                                variant="ghost"
                                size="sm"
                                className={`text-xs ${reaction.userReacted ? "bg-primary/10" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleReaction(announcement.id, reaction.type)
                                }}
                              >
                                {reaction.type} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {announcement.expiresAt && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <Clock className="h-4 w-4" />
                            <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
