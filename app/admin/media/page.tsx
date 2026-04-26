import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  Film as FilmIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  PHOTO_PLACEMENTS,
  PHOTO_PLACEMENT_ORDER,
  VIDEO_PLACEMENTS,
  VIDEO_PLACEMENT_ORDER,
} from "@/lib/media/placements";
import { PhotoUploader } from "@/components/admin/media/photo-uploader";
import { PhotoCard } from "@/components/admin/media/photo-card";
import { VideoUploader } from "@/components/admin/media/video-uploader";
import { VideoCard } from "@/components/admin/media/video-card";
import type {
  PhotoPlacement,
  VideoPlacement,
} from "@/generated/prisma";

// Admin-only, always live — never prerender.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const [photos, videos] = await Promise.all([
    prisma.photo.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        altText: true,
        blobUrl: true,
        width: true,
        height: true,
        placement: true,
        featured: true,
      },
    }),
    prisma.video.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        muxPlaybackId: true,
        muxStatus: true,
        durationSec: true,
        thumbnailTime: true,
        placement: true,
        featured: true,
        createdAt: true,
      },
    }),
  ]);

  const photosByPlacement = new Map<PhotoPlacement, typeof photos>();
  for (const p of photos) {
    const arr = photosByPlacement.get(p.placement) ?? [];
    arr.push(p);
    photosByPlacement.set(p.placement, arr);
  }

  const videosByPlacement = new Map<VideoPlacement, typeof videos>();
  for (const v of videos) {
    const arr = videosByPlacement.get(v.placement) ?? [];
    arr.push(v);
    videosByPlacement.set(v.placement, arr);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            Admin dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                Media
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload, replace, and remove photos and videos. Changes appear
                on the public site within seconds — no redeploy needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-xl font-bold">Photos</h2>
          </div>

          <div className="space-y-6">
            {PHOTO_PLACEMENT_ORDER.map((placement) => {
              const meta = PHOTO_PLACEMENTS[placement];
              const items = photosByPlacement.get(placement) ?? [];
              const showUploader = !meta.isSingleton || items.length === 0;

              return (
                <section
                  key={placement}
                  className="rounded-xl border border-border/50 bg-card/30 p-6"
                >
                  <header className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold">
                          {meta.label}
                        </h3>
                        {meta.isSingleton && (
                          <span className="text-[10px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">
                            Single photo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {meta.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-muted-foreground/80">
                          Appears on: <strong>{meta.appearsOn}</strong>
                        </span>
                        {meta.viewUrl && (
                          <Link
                            href={meta.viewUrl}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-1 text-gold hover:underline"
                          >
                            View live <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                      {(meta.recommendedAspect || meta.recommendedSize) && (
                        <p className="text-[11px] text-muted-foreground/60 mt-2">
                          {meta.recommendedAspect &&
                            `Recommended: ${meta.recommendedAspect}`}
                          {meta.recommendedAspect && meta.recommendedSize &&
                            " · "}
                          {meta.recommendedSize}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {items.length}{" "}
                      {items.length === 1 ? "photo" : "photos"}
                    </span>
                  </header>

                  {showUploader && (
                    <div className="mb-5 p-4 rounded-lg border border-dashed border-border/60 bg-background/40">
                      <PhotoUploader
                        placement={placement}
                        placementLabel={meta.label}
                        isReplace={meta.isSingleton && items.length > 0}
                      />
                    </div>
                  )}

                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground/70 italic">
                      No photos in this section yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {items.map((p) => (
                        <PhotoCard
                          key={p.id}
                          id={p.id}
                          title={p.title}
                          altText={p.altText}
                          blobUrl={p.blobUrl}
                          width={p.width}
                          height={p.height}
                          placementLabel={meta.label}
                          viewUrl={meta.viewUrl}
                          featured={p.featured}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-5">
            <FilmIcon className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-xl font-bold">Videos</h2>
          </div>

          <div className="space-y-6">
            {VIDEO_PLACEMENT_ORDER.map((placement) => {
              const meta = VIDEO_PLACEMENTS[placement];
              const items = videosByPlacement.get(placement) ?? [];
              const showUploader = !meta.isSingleton || items.length === 0;

              return (
                <section
                  key={placement}
                  className="rounded-xl border border-border/50 bg-card/30 p-6"
                >
                  <header className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold">
                          {meta.label}
                        </h3>
                        {meta.isSingleton && (
                          <span className="text-[10px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">
                            Single video
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {meta.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-muted-foreground/80">
                          Appears on: <strong>{meta.appearsOn}</strong>
                        </span>
                        {meta.viewUrl && (
                          <Link
                            href={meta.viewUrl}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-1 text-gold hover:underline"
                          >
                            View live <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {items.length}{" "}
                      {items.length === 1 ? "video" : "videos"}
                    </span>
                  </header>

                  {showUploader && (
                    <div className="mb-5 p-4 rounded-lg border border-dashed border-border/60 bg-background/40">
                      <VideoUploader
                        placement={placement}
                        placementLabel={meta.label}
                        isReplace={meta.isSingleton && items.length > 0}
                      />
                    </div>
                  )}

                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground/70 italic">
                      No videos in this section yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((v) => (
                        <VideoCard
                          key={v.id}
                          id={v.id}
                          title={v.title}
                          muxPlaybackId={v.muxPlaybackId}
                          muxStatus={v.muxStatus}
                          durationSec={v.durationSec}
                          thumbnailTime={v.thumbnailTime}
                          placementLabel={meta.label}
                          viewUrl={meta.viewUrl}
                          featured={v.featured}
                          createdAt={v.createdAt}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
