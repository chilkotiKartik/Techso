"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { SpaceBackground } from "@/components/space-background"
import {
  Rocket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
  Brain,
  Users,
  Star,
  Zap,
} from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"student" | "admin" | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      role: "Student Access",
      email: "student@infinity.edu",
      password: "student123",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500",
      description: "Access student dashboard, projects, and collaboration tools",
      features: ["Project Management", "Team Collaboration", "Resource Access", "Assignment Tracking"],
      type: "student" as const,
    },
    {
      role: "Admin Access",
      email: "admin@infinity.edu",
      password: "admin123",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-gradient-to-br from-red-500 via-pink-500 to-orange-500",
      description: "Full platform administration and management access",
      features: ["User Management", "Project Review", "Analytics", "System Control"],
      type: "admin" as const,
    },
  ]

  const fillDemoCredentials = (email: string, password: string, role: "student" | "admin") => {
    setEmail(email)
    setPassword(password)
    setSelectedRole(role)
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SpaceBackground />

      {/* Enhanced floating particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                i % 3 === 0 ? "bg-blue-400/40" : i % 3 === 1 ? "bg-purple-400/40" : "bg-pink-400/40"
              }`}
              initial={{
                x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
                y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
              }}
              animate={{
                x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
                y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Enhanced Header */}
            <div className="text-center mb-12">
              <motion.div
                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl relative"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Rocket className="h-12 w-12 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Infinity
                </span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                IIT Madras Innovation Hub - Where Ideas Transform into Reality
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>1000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>500+ Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>50+ Research Papers</span>
                </div>
              </motion.div>
            </div>

            {/* Role Selection Cards */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {demoAccounts.map((account, index) => (
                <motion.div
                  key={account.role}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card
                    className={`relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group ${
                      selectedRole === account.type ? "ring-2 ring-primary shadow-primary/25" : ""
                    }`}
                    onClick={() => fillDemoCredentials(account.email, account.password, account.type)}
                  >
                    <div
                      className={`absolute inset-0 ${account.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                    />

                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl ${account.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {account.icon}
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ArrowRight className="h-6 w-6 text-primary" />
                        </motion.div>
                      </div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                        {account.role}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">{account.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Key Features:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {account.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Quick Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Login Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <Card className="max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Lock className="h-6 w-6" />
                    Sign In
                  </CardTitle>
                  <CardDescription>
                    {selectedRole ? (
                      <span className="flex items-center justify-center gap-2">
                        {selectedRole === "student" ? (
                          <>
                            <GraduationCap className="h-4 w-4" />
                            Student Dashboard Access
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4" />
                            Admin Panel Access
                          </>
                        )}
                      </span>
                    ) : (
                      "Choose a role above to continue"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={isLoading || !email || !password}
                        >
                          {isLoading ? (
                            <motion.div
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            />
                          ) : (
                            <>
                              <Rocket className="mr-2 h-5 w-5" />
                              Launch Dashboard
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </form>

                  <Separator className="my-6" />

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">New to Infinity? </span>
                    <Link href="/register" className="text-primary hover:underline font-medium">
                      Request Access
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link href="/">
                <Button variant="ghost" size="lg" className="hover:bg-white/10 text-lg">
                  ← Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
