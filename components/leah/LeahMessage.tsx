"use client";

import { motion } from "framer-motion";
import { LeahToolCard } from "./LeahToolCard";
import { LeahMarkdown } from "./LeahMarkdown";

interface MessagePart {
  type: string;
  text?: string;
  toolName?: string;
  output?: unknown;
  state?: string;
  input?: unknown;
}

interface LeahMessageProps {
  role: "user" | "assistant" | "system";
  parts?: MessagePart[];
  text?: string;
  /** True if this is the actively streaming last assistant message. */
  isStreaming?: boolean;
}

/**
 * Maps tool names (and their AI SDK v6 `tool-*` part types) to a
 * human-readable pending label. Shown while a tool is executing but
 * before its output is available — replaces the old "Working on it…".
 */
const TOOL_PENDING_LABEL: Record<string, string> = {
  answerFAQ: "Looking that up…",
  checkAvailability: "Checking availability…",
  createBookingDraft: "Drafting your booking…",
  submitBooking: "Submitting booking…",
  escalateToAllan: "Passing a note to Allan…",
  captureLead: "Saving your info…",
  listBookings: "Pulling bookings…",
  morningBriefing: "Preparing your briefing…",
  triageLeads: "Sorting by urgency…",
  blockTime: "Blocking the calendar…",
};

function pendingLabelFor(toolKey: string): string {
  return TOOL_PENDING_LABEL[toolKey] ?? "Working on it…";
}

export function LeahMessage({
  role,
  parts,
  text,
  isStreaming,
}: LeahMessageProps) {
  const items = parts?.length ? parts : text ? [{ type: "text", text }] : [];
  if (items.length === 0) return null;

  // ──────────────────────────────────────────────
  // User bubble
  // ──────────────────────────────────────────────
  if (role === "user") {
    const userText = items
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("\n");
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-sm rounded-br-none bg-gold/10 border border-gold/25 px-4 py-2.5 text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap">
          {userText}
        </div>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────
  // Assistant response
  // ──────────────────────────────────────────────
  const lastTextIdx = items
    .map((p, i) => (p.type === "text" ? i : -1))
    .filter((i) => i >= 0)
    .pop();

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      <LeahAvatar />
      <div className="flex-1 min-w-0 space-y-2">
        <p className="label-caps !text-[10px] !tracking-[0.25em]">Leah</p>

        {items.map((part, i) => {
          // ── Text parts — markdown-rendered ───────────────────────
          if (part.type === "text") {
            const showCursor = isStreaming && i === lastTextIdx;
            return (
              <div key={i}>
                <LeahMarkdown>{part.text ?? ""}</LeahMarkdown>
                {showCursor && <StreamingCursor />}
              </div>
            );
          }

          // ── Tool invocations ────────────────────────────────────
          if (part.type.startsWith("tool-")) {
            const toolName = part.type.replace(/^tool-/, "");

            if (part.state === "output-available") {
              return (
                <LeahToolCard
                  key={i}
                  toolName={toolName}
                  result={part.output}
                />
              );
            }

            // Still running — friendly label with shimmer pulse
            return (
              <div key={i} className="inline-flex items-center gap-2 mt-1.5">
                <ShimmerPulse />
                <span className="label-caps !text-[10px] !tracking-[0.25em] !text-champagne/80">
                  {pendingLabelFor(toolName)}
                </span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Editorial monogram avatar
// ──────────────────────────────────────────────
function LeahAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border border-champagne/30 flex items-center justify-center">
      <span className="font-display text-champagne text-sm leading-none select-none">
        L
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────
// Streaming cursor — blinking hairline at end of streaming text
// ──────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-[2px] h-[0.95em] align-[-0.1em] ml-0.5 bg-champagne animate-pulse motion-reduce:animate-none"
    />
  );
}

// ──────────────────────────────────────────────
// Shimmer pulse — pending tool indicator
// ──────────────────────────────────────────────
function ShimmerPulse() {
  return (
    <motion.span
      aria-hidden="true"
      className="block w-1.5 h-1.5 rounded-full bg-champagne/80"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
