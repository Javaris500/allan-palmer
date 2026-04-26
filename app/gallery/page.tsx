import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GalleryPreloadImages } from "@/components/gallery-preload-images";
import { PageTransition } from "@/components/page-transition";
import { getPhotosByPlacement } from "@/lib/media/photos";
import { getVideosByPlacement } from "@/lib/media/videos";
import {
  defaultGalleryPhotos,
  type CarouselPhoto,
} from "@/components/photo-gallery-carousel";
import type { VideoConfig } from "@/lib/video-thumbnails";

// Dynamic imports for heavy components
const PhotoGalleryCarousel = dynamic(
  () =>
    import("@/components/photo-gallery-carousel").then((mod) => ({
      default: mod.PhotoGalleryCarousel,
    })),
  {
    loading: () => (
      <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-muted/40 rounded-sm" />
        ))}
      </div>
    ),
    ssr: false,
  },
);

const VideoGalleryImmersive = dynamic(
  () =>
    import("@/components/video-gallery-immersive").then((mod) => ({
      default: mod.VideoGalleryImmersive,
    })),
  {
    loading: () => (
      <div className="animate-pulse flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[220px] aspect-[9/16] bg-muted/40 rounded-sm"
          />
        ))}
      </div>
    ),
    ssr: false,
  },
);

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
};

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="h-px w-10 md:w-16 bg-champagne/50" />
      <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
        {label}
      </span>
      <div className="h-px w-10 md:w-16 bg-champagne/50" />
    </div>
  );
}

export default async function GalleryPage() {
  const [dbPhotos, dbVideos] = await Promise.all([
    getPhotosByPlacement("GALLERY_CAROUSEL"),
    getVideosByPlacement("GALLERY_GRID"),
  ]);

  const photos: CarouselPhoto[] =
    dbPhotos.length > 0
      ? dbPhotos.map((p) => ({
          id: p.id,
          src: p.blobUrl,
          alt: p.altText,
          title: p.title,
          description: p.description ?? "",
        }))
      : defaultGalleryPhotos;

  // When DB has no videos, pass undefined so the component falls back to
  // its hardcoded list. This keeps the live site working until Allan
  // uploads at least one video through the admin.
  const videos: VideoConfig[] | undefined =
    dbVideos.length > 0
      ? dbVideos.map((v) => ({
          playbackId: v.muxPlaybackId,
          title: v.title,
          description: v.description ?? "",
          category: v.category,
          thumbnailTime: v.thumbnailTime,
        }))
      : undefined;

  return (
    <PageTransition>
      <GalleryPreloadImages />

      <div className="min-h-screen">
        {/* ═══════════════════════════════════════════════════════
           CINEMATIC HEADER
        ═══════════════════════════════════════════════════════ */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--gold)/0.05)_0%,transparent_70%)]" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <SectionEyebrow label="The Portfolio" />
              <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
                A Visual Record
              </h1>
              <p className="mt-8 font-display italic text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
                Stills and performances drawn from weddings, ceremonies, and
                concerts across Winnipeg and beyond.
              </p>
              <div className="divider-gold-sm mt-10" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           STILLS
        ═══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-champagne/10">
          <div className="container">
            <header className="text-center mb-14 md:mb-16 max-w-xl mx-auto">
              <SectionEyebrow label="Stills" />
              <h2 className="font-display font-light text-3xl md:text-5xl tracking-tight leading-[1.05]">
                In Frame
              </h2>
              <p className="mt-6 font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed">
                A selection from recent weddings, concerts, and private events.
              </p>
            </header>

            <PhotoGalleryCarousel photos={photos} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           PERFORMANCES
        ═══════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 border-t border-champagne/10">
          <div className="container">
            <header className="text-center mb-14 md:mb-16 max-w-xl mx-auto">
              <SectionEyebrow label="Performances" />
              <h2 className="font-display font-light text-3xl md:text-5xl tracking-tight leading-[1.05]">
                On Stage
              </h2>
              <p className="mt-6 font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed">
                Live reels from concert halls, receptions, and ceremonies.
              </p>
            </header>

            <VideoGalleryImmersive videos={videos} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
           CLOSING CTA
        ═══════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 border-t border-champagne/10">
          <div className="container max-w-xl text-center">
            <div className="divider-gold-sm mb-10" />
            <blockquote className="font-display italic font-light text-2xl md:text-[2rem] text-foreground/85 leading-[1.35] tracking-tight mb-10">
              Music for occasions that deserve to be remembered.
            </blockquote>
            <div className="flex items-center justify-center gap-8">
              <Link
                href="/booking"
                className="inline-block bg-gold hover:bg-champagne text-ink px-8 py-3.5 rounded-sm text-[11px] md:text-xs tracking-[0.22em] uppercase font-label transition-colors duration-500 ease-cinematic"
              >
                Book Allan
              </Link>
              <Link
                href="/services"
                className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
