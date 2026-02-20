"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutMedia() {
  return (
    <section className="py-16 bg-background dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Media & Interviews</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Allan's insights on music education, performance, and his journey as a professional violinist
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card dark:bg-white/[0.03] rounded-lg shadow-lg overflow-hidden dark:border dark:border-gold/10">
            <div className="aspect-video bg-black relative">
              <iframe
                src="https://www.youtube.com/embed/OmtV745R3fw"
                title="Allan Palmer Podcast Interview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Podcast Interview with Allan Palmer</h3>
                  <p className="text-muted-foreground mb-4">
                    Join Allan as he discusses his musical journey, teaching philosophy, and insights into the world of
                    professional violin performance and music education.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="shrink-0 bg-transparent dark:border-gold/30 dark:text-gold dark:hover:bg-gold/10">
                  <a
                    href="https://youtu.be/OmtV745R3fw?si=_59sexEQ5lv-I5Im"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
