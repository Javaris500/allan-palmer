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
    src: "/images/gallery/IMG_9924.jpeg",
    alt: "Allan Palmer performing at elegant wedding ceremony",
    title: "Elegant Wedding Ceremony",
    description: "Creating magical moments at an upscale wedding with beautiful floral arrangements.",
  },
  {
    id: 2,
    src: "/images/gallery/IMG_9923.jpeg",
    alt: "Allan Palmer with bride and groom after wedding ceremony",
    title: "Wedding Celebration",
    description: "Celebrating with the happy couple after providing beautiful ceremony music.",
  },
  {
    id: 3,
    src: "/images/gallery/outdoor-ceremony-pavilion.png",
    alt: "Allan Palmer performing at outdoor wedding ceremony with pavilion",
    title: "Outdoor Ceremony Performance",
    description: "Performing for a large outdoor wedding ceremony in a picturesque pavilion setting.",
  },
  {
    id: 4,
    src: "/images/gallery/performance-1.jpeg",
    alt: "Allan Palmer Concert Performance",
    title: "Concert Performance",
    description: "Professional concert setting showcasing Allan's stage presence and violin mastery.",
  },
  {
    id: 5,
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
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")

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
    if (!isPlaying || lightboxIndex !== null || viewMode === "grid") return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, lightboxIndex, nextSlide, viewMode])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsPlaying(false)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    setIsPlaying(true)
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle */}
          <div className="flex justify-end mb-6 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("carousel")}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Carousel
            </Button>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {photos.map((photo, index) => {
              // Create visual interest with varying sizes
              const isLarge = index === 0 || index === 5 || index === 12
              const isTall = index === 3 || index === 8 || index === 15
              
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl bg-muted ${
                    isLarge ? "col-span-2 row-span-2" : ""
                  } ${isTall ? "row-span-2" : ""}`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={`relative ${isLarge ? "aspect-square" : isTall ? "aspect-[3/4]" : "aspect-square"}`}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-medium text-sm md:text-base line-clamp-1">{photo.title}</h4>
                        <p className="text-white/70 text-xs md:text-sm line-clamp-1 mt-1">{photo.description}</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-gold/90 rounded-full p-2">
                          <Expand className="h-4 w-4 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Gallery info */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {photos.length} photos • Click any image to view full size
            </p>
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

  // Carousel View (Default)
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-2 hover:border-gold hover:text-gold"
          >
            View All Photos
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Layout: Featured + Thumbnails */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
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
                  unoptimized={currentIndex === 0 || currentIndex === 1} 
                  className={`transition-transform duration-500 group-hover:scale-105 ${
                    currentIndex === 5 ? "object-contain" : "object-cover"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={currentIndex === 0 || currentIndex === 1}
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-lg">{photos[currentIndex]?.title}</h3>
              <p className="text-white/70 text-sm mt-1 line-clamp-1">{photos[currentIndex]?.description}</p>
            </div>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-gold text-white hover:text-black transition-all duration-300 backdrop-blur-sm"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-gold text-white hover:text-black transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                nextSlide()
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Expand button */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 hover:bg-gold text-white hover:text-black backdrop-blur-sm transition-all duration-300"
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
                className="h-full bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: isPlaying && lightboxIndex === null ? "100%" : "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                key={`${currentIndex}-${isPlaying}`}
              />
            </div>
          </div>

          {/* Vertical Thumbnail Strip */}
          <div className="hidden lg:block">
            <div className="h-full max-h-[500px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-muted">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToSlide(index)}
                  onDoubleClick={() => openLightbox(index)}
                  className={`relative w-full aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentIndex
                      ? "ring-2 ring-gold scale-[1.02] shadow-lg"
                      : "hover:scale-[1.02] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-gold/10" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-medium line-clamp-1">{photo.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Thumbnails */}
        <div className="flex lg:hidden flex-wrap justify-center gap-2 mt-6">
          {photos.slice(0, 8).map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-gold scale-110"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
          {photos.length > 8 && (
            <button
              onClick={() => setViewMode("grid")}
              className="flex-shrink-0 w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-gold hover:text-black transition-colors"
            >
              <span className="text-xs font-medium">+{photos.length - 8}</span>
            </button>
          )}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-1.5 mt-6">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-gold" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        {/* Gallery info */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {photos.length} • {isPlaying ? "Auto-advancing" : "Paused"} • Click to expand
          </p>
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
