/**
 * HC1 Design Tokens — public entry.
 *
 * Three layers:
 *   primitives  — raw values (color scales, spacing, radius, etc.)
 *                 ⚠️ NEVER consumed by components. Only aliases may
 *                 reference primitives.
 *   aliases     — semantic role names (color.bg.default, text.primary,
 *                 spacing.stack.md, etc.). This is the layer components
 *                 must import from.
 *   components  — per-component token bundles (button, card, badge,
 *                 input, modal). Placeholders in this pass — populated
 *                 with real component code in a future PR.
 *
 * Also exports:
 *   types       — shared TS token types (ColorScale, TypographyStyle)
 *   css bridge  — a variables.css file mirrors every token as
 *                 --hc-* custom properties for non-JS consumers.
 *
 * Package boundary: this module ships as pure TypeScript with zero
 * runtime dependencies. When the design system moves to its own npm
 * package, this file is the entry point.
 */

export * from "./types";
export * from "./primitives";
export * from "./aliases";
export * from "./components";

import { primitives } from "./primitives";
import { aliases } from "./aliases";
import { components } from "./components";

export const tokens = {
  primitives,
  aliases,
  components,
} as const;

export type Tokens = typeof tokens;
