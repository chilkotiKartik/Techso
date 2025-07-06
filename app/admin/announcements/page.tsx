"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Plus, Megaphone, Calendar, Eye, Edit, Trash2, Send, AlertCircle, Info, CheckCircle, Bell } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "urgent"
  audience: "all" | "students" | "teachers" | "admins"
  author: {
    name: string
    avatar: string
    role: string
  }
  createdAt: string
  isActive: boolean
  views: number
  priority: "low" | "medium" | "high"
}

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "info" as const,
    audience: "all" as const,
    priority: "medium" as const,
  })

  // Mock announcements data
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "System Maintenance Scheduled",
      content:
        "The platform will undergo scheduled maintenance on January 25th from 2:00 AM to 4:00 AM. During this time, some features may be temporarily unavailable.",
      type: "warning",
      audience: "all",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
        role: "Admin",
      },
      createdAt: "2024-01-20T10:30:00Z",
      isActive: true,
      views: 245,
      priority: "high",
    },
    {
      id: "2",
      title: "New AI Workshop Series",
      content:
        "We are excited to announce a new series of AI workshops starting next month. Topics include Machine Learning Fundamentals, Deep Learning, and AI Ethics.",
      type: "info",
      audience: "students",
      author: {
        name: "Prof. Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        role: "Teacher",
      },
      createdAt: "2024-01-18T14:15:00Z",
      isActive: true,
      views: 189,
      priority: "medium",
    },
    {
      id: "3",
      title: "Project Submission Deadline Extended",
      content:
        "Due to popular request, the deadline for final project submissions has been extended to February 15th. Make sure to submit your projects before the new deadline.",
      type: "success",
      audience: "students",
      author: {
        name: "Dr. Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
        role: "Admin",
      },
      createdAt: "2024-01-15T09:00:00Z",
      isActive: true,
      views: 312,
      priority: "medium",
    },
  ]

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Simulate loading announcements
    const timer = setTimeout(() => {
      setAnnouncements(mockAnnouncements)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "urgent":
        return <Bell className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
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
      default:
        return "bg-blue-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type,
      audience: newAnnouncement.audience,
      priority: newAnnouncement.priority,
      author: {
        name: user?.name || "Admin",
        avatar: user?.avatar || "",
        role: user?.role || "admin",
      },
      createdAt: new Date().toISOString(),
      isActive: true,
      views: 0,
    }

    setAnnouncements((prev) => [announcement, ...prev])
    setNewAnnouncement({
      title: "",
      content: "",
      type: "info",
      audience: "all",
      priority: "medium",
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "Announcement Created! 📢",
      description: "Your announcement has been published successfully.",
    })
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
            <p className="text-muted-foreground">Create and manage platform-wide announcements</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>Broadcast a message to users on the platform</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter announcement content"
                    rows={4}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newAnnouncement.type}
                      onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select
                      value={newAnnouncement.audience}
                      onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newAnnouncement.priority}
                      onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement} className="gap-2">
                    <Send className="h-4 w-4" />
                    Publish Announcement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          {
            title: "Total Announcements",
            value: announcements.length.toString(),
            icon: <Megaphone className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Active",
            value: announcements.filter((a) => a.isActive).length.toString(),
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Total Views",
            value: announcements.reduce((sum, a) => sum + a.views, 0).toString(),
            icon: <Eye className="h-5 w-5" />,
            color: "text-purple-500",
          },
          {
            title: "High Priority",
            value: announcements.filter((a) => a.priority === "high").length.toString(),
            icon: <AlertCircle className="h-5 w-5" />,
            color: "text-red-500",
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Announcements List */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-4"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Announcements Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first announcement to communicate with users.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getTypeColor(announcement.type)} text-white gap-1`}>
                          {getTypeIcon(announcement.type)}
                          {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {announcement.audience === "all"
                            ? "All Users"
                            : announcement.audience.charAt(0).toUpperCase() + announcement.audience.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">{announcement.content}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={announcement.author.avatar || "/placeholder.svg"}
                            alt={announcement.author.name}
                          />
                          <AvatarFallback className="text-xs">
                            {announcement.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{announcement.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {announcement.views} views
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(announcement.createdAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
