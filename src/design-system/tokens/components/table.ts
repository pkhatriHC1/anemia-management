/**
 * Table component tokens.
 *
 * Table is the canonical data-presentation primitive in HC1. Patient
 * lists, user lists, audit logs, activity feeds, search results, orders,
 * inventory, transactions, and settings lists all compose this Table
 * rather than reimplementing row/cell rhythm.
 *
 * The token bundle covers:
 *   surface  — background, border, radius of the outer table shell
 *   toolbar  — the top strip that hosts search + filters
 *   header   — sticky-capable header row + head-cell typography
 *   row      — row background per state (default / hover / selected / disabled)
 *   cell     — padding + typography per density
 *   footer   — bottom strip that hosts pagination + summary text
 *   states   — loading + empty
 *
 * Table's visual language is deliberately aligned with Card — same
 * `radius.surface`, same `bg.elevated`, same `border.subtle` — so a
 * Table reads as a Card containing structured data, not a new surface
 * family. Row heights match the Button size ladder (28 / 36 / 44) so a
 * checkbox column reads at the same rhythm as an inline Button in the
 * toolbar.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const table = {
  surface: {
    background: color.background.elevated,
    border:     color.border.subtle,
    radius:     radius.surface,
    shadow:     elevation.surface,
    color:      color.text.primary,
  },

  toolbar: {
    padding: {
      x: spacing.inline.lg,   // 16 — matches Card comfortable padding
      y: spacing.stack.md,    // 12
    },
    gap:            spacing.inline.md, // 12 between search and filters
    background:     color.background.elevated,
    borderBottom:   color.border.subtle,
    labelFont:      typography.bodyS,
    labelColor:     color.text.secondary,
  },

  header: {
    background:   color.background.surface,   // subtle wash so header separates from rows
    borderBottom: color.border.default,
    color:        color.text.tertiary,
    font:         typography.label,           // 12/16 semibold + wide tracking
    /**
     * Sticky-header shadow. When the table body scrolls under a sticky
     * header, this shadow appears under the header so the boundary
     * doesn't feel welded. Uses `elevation.raised` so the tone matches
     * every other floating surface in HC1.
     */
    stickyShadow: elevation.raised,
    padding: {
      x: spacing.inline.md,   // 12
      y: spacing.stack.sm,    // 8
    },
    /**
     * Head-cell height per density. Slightly shorter than body rows so
     * the header reads as a header even without a background wash.
     */
    height: {
      compact:     28,
      comfortable: 36,
      relaxed:     44,
    },
    sortIndicatorColor:       color.text.tertiary,
    sortIndicatorActiveColor: color.action.primary,
  },

  row: {
    background:         color.background.elevated,
    backgroundHover:    color.background.subtle,
    backgroundSelected: color.background.subtle,   // same wash as hover; border + check disambiguates
    backgroundStriped:  color.background.surface,  // optional zebra
    borderBottom:       color.border.subtle,
    color:              color.text.primary,
    /**
     * Focused-row outline. When a row is clickable and the user tabs
     * onto it, the same 2px brand ring used across Button / Input /
     * Select / Card / Dialog appears — cross-family consistency.
     */
    focusOutline:       color.border.focus,
    /**
     * Left "selected" accent bar. Painted with box-shadow inset so it
     * doesn't disturb row height.
     */
    selectedAccent:     color.action.primary,
    disabledColor:      color.text.disabled,
  },

  cell: {
    /**
     * Body-row height per density. Matches Button size='sm' / 'md' /
     * 'lg' exactly (28 / 36 / 44) so inline controls sit flush with the
     * row and don't add vertical noise.
     */
    height: {
      compact:     28,
      comfortable: 36,
      relaxed:     44,
    },
    padding: {
      compact:     { x: spacing.inline.sm, y: spacing.stack.xs }, // 8 / 4
      comfortable: { x: spacing.inline.md, y: spacing.stack.sm }, // 12 / 8
      relaxed:     { x: spacing.inline.lg, y: spacing.stack.md }, // 16 / 12
    },
    font: {
      compact:     typography.bodyS,   // 14 / 20
      comfortable: typography.bodyS,   // 14 / 20 — matches Input body text
      relaxed:     typography.body,    // 16 / 24
    },
    /**
     * Numeric cells use tabular-nums so columns of digits align. This
     * is applied via CSS `font-variant-numeric` — no font swap.
     */
    numeric: {
      fontVariantNumeric: "tabular-nums",
      textAlign:          "right",
    },
    /**
     * Leading-icon slot. Sized to sit next to a checkbox or an avatar
     * without changing row height.
     */
    iconSize: {
      compact:     14,
      comfortable: 16,
      relaxed:     18,
    },
    iconColor: color.text.tertiary,
  },

  footer: {
    padding: {
      x: spacing.inline.lg,
      y: spacing.stack.md,
    },
    background:  color.background.elevated,
    borderTop:   color.border.subtle,
    color:       color.text.tertiary,
    font:        typography.bodyS,
  },

  empty: {
    background:      color.background.default,
    color:           color.text.tertiary,
    titleColor:      color.text.primary,
    titleFont:       typography.bodyL,
    descriptionFont: typography.bodyS,
    minHeight:       "240px",
    padY:            spacing.section.sm,
    iconSize:        32,
    iconColor:       color.text.tertiary,
  },

  loading: {
    background: color.background.default,
    spinnerBg:  color.border.default,
    spinnerFg:  color.action.primary,
    minHeight:  "240px",
    color:      color.text.tertiary,
  },

  motion: {
    hover:      motion.hoverIn,
    selection:  motion.hoverIn,
  },
} as const;

export type TableTokens  = typeof table;
export type TableDensity = "compact" | "comfortable" | "relaxed";
