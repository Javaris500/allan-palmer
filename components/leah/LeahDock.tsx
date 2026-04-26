"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LeahChat } from "./LeahChat";

interface LeahDockProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string | null;
}

const HIDDEN_PATH_PREFIXES = ["/studio", "/sign-in", "/verify", "/api"];

/**
 * Window event other parts of the app (e.g. the nav drawer Leah button)
 * dispatch to open the Leah panel. Keeps LeahDock as the single source
 * of truth for open/close state.
 */
export const LEAH_OPEN_EVENT = "leah:open";

export function LeahDock(props: LeahDockProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Listen for open requests from the floating-nav "L" toggle
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(LEAH_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(LEAH_OPEN_EVENT, onOpen);
  }, []);

  if (HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Panel — full-screen on mobile, floating rounded shell on sm+ */}
      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-label="Leah chat"
            aria-modal="true"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed z-50 flex flex-col overflow-hidden
              inset-0 sm:inset-y-4 sm:right-4 sm:left-auto sm:w-[440px]
              bg-gradient-to-b from-background/98 via-background/95 to-background/98
              backdrop-blur-xl
              border-l border-champagne/15
              sm:border sm:border-champagne/15
              sm:rounded-2xl
              shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_25px_60px_-15px_rgba(0,0,0,0.7),0_8px_30px_-8px_rgba(212,175,109,0.08)]
            "
          >
            {/* Subtle gold gradient hairline along the top edge */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
            />

            {/* Header */}
            <header className="relative flex items-center justify-between px-5 py-4 border-b border-champagne/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 via-gold/15 to-transparent border border-champagne/40 flex items-center justify-center shadow-inner shadow-gold/10">
                  <span className="font-display text-champagne text-base leading-none select-none">
                    L
                  </span>
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400/90 border-2 border-background"
                  />
                </div>
                <div>
                  <p className="font-display text-base text-foreground leading-none">
                    Leah
                  </p>
                  <p className="label-caps !text-[10px] !tracking-[0.25em] mt-1.5">
                    {props.isAdmin ? "Admin · Allan" : "Allan's Assistant"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Leah"
                className="text-muted-foreground hover:text-champagne hover:bg-champagne/5 transition-colors duration-300 p-1.5 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Body */}
            <LeahChat {...props} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
