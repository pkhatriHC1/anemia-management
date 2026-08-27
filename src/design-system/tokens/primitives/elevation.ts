/**
 * Primitive elevation tokens.
 *
 * Compound (multi-layer) shadows for depth realism. Alpha values
 * are small (0.04–0.16) because HC1 is a nearly-flat language:
 * shadow exists only for genuinely floating surfaces.
 *
 * Six levels — `none` is the semantic escape hatch; xs → xl form
 * a monotonic depth ladder.
 */

import type { ShadowDefinition } from "../types";

export const elevation = {
  none: "none",
  xs:   "0 1px 2px rgba(15, 20, 25, 0.06)",
  sm:   "0 1px 3px rgba(15, 20, 25, 0.08), 0 1px 2px rgba(15, 20, 25, 0.04)",
  md:   "0 4px 6px rgba(15, 20, 25, 0.08), 0 2px 4px rgba(15, 20, 25, 0.04)",
  lg:   "0 10px 15px rgba(15, 20, 25, 0.10), 0 4px 6px rgba(15, 20, 25, 0.05)",
  xl:   "0 20px 25px rgba(15, 20, 25, 0.12), 0 10px 10px rgba(15, 20, 25, 0.04)",
} as const satisfies Record<string, ShadowDefinition>;

export type ElevationToken = keyof typeof elevation;
