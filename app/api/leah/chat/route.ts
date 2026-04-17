import { NextRequest, NextResponse } from "next/server";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from "ai";
import { auth } from "@/auth";
import { rateLimitLeah } from "@/lib/rate-limit";
import { haiku } from "@/lib/leah/model";
import { getMode, isAdmin } from "@/lib/leah/auth";
import { getPromptContext } from "@/lib/leah/prompts/base";
import { buildCustomerSystemPrompt } from "@/lib/leah/prompts/customer";
import { buildAdminSystemPrompt } from "@/lib/leah/prompts/admin";
import { getToolsForMode } from "@/lib/leah/tools";
import {
  createConversation,
  appendMessage,
  autoTitle,
  getConversation,
} from "@/lib/leah/memory";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequestBody {
  messages: UIMessage[];
  conversationId?: string;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Sign in to chat with Leah." },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  // Rate limit per user (60 messages / 15 min)
  const { success: rateLimitOk, resetTime } = await rateLimitLeah(userId);
  if (!rateLimitOk) {
    const retryAfterSeconds = resetTime
      ? Math.max(1, Math.ceil((resetTime - Date.now()) / 1000))
      : 60;
    return NextResponse.json(
      {
        error:
          "You've sent a lot of messages quickly. Give Leah a moment, then try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // Origin check — belt-and-suspenders against cross-origin POSTs.
  // NextAuth's SameSite=Lax cookie already blocks typical CSRF, but this
  // rejects requests from unexpected origins explicitly.
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      const origin = new URL(originHeader).host;
      const host = request.headers.get("host");
      if (host && origin !== host) {
        return NextResponse.json(
          { error: "Cross-origin requests are not allowed." },
          { status: 403 },
        );
      }
    } catch {
      // Malformed origin — reject.
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 400 },
      );
    }
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { messages, conversationId } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "No messages provided." },
      { status: 400 },
    );
  }

  const mode = getMode(session);
  const adminMode = isAdmin(session);
  // Build the system prompt at request time so it gets today's date and
  // the signed-in user's name injected. Static const prompts can't do this.
  const promptCtx = getPromptContext(session.user.name ?? null, adminMode);
  const systemPrompt = adminMode
    ? buildAdminSystemPrompt(promptCtx)
    : buildCustomerSystemPrompt(promptCtx);
  const tools = getToolsForMode(session, mode);

  // Find-or-create conversation
  let conversation;
  if (conversationId) {
    conversation = await getConversation(conversationId, userId);
  }
  if (!conversation) {
    conversation = await createConversation({ userId, mode });
  }
  const convoId = conversation.id;

  // Persist the latest user message
  const latest = messages[messages.length - 1];
  if (latest && latest.role === "user") {
    const text = uiMessageToText(latest);
    if (text) {
      await appendMessage({
        conversationId: convoId,
        role: "USER",
        content: text,
      });
      // Auto-title from first user message if untitled
      if (!conversation.title) {
        await autoTitle(convoId, text);
      }
    }
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: haiku(),
    system: systemPrompt,
    messages: modelMessages,
    tools,
    stopWhen: stepCountIs(8),
    temperature: 0.7,
    // Cost ceiling — keeps a single reply bounded. Tool calls aren't counted
    // here (they count per step), but each generation step is capped.
    maxOutputTokens: 2048,
    onFinish: async ({ text, toolCalls }) => {
      try {
        await appendMessage({
          conversationId: convoId,
          role: "ASSISTANT",
          content: text ?? "",
          toolCalls: toolCalls?.length ? toolCalls : undefined,
        });
      } catch (err) {
        // Persistence best-effort — but log so silent context loss is visible.
        console.error("[leah] appendMessage(assistant) failed", {
          conversationId: convoId,
          err,
        });
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: { "x-leah-conversation-id": convoId },
  });
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function uiMessageToText(msg: UIMessage): string {
  if (typeof (msg as unknown as { content?: unknown }).content === "string") {
    return (msg as unknown as { content: string }).content;
  }
  const parts = (msg as { parts?: Array<{ type: string; text?: string }> })
    .parts;
  if (Array.isArray(parts)) {
    return parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text!)
      .join("\n")
      .trim();
  }
  return "";
}
