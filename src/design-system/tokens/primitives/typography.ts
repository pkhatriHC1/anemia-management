/**
 * Primitive typography tokens.
 *
 * Font families, size scale, line-height scale, weight enum, and
 * letter-spacing enum. Semantic text styles (display-xl, body, etc.)
 * are composed from these in ../aliases/typography.ts.
 *
 * Size scale is even-only (10/12/14/16/18/20/24/30/36/48/64) — the
 * odd sizes (11/13/15) destroy vertical rhythm at UI scale.
 */

export const fontFamily = {
  sans: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

export const fontSize = {
  10: "10px",
  12: "12px",
  14: "14px",
  16: "16px",
  18: "18px",
  20: "20px",
  24: "24px",
  30: "30px",
  36: "36px",
  48: "48px",
  64: "64px",
} as const;

export const lineHeight = {
  tight:   "1.15",
  snug:    "1.25",
  normal:  "1.5",
  relaxed: "1.65",
  16:      "16px",
  20:      "20px",
  24:      "24px",
  28:      "28px",
  32:      "32px",
  36:      "36px",
  40:      "40px",
  44:      "44px",
  56:      "56px",
  72:      "72px",
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export const letterSpacing = {
  tighter: "-0.02em",
  tight:   "-0.01em",
  normal:  "0em",
  wide:    "0.02em",
  wider:   "0.05em",
  widest:  "0.14em",
} as const;

export type FontFamilyToken   = keyof typeof fontFamily;
export type FontSizeToken     = keyof typeof fontSize;
export type LineHeightToken   = keyof typeof lineHeight;
export type FontWeightToken   = keyof typeof fontWeight;
export type LetterSpacingToken = keyof typeof letterSpacing;
