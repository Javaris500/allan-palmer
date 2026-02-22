"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { MUX_CONFIG } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isPreloaded, setIsPreloaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const hlsUrl = MUX_CONFIG.getHlsUrl()
  const thumbnailUrl = `https://image.mux.com/${MUX_CONFIG.playbackId}/thumbnail.png?width=720&height=1280&fit_mode=smartcrop&time=8`

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Pre-initialize HLS on mount so video is ready before user clicks
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    async function preload() {
      if (!video) return

      // Safari / iOS native HLS
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl
        video.preload = "auto"
        if (!cancelled) setIsPreloaded(true)
        return
      }

      try {
        const Hls = (await import("hls.js")).default
        if (cancelled) return

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            startLevel: -1,
            maxBufferLength: 60,
            maxMaxBufferLength: 120,
            abrEwmaDefaultEstimate: 5000000,
          })

          hls.loadSource(hlsUrl)
          hls.attachMedia(video!)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!cancelled) setIsPreloaded(true)
          })

          hls.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) console.warn("HLS preload error:", data.details)
          })

          hlsRef.current = hls
        }
      } catch (err) {
        console.warn("HLS preload failed:", err)
      }
    }

    preload()

    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize HLS (used as fallback if preload didn't complete)
  const initializeVideo = useCallback(async () => {
    const video = videoRef.current
    if (!video) return false

    // Already initialized by preload
    if (hlsRef.current || video.src) return true

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl
      return true
    }

    try {
      const Hls = (await import("hls.js")).default

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startLevel: -1,
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          abrEwmaDefaultEstimate: 5000000,
        })

        hls.loadSource(hlsUrl)
        hls.attachMedia(video)

        await new Promise<void>((resolve, reject) => {
          hls.on(Hls.Events.MANIFEST_PARSED, () => resolve())
          hls.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) reject(new Error(data.details))
          })
        })

        hlsRef.current = hls
        return true
      }
    } catch (error) {
      console.error("HLS initialization failed:", error)
      return false
    }

    return false
  }, [hlsUrl])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (video.duration) setProgress((video.currentTime / video.duration) * 100)
    }
    const onDurationChange = () => setDuration(video.duration || 0)
    const onPlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
    }
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onCanPlay = () => setIsLoading(false)
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      video.currentTime = 0
    }

    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("durationchange", onDurationChange)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("canplay", onCanPlay)
    video.addEventListener("ended", onEnded)

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("durationchange", onDurationChange)
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("canplay", onCanPlay)
      video.removeEventListener("ended", onEnded)

      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [])

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying || isHovering) {
      setShowControls(true)
      return
    }
    const timer = setTimeout(() => setShowControls(false), 3000)
    return () => clearTimeout(timer)
  }, [isPlaying, isHovering, currentTime])

  const handlePlayClick = async () => {
    const video = videoRef.current
    if (!video) return

    if (!hasStarted) {
      setHasStarted(true)
      // If preload already set up HLS, just play immediately
      if (!isPreloaded) {
        setIsLoading(true)
        const success = await initializeVideo()
        if (!success) {
          setIsLoading(false)
          setHasStarted(false)
          return
        }
      }
    }

    try {
      if (isPlaying) video.pause()
      else await video.play()
    } catch (err) {
      console.error("Play failed:", err)
      setIsLoading(false)
    }
  }

  const handleMuteToggle = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await container.requestFullscreen()
    } catch (err) {
      console.error("Fullscreen failed:", err)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    video.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  return (
    <section className="relative bg-background dark:bg-black overflow-hidden">
      {/* Subtle ambient glow behind video frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[700px] bg-gold/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* ── Hero Text ── */}
      <div className="relative z-10 pt-24 pb-6 md:pt-32 md:pb-10">
        <div className="container mx-auto px-4 text-center text-foreground">
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium border border-gold/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              <span className="text-gold">Professional Violinist</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Allan Palmer
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gold font-light mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Violinist for Events of All Types
          </motion.p>

          <motion.p
            className="mx-auto max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed mb-8 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bringing elegance and sophistication to your most cherished moments
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3 rounded-full shadow-elevation-4 hover:shadow-elevation-5 transition-all duration-300"
            >
              <Link href="/services" className="inline-flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Performance
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-foreground/30 text-foreground hover:bg-foreground/10 backdrop-blur-sm font-semibold px-8 py-3 rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 bg-transparent"
            >
              <Link href="/gallery" className="inline-flex items-center gap-2">
                <Music className="h-5 w-5" />
                View Performances
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── Portrait Video Player ── */}
      <motion.div
        className="relative z-10 flex justify-center px-4 pt-6 pb-6 md:pt-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div
          ref={containerRef}
          className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glow */}
          <div className="absolute -inset-3 bg-gradient-to-b from-gold/15 via-gold/5 to-gold/15 rounded-[2rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Frame */}
          <div className="relative rounded-[1.5rem] overflow-hidden bg-black shadow-2xl shadow-black/50 ring-1 ring-border">
            <div className="relative aspect-[9/16]">
              {/* Video element */}
              <video
                ref={videoRef}
                muted={isMuted}
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Thumbnail */}
              <AnimatePresence>
                {!hasStarted && (
                  <motion.div
                    className="absolute inset-0 z-10"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={thumbnailUrl}
                      alt="Allan Palmer performance preview"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 384px, 448px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Center Play Button */}
              <AnimatePresence>
                {(!isPlaying || !hasStarted) && (
                  <motion.button
                    onClick={handlePlayClick}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="absolute inset-0 animate-ping rounded-full bg-gold/30"
                        style={{ animationDuration: "2s" }}
                      />
                      <div className="absolute -inset-4 rounded-full bg-gold/10 animate-pulse" />
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-2xl shadow-gold/40">
                        {isLoading ? (
                          <div className="w-6 h-6 md:w-8 md:h-8 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <Play
                            className="w-6 h-6 md:w-8 md:h-8 text-black ml-0.5"
                            fill="black"
                          />
                        )}
                      </div>
                    </motion.div>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Loading overlay */}
              <AnimatePresence>
                {isLoading && isPlaying && (
                  <motion.div
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Controls */}
              <AnimatePresence>
                {hasStarted && showControls && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 z-40"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-4 px-4">
                      {/* Progress Bar */}
                      <div
                        className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress"
                        onClick={handleSeek}
                        role="progressbar"
                        aria-label="Video progress"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full relative"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 scale-0 group-hover/progress:scale-100 transition-all" />
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePlayClick}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" fill="white" />
                            ) : (
                              <Play
                                className="w-4 h-4 text-white ml-0.5"
                                fill="white"
                              />
                            )}
                          </button>
                          <button
                            onClick={handleMuteToggle}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <span className="text-white/70 text-xs font-mono">
                            {formatTime(currentTime)}
                          </span>
                        </div>
                        <button
                          onClick={handleFullscreen}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all"
                          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        >
                          {isFullscreen ? (
                            <Minimize className="w-4 h-4 text-white" />
                          ) : (
                            <Maximize className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Caption + scroll hint */}
      <motion.div
        className="relative z-10 text-center pb-8 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-muted-foreground/60 text-sm mb-6 font-light">
          Tap to play &bull; Unmute for audio
        </p>
        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="inline-flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          aria-label="Scroll to content"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </motion.div>

    </section>
  )
}
