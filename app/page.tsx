import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section-v2"
import { Suspense } from "react"

// Dynamic imports for below-the-fold content - reduces initial JS bundle
const SplitScreenTestimonials = dynamic(
  () => import("@/components/split-screen-testimonials").then(mod => ({ default: mod.SplitScreenTestimonials })),
  { ssr: true }
)

const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })),
  { ssr: true }
)

const SongsShowcase = dynamic(
  () => import("@/components/songs-showcase").then(mod => ({ default: mod.SongsShowcase })),
  { ssr: true }
)

export const metadata: Metadata = {
  title: "Professional Violinist for Weddings & Events in Winnipeg",
  description:
    "Allan Palmer is a professional violinist in Winnipeg, Manitoba, specializing in weddings, corporate events, and private functions. Book elegant violin music for your special occasion or inquire about violin lessons.",
  keywords: [
    "wedding violinist Winnipeg",
    "corporate event music Manitoba",
    "professional violinist",
    "violin lessons Winnipeg",
    "live wedding music",
    "violinist for events",
    "event entertainment",
  ],
  openGraph: {
    title: "Allan Palmer | Professional Violinist for Weddings & Events",
    description:
      "Professional violinist specializing in weddings, corporate events, and private functions in Winnipeg, Manitoba.",
    type: "website",
    locale: "en_CA",
  },
  alternates: {
    canonical: "/",
  },
}

function SectionLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero Section with Portrait Video */}
      <HeroSection />

      {/* Split-Screen Testimonials */}
      <Suspense fallback={<SectionLoading />}>
        <SplitScreenTestimonials />
      </Suspense>

      {/* Client Reviews Carousel */}
      <Suspense fallback={<SectionLoading />}>
        <TestimonialsSection />
      </Suspense>

      {/* Songs Showcase */}
      <Suspense fallback={<SectionLoading />}>
        <SongsShowcase />
      </Suspense>
    </>
  )
}
