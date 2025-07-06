"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { db, subscriptions } from "@/lib/database"
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  AlertCircle,
  Search,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  LinkIcon,
} from "lucide-react"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  due_date: string
  priority: "high" | "medium" | "low"
  total_points: number
  difficulty: string
  estimated_time: string
  requirements: string[]
  created_by: string
  created_at: string
  created_by_user?: {
    name: string
    avatar_url: string
  }
  submissions?: AssignmentSubmission[]
}

interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  content: string
  attachments: string[]
  progress: number
  status: "pending" | "submitted" | "graded"
  earned_points?: number
  feedback?: string
  submitted_at: string
  graded_at?: string
  graded_by?: string
}

export default function StudentAssignments() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionText, setSubmissionText] = useState("")
  const [submissionLinks, setSubmissionLinks] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [userSubmissions, setUserSubmissions] = useState<Record<string, AssignmentSubmission>>({})

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadAssignments()
    setupRealtimeSubscriptions()
  }, [user, router])

  const setupRealtimeSubscriptions = () => {
    const subscription = subscriptions.onAssignmentSubmissions((payload) => {
      if (payload.eventType === "INSERT" && payload.new.student_id === user?.id) {
        toast({
          title: "Assignment Submitted! 🎉",
          description: "Your submission has been received and is being reviewed.",
        })
        loadAssignments() // Refresh assignments
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }

  const loadAssignments = async () => {
    try {
      const { data: assignmentsData, error } = await db.getAssignments()
      if (error) throw error

      setAssignments(assignmentsData || [])

      // Load user's submissions
      const submissionsMap: Record<string, AssignmentSubmission> = {}
      assignmentsData?.forEach((assignment) => {
        const userSubmission = assignment.submissions?.find((sub: AssignmentSubmission) => sub.student_id === user?.id)
        if (userSubmission) {
          submissionsMap[assignment.id] = userSubmission
        }
      })
      setUserSubmissions(submissionsMap)

      setIsLoading(false)
    } catch (error) {
      console.error("Error loading assignments:", error)
      toast({
        title: "Error",
        description: "Failed to load assignments. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSubmitAssignment = async (assignmentId: string) => {
    if (!submissionText.trim()) {
      toast({
        title: "Submission Required",
        description: "Please enter your assignment submission.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = {
        assignment_id: assignmentId,
        student_id: user!.id,
        content: submissionText.trim(),
        attachments: submissionLinks ? [submissionLinks] : [],
        progress: 100,
        status: "submitted" as const,
        submitted_at: new Date().toISOString(),
      }

      const { data, error } = await db.submitAssignment(submissionData)
      if (error) throw error

      // Update local state
      setUserSubmissions((prev) => ({
        ...prev,
        [assignmentId]: data,
      }))

      // Log activity
      await db.logActivity({
        user_id: user!.id,
        action: "assignment_submitted",
        entity_type: "assignment",
        entity_id: assignmentId,
        metadata: { assignment_title: selectedAssignment?.title },
      })

      setSelectedAssignment(null)
      setSubmissionText("")
      setSubmissionLinks("")

      toast({
        title: "Assignment Submitted! 🎉",
        description: "Your assignment has been submitted successfully and is under review.",
      })

      // Refresh assignments to get updated data
      loadAssignments()
    } catch (error) {
      console.error("Error submitting assignment:", error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateProgress = async (assignmentId: string, progress: number) => {
    const existingSubmission = userSubmissions[assignmentId]

    try {
      if (existingSubmission) {
        const { data, error } = await db.updateSubmission(existingSubmission.id, { progress })
        if (error) throw error

        setUserSubmissions((prev) => ({
          ...prev,
          [assignmentId]: { ...prev[assignmentId], progress },
        }))
      } else {
        // Create new submission with progress
        const submissionData = {
          assignment_id: assignmentId,
          student_id: user!.id,
          content: "Work in progress...",
          progress,
          status: "pending" as const,
        }

        const { data, error } = await db.submitAssignment(submissionData)
        if (error) throw error

        setUserSubmissions((prev) => ({
          ...prev,
          [assignmentId]: data,
        }))
      }

      toast({
        title: "Progress Updated! 📈",
        description: `Assignment progress updated to ${progress}%`,
      })
    } catch (error) {
      console.error("Error updating progress:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterStatus !== "all") {
      const submission = userSubmissions[assignment.id]
      if (filterStatus === "pending") {
        matchesFilter = !submission || submission.status === "pending"
      } else if (filterStatus === "submitted") {
        matchesFilter = submission?.status === "submitted"
      } else if (filterStatus === "graded") {
        matchesFilter = submission?.status === "graded"
      }
    }

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "submitted":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "graded":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-600"
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-600"
      case "advanced":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = userSubmissions[assignment.id]
    if (!submission) return "not_started"
    return submission.status
  }

  const getAssignmentProgress = (assignment: Assignment) => {
    const submission = userSubmissions[assignment.id]
    return submission?.progress || 0
  }

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => {
      const submission = userSubmissions[a.id]
      return !submission || submission.status === "pending"
    }).length,
    submitted: assignments.filter((a) => {
      const submission = userSubmissions[a.id]
      return submission?.status === "submitted"
    }).length,
    graded: assignments.filter((a) => {
      const submission = userSubmissions[a.id]
      return submission?.status === "graded"
    }).length,
    averageScore: (() => {
      const gradedSubmissions = Object.values(userSubmissions).filter((s) => s.earned_points && s.status === "graded")
      if (gradedSubmissions.length === 0) return 0
      const totalEarned = gradedSubmissions.reduce((sum, s) => sum + (s.earned_points || 0), 0)
      const totalPossible = gradedSubmissions.reduce((sum, s) => {
        const assignment = assignments.find((a) => a.id === s.assignment_id)
        return sum + (assignment?.total_points || 0)
      }, 0)
      return totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0
    })(),
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
          <h2 className="text-xl font-semibold mb-2">Loading Assignments...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your assignments.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Student Assignments</span>
        </div>
        <h1 className="text-4xl font-bold font-space mb-4">
          My{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Assignments</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track your assignments, submit work, and monitor your academic progress all in one place.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          {
            title: "Total",
            value: stats.total.toString(),
            icon: <FileText className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Pending",
            value: stats.pending.toString(),
            icon: <Clock className="h-5 w-5" />,
            color: "text-yellow-500",
          },
          {
            title: "Submitted",
            value: stats.submitted.toString(),
            icon: <Upload className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Average Score",
            value: `${stats.averageScore}%`,
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-purple-500",
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "submitted" ? "default" : "outline"}
            onClick={() => setFilterStatus("submitted")}
            size="sm"
          >
            Submitted
          </Button>
          <Button
            variant={filterStatus === "graded" ? "default" : "outline"}
            onClick={() => setFilterStatus("graded")}
            size="sm"
          >
            Graded
          </Button>
        </div>
      </motion.div>

      {/* Assignments Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment, index) => {
            const submission = userSubmissions[assignment.id]
            const status = getAssignmentStatus(assignment)
            const progress = getAssignmentProgress(assignment)

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Badge className={getStatusColor(status)}>
                          {status === "not_started" ? "Not Started" : status}
                        </Badge>
                        <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {assignment.total_points} pts
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {assignment.subject}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{assignment.estimated_time}</span>
                      </div>

                      {submission?.earned_points && (
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-green-500" />
                          <span>
                            Score: {submission.earned_points}/{assignment.total_points} (
                            {Math.round((submission.earned_points / assignment.total_points) * 100)}%)
                          </span>
                        </div>
                      )}

                      {submission?.status === "submitted" && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Submitted on {new Date(submission.submitted_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {filteredAssignments.length === 0 && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assignments Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No assignments have been created yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Assignment Details */}
        <div className="sticky top-8">
          {selectedAssignment ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{selectedAssignment.title}</CardTitle>
                      <CardDescription>{selectedAssignment.subject}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(getAssignmentStatus(selectedAssignment))}>
                      {getAssignmentStatus(selectedAssignment) === "not_started"
                        ? "Not Started"
                        : getAssignmentStatus(selectedAssignment)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedAssignment.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Due Date</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedAssignment.due_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Points</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4" />
                        {selectedAssignment.total_points} points
                      </div>
                    </div>
                  </div>

                  {selectedAssignment.requirements && selectedAssignment.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedAssignment.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{getAssignmentProgress(selectedAssignment)}%</span>
                      </div>
                      <Progress value={getAssignmentProgress(selectedAssignment)} className="h-3" />
                      {getAssignmentStatus(selectedAssignment) === "not_started" ||
                      getAssignmentStatus(selectedAssignment) === "pending" ? (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateProgress(
                                selectedAssignment.id,
                                Math.min(getAssignmentProgress(selectedAssignment) + 10, 100),
                              )
                            }
                          >
                            +10%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateProgress(
                                selectedAssignment.id,
                                Math.min(getAssignmentProgress(selectedAssignment) + 25, 100),
                              )
                            }
                          >
                            +25%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProgress(selectedAssignment.id, 100)}
                          >
                            Complete
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {userSubmissions[selectedAssignment.id]?.feedback && (
                    <div>
                      <h4 className="font-semibold mb-2">Feedback</h4>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">{userSubmissions[selectedAssignment.id].feedback}</p>
                      </div>
                    </div>
                  )}

                  {getAssignmentStatus(selectedAssignment) === "not_started" ||
                  getAssignmentStatus(selectedAssignment) === "pending" ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Submit Assignment</h4>
                      <Textarea
                        placeholder="Enter your assignment submission, project description, findings, or additional notes..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows={4}
                      />
                      <Input
                        placeholder="Add links to your project, GitHub repo, demo, etc. (optional)"
                        value={submissionLinks}
                        onChange={(e) => setSubmissionLinks(e.target.value)}
                      />
                      <Button
                        onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                        disabled={isSubmitting || !submissionText.trim()}
                        className="w-full"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  ) : getAssignmentStatus(selectedAssignment) === "submitted" ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold">Assignment Submitted</span>
                      </div>
                      <p className="text-sm text-blue-600">
                        Your assignment has been submitted and is being reviewed by the instructor.
                      </p>
                      {userSubmissions[selectedAssignment.id]?.attachments &&
                        userSubmissions[selectedAssignment.id].attachments.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Submitted Links:</p>
                            {userSubmissions[selectedAssignment.id].attachments.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                              >
                                <LinkIcon className="h-3 w-3" />
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  ) : getAssignmentStatus(selectedAssignment) === "graded" ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Award className="h-4 w-4" />
                        <span className="font-semibold">Assignment Graded</span>
                      </div>
                      <p className="text-sm text-green-600">
                        Your assignment has been graded. Check the feedback section above for details.
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select an Assignment</h3>
                <p className="text-muted-foreground">
                  Click on an assignment from the list to view details and submit your work.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
