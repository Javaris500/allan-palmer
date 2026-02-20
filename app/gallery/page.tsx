import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { GalleryPreloadImages } from "@/components/gallery-preload-images"
import { PageTransition } from "@/components/page-transition"
import { Camera, Film } from "lucide-react"

// Dynamic imports for heavy components - reduces initial JS bundle
const PhotoGalleryCarousel = dynamic(
  () => import("@/components/photo-gallery-carousel").then(mod => ({ default: mod.PhotoGalleryCarousel })),
  { 
    loading: () => (
      <div className="animate-pulse">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 aspect-[4/5] bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    ),
    ssr: false 
  }
)

const VideoGalleryImmersive = dynamic(
  () => import("@/components/video-gallery-immersive").then(mod => ({ default: mod.VideoGalleryImmersive })),
  { 
    loading: () => (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[9/16] bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    ),
    ssr: false 
  }
)

export const metadata: Metadata = {
  title: "Performance Gallery - Allan Palmer Violinist",
  description:
    "Explore Allan Palmer's performance gallery featuring professional photos and videos from weddings, concerts, and special events across Winnipeg and Manitoba.",
  keywords: [
    "Allan Palmer gallery",
    "violin performance photos",
    "wedding violinist videos",
    "concert performances",
    "professional musician portfolio",
    "Winnipeg violinist",
  ],
  openGraph: {
    title: "Performance Gallery - Allan Palmer Violinist",
    description:
      "View stunning photos and videos of Allan Palmer's violin performances at weddings, concerts, and special events.",
    type: "website",
  },
  alternates: {
    canonical: "/gallery",
  },
}

export default function GalleryPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-12">
        {/* Preload images */}
        <GalleryPreloadImages />

        {/* Photo Gallery Section */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-gold mb-4">
                <Camera className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Photo Gallery</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Capturing Every Performance
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse through stunning photographs from weddings, concerts, and special events
              </p>
            </div>
            <PhotoGalleryCarousel />
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-muted/10 to-background">
          <div className="container">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-gold mb-4">
                <Film className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Video Gallery</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                See Allan in Action
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the artistry through captivating video performances
              </p>
            </div>
            <VideoGalleryImmersive />
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
