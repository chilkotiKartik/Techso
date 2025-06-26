"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      if (typeof window !== "undefined") {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeCanvas)
    }

    // Create stars
    const stars: Array<{ x: number; y: number; size: number; opacity: number; speed: number }> = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Animate stars
        star.y += star.speed
        star.opacity = Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5

        // Reset star position
        if (star.y > canvas.height) {
          star.y = -10
          star.x = Math.random() * canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", resizeCanvas)
      }
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"
              } 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  )
}
