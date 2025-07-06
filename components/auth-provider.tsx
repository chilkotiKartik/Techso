"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Types
interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  created_at: string
}

interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  role: "admin" | "student"
  domain?: string
  team_members?: string[]
  project_title?: string
  avatar_url?: string
  bio?: string
  achievements?: string[]
  points?: number
  level?: number
  department?: string
  year?: string
  github_links?: string[]
  linkedin_links?: string[]
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Real IIT Madras student data with projects
const mockUsers: (User & Profile)[] = [
  // Admin
  {
    id: "admin-1",
    email: "admin@infinity.edu",
    name: "Dr. Sarah Johnson",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "admin-1",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
    bio: "Platform Administrator & Research Director",
    achievements: ["System Setup", "Research Excellence", "Innovation Leader"],
    points: 1000,
    level: 10,
    department: "Administration",
  },
  // Student with simplified email for demo
  {
    id: "student-demo",
    email: "student@infinity.edu",
    name: "Demo Student",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-demo",
    domain: "AI/ML Research",
    team_members: ["Team Member 1", "Team Member 2"],
    project_title: "AI Research Project",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    bio: "Passionate about AI and Machine Learning",
    achievements: ["AI Pioneer", "Team Leader", "Research Excellence"],
    points: 750,
    level: 7,
    department: "Data Science",
    year: "2nd Year",
  },
  // Real Students with Projects
  {
    id: "student-1",
    email: "krishna@infinity.edu",
    name: "Krishna Vallabha Goswami",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-1",
    domain: "AI/NLP",
    team_members: [],
    project_title: "LexiSummarizer AI",
    avatar_url: "https://ui-avatars.com/api/?name=Krishna+Vallabha+Goswami&background=3b82f6&color=fff&size=150",
    bio: "Working on AI-powered text summarization and legal document analysis",
    achievements: ["NLP Expert", "Legal Tech Pioneer", "AI Developer"],
    points: 820,
    level: 8,
    department: "Data Science",
    year: "3rd Year",
    github_links: ["https://github.com/Krishna2622"],
    linkedin_links: [],
  },
  {
    id: "student-2",
    email: "jasmitha@infinity.edu",
    name: "Sai Jasmitha Naidu Kancharlapalli",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-2",
    domain: "FinTech/AI",
    team_members: ["Anushree Balaji", "Ramakrishna R", "Satyam Singh"],
    project_title: "XCredit - Explainable Credit Scorer",
    avatar_url: "https://ui-avatars.com/api/?name=Sai+Jasmitha&background=10b981&color=fff&size=150",
    bio: "Developing explainable AI for credit scoring and financial technology",
    achievements: ["FinTech Innovator", "Team Leader", "AI Ethics Advocate"],
    points: 780,
    level: 7,
    department: "Data Science",
    year: "2nd Year",
    github_links: ["https://github.com/jas127"],
    linkedin_links: ["https://www.linkedin.com/in/jasmitha-kancharlapalli-7a6627305/"],
  },
  {
    id: "student-3",
    email: "aishwarya@infinity.edu",
    name: "Aishwarya Maan Srivastava",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-3",
    domain: "Cultural NLP",
    team_members: ["Namish Kumar Sahu", "Sayan Ray"],
    project_title: "Cultural Drift NLP",
    avatar_url: "https://ui-avatars.com/api/?name=Aishwarya+Maan&background=8b5cf6&color=fff&size=150",
    bio: "Researching cultural linguistics and NLP for preserving cultural heritage",
    achievements: ["Cultural Tech Pioneer", "NLP Researcher", "Heritage Preservationist"],
    points: 750,
    level: 7,
    department: "Data Science",
    year: "2nd Year",
    github_links: ["https://github.com/Aish-TheMagician"],
    linkedin_links: ["https://www.linkedin.com/in/aishwarya-maan-srivastava-b883a1255/"],
  },
  {
    id: "student-4",
    email: "swastik@infinity.edu",
    name: "Swastik Joshi",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-4",
    domain: "Computer Vision/GAN",
    team_members: ["Rishi Mehrotra", "Siddharth Malkania", "Meet Parmar"],
    project_title: "Turbulence Generator GAN",
    avatar_url: "https://ui-avatars.com/api/?name=Swastik+Joshi&background=f59e0b&color=fff&size=150",
    bio: "Developing GANs for fluid dynamics simulation and turbulence modeling",
    achievements: ["GAN Expert", "Fluid Dynamics Researcher", "Computer Vision Pioneer"],
    points: 890,
    level: 8,
    department: "Data Science",
    year: "3rd Year",
    github_links: ["https://github.com/sawoaj"],
    linkedin_links: ["https://www.linkedin.com/in/swasj/"],
  },
  {
    id: "student-5",
    email: "rudra@infinity.edu",
    name: "Rudra Narayan Meher",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-5",
    domain: "Language AI",
    team_members: ["Parag Pawar", "Snehlata Kumari"],
    project_title: "LostLing AI",
    avatar_url: "https://ui-avatars.com/api/?name=Rudra+Narayan&background=ef4444&color=fff&size=150",
    bio: "Working on AI for endangered language preservation and revival",
    achievements: ["Language AI Expert", "Cultural Preservationist", "NLP Researcher"],
    points: 720,
    level: 6,
    department: "Data Science",
    year: "2nd Year",
    github_links: ["https://github.com/Rudra045"],
    linkedin_links: ["https://www.linkedin.com/in/rudra-meher-b92986347"],
  },
  {
    id: "student-6",
    email: "harman@infinity.edu",
    name: "Harmanpreet Kaur",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-6",
    domain: "Music AI",
    team_members: ["Sayan", "Kartik", "Raj Ranjan"],
    project_title: "Music AI",
    avatar_url: "https://ui-avatars.com/api/?name=Harmanpreet+Kaur&background=ec4899&color=fff&size=150",
    bio: "Creating AI systems for music generation and audio processing",
    achievements: ["Music AI Pioneer", "Audio Processing Expert", "Creative Technologist"],
    points: 680,
    level: 6,
    department: "Data Science",
    year: "2nd Year",
    github_links: ["https://github.com/kaur-hp001"],
    linkedin_links: ["https://www.linkedin.com/in/harmanpreet-kaur-949a53287/"],
  },
  {
    id: "student-7",
    email: "satyam@infinity.edu",
    name: "Satyam Singh",
    role: "student",
    created_at: "2024-01-01T00:00:00Z",
    user_id: "student-7",
    domain: "Prompt Engineering",
    team_members: ["Jasmitha", "Devansh Bhatia", "Gourav Mandal"],
    project_title: "Prompt Feedback Tuner",
    avatar_url: "https://ui-avatars.com/api/?name=Satyam+Singh&background=06b6d4&color=fff&size=150",
    bio: "Developing AI systems for prompt optimization and feedback tuning",
    achievements: ["Prompt Engineer", "AI Optimizer", "System Designer"],
    points: 760,
    level: 7,
    department: "Data Science",
    year: "3rd Year",
    github_links: ["https://github.com/satyam-singh-dev"],
    linkedin_links: ["https://in.linkedin.com/in/satyam-singh-a73935370"],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("infinity-user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setProfile(userData)
      } catch (error) {
        localStorage.removeItem("infinity-user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock data
      const foundUser = mockUsers.find((u) => u.email === email)

      if (!foundUser) {
        toast({
          title: "Login Failed",
          description: "User not found. Please check your email address.",
          variant: "destructive",
        })
        setLoading(false)
        return false
      }

      // Check password
      let expectedPassword = ""
      if (foundUser.role === "admin") {
        expectedPassword = "admin123"
      } else {
        expectedPassword = "student123"
      }

      if (password !== expectedPassword) {
        toast({
          title: "Login Failed",
          description: `Invalid password. ${foundUser.role === "admin" ? "Use admin123" : "Use student123"}`,
          variant: "destructive",
        })
        setLoading(false)
        return false
      }

      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        created_at: foundUser.created_at,
      }

      const profileData = {
        id: foundUser.id,
        user_id: foundUser.user_id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        domain: foundUser.domain,
        team_members: foundUser.team_members,
        project_title: foundUser.project_title,
        avatar_url: foundUser.avatar_url,
        bio: foundUser.bio,
        achievements: foundUser.achievements,
        points: foundUser.points,
        level: foundUser.level,
        department: foundUser.department,
        year: foundUser.year,
        github_links: foundUser.github_links,
        linkedin_links: foundUser.linkedin_links,
      }

      setUser(userData)
      setProfile(profileData)
      localStorage.setItem("infinity-user", JSON.stringify({ ...userData, ...profileData }))

      toast({
        title: `Welcome back, ${foundUser.name.split(" ")[0]}! 🚀`,
        description: `Successfully logged in as ${foundUser.role}`,
      })

      setLoading(false)
      return true
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, name: string, role: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email)
      if (existingUser) {
        toast({
          title: "Registration Failed",
          description: "User with this email already exists.",
          variant: "destructive",
        })
        setLoading(false)
        return false
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: role as "admin" | "student",
        created_at: new Date().toISOString(),
      }

      const newProfile = {
        id: newUser.id,
        user_id: newUser.id,
        name,
        email,
        role: role as "admin" | "student",
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=150`,
        bio: "",
        achievements: [],
        points: 0,
        level: 1,
        department: role === "student" ? "Data Science" : "Administration",
        year: role === "student" ? "1st Year" : undefined,
      }

      setUser(newUser)
      setProfile(newProfile)
      localStorage.setItem("infinity-user", JSON.stringify({ ...newUser, ...newProfile }))

      toast({
        title: "Account Created! 🎉",
        description: "Welcome to Infinity Tech Society!",
      })

      setLoading(false)
      return true
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      setUser(null)
      setProfile(null)
      localStorage.removeItem("infinity-user")

      toast({
        title: "Successfully Logged Out! 👋",
        description: "Thank you for using Infinity Tech Society. See you soon!",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return

    try {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)

      const savedData = localStorage.getItem("infinity-user")
      if (savedData) {
        const userData = JSON.parse(savedData)
        localStorage.setItem("infinity-user", JSON.stringify({ ...userData, ...updatedProfile }))
      }

      toast({
        title: "Profile Updated! ✨",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    register,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
