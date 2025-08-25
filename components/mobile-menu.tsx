"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface MobileMenuProps {
  isOpen: boolean
  navItems: NavItem[]
  onLinkClick: () => void
}

export function MobileMenu({ isOpen, navItems, onLinkClick }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onLinkClick} />

      {/* Menu content */}
      <div className="fixed top-14 sm:top-16 left-0 right-0 border-b border-border bg-background shadow-lg">
        <div className="container py-4 px-4 sm:px-6">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-3 text-base font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                  onClick={onLinkClick}
                >
                  <div className="flex h-5 w-5 items-center justify-center mr-3">
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.label}
                  {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                </Link>
              )
            })}
            <div className="pt-2">
              <Button
                asChild
                className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3"
              >
                <Link href="/services" onClick={onLinkClick}>
                  <div className="flex h-4 w-4 items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  Book Now
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
