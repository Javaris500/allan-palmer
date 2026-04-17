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

      {/* Panel */}
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
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] flex flex-col bg-background border-l border-champagne/15 shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-champagne/15">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border border-champagne/30 flex items-center justify-center">
                  <span className="font-display text-champagne text-sm leading-none select-none">
                    L
                  </span>
                </div>
                <div>
                  <p className="font-display text-base text-foreground leading-none">
                    Leah
                  </p>
                  <p className="label-caps !text-[10px] !tracking-[0.25em] mt-1">
                    {props.isAdmin ? "Admin · Allan" : "Allan's Assistant"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Leah"
                className="text-muted-foreground hover:text-champagne transition-colors duration-300 p-1"
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
