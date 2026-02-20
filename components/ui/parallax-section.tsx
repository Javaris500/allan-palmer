"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const multiplier = direction === "up" ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxLayersProps {
  children: React.ReactNode
  className?: string
}

export function ParallaxLayers({ children, className = "" }: ParallaxLayersProps) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      {children}
    </div>
  )
}

interface ParallaxLayerProps {
  children: React.ReactNode
  depth?: number
  className?: string
}

export function ParallaxLayer({ children, depth = 0, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50 * depth, -50 * depth])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - depth * 0.05, 1, 1 + depth * 0.05])

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
