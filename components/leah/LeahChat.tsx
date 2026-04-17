"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { LogIn, AlertCircle } from "lucide-react";
import { LeahMessage } from "./LeahMessage";
import { LeahInput } from "./LeahInput";
import { Typewriter } from "./Typewriter";

interface LeahChatProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string | null;
}

const INTRO_KEY = "leah:intro-seen";

export function LeahChat({ isLoggedIn, isAdmin, userName }: LeahChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [introSeen, setIntroSeen] = useState(true);

  // Conversation continuity — the server assigns an id on first response
  // via `x-leah-conversation-id`; we echo it back on every subsequent send.
  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIntroSeen(localStorage.getItem(INTRO_KEY) === "1");
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/leah/chat",
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            ...(body ?? {}),
            messages,
            conversationId: conversationIdRef.current ?? undefined,
          },
        }),
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const assigned = response.headers.get("x-leah-conversation-id");
          if (assigned && assigned !== conversationIdRef.current) {
            conversationIdRef.current = assigned;
          }
          return response;
        },
      }),
    [],
  );

  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    transport,
  });

  // Smart auto-scroll — only stick to bottom if user was already near it.
  // Otherwise let them read older messages without being yanked down.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 120;
    if (nearBottom) {
      // Use "auto" during streaming (avoids smooth-scroll jitter on every delta).
      el.scrollTo({
        top: el.scrollHeight,
        behavior: status === "streaming" ? "auto" : "smooth",
      });
    }
  }, [messages, status]);

  useEffect(() => {
    if (messages.length > 0 && !introSeen) {
      localStorage.setItem(INTRO_KEY, "1");
      setIntroSeen(true);
    }
  }, [messages.length, introSeen]);

  // ──────────────────────────────────────────────
  // Sign-in gate — anon users see the editorial prompt
  // ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xs"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold/25 to-gold/5 border border-champagne/30 mb-5">
            <span className="font-display text-champagne text-2xl leading-none select-none">
              L
            </span>
          </div>
          <h2 className="font-display text-2xl font-light text-foreground tracking-wide">
            Hi, I&rsquo;m Leah
          </h2>
          <div className="divider-gold-sm mt-3 mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            I&rsquo;m Allan&rsquo;s assistant. Sign in and I&rsquo;ll help you
            book a date or answer any questions you have.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 bg-gold hover:bg-champagne text-ink px-6 py-3 rounded-sm font-label text-xs tracking-[0.22em] uppercase transition-colors duration-500 ease-cinematic"
          >
            <LogIn className="h-4 w-4" />
            Sign in to chat
          </Link>
        </motion.div>
      </div>
    );
  }

  const intro = isAdmin
    ? `${greetByTime()}, ${firstName(userName)}. Want your briefing, or got something specific?`
    : `Hi${userName ? ` ${firstName(userName)}` : ""}, I\u2019m Leah, Allan\u2019s assistant. Looking to book a date or just have a question?`;

  const isStreamingActive = status === "streaming" || status === "submitted";

  // Index of the last assistant message — only this one gets the
  // streaming cursor while output is still arriving.
  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]?.role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <>
      {/* Scrollable message area */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-busy={isStreamingActive}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
      >
        {/* Intro — typewriter on very first visit, static thereafter */}
        {messages.length === 0 && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border border-champagne/30 flex items-center justify-center">
              <span className="font-display text-champagne text-sm leading-none select-none">
                L
              </span>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <p className="label-caps !text-[10px] !tracking-[0.25em]">Leah</p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {introSeen ? (
                  intro
                ) : (
                  <Typewriter text={intro} speed={32} delay={250} />
                )}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isLastAssistant =
            msg.role === "assistant" && idx === lastAssistantIdx;
          return (
            <LeahMessage
              key={msg.id}
              role={msg.role as "user" | "assistant" | "system"}
              parts={msg.parts as never}
              isStreaming={isLastAssistant && status === "streaming"}
            />
          );
        })}

        {/* Pre-first-token pending dots — only while request is in flight
            but no assistant tokens have arrived yet. */}
        {status === "submitted" && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8" />
            <div
              className="flex items-center gap-1 pt-1"
              role="status"
              aria-label="Leah is thinking"
            >
              <Dot delay={0} />
              <Dot delay={0.15} />
              <Dot delay={0.3} />
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <LeahInput
        onSubmit={(text) => sendMessage({ text })}
        onStop={stop}
        disabled={isStreamingActive}
        isStreaming={isStreamingActive}
      />

      {/* Soft "new chat" reset */}
      {messages.length > 0 && (
        <button
          onClick={() => {
            stop();
            setMessages([]);
            conversationIdRef.current = null;
          }}
          className="absolute top-3 right-14 label-caps !text-[10px] !tracking-[0.2em] !text-muted-foreground/60 hover:!text-champagne transition-colors"
        >
          New chat
        </button>
      )}
    </>
  );
}

function greetByTime(): string {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

function firstName(name: string | null): string {
  if (!name) return "";
  return name.split(/\s+/)[0] ?? "";
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="block w-1.5 h-1.5 rounded-full bg-champagne/70"
      animate={{ opacity: [0.25, 1, 0.25] }}
      transition={{ duration: 1.4, repeat: Infinity, delay }}
    />
  );
}
