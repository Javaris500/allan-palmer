"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Copy, X, Mail, Phone, Sparkles } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { CONTACT_INFO } from "@/lib/constants";

type Frequency = "once" | "monthly";

const PRESET_ONCE = [20, 50, 100, 250] as const;
const PRESET_MONTHLY = [5, 15, 50] as const;

const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    amount: 5,
    tagline: "Keep the music free",
    perks: ["Early access to new recordings", "Name in programme notes"],
  },
  {
    id: "silver",
    name: "Silver",
    amount: 15,
    tagline: "Quiet patronage",
    perks: [
      "Everything in Bronze",
      "Behind-the-scenes studio recordings",
      "Quarterly letter from Allan",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    amount: 50,
    tagline: "Allan's champions",
    perks: [
      "Everything in Silver",
      "Annual private concert invitation",
      "First-look on new repertoire",
    ],
  },
] as const;

const IMPACT = [
  { amount: "$20", impact: "A week of strings, rosin, and bow care" },
  { amount: "$50", impact: "Sheet music for a new arrangement" },
  { amount: "$100", impact: "A full lesson for a student on scholarship" },
] as const;

const FAQ = [
  {
    q: "Is my gift tax-deductible?",
    a: "Not at this time. Allan is an individual musician rather than a registered charity, so gifts are not eligible for tax receipts. Every dollar goes directly to his music and teaching.",
  },
  {
    q: "Can I cancel a monthly patronage?",
    a: "Anytime, with no questions. You'll be able to manage or cancel from your account once online payments launch. For now, an e-transfer is a single intentional choice — restart whenever it feels right.",
  },
  {
    q: "Is there a minimum amount?",
    a: "No. A $5 one-time gift matters. So does $500. Give what feels right — what you're supporting is the work, not the number.",
  },
  {
    q: "Can I support Allan another way?",
    a: "Yes — share a favourite video, recommend him for a wedding, leave a kind note, or book him for an event. Word of mouth is the lifeblood of a working violinist.",
  },
];

export function DonatePage() {
  const reduced = useReducedMotion();
  const [freq, setFreq] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>("silver");
  const [copied, setCopied] = useState(false);

  const effectiveAmount = customAmount
    ? Number.parseFloat(customAmount) || 0
    : (amount ?? 0);

  const fadeUp = (delay = 0) => ({
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: reduced
      ? { duration: 0 }
      : { duration: 0.9, ease: EASE_OUT, delay },
  });

  const handleTierSelect = (tier: (typeof TIERS)[number]) => {
    setFreq("monthly");
    setSelectedTier(tier.id);
    setAmount(tier.amount);
    setCustomAmount("");
  };

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
    setSelectedTier(null);
  };

  const handleContinue = () => {
    if (effectiveAmount <= 0) return;
    setModalOpen(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: do nothing — UI still shows email
    }
  };

  // Esc closes modal
  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const presets = freq === "once" ? PRESET_ONCE : PRESET_MONTHLY;

  return (
    <div className="relative overflow-hidden">
      {/* ──────────────────────────────────────────────
          HERO
      ────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        {/* Ambient warmth */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,hsl(var(--gold)/0.07)_0%,transparent_70%)]" />
        </div>

        {/* F-hole watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-24 opacity-[0.04] select-none hidden md:block"
        >
          <Image
            src="/images/f-hole.svg"
            alt=""
            width={180}
            height={520}
            className="text-champagne"
          />
        </div>

        <div className="container relative">
          <motion.div
            className="flex items-center justify-center gap-4 mb-10 md:mb-14"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }
            }
          >
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
            <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
              In Support Of
            </span>
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
          </motion.div>

          <motion.h1
            className="font-display font-light text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] max-w-3xl mx-auto"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.15 }
            }
          >
            Keep the music <em className="text-champagne">playing.</em>
          </motion.h1>

          <motion.p
            className="mt-6 md:mt-8 font-display italic text-center text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.35 }
            }
          >
            A violin asks for strings, rosin, repair, and quiet hours of study.
            Your support keeps Allan&rsquo;s music free, evolving, and in reach
            of the next student at the door.
          </motion.p>

          <div className="divider-gold-sm mt-10 md:mt-14" />
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          GIFT BUILDER
      ────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20">
        <div className="container max-w-2xl">
          {/* Frequency toggle */}
          <motion.div
            {...fadeUp(0)}
            className="flex justify-center mb-10"
            role="tablist"
            aria-label="Gift frequency"
          >
            <div className="inline-flex border border-champagne/25 rounded-sm p-1 bg-surface/40 backdrop-blur-sm">
              {(
                [
                  { id: "once", label: "One Time" },
                  { id: "monthly", label: "Monthly" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={freq === opt.id}
                  onClick={() => {
                    setFreq(opt.id);
                    setAmount(opt.id === "once" ? 50 : 15);
                    setCustomAmount("");
                    setSelectedTier(opt.id === "monthly" ? "silver" : null);
                  }}
                  className={`relative px-6 md:px-8 py-2.5 label-caps !text-[10px] md:!text-[11px] !tracking-[0.25em] transition-colors duration-500 ease-cinematic ${
                    freq === opt.id
                      ? "!text-ink"
                      : "!text-muted-foreground hover:!text-champagne"
                  }`}
                >
                  {freq === opt.id && (
                    <motion.span
                      layoutId="freq-pill"
                      className="absolute inset-0 bg-gold rounded-sm"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                    />
                  )}
                  <span className="relative">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Amount selector */}
          <motion.div {...fadeUp(0.1)} className="mb-10">
            <p className="label-caps text-center mb-5 !tracking-[0.3em]">
              Choose an Amount
            </p>
            <div className="grid grid-cols-4 gap-2 md:gap-3 mb-3">
              {presets.map((val) => {
                const isActive = amount === val && !customAmount;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountSelect(val)}
                    className={`py-3.5 rounded-sm border transition-all duration-500 ease-cinematic ${
                      isActive
                        ? "border-gold bg-gold/10 text-foreground"
                        : "border-champagne/20 hover:border-champagne/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="font-display text-xl md:text-2xl tabular-nums">
                      ${val}
                    </span>
                    {freq === "monthly" && (
                      <span className="block text-[9px] tracking-[0.2em] uppercase mt-0.5 text-muted-foreground/70">
                        /mo
                      </span>
                    )}
                  </button>
                );
              })}
              {/* Custom */}
              <button
                type="button"
                onClick={() => {
                  setAmount(null);
                  setSelectedTier(null);
                  const el = document.getElementById("custom-amount");
                  el?.focus();
                }}
                className={`py-3.5 rounded-sm border transition-all duration-500 ease-cinematic ${
                  customAmount
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-champagne/20 hover:border-champagne/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-display text-xl md:text-2xl italic">
                  Other
                </span>
              </button>
            </div>

            <div className="relative max-w-xs mx-auto">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 font-display text-lg text-muted-foreground/70 pointer-events-none"
                aria-hidden="true"
              >
                $
              </span>
              <input
                id="custom-amount"
                type="number"
                inputMode="decimal"
                min={1}
                max={10000}
                step={1}
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(null);
                  setSelectedTier(null);
                }}
                aria-label="Custom gift amount in Canadian dollars"
                className="w-full bg-transparent border-0 border-b border-champagne/25 focus:border-gold pl-7 pr-2 py-2.5 text-center font-display text-lg placeholder:text-muted-foreground/40 focus:outline-none transition-colors duration-300"
              />
            </div>
            <p className="text-center mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
              All amounts in Canadian dollars
            </p>
          </motion.div>

          {/* Continue CTA */}
          <motion.div {...fadeUp(0.2)} className="flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              disabled={effectiveAmount <= 0}
              className="group inline-flex items-center justify-center bg-gold text-ink px-10 py-4 rounded-sm font-label text-xs tracking-[0.22em] uppercase transition-all duration-500 ease-cinematic hover:bg-champagne disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>
                {effectiveAmount > 0
                  ? `Give $${effectiveAmount.toFixed(effectiveAmount % 1 === 0 ? 0 : 2)}${freq === "monthly" ? " monthly" : ""}`
                  : "Choose an amount"}
              </span>
            </button>
          </motion.div>

          <p className="text-center mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 max-w-sm mx-auto leading-relaxed">
            Gifts support Allan&rsquo;s music and are not tax-deductible.
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          TIER CARDS — only visible when Monthly selected
      ────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {freq === "monthly" && (
          <motion.section
            key="tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative border-t border-champagne/10 overflow-hidden"
          >
            <div className="container py-16 md:py-20 max-w-5xl">
              <motion.div {...fadeUp(0)} className="text-center mb-12 md:mb-16">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-10 md:w-14 bg-champagne/40" />
                  <span className="label-caps !text-[10px] !tracking-[0.35em]">
                    Patron Circles
                  </span>
                  <div className="h-px w-10 md:w-14 bg-champagne/40" />
                </div>
                <h2 className="font-display font-light text-3xl md:text-4xl tracking-tight">
                  Choose a circle.
                </h2>
                <p className="mt-4 font-display italic text-sm md:text-base text-muted-foreground/70 max-w-md mx-auto">
                  Three quiet ways to keep the work moving.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                {TIERS.map((tier, idx) => {
                  const isActive = selectedTier === tier.id;
                  return (
                    <motion.button
                      key={tier.id}
                      type="button"
                      onClick={() => handleTierSelect(tier)}
                      {...fadeUp(0.05 * idx)}
                      className={`group text-left p-7 md:p-8 rounded-sm border transition-all duration-500 ease-cinematic ${
                        isActive
                          ? "border-gold bg-surface/60"
                          : "border-champagne/20 hover:border-champagne/50 bg-surface/20 hover:bg-surface/40"
                      }`}
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="label-caps !text-[10px] !tracking-[0.3em]">
                          {tier.name}
                        </span>
                        {isActive && (
                          <Check
                            className="h-4 w-4 text-gold"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="font-display text-4xl md:text-5xl font-light tabular-nums">
                          ${tier.amount}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                          /mo
                        </span>
                      </div>
                      <p className="font-display italic text-sm md:text-base text-muted-foreground/80 mb-6">
                        {tier.tagline}
                      </p>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-2">
                            <span className="text-champagne/70 mt-[2px]">
                              —
                            </span>
                            <span className="leading-relaxed">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────
          IMPACT STRIP
      ────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 border-t border-champagne/10">
        <div className="container max-w-4xl">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
              <span className="label-caps !text-[10px] !tracking-[0.35em]">
                Your Gift
              </span>
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
            </div>
            <h2 className="font-display font-light text-3xl md:text-4xl tracking-tight">
              Where it goes.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {IMPACT.map((item, idx) => (
              <motion.div
                key={item.amount}
                {...fadeUp(0.05 * idx)}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl text-champagne font-light tabular-nums leading-none mb-4">
                  {item.amount}
                </p>
                <div className="divider-gold-sm mb-4" />
                <p className="font-display italic text-sm md:text-base text-muted-foreground/80 leading-relaxed">
                  {item.impact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          LETTER FROM ALLAN
      ────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 border-t border-champagne/10">
        <div className="container max-w-2xl">
          <motion.blockquote {...fadeUp(0)} className="text-center">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
              <span className="label-caps !text-[10px] !tracking-[0.35em]">
                A Note from Allan
              </span>
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
            </div>
            <p className="font-display italic font-light text-xl md:text-2xl lg:text-[1.6rem] text-foreground/90 leading-[1.5] tracking-tight">
              &ldquo;The violin has always taken more than it gives back —
              strings that wear, bows that need work, quiet years of study no
              audience ever sees. What you give here goes directly into the
              craft, into sheet music, into the lesson of the next student who
              couldn&rsquo;t otherwise afford one. I&rsquo;m grateful
              you&rsquo;re reading this page at all.&rdquo;
            </p>
            <cite className="block mt-8 label-caps !text-[10px] !tracking-[0.3em] not-italic">
              — Allan Palmer · Winnipeg
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          ALTERNATE WAYS
      ────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 border-t border-champagne/10">
        <div className="container max-w-3xl">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
              <span className="label-caps !text-[10px] !tracking-[0.35em]">
                Other Ways To Give
              </span>
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
            </div>
            <h2 className="font-display font-light text-2xl md:text-3xl tracking-tight">
              Prefer something else?
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="grid md:grid-cols-2 gap-6">
            <div className="p-7 border border-champagne/20 rounded-sm bg-surface/20">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-champagne" strokeWidth={1.5} />
                <span className="label-caps !text-[10px] !tracking-[0.25em]">
                  E-Transfer
                </span>
              </div>
              <p className="font-display text-sm text-foreground/80 leading-relaxed mb-4">
                Send an Interac e-Transfer to Allan directly. Any amount.
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-champagne hover:text-cream transition-colors duration-300"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {CONTACT_INFO.email}
                  </>
                )}
              </button>
            </div>

            <div className="p-7 border border-champagne/20 rounded-sm bg-surface/20">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-champagne" strokeWidth={1.5} />
                <span className="label-caps !text-[10px] !tracking-[0.25em]">
                  Corporate & Large Gifts
                </span>
              </div>
              <p className="font-display text-sm text-foreground/80 leading-relaxed mb-4">
                For businesses or gifts above $500, reach Allan personally.
              </p>
              <a
                href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`}
                className="font-mono text-xs tracking-wider text-champagne hover:text-cream transition-colors duration-300"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          FAQ
      ────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 border-t border-champagne/10">
        <div className="container max-w-2xl">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
              <span className="label-caps !text-[10px] !tracking-[0.35em]">
                Questions
              </span>
              <div className="h-px w-10 md:w-14 bg-champagne/40" />
            </div>
            <h2 className="font-display font-light text-2xl md:text-3xl tracking-tight">
              Things people often ask.
            </h2>
          </motion.div>

          <motion.dl {...fadeUp(0.1)} className="space-y-10">
            {FAQ.map((item, idx) => (
              <div
                key={item.q}
                className={idx > 0 ? "pt-10 border-t border-champagne/10" : ""}
              >
                <dt className="font-display text-lg md:text-xl text-foreground/90 mb-3 tracking-tight">
                  {item.q}
                </dt>
                <dd className="font-display italic text-sm md:text-base text-muted-foreground/80 leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          CLOSING
      ────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 border-t border-champagne/10">
        <div className="container max-w-xl text-center">
          <div className="divider-gold-sm mb-8" />
          <p className="font-display italic font-light text-xl md:text-2xl text-foreground/85 leading-[1.4] mb-10">
            Thank you for being here — quietly, or generously, or at all.
          </p>
          <Link
            href="/"
            className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
          >
            Return to site
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          CONTINUE MODAL — interim e-transfer flow
      ────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="donate-modal-title"
          >
            <motion.div
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }
              }
              transition={{ duration: 0.4, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-background border border-champagne/25 rounded-sm p-8 md:p-10 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center text-muted-foreground hover:text-champagne transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 border border-gold/30 mb-5">
                  <Sparkles className="h-5 w-5 text-gold" strokeWidth={1.5} />
                </div>
                <h3
                  id="donate-modal-title"
                  className="font-display font-light text-2xl md:text-3xl tracking-tight"
                >
                  Thank you.
                </h3>
                <div className="divider-gold-sm mt-4 mb-5" />
                <p className="font-display italic text-sm text-muted-foreground/80 leading-relaxed">
                  Card payments launch soon. For now, send your gift of{" "}
                  <span className="text-champagne not-italic font-medium">
                    $
                    {effectiveAmount.toFixed(effectiveAmount % 1 === 0 ? 0 : 2)}
                    {freq === "monthly" ? " / month" : ""}
                  </span>{" "}
                  by Interac e-Transfer.
                </p>
              </div>

              <div className="rounded-sm border border-champagne/20 bg-surface/40 p-5 mb-5">
                <p className="label-caps !text-[9px] !tracking-[0.3em] text-center mb-3">
                  Send To
                </p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="w-full group inline-flex items-center justify-center gap-2 font-mono text-sm tracking-wider text-champagne hover:text-cream transition-colors duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={2} />
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {CONTACT_INFO.email}
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed mb-5">
                Add &ldquo;Support —{" "}
                {freq === "monthly" ? "Monthly" : "One-time"}
                &rdquo; in the memo. Password: any word Allan recognizes —
                he&rsquo;ll know.
              </p>

              <a
                href={`mailto:${CONTACT_INFO.email}?subject=Support%20Allan%20-%20${freq === "monthly" ? "Monthly%20Patronage" : "One-time%20Gift"}&body=Hi%20Allan%2C%0A%0AI%27d%20like%20to%20send%20a%20${freq === "monthly" ? "monthly" : "one-time"}%20gift%20of%20%24${effectiveAmount}%20CAD.%20Please%20let%20me%20know%20the%20best%20way%20to%20do%20that.%0A%0AThank%20you.`}
                className="w-full inline-flex items-center justify-center bg-gold text-ink px-6 py-3 rounded-sm font-label text-xs tracking-[0.22em] uppercase hover:bg-champagne transition-colors duration-500 ease-cinematic"
              >
                Email Allan Instead
              </a>

              <p className="mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                Gifts are not tax-deductible
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
