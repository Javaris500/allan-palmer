// Site-wide constants
export const SITE_CONFIG = {
  name: "Allan Palmer",
  title: "Allan Palmer | Professional Violinist in Winnipeg, Manitoba",
  description:
    "Professional violinist Allan Palmer provides elegant music for weddings, private events, and functions in Winnipeg, Manitoba. Also offering violin lessons for all skill levels.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://allanpalmer.com",
  ogImage: "/images/allan-palmer-og-image.jpg",
  creator: "Allan Palmer",
  keywords: [
    "Allan Palmer",
    "violinist Winnipeg",
    "wedding violinist Manitoba",
    "private event music",
    "violin lessons Winnipeg",
    "classical violinist",
    "professional musician",
    "Winnipeg wedding music",
    "violin teacher",
    "live music events",
  ],
} as const

export const CONTACT_INFO = {
  email: "palmerar@myumanitoba.ca",
  phone: "(204) 898-9699",
  location: "Winnipeg, Manitoba",
  socialMedia: {
    instagram: "https://www.instagram.com/allan_palms/",
    youtube: "https://www.youtube.com/@AllanPalmerViolinist",
    tiktok: "https://www.tiktok.com/@allan_palms/video/7537255525445045510",
    spotify: "https://open.spotify.com/artist/6dmJtjDHZaYhBB3o51mysR",
  },
} as const

export const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/repertoire", label: "Repertoire" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Book" },
] as const

export const SERVICE_CATEGORIES = {
  weddings: "Wedding Services",
  private: "Private Functions",
  lessons: "Violin Lessons",
} as const

// Mux Video Configuration
export const MUX_CONFIG = {
  playbackId: "ys502eHmaLlbsTQbT01czXBZUhDOOlt174ml93C02G2Ft00",
  title: "Allan Palmer Performance",
  // HLS streaming URL (adaptive bitrate with high quality preference)
  getHlsUrl: () =>
    `https://stream.mux.com/ys502eHmaLlbsTQbT01czXBZUhDOOlt174ml93C02G2Ft00.m3u8?min_resolution=1080p`,
  getThumbnailUrl: (width = 1280, height = 720, time = 8) =>
    `https://image.mux.com/ys502eHmaLlbsTQbT01czXBZUhDOOlt174ml93C02G2Ft00/thumbnail.png?width=${width}&height=${height}&time=${time}`,
  getAnimatedGif: (width = 640, fps = 10, start = 0, end = 5) =>
    `https://image.mux.com/ys502eHmaLlbsTQbT01czXBZUhDOOlt174ml93C02G2Ft00/animated.gif?width=${width}&fps=${fps}&start=${start}&end=${end}`,
} as const
