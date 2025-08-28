"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/ui/lightbox"
import Image from "next/image"

const photos = [
  {
    id: 1,
    src: "/images/gallery/wedding-couple-dance.png",
    alt: "Allan Palmer performing at a wedding while couple dances",
    title: "Wedding First Dance",
    description: "Creating magical moments with violin music for a couple's first dance.",
  },
  {
    id: 2,
    src: "/images/gallery/performer-closeup.png",
    alt: "Close up of Allan Palmer performing on violin",
    title: "Professional Performance",
    description: "Elegant violin performance showcasing technical skill and artistry.",
  },
  {
    id: 3,
    src: "/images/gallery/wedding-ceremony-elegant.png",
    alt: "Allan Palmer performing at elegant wedding ceremony",
    title: "Elegant Wedding Ceremony",
    description: "Creating magical moments at an upscale wedding with beautiful floral arrangements.",
  },
  {
    id: 4,
    src: "/images/gallery/wedding-couple-photo.jpeg",
    alt: "Allan Palmer with bride and groom after wedding ceremony",
    title: "Wedding Celebration",
    description: "Celebrating with the happy couple after providing beautiful ceremony music.",
  },
  {
    id: 5,
    src: "/images/gallery/outdoor-ceremony-pavilion.png",
    alt: "Allan Palmer performing at outdoor wedding ceremony with pavilion",
    title: "Outdoor Ceremony Performance",
    description: "Performing for a large outdoor wedding ceremony in a picturesque pavilion setting.",
  },
  {
    id: 6,
    src: "/images/gallery/performance-1.jpeg",
    alt: "Allan Palmer Concert Performance",
    title: "Concert Performance",
    description: "Professional concert setting showcasing Allan's stage presence and violin mastery.",
  },
  {
    id: 7,
    src: "/images/gallery/performance-2.jpeg",
    alt: "Allan Palmer Sacred Music Performance",
    title: "Sacred Music Performance",
    description: "Beautiful church setting performance with ornate architectural backdrop.",
  },
  {
    id: 7,
    src: "/images/gallery/performance-3.jpeg",
    alt: "Allan Palmer Cathedral Concert",
    title: "Cathedral Concert",
    description: "Stunning Gothic cathedral performance demonstrating versatility in sacred spaces.",
  },
  {
    id: 8,
    src: "/images/about/IMG_9343.png",
    alt: "Allan Palmer Music Education",
    title: "Music Education",
    description: "Allan sharing his passion for violin through teaching and mentorship.",
  },
  {
    id: 9,
    src: "/images/gallery/IMG_9711.png",
    alt: "Allan Palmer performing in modern architectural setting",
    title: "Contemporary Venue Performance",
    description: "Professional performance in a sleek, modern architectural environment.",
  },
  {
    id: 10,
    src: "/images/gallery/IMG_9716.jpeg",
    alt: "Allan Palmer performing for intimate fire pit gathering",
    title: "Intimate Backyard Performance",
    description: "Creating a warm, personal atmosphere for a small gathering around the fire pit.",
  },
  {
    id: 11,
    src: "/images/gallery/IMG_9714.png",
    alt: "Allan Palmer performing at modern venue entrance",
    title: "Modern Venue Performance",
    description: "Elegant performance at a contemporary event space with striking architectural features.",
  },
  {
    id: 12,
    src: "/images/gallery/IMG_9345.jpeg",
    alt: "Allan Palmer performance moment",
    title: "Performance Moment",
    description: "Capturing the artistry and emotion of live violin performance.",
  },
  {
    id: 13,
    src: "/images/gallery/IMG_9338.png",
    alt: "Allan Palmer in performance setting",
    title: "Professional Performance",
    description: "Showcasing technical skill and musical expression in a professional setting.",
  },
  {
    id: 14,
    src: "/images/gallery/IMG_9342.png",
    alt: "Allan Palmer violin performance",
    title: "Musical Excellence",
    description: "Demonstrating the passion and precision that defines Allan's performances.",
  },
  {
    id: 15,
    src: "/images/gallery/formal-restaurant-performance.jpg",
    alt: "Allan Palmer performing in formal attire at upscale restaurant venue",
    title: "Elegant Dining Performance",
    description: "Black and white capture of a sophisticated performance in formal bow tie attire.",
  },
  {
    id: 16,
    src: "/images/gallery/wedding-reception-performance.jpg",
    alt: "Allan Palmer performing at wedding reception with guests",
    title: "Wedding Reception Entertainment",
    description: "Bringing joy and elegance to wedding celebrations with live violin music.",
  },
  {
    id: 17,
    src: "/images/gallery/stage-performance-lighting.png",
    alt: "Allan Palmer stage performance with dramatic green lighting",
    title: "Concert Stage Performance",
    description: "Dynamic stage performance showcasing Allan's versatility in concert settings.",
  },
  {
    id: 18,
    src: "/images/gallery/professional-navy-suit.jpg",
    alt: "Allan Palmer professional portrait in navy suit",
    title: "Professional Portrait",
    description: "Elegant professional performance in navy suit at modern venue.",
  },
  {
    id: 19,
    src: "/images/gallery/indian-wedding-ceremony.png",
    alt: "Allan Palmer performing at Indian wedding ceremony with bride and groom",
    title: "Indian Wedding Ceremony",
    description: "Elegant performance at a traditional Indian wedding with ornate decorations and crystal chandeliers.",
  },
  {
    id: 20,
    src: "/images/gallery/outdoor-garden-wedding.png",
    alt: "Allan Palmer with couple at outdoor garden wedding ceremony",
    title: "Garden Wedding Celebration",
    description: "Beautiful outdoor garden wedding with blue drapery and natural stone setting.",
  },
  {
    id: 21,
    src: "/images/gallery/countryside-wedding.png",
    alt: "Allan Palmer with couple in scenic countryside wedding setting",
    title: "Countryside Wedding",
    description: "Picturesque countryside wedding with rolling green hills and natural beauty.",
  },
  {
    id: 22,
    src: "/images/gallery/wedding-ceremony-performance.png",
    alt: "Allan Palmer performing during outdoor wedding ceremony for seated guests",
    title: "Live Wedding Performance",
    description: "Performing live violin music during an outdoor wedding ceremony for guests.",
  },
  {
    id: 23,
    src: "/images/gallery/outdoor-park-wedding.png",
    alt: "Allan Palmer with couple at outdoor park wedding",
    title: "Park Wedding Celebration",
    description: "Elegant outdoor park wedding celebration with professional violin accompaniment.",
  },
]

export function PhotoGalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (!isPlaying || lightboxIndex !== null) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, lightboxIndex, nextSlide])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsPlaying(false)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    setIsPlaying(true)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Performance Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capturing moments of musical excellence across weddings, ceremonies, and special events
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main carousel */}
          <div
            className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted group cursor-pointer shadow-2xl"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            onClick={() => openLightbox(currentIndex)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={photos[currentIndex]?.src || "/placeholder.svg"}
                  alt={photos[currentIndex]?.alt || "Gallery image"}
                  fill
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    currentIndex === 7 ? "object-contain" : "object-cover"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                prevSlide()
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                nextSlide()
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Control buttons */}
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox(currentIndex)
                }}
              >
                <Expand className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <motion.div
                className="h-full bg-white/80"
                initial={{ width: "0%" }}
                animate={{ width: isPlaying && lightboxIndex === null ? "100%" : "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                key={`${currentIndex}-${isPlaying}`}
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => goToSlide(index)}
                onDoubleClick={() => openLightbox(index)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className={`transition-transform duration-300 ${index === 7 ? "object-contain" : "object-cover"}`}
                  sizes="80px"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
              </button>
            ))}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Gallery info */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {photos.length} • {isPlaying ? "Auto-advancing" : "Paused"} • Click to view full
              size
            </p>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            images={photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={setLightboxIndex}
          />
        )}
      </div>
    </section>
  )
}
