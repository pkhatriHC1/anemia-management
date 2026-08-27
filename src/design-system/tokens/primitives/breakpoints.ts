/**
 * Primitive breakpoint tokens.
 *
 * Min-width thresholds. Every HC1 product shares these five stops so
 * responsive behavior is consistent across ClinicalIQ, SourceIQ, and
 * future modules.
 */

export const breakpoints = {
  sm:  "640px",
  md:  "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl": "1536px",
} as const;

export type BreakpointToken = keyof typeof breakpoints;
