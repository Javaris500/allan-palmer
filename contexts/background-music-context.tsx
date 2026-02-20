"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import { useAudioStore } from "@/stores/audio-store"

interface BackgroundMusicContextType {
  isPlaying: boolean
  isMuted: boolean
  currentSong: string
  togglePlay: () => void
  toggleMute: () => void
  volume: number
  setVolume: (volume: number) => void
  muteForOtherAudio: () => void
  unmuteAfterOtherAudio: () => void
  stopFeaturedPerformances: (() => void) | null
  setStopFeaturedPerformances: (fn: (() => void) | null) => void
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined)

const songs = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cant%20Help%20Falling%20in%20Love-gdzO839wZruU5nHq2wwSwsabROGJhT.mp3",
    title: "Can't Help Falling in Love",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20a%20Wonderful%20World%20Master-JABmURSW0VZ53HYwZV3wGjLkjrgUcE.mp3",
    title: "What a Wonderful World",
  },
]

export function BackgroundMusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted for better UX
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [volume, setVolume] = useState(0.3)
  const [mutedByOtherAudio, setMutedByOtherAudio] = useState(false)
  const stopFeaturedPerformancesRef = useRef<(() => void) | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { stopAudio } = useAudioStore()

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(songs[currentSongIndex]!.src)
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
      audioRef.current.loop = false

      const handleEnded = () => {
        const nextIndex = Math.floor(Math.random() * songs.length)
        setCurrentSongIndex(nextIndex)
      }

      audioRef.current.addEventListener("ended", handleEnded)

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded)
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying
      audioRef.current.pause()
      audioRef.current.src = songs[currentSongIndex]!.src
      audioRef.current.load()

      if (wasPlaying && !isMuted) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error toggling playback:", error)
    }
  }

  const toggleMute = async () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setMutedByOtherAudio(false)

    if (!newMutedState && !isPlaying) {
      if (stopFeaturedPerformancesRef.current) {
        stopFeaturedPerformancesRef.current()
      }
      stopAudio()

      try {
        await audioRef.current?.play()
        setIsPlaying(true)
      } catch (error) {
        console.error("Error starting playback:", error)
      }
    }
  }

  const muteForOtherAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setMutedByOtherAudio(true)
    }
  }

  const unmuteAfterOtherAudio = async () => {
    if (mutedByOtherAudio && !isMuted) {
      setMutedByOtherAudio(false)
      try {
        await audioRef.current?.play()
        setIsPlaying(true)
      } catch (error) {
        console.error("Error resuming playback:", error)
      }
    }
  }

  const setStopFeaturedPerformances = (fn: (() => void) | null) => {
    stopFeaturedPerformancesRef.current = fn
  }

  return (
    <BackgroundMusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        currentSong: songs[currentSongIndex]?.title ?? "",
        togglePlay,
        toggleMute,
        volume,
        setVolume,
        muteForOtherAudio,
        unmuteAfterOtherAudio,
        stopFeaturedPerformances: stopFeaturedPerformancesRef.current,
        setStopFeaturedPerformances,
      }}
    >
      {children}
    </BackgroundMusicContext.Provider>
  )
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext)
  if (context === undefined) {
    throw new Error("useBackgroundMusic must be used within a BackgroundMusicProvider")
  }
  return context
}
