"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Share2,
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
    email: string
  }
  category: string
  status: "active" | "completed" | "on-hold" | "cancelled"
  progress: number
  likes: number
  views: number
  collaborators: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

export default function ProjectManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock project data
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "AI Music Composer",
      description: "Revolutionary AI that creates personalized music compositions based on emotions and preferences",
      author: {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
        email: "alex@infinity.edu",
      },
      category: "AI/ML",
      status: "active",
      progress: 85,
      likes: 234,
      views: 1250,
      collaborators: 3,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      tags: ["AI", "Music", "Machine Learning", "Creative"],
    },
    {
      id: "2",
      title: "Mental Health Companion",
      description: "Intelligent chatbot providing 24/7 mental health support with personalized therapy recommendations",
      author: {
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
        email: "maya@infinity.edu",
      },
      category: "Healthcare",
      status: "completed",
      progress: 100,
      likes: 189,
      views: 980,
      collaborators: 2,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      tags: ["Healthcare", "AI", "Mental Health", "Chatbot"],
    },
    {
      id: "3",
      title: "Smart Campus System",
      description: "IoT-based system for managing campus resources, energy consumption, and student services",
      author: {
        name: "Team Alpha",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        email: "team@infinity.edu",
      },
      category: "IoT",
      status: "on-hold",
      progress: 45,
      likes: 156,
      views: 750,
      collaborators: 5,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      tags: ["IoT", "Smart City", "Energy", "Campus"],
    },
    {
      id: "4",
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system using blockchain technology for student elections",
      author: {
        name: "Sarah Kim",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
        email: "sarah@infinity.edu",
      },
      category: "Blockchain",
      status: "active",
      progress: 60,
      likes: 98,
      views: 450,
      collaborators: 4,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-19",
      tags: ["Blockchain", "Security", "Voting", "Democracy"],
    },
  ]

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Simulate loading projects
    const timer = setTimeout(() => {
      setProjects(mockProjects)
      setFilteredProjects(mockProjects)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  useEffect(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((project) => project.category === categoryFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, categoryFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "on-hold":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <TrendingUp className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on-hold":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
    toast({
      title: "Project Deleted",
      description: "The project has been successfully deleted.",
    })
  }

  const categories = ["All", "AI/ML", "Healthcare", "IoT", "Blockchain", "Web Development", "Mobile App"]
  const statuses = ["All", "Active", "Completed", "On Hold", "Cancelled"]

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
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="text-muted-foreground">Manage and monitor all projects on the platform</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
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
                    placeholder="Search projects, authors, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="IoT">IoT</SelectItem>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className="grid gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredProjects.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or create a new project.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Project Actions</DialogTitle>
                            <DialogDescription>Choose an action for {project.title}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2">
                            <Button variant="outline" className="justify-start gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                            <Button variant="outline" className="justify-start gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Project
                            </Button>
                            <Button variant="outline" className="justify-start gap-2">
                              <Share2 className="h-4 w-4" />
                              Share Project
                            </Button>
                            <Button
                              variant="outline"
                              className="justify-start gap-2 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Project
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.author.avatar || "/placeholder.svg"} alt={project.author.name} />
                        <AvatarFallback>
                          {project.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.author.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{project.author.email}</p>
                      </div>
                    </div>

                    {/* Status and Category */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(project.status)} text-white gap-1`}>
                        {getStatusIcon(project.status)}
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.collaborators}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-muted-foreground">
                      Created: {project.createdAt} • Updated: {project.updatedAt}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
