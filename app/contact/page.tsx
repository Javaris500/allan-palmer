import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { PageTransition } from "@/components/page-transition"

const ContactFormSection = dynamic(
  () => import("@/components/contact/contact-form-section").then(mod => ({ default: mod.ContactFormSection })),
  { ssr: true }
)
const ContactInfo = dynamic(
  () => import("@/components/contact/contact-info").then(mod => ({ default: mod.ContactInfo })),
  { ssr: true }
)

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
      {/* Bento Grid Contact Form & Info */}
      <section className="py-16 md:py-24 bg-background dark:bg-black">
        <div className="container">
          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Contact Info — shown first on mobile for quick access */}
            <div className="lg:col-span-2 lg:order-2 space-y-6">
              <ContactInfo />
            </div>

            {/* Contact Form — takes 3 columns on desktop */}
            <div className="lg:col-span-3 lg:order-1">
              <ContactFormSection />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
