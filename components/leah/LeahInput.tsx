"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";

interface LeahInputProps {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

const HINTS = [
  "Ask about availability…",
  "Describe your event…",
  "How does booking work?",
  "Any songs in mind?",
];

export function LeahInput({
  onSubmit,
  onStop,
  disabled,
  isStreaming,
  placeholder,
}: LeahInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  // Cycle placeholder hints when empty + unfocused
  useEffect(() => {
    if (value || focused || placeholder) return;
    const id = setInterval(() => {
      setHintIdx((i) => (i + 1) % HINTS.length);
    }, 4500);
    return () => clearInterval(id);
  }, [value, focused, placeholder]);

  function send() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showCounter = value.length > 500;
  const placeholderText = placeholder ?? HINTS[hintIdx];

  return (
    <div className="relative px-4 pt-3 pb-4">
      {/* Hairline divider above the input — softer than a hard border */}
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent"
      />

      <div
        className={`
          relative flex items-end gap-2 rounded-xl border
          transition-all duration-500 ease-cinematic
          ${
            focused
              ? "border-champagne/50 bg-surface/70 shadow-[0_0_0_3px_rgba(212,175,109,0.08),0_8px_24px_-12px_rgba(212,175,109,0.25)]"
              : "border-champagne/15 bg-surface/40 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]"
          }
        `}
      >
        {/* Inner highlight — ultra-thin gradient that catches light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent"
        />

        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholderText}
          // Disable while Leah is streaming or otherwise busy — the Stop
          // button remains active so the user can interrupt. New messages
          // should wait until the current reply finishes.
          disabled={disabled || isStreaming}
          maxLength={4000}
          aria-label="Message Leah"
          className="relative flex-1 bg-transparent resize-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none disabled:opacity-60 leading-relaxed max-h-40"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="relative m-1.5 shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-foreground/10 text-foreground hover:bg-foreground/15 transition-colors duration-300 ring-1 ring-inset ring-white/5"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="
              relative m-1.5 shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg
              bg-gradient-to-b from-gold to-champagne text-ink
              hover:from-champagne hover:to-gold
              disabled:from-muted disabled:to-muted disabled:text-muted-foreground/40
              disabled:cursor-not-allowed
              transition-all duration-500 ease-cinematic
              shadow-[0_2px_8px_-2px_rgba(212,175,109,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
              disabled:shadow-none
              active:translate-y-px active:shadow-[0_1px_4px_-1px_rgba(212,175,109,0.35)]
            "
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-2.5 px-1 label-caps !text-[9px] !tracking-[0.22em] !text-muted-foreground/50">
        <span>
          <kbd className="font-sans text-[9px] text-muted-foreground/70">
            Enter
          </kbd>{" "}
          to send ·{" "}
          <kbd className="font-sans text-[9px] text-muted-foreground/70">
            Shift+Enter
          </kbd>{" "}
          for newline
        </span>
        {showCounter && (
          <span
            className={
              value.length > 3800 ? "!text-warning" : "!text-muted-foreground"
            }
          >
            {value.length}/4000
          </span>
        )}
      </div>
    </div>
  );
}
