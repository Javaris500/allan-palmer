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
    facebook: "#", // Replace with actual URL
    tiktok: "https://www.tiktok.com/@allan_palms/video/7537255525445045510",
    spotify: "https://open.spotify.com/artist/6dmJtjDHZaYhBB3o51mysR",
  },
} as const

export const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/repertoire", label: "Repertoire" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const

export const SERVICE_CATEGORIES = {
  weddings: "Wedding Services",
  private: "Private Functions",
  lessons: "Violin Lessons",
} as const
