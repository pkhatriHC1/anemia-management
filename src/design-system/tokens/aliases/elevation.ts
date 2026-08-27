/**
 * Elevation aliases.
 *
 * Named surface roles. Cards are flat by default (surface = none).
 * Only genuinely floating surfaces get real shadow.
 */

import { elevation } from "../primitives/elevation";

export const elevationAlias = {
  surface: elevation.none,
  raised:  elevation.xs,
  popover: elevation.md,
  overlay: elevation.lg,
  modal:   elevation.xl,
} as const;

export type ElevationAlias = keyof typeof elevationAlias;
