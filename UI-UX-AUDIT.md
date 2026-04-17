# Allan Palmer — Full UI/UX Audit

**Date:** 2026-04-16
**Scope:** All pages and components
**Method:** 5 parallel specialist audits (home/layout, forms, media, content pages, auth/admin)

---

## Overall Grade: **B- / C+**

| Audit Area | Grade |
|---|---|
| Home / Layout / Navigation | **B** |
| Booking / Contact / Forms | **C+** |
| Gallery / Media / Video | **C+** |
| About / Services / Lessons | **B-** |
| Auth / Admin / Errors | **C+** |

The site looks polished and on-brand visually, but has systemic **accessibility failures**, a few **broken flows**, and **dead code** stacked next to active code that creates ambiguity.

---

## TOP 10 CRITICAL ISSUES (fix first)

1. **Admin has zero authentication** — `/admin` and `/admin/emails` are world-readable. `app/admin/layout.tsx:8` is a pass-through. Email templates with contact details are exposed.
2. **Booking form uses `mailto:` with no fallback or success state** — `app/booking/page.tsx:77`. ~30% of mobile users have no mail client; they'll silently fail. Success page exists but is never reached.
3. **Booking success page lies** — `components/booking/booking-success.tsx:119` claims "A confirmation email has been sent" when no email is ever dispatched.
4. **Every booking form label is disconnected from its input** — no `htmlFor`/`id` pairs anywhere in `app/booking/page.tsx:118–239`. Clicking labels doesn't focus fields; screen readers can't name any input.
5. **Contact form errors have no `aria-invalid`, no `role="alert"`, no `aria-describedby`** — `contact-form.tsx:164–174`. Screen reader users get zero feedback on submit.
6. **Lightbox has no `role="dialog"`, no focus trap, no focus restore** — `components/ui/lightbox.tsx`. Keyboard users trapped outside the modal.
7. **`VideoThumbnailGrid` uses live `MuxVideoPlayer` as thumbnails** — `components/video-thumbnail-grid.tsx:193`. Spins up HLS.js + `<video>` per card. Huge perf hit. `OptimizedVideoThumbnail` already exists.
8. **No captions on any video** — `mux-video-player.tsx:413`, `video-showcase.tsx:232`. WCAG 1.2.2 failure. No `<track>` anywhere.
9. **Gold token fails WCAG AA** — `hsl(43 80% 55%)` on dark semi-transparent backgrounds ≈ 3.1:1 (below 4.5:1). Affects every hero subtitle/badge.
10. **Services page has no pricing** — `/services` is a 30-row feature matrix with zero prices. Conversion blocker for a booking site.

---

## MAJOR ISSUES

### Navigation / Layout
- **Two hero components exist** (`hero-section.tsx` + `hero-section-v2.tsx`). Only v2 is used — delete the other.
- `hero-section-v2.tsx:691,703,717` — play/mute/fullscreen buttons lack `aria-label`s (v1 had them).
- Video seek bar is a `<div onClick>` — not keyboard operable. Needs `role="slider"`, `aria-valuenow`, `onKeyDown`.
- `simple-footer.tsx:42–43` — "Private Events" and "Corporate Events" both link to `/services#private`.
- `BackToTop` component is orphaned but would stack at the same `bottom-6 right-6 z-50` as the FloatingNav FAB.
- No Framer Motion `useReducedMotion` guards on hero, page transitions, or split testimonials. CSS `prefers-reduced-motion` doesn't catch JS-driven Framer animations.
- `page-hero.tsx:134` — Bottom fade uses `from-background` creating a warm-white band in dark mode.
- `tailwind.config.ts:106–116` — Shadow tokens are hardcoded light-mode RGBA; invisible on dark backgrounds.

### Forms / Booking / Contact
- `contact-info.tsx:99` — "Use Booking Form" link points to `/services` (broken intent).
- `contact-form.tsx:100` — Network failure writes to `errors.message`, making the textarea look invalid.
- `progress-stepper.tsx:63` — Step circles are `<div onClick>`, no keyboard access.
- Date/time inputs on dark background render native OS chrome (no theming), double-icon on Chrome/Edge.
- `simple-contact-section.tsx:38` — Button height reverse-responsive (`md:h-12 h-14`) causes resize jump.
- `booking-success.tsx:138` — "View My Bookings" link; `/my-bookings` flow is email-lookup based, not session.
- Three different submit copy strings for the same intent ("Send Booking Request", "Send Message", "Send Email").
- `booking-wizard.tsx` — Legacy 5-step wizard dead code (~500 lines), never rendered.
- `contact-questionnaire.tsx` — Not wired to any API; mock `setTimeout`.

### Gallery / Media
- Carousel arrows (`photo-gallery-carousel.tsx:382`) and 30 dot indicators (line 496) have no `aria-label`.
- Theater close button (`video-gallery-immersive.tsx:131`) has no label.
- `VideoShowcase` seek bar not keyboard-accessible.
- `GalleryTabs:46` — Inactive tab `text-muted-foreground` ~3.2:1, AA failure.
- `gallery-preload-images.tsx` — Renders hidden `<Image width={1} height={1}>` that get re-fetched at real sizes.
- Reel card play button only visible on hover (no touch affordance).
- `VideoPlayer` modal missing Esc key, focus management, and focus-return.
- Autoplay carousel has no pause button (WCAG 2.2.2).

### About / Services / Lessons
- `about-media.tsx:19` — Missing `font-serif` (breaks brand contract vs every other About heading).
- `AboutTestimonials` shows only initials; `TestimonialsSection` and `SplitScreenTestimonials` show full names. Inconsistent credibility.
- Quote icons use `text-primary/30` in two components, `text-gold/30` in one — visual mismatch.
- `services-comparison-chart.tsx:211–231` — 35+ rows animate on mount with `animate` (not `whileInView`), delayed up to 1.5s.
- `SplitScreenTestimonials` has no reduced-motion guard on the 0.7s image swap and continuous progress bar.
- Lessons "Get Notified" CTA routes to `/contact` — misleading; not an email capture.
- Comparison chart not horizontally scrollable on mobile — content crushed to ~70px columns.
- YouTube iframe missing `loading="lazy"` in `about-media.tsx:33`.

### Auth / Admin / Errors
- `global-error.tsx:19` uses raw `<button>` inline, no brand, no serif.
- Admin tables missing `<caption>` and `scope="col"` (a11y).
- Expand/collapse buttons missing `aria-expanded` and `aria-controls` (admin + my-bookings).
- Status badges (`my-bookings/page.tsx:57–63`) — `bg-amber-500/15 text-amber-500` fails 4.5:1.
- Email lookup input has no `<label>` — WCAG 1.3.1 + 2.4.6 failure.
- Admin emails `<iframe>` has no `sandbox` attribute.
- My-bookings error state has no retry button, no icon, no color distinction.
- `app/error.tsx` has no brand icon, no serif heading — breaks brand on failure.

---

## MINOR / POLISH HIGHLIGHTS

- Stats card labels at `text-[10px]` (`about-hero.tsx:133`) — illegible.
- `about-timeline.tsx` "Born 1999" entry is filler; "20+ years experience" inconsistent with birth year.
- Testimonial data duplicated across 3 files — should be in `lib/testimonials.ts`.
- Song cards in `SongCatalog` have hover styles but are not interactive (misleading).
- Admin dashboard says "contact your developer" instead of linking to `/studio`.
- `not-found.tsx` music icon missing `aria-hidden="true"`.
- `app/loading.tsx` has no `role="status"`.
- Skeleton `animate-pulse` missing `motion-reduce:animate-none`.
- `simple-footer.tsx` social icons `target="_blank"` without "(opens in new tab)" in `aria-label`.
- Required field legend missing from both forms.
- No character counter on textarea fields.
- `PageTransition` has no reduced-motion guard.
- `VideoShowcase` play button `animate-ping` runs without `motion-reduce` guard.
- `SongCatalog` search missing `aria-live` for result count.
- `GallerySection` homepage images have no lightbox (inconsistent with `/gallery`).

---

## DESIGN-LEVEL RECOMMENDATIONS

1. **Lift the gold token's luminance in dark mode** from `43 80% 55%` → ~`43 80% 62%` to pass AA on dark transparents, or enforce `font-semibold` on all gold text (≥18.66px bold passes at 3:1).
2. **Replace the `mailto:` booking with a real API** — you already have `/api/booking`. Route to `/booking/success` and trigger Resend.
3. **Consolidate duplicate components** — delete `hero-section.tsx` (v1), `booking-wizard.tsx` (unused), orphan `BackToTop`, and `contact-questionnaire.tsx` (not wired). ~1,500 lines of dead code.
4. **Extract shared data** — `lib/testimonials.ts`, unify `thumbnailConfigs` duplicated in video-player + mux-video-player.
5. **Introduce a pricing tier section on `/services`** — three cards (Ceremony / Cocktail / Full Event) with "Starting from $X" or CTAs.
6. **Add a `useReducedMotion()`-guarded `<MotionWrapper>`** used everywhere instead of raw Framer `motion.*`.
7. **Standardize sticky offsets** with a CSS custom property `--nav-height` so search bars, letter headers, and modals don't fight each other.
8. **Replace the mailto booking CTA copy with one standard** — "Submit Booking Request" site-wide.
9. **Trim nav from 7 → 7 by swapping `My Bookings` → `Donate`** (keeps Services' gold highlight as sole accent).

---

## NAVIGATION CHANGE — Add Donate

**Current nav (7 items):**
`Home · About · Repertoire · Gallery · Book · My Bookings · Services`

Source: `lib/constants.ts:36` (`NAVIGATION_ITEMS`) + two appended items in `components/floating-nav.tsx:45–47`.

**Problem:** Nav is overcrowded; need room for a Donate link.

**Recommended swap: remove `My Bookings`, add `Donate`.**

Why `My Bookings` is the right one to cut:
- Utility/post-conversion page — users who've already booked typically arrive via their confirmation email link, not by navigating from the top nav.
- Lowest traffic surface and zero top-of-funnel value.
- Easily relocated: small "Already booked? Check status →" link on `/booking`, plus a footer link.

Why NOT to cut the others:
- **Home / About** — brand anchors; expected.
- **Book** — primary CTA; never.
- **Services** — gold-highlighted conversion lever.
- **Gallery** — visual proof, critical for a performing artist.
- **Repertoire** — second-best cut if you ever need a 6-item nav, but it earns its slot by showing range. Could be folded into `/services` as a tab later if more trimming is needed.

Note on **Lessons**: not currently in the nav, and should stay out while it's in "Coming Soon" state. Add it only once launched.

**Proposed new nav (7 items):**
`Home · About · Repertoire · Gallery · Book · Services · Donate`

**Implementation decisions needed:**
- Donate destination: external (Stripe / PayPal / GoFundMe) or internal `/donate` page?
- Gold `highlight: true` treatment: keep on Services only, or share with Donate? (Recommend keep on Services — two gold items dilute the visual hierarchy.)

**Files to touch:**
- `lib/constants.ts:36–42` — `NAVIGATION_ITEMS` (no change needed; appended items live in the nav component).
- `components/floating-nav.tsx:24–47` — remove `/my-bookings` entry and icon mapping; add `/donate` (or external URL) with a `HandHeart` or `Heart` Lucide icon.
- `components/simple-footer.tsx` — add "My Bookings" link to the footer so the flow isn't lost.
- `components/booking/booking-success.tsx` — keep the "View My Bookings" CTA (it's the primary entry for that flow now).

---

## KEY FILES TO TOUCH (priority order)

```
app/admin/layout.tsx                    ← add auth guard (CRITICAL)
app/booking/page.tsx                    ← mailto → API, label associations, date/time
components/booking/booking-success.tsx  ← remove false email claim
components/contact/contact-form.tsx     ← ARIA, error handling
components/ui/lightbox.tsx              ← focus trap, dialog role
components/video-thumbnail-grid.tsx     ← swap MuxVideoPlayer → OptimizedVideoThumbnail
components/mux-video-player.tsx         ← add <track>
components/hero-section-v2.tsx          ← aria-labels, slider role, useReducedMotion
app/globals.css / tailwind.config.ts    ← gold luminance, dark-mode shadows
app/services/page.tsx                   ← pricing
app/error.tsx + app/global-error.tsx    ← brand + icon + serif
app/my-bookings/page.tsx                ← label on email input, badge contrast, retry
components/about/about-media.tsx        ← font-serif, iframe lazy

DELETE:
  components/hero-section.tsx           ← v1, superseded by v2
  components/booking/booking-wizard.tsx ← legacy form wizard
  components/back-to-top.tsx            ← orphaned, z-index conflict
  components/contact/contact-questionnaire.tsx ← not wired
```

---

## DETAILED FINDINGS BY AREA

### 1. Home / Layout / Navigation

**Grades**
- Visual Hierarchy & Typography: **B+**
- Color & Contrast (WCAG AA): **C+**
- Spacing & Rhythm: **B**
- Accessibility: **C**
- Responsive Design: **B**
- Interactive States: **B+**
- Brand Consistency: **B+**

**Critical**
- Gold `hsl(43 80% 55%)` on dark transparents ≈ 3.1:1 — fails AA (hero-section-v2.tsx:363,382,500; page-hero.tsx:105).
- `hero-section-v2.tsx:691,703,717` — play/mute/fullscreen buttons missing `aria-label` (v1 had them).
- Seek bar is a `<div onClick>` — not keyboard operable (`hero-section-v2.tsx:675`, `hero-section.tsx:465`).

**Major**
- Framer Motion bypasses `prefers-reduced-motion` — add `useReducedMotion()` guards.
- `hero-section.tsx` is dead code (page.tsx imports v2 only).
- Mobile h1 at `text-3xl` (30px) is undersized for a portfolio anchor.
- `simple-footer.tsx:42–43` duplicate anchor; `/services#private` twice.
- `SectionLoading` skeleton missing `role="status"`.
- `BackToTop` at identical `bottom-6 right-6 z-50` as FloatingNav — stacking risk.

**Minor**
- `page-hero.tsx:77` breadcrumb `<nav>` missing `aria-label`.
- Redundant `role="contentinfo"` on `<footer>`.
- Social icon links don't indicate new tab in labels.
- `floating-nav.tsx:103` unnecessary `?.` chain.
- `globals.css:183–189` base heading styles conflict with per-page overrides.
- `tailwind.config.ts:106–116` shadows not dark-mode aware.

**Polish**
- Desktop caption reads "Tap to play" but renders on ≥768px (use "Click").
- `background-music-toggle.tsx:12` flash-in on navigation due to inline 0.5s delay.

---

### 2. Booking / Contact / Forms

**Grades**
- Form UX: **B**
- Inputs / Focus / Disabled: **B+**
- Progressive Disclosure: **C+**
- Button Hierarchy / Loading: **B**
- Mobile Usability: **C+**
- Accessibility: **D+**
- Post-Submit Feedback: **B-**
- Copy Quality: **B+**
- Color / Contrast: **C**
- Trust Signals: **C+**

**Critical**
- `app/booking/page.tsx:118–239` — no `htmlFor`/`id` on any label.
- `contact-form.tsx:164` — no `aria-invalid`, no `role="alert"`, no `aria-describedby`.
- `app/booking/page.tsx:76–77` + `booking-wizard.tsx:103–105` — `mailto:` with no fallback, no success state.
- `booking-success.tsx:119` — false claim about confirmation email.

**Major**
- `booking/error.tsx:21` — raw `<span>!</span>` icon, no `aria-label`.
- `contact-form.tsx:100` — network failure misattributed to message field.
- `progress-stepper.tsx:63` — clickable step circles, no keyboard access.
- Select element at `contact-form.tsx:259–272` — no ARIA wiring, visually inconsistent (raw vs shadcn).
- `app/booking/page.tsx:202–210` — date/time inputs render OS chrome, double-icon on Chrome/Edge.
- `contact-info.tsx:99` — "Use Booking Form" points to `/services`.
- `app/booking/page.tsx:218` — `py-2.5` time input ~40px, below 44px touch target.

**Minor**
- `contact-questionnaire.tsx:96` — unused, mock setTimeout.
- `booking/error.tsx:31` — no `aria-live` on retry feedback.
- Min-date inconsistency: contact uses today, booking uses tomorrow.
- `simple-contact-section.tsx:38` — reverse-responsive button height.
- `contact-form.tsx:292–318` — MessageSquare icon less brand-appropriate than Music.
- `booking-wizard.tsx` — 5-step wizard rendered nowhere.

**Polish**
- No required-field legend.
- `/my-bookings` link on success screen — low-session feature.
- Three submit copy variants for the same intent.
- Error `motion.p` animations lack `motion-reduce:` guard.
- No character counter on textareas.

---

### 3. Gallery / Media / Video

**Grades**
- Gallery Grid: **B+**
- Lightbox UX: **C**
- Video Controls: **B**
- Loading / Error States: **B+**
- Image Optimization: **B-**
- Touch Gestures: **D**
- Accessibility: **D+**
- Overlay Contrast: **C+**
- Visual Hierarchy: **A-**
- Performance: **C**

**Critical**
- `components/ui/lightbox.tsx` — no `role="dialog"`, no `aria-modal`, no focus trap, no restore.
- `video-thumbnail-grid.tsx:193` — live `MuxVideoPlayer` per card (should be `OptimizedVideoThumbnail`).
- `mux-video-player.tsx:413`, `video-showcase.tsx:232` — no `<track>` captions anywhere.

**Major**
- `gallery-preload-images.tsx:9` — wasteful 1×1px preload pattern.
- `photo-gallery-carousel.tsx:382–404` — arrow buttons missing `aria-label`.
- `photo-gallery-carousel.tsx:496–504` — 30 dot buttons unlabeled, no `aria-current`.
- `video-gallery-immersive.tsx:131` — close button missing `aria-label`.
- `video-player.tsx:140–159` — modal missing focus management, Esc handler, focus return.
- `video-showcase.tsx:318` — seek bar not keyboard accessible.
- `gallery-tabs.tsx:46` — inactive tab contrast ~3.2:1, AA failure.
- `song-catalog.tsx:233` — sticky offset conflict with search bar.

**Minor**
- `photo-gallery-carousel.tsx:370` — `unoptimized` flag bypasses WebP/resize.
- Duplicate `thumbnailConfigs` in video-player + mux-video-player.
- No visible pause control on autoplay carousel.
- `video-gallery-immersive.tsx:388` — play button hover-only.
- `video-showcase.tsx:277` — `animate-ping` without `motion-reduce`.
- `songs-showcase.tsx:148` — generic alt text.
- `song-catalog.tsx:251–270` — cards look interactive but aren't.
- Carousel thumbnails — focus visible only via `ring-2`, no aria-label per item.

**Polish**
- Theater sidebar has no scroll-to-active.
- Video category filter missing `aria-pressed`.
- SongCatalog search missing `aria-controls` + `aria-live`.
- GallerySection homepage images have no lightbox.
- MuxVideoPlayer error state leaks partial playback ID.

---

### 4. About / Services / Lessons / Testimonials

**Grades**
- Information Architecture: **B+**
- Visual Hierarchy: **B**
- Long-form Readability: **B-**
- Testimonial Credibility: **B**
- Services / Pricing Cards: **C+**
- Animation Quality: **C**
- Motion Accessibility: **B+**
- Mobile Layout: **C+**
- Color / Contrast: **B**
- Cross-page Consistency: **C+**

**Critical**
- `/services` has no pricing — 30-row feature matrix with zero prices or packages.
- `split-screen-testimonials.tsx:80–98,183–191` — no `useReducedMotion` on 0.7s swap + continuous progress bar.
- `services-comparison-chart.tsx:211–229` — 35+ rows animate on mount (not `whileInView`), delays up to 1.5s.

**Major**
- `about-media.tsx:19` — missing `font-serif`.
- `about-testimonials.tsx:13–27` — initials only, no avatars, breaks credibility parity.
- Quote icon inconsistency: `text-primary/30` vs `text-gold/30` across components.
- `split-screen-testimonials.tsx:137–153` — right column empty on mobile, nav buttons below fold.
- Lessons "Get Notified" → `/contact` (misleading CTA).
- `services-comparison-chart.tsx:195` — no `overflow-x-auto` on mobile, 70px columns.

**Minor**
- `about-hero.tsx:133` — `text-[10px]` stats labels.
- `page-transition.tsx:14` — no reduced-motion guard.
- "Born 1999" timeline entry is filler.
- `about-philosophy.tsx:43–74` — double `whileInView` + `AnimatedElement`.
- `about-media.tsx:33` — iframe missing `loading="lazy"`.
- `app/lessons/page.tsx:78` — offering grid needs `role="list"`.
- `about-timeline.tsx:74,84` — mobile line/dot alignment.
- `testimonials-section.tsx:219–229` — dots missing `aria-current`.

**Polish**
- Duplicate CTAs on `/services` (header + chart end).
- `SectionSkeleton` low contrast in dark mode.
- Philosophy points at `text-sm` subordinate to intro.
- Testimonial data duplicated in 3 files.
- "20+ years experience" vs birth year 1999 inconsistency.

---

### 5. Auth / Admin / My-Bookings / Errors

**Grades**
- UI Primitive Consistency: **B+**
- Empty States: **A-**
- Error State Clarity: **C+**
- Loading State Design: **B**
- Auth UX: **N/A (incomplete)**
- Admin Dashboard: **B-**
- Form/Table Accessibility: **C**
- Status Badge Contrast: **B**
- Brand Consistency: **A-**
- 404/500 Pages: **B+**

**Critical**
- `app/admin/layout.tsx:8` — no auth, no middleware, no session check.
- `app/my-bookings/page.tsx:131` — raw `<input>`, no `<label>`.
- `app/my-bookings/page.tsx:57–63` — amber-500/15 + amber-500 text ≈ 2.8:1 failure.

**Major**
- `global-error.tsx:19` — raw `<button>`, inconsistent with design system.
- `app/admin/page.tsx:231`, `my-bookings/page.tsx:213` — missing `aria-expanded`/`aria-controls`.
- `app/admin/page.tsx:285–311` — no `<caption>` or `scope="col"` on tables.
- `my-bookings/page.tsx:449–457` — error state has no retry affordance, no icon.
- `app/error.tsx:18` — no brand icon, no serif.
- `app/admin/emails/page.tsx:287` — world-readable email preview.

**Minor**
- `app/loading.tsx` — missing `role="status"`, `aria-label`.
- `my-bookings/page.tsx:213` — no `focus-visible` ring on expand button.
- Suspense fallback is a bare spinner, no skeleton.
- `animate-pulse` / `animate-spin` without `motion-reduce:`.
- `admin/emails/page.tsx:383` — iframe missing `sandbox`.
- `admin/page.tsx:362` — quick-action icon + text both in tab stop, no `aria-hidden` on icons.

**Polish**
- `not-found.tsx:9` — Music icon missing `aria-hidden`.
- Admin dashboard "contact your developer" could link `/studio`.
- `my-bookings` empty CTA "Book Allan" could be more empathetic.
- Email preview desktop/mobile toggle lacks `aria-pressed`.

---

# PART 2 — VISUAL DESIGN AUDIT

**Objective:** Lift the design from "dark theme with single saturated gold" to editorial, premium, Carnegie Hall–level elegance. The current gold/black/white palette feels template-y and over-saturated. The following recommendations refine palette, typography, motion, and layout across every page.

---

## NEW DESIGN SYSTEM FOUNDATION

### Color Palette (replace current tokens)

```css
/* globals.css .dark */

/* Background layers — warm near-black, not pure #000 */
--background:   20 8% 5%;    /* #0A0908 — ink */
--bg-elevated:  22 10% 8%;   /* #14110E */
--surface:      24 12% 10%;  /* #1A1613 */
--card:         24 12% 10%;
--popover:      22 10% 8%;

/* Gold duo + bronze accent (replace the single saturated gold) */
--gold:         43 55% 54%;  /* #C9A646 — classic, warm, not screaming */
--champagne:    40 48% 65%;  /* #D4B87A — hover states, text highlights */
--bronze:       34 38% 39%;  /* #8B6F3D — subtle tints, active states */

/* Cream / parchment replace pure white */
--foreground:   40 30% 96%;  /* #F5EFE6 — cream */
--parchment:    38 28% 91%;  /* #EBE3D5 — secondary */
--ink:          22 15% 7%;   /* #0F0E0D — text on light surfaces */

/* Earthier semantics (replace neon green/amber/red) */
--success:      155 32% 34%; /* #3A7D5E — forest */
--warning:      36 68% 46%;  /* #C98A2A — amber, not neon */
--destructive:  14 52% 44%;  /* #AA4A30 — burnt sienna */

/* Radius: tighter corners site-wide */
--radius: 0.25rem;
```

### Typography Pairing

- **Display** — Cormorant Garamond (weights 300/400/600, italic) — hero h1, pull quotes, success states
- **Heading** — Playfair Display (demoted to secondary display) OR Tenor Sans for clean-cut headings
- **Body** — Inter or Space Grotesk (weights 400/500)
- **Labels/Accents** — Tenor Sans or Space Grotesk with `small-caps` and `letter-spacing: 0.12em+`

Add a `.label-caps` utility:
```css
.label-caps {
  font-variant: small-caps;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  color: hsl(var(--champagne));
}
```

### Motion System

- Replace bouncy springs + `ease-out` with **`cubic-bezier(0.22, 1, 0.36, 1)`** (cinematic ease-out)
- Default duration: **500–800ms** (not 200–300)
- Remove `active:scale-[0.98]` from buttons (mobile-app squish; use `active:opacity-80`)
- Delete `animate-bounce` keyframe from Tailwind config

### Utilities to Add

```css
.divider-gold      { height: 0.5px; background: hsl(var(--champagne) / 0.35); width: 100%; }
.divider-gold-sm   { height: 0.5px; background: hsl(var(--champagne) / 0.35); width: 3rem; margin: 0 auto; }
.section-pad       { @apply py-24 md:py-32 lg:py-40; }
.shadow-glow-gold  { box-shadow: 0 0 20px 4px hsl(43 55% 54% / 0.25), 0 4px 16px rgba(0,0,0,0.4); }
```

### Signature Visual Motif

Add `/public/images/f-hole.svg` — a minimal violin f-hole silhouette — used at `opacity-[0.04]` in hero watermarks and as section-divider ornaments (16px inline flanking hairline rules). This becomes the AP brand's recurring texture, the way a monogram recurs on luxury packaging.

---

## HOME PAGE — 12 Design Improvements

1. **Swap Playfair Display for Cormorant Garamond.** Editorial pedigree vs generic web serif. Hero h1: `font-display font-light text-[clamp(4rem,10vw,8rem)] tracking-[0.04em]`.
2. **Warm the background from `#000000` to `#0E0C0A`.** Pure black is flat and harsh; warm near-black feels like velvet.
3. **Dual-tone gold: champagne `#D4B87A` + accent `#C9A646`.** One flat gold = UI accent; two coordinated golds = material richness.
4. **Add SVG film-grain noise overlay at 0.035 opacity.** The #1 differentiator between "web template" and "editorial luxury."
5. **Redesign hero badge from ping-dot pill → thin-rule title card.** `— VIOLINIST —` flanked by gold hairlines. Concert-programme language, not tech UI.
6. **Asymmetric testimonials layout.** Left-aligned heading block, right-aligned description copy. Magazine spread, not card grid.
7. **Testimonial cards → newspaper pull-quote style.** Oversized `"` display character, no Quote Lucide icon, no stars. Let the prose carry credibility.
8. **Cinematic easing site-wide** — `cubic-bezier(0.16, 1, 0.3, 1)` at 0.9s durations. Scroll-indicator bounce slowed to 2.2s ease-in-out.
9. **Letterbox bars on the portrait video frame.** Top/bottom gradient bars inside the video — shifts reading from "Instagram clip" to "film screening."
10. **Hierarchy-aware CTAs.** Keep primary gold button; replace secondary outline button with an **underline-draw text link** (Dior/Hermès pattern). `after:` pseudo-element draws a gold hairline on hover.
11. **Recurring f-hole watermark.** Place as background texture in hero bottom-right, use as inline divider ornament between sections.
12. **Enforce 120px+ section rhythm.** `py-16 md:py-24` → `py-24 md:py-36 lg:py-44`. White space = silence between musical phrases.

---

## ABOUT PAGE — 12 Design Improvements

1. **Delete the `AnimatedGradientMesh` from the About hero.** Most template-damaging element in the codebase. Replace with a whisper-soft radial gradient at ~5% opacity.
2. **Editorial portrait crop.** `aspect-[4/5] rounded-2xl` → `aspect-[2/3] rounded-sm ring-1 ring-gold/20`. Remove safe web symmetry; add formal programme-photograph treatment.
3. **Kill the floating `TiltCard` stats widget.** SaaS feature pattern. Replace with inline typographic stats in the text column using large Cormorant numerals.
4. **Rewrite h1 as a two-line composition.** "Allan Palmer" + `<em>VIOLINIST</em>` in small-caps gold. Remove the in-title `<span className="text-gold">` highlight (landing-page convention).
5. **Recast Timeline as a vertical score notation.** Remove left/right alternation — single-column entries with large hairline year numerals in the left margin (like bar numbers on a score).
6. **Strip Lucide icons from Timeline and Philosophy.** Icon circles = feature-section UI. Replace with a 2×24px gold vertical rule on the left of each item.
7. **Add full-bleed section breaks with ornamental labels.** Between sub-sections insert `— ALLAN PALMER —` in wide-tracked Tenor Sans flanked by `border/40` hairlines.
8. **Duotone/sepia grade on the teaching photo.** Color photo on warm-black background reads as profile mismatch. `grayscale sepia brightness-90 contrast-110` + gold overlay at `mix-blend-multiply`.
9. **Frame the AboutMedia podcast card as archival artefact.** Remove `rounded-lg shadow-lg`; use `border border-gold/15 bg-transparent` + top meta-bar with small-caps "FEATURED INTERVIEW" label.
10. **Reverse motion stagger — portrait first, text follows.** Spotlight hits the performer before the programme notes are read.
11. **Pull-quote mid-column in hero.** Large italic testimonial `blockquote` breaks prose monotony and establishes credibility instantly.
12. **Unify CTA pattern.** One solid "Book Allan" CTA (`rounded-sm` not `rounded-full`) + underline-draw secondary text link. Kill the two-full-button conversion-page pattern.

---

## SERVICES PAGE — 12 Design Improvements

1. **Display h1 in Cormorant Garamond at editorial scale.** `font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-light`. Drop `font-bold` — thin weight at large size is inherently authoritative.
2. **Engraved numerals behind service cards.** `01`, `02`, `03` at `text-[5rem]` in `text-champagne/15`, absolute-positioned ghost numbers behind card headers.
3. **Remove the Briefcase icon from eyebrow.** Replace with a thin gold dash `—` before the label.
4. **Flat service cards with hairline borders.** `border-2 rounded-2xl` → `border border-gold/30 rounded-none md:rounded-[2px]`. Padding: `p-10 md:p-12`.
5. **"Most Popular" pill → vertical hairline treatment.** Left-side gold rule + small-caps "MOST REQUESTED" subtitle. No star icon, no badge.
6. **Check-circle tiles → em-dash programme list.** `<Check>` circles create visual noise. Replace with `—` em-dash + `font-light text-foreground/75 space-y-2.5`.
7. **Comparison chart as printed programme, not spreadsheet.** Category rows: no `bg-muted/30` fill — use small-caps gold headers on thin hairline rules. Column dividers at `border-gold/10`.
8. **Typographic availability symbols.** Replace filled circle icons with `✦` (yes), `◦` (optional), `·` (no). Feels like concert programme notation.
9. **Chart footer highlight cards → editorial text blocks.** Remove icon tiles, render as flat flex row with small-caps labels + Cormorant descriptions. No borders.
10. **Gold-bloom underline hover on CTAs.** `after:` pseudo-element draws gold hairline L→R at 500ms cubic-bezier. Replace generic `hover:bg-gold/90 scale`.
11. **Cinematic easing on all motion.** `duration: 0.8, ease: [0.22, 1, 0.36, 1]`. Remove `scale: 0.95` entrance — opacity + y-translate only.
12. **Add real pricing.** Three bespoke tier cards (Ceremony / Cocktail / Full Event) with thin gold hairline borders, Cormorant numerals, clear "Starting from $X" language.

---

## REPERTOIRE PAGE — 10 Design Improvements

1. **H1 as concert programme title.** `font-display text-[clamp(2.5rem,1.5rem+4vw,5rem)] font-light`. Thin gold hairline rule beneath at `w-16`.
2. **Alphabetic headers = recessed letterforms.** Remove `rounded-full bg-gold/10` circles. Render each letter as `text-[6rem] font-light text-champagne/20 select-none` — the letter bleeds into the list below.
3. **Song cards → programme entry rows.** Remove `<Card>` wrappers. Each song: `py-3 border-b border-champagne/10 flex items-baseline justify-between`.
4. **Remove per-song Music icons.** 169 identical icons create uniform noise. White space separates.
5. **Single-column programme list.** 3-column grid fractures reading flow. `max-w-2xl mx-auto flex flex-col`. Concert programmes are always single-column within a section.
6. **Editorial search field.** Remove icon. `border-0 border-b border-champagne/30 rounded-none bg-transparent h-14 font-serif`. Only a gold underline on focus.
7. **Song count as programme subtitle.** `Showing 169 of 169` → `"A selection of 169 works"` in italic Cormorant.
8. **Cinematic letterbox on songs-showcase hero.** `aspect-[16/7]`, bottom text overlay with Cormorant italic pull-quote.
9. **Featured cards — one play CTA, not two.** Remove the bottom outline button. Keep only hover-overlay play. Genre in small-caps gold, duration in `tabular-nums` right-aligned.
10. **"Love what you hear?" CTA as floating pull-quote.** Kill the bordered box. Gold hairline + italic Cormorant heading + light body, no container.

---

## LESSONS PAGE — 10 Design Improvements

1. **Anticipation-centrepiece layout, not "Under Construction."** Remove `Sparkles` badge. Centered `— ALLAN PALMER · VIOLIN INSTRUCTION —` eyebrow, then massive Cormorant h1.
2. **Delete the animated blur blobs.** Next.js starter template signature. Replace with single whisper-soft radial gradient at top.
3. **Music-notation visual breath.** Remove glowing Music icon halo. Add `♩ ♩ ♩` in `text-[0.65rem] tracking-[0.5em] uppercase text-champagne/40`.
4. **Offering cards → hairline menu entries.** Remove `rounded-2xl` cards. Each entry: `border-t border-champagne/20 pt-6 pb-6` in single stacked column, `max-w-sm mx-auto`.
5. **Inline waitlist form, not outbound CTA.** Replace "Get Notified → /contact" with an underline email input + small-caps text submit. Capture the anticipation in-page.
6. **Replace "Stay Tuned" divider with a quiet programme-style cue.** Italic Cormorant: `"Available soon in Winnipeg, Manitoba."`.
7. **Typeset menu of lesson formats.** Classical Technique · Suzuki Method · Repertoire Study · Music Theory · Performance Prep. Middots, no icons, no boxes.
8. **Slow cinematic reveal on h1.** `duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1]`. With `motion-reduce:transition-none`.
9. **"Back to Home" pill → hairline text link.** `← Return` in small-caps with hover color shift to champagne.
10. **Top-weighted layout, not vertical center.** Remove `min-h-screen justify-center`. Use `pt-32 md:pt-48 pb-40` so the heading lands in the upper third (where the eye naturally lands).

---

## GALLERY PAGE — 13 Design Improvements

1. **Pill tabs → gold hairline underline tabs.** Remove `bg-muted/50 rounded-2xl p-2` container. Flat `border-b border-white/10` with 2px gold underline via Framer `layoutId`. Tenor Sans labels.
2. **Typographic eyebrow ornament.** Replace `<Camera>` / `<Film>` icons with `<span className="w-8 h-px bg-gold/60 mr-3" />` dash.
3. **Section headings in Cormorant italic.** `font-cormorant italic font-light text-4xl md:text-5xl`.
4. **True masonry bento grid.** Replace uniform `aspect-square` with variety: hero image at `col-span-2 row-span-2 aspect-[4/3]`, portraits at `row-span-2 aspect-[3/4]`, landscapes at `aspect-[4/3]`.
5. **Grayscale-to-color photo hover + gold title reveal.** `grayscale group-hover:grayscale-0` + bottom caption sliding up with italic title. Loewe/Dior pattern.
6. **Lightbox backdrop with film grain + desaturation.** `bg-black/90 backdrop-blur-md backdrop-saturate-50` + noise pseudo-element.
7. **Museum-placard lightbox captions.** Title in small-caps Tenor Sans, gold hairline `border-t`, italic Cormorant description below. `max-w-xs` width.
8. **Corner-ornament close button.** Delete ghost icon button; use two absolutely-positioned 1px spans at ±45° forming a hand-stroked X.
9. **Kill gold circle number badges on reel cards.** Replace with subtle small-caps category label at top-left.
10. **Thin-stroke play button.** Remove filled `bg-gold/90 rounded-full` disc. Use `border border-white/70 rounded-full` with a hand-drawn SVG triangle at 12×14px.
11. **Full-bleed cinematic section headers.** Wrap headings in `border-b border-gold/10 pb-12` with ambient radial gradient behind.
12. **"View All" → underlined text link.** Kill `Button variant="outline"`. Use wide-tracked Tenor Sans with `border-b border-current`.
13. **Match skeleton loader to bento grid rhythm.** Current uniform skeleton causes layout shift flash. Scaffold with same `col-span-2`/`row-span-2` structure.

---

## BOOKING PAGE — 13 Design Improvements

1. **Concierge letter, not checkout card.** Remove `bg-card border rounded-2xl shadow-sm`. Use bare `max-w-lg mx-auto space-y-10` with page background as the surface. Thin `border-t border-gold/20 pt-10` between sections.
2. **H1 in Cormorant italic: "Reserve Your Date."** Current "Book Allan Palmer" sounds transactional. Below: `w-12 h-px bg-gold/60 mt-4 mb-6`.
3. **Delete the Calendar icon badge above h1.** App-icon filler with no editorial weight. Negative space IS the premium signal.
4. **Section labels in Tenor Sans small-caps.** `text-[10px] tracking-[0.3em] uppercase text-gold/60` with a full-width gold hairline above (not below) for section separation.
5. **Underline-only inputs, no box.** `bg-transparent border-0 border-b border-border/40 focus:border-gold px-0 py-2.5`. Bottega Veneta / Breitling pattern.
6. **Floating labels with `peer-focus` animation.** Labels animate upward into small-caps gold on focus. Halves the form's vertical density.
7. **Gold focus glow under active input.** `after:` pseudo draws hairline L→R at 300ms. No box ring.
8. **Refined CTA: wide-tracked Tenor Sans, no rounded-full.** `bg-[#C9A646] text-black text-sm tracking-[0.2em] uppercase font-['Tenor_Sans'] px-8 py-4 rounded-none`. No icon inside.
9. **Cormorant italic subhead.** Replace "Fill out the details below..." with `"Every memorable event begins with a single conversation."`
10. **Select matched to underline system.** Same underline classes, custom chevron `↓` via `after:` on wrapper.
11. **Musical pacing spacing, not uniform `space-y-6`.** `space-y-5` within sections, `mt-10` between sections.
12. **Cinematic success screen.** Delete bouncing checkmark. Full-bleed `min-h-screen bg-black` with `"Thank you."` in 7xl Cormorant italic gold/80, hairline divider, small-caps "Allan will be in touch within 24 hours."
13. **Page-level ambient vignette.** `bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(201,168,76,0.04)_0%,transparent_70%)]` top gradient for barely-perceptible warmth.

---

## CONTACT PAGE — 11 Design Improvements

1. **Add an editorial page header.** Currently cold-opens into form/info grid. Insert `<header className="pt-24 pb-12 text-center border-b border-gold/10">` with italic Cormorant h1: `"Let's Create Something Together."`
2. **Delete the bordered info Cards.** `border-2 border-gold/20` cards = commercial. Replace with `space-y-8` sections separated by `<hr className="border-gold/10" />`.
3. **Contact info as typographic list.** No icon circles. Small-caps Tenor Sans label + Cormorant value with gold hover.
4. **Quick Action buttons → ghost text links.** Kill bordered buttons. Wide-tracked Tenor Sans with `border-b border-current`.
5. **Same underline-only treatment as booking form.** Consistency between the two forms is critical.
6. **Matching cinematic success state.** `"Message received."` in 5xl Cormorant italic, hairline, small-caps "Expect a reply within 48 hours."
7. **Single-column stacked layout.** `lg:grid-cols-5` Bootstrap split → `flex flex-col gap-20 max-w-2xl mx-auto`. Form, gold hairline, contact details. No directory-listing asymmetry.
8. **Poetic response-time trust signal.** Italic Cormorant: `"Every inquiry is answered personally — usually within the same day."`
9. **Identical CTA styling to booking.** Same wide-tracked Tenor Sans, no rounded-full, no Send icon. Brand cohesion.
10. **Reframe "Booking Inquiries" card as inline editorial aside.** Gradient card → flat `<aside className="border-l-2 border-gold/40 pl-6">` with italic header + text link.
11. **Load fonts globally.** Cormorant Garamond (display), Tenor Sans (labels), Inter or Space Grotesk (body). Gold: `#C9A646` site-wide.

---

## NAVIGATION & FOOTER — 8 Design Improvements

1. **Enlarge FAB drawer to editorial scale.** `rounded-2xl p-3 min-w-52` → `rounded-md p-5 min-w-[220px]`. Link height `px-5 py-3`. Gold hairline dividers.
2. **Delete `footer.tsx`, keep only `SimpleFooter`.** Two footer components is dead code ambiguity. The full footer uses a generic `<Music>` Lucide icon; simple footer correctly uses the AP monogram.
3. **Hairline border on footer top, not `border-t`.** `<div className="divider-gold mt-12 mb-8" />` replaces default `border-t`.
4. **Column headers to `.label-caps` in champagne.** "Quick Links" / "Services" / "Contact" become small-caps programme labels.
5. **Cormorant italic tagline above footer logo.** Replace SEO boilerplate description with `"Performing since 2005. Winnipeg, MB."`
6. **Social icons with champagne tint hover.** Replace `hover:bg-primary hover:text-primary-foreground` (abrupt invert) with `hover:bg-champagne/12 hover:text-champagne hover:ring-1 hover:ring-champagne/30`.
7. **Mobile FAB text handling.** `min-w-[200px]` only at `sm:` breakpoint. Text labels `hidden sm:block`.
8. **Strip `animate-bounce` from Tailwind config.** Default keyframe invites accidental use that breaks the editorial motion system.

---

## MY BOOKINGS PAGE — 10 Design Improvements

1. **Rename to "Your Engagements."** SaaS dashboard language → artist-management vocabulary. Sub-label: `BOOKING RECORDS — ALLAN PALMER`.
2. **Replace `ClipboardList` with AP monogram.** Delete `rounded-full bg-gold/15`; use bare logo at opacity 80%.
3. **Lookup form as inset panel, not card.** Remove `bg-card rounded-2xl p-6`. Use `border-b border-champagne/30 pb-8 mb-12` + underline input.
4. **Status badges to design tokens.** `amber-500/15 text-amber-500` → `bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))]`. Earthier palette, token-driven.
5. **Booking cards: `rounded-2xl` → `rounded-[4px]` engraved-stationery feel.** Border `hsl(var(--champagne)/0.18)`.
6. **DetailSection headers to `.label-caps`.** Gold icon shifts `text-gold` → `text-champagne`.
7. **Booking reference as refined typographic detail.** `font-mono text-parchment/50 text-[10px] tracking-[0.15em] uppercase`. Concert-ticket aesthetic.
8. **Add horizontal progress indicator to collapsed card.** 4-step line: PENDING → REVIEWED → CONFIRMED → COMPLETED. Filled gold dots up to current step.
9. **Editorial empty state.** Cormorant `"No engagements on record."` + small-caps "Begin a booking request below." Not "No bookings found."
10. **Branded loader — AP logo pulse, not bare spinner.** `animation: pulse 2400ms cubic-bezier(0.22, 1, 0.36, 1) infinite`. Logo as held note.

---

## ERROR / 404 / LOADING — 8 Design Improvements

1. **`error.tsx` to full-bleed centered layout.** `min-h-[60vh]` → `min-h-screen bg-background pt-16`. No more half-rendered page with footer behind.
2. **AP logo motif anchors all error/404/loading pages.** Consistency across interstitials; each should feel inside Allan's world.
3. **Brand-voice error headline.** "Something went wrong" → `"An Unexpected Rest"` in Cormorant. Subtitle: `A MOMENTARY INTERRUPTION`.
4. **Error reset button as outline, not dark primary.** A near-white fill button in dark mode dominates and alarms. `variant="outline"` with champagne ring.
5. **Massive display 404 watermark.** `font-display font-thin text-[clamp(6rem,20vw,14rem)] text-champagne/08` absolute-positioned behind the icon. Typographic beauty.
6. **Branded loading composition.** Logo pulse + `divider-gold-sm` + small-caps "Allan Palmer" label. Not "Loading..." in plain sans.
7. **Gold arc spinner, not `border-primary`.** `border-2 border-surface border-t-gold`. Consistent with MyBookings spinner.
8. **`prefers-reduced-motion` on all animated error/loading elements.** CSS `@media` fallback for server components (where Framer hooks don't apply).

---

## GLOBAL DESIGN ACTIONS (priority order)

1. **Update `globals.css` dark-mode tokens** — background layers, gold duo, parchment/cream, semantic earthiness.
2. **Add Cormorant Garamond + Tenor Sans to `app/layout.tsx`** via `next/font/google`.
3. **Update `tailwind.config.ts`** — new color tokens, remove `animate-bounce`, add `glow-gold` shadow, cinematic easing keyframes.
4. **Add `.label-caps`, `.divider-gold`, `.section-pad` utilities** to `globals.css`.
5. **Create `/public/images/f-hole.svg`** — the brand signature motif.
6. **Create `lib/motion.ts`** — shared cinematic easing constants for Framer Motion.
7. **Refactor `components/ui/button.tsx`** — remove `active:scale-[0.98]`, `rounded-full` only on FAB.
8. **Audit all `bg-black`, `text-white`, `rounded-2xl`, `rounded-full` usage** — replace with tokens.
9. **Delete dead components**: `hero-section.tsx` (v1), `footer.tsx` (use SimpleFooter only), `booking-wizard.tsx`, `back-to-top.tsx`, `contact-questionnaire.tsx`.
10. **Introduce the underline-draw link pattern** as a shared component — `<TextLink>` used across every secondary CTA site-wide.
