import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isSongGenre, type SongGenre } from "@/lib/songs/genres";
import { SongForm } from "@/components/admin/repertoire/song-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Song | Admin",
  robots: { index: false, follow: false },
};

export default async function EditSongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const song = await prisma.song.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      title: true,
      artist: true,
      genres: true,
      displayOrder: true,
    },
  });
  if (!song) notFound();

  const genres = song.genres.filter(isSongGenre) as SongGenre[];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-3xl">
        <Link
          href="/admin/repertoire"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          All songs
        </Link>

        <h1 className="font-serif text-2xl font-bold mb-1">Edit song</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Appears on{" "}
          <Link
            href="/repertoire"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            /repertoire <ExternalLink className="h-3 w-3" />
          </Link>
        </p>

        <SongForm
          mode="edit"
          id={song.id}
          initial={{
            title: song.title,
            artist: song.artist ?? "",
            genres,
            displayOrder: song.displayOrder,
          }}
        />
      </div>
    </div>
  );
}
