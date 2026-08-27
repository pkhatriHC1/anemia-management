/**
 * Switch component tokens.
 *
 * Switch is the canonical binary toggle control in HC1. It's a sibling
 * primitive to Checkbox/Radio: same form family, same size ladder, same
 * focus ring, same disabled treatment — only the visual metaphor and the
 * interaction affordance change.
 *
 * When to reach for Switch vs Checkbox:
 *   - Switch = immediate system state change (dark mode, notifications,
 *     auto-save). Toggling should take effect instantly.
 *   - Checkbox = collecting a selection inside a form. Nothing happens
 *     until the form is submitted.
 *
 * Visual language: the row + label typography ladder + description tone
 * + focus ring + disabled treatment are literally shared with Checkbox
 * (by direct token reference below). The only additions are the track /
 * thumb geometry (a pill-shaped rounded rectangle with a circular thumb).
 *
 * The token bundle covers:
 *   size      — row height + track (width/height) + thumb per size (sm/md/lg)
 *   surface   — track radius (full), border, focus ring
 *   state     — palette per off/on/hover/focus/disabled/invalid (reused from Checkbox)
 *   text      — label + description typography per size (reused from Checkbox)
 *   spacing   — control ↔ text + label ↔ description (reused from Checkbox)
 *   motion    — thumb glide + track color transition
 */

import { aliases } from "../aliases";
import { checkbox } from "./checkbox";

const { radius, motion } = aliases;

export const switchToken = {
  /**
   * Size ladder. Row heights match Checkbox + Radio + Button + Input
   * exactly (28 / 36 / 44) so a Switch on the same row as any other form
   * control sits flush. Track width is ~1.75× track height (a squat pill).
   * Thumb sits inside the track with a 2px inset.
   *
   *   sm — row 28 · track 24×14 · thumb 10
   *   md — row 36 · track 28×16 · thumb 12   (default)
   *   lg — row 44 · track 36×20 · thumb 16
   */
  size: {
    sm: { row: checkbox.size.sm.row, trackW: 24, trackH: 14, thumb: 10 },
    md: { row: checkbox.size.md.row, trackW: 28, trackH: 16, thumb: 12 },
    lg: { row: checkbox.size.lg.row, trackW: 36, trackH: 20, thumb: 16 },
  },

  surface: {
    radius:      radius.circular,                    // pill
    borderWidth: checkbox.surface.borderWidth,   // 1
    ringWidth:   checkbox.surface.ringWidth,     // 2
    ringOffset:  checkbox.surface.ringOffset,    // 2
  },

  /**
   * State palette — reused verbatim from Checkbox so a form with mixed
   * Switch + Checkbox + Radio reads as one system. Off = neutral track;
   * on = brand-filled track; hover = strong border cue; disabled = subtle
   * fill; invalid = red border.
   */
  state: checkbox.state,

  text: checkbox.text,

  spacing: {
    controlToText:      checkbox.spacing.controlToText,
    labelToDescription: checkbox.spacing.labelToDescription,
  },

  motion: {
    /** Track colour / border transition. */
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },
} as const;

export type SwitchTokens   = typeof switchToken;
export type SwitchSizeName = keyof typeof switchToken.size;
