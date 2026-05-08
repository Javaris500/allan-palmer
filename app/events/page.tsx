import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = {
  title: "Performance Schedule | Allan Palmer Violinist",
  description:
    "Upcoming public performances by violinist Allan Palmer. The calendar is updated as engagements are confirmed — request a private booking or be notified when new dates are announced.",
  keywords: [
    "Allan Palmer events",
    "violin performances Winnipeg",
    "live violin music",
    "Manitoba violinist concerts",
    "wedding violinist availability",
  ],
  openGraph: {
    title: "Performance Schedule | Allan Palmer Violinist",
    description:
      "Upcoming public performances by violinist Allan Palmer.",
    type: "website",
    locale: "en_CA",
  },
  alternates: {
    canonical: "/events",
  },
};

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Cinematic header — mirrors /repertoire */}
        <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="/allan-performance-professional.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center grayscale opacity-[0.18]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 md:w-16 bg-gold/50" />
                <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-gold/80 font-medium">
                  The Calendar
                </span>
                <div className="h-px w-10 md:w-16 bg-gold/50" />
              </div>

              <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
                Performance Schedule
              </h1>

              <p className="mt-8 font-serif italic text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
                Where to hear Allan play live — public concerts, ceremonies,
                and announced engagements as they are confirmed.
              </p>

              <div className="mx-auto mt-10 h-px w-16 bg-gold/40" />
            </div>
          </div>
        </section>

        {/* Empty state — typeset like a concert programme, not a card */}
        <section className="relative pb-28 md:pb-40">
          {/* Soft radial gold glow centered behind the composition */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none flex items-start justify-center"
          >
            <div className="mt-10 h-[420px] w-[680px] max-w-[90vw] rounded-full bg-[radial-gradient(closest-side,rgba(201,166,70,0.10),transparent_70%)] blur-2xl" />
          </div>

          <div className="container relative">
            <div className="mx-auto max-w-xl text-center">
              {/* Engraved seal — Roman numeral I, the next performance */}
              <div className="mx-auto mb-12 flex h-20 w-20 items-center justify-center rounded-full border border-gold/45 bg-background/40 shadow-[inset_0_0_0_1px_rgba(201,166,70,0.08)]">
                <span
                  className="font-serif italic text-2xl text-gold/90 leading-none"
                  aria-hidden="true"
                >
                  I
                </span>
                <span className="sr-only">Programme seal</span>
              </div>

              {/* Fleuron rule — top */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/45" />
                <span className="text-gold/70 text-[10px] tracking-[0.4em]">
                  ✦
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/45" />
              </div>

              <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-gold/80 font-medium mb-6">
                Coming Soon
              </p>

              <h2 className="font-serif font-light text-4xl md:text-5xl leading-[1.05] tracking-tight">
                The next performance
                <br />
                <span className="italic text-foreground/90">
                  is being scored.
                </span>
              </h2>

              <p className="mt-8 font-serif italic text-base md:text-lg text-muted-foreground/85 leading-[1.7] max-w-md mx-auto">
                Allan&rsquo;s public calendar is updated as engagements are
                confirmed. To hear him sooner — or to bring him to your own
                event — a private booking remains the surest way.
              </p>

              {/* Fleuron rule — bottom */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center gap-3 mt-12 mb-10"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="text-gold/60 text-[10px] tracking-[0.4em]">
                  ✦
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              {/* CTAs — primary gold + understated text link */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7">
                <Link
                  href="/booking"
                  className="group inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-medium tracking-[0.08em] uppercase text-black transition-all duration-300 hover:bg-champagne hover:shadow-[0_0_0_4px_rgba(201,166,70,0.12)] focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Request a Private Booking
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase text-foreground/75 transition-colors duration-300 hover:text-foreground focus:outline-none focus:text-foreground"
                >
                  <span className="relative">
                    Notify me of public dates
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-50 bg-gold/60 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                  <span aria-hidden="true" className="text-gold/80">
                    →
                  </span>
                </Link>
              </div>

              {/* Live indicator — signals the calendar is alive, not abandoned */}
              <div className="mt-16 flex items-center justify-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span className="font-serif italic text-xs md:text-sm text-muted-foreground/70 tracking-wide">
                  the score is in revision
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
