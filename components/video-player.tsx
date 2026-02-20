"use client"

import { useState, useCallback, memo } from "react"
import { Play, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MuxVideoPlayer } from "./mux-video-player"

interface VideoPlayerProps {
  playbackId: string
  delay?: number
  thumbnailIndex?: number
  title?: string
  description?: string
  className?: string
  portrait?: boolean // Added portrait prop for vertical aspect ratio
}

const VideoPlayer = memo<VideoPlayerProps>(function VideoPlayer({
  playbackId,
  delay = 0,
  thumbnailIndex = 1,
  title,
  description,
  className = "",
  portrait = false, // Default to landscape
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  // Generate optimized thumbnail URL with proper sizing
  const getThumbnailUrl = (id: string) => {
    const thumbnailConfigs: Record<string, { time: number; width: number; height: number }> = {
      "8XHHOLo2GkCfpOoPZSUCEIFE3k2aJkL7s92Qjkum00XU": { time: 12, width: 640, height: 360 },
      ek42ypjXGaMH9NLc5yAMJOm00IZlqiEn4SlRjSB0002bk4: { time: 4, width: 640, height: 360 },
      LDw3odZmUPkOV01owwlG5KU7p5Syk23X2ZycIsRoG4KQ: { time: 8, width: 640, height: 360 },
      qQKZNjMdf2bZIGgymE1HhHb005dUN8hWn00kZEkNojugw: { time: 8, width: 640, height: 360 },
      Mhrzlp01EwyQ84UFyHlPpAFnRpR6O3FtbsOmYpwKvpV8: { time: 4, width: 640, height: 360 },
      UvL8y013AUE3rUQ9fGGeQYmtkkbyLjOtTBOvnGWCUphY: { time: 10, width: 640, height: 360 },
      CMDtNWPBH6wyF501sNQN5WdyCXa01Hf6vuXMnvC6zeo4A: { time: 8, width: 640, height: 360 },
      p101AC02IpZ00TXImqFnAtiTWPsU4ZqVerE6yxWABxzJEQ: { time: 5, width: 640, height: 360 },
      ImhbTvedynawHayK1x6SgFflmuW00g02Vja5XJ4nDbHvk: { time: 8, width: 640, height: 360 },
      og101R00uw6Nzs0101Es2xVJg86F2WNDawpU01LrL6Dp7pjQ: { time: 12, width: 640, height: 360 },
      ZQMvVe46S02hgtwX98xJsc8Z4dBmU02Uiqu4RW02X01f2tk: { time: 5, width: 640, height: 360 },
      "1KO10154BKx01kM7QqWpcO3LWk2RzfeYQd9ctqEjSJFUI": { time: 15, width: 640, height: 360 },
      I025pVKflyFHaw00PTUJEhQQggnkunham1LrNwJOrnj8Q: { time: 10, width: 640, height: 360 },
    }

    const config = thumbnailConfigs[id] || { time: 10, width: 640, height: 360 }
    if (portrait) {
      return `https://image.mux.com/${id}/thumbnail.png?width=${config.height}&height=${config.width}&time=${config.time}&fit_mode=pad`
    }
    return `https://image.mux.com/${id}/thumbnail.png?width=${config.width}&height=${config.height}&time=${config.time}&fit_mode=pad`
  }

  const thumbnailUrl = getThumbnailUrl(playbackId)

  const handleThumbnailError = useCallback(() => {
    console.error("Thumbnail load error for playbackId:", playbackId)
    setThumbnailError(true)
  }, [playbackId])

  const handlePlay = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  if (thumbnailError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`relative w-full max-w-md mx-auto ${portrait ? "aspect-[3/4]" : "aspect-video"} bg-muted rounded-lg overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Thumbnail unavailable</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`group relative w-full max-w-md mx-auto ${portrait ? "aspect-[3/4]" : "aspect-video"} bg-black rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
        onClick={handlePlay}
      >
        {/* Thumbnail Image */}
        <Image
          src={thumbnailUrl || "/placeholder.svg?height=360&width=640&text=Video+Thumbnail"}
          alt={title || `Video thumbnail for ${playbackId}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
          onError={handleThumbnailError}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-8 h-8 text-black fill-current ml-0.5" />
          </motion.div>
        </div>

        {/* Video Info Overlay */}
        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {title && <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{title}</h3>}
            {description && <p className="text-white/80 text-xs line-clamp-2">{description}</p>}
          </div>
        )}

        {/* Quality Badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-medium">HD</span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title ? `Playing: ${title}` : "Video player"}
        >
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold z-10"
              aria-label="Close video player"
            >
              ✕ Close
            </button>
            <div className="w-full">
              <MuxVideoPlayer playbackId={playbackId} className="w-full" priority />
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export { VideoPlayer }
