/**
 * Popover component tokens.
 *
 * Popover is the canonical floating surface primitive of HC1. Where
 * Tooltip is a passive, non-interactive hint, Popover is an INTERACTIVE
 * floating panel opened by click — it may contain form fields, buttons,
 * inline lists, filter chips, and (in downstream compositions) date
 * pickers, colour pickers, filter menus, and command palettes.
 *
 * Visual language:
 *   - Surface reads as a lightweight floating Card — same elevated
 *     background, same surface radius family, same border tone.
 *   - Elevation follows Dialog's overlay tier (shadow-lg) so a Popover
 *     lifts distinctly off the page without the ceremonial shadow-xl of
 *     a modal Dialog.
 *   - Motion follows Tooltip's entrance easing but at a slightly softer
 *     150ms fade + scale — the popover appears responsive to the click,
 *     not ceremonial.
 *   - Padding follows Card (16 stack × 16 inline) — Popover content is
 *     product content, not caption annotation.
 *
 * Every value is an alias reference — never a primitive.
 *
 * The token bundle covers:
 *   surface   — background (elevated), text (primary), border (subtle),
 *               radius (surface), shadow (overlay elevation), min/max width
 *   arrow     — geometry per placement (base, half-base)
 *   spacing   — padding inside the panel, offset from trigger
 *   text      — body-M typography (Popover carries real product content)
 *   motion    — entrance duration + easing
 */

import { aliases } from "../aliases";
import { tooltip } from "./tooltip";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const popover = {
  surface: {
    background: color.background.elevated,   // white — reads as floating Card
    text:       color.text.primary,          // primary ink
    border:     color.border.subtle,         // matches Card family
    radius:     radius.surface,              // 12 — full surface radius, not compact
    shadow:     elevation.overlay,           // shadow-lg — lifted overlay
    /**
     * Bounds. Popover width defaults to `auto` — content-driven — but
     * min/max clamp keep small floating menus from collapsing and long
     * ones from spanning the viewport. Consumers override via style /
     * inline CSS var when a specific downstream (date-picker, colour-
     * picker) needs a fixed frame.
     */
    minWidth: 200,
    maxWidth: 360,
  },

  arrow: {
    /**
     * Reuse Tooltip's arrow geometry so the whole overlay family reads
     * as one. If we ever want to divorce them, swap here — never inside
     * Popover.css.
     */
    size:     tooltip.arrow.size,      // 8
    halfSize: tooltip.arrow.halfSize,  // 4
  },

  spacing: {
    /** Inside padding — Card-family (16 × 16). Content is real, not annotation. */
    padY:   spacing.stack.lg,   // 16
    padX:   spacing.inline.lg,  // 16
    /**
     * Distance between trigger and popover (accounting for the arrow).
     * Slightly larger than Tooltip so an interactive panel doesn't crowd
     * its trigger.
     */
    offset: 8,
  },

  text: {
    font:  typography.bodyS,       // 14/20 · regular — comfortable for product content
    color: color.text.primary,
  },

  motion: {
    duration: motion.hoverIn.duration,   // 150ms — snappy but soft
    easing:   motion.hoverIn.easing,     // standard
  },
} as const;

export type PopoverTokens = typeof popover;
