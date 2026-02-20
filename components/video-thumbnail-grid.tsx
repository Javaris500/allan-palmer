"use client"

import { useState, useMemo } from "react"
import { MuxVideoPlayer } from "./mux-video-player"
import { getAllVideoConfigs, VideoConfig } from "@/lib/video-thumbnails"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Play, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function VideoThumbnailGrid() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const videosPerPage = 6
  const allVideos = getAllVideoConfigs()

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allVideos.map(v => v.category || "Other"))
    return ["All", ...Array.from(cats).sort()]
  }, [allVideos])

  // Filter videos by category
  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") return allVideos
    return allVideos.filter(v => v.category === activeCategory)
  }, [allVideos, activeCategory])

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage)
  const startIndex = (currentPage - 1) * videosPerPage
  const endIndex = startIndex + videosPerPage
  const currentVideos = filteredVideos.slice(startIndex, endIndex)

  // Get the selected video object
  const selectedVideo = selectedVideoIndex !== null ? filteredVideos[selectedVideoIndex] : null

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1) // Reset to first page when category changes
  }

  const handleVideoSelect = (globalIndex: number) => {
    // Convert from page-relative index to filtered list index
    const actualIndex = startIndex + globalIndex
    setSelectedVideoIndex(actualIndex)
  }

  const goToPrevVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1)
    }
  }

  const goToNextVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex < filteredVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1)
    }
  }

  // Video Modal
  if (selectedVideo) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideoIndex(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Header with title and close */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                  {selectedVideo.category && (
                    <span className="bg-gold/20 text-gold px-2 py-0.5 rounded text-xs">
                      {selectedVideo.category}
                    </span>
                  )}
                  {selectedVideo.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedVideo.duration}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setSelectedVideoIndex(null)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close video</span>
              </Button>
            </div>

            {/* Video Player */}
            <div className="w-full rounded-lg overflow-hidden">
              <MuxVideoPlayer playbackId={selectedVideo.playbackId} className="w-full" priority />
            </div>

            {/* Description */}
            {selectedVideo.description && (
              <p className="text-white/70 mt-4 text-sm max-w-3xl">
                {selectedVideo.description}
              </p>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6">
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
              
              <span className="text-white/50 text-sm">
                {selectedVideoIndex !== null ? selectedVideoIndex + 1 : 0} of {filteredVideos.length}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextVideo}
                disabled={selectedVideoIndex === filteredVideos.length - 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className={activeCategory === category 
              ? "bg-gold hover:bg-gold/90 text-black" 
              : "hover:border-gold hover:text-gold"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Showing {filteredVideos.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} performances
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
      </div>

      {/* Video Grid with Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentVideos.map((video, index) => (
          <motion.div
            key={video.playbackId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => handleVideoSelect(index)}
          >
            <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              {/* Video Thumbnail */}
              <div className="relative aspect-video">
                <MuxVideoPlayer 
                  playbackId={video.playbackId} 
                  className="w-full h-full object-cover" 
                  priority={index === 0} 
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-gold/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Play className="h-8 w-8 text-black fill-black" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                )}

                {/* Category Badge */}
                {video.category && (
                  <div className="absolute top-2 left-2 bg-gold/90 text-black text-xs font-medium px-2 py-1 rounded">
                    {video.category}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4 bg-card">
                <h4 className="font-medium text-foreground line-clamp-1 group-hover:text-gold transition-colors">
                  {video.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found in this category.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => handleCategoryChange("All")}
          >
            View All Videos
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
                className={`w-10 h-10 ${currentPage === page ? "bg-gold hover:bg-gold/90 text-black" : ""}`}
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
      )}
    </div>
  )
}
