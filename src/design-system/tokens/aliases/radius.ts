/**
 * Radius aliases.
 *
 * Semantic radius roles. Different interactive-vs-surface radii is
 * subtle differentiation — reads considered rather than uniform.
 */

import { radius } from "../primitives/radius";

export const radiusAlias = {
  none:     radius[0],
  chip:     radius[4],
  control:  radius[8],
  surface:  radius[12],
  hero:     radius[16],
  circular: radius.full,
} as const;

export type RadiusAlias = keyof typeof radiusAlias;
