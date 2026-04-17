import { prisma } from "@/lib/prisma";
import type { LeahMode, LeahMessageRole } from "@/generated/prisma";

export async function createConversation(params: {
  userId: string;
  mode: LeahMode;
  title?: string;
}) {
  return prisma.leahConversation.create({
    data: {
      userId: params.userId,
      mode: params.mode,
      title: params.title ?? null,
    },
  });
}

export async function getConversation(id: string, userId: string) {
  return prisma.leahConversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function listUserConversations(userId: string, mode?: LeahMode) {
  return prisma.leahConversation.findMany({
    where: { userId, ...(mode ? { mode } : {}) },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      mode: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function appendMessage(params: {
  conversationId: string;
  role: LeahMessageRole;
  content: string;
  toolCalls?: unknown;
}) {
  await prisma.leahMessage.create({
    data: {
      conversationId: params.conversationId,
      role: params.role,
      content: params.content,
      toolCalls: (params.toolCalls as never) ?? undefined,
    },
  });
  await prisma.leahConversation.update({
    where: { id: params.conversationId },
    data: { updatedAt: new Date() },
  });
}

export async function autoTitle(conversationId: string, firstMessage: string) {
  // Strip newlines + collapse whitespace so titles read as a single tidy line.
  const cleaned = firstMessage.replace(/\s+/g, " ").trim();
  // Truncate at a word boundary where possible.
  let title = cleaned.slice(0, 60);
  if (cleaned.length > 60) {
    const lastSpace = title.lastIndexOf(" ");
    if (lastSpace > 30) title = title.slice(0, lastSpace);
    title = title.replace(/[,.;:!?\-\s]+$/, "") + "…";
  }
  if (!title) return;
  await prisma.leahConversation.update({
    where: { id: conversationId },
    data: { title },
  });
}

export async function deleteConversation(id: string, userId: string) {
  // Atomic — FK+ownership in one query. Returns count deleted.
  const result = await prisma.leahConversation.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
