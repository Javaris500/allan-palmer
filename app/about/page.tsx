import type { Metadata } from "next"
import { PageTransition } from "@/components/page-transition"
import { AboutHero } from "@/components/about/about-hero"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutPhilosophy } from "@/components/about/about-philosophy"
import { AboutMedia } from "@/components/about/about-media"

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
}

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutHero />
      <AboutTimeline />
      <AboutPhilosophy />
      <AboutMedia />
    </PageTransition>
  )
}
