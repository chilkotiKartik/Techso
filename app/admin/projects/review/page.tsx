"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Users,
  Calendar,
  Tag,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Search,
} from "lucide-react"

interface ProjectSubmission {
  id: string
  title: string
  description: string
  domain: string
  status: "pending" | "approved" | "rejected" | "revision_requested"
  submittedAt: string
  submittedBy: {
    id: string
    name: string
    email: string
    avatar: string
    department: string
    year: string
  }
  teamMembers: {
    name: string
    github?: string
    linkedin?: string
  }[]
  githubLinks: string[]
  linkedinLinks: string[]
  attachments: string[]
  tags: string[]
  adminComments: {
    id: string
    comment: string
    author: string
    timestamp: string
    type: "comment" | "approval" | "rejection" | "revision"
  }[]
  score?: number
  reviewedBy?: string
  reviewedAt?: string
}

export default function ProjectReview() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<ProjectSubmission[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null)
  const [comment, setComment] = useState("")
  const [score, setScore] = useState<number>(0)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    loadProjectSubmissions()
  }, [user, router])

  const loadProjectSubmissions = async () => {
    try {
      // Mock project submissions based on real student data
      const mockProjects: ProjectSubmission[] = [
        {
          id: "1",
          title: "LexiSummarizer AI",
          description:
            "Advanced AI system for legal document summarization and analysis using natural language processing",
          domain: "AI/NLP",
          status: "pending",
          submittedAt: "2024-01-20T10:30:00Z",
          submittedBy: {
            id: "student-1",
            name: "Krishna Vallabha Goswami",
            email: "krishna@infinity.edu",
            avatar: "https://ui-avatars.com/api/?name=Krishna+Vallabha+Goswami&background=3b82f6&color=fff&size=150",
            department: "Data Science",
            year: "3rd Year",
          },
          teamMembers: [{ name: "Krishna Vallabha Goswami", github: "https://github.com/Krishna2622" }],
          githubLinks: ["https://github.com/Krishna2622/lexisummarizer"],
          linkedinLinks: [],
          attachments: ["project_demo.mp4", "technical_report.pdf", "presentation.pptx"],
          tags: ["AI", "NLP", "Legal Tech", "Summarization"],
          adminComments: [],
        },
        {
          id: "2",
          title: "XCredit - Explainable Credit Scorer",
          description: "Explainable AI system for credit scoring with transparent decision-making process",
          domain: "FinTech/AI",
          status: "approved",
          submittedAt: "2024-01-18T14:15:00Z",
          submittedBy: {
            id: "student-2",
            name: "Sai Jasmitha Naidu Kancharlapalli",
            email: "jasmitha@infinity.edu",
            avatar: "https://ui-avatars.com/api/?name=Sai+Jasmitha&background=10b981&color=fff&size=150",
            department: "Data Science",
            year: "2nd Year",
          },
          teamMembers: [
            { name: "Sai Jasmitha Naidu Kancharlapalli", github: "https://github.com/jas127" },
            { name: "Anushree Balaji", github: "https://github.com/Anushree401" },
            { name: "Ramakrishna R", github: "https://github.com/rammarch2005" },
            { name: "Satyam Singh", github: "https://github.com/satyam-singh-dev" },
          ],
          githubLinks: ["https://github.com/jas127/xcredit"],
          linkedinLinks: ["https://www.linkedin.com/in/jasmitha-kancharlapalli-7a6627305/"],
          attachments: ["xcredit_demo.mp4", "research_paper.pdf"],
          tags: ["FinTech", "Explainable AI", "Credit Scoring", "Machine Learning"],
          adminComments: [
            {
              id: "1",
              comment: "Excellent work on explainable AI! The transparency in decision-making is impressive.",
              author: "Dr. Sarah Johnson",
              timestamp: "2024-01-19T09:00:00Z",
              type: "approval",
            },
          ],
          score: 95,
          reviewedBy: "Dr. Sarah Johnson",
          reviewedAt: "2024-01-19T09:00:00Z",
        },
        {
          id: "3",
          title: "Cultural Drift NLP",
          description: "NLP system for analyzing cultural linguistic changes and preserving cultural heritage",
          domain: "Cultural NLP",
          status: "revision_requested",
          submittedAt: "2024-01-15T16:20:00Z",
          submittedBy: {
            id: "student-3",
            name: "Aishwarya Maan Srivastava",
            email: "aishwarya@infinity.edu",
            avatar: "https://ui-avatars.com/api/?name=Aishwarya+Maan&background=8b5cf6&color=fff&size=150",
            department: "Data Science",
            year: "2nd Year",
          },
          teamMembers: [
            { name: "Aishwarya Maan Srivastava", github: "https://github.com/Aish-TheMagician" },
            { name: "Namish Kumar Sahu", github: "https://github.com/namish18" },
            { name: "Sayan Ray" },
          ],
          githubLinks: ["https://github.com/Aish-TheMagician/cultural-drift-nlp"],
          linkedinLinks: ["https://www.linkedin.com/in/aishwarya-maan-srivastava-b883a1255/"],
          attachments: ["cultural_analysis.pdf", "dataset_samples.csv"],
          tags: ["NLP", "Cultural Studies", "Heritage Preservation", "Linguistics"],
          adminComments: [
            {
              id: "1",
              comment:
                "Great concept! Please add more details about the dataset collection methodology and validation process.",
              author: "Dr. Sarah Johnson",
              timestamp: "2024-01-16T11:30:00Z",
              type: "revision",
            },
          ],
          score: 78,
          reviewedBy: "Dr. Sarah Johnson",
          reviewedAt: "2024-01-16T11:30:00Z",
        },
        {
          id: "4",
          title: "Turbulence Generator GAN",
          description: "Generative Adversarial Network for creating realistic fluid turbulence simulations",
          domain: "Computer Vision/GAN",
          status: "pending",
          submittedAt: "2024-01-22T08:45:00Z",
          submittedBy: {
            id: "student-4",
            name: "Swastik Joshi",
            email: "swastik@infinity.edu",
            avatar: "https://ui-avatars.com/api/?name=Swastik+Joshi&background=f59e0b&color=fff&size=150",
            department: "Data Science",
            year: "3rd Year",
          },
          teamMembers: [
            { name: "Swastik Joshi", github: "https://github.com/sawoaj" },
            { name: "Rishi Mehrotra", github: "https://github.com/rishmeh" },
            { name: "Siddharth Malkania", github: "https://github.com/Shadecreator" },
            { name: "Meet Parmar", github: "https://github.com/Mumcallshimmeet" },
          ],
          githubLinks: ["https://github.com/sawoaj/turbulence-gan"],
          linkedinLinks: ["https://www.linkedin.com/in/swasj/"],
          attachments: ["turbulence_demo.mp4", "gan_architecture.pdf", "results_analysis.pdf"],
          tags: ["GAN", "Fluid Dynamics", "Computer Vision", "Simulation"],
          adminComments: [],
        },
      ]

      setProjects(mockProjects)
      setSelectedProject(mockProjects[0])
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading projects:", error)
      toast({
        title: "Error",
        description: "Failed to load project submissions.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleReview = async (projectId: string, action: "approve" | "reject" | "request_revision") => {
    if (!comment.trim() && action !== "approve") {
      toast({
        title: "Comment Required",
        description: "Please provide a comment for your review.",
        variant: "destructive",
      })
      return
    }

    try {
      const newComment = {
        id: Date.now().toString(),
        comment: comment || "Project approved",
        author: user?.name || "Admin",
        timestamp: new Date().toISOString(),
        type: action === "approve" ? "approval" : action === "reject" ? "rejection" : "revision",
      }

      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            status:
              action === "approve" ? "approved" : action === "reject" ? "rejected" : ("revision_requested" as const),
            adminComments: [...project.adminComments, newComment],
            score: action === "approve" ? score || 85 : project.score,
            reviewedBy: user?.name,
            reviewedAt: new Date().toISOString(),
          }
        }
        return project
      })

      setProjects(updatedProjects)
      setSelectedProject(updatedProjects.find((p) => p.id === projectId) || null)
      setComment("")
      setScore(0)

      toast({
        title: `Project ${action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Revision Requested"}! ✅`,
        description: `The project has been ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "marked for revision"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "revision_requested":
        return "bg-yellow-500"
      case "pending":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "revision_requested":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Projects...</h2>
          <p className="text-muted-foreground">Fetching project submissions...</p>
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
            <h1 className="text-3xl font-bold mb-2">Project Review</h1>
            <p className="text-muted-foreground">Review and approve student project submissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500 text-white">
              {projects.filter((p) => p.status === "pending").length} Pending
            </Badge>
            <Badge className="bg-green-500 text-white">
              {projects.filter((p) => p.status === "approved").length} Approved
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Projects List */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Project Submissions</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="revision_requested">Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedProject?.id === project.id ? "bg-primary/10 border-primary" : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{project.title}</h3>
                      <Badge className={`${getStatusColor(project.status)} text-white gap-1 text-xs`}>
                        {getStatusIcon(project.status)}
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={project.submittedBy.avatar || "/placeholder.svg"}
                          alt={project.submittedBy.name}
                        />
                        <AvatarFallback className="text-xs">
                          {project.submittedBy.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{project.submittedBy.name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {project.domain}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Details */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {selectedProject ? (
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{selectedProject.title}</CardTitle>
                        <Badge className={`${getStatusColor(selectedProject.status)} text-white gap-1`}>
                          {getStatusIcon(selectedProject.status)}
                          {selectedProject.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardDescription className="text-base leading-relaxed">
                        {selectedProject.description}
                      </CardDescription>
                    </div>
                    {selectedProject.score && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{selectedProject.score}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Submitter Info */}
                  <div className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={selectedProject.submittedBy.avatar || "/placeholder.svg"}
                        alt={selectedProject.submittedBy.name}
                      />
                      <AvatarFallback>
                        {selectedProject.submittedBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{selectedProject.submittedBy.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedProject.submittedBy.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedProject.submittedBy.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedProject.submittedBy.year}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedProject.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members ({selectedProject.teamMembers.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {member.github && (
                                <a
                                  href={member.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Github className="h-3 w-3" />
                                </a>
                              )}
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Linkedin className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Links and Attachments */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* GitHub Links */}/}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub Repository
                      </h4>
                      <div className="space-y-2">
                        {selectedProject.githubLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-accent/20 rounded-lg hover:bg-accent/40 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="text-sm truncate">{link}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                    {/* Attachments */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Attachments
                      </h4>
                      <div className="space-y-2">
                        {selectedProject.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-accent/20 rounded-lg hover:bg-accent/40 transition-colors cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                            <span className="text-sm truncate">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Comments */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Review Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {selectedProject.adminComments.length > 0 ? (
                      selectedProject.adminComments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-accent/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{comment.author}</span>
                              <Badge
                                variant={
                                  comment.type === "approval"
                                    ? "default"
                                    : comment.type === "rejection"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {comment.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No comments yet</p>
                    )}
                  </div>

                  {/* Review Form */}
                  {selectedProject.status === "pending" && (
                    <div className="space-y-4 border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="comment">Review Comment</Label>
                        <Textarea
                          id="comment"
                          placeholder="Add your review comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="score">Score (0-100)</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter score"
                          value={score || ""}
                          onChange={(e) => setScore(Number(e.target.value))}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleReview(selectedProject.id, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleReview(selectedProject.id, "request_revision")} variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Request Revision
                        </Button>
                        <Button onClick={() => handleReview(selectedProject.id, "reject")} variant="destructive">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Project</h3>
                <p className="text-muted-foreground">Choose a project from the list to review its details.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
