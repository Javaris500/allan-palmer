"use client"

import { SITE_CONFIG } from "@/lib/constants"
import { Music } from "lucide-react"

export function SimpleFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background py-8" role="contentinfo">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Music className="h-4 w-4 text-primary" />
            <span className="font-medium">{SITE_CONFIG.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
