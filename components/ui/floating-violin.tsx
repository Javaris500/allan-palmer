"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface FloatingViolinProps {
  className?: string
  size?: number
  followMouse?: boolean
}

export function FloatingViolin({
  className = "",
  size = 200,
  followMouse = true,
}: FloatingViolinProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 100, damping: 30 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)

  useEffect(() => {
    if (!followMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = (e.clientX - centerX) / (window.innerWidth / 2)
      const y = (e.clientY - centerY) / (window.innerHeight / 2)
      
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [followMouse, mouseX, mouseY])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="relative"
      >
        {/* 3D Violin SVG with depth layers */}
        <svg
          width={size}
          height={size * 1.5}
          viewBox="0 0 100 150"
          className="drop-shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="violinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="50%" stopColor="#A0522D" />
              <stop offset="100%" stopColor="#654321" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>
          </defs>

          {/* Shadow layer (pushed back) */}
          <motion.g
            style={{ transform: "translateZ(-20px)" }}
            opacity={0.3}
          >
            <ellipse cx="50" cy="95" rx="28" ry="40" fill="#000" />
          </motion.g>

          {/* Body back layer */}
          <motion.g style={{ transform: "translateZ(-10px)" }}>
            <ellipse cx="50" cy="95" rx="26" ry="38" fill="#5D3A1A" />
          </motion.g>

          {/* Main body */}
          <motion.g style={{ transform: "translateZ(0px)" }} filter="url(#glow)">
            {/* Upper bout */}
            <ellipse cx="50" cy="65" rx="18" ry="22" fill="url(#violinGradient)" />
            {/* Lower bout */}
            <ellipse cx="50" cy="105" rx="24" ry="30" fill="url(#violinGradient)" />
            {/* C-bouts (waist) */}
            <path
              d="M 32 85 Q 38 95 32 105 M 68 85 Q 62 95 68 105"
              stroke="#654321"
              strokeWidth="2"
              fill="none"
            />
            {/* F-holes */}
            <path
              d="M 38 80 Q 42 90 38 100"
              stroke="#1a1a1a"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 62 80 Q 58 90 62 100"
              stroke="#1a1a1a"
              strokeWidth="2"
              fill="none"
            />
          </motion.g>

          {/* Bridge and strings (front layer) */}
          <motion.g style={{ transform: "translateZ(10px)" }}>
            {/* Bridge */}
            <rect x="42" y="92" width="16" height="4" fill="#DAA520" rx="1" />
            
            {/* Strings */}
            <line x1="44" y1="30" x2="44" y2="130" stroke="url(#goldGradient)" strokeWidth="0.5" />
            <line x1="48" y1="30" x2="48" y2="130" stroke="url(#goldGradient)" strokeWidth="0.5" />
            <line x1="52" y1="30" x2="52" y2="130" stroke="url(#goldGradient)" strokeWidth="0.5" />
            <line x1="56" y1="30" x2="56" y2="130" stroke="url(#goldGradient)" strokeWidth="0.5" />
            
            {/* Fingerboard */}
            <rect x="46" y="20" width="8" height="70" fill="#1a1a1a" rx="2" />
          </motion.g>

          {/* Scroll (top) */}
          <motion.g style={{ transform: "translateZ(5px)" }}>
            <path
              d="M 46 20 L 46 10 Q 46 5 50 5 Q 54 5 54 10 L 54 20"
              fill="#654321"
            />
            {/* Scroll curl */}
            <circle cx="50" cy="8" r="5" fill="url(#violinGradient)" />
            <circle cx="50" cy="8" r="3" fill="#1a1a1a" />
            
            {/* Tuning pegs */}
            <rect x="38" y="12" width="8" height="2" fill="#1a1a1a" rx="1" />
            <rect x="54" y="12" width="8" height="2" fill="#1a1a1a" rx="1" />
            <rect x="38" y="17" width="8" height="2" fill="#1a1a1a" rx="1" />
            <rect x="54" y="17" width="8" height="2" fill="#1a1a1a" rx="1" />
          </motion.g>

          {/* Tailpiece */}
          <motion.g style={{ transform: "translateZ(8px)" }}>
            <path
              d="M 44 125 L 46 135 L 54 135 L 56 125 Z"
              fill="#1a1a1a"
            />
            {/* Chin rest */}
            <ellipse cx="35" cy="115" rx="8" ry="12" fill="#2a2a2a" />
          </motion.g>

          {/* Highlight/shine */}
          <motion.ellipse
            cx="55"
            cy="75"
            rx="8"
            ry="15"
            fill="white"
            opacity={0.1}
            style={{ transform: "translateZ(15px)" }}
          />
        </svg>

        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30"
          style={{
            background: "radial-gradient(circle, #B8860B 0%, transparent 70%)",
            transform: "translateZ(-30px)",
          }}
        />
      </motion.div>
    </div>
  )
}

// Simpler floating bow component
export function FloatingBow({ className = "", size = 150 }: { className?: string; size?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={size} height={size * 0.1} viewBox="0 0 200 20" className="drop-shadow-lg">
        <defs>
          <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
        </defs>
        {/* Bow stick */}
        <path
          d="M 10 10 Q 100 5 190 10"
          stroke="url(#bowGradient)"
          strokeWidth="3"
          fill="none"
        />
        {/* Bow hair */}
        <path
          d="M 15 12 Q 100 18 185 12"
          stroke="#E8E8E8"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Frog */}
        <rect x="5" y="7" width="12" height="6" fill="#1a1a1a" rx="1" />
        {/* Tip */}
        <polygon points="185,8 195,10 185,12" fill="#FFFFF0" />
      </svg>
    </motion.div>
  )
}
