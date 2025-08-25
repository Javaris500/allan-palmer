"use client"

import type React from "react"
import { useRef, memo } from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { useInView } from "react-intersection-observer"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface AnimatedElementProps {
  children: React.ReactNode
  variant: "fade-up" | "fade-left" | "fade-right" | "fade-down" | "fade-in" | "slide-in-left" | "slide-in-right"
  duration?: number
  delay?: number
  className?: string
}

const variants: { [key: string]: Variants } = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-in-left": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-in-right": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
}

export const AnimatedElement = memo<AnimatedElementProps>(function AnimatedElement({
  children,
  variant,
  duration = 0.6,
  delay = 0,
  className,
}) {
  const ref = useRef(null)
  const { ref: inViewRef, inView: isVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "50px",
  })

  const combinedRef = (el: any) => {
    ref.current = el
    inViewRef(el)
  }

  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={combinedRef}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate={isVisible || prefersReducedMotion ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
})
