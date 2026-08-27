/**
 * Badge component tokens.
 *
 * Badge is the canonical status-indicator primitive in HC1. Chips,
 * tags, labels, counters, and filter pills all compose this Badge
 * rather than reimplementing color pairings.
 *
 * The token bundle is organized as:
 *   variant     — the semantic tone (default | primary | success | warning | danger | info | neutral)
 *   appearance  — the visual weight (soft | solid | outline)
 *   size        — the height + padding + font ladder (sm | md | lg)
 *   feature     — dot / count / removable / disabled
 *
 * Variant × appearance is intentionally symmetric: every variant is
 * defined under every appearance. Rendering picks the one 3-tuple
 * (background, text, border) that matches the current combination.
 *
 * The `solid` appearance uses `text.inverse` (white) for the ink so
 * strong-colored backgrounds stay legible without hard-coding hex.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography } = aliases;

/**
 * A single visual pairing. Every variant × appearance produces one of
 * these — components read only these three roles.
 */
type BadgePalette = {
  background: string;
  text:       string;
  border:     string;
};

/**
 * `soft` — subtle wash + colored ink. Most common badge tone; used for
 * status chips, meta labels, and counters in-context.
 */
const soft = {
  default: {
    background: color.background.subtle,
    text:       color.text.secondary,
    border:     color.background.subtle,
  },
  primary: {
    background: color.background.subtle,
    text:       color.action.primary,
    border:     color.background.subtle,
  },
  success: {
    background: color.status.success.bg,
    text:       color.status.success.fg,
    border:     color.status.success.bg,
  },
  warning: {
    background: color.status.warning.bg,
    text:       color.status.warning.fg,
    border:     color.status.warning.bg,
  },
  danger: {
    background: color.status.error.bg,
    text:       color.status.error.fg,
    border:     color.status.error.bg,
  },
  info: {
    background: color.status.info.bg,
    text:       color.status.info.fg,
    border:     color.status.info.bg,
  },
  neutral: {
    background: color.background.subtle,
    text:       color.text.tertiary,
    border:     color.background.subtle,
  },
} as const satisfies Record<string, BadgePalette>;

/**
 * `solid` — filled background + inverse (white) ink. Reserved for
 * high-emphasis moments — a "New" ribbon, a "Critical" callout, a
 * count pill on a nav item. Use sparingly; solid badges are loud.
 */
const solid = {
  default: {
    background: color.action.secondary,
    text:       color.text.inverse,
    border:     color.action.secondary,
  },
  primary: {
    background: color.action.primary,
    text:       color.text.inverse,
    border:     color.action.primary,
  },
  success: {
    background: color.status.success.fg,
    text:       color.text.inverse,
    border:     color.status.success.fg,
  },
  warning: {
    background: color.status.warning.fg,
    text:       color.text.inverse,
    border:     color.status.warning.fg,
  },
  danger: {
    background: color.action.danger,
    text:       color.text.inverse,
    border:     color.action.danger,
  },
  info: {
    background: color.status.info.fg,
    text:       color.text.inverse,
    border:     color.status.info.fg,
  },
  neutral: {
    background: color.text.tertiary,
    text:       color.text.inverse,
    border:     color.text.tertiary,
  },
} as const satisfies Record<string, BadgePalette>;

/**
 * `outline` — transparent background + colored border + colored ink.
 * Used when a badge sits on a colored parent surface and the soft wash
 * would clash.
 */
const outline = {
  default: {
    background: color.background.default,
    text:       color.text.secondary,
    border:     color.border.default,
  },
  primary: {
    background: color.background.default,
    text:       color.action.primary,
    border:     color.action.primary,
  },
  success: {
    background: color.background.default,
    text:       color.status.success.fg,
    border:     color.status.success.border,
  },
  warning: {
    background: color.background.default,
    text:       color.status.warning.fg,
    border:     color.status.warning.border,
  },
  danger: {
    background: color.background.default,
    text:       color.status.error.fg,
    border:     color.status.error.border,
  },
  info: {
    background: color.background.default,
    text:       color.status.info.fg,
    border:     color.status.info.border,
  },
  neutral: {
    background: color.background.default,
    text:       color.text.tertiary,
    border:     color.border.default,
  },
} as const satisfies Record<string, BadgePalette>;

export const badge = {
  radius: radius.chip,          // 4 — matches every chip-shaped surface in HC1
  font:   typography.label,     // 12/16 semibold + wide tracking

  /**
   * Size ladder. Heights are compact — a badge should never dominate a
   * row. Font-sizes stay in the 12/14 pair to obey the even-sizes rule.
   */
  size: {
    sm: {
      height:   20,
      padX:     spacing.inline.sm,   // 8
      gap:      spacing.inline.xs,   // 4
      fontSize: 12,
      iconSize: 12,
      dotSize:  6,
    },
    md: {
      height:   24,
      padX:     spacing.inline.sm,   // 8
      gap:      spacing.inline.xs,   // 4
      fontSize: 12,
      iconSize: 14,
      dotSize:  8,
    },
    lg: {
      height:   28,
      padX:     spacing.inline.md,   // 12
      gap:      spacing.inline.xs,   // 4
      fontSize: 14,
      iconSize: 16,
      dotSize:  10,
    },
  },

  appearance: {
    soft,
    solid,
    outline,
  },

  /**
   * Dot indicator — a small circle in the variant's *solid* color,
   * rendered before the label. Always uses the solid tone so an "inactive"
   * dot on a soft badge still reads as its variant's true color.
   */
  dot: {
    color: {
      default: color.action.secondary,
      primary: color.action.primary,
      success: color.status.success.fg,
      warning: color.status.warning.fg,
      danger:  color.action.danger,
      info:    color.status.info.fg,
      neutral: color.text.tertiary,
    },
  },

  /**
   * Count badge — the number-only pill variant (e.g. "3", "99+"). Same
   * palette rules as the general badge; the container just picks
   * `radius.full` and a min-width equal to its own height so single
   * digits are perfectly circular.
   */
  count: {
    minWidth: {
      sm: 20,
      md: 24,
      lg: 28,
    },
    radius: radius.circular,   // 9999 — full pill
    /**
     * Cap for numeric counts before showing `${max}+`.
     */
    defaultMax: 99,
  },

  /**
   * Removable — the trailing X control. Even though the badge itself
   * is a status indicator (never a filter), some consumers surface a
   * dismiss/remove affordance. When wired, the X becomes a real button
   * with an accessible name.
   */
  remove: {
    iconSize: {
      sm: 10,
      md: 12,
      lg: 14,
    },
    hoverBg: color.background.muted,
  },

  disabled: {
    opacity: 0.5,
  },
} as const;

export type BadgeTokens = typeof badge;
export type BadgeVariant    = keyof typeof soft;
export type BadgeAppearance = keyof typeof badge.appearance;
export type BadgeSize       = keyof typeof badge.size;
