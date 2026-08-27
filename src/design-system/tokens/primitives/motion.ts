/**
 * Primitive motion tokens.
 *
 * Three durations (150 / 250 / 350 ms) and four easing curves.
 * Semantic pairs (hover-in / hover-out, overlay-enter / overlay-exit)
 * are composed from these in ../aliases/motion.ts.
 */

export const duration = {
  150: "150ms",
  250: "250ms",
  350: "350ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  entrance: "cubic-bezier(0, 0, 0.2, 1)",
  exit:     "cubic-bezier(0.4, 0, 1, 1)",
  linear:   "linear",
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken   = keyof typeof easing;
