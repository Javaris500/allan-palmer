"use client"
import { useState, useRef, useEffect } from "react"
import { AnimatedElement } from "@/components/animated-element"
import { StaggeredContainer, StaggeredItem } from "@/components/staggered-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Calendar, ListMusic, Play, Pause, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function SongsShowcase() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const featuredSongs = [
    {
      id: "somewhere-over-the-rainbow",
      title: "Somewhere Over the Rainbow",
      artist: "Harold Arlen",
      genre: "Classic/Folk",
      duration: "3:45",
      description: "A timeless classic performed against the stunning Irish countryside",
      coverImage: "/images/songs/somewhere-over-the-rainbow.jpg",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Somewhere%20Over%20the%20Rainbow%20Mix%202-a4qyF6z7AlrapLl6b2cakmK6FomgT1.mp3",
    },
    {
      id: "historia-de-un-amor",
      title: "Historia de un Amor",
      artist: "Carlos Eleta Almarán",
      genre: "Latin/Classical",
      duration: "4:12",
      description: "Passionate Latin ballad with rich emotional depth and beautiful violin arrangements",
      coverImage: "/images/songs/historia-de-un-amor.jpg",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hdua%20master-J0tSAdXM6H6aIY0ya2zC61F17jqf2f.mp3",
    },
    {
      id: "what-a-wonderful-world",
      title: "What a Wonderful World",
      artist: "Louis Armstrong",
      genre: "Jazz Standard",
      duration: "3:28",
      description: "Uplifting jazz standard that celebrates life's beautiful moments",
      coverImage: "/images/songs/what-a-wonderful-world.jpg",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20a%20Wonderful%20World%20Master-BNlWK5wv0GDYsfajxE4gi2CUm0LmFQ.mp3",
    },
    {
      id: "bella-ciao",
      title: "Bella Ciao",
      artist: "Italian Folk Song",
      genre: "Folk/Traditional",
      duration: "3:52",
      description: "Passionate Italian folk song with deep cultural significance and beautiful melodic lines",
      coverImage: "/images/songs/bella-ciao.jpg",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7494-ec49-4177-b1d8-9f9050281eef-PaCqFSEvFK4pLL20iynIvNLb8qAQBJ.mp3",
    },
    {
      id: "fly-me-to-the-moon",
      title: "Fly Me to the Moon",
      artist: "Frank Sinatra",
      genre: "Jazz Standard",
      duration: "4:05",
      description: "Romantic jazz standard that captures the magic of love and dreams",
      coverImage: "/images/songs/fly-me-to-the-moon.jpg",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bd9e-0e62-408f-9954-d7de2da8f574-QJ0QV5BvfAdP40Lf4qkmkOPOJQ2DKe.mp3",
    },
    {
      id: "cant-help-falling-in-love",
      title: "Can't Help Falling in Love",
      artist: "Elvis Presley",
      genre: "Romance/Pop",
      duration: "3:15",
      description: "Tender romantic ballad perfect for weddings and intimate moments",
      coverImage: "/images/songs/cant-help-falling-in-love.png",
      audioSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cant%20Help%20Falling%20in%20Love-ueC6wBRenKYE8pAnqSJmCYxxjzsJyS.mp3",
    },
  ]

  useEffect(() => {
    // Initialize audio elements
    featuredSongs.forEach((song) => {
      if (!audioRefs.current[song.id]) {
        const audio = new Audio(song.audioSrc)
        audio.preload = "metadata"
        audio.addEventListener("loadedmetadata", () => {
          if (isLoading === song.id) {
            setIsLoading(null)
          }
        })
        audio.addEventListener("ended", () => {
          setCurrentlyPlaying(null)
        })
        audioRefs.current[song.id] = audio
      }
    })

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [])

  const togglePlayPause = async (songId: string) => {
    const audio = audioRefs.current[songId]
    if (!audio) return

    if (currentlyPlaying === songId) {
      audio.pause()
      setCurrentlyPlaying(null)
    } else {
      // Pause any currently playing audio
      if (currentlyPlaying) {
        audioRefs.current[currentlyPlaying]?.pause()
      }

      setIsLoading(songId)
      try {
        await audio.play()
        setCurrentlyPlaying(songId)
        setIsLoading(null)
      } catch (error) {
        console.error("Error playing audio:", error)
        setIsLoading(null)
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 md:py-24 dark:bg-muted/10">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80" />
      <div className="container relative">
        <AnimatedElement variant="fade-up" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Featured Performances</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Experience Allan's artistry through these beautiful violin renditions of beloved classics.
          </p>
        </AnimatedElement>

        <AnimatedElement variant="fade-up">
          <div className="mx-auto mt-8 mb-12 max-w-2xl">
            <motion.div
              className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/allan-performance-professional.jpg"
                alt="Allan Palmer performing violin in professional setting"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </AnimatedElement>

        <StaggeredContainer className="mx-auto mt-12 max-w-4xl" staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSongs.map((song, index) => (
              <StaggeredItem key={song.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="group overflow-hidden border-none bg-background/80 backdrop-blur-sm transition-all duration-300 hover:bg-background/90 hover:shadow-xl dark:bg-background/60 dark:hover:bg-background/80">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={song.coverImage || "/placeholder.svg"}
                        alt={`${song.title} cover`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="lg"
                          className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
                          onClick={() => togglePlayPause(song.id)}
                          disabled={isLoading === song.id}
                        >
                          {isLoading === song.id ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : currentlyPlaying === song.id ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" />
                          )}
                        </Button>
                      </div>

                      {/* Now playing indicator */}
                      {currentlyPlaying === song.id && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          <Volume2 className="w-4 h-4" />
                          <span>Playing</span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                            {song.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-primary">{song.genre}</span>
                          <span className="text-muted-foreground">{song.duration}</span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{song.description}</p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          onClick={() => togglePlayPause(song.id)}
                          disabled={isLoading === song.id}
                        >
                          {isLoading === song.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Loading...
                            </>
                          ) : currentlyPlaying === song.id ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Play Sample
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggeredItem>
            ))}
          </div>
        </StaggeredContainer>

        <AnimatedElement variant="fade-up" className="mt-12 text-center">
          <div className="mx-auto max-w-2xl rounded-lg bg-background/60 backdrop-blur-sm p-6 border border-border/50">
            <h3 className="text-lg font-semibold mb-2">Love what you hear?</h3>
            <p className="text-muted-foreground mb-4">
              Allan's extensive repertoire includes over 200 songs spanning classical, contemporary, and popular music.
              Request your favorites or discover new pieces for your special event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="transition-transform duration-300 hover:scale-105">
                <Link href="/services" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book Allan
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="transition-transform duration-300 hover:scale-105 bg-transparent"
              >
                <Link href="/repertoire" className="flex items-center gap-2">
                  <ListMusic className="h-4 w-4" />
                  View Full Repertoire
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}
