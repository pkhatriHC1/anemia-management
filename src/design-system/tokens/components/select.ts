/**
 * Select component tokens.
 *
 * The Select trigger mirrors the Input frame — same heights, same padding
 * ladder, same state palette — so a size='md' Select aligns with a
 * size='md' Input and a size='md' Button when placed on the same row.
 *
 * The popup adds its own values on top: elevation, radius, and the
 * option row height ladder (which mirrors the trigger heights so a menu
 * of options feels dense but not cramped).
 */

import { aliases } from "../aliases";
import { input } from "./input";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const select = {
  /**
   * The trigger inherits the Input frame exactly. This is intentional
   * duplication of references — retinting Input retints Select, always.
   */
  trigger: input,

  popup: {
    background: color.background.elevated,
    border:     color.border.default,
    radius:     radius.control,
    elevation:  elevation.popover,
    offset:     spacing.inline.xs,   // 4px gap between trigger and popup
    padding:    spacing.inline.xs,   // 4px inner pad so options don't touch the edge
    maxHeight:  "min(320px, 60vh)",
    transition: {
      duration: motion.overlayEnter.duration,
      easing:   motion.overlayEnter.easing,
    },
  },

  option: {
    radius:  radius.chip,
    paddingX: {
      xs: spacing.inline.sm,   // 8
      sm: spacing.inline.sm,   // 8
      md: spacing.inline.sm,   // 8
      lg: spacing.inline.md,   // 12
      xl: spacing.inline.md,   // 12
    },
    height: {
      xs: 24,
      sm: 28,
      md: 32,
      lg: 36,
      xl: 44,
    },
    font: {
      xs: typography.caption,
      sm: typography.caption,
      md: typography.bodyS,
      lg: typography.body,
      xl: typography.bodyL,
    },
    state: {
      rest: {
        background: "transparent",
        text:       color.text.primary,
        description: color.text.tertiary,
      },
      active: {
        // Keyboard-highlighted or mouse-hovered.
        background: color.background.subtle,
        text:       color.text.primary,
        description: color.text.secondary,
      },
      selected: {
        background: color.background.subtle,
        text:       color.text.primary,
        icon:       color.action.primary,
      },
      selectedActive: {
        background: color.background.muted,
        text:       color.text.primary,
        icon:       color.action.primary,
      },
      disabled: {
        background: "transparent",
        text:       color.text.disabled,
        description: color.text.disabled,
      },
    },
  },

  group: {
    headerText:  color.text.tertiary,
    headerFont:  typography.label,
    headerPadX:  spacing.inline.sm,
    headerPadY:  spacing.stack.xs,
  },

  empty: {
    text: color.text.tertiary,
    font: typography.bodyS,
    padY: spacing.stack.lg,
  },
} as const;

export type SelectTokens = typeof select;
