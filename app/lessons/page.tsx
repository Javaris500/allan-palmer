import type { Metadata } from "next"
import Link from "next/link"
import { Music, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Violin Lessons | Allan Palmer",
  description:
    "Private violin lessons with Allan Palmer — coming soon to Winnipeg, Manitoba. Stay tuned for lesson packages, scheduling, and more.",
  openGraph: {
    title: "Violin Lessons | Allan Palmer",
    description:
      "Private violin lessons with Allan Palmer — coming soon to Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/lessons",
  },
}

export default function LessonsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
        <Music className="h-10 w-10 text-gold" />
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
        Lessons Coming Soon
      </h1>

      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        Allan is preparing a curated lesson experience for violinists of all
        levels. Private, group, and online sessions are on the way.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gold/90 transition-colors active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-muted text-foreground font-medium px-6 py-2.5 rounded-full text-sm hover:bg-muted/80 transition-colors active:scale-[0.98]"
        >
          Contact Allan
        </Link>
      </div>
    </div>
  )
}
