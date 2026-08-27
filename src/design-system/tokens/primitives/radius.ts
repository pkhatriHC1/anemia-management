/**
 * Primitive radius tokens.
 *
 * Values ascend by 4px until the full-circle escape hatch. Named by
 * pixel value so intent is legible at the point of use.
 */

export const radius = {
  0:    "0px",
  4:    "4px",
  8:    "8px",
  12:   "12px",
  16:   "16px",
  24:   "24px",
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;
