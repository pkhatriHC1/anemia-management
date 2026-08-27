/**
 * Input component tokens.
 *
 * The Input component (../../components/input/) is the sole consumer.
 * Every value here references an alias — never a primitive, never a
 * hardcoded literal. To retint the input, retint the alias layer;
 * to add a new visual, add an alias, then extend this file.
 *
 * Height ladder matches Button exactly so a size='md' Input aligns with
 * a size='md' Button when placed on the same row.
 *
 *   xs — 20  sm — 28  md — 36  lg — 44  xl — 56
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, motion } = aliases;

export const input = {
  radius: radius.control,

  /**
   * Horizontal padding of the input frame per size. Vertical padding is
   * zero — the row itself is height-locked and content is centered via
   * flex. Icons sit inside the same padding box.
   */
  paddingX: {
    xs: spacing.inline.xs,   // 4
    sm: spacing.inline.sm,   // 8
    md: spacing.inline.md,   // 12
    lg: spacing.inline.md,   // 12
    xl: spacing.inline.lg,   // 16
  },

  /**
   * Gap between the input control and its adornments (leading icon,
   * trailing icon, clear button, spinner).
   */
  gap: {
    xs: spacing.inline.xs,
    sm: spacing.inline.xs,
    md: spacing.inline.sm,
    lg: spacing.inline.sm,
    xl: spacing.inline.md,
  },

  font: {
    xs: typography.caption,   // 12
    sm: typography.caption,   // 12
    md: typography.bodyS,     // 14
    lg: typography.body,      // 16
    xl: typography.bodyL,     // 18
  },

  transition: {
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },

  /**
   * State palette. Every state has background + text + border. The
   * shared focus ring lives outside the frame (outline) so it never
   * shifts the layout, and it uses the same brand color as Button.
   */
  state: {
    rest: {
      background:  color.background.default,
      text:        color.text.primary,
      border:      color.border.default,
      placeholder: color.text.tertiary,
      icon:        color.text.tertiary,
    },
    hover: {
      background: color.background.default,
      border:     color.border.strong,
    },
    focus: {
      background: color.background.default,
      border:     color.border.focus,
      ring:       color.border.focus,
    },
    filled: {
      background: color.background.default,
      text:       color.text.primary,
      border:     color.border.default,
    },
    disabled: {
      background: color.background.subtle,
      text:       color.text.disabled,
      border:     color.border.subtle,
      icon:       color.text.disabled,
    },
    readonly: {
      background: color.background.subtle,
      text:       color.text.primary,
      border:     color.border.subtle,
      icon:       color.text.tertiary,
    },
    error: {
      background: color.background.default,
      text:       color.text.primary,
      border:     color.status.error.fg,
      icon:       color.status.error.icon,
      message:    color.status.error.fg,
    },
    warning: {
      background: color.background.default,
      text:       color.text.primary,
      border:     color.status.warning.fg,
      icon:       color.status.warning.icon,
      message:    color.status.warning.fg,
    },
    success: {
      background: color.background.default,
      text:       color.text.primary,
      border:     color.status.success.fg,
      icon:       color.status.success.icon,
      message:    color.status.success.fg,
    },
  },
} as const;

export type InputTokens = typeof input;
export type InputSizeName = keyof typeof input.paddingX;
export type InputStateName = keyof typeof input.state;
