"use client"

import { motion } from "framer-motion"
import { AnimatedElement } from "@/components/animated-element"
import Image from "next/image"
import { Heart, Music, Lightbulb, Users } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

export function AboutPhilosophy() {
  const philosophyPoints = [
    {
      icon: Heart,
      title: "Passion First",
      description:
        "I believe that passion is the foundation of musical excellence. When you love what you play, it resonates with your audience.",
    },
    {
      icon: Music,
      title: "Technical Excellence",
      description:
        "Mastering technique allows for true artistic expression. I emphasize proper form and technique as the building blocks of beautiful music.",
    },
    {
      icon: Lightbulb,
      title: "Creative Expression",
      description:
        "Music is a language of emotion. I encourage students to find their unique voice and express themselves through their playing.",
    },
    {
      icon: Users,
      title: "Community Connection",
      description:
        "Music brings people together. Whether performing or teaching, I value the connections and community that music creates.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <AnimatedElement variant="fade-right">
            <div className="grid grid-cols-1 gap-4">
              <motion.div
                className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/teaching-certificates.jpg"
                  alt="Allan Palmer with two students celebrating their violin achievements with certificates"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              <motion.div
                className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <VideoPlayer
                  playbackId="I025pVKflyFHaw00PTUJEhQQggnkunham1LrNwJOrnj8Q"
                  title="Allan Palmer - Teaching Session"
                  description="Allan Palmer working with students in a personalized violin lesson"
                  className="h-full"
                />
              </motion.div>
            </div>
          </AnimatedElement>

          <AnimatedElement variant="fade-left">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl mb-6">My Teaching Philosophy</h2>
            <p className="text-muted-foreground mb-8">
              I believe that learning music should be both enjoyable and rewarding. My approach combines technical
              precision with creative expression, tailored to each student's unique learning style and goals.
            </p>

            <div className="space-y-6">
              {philosophyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10">
                    <point.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
