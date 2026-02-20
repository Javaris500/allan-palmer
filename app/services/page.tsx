import React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { PageTransition } from "@/components/page-transition"
import { Briefcase } from "lucide-react"

const ServicesComparisonChart = dynamic(
  () => import("@/components/services-comparison-chart").then(mod => ({ default: mod.ServicesComparisonChart })),
  {
    ssr: true,
    loading: () => (
      <div className="py-16 md:py-24 animate-pulse">
        <div className="container">
          <div className="h-10 bg-muted rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-12" />
          <div className="max-w-5xl mx-auto h-[600px] bg-muted rounded-2xl" />
        </div>
      </div>
    ),
  }
)

export const metadata: Metadata = {
  title: "Professional Violin Services | Allan Palmer",
  description:
    "Professional violin services for weddings, corporate events, private functions, and music lessons in Winnipeg, Manitoba. Book Allan Palmer for your special occasion.",
  keywords: [
    "wedding violinist",
    "corporate event music",
    "private function entertainment",
    "violin lessons",
    "professional musician Winnipeg",
    "classical violin performance",
  ],
  openGraph: {
    title: "Professional Violin Services | Allan Palmer",
    description:
      "Professional violin services for weddings, corporate events, private functions, and music lessons in Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/services",
  },
}

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        {/* Page Header */}
        <section className="py-12 md:py-20">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Services</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              What Allan Offers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From wedding ceremonies to private events and one-on-one violin lessons — find the perfect musical experience for your occasion.
            </p>
          </div>
        </section>

        {/* Services Comparison Chart */}
        <ServicesComparisonChart />
      </div>
    </PageTransition>
  )
}
