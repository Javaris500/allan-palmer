"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { MUX_CONFIG } from "@/lib/constants"
import Image from "next/image"

interface VideoShowcaseProps {
  title?: string
  subtitle?: string
  showTitle?: boolean
}

export function VideoShowcase({
  title = "Watch a Performance",
  subtitle = "Experience the elegance and emotion of live violin",
  showTitle = true,
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)

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

  const hlsUrl = `https://stream.mux.com/${MUX_CONFIG.playbackId}.m3u8`
  const thumbnailUrl = MUX_CONFIG.getThumbnailUrl(720, 1280, 8)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const initializeVideo = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl
      return true
    }

    try {
      const Hls = (await import("hls.js")).default
      
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

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
            if (data.fatal) {
              console.error("HLS Error:", data)
              reject(new Error(data.details))
            }
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }

    const onDurationChange = () => setDuration(video.duration || 0)
    const onPlay = () => { setIsPlaying(true); setIsLoading(false) }
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

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  useEffect(() => {
    if (!isPlaying || isHovering) { setShowControls(true); return }
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
      if (!success) { setIsLoading(false); setHasStarted(false); return }
    }

    try {
      if (isPlaying) { video.pause() } else { await video.play() }
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
      if (document.fullscreenElement) { await document.exitFullscreen() }
      else { await container.requestFullscreen() }
    } catch (err) { console.error("Fullscreen failed:", err) }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    video.currentTime = percent * duration
  }

  return (
    <section className="relative bg-background overflow-visible">
      {/* Section pulls up to overlap with hero bottom */}
      <div className="relative -mt-16 pt-0 pb-24 lg:pb-32">
        <div className="relative container mx-auto px-4 lg:px-8">
          {showTitle && (
            <div className="text-center mb-12 pt-24">
              <span className="inline-block text-gold/80 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                Featured Performance
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                {title}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">
                {subtitle}
              </p>
            </div>
          )}

          {/* Vertical Portrait Video Container */}
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative group w-full max-w-sm md:max-w-md"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-b from-gold/20 via-gold/10 to-gold/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Phone-style frame */}
              <div className="relative rounded-[1.5rem] overflow-hidden bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10">
                {/* 9:16 portrait aspect ratio */}
                <div className="relative aspect-[9/16]">
                  {/* Video */}
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
                          alt="Performance preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 448px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
                          <div className="absolute inset-0 animate-ping rounded-full bg-gold/30" style={{ animationDuration: "2s" }} />
                          <div className="absolute -inset-4 rounded-full bg-gold/10 animate-pulse" />
                          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-2xl shadow-gold/40">
                            {isLoading ? (
                              <div className="w-6 h-6 md:w-8 md:h-8 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                              <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-0.5" fill="black" />
                            )}
                          </div>
                        </motion.div>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Loading Overlay */}
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

                  {/* Controls */}
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
                                  <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
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
          </div>

          {/* Caption */}
          <p className="text-center text-muted-foreground text-sm mt-8 font-light">
            Click to play &bull; Unmute for audio
          </p>
        </div>
      </div>
    </section>
  )
}
