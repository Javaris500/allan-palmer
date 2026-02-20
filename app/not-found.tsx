"use client"

import Link from "next/link"
import { Music } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
        <Music className="h-10 w-10 text-gold" />
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
        Page Not Found
      </h1>

      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        Looks like this page hit the wrong note. Let&rsquo;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gold/90 transition-colors active:scale-[0.98]"
        >
          Back to Home
        </Link>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-muted text-foreground font-medium px-6 py-2.5 rounded-full text-sm hover:bg-muted/80 transition-colors active:scale-[0.98]"
        >
          Book Allan
        </Link>
      </div>
    </div>
  )
}
