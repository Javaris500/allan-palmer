"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

interface Scene3DProps {
  children: React.ReactNode
  className?: string
  perspective?: number
  depth?: number
}

export function Scene3D({
  children,
  className = "",
  perspective = 1000,
  depth = 50,
}: Scene3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 100, damping: 30 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)
  const z = useSpring(useTransform(mouseX, [-0.5, 0, 0.5], [-depth/2, 0, -depth/2]), springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div 
      ref={ref}
      style={{ perspective: `${perspective}px` }} 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          z,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Individual 3D layer component
interface Layer3DProps {
  children: React.ReactNode
  depth?: number
  className?: string
}

export function Layer3D({ children, depth = 0, className = "" }: Layer3DProps) {
  return (
    <motion.div
      style={{ transform: `translateZ(${depth}px)` }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
