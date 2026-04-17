"use client";

import { motion } from "framer-motion";
import { LEAH_OPEN_EVENT } from "@/components/leah/LeahDock";

/**
 * Nav-drawer entry for Leah. Dispatches a window event that LeahDock listens
 * for to open its panel. This keeps the single-source-of-truth for chat UI
 * in LeahDock while letting other parts of the app surface an open button.
 *
 * Visual: "L" monogram in Cormorant on champagne/gold gradient — matches
 * the Leah avatar used in the chat header and message thread.
 */
export function LeahChatToggle() {
  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(LEAH_OPEN_EVENT));
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Chat with Leah, Allan's assistant"
      title="Chat with Leah"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-champagne/30 bg-gradient-to-br from-gold/25 to-gold/5 text-champagne transition-colors duration-300 ease-cinematic hover:border-champagne/60 hover:bg-gold/15 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="font-display text-base leading-none select-none">L</span>
      <span className="sr-only">Open Leah chat</span>
    </motion.button>
  );
}
