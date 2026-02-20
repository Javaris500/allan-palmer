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

interface HeroSectionProps {
  heroTitle?: string
  heroSubtitle?: string
  heroBadge?: string
  heroDescription?: string
  ctaPrimaryText?: string
  ctaPrimaryLink?: string
  ctaSecondaryText?: string
  ctaSecondaryLink?: string
}

export function HeroSection({
  heroTitle = "Allan Palmer",
  heroSubtitle = "Violinist for Events of All Types",
  heroBadge = "Professional Violinist",
  heroDescription = "Bringing elegance and sophistication to your most cherished moments",
  ctaPrimaryText = "Book Performance",
  ctaPrimaryLink = "/services",
  ctaSecondaryText = "View Performances",
  ctaSecondaryLink = "/gallery",
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)
  const mobileHlsRef = useRef<any>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false)
  const [mobileVideoReady, setMobileVideoReady] = useState(false)
  const [mobileMuted, setMobileMuted] = useState(true)

  const hlsUrl = MUX_CONFIG.getHlsUrl()
  const thumbnailUrl = `https://image.mux.com/${MUX_CONFIG.playbackId}/thumbnail.png?width=720&height=1280&fit_mode=smartcrop&time=8`

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Initialize HLS for mobile background video (autoplay)
  const initializeMobileVideo = useCallback(async () => {
    const video = mobileVideoRef.current
    if (!video) return

    try {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl
        video.muted = true
        video.loop = true
        await video.play()
        setMobileVideoReady(true)
        return
      }

      const Hls = (await import("hls.js")).default

      if (Hls.isSupported()) {
        if (mobileHlsRef.current) mobileHlsRef.current.destroy()

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startLevel: 2, // Start with medium quality for mobile
          capLevelToPlayerSize: true,
          maxBufferLength: 30,
        })

        hls.loadSource(hlsUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          video.muted = true
          video.loop = true
          try {
            await video.play()
            setMobileVideoReady(true)
          } catch (e) {
            // Autoplay blocked - that's okay, we have the thumbnail
          }
        })

        mobileHlsRef.current = hls
      }
    } catch (error) {
      console.error("Mobile HLS initialization failed:", error)
    }
  }, [hlsUrl])

  // Auto-initialize mobile video when on mobile
  useEffect(() => {
    if (isMobile) {
      initializeMobileVideo()
    }
    return () => {
      if (mobileHlsRef.current) {
        mobileHlsRef.current.destroy()
        mobileHlsRef.current = null
      }
    }
  }, [isMobile, initializeMobileVideo])

  // Initialize HLS for desktop player
  const initializeVideo = useCallback(async () => {
    const video = videoRef.current
    if (!video) return false

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl
      return true
    }

    try {
      const Hls = (await import("hls.js")).default

      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy()

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startLevel: -1,
          capLevelToPlayerSize: false,
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

  // Desktop video event listeners
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

  // Auto-hide controls (desktop)
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
      setIsLoading(true)
      const success = await initializeVideo()
      if (!success) {
        setIsLoading(false)
        setHasStarted(false)
        return
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

  const handleMobileMuteToggle = () => {
    const video = mobileVideoRef.current
    if (!video) return
    video.muted = !video.muted
    setMobileMuted(video.muted)
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

  // ════════════════════════════════════════════════════════════════════════════
  // MOBILE VIEW - Full-screen background video with overlay text
  // ════════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section className="relative min-h-[100svh] bg-black overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          {/* Thumbnail fallback */}
          <Image
            src={thumbnailUrl}
            alt="Allan Palmer performance"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          
          {/* Video overlay */}
          <video
            ref={mobileVideoRef}
            muted={mobileMuted}
            playsInline
            loop
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              mobileVideoReady ? "opacity-100" : "opacity-0"
            }`}
          />
          
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          
          {/* Additional vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col min-h-[100svh] px-6">
          {/* Main content - centered */}
          <div className="flex-1 flex flex-col justify-center items-center text-center pt-20 pb-32">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium border border-gold/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-gold">{heroBadge}</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-serif text-3xl font-bold tracking-tight mb-2 text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              className="text-base text-gold font-light mb-3 drop-shadow-lg tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {heroSubtitle}
            </motion.p>

            <motion.p
              className="max-w-xs text-white/70 text-sm leading-relaxed mb-6 font-light drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {heroDescription}
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3 rounded-full shadow-2xl transition-all duration-300 w-full"
              >
                <Link href={ctaPrimaryLink} className="inline-flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {ctaPrimaryText}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md font-semibold px-8 py-3 rounded-full transition-all duration-300 w-full bg-white/5"
              >
                <Link href={ctaSecondaryLink} className="inline-flex items-center justify-center gap-2">
                  <Music className="h-5 w-5" />
                  {ctaSecondaryText}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Bottom controls */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 pb-8 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center justify-between">
              {/* Mute toggle */}
              <button
                onClick={handleMobileMuteToggle}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all border border-white/20"
                aria-label={mobileMuted ? "Unmute video" : "Mute video"}
              >
                {mobileMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Scroll indicator */}
              <button
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                }
                className="inline-flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
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

              {/* Spacer for alignment */}
              <div className="w-10" />
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DESKTOP VIEW - Centered portrait video player (original design)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <section className="relative bg-background dark:bg-black overflow-hidden">
      {/* Subtle ambient glow behind video frame */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[700px] bg-gold/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* ── Hero Text ── */}
      <div className="relative z-10 pt-20 pb-4 md:pt-28 md:pb-6">
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
              <span className="text-gold">{heroBadge}</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gold font-light mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {heroSubtitle}
          </motion.p>

          <motion.p
            className="mx-auto max-w-lg text-muted-foreground text-sm md:text-base leading-relaxed mb-6 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {heroDescription}
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
              <Link href={ctaPrimaryLink} className="inline-flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {ctaPrimaryText}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-foreground/30 text-foreground hover:bg-foreground/10 backdrop-blur-sm font-semibold px-8 py-3 rounded-full shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 bg-transparent"
            >
              <Link href={ctaSecondaryLink} className="inline-flex items-center gap-2">
                <Music className="h-5 w-5" />
                {ctaSecondaryText}
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
                preload="none"
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
