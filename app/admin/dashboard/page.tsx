"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
  Users,
  FolderOpen,
  Bell,
  Activity,
  BarChart3,
  Clock,
  AlertCircle,
  Star,
  Zap,
  Target,
  BookOpen,
  Upload,
  Shield,
} from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    pendingAssignments: 0,
    totalAnnouncements: 0,
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeProjects: 89,
        pendingAssignments: 23,
        totalAnnouncements: 15,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  const recentActivities = [
    {
      id: 1,
      type: "user_joined",
      message: "New student Maya Patel joined the platform",
      time: "2 minutes ago",
      icon: <Users className="h-4 w-4" />,
      color: "text-green-500",
    },
    {
      id: 2,
      type: "project_submitted",
      message: "AI Music Composer project submitted by Alex Rodriguez",
      time: "15 minutes ago",
      icon: <Upload className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      id: 3,
      type: "assignment_created",
      message: 'New assignment "Machine Learning Basics" created',
      time: "1 hour ago",
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-purple-500",
    },
    {
      id: 4,
      type: "announcement",
      message: "System maintenance scheduled for tonight",
      time: "2 hours ago",
      icon: <Bell className="h-4 w-4" />,
      color: "text-orange-500",
    },
  ]

  const topProjects = [
    {
      id: 1,
      name: "AI Music Composer",
      author: "Alex Rodriguez",
      progress: 85,
      likes: 234,
      category: "AI/ML",
    },
    {
      id: 2,
      name: "Mental Health Companion",
      author: "Maya Patel",
      progress: 92,
      likes: 189,
      category: "Healthcare",
    },
    {
      id: 3,
      name: "Smart Campus System",
      author: "Team Alpha",
      progress: 67,
      likes: 156,
      category: "IoT",
    },
  ]

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Broadcast message to all users",
      icon: <Bell className="h-5 w-5" />,
      href: "/admin/announcements/create",
      color: "bg-blue-500",
    },
    {
      title: "Add Assignment",
      description: "Create new assignment for students",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/admin/assignments/create",
      color: "bg-green-500",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      color: "bg-purple-500",
    },
    {
      title: "Project Analytics",
      description: "View detailed project statistics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics",
      color: "bg-orange-500",
    },
  ]

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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
          </div>
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Badge>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {[
          {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: "+12%",
            icon: <Users className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Active Projects",
            value: stats.activeProjects.toString(),
            change: "+8%",
            icon: <FolderOpen className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Pending Assignments",
            value: stats.pendingAssignments.toString(),
            change: "-5%",
            icon: <Clock className="h-5 w-5" />,
            color: "text-orange-500",
          },
          {
            title: "Announcements",
            value: stats.totalAnnouncements.toString(),
            change: "+3%",
            icon: <Bell className="h-5 w-5" />,
            color: "text-purple-500",
          },
        ].map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
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
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => router.push(action.href)}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mr-3`}
                      >
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Top Performing Projects
                </CardTitle>
                <CardDescription>Most liked and active projects this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProjects.map((project, index) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">by {project.author}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Progress value={project.progress} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground">{project.progress}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            {project.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`${activity.color} mt-1`}>{activity.icon}</div>
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

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Server Status", status: "Operational", color: "text-green-500" },
                    { name: "Database", status: "Operational", color: "text-green-500" },
                    { name: "File Storage", status: "Operational", color: "text-green-500" },
                    { name: "Chat Service", status: "Maintenance", color: "text-orange-500" },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{service.name}</span>
                      <Badge variant="outline" className={service.color}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
