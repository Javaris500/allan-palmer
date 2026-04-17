"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useAudioStore } from "@/stores/audio-store";
import { useBackgroundMusic } from "@/contexts/background-music-context";
import { cn } from "@/lib/utils";

type Genre =
  | "all"
  | "recent"
  | "classical"
  | "wedding"
  | "jazz"
  | "latin"
  | "italian"
  | "film"
  | "sacred"
  | "pop";

type SongGenre = Exclude<Genre, "all" | "recent">;

interface Song {
  title: string;
  artist?: string;
  genres: SongGenre[];
  recentlyAdded?: boolean;
  audioId?: string;
  audioUrl?: string;
}

const GENRES: { id: Genre; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recent", label: "Recently Added" },
  { id: "classical", label: "Classical" },
  { id: "wedding", label: "Wedding" },
  { id: "jazz", label: "Jazz" },
  { id: "latin", label: "Latin" },
  { id: "italian", label: "Italian" },
  { id: "film", label: "Film & Show" },
  { id: "sacred", label: "Sacred" },
  { id: "pop", label: "Pop & Rock" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AUDIO_BASE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com";
const AUDIO_URLS = {
  rainbow: `${AUDIO_BASE}/Somewhere%20Over%20the%20Rainbow%20Mix%202-LkxgMx5yX3tj6LBGYGddBsd5DjS1Kw.mp3`,
  historia: `${AUDIO_BASE}/hdua%20master-E4v3tqBtfOoS5LTpV4b1Yggm4UT2jJ.mp3`,
  wonderful: `${AUDIO_BASE}/What%20a%20Wonderful%20World%20Master-JABmURSW0VZ53HYwZV3wGjLkjrgUcE.mp3`,
  bella: `${AUDIO_BASE}/7494-ec49-4177-b1d8-9f9050281eef-z3fhi0xnkvLcwbVHLJfejIs5W8Ki9t.mp3`,
  fly: `${AUDIO_BASE}/bd9e-0e62-408f-9954-d7de2da8f574-QJ0QV5BvfAdP40Lf4qkmkOPOJQ2DKe.mp3`,
  elvis: `${AUDIO_BASE}/Cant%20Help%20Falling%20in%20Love-gdzO839wZruU5nHq2wwSwsabROGJhT.mp3`,
};

const allSongs: Song[] = [
  {
    title: "Air - Bach",
    artist: "Johann Sebastian Bach",
    genres: ["classical", "wedding"],
  },
  {
    title: "All I Ask of You",
    artist: "Phantom of the Opera",
    genres: ["film"],
  },
  { title: "All of Me", artist: "John Legend", genres: ["pop", "wedding"] },
  {
    title: "All of the Lights Interlude",
    artist: "Kanye West",
    genres: ["pop"],
  },
  { title: "Always on My Mind", artist: "Willie Nelson", genres: ["pop"] },
  {
    title: "Are You Lonesome Tonight",
    artist: "Elvis Presley",
    genres: ["pop"],
  },
  { title: "As it Was", artist: "Harry Styles", genres: ["pop"] },
  { title: "At Last", artist: "Etta James", genres: ["jazz", "wedding"] },
  {
    title: "Ave Maria",
    artist: "Franz Schubert",
    genres: ["classical", "sacred", "wedding"],
  },
  {
    title: "Averdici Roma",
    artist: "Traditional Italian",
    genres: ["italian"],
  },
  {
    title: "A Thousand Years",
    artist: "Christina Perri",
    genres: ["pop", "wedding"],
  },
  {
    title: "Bella Ciao",
    artist: "Traditional Italian",
    genres: ["italian"],
    audioId: "bella-ciao",
    audioUrl: AUDIO_URLS.bella,
  },
  { title: "Besame Mucho", artist: "Consuelo Velázquez", genres: ["latin"] },
  { title: "Beth", artist: "Kiss", genres: ["pop"] },
  { title: "Blinding Lights", artist: "The Weeknd", genres: ["pop"] },
  {
    title: "Bless the Broken Road",
    artist: "Rascal Flatts",
    genres: ["pop", "wedding"],
  },
  { title: "Bohemian Rhapsody", artist: "Queen", genres: ["pop"] },
  {
    title: "Bridge Over Troubled Water",
    artist: "Simon & Garfunkel",
    genres: ["pop"],
  },
  {
    title: "Canon in D",
    artist: "Johann Pachelbel",
    genres: ["classical", "wedding"],
  },
  {
    title: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    genres: ["pop", "wedding"],
    audioId: "cant-help-falling-in-love",
    audioUrl: AUDIO_URLS.elvis,
  },
  {
    title: "Can't Take my Eyes off You",
    artist: "Frankie Valli",
    genres: ["pop", "wedding"],
  },
  { title: "Careless Whisper", artist: "George Michael", genres: ["pop"] },
  { title: "Caruso", artist: "Lucio Dalla", genres: ["italian", "classical"] },
  {
    title: "City of Stars (La La Land)",
    artist: "La La Land OST",
    genres: ["film"],
  },
  { title: "Circles", artist: "Post Malone", genres: ["pop"] },
  {
    title: "Cold Water",
    artist: "Major Lazer ft. Justin Bieber",
    genres: ["pop"],
  },
  { title: "Come as you Are", artist: "Nirvana", genres: ["pop"] },
  {
    title: "Come Back to Sorrento",
    artist: "Traditional Italian",
    genres: ["italian"],
  },
  { title: "Crying", artist: "Roy Orbison", genres: ["pop"] },
  { title: "Dancing Queen", artist: "ABBA", genres: ["pop"] },
  { title: "Despacito", artist: "Luis Fonsi", genres: ["latin", "pop"] },
  { title: "Die in Your Arms", artist: "Justin Bieber", genres: ["pop"] },
  {
    title: "Die With a Smile",
    artist: "Lady Gaga & Bruno Mars",
    genres: ["pop"],
  },
  { title: "Don't Start Now", artist: "Dua Lipa", genres: ["pop"] },
  { title: "Don't Stop Me Now", artist: "Queen", genres: ["pop"] },
  { title: "Don't stop believing", artist: "Journey", genres: ["pop"] },
  { title: "Dream On", artist: "Aerosmith", genres: ["pop"] },
  {
    title: "Drunken Sailor",
    artist: "Traditional Sea Shanty",
    genres: ["pop"],
  },
  {
    title: "Endless Love",
    artist: "Diana Ross & Lionel Richie",
    genres: ["pop", "wedding"],
  },
  {
    title: "Every Breath You Take",
    artist: "The Police",
    genres: ["pop", "wedding"],
  },
  { title: "Eye of the Tiger", artist: "Survivor", genres: ["pop"] },
  { title: "Flowers", artist: "Miley Cyrus", genres: ["pop"] },
  {
    title: "Fly Me to the Moon",
    artist: "Frank Sinatra",
    genres: ["jazz", "wedding"],
    audioId: "fly-me-to-the-moon",
    audioUrl: AUDIO_URLS.fly,
  },
  { title: "Gimme Gimme Gimme", artist: "ABBA", genres: ["pop"] },
  { title: "Golden Hour", artist: "Kacey Musgraves", genres: ["pop"] },
  { title: "Goodness of God", artist: "Jenn Johnson", genres: ["sacred"] },
  { title: "Hallelujah", artist: "Leonard Cohen", genres: ["sacred", "pop"] },
  { title: "Hard to Say I'm Sorry", artist: "Chicago", genres: ["pop"] },
  { title: "Havana", artist: "Camila Cabello", genres: ["latin", "pop"] },
  { title: "Hava Nagila", artist: "Traditional Hebrew", genres: ["classical"] },
  { title: "Heart Shaped Box", artist: "Nirvana", genres: ["pop"] },
  { title: "Hey Jude", artist: "The Beatles", genres: ["pop"] },
  {
    title: "Historia De un Amor",
    artist: "Carlos Eleta Almarán",
    genres: ["latin"],
    audioId: "historia-de-un-amor",
    audioUrl: AUDIO_URLS.historia,
  },
  { title: "Holy Forever", artist: "Chris Tomlin", genres: ["sacred"] },
  {
    title: "How Great Thou Art",
    artist: "Traditional Hymn",
    genres: ["sacred"],
  },
  {
    title: "I Don't Wanna Miss a Thing",
    artist: "Aerosmith",
    genres: ["pop", "wedding"],
  },
  {
    title: "I Feel it Coming",
    artist: "The Weeknd ft. Daft Punk",
    genres: ["pop"],
  },
  { title: "I Have a Dream", artist: "ABBA", genres: ["pop"] },
  { title: "If I Can Dream", artist: "Elvis Presley", genres: ["pop"] },
  {
    title: "I left my Heart in San Francisco",
    artist: "Tony Bennett",
    genres: ["jazz"],
  },
  {
    title: "I Loved Her First",
    artist: "Heartland",
    genres: ["pop", "wedding"],
  },
  { title: "Imagine", artist: "John Lennon", genres: ["pop"] },
  {
    title: "Irish Washerwoman",
    artist: "Traditional Irish",
    genres: ["classical"],
  },
  { title: "I Was Made For Lovin You", artist: "Kiss", genres: ["pop"] },
  {
    title: "Just the Two of Us",
    artist: "Bill Withers",
    genres: ["pop", "jazz"],
  },
  { title: "Kiss the Rain", artist: "Yiruma", genres: ["classical"] },
  { title: "La Bamba", artist: "Ritchie Valens", genres: ["latin"] },
  { title: "La Isla Bonita", artist: "Madonna", genres: ["latin", "pop"] },
  {
    title: "La La Land Main Theme",
    artist: "La La Land OST",
    genres: ["film"],
  },
  { title: "Lambada", artist: "Kaoma", genres: ["latin"] },
  {
    title: "La Paloma",
    artist: "Traditional Spanish",
    genres: ["latin", "classical"],
  },
  { title: "La Vie En Rose", artist: "Édith Piaf", genres: ["jazz", "film"] },
  { title: "Let It Be Me", artist: "The Everly Brothers", genres: ["pop"] },
  { title: "Let Me Love You", artist: "Mario", genres: ["pop"] },
  {
    title: "Let's Get Loud",
    artist: "Jennifer Lopez",
    genres: ["latin", "pop"],
  },
  {
    title: "Livin La Vida Loca",
    artist: "Ricky Martin",
    genres: ["latin", "pop"],
  },
  { title: "Living on a Prayer", artist: "Bon Jovi", genres: ["pop"] },
  { title: "Love in Portofino", artist: "Andrea Bocelli", genres: ["italian"] },
  {
    title: "Love Me Tender",
    artist: "Elvis Presley",
    genres: ["pop", "wedding"],
  },
  {
    title: "Love Never Felt So Good",
    artist: "Michael Jackson",
    genres: ["pop"],
  },
  { title: "Love of My Life", artist: "Queen", genres: ["pop", "wedding"] },
  { title: "Love Story", artist: "Taylor Swift", genres: ["pop", "wedding"] },
  { title: "Mama Mia", artist: "ABBA", genres: ["pop"] },
  {
    title: "Meditation de Thais",
    artist: "Jules Massenet",
    genres: ["classical", "wedding"],
  },
  { title: "Memory", artist: "Cats", genres: ["film"] },
  {
    title: "Minuets by Bach",
    artist: "Johann Sebastian Bach",
    genres: ["classical"],
  },
  { title: "Moon River", artist: "Henry Mancini", genres: ["jazz", "film"] },
  {
    title: "Music of the Night",
    artist: "Phantom of the Opera",
    genres: ["film"],
  },
  { title: "My Funny Valentine", artist: "Richard Rodgers", genres: ["jazz"] },
  {
    title: "My Heart Will Go On",
    artist: "Celine Dion",
    genres: ["film", "wedding"],
  },
  { title: "My Way", artist: "Frank Sinatra", genres: ["jazz"] },
  {
    title: "Nessun Dorma",
    artist: "Giacomo Puccini",
    genres: ["classical", "italian"],
  },
  { title: "Obsession", artist: "Aventura", genres: ["latin"] },
  { title: "O Canada", artist: "National Anthem", genres: ["classical"] },
  {
    title: "O Mio Babino Caro",
    artist: "Giacomo Puccini",
    genres: ["classical", "italian"],
  },
  { title: "Open Arms", artist: "Journey", genres: ["pop"] },
  {
    title: "O Sole Mio",
    artist: "Traditional Neapolitan",
    genres: ["italian", "classical"],
  },
  {
    title: "Over the Rainbow",
    artist: "Judy Garland",
    genres: ["jazz", "film"],
    audioId: "somewhere-over-the-rainbow",
    audioUrl: AUDIO_URLS.rainbow,
  },
  { title: "Paint it Black", artist: "The Rolling Stones", genres: ["pop"] },
  { title: "Perfect", artist: "Ed Sheeran", genres: ["pop", "wedding"] },
  {
    title: "Pirates of the Caribbean",
    artist: "Hans Zimmer",
    genres: ["film"],
  },
  {
    title: "Put Your Head on My Shoulder",
    artist: "Paul Anka",
    genres: ["pop", "wedding"],
  },
  {
    title: "Quizas Quizas Quizas",
    artist: "Osvaldo Farrés",
    genres: ["latin"],
  },
  { title: "Rasputin", artist: "Boney M", genres: ["pop"] },
  { title: "River Flows in You", artist: "Yiruma", genres: ["classical"] },
  { title: "Rolling in the Deep", artist: "Adele", genres: ["pop"] },
  {
    title: "Santa Lucia",
    artist: "Traditional Neapolitan",
    genres: ["italian"],
  },
  {
    title: "Sara Perche Ti Amo",
    artist: "Ricchi e Poveri",
    genres: ["italian", "pop"],
  },
  { title: "Save Your Tears", artist: "The Weeknd", genres: ["pop"] },
  {
    title: "Senorita",
    artist: "Shawn Mendes & Camila Cabello",
    genres: ["latin", "pop"],
  },
  {
    title: "Serenade - Schubert",
    artist: "Franz Schubert",
    genres: ["classical", "wedding"],
  },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genres: ["pop"] },
  { title: "Someone Like You", artist: "Adele", genres: ["pop"] },
  { title: "Someone You Loved", artist: "Lewis Capaldi", genres: ["pop"] },
  {
    title: "Song to the Moon",
    artist: "Antonín Dvořák",
    genres: ["classical"],
  },
  { title: "Super Trouper", artist: "ABBA", genres: ["pop"] },
  {
    title: "Swan Lake",
    artist: "Pyotr Ilyich Tchaikovsky",
    genres: ["classical"],
  },
  { title: "Sway", artist: "Dean Martin", genres: ["jazz", "latin"] },
  { title: "Sweet Caroline", artist: "Neil Diamond", genres: ["pop"] },
  { title: "Talking to the Moon", artist: "Bruno Mars", genres: ["pop"] },
  { title: "Teenage Dream", artist: "Katy Perry", genres: ["pop"] },
  { title: "Tennessee Whiskey", artist: "Chris Stapleton", genres: ["pop"] },
  { title: "That's Amore", artist: "Dean Martin", genres: ["italian", "jazz"] },
  {
    title: "The Godfather Theme",
    artist: "Nino Rota",
    genres: ["film", "italian"],
  },
  { title: "The Lonely Shepard", artist: "James Last", genres: ["classical"] },
  {
    title: "The Swan",
    artist: "Camille Saint-Saëns",
    genres: ["classical", "wedding"],
  },
  { title: "The Way We Were", artist: "Barbra Streisand", genres: ["jazz"] },
  { title: "The Wonder of You", artist: "Elvis Presley", genres: ["pop"] },
  {
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    genres: ["pop", "wedding"],
  },
  {
    title: "This Will Be an Everlasting Love",
    artist: "Natalie Cole",
    genres: ["pop", "wedding"],
  },
  {
    title: "Time to Say Goodbye",
    artist: "Andrea Bocelli",
    genres: ["classical", "italian"],
  },
  { title: "Titanium", artist: "David Guetta ft. Sia", genres: ["pop"] },
  {
    title: "Turning Page",
    artist: "Sleeping at Last",
    genres: ["pop", "wedding"],
  },
  {
    title: "Unchained Melody",
    artist: "The Righteous Brothers",
    genres: ["pop", "wedding"],
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    genres: ["pop", "wedding"],
  },
  { title: "Uptown Girl", artist: "Billy Joel", genres: ["pop"] },
  { title: "Versace on the Floor", artist: "Bruno Mars", genres: ["pop"] },
  { title: "Viva La Vida", artist: "Coldplay", genres: ["pop"] },
  { title: "Vocalise", artist: "Sergei Rachmaninoff", genres: ["classical"] },
  { title: "Volare", artist: "Dean Martin", genres: ["italian", "jazz"] },
  { title: "Wake Me Up", artist: "Avicii", genres: ["pop"] },
  {
    title: "Waltz No. 2 by Shostakovich",
    artist: "Dmitri Shostakovich",
    genres: ["classical"],
  },
  { title: "We Are the Champions", artist: "Queen", genres: ["pop"] },
  {
    title: "What a Wonderful World",
    artist: "Louis Armstrong",
    genres: ["jazz", "wedding"],
    audioId: "what-a-wonderful-world",
    audioUrl: AUDIO_URLS.wonderful,
  },
  { title: "Wildest Dreams", artist: "Taylor Swift", genres: ["pop"] },
  { title: "Yesterday", artist: "The Beatles", genres: ["pop"] },
  {
    title: "You Are The Reason",
    artist: "Calum Scott",
    genres: ["pop", "wedding"],
  },
  {
    title: "You Raise me Up",
    artist: "Josh Groban",
    genres: ["pop", "sacred", "wedding"],
  },

  // ──────────────────────────────────────────────
  // Recently Added (2026-04)
  // ──────────────────────────────────────────────
  {
    title: "Beauty and a Beat",
    artist: "Justin Bieber ft. Nicki Minaj",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Country Roads",
    artist: "John Denver",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Everybody Wants to Rule the World",
    artist: "Tears for Fears",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Heaven",
    artist: "Bryan Adams",
    genres: ["pop", "wedding"],
    recentlyAdded: true,
  },
  {
    title: "Highway to Hell",
    artist: "AC/DC",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Holding Out for a Hero",
    artist: "Bonnie Tyler",
    genres: ["pop", "film"],
    recentlyAdded: true,
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "I'm Good (Blue)",
    artist: "David Guetta & Bebe Rexha",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "I Wanna Dance with Somebody",
    artist: "Whitney Houston",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "I Will Survive",
    artist: "Gloria Gaynor",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "It's Not Unusual",
    artist: "Tom Jones",
    genres: ["jazz", "pop"],
    recentlyAdded: true,
  },
  {
    title: "It Will Rain",
    artist: "Bruno Mars",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Jessie's Girl",
    artist: "Rick Springfield",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Jump",
    artist: "Van Halen",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Last Friday Night",
    artist: "Katy Perry",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Lucky Star",
    artist: "Madonna",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Moth to a Flame",
    artist: "Swedish House Mafia & The Weeknd",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Over the Mountain",
    artist: "Ozzy Osbourne",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Quando Quando Quando",
    artist: "Tony Renis",
    genres: ["italian", "jazz"],
    recentlyAdded: true,
  },
  {
    title: "September",
    artist: "Earth, Wind & Fire",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Shake It Off",
    artist: "Taylor Swift",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "She's a Lady",
    artist: "Tom Jones",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Smooth Criminal",
    artist: "Michael Jackson",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Start Me Up",
    artist: "The Rolling Stones",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Summer Nights",
    artist: "Grease",
    genres: ["film", "pop"],
    recentlyAdded: true,
  },
  {
    title: "Take on Me",
    artist: "a-ha",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Tarantella",
    artist: "Traditional Italian",
    genres: ["italian", "classical"],
    recentlyAdded: true,
  },
  {
    title: "The Final Countdown",
    artist: "Europe",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Ti Amo",
    artist: "Umberto Tozzi",
    genres: ["italian", "pop"],
    recentlyAdded: true,
  },
  {
    title: "Where Have You Been",
    artist: "Rihanna",
    genres: ["pop"],
    recentlyAdded: true,
  },
  {
    title: "Where You Are",
    artist: "Moana",
    genres: ["film"],
    recentlyAdded: true,
  },
  {
    title: "YMCA",
    artist: "Village People",
    genres: ["pop"],
    recentlyAdded: true,
  },
];

export function SongCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<Genre>("all");

  const { muteForOtherAudio, unmuteAfterOtherAudio } = useBackgroundMusic();
  const { currentlyPlaying, isPlaying, playAudio, pauseAudio } =
    useAudioStore();

  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allSongs.filter((song) => {
      let matchesGenre: boolean;
      if (activeGenre === "all") {
        matchesGenre = true;
      } else if (activeGenre === "recent") {
        matchesGenre = song.recentlyAdded === true;
      } else {
        matchesGenre = song.genres.includes(activeGenre);
      }
      if (!matchesGenre) return false;
      if (!q) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        (song.artist && song.artist.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeGenre]);

  const groupedSongs = useMemo(() => {
    const groups: Record<string, Song[]> = {};
    filteredSongs.forEach((song) => {
      const letter = (song.title[0] ?? "#").toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, songs: groups[letter]! }));
  }, [filteredSongs]);

  const availableLetters = useMemo(
    () => new Set(groupedSongs.map((g) => g.letter)),
    [groupedSongs],
  );

  const togglePlayPause = async (song: Song) => {
    if (!song.audioId || !song.audioUrl) return;
    if (currentlyPlaying === song.audioId && isPlaying) {
      pauseAudio();
      unmuteAfterOtherAudio();
      return;
    }
    muteForOtherAudio();
    try {
      await playAudio(song.audioId, song.audioUrl);
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasFilter = searchQuery.trim().length > 0 || activeGenre !== "all";

  return (
    <div className="relative">
      {/* A-Z Rail — desktop only */}
      <nav
        aria-label="Jump to letter"
        className="hidden lg:flex fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-[3px]"
      >
        {ALPHABET.map((letter) => {
          const active = availableLetters.has(letter);
          return (
            <button
              key={letter}
              type="button"
              onClick={() => active && scrollToLetter(letter)}
              disabled={!active}
              aria-label={`Jump to ${letter}`}
              className={cn(
                "w-5 h-5 flex items-center justify-center text-[10px] tracking-widest font-serif transition-colors duration-200",
                active
                  ? "text-muted-foreground/60 hover:text-gold cursor-pointer"
                  : "text-foreground/10 cursor-default",
              )}
            >
              {letter}
            </button>
          );
        })}
      </nav>

      {/* Sticky filter + search */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pt-6 pb-4 -mx-4 px-4 border-b border-border/30">
        {/* Genre filter */}
        <div
          role="tablist"
          aria-label="Filter by genre"
          className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              role="tab"
              aria-selected={activeGenre === genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={cn(
                "shrink-0 text-[11px] tracking-[0.18em] uppercase px-3 py-2 font-medium transition-all duration-300 border-b-[1.5px] whitespace-nowrap",
                activeGenre === genre.id
                  ? "text-gold border-gold"
                  : "text-muted-foreground/60 border-transparent hover:text-foreground hover:border-border",
              )}
            >
              {genre.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <input
            type="search"
            placeholder="Search the programme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search songs or artists"
            className="w-full bg-transparent border-0 border-b border-border/40 focus:border-gold rounded-none px-0 py-2.5 text-sm font-serif italic placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 transition-colors duration-300"
          />
        </div>

        {/* Conditional count */}
        {hasFilter && (
          <p className="mt-2 text-[11px] font-serif italic text-muted-foreground/60">
            {filteredSongs.length === 0
              ? "No pieces match your selection."
              : `${filteredSongs.length} ${filteredSongs.length === 1 ? "piece" : "pieces"} match your selection.`}
          </p>
        )}
      </div>

      {/* Programme list */}
      {groupedSongs.length > 0 ? (
        <div className="relative pt-10">
          {groupedSongs.map(({ letter, songs }, idx) => (
            <motion.section
              key={letter}
              id={`letter-${letter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: Math.min(idx * 0.03, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative scroll-mt-[180px] md:scroll-mt-[160px] mb-16 md:mb-20"
            >
              {/* Ghost letterform */}
              <div
                aria-hidden="true"
                className="font-serif text-[7rem] md:text-[10rem] leading-[0.85] font-light text-gold/[0.09] select-none pointer-events-none -ml-1 md:-ml-2"
              >
                {letter}
              </div>

              {/* Programme rows */}
              <ul className="relative -mt-6 md:-mt-10 divide-y divide-border/25">
                {songs.map((song) => {
                  const isCurrentAndPlaying =
                    song.audioId != null &&
                    currentlyPlaying === song.audioId &&
                    isPlaying;
                  return (
                    <li
                      key={song.title}
                      className="group flex items-baseline gap-4 py-3 md:py-3.5 transition-colors duration-300"
                    >
                      {/* Play button slot — gold triangle where audio exists, otherwise empty */}
                      <div className="shrink-0 w-4 flex items-center justify-center">
                        {song.audioUrl ? (
                          <button
                            type="button"
                            onClick={() => togglePlayPause(song)}
                            aria-label={
                              isCurrentAndPlaying
                                ? `Pause ${song.title}`
                                : `Play a sample of ${song.title}`
                            }
                            className={cn(
                              "text-gold transition-opacity duration-300",
                              isCurrentAndPlaying
                                ? "opacity-100"
                                : "opacity-50 group-hover:opacity-100 hover:opacity-100",
                            )}
                          >
                            {isCurrentAndPlaying ? (
                              <Pause className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Play className="h-3 w-3" aria-hidden="true" />
                            )}
                          </button>
                        ) : null}
                      </div>

                      {/* Title */}
                      <span
                        className={cn(
                          "font-serif text-[15px] md:text-base leading-snug min-w-0 flex-1 transition-colors duration-300 inline-flex items-baseline gap-2 flex-wrap",
                          isCurrentAndPlaying
                            ? "text-gold"
                            : "text-foreground/90 group-hover:text-gold",
                        )}
                      >
                        <span className="min-w-0">{song.title}</span>
                        {song.recentlyAdded && (
                          <span
                            className="shrink-0 text-[9px] tracking-[0.18em] uppercase font-medium text-gold/90 border border-gold/40 bg-gold/5 px-1.5 py-[1px] rounded-sm"
                            aria-label="Recently added"
                          >
                            New
                          </span>
                        )}
                      </span>

                      {/* Composer/artist */}
                      {song.artist && (
                        <span className="font-serif italic text-xs md:text-sm text-muted-foreground/60 text-right shrink-0 max-w-[40%] md:max-w-[50%] truncate">
                          {song.artist}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif italic text-xl text-muted-foreground/50 mb-3">
            No pieces match your selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveGenre("all");
            }}
            className="text-[11px] tracking-[0.2em] uppercase text-gold hover:text-gold/80 transition-colors border-b border-gold/40 hover:border-gold pb-0.5"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
