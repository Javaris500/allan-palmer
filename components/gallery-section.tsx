"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatedElement } from "@/components/animated-element"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"
import Link from "next/link"

const galleryImages = [
  {
    src: "/images/gallery/IMG_9345.jpeg",
    alt: "Allan Palmer performing at wedding ceremony",
    title: "Wedding Performance",
  },
  {
    src: "/images/gallery/IMG_9338.png",
    alt: "Allan Palmer in concert setting",
    title: "Concert Performance",
    objectFit: "object-contain" as const,
  },
  {
    src: "/images/gallery/IMG_9342.png",
    alt: "Allan Palmer outdoor performance",
    title: "Outdoor Event",
  },
  {
    src: "/images/performance/img-8605.jpeg",
    alt: "Allan Palmer professional portrait",
    title: "Professional Portrait",
  },
]

export function GallerySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <AnimatedElement variant="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            Performance Gallery
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Professional Performances
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Experience the artistry and elegance of Allan Palmer's violin performances across various venues and events
          </p>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <AnimatedElement
              key={index}
              variant="fade-up"
              delay={index * 0.1}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
            >
              <div
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="w-full h-full"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className={`transition-all duration-500 group-hover:scale-110 ${image.objectFit || "object-cover"}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </AnimatedElement>
          ))}
        </div>

        <AnimatedElement variant="fade-up" className="text-center">
          <Button size="lg" asChild className="group">
            <Link href="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </AnimatedElement>
      </div>
    </section>
  )
}
