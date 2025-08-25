"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Music, Award, Users, Calendar } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { AnimatedButton } from "@/components/ui/animated-button"

const stats = [
  { icon: Calendar, label: "Years Experience", value: "15+" },
  { icon: Users, label: "Events Performed", value: "500+" },
  { icon: Music, label: "Songs in Repertoire", value: "200+" },
  { icon: Award, label: "Satisfied Clients", value: "100%" },
]

export function AboutHero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <AnimatedElement variant="fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Music className="h-4 w-4" />
                Professional Violinist
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Meet Allan Palmer
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A passionate violinist dedicated to creating unforgettable musical experiences for life's most precious
                moments.
              </p>
            </AnimatedElement>

            <AnimatedElement variant="fade-up" delay={0.2}>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  With over 15 years of professional experience, Allan Palmer brings exceptional artistry and technical
                  mastery to every performance. From intimate wedding ceremonies to grand concert halls, Allan's
                  versatile repertoire and passionate delivery create magical moments that resonate long after the last
                  note.
                </p>
                <p>
                  Allan's journey began at an early age, studying classical violin technique while developing a deep
                  appreciation for diverse musical styles. This foundation has enabled him to seamlessly blend
                  traditional classical pieces with contemporary favorites, ensuring each performance is perfectly
                  tailored to the occasion.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement variant="fade-up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton
                  href="/contact"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  Book Allan
                </AnimatedButton>
                <AnimatedButton href="/services" variant="outline" className="px-8 py-3">
                  View Services
                </AnimatedButton>
              </div>
            </AnimatedElement>
          </div>

          {/* Image */}
          <AnimatedElement variant="fade-left" delay={0.3} className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="/images/allan-portrait-bw.jpeg"
                alt="Allan Palmer - Professional Violinist"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-6 -right-6 bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(2, 4).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
