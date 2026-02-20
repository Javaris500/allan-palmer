"use client"

import { useState, useRef, useEffect } from "react"
import { MuxVideoPlayer } from "./mux-video-player"
import { getAllVideoConfigs, VideoConfig } from "@/lib/video-thumbnails"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Shuffle,
  Tag,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Portrait thumbnail for reel-style cards
const getReelThumbnail = (playbackId: string, time: number = 10) => {
  return `https://image.mux.com/${playbackId}/thumbnail.png?width=400&height=712&time=${time}&fit_mode=crop`
}

// Landscape thumbnail for theater sidebar
const getLandscapeThumbnail = (playbackId: string, time: number = 10) => {
  return `https://image.mux.com/${playbackId}/thumbnail.png?width=400&height=225&time=${time}&fit_mode=crop`
}

export function VideoGalleryImmersive() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const allVideos = getAllVideoConfigs()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const selectedVideo = selectedVideoIndex !== null ? allVideos[selectedVideoIndex] : null

  const checkScrollState = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScrollState()
    el.addEventListener("scroll", checkScrollState)
    window.addEventListener("resize", checkScrollState)
    return () => {
      el.removeEventListener("scroll", checkScrollState)
      window.removeEventListener("resize", checkScrollState)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.7
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const goToPrevVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1)
    }
  }

  const goToNextVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex < allVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1)
    }
  }

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * allVideos.length)
    setSelectedVideoIndex(randomIndex)
  }

  // Theater Mode
  if (selectedVideo) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex"
        >
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
              <div className="text-white">
                <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                  {selectedVideo.category && (
                    <span className="bg-gold/20 text-gold px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {selectedVideo.category}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setSelectedVideoIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Video Player */}
            <div className="flex-1 flex items-center justify-center p-4 pt-20">
              <div className="w-full max-w-6xl">
                <MuxVideoPlayer playbackId={selectedVideo.playbackId} className="w-full" priority />
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
              {selectedVideo.description && (
                <p className="text-white/70 text-sm max-w-3xl mb-4">
                  {selectedVideo.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevVideo}
                  disabled={selectedVideoIndex === 0}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-4">
                  <span className="text-white/50 text-sm">
                    {selectedVideoIndex !== null ? selectedVideoIndex + 1 : 0} of {allVideos.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSurpriseMe}
                    className="bg-gold/20 border-gold/30 text-gold hover:bg-gold/30"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextVideo}
                  disabled={selectedVideoIndex === allVideos.length - 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 bg-gray-900/95 border-l border-white/10 overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <h4 className="text-white font-medium">Up Next</h4>
            </div>
            <div className="space-y-1 p-2">
              {allVideos.map((video, index) => (
                <button
                  key={video.playbackId}
                  onClick={() => setSelectedVideoIndex(index)}
                  className={cn(
                    "w-full flex gap-3 p-2 rounded-lg transition-colors",
                    index === selectedVideoIndex
                      ? "bg-gold/20 border border-gold/30"
                      : "hover:bg-white/10"
                  )}
                >
                  <div className="relative w-28 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                    <Image
                      src={getLandscapeThumbnail(video.playbackId, video.thumbnailTime || 10)}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                    {index === selectedVideoIndex && (
                      <div className="absolute inset-0 bg-gold/30 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={cn(
                      "text-sm font-medium line-clamp-2",
                      index === selectedVideoIndex ? "text-gold" : "text-white"
                    )}>
                      {video.title.replace("Allan Palmer - ", "")}
                    </p>
                    {video.category && (
                      <p className="text-xs text-white/50 mt-1">{video.category}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Reel-Style Gallery
  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {allVideos.length} performances
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSurpriseMe}
          className="gap-2 border-gold/30 text-gold hover:bg-gold/10"
        >
          <Shuffle className="h-4 w-4" />
          Surprise Me
        </Button>
      </div>

      {/* Horizontal Reel Carousel */}
      <div className="relative group/carousel">
        {/* Left scroll button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
            >
              <button
                onClick={() => scroll("left")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/80 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all ml-2 shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right scroll button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
            >
              <button
                onClick={() => scroll("right")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/80 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all mr-2 shadow-lg backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background dark:from-black to-transparent z-[5] pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background dark:from-black to-transparent z-[5] pointer-events-none" />
        )}

        {/* Scrollable reel container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allVideos.map((video, index) => (
            <motion.div
              key={video.playbackId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="flex-shrink-0 snap-start"
            >
              <ReelCard
                video={video}
                index={index}
                onClick={() => setSelectedVideoIndex(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Reel Card Component
function ReelCard({
  video,
  index,
  onClick,
}: {
  video: VideoConfig
  index: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-[200px] sm:w-[220px] md:w-[240px] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background"
    >
      {/* Reel thumbnail - 9:16 portrait aspect ratio */}
      <div className="relative aspect-[9/16] w-full bg-gray-900">
        <Image
          src={getReelThumbnail(video.playbackId, video.thumbnailTime || 10)}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, 240px"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Play button - center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="bg-gold/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-xl"
            whileHover={{ scale: 1.1 }}
          >
            <Play className="h-6 w-6 text-black fill-black" />
          </motion.div>
        </div>

        {/* Category badge - top */}
        {video.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <Tag className="h-2.5 w-2.5 text-gold" />
              {video.category}
            </span>
          </div>
        )}

        {/* Reel number indicator - top right */}
        <div className="absolute top-3 right-3">
          <span className="bg-gold/90 text-black text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {index + 1}
          </span>
        </div>

        {/* Title & info - bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-1">
            {video.title.replace("Allan Palmer - ", "")}
          </h3>
          {video.description && (
            <p className="text-white/60 text-[11px] leading-snug line-clamp-2">
              {video.description.substring(0, 60)}...
            </p>
          )}
        </div>

        {/* Side action icons - right side like social media */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
