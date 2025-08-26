"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { AnimatedElement } from "@/components/animated-element"

export function AboutBio() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <AnimatedElement variant="fade-right" delay={0.2}>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/about/IMG_9343.png"
                alt="Allan Palmer teaching a young student violin"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </AnimatedElement>

          {/* Content Section */}
          <AnimatedElement variant="fade-left" delay={0.4}>
            <div className="space-y-6">
              <motion.h2
                className="font-serif text-3xl font-bold tracking-tight sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                About Allan Palmer
              </motion.h2>

              <motion.div
                className="space-y-4 text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <p>
                  Allan Palmer is a passionate violinist and educator based in Winnipeg, Manitoba. With over a decade of
                  experience performing at weddings, corporate events, and private functions, Allan brings elegance and
                  sophistication to every occasion.
                </p>

                <p>
                  His musical journey began at a young age, and he has since developed a diverse repertoire spanning
                  classical masterworks, contemporary favorites, and popular music. Allan's ability to adapt his
                  performance style to match the atmosphere of any event has made him one of Winnipeg's most
                  sought-after violinists.
                </p>

                <p>
                  Beyond performing, Allan is dedicated to sharing his love of music through teaching. He operates Palms
                  Music Studio, where he nurtures the next generation of musicians with patience, expertise, and genuine
                  care for each student's musical development.
                </p>

                <p>
                  Whether you're planning an intimate wedding ceremony, a corporate gala, or seeking violin lessons,
                  Allan Palmer delivers exceptional musical experiences that create lasting memories.
                </p>
              </motion.div>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
