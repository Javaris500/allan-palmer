import type { Metadata } from "next"
import { PageTransition } from "@/components/page-transition"
import { ContactInfo } from "@/components/contact/contact-info"

export const metadata: Metadata = {
  title: "Contact Allan Palmer | Professional Violinist",
  description:
    "Get in touch with Allan Palmer for wedding music, corporate events, private functions, and violin lessons in Winnipeg, Manitoba. Professional and reliable service.",
  keywords: [
    "contact violinist",
    "book wedding musician",
    "violin lessons contact",
    "Winnipeg violinist",
    "professional musician contact",
  ],
  openGraph: {
    title: "Contact Allan Palmer | Professional Violinist",
    description:
      "Get in touch with Allan Palmer for wedding music, corporate events, private functions, and violin lessons in Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/30 to-background">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Contact Allan
              </h1>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Ready to discuss your musical needs? Get in touch to book Allan for your special event or inquire about
                violin lessons.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <ContactInfo />
      </div>
    </PageTransition>
  )
}
