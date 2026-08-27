/**
 * Primitives barrel.
 *
 * ⚠️ Primitives are the raw source values — colors, sizes, durations.
 * They are NEVER consumed directly by components. The alias layer wraps
 * every primitive in a semantic role (see ../aliases/).
 *
 * The `primitives` object flattens typography and motion sub-modules
 * so consumers can reach values with a single hop:
 *   primitives.color.brand[500]     — color scales stay namespaced
 *   primitives.fontFamily.mono      — typography flat
 *   primitives.duration[150]        — motion flat
 *
 * Individual named exports (fontFamily, duration, easing, etc.) are
 * also re-exported at the barrel level for direct import.
 */

import * as color from "./colors";
import { spacing } from "./spacing";
import { radius } from "./radius";
import {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
} from "./typography";
import { elevation } from "./elevation";
import { duration, easing } from "./motion";
import { opacity } from "./opacity";
import { breakpoints } from "./breakpoints";
import { zIndex } from "./z-index";

export const primitives = {
  color,
  spacing,
  radius,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  elevation,
  duration,
  easing,
  opacity,
  breakpoints,
  zIndex,
} as const;

export type Primitives = typeof primitives;

export * from "./colors";
export * from "./spacing";
export * from "./radius";
export * from "./typography";
export * from "./elevation";
export * from "./motion";
export * from "./opacity";
export * from "./breakpoints";
export * from "./z-index";
