import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import { AboutHero } from "@/components/about/about-hero"

// Lazy load below-fold sections
const AboutTimeline = dynamic(
  () => import("@/components/about/about-timeline").then(mod => ({ default: mod.AboutTimeline })),
  { ssr: true }
)
const AboutPhilosophy = dynamic(
  () => import("@/components/about/about-philosophy").then(mod => ({ default: mod.AboutPhilosophy })),
  { ssr: true }
)
const AboutMedia = dynamic(
  () => import("@/components/about/about-media").then(mod => ({ default: mod.AboutMedia })),
  { ssr: true }
)

export const metadata: Metadata = {
  title: "About Allan Palmer - Professional Violinist & Music Educator",
  description:
    "Learn about Allan Palmer's musical journey from a 6-year-old beginner to a professional violinist, educator, and performer. Discover his background, training, and passion for music.",
  keywords: [
    "Allan Palmer biography",
    "professional violinist Winnipeg",
    "violin teacher Manitoba",
    "Suzuki method instructor",
    "University of Manitoba music",
    "Palms Music Studio",
    "Sistema teaching artist",
  ],
  openGraph: {
    title: "About Allan Palmer - Professional Violinist & Music Educator",
    description:
      "Discover Allan Palmer's musical journey from childhood to professional violinist and dedicated music educator in Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
  },
}

function SectionSkeleton() {
  return (
    <div className="py-16 animate-pulse">
      <div className="container">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-8" />
        <div className="h-48 bg-muted rounded" />
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutHero />
      <Suspense fallback={<SectionSkeleton />}>
        <AboutTimeline />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <AboutPhilosophy />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <AboutMedia />
      </Suspense>
    </PageTransition>
  )
}
