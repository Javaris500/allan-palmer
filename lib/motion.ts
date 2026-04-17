import { useReducedMotion, type Transition } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_EDITORIAL: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const DURATION = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
  cinematic: 0.9,
  overture: 1.2,
} as const;

export const TRANSITION = {
  base: { duration: DURATION.base, ease: EASE_OUT } satisfies Transition,
  slow: { duration: DURATION.slow, ease: EASE_OUT } satisfies Transition,
  cinematic: {
    duration: DURATION.cinematic,
    ease: EASE_OUT,
  } satisfies Transition,
  overture: {
    duration: DURATION.overture,
    ease: EASE_EDITORIAL,
  } satisfies Transition,
} as const;

export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
  },
} as const;

export function useMotionConfig() {
  const reduced = useReducedMotion();
  return {
    reduced: Boolean(reduced),
    transition: reduced
      ? ({ duration: 0 } satisfies Transition)
      : TRANSITION.cinematic,
    staggerChildren: reduced ? 0 : 0.08,
  };
}
