/**
 * Skeleton component tokens.
 *
 * Skeleton is the canonical loading-placeholder primitive in HC1.
 * Table loaders, card loaders, dialog loaders, form loaders, dashboard
 * loaders, profile loaders, chart loaders, and detail-page loaders all
 * compose this Skeleton rather than reimplementing shimmer treatments.
 *
 * The token bundle covers:
 *   variant  — per-variant default height + radius (text | title | circle | rectangle | rounded)
 *   surface  — base + shimmer color pair
 *   motion   — shimmer duration + easing
 *
 * The animation is a subtle horizontal gradient sweep — the base
 * surface is `background.subtle` and the shimmer highlight is
 * `background.muted`, so it stays quiet on every HC1 background. Under
 * `prefers-reduced-motion: reduce` the animation is disabled entirely
 * and the skeleton settles on the base surface.
 */

import { aliases } from "../aliases";

const { color, radius, motion } = aliases;

export const skeleton = {
  /**
   * Per-variant defaults. Consumers can override any of them via the
   * `width`, `height`, or `radius` props — this is the fallback ladder.
   */
  variant: {
    /**
     * `text` — a line of body-text height. Radius is subtle so the
     * line reads as text, not a block. Consumers typically pass
     * `lines={N}` to render multiple stacked lines.
     */
    text: {
      height: 14,
      width:  "100%",
      radius: radius.chip,
    },
    /**
     * `title` — a heavier headline line. Height matches Card
     * comfortable title (headingS 20/28).
     */
    title: {
      height: 24,
      width:  "60%",
      radius: radius.chip,
    },
    /**
     * `circle` — perfect circle. Width matches height by default.
     * Sized to match Badge lg / Avatar sm out of the box.
     */
    circle: {
      height: 40,
      width:  40,
      radius: radius.circular,
    },
    /**
     * `rectangle` — a block with no radius. For hero images, thumbnails,
     * and full-bleed placeholders.
     */
    rectangle: {
      height: 100,
      width:  "100%",
      radius: 0,
    },
    /**
     * `rounded` — a block with control radius. For cards, buttons,
     * inputs, and other rounded surfaces.
     */
    rounded: {
      height: 100,
      width:  "100%",
      radius: radius.control,
    },
  },

  surface: {
    /** Base surface color. Sits quietly on every HC1 background. */
    base:    color.background.subtle,
    /** Shimmer highlight — brief pulse of the muted tone. */
    shimmer: color.background.muted,
  },

  /**
   * Gap between stacked skeleton lines when `lines` is used.
   */
  linesGap: 8,

  motion: {
    /** Shimmer sweep duration. */
    duration: motion.transitionSlow.duration,   // 350ms
    /** Full sweep cycle — must be long enough to feel unhurried. */
    cycle:    "1400ms",
    easing:   motion.hoverIn.easing,
  },
} as const;

export type SkeletonTokens  = typeof skeleton;
export type SkeletonVariant = keyof typeof skeleton.variant;
