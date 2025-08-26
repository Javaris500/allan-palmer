"use client"

import { useState } from "react"
import { AnimatedElement } from "@/components/animated-element"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export function VideoGallery() {
  const [currentPage, setCurrentPage] = useState(1)
  const videosPerPage = 6

  // Updated video array with all 12 videos
  const videos = [
    {
      playbackId: "8XHHOLo2GkCfpOoPZSUCEIFE3k2aJkL7s92Qjkum00XU",
      title: "Allan Palmer - Live Violin Performance",
      description:
        "A captivating violin performance showcasing Allan's exceptional technique and musical expression at an elegant venue.",
    },
    {
      playbackId: "ek42ypjXGaMH9NLc5yAMJOm00IZlqiEn4SlRjSB0002bk4",
      title: "Allan Palmer - Classical Recital",
      description: "An elegant classical violin recital demonstrating masterful artistry and emotional depth.",
    },
    {
      playbackId: "LDw3odZmUPkOV01owwlG5KU7p5Syk23X2ZycIsRoG4KQ",
      title: "Allan Palmer - Wedding Performance",
      description: "Beautiful wedding ceremony performance creating the perfect romantic atmosphere.",
    },
    {
      playbackId: "qQKZNjMdf2bZIGgymE1HhHb005dUN8hWn00kZEkNojugw",
      title: "Allan Palmer - Solo Concert",
      description: "Stunning solo violin concert showcasing technical precision and musical interpretation.",
    },
    {
      playbackId: "Mhrzlp01EwyQ84UFyHlPpAFnRpR6O3FtbsOmYpwKvpV8",
      title: "Allan Palmer - Chamber Music",
      description: "Elegant chamber music performance demonstrating collaborative artistry and musical dialogue.",
    },
    {
      playbackId: "UvL8y013AUE3rUQ9fGGeQYmtkkbyLjOtTBOvnGWCUphY",
      title: "Allan Palmer - Outdoor Concert",
      description: "Beautiful outdoor violin performance in a natural setting with exceptional acoustics.",
    },
    {
      playbackId: "CMDtNWPBH6wyF501sNQN5WdyCXa01Hf6vuXMnvC6zeo4A",
      title: "Allan Palmer - Intimate Recital",
      description: "Intimate violin recital showcasing delicate musical expression and technical finesse.",
    },
    {
      playbackId: "p101AC02IpZ00TXImqFnAtiTWPsU4ZqVerE6yxWABxzJEQ",
      title: "Allan Palmer - Corporate Event",
      description: "Professional performance at a corporate gala, adding elegance and refinement to the evening.",
    },
    {
      playbackId: "ImhbTvedynawHayK1x6SgFflmuW00g02Vja5XJ4nDbHvk",
      title: "Allan Palmer - Evening Recital",
      description: "Sophisticated evening recital featuring beautiful violin melodies in an intimate setting.",
    },
    {
      playbackId: "og101R00uw6Nzs0101Es2xVJg86F2WNDawpU01LrL6Dp7pjQ",
      title: "Allan Palmer - Wedding Ceremony",
      description: "Elegant wedding ceremony performance creating unforgettable moments for the special day.",
    },
    {
      playbackId: "ZQMvVe46S02hgtwX98xJsc8Z4dBmU02Uiqu4RW02X01f2tk",
      title: "Allan Palmer - Private Performance",
      description: "Exclusive private violin performance showcasing personalized musical artistry.",
    },
    {
      playbackId: "1KO10154BKx01kM7QqWpcO3LWk2RzfeYQd9ctqEjSJFUI",
      title: "Allan Palmer - Concert Hall Performance",
      description: "Masterful concert hall performance demonstrating exceptional violin technique and stage presence.",
    },
  ]

  const totalPages = Math.ceil(videos.length / videosPerPage)
  const startIndex = (currentPage - 1) * videosPerPage
  const endIndex = startIndex + videosPerPage
  const currentVideos = videos.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <AnimatedElement variant="fade-up" className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Performance Gallery
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Experience Allan Palmer's artistry through these carefully curated performance videos. From intimate wedding
            ceremonies to grand concert halls, witness the passion and precision that defines professional violin
            performance.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, videos.length)} of {videos.length} performances
          </div>
        </AnimatedElement>
      </section>

      {/* Video Grid */}
      <section className="container pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {currentVideos.map((video, index) => (
            <VideoPlayer
              key={video.playbackId}
              playbackId={video.playbackId}
              delay={index * 0.1}
              thumbnailIndex={startIndex + index + 1}
              title={video.title}
              description={video.description}
              portrait={index === 0} // Make first video card portrait for demo
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <AnimatedElement variant="fade-up" className="mt-16">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </AnimatedElement>
        )}

        {/* Call to Action */}
        <AnimatedElement variant="fade-up" className="mt-20 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12 border border-primary/20 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Book Allan?</h3>
            <p className="text-muted-foreground mb-6">
              Bring this level of artistry and professionalism to your special event
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <a
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                <Play className="h-4 w-4" />
                Book Your Event
              </a>
            </motion.div>
          </div>
        </AnimatedElement>
      </section>
    </div>
  )
}
