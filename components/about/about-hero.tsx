"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Music, Award, Users, Calendar } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { Button } from "@/components/ui/button"
import { AnimatedGradientMesh } from "@/components/ui/animated-gradient-mesh"
import { TiltCard } from "@/components/ui/tilt-card"

const stats = [
  { icon: Calendar, label: "Years Experience", value: "20+" },
  { icon: Users, label: "Events Performed", value: "500+" },
  { icon: Music, label: "Songs in Repertoire", value: "200+" },
  { icon: Award, label: "Satisfied Clients", value: "100%" },
]

export function AboutHero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background dark:bg-black">
      {/* Animated Gradient Mesh Background */}
      <AnimatedGradientMesh variant="gold" intensity="vibrant" />
      
      {/* Additional overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-transparent to-transparent z-[1]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <AnimatedElement variant="fade-up">
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold rounded-full px-5 py-2.5 text-sm font-medium mb-4 backdrop-blur-sm border border-gold/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                </span>
                About Allan
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground dark:text-white">
                Meet <span className="text-gold">Allan Palmer</span>
              </h1>
              <p className="text-xl text-muted-foreground dark:text-gray-300 leading-relaxed">
                A passionate violinist dedicated to creating unforgettable musical experiences for life's most precious
                moments.
              </p>
            </AnimatedElement>

            <AnimatedElement variant="fade-up" delay={0.2}>
              <div className="prose prose-lg max-w-none text-muted-foreground dark:text-gray-400">
                <p>
                  With over 20 years of professional experience, Allan Palmer brings exceptional artistry and technical
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
                <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-black">
                  <Link href="/contact">Book Allan</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-foreground/30 dark:border-white/30 text-foreground dark:text-white hover:bg-foreground/10 dark:hover:bg-white/10 bg-transparent">
                  <Link href="/services">View Services</Link>
                </Button>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Professional Violinist Badge - positioned above head */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm text-gold rounded-full px-4 py-2 text-sm font-medium border border-gold/30">
                  <Music className="h-4 w-4" />
                  Professional Violinist
                </div>
              </div>
            </div>

            {/* Floating Stats Card - with 3D tilt */}
            <TiltCard tiltAmount={12} glareEnabled={true} className="absolute -bottom-6 -left-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gold/20"
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-gold" />
                      </div>
                      <div className="font-bold text-lg text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TiltCard>

            {/* Additional Stats - with 3D tilt */}
            <TiltCard tiltAmount={12} glareEnabled={true} className="absolute -top-6 -right-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gold/20"
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(2, 4).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-gold" />
                      </div>
                      <div className="font-bold text-lg text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TiltCard>
          </AnimatedElement>
        </div>
      </div>
      
      {/* Decorative fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background dark:from-black to-transparent" />
    </section>
  )
}
