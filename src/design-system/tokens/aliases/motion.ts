/**
 * Motion aliases.
 *
 * Asymmetric role pairs — hover-in fast, hover-out slower; overlay
 * enters gently and exits quickly. Every alias is a role, not a
 * duration.
 */

import { duration, easing } from "../primitives/motion";

export const motion = {
  hoverIn: {
    duration: duration[150],
    easing:   easing.standard,
  },
  hoverOut: {
    duration: duration[250],
    easing:   easing.standard,
  },
  overlayEnter: {
    duration: duration[250],
    easing:   easing.entrance,
  },
  overlayExit: {
    duration: duration[150],
    easing:   easing.exit,
  },
  transitionSlow: {
    duration: duration[350],
    easing:   easing.standard,
  },
} as const;

export type MotionAlias = keyof typeof motion;
