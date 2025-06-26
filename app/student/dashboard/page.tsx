"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  MessageSquare,
  Award,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Rocket,
  Users,
  FolderOpen,
  Brain,
  Target,
  Zap,
  Calendar,
  Heart,
  Eye,
  Share2,
  Plus,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react"

interface StudentProject {
  id: string
  title: string
  description: string
  domain: string
  progress: number
  team_members: string[]
  likes: number
  views: number
  status: "active" | "completed" | "on-hold"
  last_updated: string
}

interface Assignment {
  id: string
  title: string
  description: string
  due_date: string
  subject: string
  priority: "high" | "medium" | "low"
  progress: number
  status: "pending" | "submitted" | "graded"
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  date?: string
  progress?: number
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<StudentProject[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState({
    completedAssignments: 0,
    activeProjects: 0,
    totalPoints: 0,
    rank: 0,
    collaborations: 0,
    researchPapers: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      // Load user's projects
      const { data: projectsData } = await supabase.from("projects").select("*").eq("team_lead_id", user?.id)

      // Mock data for demonstration
      const mockProjects: StudentProject[] = [
        {
          id: "1",
          title: user?.name?.includes("Aishwarya")
            ? "Cultural Drift NLP"
            : user?.name?.includes("Rudra")
              ? "Language Loss Rebuilder"
              : user?.name?.includes("Krishna")
                ? "Contract Summarizer"
                : user?.name?.includes("Satyam")
                  ? "Prompt Feedback Tuner"
                  : user?.name?.includes("Swastik")
                    ? "Turbulence Generator GAN"
                    : user?.name?.includes("Ghantasala")
                      ? "Digital Body Twin"
                      : user?.name?.includes("Meet")
                        ? "Medical Symptom Chatbot"
                        : user?.name?.includes("Yukti")
                          ? "Evolution Path Modeler"
                          : "AI Research Project",
          description: "Advanced research project in cutting-edge technology",
          domain: user?.name?.includes("Aishwarya")
            ? "Cultural Drift NLP"
            : user?.name?.includes("Rudra")
              ? "Language Loss Rebuilder"
              : user?.name?.includes("Krishna")
                ? "Contract Summarizer"
                : user?.name?.includes("Satyam")
                  ? "Prompt Feedback Tuner"
                  : user?.name?.includes("Swastik")
                    ? "Turbulence Generator GAN"
                    : user?.name?.includes("Ghantasala")
                      ? "Digital Body Twin"
                      : user?.name?.includes("Meet")
                        ? "Medical Symptom Chatbot"
                        : user?.name?.includes("Yukti")
                          ? "Evolution Path Modeler"
                          : "AI/ML",
          progress: Math.floor(Math.random() * 40) + 60,
          team_members: ["Team Member 1", "Team Member 2"],
          likes: Math.floor(Math.random() * 100) + 50,
          views: Math.floor(Math.random() * 500) + 200,
          status: "active",
          last_updated: "2 days ago",
        },
      ]

      const mockAssignments: Assignment[] = [
        {
          id: "1",
          title: "Machine Learning Fundamentals",
          description: "Complete the ML basics assignment with practical implementation",
          due_date: "2024-02-15",
          subject: "Data Science",
          priority: "high",
          progress: 75,
          status: "pending",
        },
        {
          id: "2",
          title: "Research Paper Review",
          description: "Review and analyze recent papers in your domain",
          due_date: "2024-02-20",
          subject: "Research Methods",
          priority: "medium",
          progress: 40,
          status: "pending",
        },
        {
          id: "3",
          title: "Project Presentation",
          description: "Prepare presentation for mid-term project review",
          due_date: "2024-02-25",
          subject: "Project Work",
          priority: "high",
          progress: 20,
          status: "pending",
        },
      ]

      const mockAchievements: Achievement[] = [
        {
          id: "1",
          title: "Innovation Pioneer",
          description: "First project submission",
          icon: "🚀",
          earned: true,
          date: "2024-01-15",
        },
        {
          id: "2",
          title: "Team Collaborator",
          description: "Worked with 5+ team members",
          icon: "🤝",
          earned: true,
          date: "2024-01-20",
        },
        {
          id: "3",
          title: "Research Excellence",
          description: "Published research paper",
          icon: "📚",
          earned: false,
          progress: 80,
        },
        {
          id: "4",
          title: "Community Contributor",
          description: "Helped 10+ students",
          icon: "💡",
          earned: false,
          progress: 60,
        },
      ]

      setProjects(mockProjects)
      setAssignments(mockAssignments)
      setAchievements(mockAchievements)

      setStats({
        completedAssignments: 8,
        activeProjects: mockProjects.length,
        totalPoints: 2450,
        rank: Math.floor(Math.random() * 20) + 5,
        collaborations: 12,
        researchPapers: 2,
      })

      setRecentActivity([
        {
          id: "1",
          type: "project_update",
          message: "Updated project progress to 85%",
          time: "2 hours ago",
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          id: "2",
          type: "assignment_submitted",
          message: "Submitted ML Fundamentals assignment",
          time: "1 day ago",
          icon: <CheckCircle className="h-4 w-4" />,
        },
        {
          id: "3",
          type: "collaboration",
          message: "Joined new research team",
          time: "3 days ago",
          icon: <Users className="h-4 w-4" />,
        },
      ])

      setIsLoading(false)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Submit Assignment",
      description: "Upload your latest assignment",
      icon: <Upload className="h-5 w-5" />,
      href: "/student/assignments/submit",
      color: "bg-blue-500",
      count: assignments.filter((a) => a.status === "pending").length,
    },
    {
      title: "Project Progress",
      description: "Update project status",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/student/projects",
      color: "bg-green-500",
      count: projects.length,
    },
    {
      title: "Team Chat",
      description: "Collaborate with team",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/student/chat",
      color: "bg-purple-500",
      count: 5, // unread messages
    },
    {
      title: "Research Hub",
      description: "Access research resources",
      icon: <Brain className="h-5 w-5" />,
      href: "/student/research",
      color: "bg-orange-500",
      count: 12, // new resources
    },
    {
      title: "Achievements",
      description: "View your progress",
      icon: <Award className="h-5 w-5" />,
      href: "/student/achievements",
      color: "bg-yellow-500",
      count: achievements.filter((a) => a.earned).length,
    },
    {
      title: "Network",
      description: "Connect with peers",
      icon: <Users className="h-5 w-5" />,
      href: "/student/network",
      color: "bg-pink-500",
      count: stats.collaborations,
    },
  ]

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
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Enhanced Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}! 🎓</h1>
                <p className="text-muted-foreground text-lg mb-3">Ready to continue your innovation journey?</p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <Star className="h-4 w-4 mr-1" />
                    {user.department} Student
                  </Badge>
                  <Badge variant="outline">Rank #{stats.rank}</Badge>
                  <Badge variant="outline">{stats.totalPoints} Points</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Project</p>
                <p className="font-semibold">{projects[0]?.title || "No active project"}</p>
              </div>
              <Progress value={projects[0]?.progress || 0} className="w-32" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          {
            title: "Assignments",
            value: stats.completedAssignments.toString(),
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-500",
            change: "+2 this week",
          },
          {
            title: "Projects",
            value: stats.activeProjects.toString(),
            icon: <FolderOpen className="h-5 w-5" />,
            color: "text-blue-500",
            change: "1 active",
          },
          {
            title: "Points",
            value: stats.totalPoints.toLocaleString(),
            icon: <Star className="h-5 w-5" />,
            color: "text-yellow-500",
            change: "+150 this month",
          },
          {
            title: "Rank",
            value: `#${stats.rank}`,
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-purple-500",
            change: "↑3 positions",
          },
          {
            title: "Collaborations",
            value: stats.collaborations.toString(),
            icon: <Users className="h-5 w-5" />,
            color: "text-pink-500",
            change: "+4 this month",
          },
          {
            title: "Research",
            value: stats.researchPapers.toString(),
            icon: <Brain className="h-5 w-5" />,
            color: "text-orange-500",
            change: "1 published",
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-xs text-green-600">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common student tasks and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 justify-start hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white`}>
                      {action.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    {action.count > 0 && <Badge className="bg-red-500 text-white">{action.count}</Badge>}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Project */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Current Project
                </CardTitle>
                <CardDescription>Your active research project</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-6">
                    <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        <div>
                          <Badge className="mb-3">{projects[0].domain}</Badge>
                          <h3 className="text-2xl font-bold mb-2">{projects[0].title}</h3>
                          <p className="text-muted-foreground">{projects[0].description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Project Progress</span>
                          <span className="font-bold">{projects[0].progress}%</span>
                        </div>
                        <Progress value={projects[0].progress} className="h-3" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            {projects[0].likes}
                          </span>
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            {projects[0].views}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {projects[0].team_members.length} members
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                    <p className="text-muted-foreground mb-4">Start your first research project today!</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Assignments
                </CardTitle>
                <CardDescription>Assignments due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 border rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{assignment.title}</h4>
                        <Badge
                          variant={
                            assignment.priority === "high"
                              ? "destructive"
                              : assignment.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </span>
                        <span className="font-medium">{assignment.progress}% complete</span>
                      </div>
                      <Progress value={assignment.progress} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Assignments
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
                <CardDescription>Your progress and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        achievement.earned ? "bg-primary/5 border-primary/20 shadow-md" : "bg-muted/30 border-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${achievement.earned ? "" : "grayscale opacity-50"}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          {!achievement.earned && achievement.progress && (
                            <div className="mt-2">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground mt-1">{achievement.progress}% complete</p>
                            </div>
                          )}
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="text-primary mt-1">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  This Week's Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Assignment Completion</span>
                      <span>3/4</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Project Progress</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Team Collaboration</span>
                      <span>12 hours</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
