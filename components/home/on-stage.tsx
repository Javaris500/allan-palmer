"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MuxVideoPlayer } from "@/components/mux-video-player";
import { EASE_OUT } from "@/lib/motion";

const VIDEOS = [
  "IbkO01rMhCQeGAlIuUsravD6jyqBa012lpyu46mtZg1As",
  "nQ1pnPAn01veA18yCqq67wJkEXuyo8phQhuOF6RqVgMM",
];

export function HomeOnStage() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
          {VIDEOS.map((id, idx) => (
            <motion.div
              key={id}
              className="relative aspect-video ring-1 ring-champagne/15 rounded-sm overflow-hidden"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOnce}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.9, ease: EASE_OUT, delay: idx * 0.1 }
              }
            >
              <MuxVideoPlayer playbackId={id} fluid className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
