"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { SpaceBackground } from "@/components/space-background"
import {
  Search,
  Heart,
  Eye,
  Star,
  Zap,
  Brain,
  Code,
  Stethoscope,
  Dna,
  Scale,
  Cpu,
  ArrowRight,
  Grid3X3,
  List,
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  domain: string
  author: string
  authorAvatar: string
  teamMembers: string[]
  progress: number
  likes: number
  views: number
  stars: number
  status: "active" | "completed" | "planning"
  tags: string[]
  image: string
  createdAt: string
  lastUpdated: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const projects: Project[] = [
  {
    id: "cultural-drift-nlp",
    title: "Cultural Drift NLP",
    description:
      "Advanced natural language processing system analyzing cultural evolution patterns in digital communications and social media platforms.",
    domain: "Natural Language Processing",
    author: "Aishwarya Maan Srivastava",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Namish Kumar Sahu", "Sayan Ray"],
    progress: 85,
    likes: 234,
    views: 1250,
    stars: 89,
    status: "active",
    tags: ["NLP", "Cultural Studies", "Machine Learning", "Social Media"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-01-15",
    lastUpdated: "2 days ago",
    category: "AI/ML",
    difficulty: "Advanced",
  },
  {
    id: "language-loss-rebuilder",
    title: "Language Loss Rebuilder",
    description:
      "AI system for preserving and reconstructing endangered languages using advanced machine learning techniques and linguistic analysis.",
    domain: "Language Preservation",
    author: "Rudra Narayan Meher",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Team Alpha", "Linguistic Experts"],
    progress: 78,
    likes: 189,
    views: 980,
    stars: 67,
    status: "active",
    tags: ["AI", "Linguistics", "Cultural Preservation", "Deep Learning"],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-01-28",
    lastUpdated: "1 week ago",
    category: "AI/ML",
    difficulty: "Advanced",
  },
  {
    id: "contract-summarizer",
    title: "Contract Summarizer",
    description:
      "AI-powered system that analyzes and summarizes complex legal contracts with high accuracy and provides key insights.",
    domain: "Legal Technology",
    author: "Krishna Vallabha Goswami",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Sayan Ray"],
    progress: 92,
    likes: 156,
    views: 750,
    stars: 45,
    status: "completed",
    tags: ["Legal Tech", "NLP", "Document Analysis", "AI"],
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-02-05",
    lastUpdated: "3 days ago",
    category: "Legal Tech",
    difficulty: "Intermediate",
  },
  {
    id: "prompt-feedback-tuner",
    title: "Prompt Feedback Tuner",
    description:
      "System for optimizing AI prompts through automated feedback loops and performance analysis for better AI interactions.",
    domain: "AI Optimization",
    author: "Satyam Singh",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Sai Jasmitha Naidu", "Gourav Mandal"],
    progress: 67,
    likes: 198,
    views: 1100,
    stars: 72,
    status: "active",
    tags: ["AI", "Optimization", "Prompt Engineering", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-02-10",
    lastUpdated: "5 hours ago",
    category: "AI/ML",
    difficulty: "Advanced",
  },
  {
    id: "turbulence-generator-gan",
    title: "Turbulence Generator GAN",
    description:
      "Generative Adversarial Network for creating realistic turbulence patterns in fluid dynamics simulations and research.",
    domain: "Fluid Dynamics",
    author: "Swastik Joshi",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Rishi Mehrotra", "Siddharth Malkania", "Meet Parmar", "Sayan Ray"],
    progress: 74,
    likes: 267,
    views: 1450,
    stars: 95,
    status: "active",
    tags: ["GAN", "Fluid Dynamics", "Simulation", "Deep Learning"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-01-20",
    lastUpdated: "1 day ago",
    category: "Physics",
    difficulty: "Advanced",
  },
  {
    id: "digital-body-twin",
    title: "Digital Body Twin",
    description:
      "Create digital replicas of human bodies for medical simulation and personalized healthcare applications.",
    domain: "Healthcare Technology",
    author: "Ghantasala Dhruvann",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Siddharth Malkania", "Rishi Mehrotra", "Sumit Srimani", "Aadarsh Pathre"],
    progress: 88,
    likes: 312,
    views: 1680,
    stars: 128,
    status: "active",
    tags: ["Healthcare", "Digital Twin", "Medical AI", "Simulation"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-02-15",
    lastUpdated: "6 hours ago",
    category: "Healthcare",
    difficulty: "Advanced",
  },
  {
    id: "medical-symptom-chatbot",
    title: "Medical Symptom Chatbot",
    description:
      "AI-powered chatbot for preliminary medical symptom analysis and healthcare recommendations with high accuracy.",
    domain: "Healthcare AI",
    author: "Meet Parmar",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Snehlata Kumari", "Varun Reddy", "Sai Roshini K"],
    progress: 81,
    likes: 245,
    views: 1320,
    stars: 87,
    status: "active",
    tags: ["Healthcare", "Chatbot", "Medical AI", "NLP"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-02-01",
    lastUpdated: "4 days ago",
    category: "Healthcare",
    difficulty: "Intermediate",
  },
  {
    id: "evolution-path-modeler",
    title: "Evolution Path Modeler",
    description:
      "Modeling evolutionary pathways using AI and genetics to understand biological evolution and species development.",
    domain: "Evolutionary Biology",
    author: "Yukti Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    teamMembers: ["Sai Roshini K", "Gabriel George", "Vijay Bhasin", "Sayan Ray"],
    progress: 63,
    likes: 178,
    views: 890,
    stars: 54,
    status: "active",
    tags: ["Biology", "Evolution", "Genetics", "AI Modeling"],
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=800&auto=format&fit=crop",
    createdAt: "2024-01-30",
    lastUpdated: "1 week ago",
    category: "Biology",
    difficulty: "Advanced",
  },
]

const categories = ["All", "AI/ML", "Healthcare", "Legal Tech", "Physics", "Biology"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
const statuses = ["All", "active", "completed", "planning"]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "All" || project.difficulty === selectedDifficulty
      const matchesStatus = selectedStatus === "All" || project.status === selectedStatus

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    })

    // Sort projects
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "stars":
        filtered.sort((a, b) => b.stars - a.stars)
        break
      case "progress":
        filtered.sort((a, b) => b.progress - a.progress)
        break
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedStatus, sortBy])

  const handleLike = (projectId: string) => {
    setLikedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI/ML":
        return <Brain className="h-4 w-4" />
      case "Healthcare":
        return <Stethoscope className="h-4 w-4" />
      case "Legal Tech":
        return <Scale className="h-4 w-4" />
      case "Physics":
        return <Cpu className="h-4 w-4" />
      case "Biology":
        return <Dna className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "planning":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Innovation Hub</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            Student{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Discover groundbreaking projects created by IIT Madras students. From AI-powered solutions to innovative
            applications, these projects are shaping the future of technology.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects, technologies, or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Liked</option>
                    <option value="stars">Most Starred</option>
                    <option value="progress">Progress</option>
                  </select>

                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid/List */}
        <motion.div
          className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                        {getCategoryIcon(project.category)}
                        <span className="ml-1">{project.category}</span>
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Project Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{project.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.authorAvatar || "/placeholder.svg"} alt={project.author} />
                        <AvatarFallback>
                          {project.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{project.author}</p>
                        <p className="text-xs text-muted-foreground">{project.domain}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart
                            className={`h-4 w-4 ${likedProjects.has(project.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {project.stars}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {project.difficulty}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/projects/${project.id}`}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View Project
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLike(project.id)}
                        className={likedProjects.has(project.id) ? "text-red-500 border-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 ${likedProjects.has(project.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more projects.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedDifficulty("All")
                setSelectedStatus("All")
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 inline-block">
            <CardContent className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{projects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {projects.filter((p) => p.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {projects.filter((p) => p.status === "completed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
