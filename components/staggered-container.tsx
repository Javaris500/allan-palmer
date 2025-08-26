"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface StaggeredContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initial?: number
  threshold?: number
}

export function StaggeredContainer({
  children,
  className,
  staggerDelay = 0.1,
  initial = 0.1,
  threshold = 0.1,
}: StaggeredContainerProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  })

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initial,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredItemProps {
  children: React.ReactNode
  className?: string
  variant?: "fade" | "slide-up" | "slide-right" | "slide-left"
}

export function StaggeredItem({ children, className, variant = "slide-up" }: StaggeredItemProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
  }

  return (
    <motion.div variants={variants[variant]} className={cn(className)}>
      {children}
    </motion.div>
  )
}
