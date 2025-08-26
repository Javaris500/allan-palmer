"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export interface AnimatedButtonProps extends ButtonProps {
  hoverScale?: number
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, hoverScale = 1.05, ...props }, ref) => {
    return (
      <Button className={cn("overflow-hidden", className)} ref={ref} {...props}>
        <motion.div
          className="flex w-full items-center justify-center"
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Button>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
