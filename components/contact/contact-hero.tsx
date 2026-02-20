"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MessageSquare, Clock, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CONTACT_INFO } from "@/lib/constants"
import Image from "next/image"

export function ContactHero() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background dark:bg-black">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold rounded-full px-4 py-2 text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4" />
              <span>Let's Connect</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Get In Touch With <span className="text-gold">Allan</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Ready to discuss your event or explore violin lessons? Reach out today and let's create something magical together.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white dark:bg-black border-2 border-gold/20 rounded-lg hover:border-gold/40 transition-all">
                <div className="text-2xl font-bold text-gold mb-1">500+</div>
                <div className="text-xs text-muted-foreground">Events Performed</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-black border-2 border-gold/20 rounded-lg hover:border-gold/40 transition-all">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-gold fill-gold" />
                  <span className="text-2xl font-bold text-gold">5.0</span>
                </div>
                <div className="text-xs text-muted-foreground">Google Rating</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-black border-2 border-gold/20 rounded-lg hover:border-gold/40 transition-all">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-2xl font-bold text-gold">&lt;24h</span>
                </div>
                <div className="text-xs text-muted-foreground">Response Time</div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black">
                <a href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gold/30 hover:border-gold bg-transparent">
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Email
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Image with availability */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold/20 shadow-2xl shadow-gold/10">
              <Image
                src="/images/allan-portrait-bw.jpeg"
                alt="Allan Palmer - Contact"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Availability badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-xl p-4 border-2 border-gold/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gold" />
                    </div>
                    <span className="font-semibold text-sm">Available for bookings</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently accepting inquiries for 2025-2026 events
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
