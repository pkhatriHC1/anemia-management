/**
 * Tabs component tokens.
 *
 * Tabs is the canonical section-navigation primitive in HC1. Dashboard
 * tabs, settings tabs, profile tabs, analytics tabs, detail tabs, and
 * future wizard-step surfaces all compose this Tabs rather than
 * reimplementing the roving-tabindex model or the underline treatment.
 *
 * The token bundle covers:
 *   surface  — the list container (bottom border, background)
 *   tab      — per-state tab palette (default / hover / selected / disabled)
 *   size     — height + padding + typography per size (sm / md / lg)
 *   panel    — the content region below the list
 *   motion   — hover + selection transitions
 *
 * The visual language is deliberately aligned with the rest of the
 * family — the selection color is `action.primary` (Button primary),
 * the focus ring is `border.focus` (Button/Input/Select/Card/Dialog),
 * and the list padding matches Card comfortable.
 */

import { aliases } from "../aliases";

const { color, spacing, typography, motion } = aliases;

export const tabs = {
  list: {
    background:      color.background.default,
    borderBottom:    color.border.subtle,
    /**
     * The list has a hair of horizontal padding so the first + last
     * tabs' interior padding matches the surrounding surface rhythm.
     * Zero by default — most tab strips align to the outer surface's
     * padding via their parent Card / page container.
     */
    padX:            spacing.inline.xs,
    gap:             spacing.inline.xs, // 4 — small visual gap between adjacent tabs
  },

  tab: {
    /** Ink + underline color per state. */
    default: {
      text:      color.text.tertiary,
      underline: "transparent",
      background: "transparent",
    },
    hover: {
      text:      color.text.primary,
      underline: "transparent",
      background: color.background.subtle,
    },
    selected: {
      text:      color.action.primary,
      underline: color.action.primary,
      background: "transparent",
    },
    /**
     * Selected + hover — the underline stays; the wash becomes very
     * subtle so the hover feedback doesn't erase the selection.
     */
    selectedHover: {
      text:      color.action.primaryHover,
      underline: color.action.primary,
      background: color.background.subtle,
    },
    disabled: {
      text:      color.text.disabled,
      underline: "transparent",
      background: "transparent",
    },
  },

  /**
   * Size ladder. Heights are +4 above Button sm/md/lg (28/36/44) so a
   * 2px selection underline sits inside the tab without cramping the
   * label. Padding + typography still align with the Button ladder.
   */
  size: {
    sm: {
      height:   32,                        // Button.sm (28) + 4
      padX:     spacing.inline.md,          // 12
      gap:      spacing.inline.xs,          // 4 — label / icon / badge
      font:     typography.bodyS,           // 14 / 20
      iconSize: 14,
    },
    md: {
      height:   40,                        // Button.md (36) + 4
      padX:     spacing.inline.lg,          // 16
      gap:      spacing.inline.sm,          // 8
      font:     typography.bodyS,           // 14 / 20
      iconSize: 16,
    },
    lg: {
      height:   48,                        // Button.lg (44) + 4
      padX:     spacing.inline.xl,          // 24
      gap:      spacing.inline.sm,          // 8
      font:     typography.body,            // 16 / 24
      iconSize: 18,
    },
  },

  /**
   * Selection indicator (the underline). Painted as a bottom-border on
   * the selected tab that overlaps the list's own bottom-border. Same
   * width in every size for a consistent selection weight.
   */
  indicator: {
    thickness: 2,
  },

  panel: {
    padTop: spacing.stack.lg, // 16 — matches Card content top rhythm
    text:   color.text.primary,
    font:   typography.body,
  },

  motion: {
    hover:     motion.hoverIn,
    selection: motion.hoverIn,
  },
} as const;

export type TabsTokens = typeof tabs;
export type TabsSize   = keyof typeof tabs.size;
