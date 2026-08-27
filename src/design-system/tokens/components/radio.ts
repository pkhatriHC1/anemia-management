/**
 * Radio component tokens.
 *
 * Radio is the canonical single-selection control in HC1. It reuses the
 * exact same size ladder as Checkbox (control 14/16/20 · row 28/36/44)
 * because the two controls live side-by-side in forms — mixing sizes
 * across them would break vertical rhythm.
 *
 * Visual language: identical to Checkbox except (1) the indicator is
 * circular instead of square, and (2) the checked state paints a solid
 * inner dot rather than a check glyph. Every other state (hover, focus,
 * disabled, invalid, required) mirrors Checkbox exactly so a Form with
 * both Checkboxes and Radios reads as one system.
 *
 * The token bundle intentionally re-exports Checkbox's size + state
 * palette by reference. Radio never introduces a divergent palette;
 * if a new state ever needs a different tone, we would extend the
 * aliases layer, not this file.
 */

import { aliases } from "../aliases";
import { checkbox } from "./checkbox";

const { color, radius, spacing, motion } = aliases;

export const radio = {
  /**
   * Control size ladder — shared with Checkbox by direct reference so
   * the two primitives stay locked to the same numbers forever.
   *   sm — box 14, row 28
   *   md — box 16, row 36 (default)
   *   lg — box 20, row 44
   */
  size: checkbox.size,

  surface: {
    /**
     * The only real difference vs Checkbox: Radio uses `radius.circular` so
     * the indicator is circular. Everything else on the surface tier
     * (border width, ring width, ring offset) is inherited by convention.
     */
    radius:      radius.circular,
    borderWidth: checkbox.surface.borderWidth,
    ringWidth:   checkbox.surface.ringWidth,
    ringOffset:  checkbox.surface.ringOffset,
  },

  /**
   * State palette — reuses Checkbox's palette so a mixed form reads as
   * one system. The only extra bit is the inner-dot size ladder for
   * the checked state (Radio has no glyph — it paints a filled circle).
   */
  state: checkbox.state,

  text: checkbox.text,

  /**
   * The inner filled dot ratio (of the control box). At md this yields
   * an ~8px dot inside a 16px box — the same visual weight as the
   * Checkbox check glyph within the same-sized box.
   */
  dot: {
    ratio: 0.5,
  },

  spacing: {
    controlToText:      checkbox.spacing.controlToText,
    labelToDescription: checkbox.spacing.labelToDescription,
    /**
     * Gap between radios in a RadioGroup. Vertical stacks use the
     * `stack.sm` rhythm; horizontal rows use `inline.lg` so radios
     * don't crowd each other.
     */
    groupGapVertical:   spacing.stack.sm,
    groupGapHorizontal: spacing.inline.lg,
    groupLabelGap:      spacing.stack.sm,
  },

  motion: {
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },

  /**
   * RadioGroup label + description tone. The group label is heavier than
   * an individual radio label since it names the whole set.
   */
  group: {
    labelColor:       color.text.primary,
    descriptionColor: color.text.tertiary,
  },
} as const;

export type RadioTokens   = typeof radio;
export type RadioSizeName = keyof typeof radio.size;
