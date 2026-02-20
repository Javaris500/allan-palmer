"use client"
import { useState, useEffect } from "react"
import { useBackgroundMusic } from "@/contexts/background-music-context"
import { useAudioStore } from "@/stores/audio-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Calendar, ListMusic, Play, Pause, Volume2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SongsShowcaseProps {
  sectionTitle?: string
  sectionDescription?: string
}

export function SongsShowcase({
  sectionTitle = "Featured Performances",
  sectionDescription = "Experience Allan's artistry through these beautiful violin renditions of beloved classics.",
}: SongsShowcaseProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { muteForOtherAudio, unmuteAfterOtherAudio, setStopFeaturedPerformances } = useBackgroundMusic()
  const { currentlyPlaying, isPlaying, playAudio, pauseAudio, stopAudio } = useAudioStore()

  const featuredSongs = [
    {
      id: "somewhere-over-the-rainbow",
      title: "Somewhere Over the Rainbow",
      artist: "Harold Arlen",
      genre: "Classic/Folk",
      duration: "3:45",
      description: "A timeless classic performed against the stunning Irish countryside",
      coverImage: "/images/songs/somewhere-over-the-rainbow.jpg",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Somewhere%20Over%20the%20Rainbow%20Mix%202-LkxgMx5yX3tj6LBGYGddBsd5DjS1Kw.mp3",
    },
    {
      id: "historia-de-un-amor",
      title: "Historia de un Amor",
      artist: "Carlos Eleta Almarán",
      genre: "Latin/Classical",
      duration: "4:12",
      description: "Passionate Latin ballad with rich emotional depth and beautiful violin arrangements",
      coverImage: "/images/songs/historia-de-un-amor.jpg",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hdua%20master-E4v3tqBtfOoS5LTpV4b1Yggm4UT2jJ.mp3",
    },
    {
      id: "what-a-wonderful-world",
      title: "What a Wonderful World",
      artist: "Louis Armstrong",
      genre: "Jazz Standard",
      duration: "3:28",
      description: "Uplifting jazz standard that celebrates life's beautiful moments",
      coverImage: "/images/songs/what-a-wonderful-world.jpg",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20a%20Wonderful%20World%20Master-JABmURSW0VZ53HYwZV3wGjLkjrgUcE.mp3",
    },
    {
      id: "bella-ciao",
      title: "Bella Ciao",
      artist: "Italian Folk Song",
      genre: "Folk/Traditional",
      duration: "3:52",
      description: "Passionate Italian folk song with deep cultural significance and beautiful melodic lines",
      coverImage: "/images/songs/bella-ciao.jpg",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7494-ec49-4177-b1d8-9f9050281eef-z3fhi0xnkvLcwbVHLJfejIs5W8Ki9t.mp3",
    },
    {
      id: "fly-me-to-the-moon",
      title: "Fly Me to the Moon",
      artist: "Frank Sinatra",
      genre: "Jazz Standard",
      duration: "4:05",
      description: "Romantic jazz standard that captures the magic of love and dreams",
      coverImage: "/images/songs/fly-me-to-the-moon.jpg",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bd9e-0e62-408f-9954-d7de2da8f574-QJ0QV5BvfAdP40Lf4qkmkOPOJQ2DKe.mp3",
    },
    {
      id: "cant-help-falling-in-love",
      title: "Can't Help Falling in Love",
      artist: "Elvis Presley",
      genre: "Romance/Pop",
      duration: "3:15",
      description: "Tender romantic ballad perfect for weddings and intimate moments",
      coverImage: "/images/songs/cant-help-falling-in-love.png",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cant%20Help%20Falling%20in%20Love-gdzO839wZruU5nHq2wwSwsabROGJhT.mp3",
    },
  ]

  useEffect(() => {
    const stopAllFeaturedAudio = () => {
      if (currentlyPlaying) {
        stopAudio()
      }
    }

    setStopFeaturedPerformances(stopAllFeaturedAudio)

    return () => {
      setStopFeaturedPerformances(null)
    }
  }, [setStopFeaturedPerformances, currentlyPlaying, stopAudio])

  const togglePlayPause = async (songId: string) => {
    const song = featuredSongs.find((s) => s.id === songId)
    if (!song) return

    if (currentlyPlaying !== songId || !isPlaying) {
      muteForOtherAudio()
      setIsLoading(songId)

      try {
        await playAudio(songId, song.audioUrl)
      } catch (error) {
        console.error("Error playing audio:", error)
      } finally {
        setIsLoading(null)
      }
    } else {
      pauseAudio()
      unmuteAfterOtherAudio()
    }
  }

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="container relative">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">{sectionTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {sectionDescription}
          </p>
        </div>

        <div>
          <div className="mx-auto mt-8 mb-12 max-w-2xl">
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/allan-performance-professional.jpg"
                alt="Allan Palmer performing violin in professional setting"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSongs.map((song, index) => (
              <div key={song.id} className="hover:-translate-y-1 transition-transform duration-200">
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

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="lg"
                          className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
                          onClick={() => togglePlayPause(song.id)}
                          disabled={isLoading === song.id}
                          aria-label={currentlyPlaying === song.id && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                        >
                          {isLoading === song.id ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                          ) : currentlyPlaying === song.id && isPlaying ? (
                            <Pause className="w-6 h-6 text-white" aria-hidden="true" />
                          ) : (
                            <Play className="w-6 h-6 text-white ml-1" aria-hidden="true" />
                          )}
                        </Button>
                      </div>

                      {currentlyPlaying === song.id && isPlaying && (
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
                          ) : currentlyPlaying === song.id && isPlaying ? (
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
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
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
        </div>
      </div>
    </section>
  )
}
