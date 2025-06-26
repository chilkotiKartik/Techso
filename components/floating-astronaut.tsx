"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function FloatingAstronaut() {
  return (
    <motion.div
      className="relative w-64 h-64"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/relaxing-astronaut-yyUCgKAA2gv2biGhYAtZqM50kHMUFR.png"
        alt="Floating Astronaut"
        width={256}
        height={256}
        className="w-full h-full object-contain"
      />
    </motion.div>
  )
}
