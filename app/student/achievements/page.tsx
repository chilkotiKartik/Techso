"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/database"
import {
  Award,
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Gem,
  Shield,
  Rocket,
  Brain,
  Users,
  Code,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Lock,
  CheckCircle,
  Clock,
} from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  difficulty: string
  points: number
  requirements: string[]
  rarity: string
  is_active: boolean
}

interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  progress: number
  max_progress: number
  earned: boolean
  earned_at?: string
  achievement: Achievement
}

export default function StudentAchievements() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: "all", label: "All", icon: <Award className="h-4 w-4" /> },
    { id: "onboarding", label: "Getting Started", icon: <Rocket className="h-4 w-4" /> },
    { id: "academic", label: "Academic", icon: <BookOpen className="h-4 w-4" /> },
    { id: "collaboration", label: "Collaboration", icon: <Users className="h-4 w-4" /> },
    { id: "innovation", label: "Innovation", icon: <Brain className="h-4 w-4" /> },
    { id: "leadership", label: "Leadership", icon: <Crown className="h-4 w-4" /> },
    { id: "specialization", label: "Specialization", icon: <Target className="h-4 w-4" /> },
    { id: "research", label: "Research", icon: <BookOpen className="h-4 w-4" /> },
  ]

  const rarities = [
    { id: "all", label: "All Rarities", color: "text-gray-500" },
    { id: "common", label: "Common", color: "text-gray-500" },
    { id: "uncommon", label: "Uncommon", color: "text-green-500" },
    { id: "rare", label: "Rare", color: "text-blue-500" },
    { id: "epic", label: "Epic", color: "text-purple-500" },
    { id: "legendary", label: "Legendary", color: "text-orange-500" },
  ]

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadUserAchievements()
  }, [user, router])

  const loadUserAchievements = async () => {
    try {
      const { data, error } = await db.getUserAchievements(user!.id)
      if (error) throw error

      setUserAchievements(data || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading achievements:", error)
      toast({
        title: "Error",
        description: "Failed to load achievements. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const filteredAchievements = userAchievements.filter((userAchievement) => {
    const achievement = userAchievement.achievement
    const matchesCategory = selectedCategory === "all" || achievement.category === selectedCategory
    const matchesRarity = selectedRarity === "all" || achievement.rarity === selectedRarity
    return matchesCategory && matchesRarity
  })

  const getIconComponent = (iconString: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "🚀": <Rocket className="h-6 w-6" />,
      "🤝": <Users className="h-6 w-6" />,
      "💻": <Code className="h-6 w-6" />,
      "📚": <BookOpen className="h-6 w-6" />,
      "💡": <Brain className="h-6 w-6" />,
      "👑": <Crown className="h-6 w-6" />,
      "🧠": <Brain className="h-6 w-6" />,
      "🌐": <Users className="h-6 w-6" />,
      "⭐": <Star className="h-6 w-6" />,
      "🏆": <Trophy className="h-6 w-6" />,
      "💎": <Gem className="h-6 w-6" />,
      "🛡️": <Shield className="h-6 w-6" />,
      "⚡": <Zap className="h-6 w-6" />,
    }
    return iconMap[iconString] || <Award className="h-6 w-6" />
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-500 border-gray-500/20 bg-gray-500/10"
      case "uncommon":
        return "text-green-500 border-green-500/20 bg-green-500/10"
      case "rare":
        return "text-blue-500 border-blue-500/20 bg-blue-500/10"
      case "epic":
        return "text-purple-500 border-purple-500/20 bg-purple-500/10"
      case "legendary":
        return "text-orange-500 border-orange-500/20 bg-orange-500/10"
      default:
        return "text-gray-500 border-gray-500/20 bg-gray-500/10"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-500/10"
      case "intermediate":
        return "text-yellow-600 bg-yellow-500/10"
      case "advanced":
        return "text-red-600 bg-red-500/10"
      default:
        return "text-gray-600 bg-gray-500/10"
    }
  }

  const stats = {
    total: userAchievements.length,
    earned: userAchievements.filter((ua) => ua.earned).length,
    totalPoints: userAchievements.filter((ua) => ua.earned).reduce((sum, ua) => sum + ua.achievement.points, 0),
    inProgress: userAchievements.filter((ua) => !ua.earned && ua.progress > 0).length,
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
          <h2 className="text-xl font-semibold mb-2">Loading Achievements...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your achievements.</p>
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
          <Trophy className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Student Achievements</span>
        </div>
        <h1 className="text-4xl font-bold font-space mb-4">
          My{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Achievements
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track your progress, unlock new achievements, and showcase your accomplishments in the innovation journey.
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
            icon: <Award className="h-5 w-5" />,
            color: "text-blue-500",
          },
          {
            title: "Earned",
            value: stats.earned.toString(),
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-500",
          },
          {
            title: "Points",
            value: stats.totalPoints.toString(),
            icon: <Star className="h-5 w-5" />,
            color: "text-yellow-500",
          },
          {
            title: "In Progress",
            value: stats.inProgress.toString(),
            icon: <Clock className="h-5 w-5" />,
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

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {rarities.map((rarity) => (
            <Button
              key={rarity.id}
              variant={selectedRarity === rarity.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRarity(rarity.id)}
              className={`${rarity.color}`}
            >
              {rarity.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((userAchievement, index) => {
          const achievement = userAchievement.achievement
          const isEarned = userAchievement.earned
          const progress = userAchievement.progress
          const maxProgress = userAchievement.max_progress

          return (
            <motion.div
              key={userAchievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
                  isEarned ? "ring-2 ring-primary/20 shadow-primary/10" : ""
                } ${!isEarned && progress === 0 ? "opacity-75" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${getRarityColor(achievement.rarity)} ${
                          isEarned ? "" : "grayscale opacity-50"
                        }`}
                      >
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                          <Badge className={getDifficultyColor(achievement.difficulty)}>{achievement.difficulty}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isEarned ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : progress > 0 ? (
                        <Clock className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">{achievement.description}</CardDescription>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {achievement.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress */}
                  {!isEarned && progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round((progress / maxProgress) * 100)}%</span>
                      </div>
                      <Progress value={(progress / maxProgress) * 100} className="h-2" />
                    </div>
                  )}

                  {/* Points and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{achievement.points} points</span>
                    </div>
                    {isEarned && userAchievement.earned_at && (
                      <span className="text-xs text-muted-foreground">
                        Earned {new Date(userAchievement.earned_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">
                      {achievement.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Achievements Found</h3>
            <p className="text-muted-foreground">
              {selectedCategory !== "all" || selectedRarity !== "all"
                ? "Try adjusting your filter criteria to see more achievements."
                : "Start your journey by completing assignments and participating in projects to unlock achievements!"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Achievement Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tips to Earn More Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🎯 Stay Active</h4>
                <p className="text-muted-foreground">
                  Regularly submit assignments, participate in projects, and engage with the community.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🤝 Collaborate</h4>
                <p className="text-muted-foreground">
                  Join project teams, help other students, and contribute to group discussions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💡 Innovate</h4>
                <p className="text-muted-foreground">
                  Create unique projects, propose new ideas, and push the boundaries of technology.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📚 Learn Continuously</h4>
                <p className="text-muted-foreground">
                  Explore new technologies, complete research papers, and expand your skill set.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
