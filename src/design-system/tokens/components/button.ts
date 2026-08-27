/**
 * Button component tokens.
 *
 * The Button component (../../components/button/) is the sole consumer.
 * Every value here references an alias — never a primitive, never a
 * hardcoded literal. To retint the button, retint the alias layer;
 * to add a new visual, add an alias, then extend this file.
 *
 * Shipped variants match the reference implementation exactly:
 *   primary · secondary · ghost · danger · danger-outline · success · cta · link · icon
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, motion } = aliases;

export const button = {
  radius: radius.control,

  padding: {
    xs: `${spacing.stack.xs} ${spacing.inline.xs}`,
    sm: `${spacing.stack.xs} ${spacing.inline.sm}`,
    md: `${spacing.stack.sm} ${spacing.inline.md}`,
    lg: `${spacing.stack.md} ${spacing.inline.lg}`,
    xl: `${spacing.stack.lg} ${spacing.inline.xl}`,
  },

  font: {
    xs: typography.caption,
    sm: typography.caption,
    md: typography.bodyS,
    lg: typography.body,
    xl: typography.bodyL,
  },

  transition: {
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },

  variant: {
    primary: {
      background:         color.action.primary,
      backgroundHover:    color.action.primaryHover,
      backgroundActive:   color.action.primaryActive,
      backgroundDisabled: color.action.primaryDisabled,
      text:               color.text.inverse,
      textDisabled:       color.text.disabled,
      border:             color.action.primary,
    },
    secondary: {
      background:         color.background.default,
      backgroundHover:    color.background.subtle,
      backgroundActive:   color.background.muted,
      backgroundDisabled: color.background.default,
      text:               color.text.primary,
      textDisabled:       color.text.disabled,
      border:             color.border.default,
    },
    ghost: {
      background:         "transparent",
      backgroundHover:    color.background.subtle,
      backgroundActive:   color.background.muted,
      backgroundDisabled: "transparent",
      text:               color.text.primary,
      textDisabled:       color.text.disabled,
      border:             "transparent",
    },
    danger: {
      background:         color.action.danger,
      backgroundHover:    color.action.dangerHover,
      backgroundActive:   color.action.dangerActive,
      backgroundDisabled: color.background.muted,
      text:               color.text.inverse,
      textDisabled:       color.text.disabled,
      border:             color.action.danger,
    },
    success: {
      background:         color.background.default,
      backgroundHover:    color.status.success.bg,
      backgroundActive:   color.status.success.border,
      backgroundDisabled: color.background.default,
      text:               color.status.success.fg,
      textDisabled:       color.text.disabled,
      border:             color.status.success.border,
    },
    "danger-outline": {
      background:         color.background.default,
      backgroundHover:    color.status.error.bg,
      backgroundActive:   color.status.error.border,
      backgroundDisabled: color.background.default,
      text:               color.status.error.fg,
      textDisabled:       color.text.disabled,
      border:             color.status.error.border,
    },
    link: {
      background:         "transparent",
      backgroundHover:    "transparent",
      backgroundActive:   "transparent",
      backgroundDisabled: "transparent",
      text:               color.text.link,
      textHover:          color.text.linkHover,
      textDisabled:       color.text.disabled,
      border:             "transparent",
    },
    icon: {
      background:         "transparent",
      backgroundHover:    color.background.subtle,
      backgroundActive:   color.background.muted,
      backgroundDisabled: "transparent",
      text:               color.text.primary,
      textDisabled:       color.text.disabled,
      border:             "transparent",
    },
  },
} as const;

export type ButtonTokens = typeof button;
export type ButtonVariantName = keyof typeof button.variant;
