import { PageTransition } from "@/components/page-transition";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Metadata } from "next";

const SongCatalog = dynamic(
  () =>
    import("@/components/song-catalog").then((mod) => ({
      default: mod.SongCatalog,
    })),
  {
    ssr: true,
    loading: () => (
      <div className="animate-pulse space-y-3 pt-10">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-8 bg-muted/40 rounded-sm" />
        ))}
      </div>
    ),
  },
);

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
};

export default function RepertoirePage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Cinematic header */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
          {/* Background image — desaturated, low opacity */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="/allan-performance-professional.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center grayscale opacity-[0.18]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              {/* Eyebrow — thin rules flanking small-caps label */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 md:w-16 bg-gold/50" />
                <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-gold/80 font-medium">
                  The Programme
                </span>
                <div className="h-px w-10 md:w-16 bg-gold/50" />
              </div>

              {/* Display heading */}
              <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
                Selected Works
              </h1>

              {/* Italic pull-quote subtitle */}
              <p className="mt-8 font-serif italic text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
                Music for weddings, ceremonies, and occasions of note — drawn
                from four centuries of classical, contemporary, and world
                repertoire.
              </p>

              {/* Hairline rule */}
              <div className="mx-auto mt-10 h-px w-16 bg-gold/40" />
            </div>
          </div>
        </section>

        {/* Programme catalog — narrower single column */}
        <section className="pb-24 md:pb-32">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <SongCatalog />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
