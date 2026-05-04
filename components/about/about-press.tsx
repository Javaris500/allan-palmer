"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

type PressMention = {
  publication: string;
  date: string;
  headline: string;
  href: string;
};

const mentions: PressMention[] = [
  {
    publication: "Winnipeg Free Press",
    date: "July 2017",
    headline: "Violinist shares his passion for music",
    href: "https://www.winnipegfreepress.com/our-communities/correspondents/2017/07/03/violinist-shares-his-passion-for-music",
  },
];

export function AboutPress() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10">
      <div className="container">
        {/* Section header */}
        <header className="text-center mb-14 md:mb-16 max-w-2xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT }
            }
          >
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
            <span className="label-caps !text-xs md:!text-sm !tracking-[0.22em]">
              In the Press
            </span>
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
          </motion.div>
        </header>

        {/* Mentions list */}
        <ul className="max-w-2xl mx-auto divide-y divide-champagne/15 border-y border-champagne/15">
          {mentions.map((m, i) => (
            <motion.li
              key={`${m.publication}-${m.headline}`}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOnce}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.7, ease: EASE_OUT, delay: 0.1 + i * 0.08 }
              }
            >
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-7 md:py-8 px-1 transition-colors duration-500 ease-cinematic"
                aria-label={`Read "${m.headline}" in ${m.publication} (opens in new tab)`}
              >
                <div className="flex items-baseline justify-between gap-6 mb-3">
                  <span className="label-caps !text-xs !tracking-[0.18em] text-champagne">
                    {m.publication}
                  </span>
                  <span className="label-caps !text-xs !tracking-[0.18em] !text-muted-foreground shrink-0">
                    {m.date}
                  </span>
                </div>
                <h3 className="font-display italic font-light text-xl md:text-2xl text-foreground group-hover:text-champagne tracking-tight leading-snug transition-colors duration-500 ease-cinematic">
                  &ldquo;{m.headline}&rdquo;
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-4 inline-flex items-center gap-2 text-link !text-sm !tracking-[0.18em] text-muted-foreground group-hover:text-champagne"
                >
                  Read article
                  <span className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
