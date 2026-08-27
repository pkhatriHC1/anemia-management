/**
 * Checkbox component tokens.
 *
 * Checkbox is the canonical multi-selection control in HC1. Every future
 * selection surface — Table row selection, bulk actions, permission
 * matrices, filter panels, preference forms — must compose this Checkbox
 * rather than reimplement checkbox behavior.
 *
 * Visual language: the box mirrors Input's frame (same border tone, same
 * focus ring, same disabled treatment) so Checkbox and Input read as
 * members of the same form family. The check mark uses `text.inverse`
 * on `action.primary` for the same tone as Button primary. Row heights
 * align 1:1 with Button + Input so a Checkbox on the same row sits flush.
 *
 * The token bundle covers:
 *   size      — control size + row height ladder (sm/md/lg)
 *   surface   — border, radius, focus ring
 *   state     — full palette per checked/unchecked/hover/focus/disabled/invalid
 *   text      — label + description typography per size
 *   spacing   — control ↔ text gap + label ↔ description stack
 *   motion    — background/border/check-scale transition
 */

import { aliases } from "../aliases";

const { color, radius, typography, spacing, motion } = aliases;

export const checkbox = {
  /**
   * Control size ladder. `control` is the box (square). `row` is the
   * total row height when a label is present — matches Button + Input
   * sm/md/lg exactly so inline controls sit flush.
   *
   *   sm — box 14, row 28 (matches Button/Input sm)
   *   md — box 16, row 36 (matches Button/Input md)  — default
   *   lg — box 20, row 44 (matches Button/Input lg)
   */
  size: {
    sm: { control: 14, row: 28, icon: 10 },
    md: { control: 16, row: 36, icon: 12 },
    lg: { control: 20, row: 44, icon: 16 },
  },

  surface: {
    radius:      radius.chip,          // 4 — small selection tile
    borderWidth: 1,
    ringWidth:   2,
    ringOffset:  2,
  },

  /**
   * State palette. Each state sets background + border + check color.
   * Unchecked = neutral surface; checked/indeterminate = brand-filled;
   * disabled = subtle surface + disabled text; invalid = red border.
   * Hover = strong border wash (no fill change).
   */
  state: {
    unchecked: {
      background: color.background.default,
      border:     color.border.strong,
      check:      "transparent",
    },
    uncheckedHover: {
      background: color.background.subtle,
      border:     color.action.primary,
      check:      "transparent",
    },
    checked: {
      background: color.action.primary,
      border:     color.action.primary,
      check:      color.text.inverse,
    },
    checkedHover: {
      background: color.action.primaryHover,
      border:     color.action.primaryHover,
      check:      color.text.inverse,
    },
    indeterminate: {
      background: color.action.primary,
      border:     color.action.primary,
      check:      color.text.inverse,
    },
    indeterminateHover: {
      background: color.action.primaryHover,
      border:     color.action.primaryHover,
      check:      color.text.inverse,
    },
    focus: {
      ring: color.border.focus,
    },
    disabled: {
      background:      color.background.subtle,
      border:          color.border.subtle,
      check:           color.text.disabled,
      checkedBg:       color.action.primaryDisabled,
      checkedBorder:   color.action.primaryDisabled,
      checkedCheck:    color.text.inverse,
      text:            color.text.disabled,
    },
    invalid: {
      border:          color.status.error.fg,
      ring:            color.status.error.fg,
      checkedBg:       color.status.error.fg,
      checkedBorder:   color.status.error.fg,
    },
  },

  text: {
    label: {
      sm: typography.caption,   // 12
      md: typography.bodyS,     // 14
      lg: typography.body,      // 16
    },
    description: {
      sm: typography.caption,   // 12
      md: typography.caption,   // 12
      lg: typography.bodyS,     // 14
    },
    color: {
      label:       color.text.primary,
      description: color.text.tertiary,
      required:    color.status.error.fg,
    },
  },

  spacing: {
    /** Gap between the control and the text stack (label + description). */
    controlToText: {
      sm: spacing.inline.sm,   // 8
      md: spacing.inline.sm,   // 8
      lg: spacing.inline.md,   // 12
    },
    /** Vertical gap between label and description. */
    labelToDescription: spacing.stack.xs,  // 4
  },

  motion: {
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },
} as const;

export type CheckboxTokens   = typeof checkbox;
export type CheckboxSizeName = keyof typeof checkbox.size;
export type CheckboxStateName = keyof typeof checkbox.state;
