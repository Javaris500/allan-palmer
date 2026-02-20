"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LightboxImage {
  id: number
  src: string
  alt: string
  title: string
  description: string
}

interface LightboxProps {
  images: LightboxImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true)

  const nextImage = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const prevImage = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: images[currentIndex]?.title || "Gallery Image",
          text: images[currentIndex]?.description || "Gallery image from Allan Palmer",
          url: window.location.href,
        })
      } catch {
        // Share cancelled or not supported - silently ignore
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          prevImage()
          break
        case "ArrowRight":
          nextImage()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, prevImage, nextImage])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const currentImage = images[currentIndex] || { 
    id: 0, 
    src: "/placeholder.svg", 
    alt: "Gallery image", 
    title: "Gallery image", 
    description: "" 
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-semibold">{currentImage?.title || "Gallery Image"}</h3>
              <p className="text-sm text-white/70">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main image */}
        <div className="flex items-center justify-center h-full p-4 pt-20 pb-24">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-7xl max-h-full w-full h-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              onLoad={() => setIsLoading(false)}
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation()
            prevImage()
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation()
            nextImage()
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* Bottom info and thumbnails */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="text-center text-white mb-4">
            <p className="text-sm text-white/80 max-w-2xl mx-auto">{currentImage.description}</p>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate(index)
                }}
                className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black/50"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className={`${index === 3 ? "object-contain" : "object-cover"}`}
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
