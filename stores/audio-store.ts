import { create } from "zustand"

interface AudioState {
  currentlyPlaying: string | null
  isPlaying: boolean
  isMuted: boolean
  backgroundMusicEnabled: boolean
  audio: HTMLAudioElement | null
  backgroundAudio: HTMLAudioElement | null

  // Actions
  playAudio: (songId: string, audioUrl: string) => void
  pauseAudio: () => void
  toggleMute: () => void
  stopAudio: () => void
  setBackgroundMusic: (enabled: boolean) => void
}

const audioUrls: Record<string, string> = {
  "bella-ciao":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7494-ec49-4177-b1d8-9f9050281eef-z3fhi0xnkvLcwbVHLJfejIs5W8Ki9t.mp3",
  "historia-de-un-amor":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hdua%20master-E4v3tqBtfOoS5LTpV4b1Yggm4UT2jJ.mp3",
  "what-a-wonderful-world":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20a%20Wonderful%20World%20Master-JABmURSW0VZ53HYwZV3wGjLkjrgUcE.mp3",
  "cant-help-falling-in-love":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cant%20Help%20Falling%20in%20Love-gdzO839wZruU5nHq2wwSwsabROGJhT.mp3",
  "somewhere-over-the-rainbow":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Somewhere%20Over%20the%20Rainbow%20Mix%202-LkxgMx5yX3tj6LBGYGddBsd5DjS1Kw.mp3",
  "fly-me-to-the-moon":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bd9e-0e62-408f-9954-d7de2da8f574-QJ0QV5BvfAdP40Lf4qkmkOPOJQ2DKe.mp3",
}

const backgroundMusicUrls = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cant%20Help%20Falling%20in%20Love-gdzO839wZruU5nHq2wwSwsabROGJhT.mp3", // Can't Help Falling in Love
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20a%20Wonderful%20World%20Master-JABmURSW0VZ53HYwZV3wGjLkjrgUcE.mp3", // What a Wonderful World
]

export const useAudioStore = create<AudioState>((set, get) => ({
  currentlyPlaying: null,
  isPlaying: false,
  isMuted: false,
  backgroundMusicEnabled: false,
  audio: null,
  backgroundAudio: null,

  playAudio: (songId: string, audioUrl?: string) => {
    const state = get()

    // Stop any currently playing audio
    if (state.audio) {
      state.audio.pause()
      state.audio.currentTime = 0
    }

    // Pause background music
    if (state.backgroundAudio && !state.backgroundAudio.paused) {
      state.backgroundAudio.pause()
    }

    // Use provided URL or get from audioUrls
    const url = audioUrl || audioUrls[songId]
    if (!url) {
      console.error("No audio URL found for:", songId)
      return
    }

    const newAudio = new Audio(url)
    newAudio.volume = 1
    newAudio.muted = false // Ensure the audio is not muted

    newAudio.addEventListener("loadeddata", () => {
      newAudio
        .play()
        .then(() => {})
        .catch((error) => {
          console.error("Error playing audio:", error)
        })
    })

    newAudio.addEventListener("error", (e) => {
      console.error("Audio loading error:", e)
    })

    newAudio.addEventListener("ended", () => {
      set({ currentlyPlaying: null, isPlaying: false, audio: null })
    })

    set({
      currentlyPlaying: songId,
      isPlaying: true,
      audio: newAudio,
    })
  },

  pauseAudio: () => {
    const state = get()
    if (state.audio) {
      state.audio.pause()
      set({ isPlaying: false })
    }
  },

  toggleMute: () => {
    const state = get()
    if (state.audio) {
      state.audio.muted = !state.audio.muted
      set({ isMuted: !state.isMuted })
    }
  },

  stopAudio: () => {
    const state = get()
    if (state.audio) {
      state.audio.pause()
      state.audio.currentTime = 0
    }
    if (state.backgroundAudio) {
      state.backgroundAudio.pause()
      state.backgroundAudio.currentTime = 0
    }
    set({ currentlyPlaying: null, isPlaying: false, audio: null })
  },

  setBackgroundMusic: (enabled: boolean) => {
    const state = get()

    if (enabled && !state.backgroundAudio) {
      // Create background audio
      const bgAudio = new Audio(backgroundMusicUrls[0])
      bgAudio.loop = true
      bgAudio.volume = state.isMuted ? 0 : 0.3 // Lower volume for background

      bgAudio.addEventListener("ended", () => {
        // Shuffle to next song
        const currentIndex = backgroundMusicUrls.indexOf(bgAudio.src)
        const nextIndex = (currentIndex + 1) % backgroundMusicUrls.length
        bgAudio.src = backgroundMusicUrls[nextIndex] ?? backgroundMusicUrls[0] ?? ""
        bgAudio.play()
      })

      set({ backgroundAudio: bgAudio, backgroundMusicEnabled: true })

      if (!state.currentlyPlaying) {
        bgAudio.play().catch(console.error)
      }
    } else if (!enabled && state.backgroundAudio) {
      state.backgroundAudio.pause()
      set({ backgroundMusicEnabled: false })
    }
  },
}))
