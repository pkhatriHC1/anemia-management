/**
 * Pagination component tokens.
 *
 * Pagination is the canonical navigation primitive for paged data in
 * HC1. Patient lists, user lists, reports, search results, orders,
 * activity logs, and every Table with more than one page all compose
 * this Pagination rather than reimplementing button sizing, current-
 * page treatment, or ellipsis rhythm.
 *
 * The token bundle covers:
 *   size    — per-size button height + font + gap + icon (matches Button ladder)
 *   button  — surface + hover + current + disabled palette
 *   info    — text tone
 *   ellipsis — tone
 *   pageSize — select surface + palette
 *   layout  — outer gap + gap-between-pages
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, motion } = aliases;

export const pagination = {
  /**
   * Per-size defaults. Heights match the Button ladder exactly so an
   * inline `<Button size='md'>` sits flush next to a Pagination page.
   */
  size: {
    sm: {
      /** Square button size — matches Button sm. */
      button:  28,
      font:    typography.bodyS,     // 14 (but overridden to 12 in CSS via var — see below)
      icon:    14,
      navPad:  spacing.inline.sm,    // 8 — horizontal padding on Prev/Next
    },
    md: {
      button:  36,                   // matches Button md
      font:    typography.bodyS,     // 14
      icon:    16,
      navPad:  spacing.inline.md,    // 12
    },
    lg: {
      button:  44,                   // matches Button lg
      font:    typography.body,      // 16
      icon:    18,
      navPad:  spacing.inline.lg,    // 16
    },
  },

  layout: {
    /**
     * Outer gap between Info · PageList · PageSize slots.
     */
    outerGap: spacing.inline.lg,     // 16
    /**
     * Gap between adjacent page buttons in the list. Small — a page
     * list should read as a single cluster, not as spaced-out chips.
     */
    itemGap:  spacing.inline.xs,     // 4
  },

  button: {
    surface: {
      background: color.background.default,
      border:     color.border.default,
      text:       color.text.primary,
      radius:     radius.control,    // 8 — matches Button + Input + Select
    },
    hover: {
      background: color.background.subtle,
      border:     color.border.strong,
    },
    active: {
      background: color.background.muted,
    },
    current: {
      background: color.action.primary,
      border:     color.action.primary,
      text:       color.text.inverse,
    },
    disabled: {
      text:       color.text.disabled,
      background: color.background.default,
      border:     color.border.subtle,
    },
    /**
     * Font weight roles — medium for regular pages, semibold for the
     * current page. Same rule as Tabs (selected tab reads a hair
     * heavier than unselected).
     */
    weight: {
      regular: 500,
      current: 600,
    },
  },

  info: {
    text:      color.text.secondary,
    strong:    color.text.primary,
    weight:    600,
  },

  ellipsis: {
    text: color.text.tertiary,
  },

  pageSize: {
    label:  color.text.secondary,
    select: {
      background: color.background.default,
      border:     color.border.default,
      text:       color.text.primary,
      radius:     radius.control,
      hoverBorder: color.border.strong,
      disabled: {
        background: color.background.subtle,
        text:       color.text.disabled,
      },
    },
    /** Gap between "Per page" label and the select. */
    gap:    spacing.inline.sm,       // 8
  },

  focus: {
    ring:   color.border.focus,      // brand — matches every focus ring across the family
    width:  2,
    offset: 2,
  },

  states: {
    loading:  { opacity: 0.72 },
    disabled: { opacity: 0.6 },
  },

  motion: {
    transition: motion.hoverIn,      // 150 · standard
  },
} as const;

export type PaginationTokens = typeof pagination;
export type PaginationSize   = keyof typeof pagination.size;
