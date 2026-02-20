"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "blur"
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
  stagger?: boolean
  staggerDelay?: number
}

export function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  const variants = {
    "fade-up": {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    "fade-down": {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    "fade-left": {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    "fade-right": {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    "zoom": {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    "blur": {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for multiple items
interface ScrollRevealContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  amount?: number
}

export function ScrollRevealContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
  amount = 0.2,
}: ScrollRevealContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Item for use inside ScrollRevealContainer
interface ScrollRevealItemProps {
  children: React.ReactNode
  className?: string
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "blur"
}

const easeOut = [0.25, 0.46, 0.45, 0.94] as const

export function ScrollRevealItem({
  children,
  className = "",
  variant = "fade-up",
}: ScrollRevealItemProps) {
  const variants = {
    "fade-up": {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
    },
    "fade-down": {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
    },
    "fade-left": {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
    },
    "fade-right": {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
    },
    "zoom": {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
    },
    "blur": {
      hidden: { opacity: 0, filter: "blur(8px)" },
      visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: easeOut } },
    },
  }

  return (
    <motion.div variants={variants[variant]} className={className}>
      {children}
    </motion.div>
  )
}
