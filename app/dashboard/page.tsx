"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    // Redirect based on user role
    switch (user.role) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "teacher":
        router.push("/teacher/dashboard")
        break
      case "student":
        router.push("/student/dashboard")
        break
      default:
        router.push("/login")
    }
  }, [user, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Checking authentication...</h2>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </motion.div>
    </div>
  )
}
