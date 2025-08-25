"use client"

import { useState } from "react"
import { MuxVideoPlayer } from "./mux-video-player"
import { getAllVideoConfigs } from "@/lib/video-thumbnails"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function VideoThumbnailGrid() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const videosPerPage = 6
  const videos = getAllVideoConfigs()

  const totalPages = Math.ceil(videos.length / videosPerPage)
  const startIndex = (currentPage - 1) * videosPerPage
  const endIndex = startIndex + videosPerPage
  const currentVideos = videos.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  if (selectedVideo) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold z-10"
          >
            ✕ Close
          </button>
          <div className="w-full">
            <MuxVideoPlayer playbackId={selectedVideo} className="w-full" priority />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Info */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, videos.length)} of {videos.length} performances
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {currentVideos.map((video, index) => (
          <div
            key={video.playbackId}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => setSelectedVideo(video.playbackId)}
          >
            <div className="w-full max-w-md mx-auto">
              <MuxVideoPlayer playbackId={video.playbackId} className="w-full" priority={index === 0} />
            </div>
          </div>
        ))}
      </div>

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
      )}
    </div>
  )
}
