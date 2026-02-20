"use client"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface Song {
  title: string
  artist?: string
}

export function SongCatalog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("all")

  // Complete song list - alphabetically sorted
  const allSongs: Song[] = [
    { title: "Air - Bach", artist: "Johann Sebastian Bach" },
    { title: "All I Ask of You", artist: "Phantom of the Opera" },
    { title: "All of Me", artist: "John Legend" },
    { title: "All of the Lights Interlude", artist: "Kanye West" },
    { title: "Always on My Mind", artist: "Willie Nelson" },
    { title: "Are You Lonesome Tonight", artist: "Elvis Presley" },
    { title: "As it Was", artist: "Harry Styles" },
    { title: "At Last", artist: "Etta James" },
    { title: "Ave Maria", artist: "Franz Schubert" },
    { title: "Averdici Roma", artist: "Traditional Italian" },
    { title: "A Thousand Years", artist: "Christina Perri" },
    { title: "Bella Ciao", artist: "Traditional Italian" },
    { title: "Besame Mucho", artist: "Consuelo Velázquez" },
    { title: "Beth", artist: "Kiss" },
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Bless the Broken Road", artist: "Rascal Flatts" },
    { title: "Bohemian Rhapsody", artist: "Queen" },
    { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" },
    { title: "Canon in D", artist: "Johann Pachelbel" },
    { title: "Can't Help Falling in Love", artist: "Elvis Presley" },
    { title: "Can't Take my Eyes off You", artist: "Frankie Valli" },
    { title: "Careless Whisper", artist: "George Michael" },
    { title: "Caruso", artist: "Lucio Dalla" },
    { title: "City of Stars (La La Land)", artist: "La La Land OST" },
    { title: "Circles", artist: "Post Malone" },
    { title: "Cold Water", artist: "Major Lazer ft. Justin Bieber" },
    { title: "Come as you Are", artist: "Nirvana" },
    { title: "Come Back to Sorrento", artist: "Traditional Italian" },
    { title: "Crying", artist: "Roy Orbison" },
    { title: "Dancing Queen", artist: "ABBA" },
    { title: "Despacito", artist: "Luis Fonsi" },
    { title: "Die in Your Arms", artist: "Justin Bieber" },
    { title: "Die With a Smile", artist: "Lady Gaga & Bruno Mars" },
    { title: "Don't Start Now", artist: "Dua Lipa" },
    { title: "Don't Stop Me Now", artist: "Queen" },
    { title: "Don't stop believing", artist: "Journey" },
    { title: "Dream On", artist: "Aerosmith" },
    { title: "Drunken Sailor", artist: "Traditional Sea Shanty" },
    { title: "Endless Love", artist: "Diana Ross & Lionel Richie" },
    { title: "Every Breath You Take", artist: "The Police" },
    { title: "Eye of the Tiger", artist: "Survivor" },
    { title: "Flowers", artist: "Miley Cyrus" },
    { title: "Fly Me to the Moon", artist: "Frank Sinatra" },
    { title: "Gimme Gimme Gimme", artist: "ABBA" },
    { title: "Golden Hour", artist: "Kacey Musgraves" },
    { title: "Goodness of God", artist: "Jenn Johnson" },
    { title: "Hallelujah", artist: "Leonard Cohen" },
    { title: "Hard to Say I'm Sorry", artist: "Chicago" },
    { title: "Havana", artist: "Camila Cabello" },
    { title: "Hava Nagila", artist: "Traditional Hebrew" },
    { title: "Heart Shaped Box", artist: "Nirvana" },
    { title: "Hey Jude", artist: "The Beatles" },
    { title: "Historia De un Amor", artist: "Carlos Eleta Almarán" },
    { title: "Holy Forever", artist: "Chris Tomlin" },
    { title: "How Great Thou Art", artist: "Traditional Hymn" },
    { title: "I Don't Wanna Miss a Thing", artist: "Aerosmith" },
    { title: "I Feel it Coming", artist: "The Weeknd ft. Daft Punk" },
    { title: "I Have a Dream", artist: "ABBA" },
    { title: "If I Can Dream", artist: "Elvis Presley" },
    { title: "I left my Heart in San Francisco", artist: "Tony Bennett" },
    { title: "I Loved Her First", artist: "Heartland" },
    { title: "Imagine", artist: "John Lennon" },
    { title: "Irish Washerwoman", artist: "Traditional Irish" },
    { title: "I Was Made For Lovin You", artist: "Kiss" },
    { title: "Just the Two of Us", artist: "Bill Withers" },
    { title: "Kiss the Rain", artist: "Yiruma" },
    { title: "La Bamba", artist: "Ritchie Valens" },
    { title: "La Isla Bonita", artist: "Madonna" },
    { title: "La La Land Main Theme", artist: "La La Land OST" },
    { title: "Lambada", artist: "Kaoma" },
    { title: "La Paloma", artist: "Traditional Spanish" },
    { title: "La Vie En Rose", artist: "Édith Piaf" },
    { title: "Let It Be Me", artist: "The Everly Brothers" },
    { title: "Let Me Love You", artist: "Mario" },
    { title: "Let's Get Loud", artist: "Jennifer Lopez" },
    { title: "Livin La Vida Loca", artist: "Ricky Martin" },
    { title: "Living on a Prayer", artist: "Bon Jovi" },
    { title: "Love in Portofino", artist: "Andrea Bocelli" },
    { title: "Love Me Tender", artist: "Elvis Presley" },
    { title: "Love Never Felt So Good", artist: "Michael Jackson" },
    { title: "Love of My Life", artist: "Queen" },
    { title: "Love Story", artist: "Taylor Swift" },
    { title: "Mama Mia", artist: "ABBA" },
    { title: "Meditation de Thais", artist: "Jules Massenet" },
    { title: "Memory", artist: "Cats" },
    { title: "Minuets by Bach", artist: "Johann Sebastian Bach" },
    { title: "Moon River", artist: "Henry Mancini" },
    { title: "Music of the Night", artist: "Phantom of the Opera" },
    { title: "My Funny Valentine", artist: "Richard Rodgers" },
    { title: "My Heart Will Go On", artist: "Celine Dion" },
    { title: "My Way", artist: "Frank Sinatra" },
    { title: "Nessun Dorma", artist: "Giacomo Puccini" },
    { title: "Obsession", artist: "Aventura" },
    { title: "O Canada", artist: "National Anthem" },
    { title: "O Mio Babino Caro", artist: "Giacomo Puccini" },
    { title: "Open Arms", artist: "Journey" },
    { title: "O Sole Mio", artist: "Traditional Neapolitan" },
    { title: "Over the Rainbow", artist: "Judy Garland" },
    { title: "Paint it Black", artist: "The Rolling Stones" },
    { title: "Perfect", artist: "Ed Sheeran" },
    { title: "Pirates of the Caribbean", artist: "Hans Zimmer" },
    { title: "Put Your Head on My Shoulder", artist: "Paul Anka" },
    { title: "Quizas Quizas Quizas", artist: "Osvaldo Farrés" },
    { title: "Rasputin", artist: "Boney M" },
    { title: "River Flows in You", artist: "Yiruma" },
    { title: "Rolling in the Deep", artist: "Adele" },
    { title: "Santa Lucia", artist: "Traditional Neapolitan" },
    { title: "Sara Perche Ti Amo", artist: "Ricchi e Poveri" },
    { title: "Save Your Tears", artist: "The Weeknd" },
    { title: "Senorita", artist: "Shawn Mendes & Camila Cabello" },
    { title: "Serenade - Schubert", artist: "Franz Schubert" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana" },
    { title: "Someone Like You", artist: "Adele" },
    { title: "Someone You Loved", artist: "Lewis Capaldi" },
    { title: "Song to the Moon", artist: "Antonín Dvořák" },
    { title: "Super Trouper", artist: "ABBA" },
    { title: "Swan Lake", artist: "Pyotr Ilyich Tchaikovsky" },
    { title: "Sway", artist: "Dean Martin" },
    { title: "Sweet Caroline", artist: "Neil Diamond" },
    { title: "Talking to the Moon", artist: "Bruno Mars" },
    { title: "Teenage Dream", artist: "Katy Perry" },
    { title: "Tennessee Whiskey", artist: "Chris Stapleton" },
    { title: "That's Amore", artist: "Dean Martin" },
    { title: "The Godfather Theme", artist: "Nino Rota" },
    { title: "The Lonely Shepard", artist: "James Last" },
    { title: "The Swan", artist: "Camille Saint-Saëns" },
    { title: "The Way We Were", artist: "Barbra Streisand" },
    { title: "The Wonder of You", artist: "Elvis Presley" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran" },
    { title: "This Will Be an Everlasting Love", artist: "Natalie Cole" },
    { title: "Time to Say Goodbye", artist: "Andrea Bocelli" },
    { title: "Titanium", artist: "David Guetta ft. Sia" },
    { title: "Turning Page", artist: "Sleeping at Last" },
    { title: "Unchained Melody", artist: "The Righteous Brothers" },
    { title: "Until I Found You", artist: "Stephen Sanchez" },
    { title: "Uptown Girl", artist: "Billy Joel" },
    { title: "Versace on the Floor", artist: "Bruno Mars" },
    { title: "Viva La Vida", artist: "Coldplay" },
    { title: "Vocalise", artist: "Sergei Rachmaninoff" },
    { title: "Volare", artist: "Dean Martin" },
    { title: "Wake Me Up", artist: "Avicii" },
    { title: "Waltz No. 2 by Shostakovich", artist: "Dmitri Shostakovich" },
    { title: "We Are the Champions", artist: "Queen" },
    { title: "What a Wonderful World", artist: "Louis Armstrong" },
    { title: "Wildest Dreams", artist: "Taylor Swift" },
    { title: "Yesterday", artist: "The Beatles" },
    { title: "You Are The Reason", artist: "Calum Scott" },
    { title: "You Raise me Up", artist: "Josh Groban" },
  ]

  // Filter songs based on search
  const filteredSongs = useMemo(() => {
    return allSongs.filter((song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [searchQuery, allSongs])

  // Group songs alphabetically
  const groupedSongs = useMemo(() => {
    const groups: { [key: string]: Song[] } = {}

    filteredSongs.forEach((song) => {
      const firstLetter = (song.title[0] ?? "#").toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(song)
    })

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        letter,
        songs: groups[letter]!,
      }))
  }, [filteredSongs])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-background dark:bg-black pb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
          <Input
            type="text"
            placeholder="Search songs or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-background dark:bg-black border-2 border-gold/20 focus:border-gold transition-colors"
          />
        </div>

        {/* Song count */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-gold">{filteredSongs.length}</span> of{" "}
            <span className="font-semibold text-gold">{allSongs.length}</span> songs
          </p>
        </div>
      </div>

      {/* Alphabetically Grouped Songs */}
      {groupedSongs.length > 0 ? (
        <div className="space-y-8">
          {groupedSongs.map(({ letter, songs }) => (
            <motion.div
              key={letter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Letter Header */}
              <div className="sticky top-28 z-10 bg-background dark:bg-black pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border-2 border-gold/30">
                    <span className="text-2xl font-bold text-gold">{letter}</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-gold/20" />
                </div>
              </div>

              {/* Songs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {songs.map((song, index) => (
                  <motion.div
                    key={`${song.title}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Card className="group hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all bg-background dark:bg-black border-gold/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                              <Music className="w-4 h-4 text-gold" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-gold transition-colors">
                              {song.title}
                            </h3>
                            {song.artist && (
                              <p className="text-xs text-muted-foreground truncate">
                                {song.artist}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Music className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">No songs found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
