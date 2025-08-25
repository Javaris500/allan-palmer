import type { Metadata } from "next"
import { PageTransition } from "@/components/page-transition"
import { ServicesSection } from "@/components/services-section"
import { SimpleContactSection } from "@/components/simple-contact-section"
import { TestimonialsSection } from "@/components/testimonials-section"

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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/30 to-background">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Professional Violin Services
              </h1>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Elevate your special moments with elegant violin performances. From intimate ceremonies to grand
                celebrations, Allan brings artistry and professionalism to every event.
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <ServicesSection />

        {/* Contact Section */}
        <SimpleContactSection />

        {/* Testimonials */}
        <TestimonialsSection />
      </div>
    </PageTransition>
  )
}
