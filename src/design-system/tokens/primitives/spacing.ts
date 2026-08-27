/**
 * Primitive spacing tokens.
 *
 * 4-multiple base scale. Every spacing decision (padding, gap, margin)
 * in an HC1 product resolves back to one of these values.
 *
 * Keys are the pixel value; values are the string form ready for CSS.
 * Access as e.g. `spacing[16]` → "16px".
 */

export const spacing = {
  0:   "0px",
  4:   "4px",
  8:   "8px",
  12:  "12px",
  16:  "16px",
  20:  "20px",
  24:  "24px",
  32:  "32px",
  40:  "40px",
  48:  "48px",
  64:  "64px",
  80:  "80px",
  96:  "96px",
  128: "128px",
} as const;

export type SpacingToken = keyof typeof spacing;
