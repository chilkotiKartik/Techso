"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const PARTICLE_COUNT = 50

type Particle = {
  left: number
  top: number
  x: number
  duration: number
  delay: number
}

export function SpaceParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        x: Math.random() * 50 - 25,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 5,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, p.x, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
