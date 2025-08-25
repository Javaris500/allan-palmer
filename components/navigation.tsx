"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Music, Menu, X, Home, User, Calendar, MessageSquare, Film } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BackgroundMusicToggle } from "@/components/background-music-toggle"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { MobileMenu } from "@/components/mobile-menu"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/repertoire", label: "Repertoire", icon: Music },
    { href: "/contact", label: "Contact", icon: MessageSquare },
    { href: "/gallery", label: "Gallery", icon: Film },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  // Simple function to close the menu
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center">
                <Music className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-lg sm:text-xl font-semibold">Allan Palmer</span>
            </Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.div key={item.href} variants={item}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative",
                      isActive && "text-primary font-semibold",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </motion.nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <BackgroundMusicToggle />
            <ThemeToggle variant="icon" />

            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AnimatedButton asChild hoverScale={1.05} size="sm" className="text-sm px-3 sm:px-4">
                <Link href="/services" className="flex items-center gap-2">
                  <div className="flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline">Book Now</span>
                  <span className="sm:hidden">Book</span>
                </Link>
              </AnimatedButton>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} navItems={navItems} onLinkClick={closeMenu} />
    </>
  )
}
