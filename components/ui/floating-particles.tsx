"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  type: "note" | "sparkle" | "dot"
}

interface FloatingParticlesProps {
  count?: number
  className?: string
  color?: string
  types?: ("note" | "sparkle" | "dot")[]
}

const MusicNote = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className="drop-shadow-lg"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
)

const Sparkle = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className="drop-shadow-lg"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
)

const Dot = ({ size, color }: { size: number; color: string }) => (
  <div
    className="rounded-full drop-shadow-lg"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
    }}
  />
)

export function FloatingParticles({
  count = 15,
  className = "",
  color = "#B8860B",
  types = ["note", "sparkle", "dot"],
}: FloatingParticlesProps) {
  const particles: Particle[] = Array.from({ length: count }, (_, i) => {
    const randomType = types[Math.floor(Math.random() * types.length)] ?? "dot"
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 8,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      type: randomType as "note" | "sparkle" | "dot",
    }
  })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [
              `${particle.y}vh`,
              `${particle.y - 30}vh`,
              `${particle.y}vh`,
            ],
            x: [
              `${particle.x}vw`,
              `${particle.x + (Math.random() - 0.5) * 10}vw`,
              `${particle.x}vw`,
            ],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {particle.type === "note" && <MusicNote size={particle.size} color={color} />}
          {particle.type === "sparkle" && <Sparkle size={particle.size} color={color} />}
          {particle.type === "dot" && <Dot size={particle.size} color={color} />}
        </motion.div>
      ))}
    </div>
  )
}
