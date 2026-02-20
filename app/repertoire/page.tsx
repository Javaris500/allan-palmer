import { PageTransition } from "@/components/page-transition"
import dynamic from "next/dynamic"
import { Music } from "lucide-react"
import type { Metadata } from "next"

const SongCatalog = dynamic(
  () => import("@/components/song-catalog").then(mod => ({ default: mod.SongCatalog })),
  {
    ssr: true,
    loading: () => (
      <div className="animate-pulse space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    ),
  }
)

export const metadata: Metadata = {
  title: "Violin Repertoire | Allan Palmer's Complete Song Catalog",
  description:
    "Browse Allan Palmer's extensive violin repertoire featuring over 200 songs including classical, contemporary, jazz, and popular music. Perfect for weddings, events, and special occasions in Winnipeg.",
  keywords: [
    "violin repertoire",
    "wedding music songs",
    "classical violin music",
    "contemporary violin",
    "Allan Palmer songs",
    "violin music catalog",
    "wedding ceremony music",
  ],
  openGraph: {
    title: "Allan Palmer's Violin Repertoire | Complete Song Catalog",
    description:
      "Browse Allan Palmer's extensive violin repertoire featuring classical, contemporary, and popular music for your special event.",
    type: "website",
    locale: "en_CA",
  },
  alternates: {
    canonical: "/repertoire",
  },
}

export default function RepertoirePage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-12">
        {/* Header Section */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-gold mb-4">
                <Music className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">169 Songs</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Complete <span className="text-gold">Repertoire</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse Allan's extensive collection spanning classical masterpieces, contemporary hits, jazz standards, and beloved musical theater pieces.
              </p>
            </div>
          </div>
        </section>

        {/* Song Catalog */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="mx-auto max-w-4xl lg:max-w-5xl">
              <SongCatalog />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
