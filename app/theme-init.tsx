"use client"

import { useEffect } from "react"

export function ThemeInit() {
  useEffect(() => {
    try {
      // Get theme from localStorage or use system preference
      const savedTheme = localStorage.getItem("theme")
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      // Apply theme
      if (savedTheme === "dark" || (!savedTheme && systemDark)) {
        document.documentElement.classList.add("dark")
      } else if (savedTheme === "light" || (!savedTheme && !systemDark)) {
        document.documentElement.classList.remove("dark")
      }
    } catch (error) {
      console.warn("Theme initialization failed:", error)
      // Fallback to light theme
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return null
}
