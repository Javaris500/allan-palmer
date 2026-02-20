"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "framer-motion"

interface MouseFollowerProps {
  enabled?: boolean
  size?: number
  color?: string
}

export function MouseFollower({
  enabled = true,
  size = 20,
  color = "#B8860B",
}: MouseFollowerProps) {
  const [mounted, setMounted] = useState(false)
  
  const cursorX = useSpring(0, { stiffness: 500, damping: 50 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 50 })

  const trailX = useSpring(0, { stiffness: 200, damping: 40 })
  const trailY = useSpring(0, { stiffness: 200, damping: 40 })

  useEffect(() => {
    setMounted(true)
    
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [enabled, cursorX, cursorY, trailX, trailY])

  if (!mounted || !enabled) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      </motion.div>

      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div
          className="rounded-full border-2"
          style={{
            width: size * 2,
            height: size * 2,
            borderColor: color,
            opacity: 0.5,
          }}
        />
      </motion.div>
    </>
  )
}
