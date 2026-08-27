/**
 * Card component tokens.
 *
 * Card is the canonical surface primitive. Every dashboard, detail page,
 * widget, and modal in HC1 composes with Cards. Retinting the surface
 * layer for the whole product means retinting these tokens.
 *
 * The token bundle is organized as:
 *   variant  — visual treatment per variant (default | outlined | elevated | interactive | selected)
 *   density  — internal spacing per density (compact | comfortable | relaxed)
 *   part     — spacing/color for each subcomponent slot
 *
 * Densities collapse to a single "step" value used consistently:
 *   compact      → 12  (inline.md)
 *   comfortable  → 16  (inline.lg)
 *   relaxed      → 24  (inline.xl)
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const card = {
  radius: radius.surface,

  transition: {
    duration: motion.hoverIn.duration,
    easing:   motion.hoverIn.easing,
  },

  variant: {
    default: {
      background: color.background.elevated,
      border:     color.border.default,
      shadow:     elevation.surface,
    },
    outlined: {
      background: color.background.default,
      border:     color.border.strong,
      shadow:     elevation.surface,
    },
    elevated: {
      background: color.background.elevated,
      border:     color.border.subtle,
      shadow:     elevation.raised,
    },
    interactive: {
      background:      color.background.elevated,
      backgroundHover: color.background.subtle,
      backgroundActive: color.background.muted,
      border:          color.border.default,
      shadow:          elevation.surface,
      shadowHover:     elevation.raised,
    },
    selected: {
      background: color.background.elevated,
      border:     color.border.focus,   // brand
      shadow:     elevation.surface,
    },
  },

  density: {
    compact:     spacing.inline.md,   // 12
    comfortable: spacing.inline.lg,   // 16
    relaxed:     spacing.inline.xl,   // 24
  },

  /**
   * Gap between subcomponents inside a section (e.g. title stack in header).
   * Scales with density for consistent vertical rhythm.
   */
  gap: {
    compact:     spacing.stack.xs,    // 4
    comfortable: spacing.stack.sm,    // 8
    relaxed:     spacing.stack.md,    // 12
  },

  header: {
    iconSize: {
      compact:     20,
      comfortable: 24,
      relaxed:     28,
    },
    iconColor:      color.action.primary,
    titleFont: {
      compact:     typography.bodyL,   // 18/28
      comfortable: typography.headingS,// 20/28
      relaxed:     typography.headingM,// 24/32
    },
    descriptionFont: typography.bodyS,
    descriptionColor: color.text.tertiary,
  },

  content: {
    text: color.text.secondary,
    font: typography.body,
  },

  footer: {
    text: color.text.tertiary,
    font: typography.bodyS,
  },

  actions: {
    gap: {
      compact:     spacing.inline.xs,   // 4
      comfortable: spacing.inline.sm,   // 8
      relaxed:     spacing.inline.md,   // 12
    },
  },

  divider: {
    color: color.border.subtle,
  },

  empty: {
    text:          color.text.tertiary,
    title:         color.text.primary,
    padY:          spacing.section.sm,
    iconSize:      32,
    iconColor:     color.text.tertiary,
    titleFont:     typography.bodyL,
    descriptionFont: typography.bodyS,
  },

  loading: {
    background:  color.background.default,
    spinnerBg:   color.border.default,
    spinnerFg:   color.action.primary,
  },
} as const;

export type CardTokens = typeof card;
export type CardVariantName = keyof typeof card.variant;
export type CardDensityName = keyof typeof card.density;
