/**
 * Primitive opacity tokens.
 *
 * 5% increments (with an explicit 0). Keys are the percentage; values
 * are unitless (as CSS opacity requires).
 */

export const opacity = {
  0:   "0",
  5:   "0.05",
  10:  "0.1",
  20:  "0.2",
  30:  "0.3",
  40:  "0.4",
  50:  "0.5",
  60:  "0.6",
  70:  "0.7",
  80:  "0.8",
  90:  "0.9",
  100: "1",
} as const;

export type OpacityToken = keyof typeof opacity;
