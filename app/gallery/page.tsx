import type { Metadata } from "next"
import { PhotoGalleryCarousel } from "@/components/photo-gallery-carousel"
import { VideoThumbnailGrid } from "@/components/video-thumbnail-grid"
import { GalleryPreloadImages } from "@/components/gallery-preload-images"
import { Play } from "lucide-react"

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
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Preload images */}
      <GalleryPreloadImages />
      
      {/* Photo Gallery */}
      <PhotoGalleryCarousel />

      {/* Video Gallery Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Play className="h-4 w-4" />
              Video Gallery
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              See Allan in Action
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Experience Allan's artistry through these captivating video performances from weddings, concerts, and
              special events
            </p>
          </div>

          <VideoThumbnailGrid />
        </div>
      </section>
    </div>
  )
}
