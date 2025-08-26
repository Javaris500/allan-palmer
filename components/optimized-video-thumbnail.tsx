"use client"

import { useState, useCallback, memo } from "react"
import { Play, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { generateResponsiveThumbnails, generateThumbnailWithFallbacks, getVideoConfig } from "@/lib/video-thumbnails"

interface OptimizedVideoThumbnailProps {
  playbackId: string
  className?: string
  onClick?: () => void
  priority?: boolean
}

const OptimizedVideoThumbnail = memo<OptimizedVideoThumbnailProps>(function OptimizedVideoThumbnail({
  playbackId,
  className = "",
  onClick,
  priority = false,
}) {
  const [imageError, setImageError] = useState(false)
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const config = getVideoConfig(playbackId)
  const thumbnails = generateResponsiveThumbnails(playbackId, config?.optimalTime || 12)
  const fallbackData = generateThumbnailWithFallbacks(playbackId)

  const handleImageError = useCallback(() => {
    const fallbacks = fallbackData.fallbacks
    if (currentFallbackIndex < fallbacks.length - 1) {
      setCurrentFallbackIndex((prev) => prev + 1)
    } else {
      setImageError(true)
    }
    setIsLoading(false)
  }, [currentFallbackIndex, fallbackData.fallbacks])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setImageError(false)
  }, [])

  // Determine which thumbnail URL to use
  const getCurrentThumbnailUrl = () => {
    if (currentFallbackIndex === 0) {
      return fallbackData.primary
    }
    return fallbackData.fallbacks[currentFallbackIndex - 1] || fallbackData.primary
  }

  if (imageError) {
    return (
      <div className={`relative aspect-video bg-muted rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Thumbnail unavailable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`group relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Thumbnail Image */}
      <Image
        src={getCurrentThumbnailUrl() || "/placeholder.svg"}
        alt={config?.title || `Video thumbnail for ${playbackId}`}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        quality={85}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-6 h-6 text-black fill-current ml-0.5" />
        </motion.div>
      </div>

      {/* Video Info Overlay */}
      {config && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{config.title}</h3>
          <p className="text-white/80 text-xs line-clamp-2">{config.description}</p>
        </div>
      )}

      {/* Quality Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-white text-xs font-medium">HD</span>
        </div>
      </div>
    </motion.div>
  )
})

export { OptimizedVideoThumbnail }
