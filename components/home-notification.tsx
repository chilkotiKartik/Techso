"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Rocket, Star } from "lucide-react"
import Link from "next/link"

export function HomeNotification() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-20 right-4 z-50 max-w-sm"
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/90 to-purple-600/90 text-white border-0 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <h3 className="font-semibold">Welcome to Infinity!</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Join our community of innovators and start building the future today!
            </p>
            <div className="flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  <Rocket className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
