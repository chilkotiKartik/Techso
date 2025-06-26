"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  GraduationCap,
  Shield,
  Mail,
  Calendar,
  Activity,
  AlertCircle,
  UserPlus,
  Download,
  Upload,
} from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "student" | "teacher"
  department: string
  year?: string
  avatar_url: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  joinedAt: string
  projectsCount: number
  points: number
  level: number
}

export default function UserManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    loadUsers()
  }, [user, router])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const loadUsers = async () => {
    try {
      // Mock user data based on real students
      const mockUsers: UserData[] = [
        {
          id: "admin-1",
          name: "Dr. Sarah Johnson",
          email: "admin@infinity.edu",
          role: "admin",
          department: "Administration",
          avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
          status: "active",
          lastLogin: "2024-01-23T10:30:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 0,
          points: 1000,
          level: 10,
        },
        {
          id: "student-1",
          name: "Krishna Vallabha Goswami",
          email: "krishna@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "3rd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Krishna+Vallabha+Goswami&background=3b82f6&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-23T09:15:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 1,
          points: 820,
          level: 8,
        },
        {
          id: "student-2",
          name: "Sai Jasmitha Naidu Kancharlapalli",
          email: "jasmitha@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "2nd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Sai+Jasmitha&background=10b981&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-23T08:45:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 2,
          points: 780,
          level: 7,
        },
        {
          id: "student-3",
          name: "Aishwarya Maan Srivastava",
          email: "aishwarya@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "2nd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Aishwarya+Maan&background=8b5cf6&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-22T16:20:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 1,
          points: 750,
          level: 7,
        },
        {
          id: "student-4",
          name: "Swastik Joshi",
          email: "swastik@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "3rd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Swastik+Joshi&background=f59e0b&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-23T07:30:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 1,
          points: 890,
          level: 8,
        },
        {
          id: "student-5",
          name: "Rudra Narayan Meher",
          email: "rudra@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "2nd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Rudra+Narayan&background=ef4444&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-22T14:10:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 1,
          points: 720,
          level: 6,
        },
        {
          id: "student-6",
          name: "Harmanpreet Kaur",
          email: "harman@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "2nd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Harmanpreet+Kaur&background=ec4899&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-22T11:45:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 1,
          points: 680,
          level: 6,
        },
        {
          id: "student-7",
          name: "Satyam Singh",
          email: "satyam@infinity.edu",
          role: "student",
          department: "Data Science",
          year: "3rd Year",
          avatar_url: "https://ui-avatars.com/api/?name=Satyam+Singh&background=06b6d4&color=fff&size=150",
          status: "active",
          lastLogin: "2024-01-23T06:20:00Z",
          joinedAt: "2024-01-01T00:00:00Z",
          projectsCount: 2,
          points: 760,
          level: 7,
        },
      ]

      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "edit" | "suspend" | "activate" | "delete") => {
    try {
      const updatedUsers = users
        .map((user) => {
          if (user.id === userId) {
            switch (action) {
              case "suspend":
                return { ...user, status: "suspended" as const }
              case "activate":
                return { ...user, status: "active" as const }
              case "delete":
                return null
              default:
                return user
            }
          }
          return user
        })
        .filter(Boolean) as UserData[]

      if (action === "delete") {
        setUsers(updatedUsers)
      } else {
        setUsers(updatedUsers)
      }

      toast({
        title: "Success",
        description: `User ${action === "delete" ? "deleted" : action === "suspend" ? "suspended" : "activated"} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} user.`,
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "teacher":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "student":
        return "bg-blue-500"
      case "teacher":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Users...</h2>
          <p className="text-muted-foreground">Fetching user data...</p>
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
              <Users className="h-8 w-8 text-primary" />
              User Management
            </h1>
            <p className="text-muted-foreground">Manage platform users and their permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
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
            title: "Total Users",
            value: users.length.toString(),
            icon: <Users className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Students",
            value: users.filter((u) => u.role === "student").length.toString(),
            icon: <GraduationCap className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Active Users",
            value: users.filter((u) => u.status === "active").length.toString(),
            icon: <Activity className="h-5 w-5" />,
            color: "text-purple-500",
          },
          {
            title: "Admins",
            value: users.filter((u) => u.role === "admin").length.toString(),
            icon: <Shield className="h-5 w-5" />,
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

      {/* Filters */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage all platform users and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((userData, index) => (
                <motion.div
                  key={userData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="p-4 border rounded-xl hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userData.avatar_url || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback>
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{userData.name}</h3>
                          <Badge className={`${getRoleColor(userData.role)} text-white gap-1`}>
                            {getRoleIcon(userData.role)}
                            {userData.role}
                          </Badge>
                          <Badge className={`${getStatusColor(userData.status)} text-white`}>{userData.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {userData.email}
                          </span>
                          <span>{userData.department}</span>
                          {userData.year && <span>{userData.year}</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(userData.joinedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Last login {new Date(userData.lastLogin).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="font-semibold">{userData.points} pts</div>
                        <div className="text-muted-foreground">Level {userData.level}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold">{userData.projectsCount}</div>
                        <div className="text-muted-foreground">Projects</div>
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
                            <DialogTitle>User Actions</DialogTitle>
                            <DialogDescription>Choose an action for {userData.name}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-2">
                            <Button variant="outline" className="justify-start gap-2">
                              <Edit className="h-4 w-4" />
                              Edit User
                            </Button>
                            {userData.status === "active" ? (
                              <Button
                                variant="outline"
                                className="justify-start gap-2 text-yellow-600"
                                onClick={() => handleUserAction(userData.id, "suspend")}
                              >
                                <AlertCircle className="h-4 w-4" />
                                Suspend User
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="justify-start gap-2 text-green-600"
                                onClick={() => handleUserAction(userData.id, "activate")}
                              >
                                <Activity className="h-4 w-4" />
                                Activate User
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="justify-start gap-2 text-red-600 hover:text-red-700"
                              onClick={() => handleUserAction(userData.id, "delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
