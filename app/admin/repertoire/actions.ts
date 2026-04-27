"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SONG_GENRE_KEYS } from "@/lib/songs/genres";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateSongSurfaces() {
  revalidatePath("/repertoire");
  revalidatePath("/admin/repertoire");
}

const GENRES = SONG_GENRE_KEYS as readonly string[];

const genresField = z
  .array(z.string().refine((g) => GENRES.includes(g), "Invalid genre"))
  .min(1, "Pick at least one genre")
  .max(SONG_GENRE_KEYS.length);

const createSchema = z.object({
  title: z.string().min(1).max(200).transform((s) => s.trim()),
  artist: z
    .string()
    .max(200)
    .optional()
    .transform((s) => (s && s.trim() ? s.trim() : undefined)),
  genres: genresField,
  displayOrder: z.number().int().min(0).max(99999).optional(),
});

export type CreateSongInput = z.infer<typeof createSchema>;

export async function createSong(input: CreateSongInput) {
  const session = await requireAdmin();
  const parsed = createSchema.parse(input);

  const last = await prisma.song.findFirst({
    where: { deletedAt: null },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  const song = await prisma.song.create({
    data: {
      title: parsed.title,
      artist: parsed.artist ?? null,
      genres: parsed.genres,
      displayOrder: parsed.displayOrder ?? (last ? last.displayOrder + 1 : 0),
    },
    select: { id: true },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "song.create",
      targetId: song.id,
      metadata: { title: parsed.title, genres: parsed.genres },
    },
  });

  revalidateSongSurfaces();
  return { id: song.id };
}

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200).transform((s) => s.trim()).optional(),
  artist: z
    .string()
    .max(200)
    .optional()
    .transform((s) => (s === undefined ? undefined : s.trim() || null)),
  genres: genresField.optional(),
  displayOrder: z.number().int().min(0).max(99999).optional(),
});

export type UpdateSongInput = z.infer<typeof updateSchema>;

export async function updateSong(input: UpdateSongInput) {
  const session = await requireAdmin();
  const parsed = updateSchema.parse(input);
  const { id, ...rest } = parsed;

  await prisma.song.update({
    where: { id },
    data: rest,
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "song.update",
      targetId: id,
      metadata: rest,
    },
  });

  revalidateSongSurfaces();
}

export async function deleteSong(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const song = await prisma.song.findUnique({
    where: { id },
    select: { deletedAt: true },
  });
  if (!song || song.deletedAt) return;

  await prisma.song.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "song.delete",
      targetId: id,
    },
  });

  revalidateSongSurfaces();
}
