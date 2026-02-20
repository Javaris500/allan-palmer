"use client"

import { motion } from "framer-motion"

interface AnimatedGradientMeshProps {
  className?: string
  variant?: "gold" | "purple" | "blue" | "warm"
  intensity?: "subtle" | "medium" | "vibrant"
}

export function AnimatedGradientMesh({ 
  className = "", 
  variant = "gold",
  intensity = "medium" 
}: AnimatedGradientMeshProps) {
  const opacityMap = {
    subtle: { blob: 0.15, glow: 0.1 },
    medium: { blob: 0.25, glow: 0.15 },
    vibrant: { blob: 0.35, glow: 0.25 },
  }

  const colorSchemes = {
    gold: {
      blob1: "rgba(184, 134, 11, VAR)",  // Gold
      blob2: "rgba(218, 165, 32, VAR)",  // Goldenrod
      blob3: "rgba(255, 193, 37, VAR)",  // Golden yellow
      blob4: "rgba(139, 90, 43, VAR)",   // Saddle brown
      glow1: "rgba(255, 215, 0, VAR)",   // Bright gold
      glow2: "rgba(184, 134, 11, VAR)",  // Dark gold
    },
    purple: {
      blob1: "rgba(139, 92, 246, VAR)",
      blob2: "rgba(167, 139, 250, VAR)",
      blob3: "rgba(192, 132, 252, VAR)",
      blob4: "rgba(109, 40, 217, VAR)",
      glow1: "rgba(167, 139, 250, VAR)",
      glow2: "rgba(139, 92, 246, VAR)",
    },
    blue: {
      blob1: "rgba(59, 130, 246, VAR)",
      blob2: "rgba(96, 165, 250, VAR)",
      blob3: "rgba(147, 197, 253, VAR)",
      blob4: "rgba(37, 99, 235, VAR)",
      glow1: "rgba(96, 165, 250, VAR)",
      glow2: "rgba(59, 130, 246, VAR)",
    },
    warm: {
      blob1: "rgba(184, 134, 11, VAR)",
      blob2: "rgba(234, 88, 12, VAR)",
      blob3: "rgba(251, 146, 60, VAR)",
      blob4: "rgba(220, 38, 38, VAR)",
      glow1: "rgba(251, 146, 60, VAR)",
      glow2: "rgba(184, 134, 11, VAR)",
    },
  }

  const colors = colorSchemes[variant]
  const opacity = opacityMap[intensity]

  const getColor = (color: string, op: number) => color.replace("VAR", op.toString())

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient - adapts to theme */}
      <div className="absolute inset-0 bg-background dark:bg-black" />

      {/* Animated blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ 
          background: getColor(colors.blob1, opacity.blob),
          top: "10%",
          left: "10%",
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ 
          background: getColor(colors.blob2, opacity.blob),
          top: "50%",
          right: "10%",
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{ 
          background: getColor(colors.blob3, opacity.blob),
          bottom: "20%",
          left: "30%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-[90px]"
        style={{ 
          background: getColor(colors.blob4, opacity.blob * 0.7),
          top: "30%",
          right: "30%",
        }}
        animate={{
          x: [0, -50, 70, 0],
          y: [0, 80, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Glowing accents */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full blur-[60px]"
        style={{ 
          background: getColor(colors.glow1, opacity.glow),
          top: "20%",
          left: "50%",
        }}
        animate={{
          opacity: [opacity.glow, opacity.glow * 1.5, opacity.glow],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[150px] h-[150px] rounded-full blur-[50px]"
        style={{ 
          background: getColor(colors.glow2, opacity.glow),
          bottom: "30%",
          right: "20%",
        }}
        animate={{
          opacity: [opacity.glow, opacity.glow * 2, opacity.glow],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top fade to content */}
      <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-transparent to-transparent" />
    </div>
  )
}
