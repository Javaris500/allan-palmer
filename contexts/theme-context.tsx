"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  systemTheme: "light" | "dark"
  toggleTheme: () => void
}

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
  systemTheme: "light",
  toggleTheme: () => null,
}

const ThemeContext = createContext<ThemeContextType>(initialState)

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    try {
      // Get system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const prefersDark = mediaQuery.matches
      setSystemTheme(prefersDark ? "dark" : "light")

      // Get stored theme
      const storedTheme = localStorage.getItem(storageKey) as Theme | null

      // Set initial theme
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        setTheme(storedTheme)
      } else {
        setTheme("system")
      }

      // Listen for system theme changes
      const handleChange = () => {
        setSystemTheme(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } catch (error) {
      // Fallback for any errors
      console.warn("Theme initialization failed:", error)
      setTheme("light")
      setSystemTheme("light")
    }
  }, [storageKey])

  // Update resolvedTheme when theme or systemTheme changes
  useEffect(() => {
    if (theme === "system") {
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme)
    }
  }, [theme, systemTheme])

  // Apply theme to document
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const root = document.documentElement

    if (resolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [resolvedTheme, mounted])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (error) {
        console.warn("Failed to save theme preference:", error)
      }
    }
  }

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, newTheme)
        } catch (error) {
          console.warn("Failed to save theme preference:", error)
        }
      }
    },
    resolvedTheme,
    systemTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
