"use client"

import { useState, useRef, useCallback, memo, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { getVideoConfig } from "@/lib/video-thumbnails"

interface MuxVideoPlayerProps {
  playbackId: string
  className?: string
  priority?: boolean
}

const MuxVideoPlayer = memo<MuxVideoPlayerProps>(function MuxVideoPlayer({
  playbackId,
  className = "",
  priority = false,
}) {
  const [showThumbnail, setShowThumbnail] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)
  const retryCountRef = useRef(0)

  const config = getVideoConfig(playbackId)

  // Generate optimized thumbnail URL with proper sizing
  const getThumbnailUrl = (id: string) => {
    const thumbnailConfigs: Record<string, { time: number; width: number; height: number }> = {
      "8XHHOLo2GkCfpOoPZSUCEIFE3k2aJkL7s92Qjkum00XU": { time: 12, width: 854, height: 480 },
      ek42ypjXGaMH9NLc5yAMJOm00IZlqiEn4SlRjSB0002bk4: { time: 4, width: 854, height: 480 },
      LDw3odZmUPkOV01owwlG5KU7p5Syk23X2ZycIsRoG4KQ: { time: 8, width: 854, height: 480 },
      qQKZNjMdf2bZIGgymE1HhHb005dUN8hWn00kZEkNojugw: { time: 8, width: 854, height: 480 },
      Mhrzlp01EwyQ84UFyHlPpAFnRpR6O3FtbsOmYpwKvpV8: { time: 4, width: 854, height: 480 },
      UvL8y013AUE3rUQ9fGGeQYmtkkbyLjOtTBOvnGWCUphY: { time: 10, width: 854, height: 480 },
      CMDtNWPBH6wyF501sNQN5WdyCXa01Hf6vuXMnvC6zeo4A: { time: 8, width: 854, height: 480 },
      p101AC02IpZ00TXImqFnAtiTWPsU4ZqVerE6yxWABxzJEQ: { time: 5, width: 854, height: 480 },
      ImhbTvedynawHayK1x6SgFflmuW00g02Vja5XJ4nDbHvk: { time: 8, width: 854, height: 480 },
      og101R00uw6Nzs0101Es2xVJg86F2WNDawpU01LrL6Dp7pjQ: { time: 12, width: 854, height: 480 },
      ZQMvVe46S02hgtwX98xJsc8Z4dBmU02Uiqu4RW02X01f2tk: { time: 5, width: 854, height: 480 },
      "1KO10154BKx01kM7QqWpcO3LWk2RzfeYQd9ctqEjSJFUI": { time: 15, width: 854, height: 480 },
    }

    const config = thumbnailConfigs[id] || { time: 10, width: 854, height: 480 }
    return `https://image.mux.com/${id}/thumbnail.png?width=${config.width}&height=${config.height}&time=${config.time}&fit_mode=pad`
  }

  const thumbnailUrl = getThumbnailUrl(playbackId)

  // Load HLS.js dynamically
  const loadHLS = useCallback(async () => {
    if (typeof window === "undefined") return null

    try {
      const Hls = (await import("hls.js")).default
      return Hls
    } catch (error) {
      console.error("Failed to load HLS.js:", error)
      return null
    }
  }, [])

  const handlePlay = useCallback(async () => {
    console.log("Play clicked for playbackId:", playbackId)

    if (!videoRef.current) {
      console.error("Video ref not available for playbackId:", playbackId)
      setHasError(true)
      setErrorMessage("Video player not initialized")
      return
    }

    // Check if video element is still in the DOM
    if (!document.contains(videoRef.current)) {
      console.error("Video element not in DOM")
      return
    }

    setShowThumbnail(false)
    setIsLoading(true)
    setHasError(false)
    setErrorMessage("")
    retryCountRef.current = 0

    const video = videoRef.current
    const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`

    try {
      // Try native HLS support first (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("Using native HLS support")
        video.src = hlsUrl
        video.load()

        try {
          await video.play()
          setIsPlaying(true)
          setIsLoading(false)
          return
        } catch (error) {
          console.log("Native HLS failed, trying HLS.js")
        }
      }

      // Load HLS.js for other browsers
      const Hls = await loadHLS()
      if (Hls && Hls.isSupported()) {
        console.log("Using HLS.js for playback")

        // Clean up existing HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          liveDurationInfinity: false,
          liveBackBufferLength: 0,
          maxLiveSyncPlaybackRate: 1,
          liveSyncDuration: undefined,
          liveMaxLatencyDuration: undefined,
          maxStarvationDelay: 4,
          maxLoadingDelay: 4,
          minAutoBitrate: 0,
          emeEnabled: false,
          widevineLicenseUrl: undefined,
          drmSystems: {},
          requestMediaKeySystemAccessFunc: undefined,
        })

        hlsRef.current = hls

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log("HLS media attached")
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed, starting playback")
          // Check again if video is still in DOM before playing
          if (videoRef.current && document.contains(videoRef.current)) {
            video
              .play()
              .then(() => {
                setIsPlaying(true)
                setIsLoading(false)
              })
              .catch((error) => {
                console.error("HLS play failed:", error)
                tryMP4Fallback()
              })
          }
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.log("HLS error event:", data)

          if (data.fatal) {
            console.error("Fatal HLS error:", data)
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("Network error, trying to recover...")
                if (retryCountRef.current < 3) {
                  retryCountRef.current++
                  hls.startLoad()
                } else {
                  tryMP4Fallback()
                }
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Media error, trying to recover...")
                if (retryCountRef.current < 3) {
                  retryCountRef.current++
                  hls.recoverMediaError()
                } else {
                  tryMP4Fallback()
                }
                break
              default:
                console.log("Unrecoverable error, switching to MP4")
                tryMP4Fallback()
                break
            }
          } else {
            // Non-fatal errors - just log them
            console.log("Non-fatal HLS error:", data.details)

            // Handle buffer stalled errors specifically
            if (data.details === "bufferStalledError") {
              console.log("Buffer stalled, attempting recovery...")
              if (retryCountRef.current < 2) {
                retryCountRef.current++
                setTimeout(() => {
                  if (video && video.paused && isPlaying && document.contains(video)) {
                    video.play().catch(console.error)
                  }
                }, 1000)
              }
            }
          }
        })

        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          // Reset retry count on successful buffer append
          retryCountRef.current = 0
        })

        hls.loadSource(hlsUrl)
        hls.attachMedia(video)
      } else {
        console.log("HLS not supported, trying MP4 fallback")
        tryMP4Fallback()
      }
    } catch (error) {
      console.error("HLS setup failed:", error)
      tryMP4Fallback()
    }

    function tryMP4Fallback() {
      console.log("Trying MP4 fallback for:", playbackId)
      const mp4Url = `https://stream.mux.com/${playbackId}.mp4`

      if (videoRef.current && document.contains(videoRef.current)) {
        // Clean up HLS instance before switching to MP4
        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }

        videoRef.current.src = mp4Url
        videoRef.current.load()

        videoRef.current
          .play()
          .then(() => {
            console.log("MP4 fallback successful")
            setIsPlaying(true)
            setIsLoading(false)
          })
          .catch((mp4Error) => {
            console.error("MP4 fallback failed:", mp4Error)
            setHasError(true)
            setErrorMessage("Unable to play video. Please check your connection and try again.")
            setIsLoading(false)
            setShowThumbnail(true)
          })
      }
    }
  }, [playbackId, loadHLS, isPlaying])

  // Cleanup HLS instance on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [])

  const handleVideoError = useCallback(
    (e: any) => {
      console.error("Video element error for playbackId:", playbackId, e.target?.error)

      let errorMsg = "Video playback error"
      if (e.target?.error) {
        switch (e.target.error.code) {
          case 1:
            errorMsg = "Video loading was aborted"
            break
          case 2:
            errorMsg = "Network error occurred while loading video"
            break
          case 3:
            errorMsg = "Video format not supported by your browser"
            break
          case 4:
            errorMsg = "Video source not found or unavailable"
            break
          default:
            errorMsg = `Video error (code: ${e.target.error.code})`
        }
      }

      setErrorMessage(errorMsg)
      setHasError(true)
      setIsLoading(false)
      setShowThumbnail(true)
      setIsPlaying(false)
    },
    [playbackId],
  )

  const handleVideoCanPlay = useCallback(() => {
    console.log("Video can play for playbackId:", playbackId)
    setIsLoading(false)
  }, [playbackId])

  const handleVideoLoadStart = useCallback(() => {
    console.log("Video load started for playbackId:", playbackId)
    setIsLoading(true)
  }, [playbackId])

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true)
    setIsLoading(false)
  }, [])

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false)
    setShowThumbnail(true)
    setShowControls(false)
  }, [])

  const handleVideoWaiting = useCallback(() => {
    console.log("Video waiting/buffering for:", playbackId)
    setIsLoading(true)
  }, [playbackId])

  const handleVideoCanPlayThrough = useCallback(() => {
    console.log("Video can play through for:", playbackId)
    setIsLoading(false)
  }, [playbackId])

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current || !document.contains(videoRef.current)) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Play failed:", error)
        setHasError(true)
        setErrorMessage("Failed to resume playback")
      })
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!videoRef.current || !document.contains(videoRef.current)) return

    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current || !document.contains(videoRef.current)) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }, [])

  if (hasError) {
    return (
      <div
        className={`relative w-full max-w-2xl mx-auto aspect-video bg-muted rounded-lg overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium mb-2">Video Unavailable</p>
            <p className="text-sm text-muted-foreground/70 mb-2">{errorMessage}</p>
            <p className="text-xs text-muted-foreground/50 mb-4">PlaybackId: {playbackId.slice(0, 12)}...</p>
            <button
              onClick={() => {
                console.log("Retry clicked for playbackId:", playbackId)
                setHasError(false)
                setShowThumbnail(true)
                setIsLoading(false)
                setErrorMessage("")
                setIsPlaying(false)
                retryCountRef.current = 0
                // Clean up HLS instance on retry
                if (hlsRef.current) {
                  hlsRef.current.destroy()
                  hlsRef.current = null
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-lg overflow-hidden shadow-lg ${className}`}
      onMouseEnter={() => !showThumbnail && setShowControls(true)}
      onMouseLeave={() => !showThumbnail && setShowControls(false)}
    >
      {/* Thumbnail */}
      {showThumbnail && (
        <div className="absolute inset-0 z-10">
          <Image
            src={thumbnailUrl || "/placeholder.svg?height=480&width=854&text=Video+Thumbnail"}
            alt={config?.title || "Video thumbnail"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            quality={90}
            onLoad={() => console.log("Thumbnail loaded successfully for:", playbackId)}
            onError={(e) => {
              console.error("Thumbnail load error for playbackId:", playbackId)
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=480&width=854&text=Video+Thumbnail"
            }}
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={handlePlay}
              className="w-16 h-16 md:w-20 md:h-20 bg-white/95 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Play video"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" fill="currentColor" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Video Player */}
      <video
        ref={videoRef}
        className={`w-full h-full object-contain ${showThumbnail ? "hidden" : "block"}`}
        preload="none"
        playsInline
        crossOrigin="anonymous"
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        onLoadStart={handleVideoLoadStart}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={handleVideoEnded}
        onWaiting={handleVideoWaiting}
        onCanPlayThrough={handleVideoCanPlayThrough}
        onLoadedMetadata={() => console.log("Video metadata loaded:", playbackId)}
        onSeeking={() => console.log("Video seeking:", playbackId)}
        onSeeked={() => console.log("Video seeked:", playbackId)}
        onStalled={() => console.log("Video stalled:", playbackId)}
      />

      {/* Video Controls */}
      {!showThumbnail && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={togglePlayPause}
                className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" fill="currentColor" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  )
})

export { MuxVideoPlayer }
