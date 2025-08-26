import { PageTransition } from "@/components/page-transition"
import { SongCatalog } from "@/components/song-catalog"
import type { Metadata } from "next"

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
      <div className="container py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-4xl lg:max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Complete Repertoire
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Browse Allan's extensive collection of songs available for your special event. From classical pieces to
              contemporary hits, find the perfect music for your occasion.
            </p>
          </div>
          <SongCatalog />
        </div>
      </div>
    </PageTransition>
  )
}
