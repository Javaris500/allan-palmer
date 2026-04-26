import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PHOTO_PLACEMENTS } from "@/lib/media/placements";
import { PhotoEditForm } from "@/components/admin/media/photo-edit-form";

export const metadata = {
  title: "Edit Photo | Admin",
  robots: { index: false, follow: false },
};

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await prisma.photo.findFirst({
    where: { id, deletedAt: null },
  });
  if (!photo) notFound();

  const meta = PHOTO_PLACEMENTS[photo.placement];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-3xl">
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          All media
        </Link>

        <h1 className="font-serif text-2xl font-bold mb-1">Edit photo</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Currently appears on:{" "}
          <strong>{meta.appearsOn}</strong>
          {meta.viewUrl && (
            <Link
              href={meta.viewUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 ml-2 text-gold hover:underline"
            >
              View live <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </p>

        <div className="rounded-lg border border-border/50 bg-card/30 p-5 mb-5">
          <div className="aspect-[16/10] bg-muted/30 rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.blobUrl}
              alt={photo.altText}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {photo.width}×{photo.height} ·{" "}
            {(photo.sizeBytes / 1024 / 1024).toFixed(2)} MB ·{" "}
            {photo.contentType}
          </p>
        </div>

        <PhotoEditForm
          id={photo.id}
          initial={{
            title: photo.title,
            altText: photo.altText,
            description: photo.description ?? "",
            category: photo.category,
            placement: photo.placement,
            featured: photo.featured,
            displayOrder: photo.displayOrder,
          }}
        />
      </div>
    </div>
  );
}
