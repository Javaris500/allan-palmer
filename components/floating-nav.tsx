"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Music, Film, Calendar, ClipboardList, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackgroundMusicToggle } from "@/components/background-music-toggle"
import { cn } from "@/lib/utils"
import { NAVIGATION_ITEMS } from "@/lib/constants"

const navIcons: Record<string, React.ElementType> = {
  "/": Home,
  "/about": User,
  "/repertoire": Music,
  "/gallery": Film,
  "/booking": Calendar,
  "/services": Calendar,
  "/my-bookings": ClipboardList,
}

const navItems: { href: string; label: string; icon: React.ElementType; highlight?: boolean }[] = [
  ...NAVIGATION_ITEMS.map(item => ({
    href: item.href as string,
    label: item.label as string,
    icon: navIcons[item.href] || Home,
  })),
  { href: "/my-bookings", label: "My Bookings", icon: ClipboardList },
  { href: "/services", label: "Services", icon: Calendar, highlight: true },
]

export function FloatingNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const isHomepage = pathname === "/"
      setIsVisible(isHomepage ? scrolled > 100 : true)
      setShowScrollTop(scrolled > 500)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsOpen(false)
  }

  if (pathname?.startsWith("/booking")) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isVisible || isOpen) && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="flex flex-col gap-2 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <nav className="flex flex-col gap-1">
                      {navItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + index * 0.03 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                                "hover:bg-muted/80",
                                isActive && "bg-muted text-primary font-medium",
                                item.highlight && !isActive && "text-gold hover:bg-gold/10"
                              )}
                            >
                              <Icon className={cn("h-4 w-4", item.highlight && "text-gold")} />
                              <span className="text-sm">{item.label}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="nav-indicator"
                                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                                />
                              )}
                            </Link>
                          </motion.div>
                        )
                      })}
                    </nav>

                    <div className="h-px bg-border my-2" />

                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-1">
                        <BackgroundMusicToggle />
                        <ThemeToggle variant="icon" />
                      </div>

                      {showScrollTop && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={scrollToTop}
                          className="text-xs gap-1.5 h-8"
                        >
                          <ArrowUp className="h-3 w-3" />
                          Top
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    className="flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-border rounded-full px-2 py-1.5 shadow-md"
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BackgroundMusicToggle />
                    <ThemeToggle variant="icon" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setIsOpen(!isOpen)}
                  size="icon"
                  className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
                    isOpen
                      ? "bg-muted hover:bg-muted/80 text-foreground"
                      : "bg-gold hover:bg-gold/90 text-black"
                  )}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                >
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
