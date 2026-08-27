/**
 * Alert component tokens.
 *
 * Alert is the canonical inline-feedback primitive in HC1. Success
 * messages, error banners, warning notices, info notices, AI insight
 * blocks, and inline validation summaries all compose this Alert
 * rather than reimplementing color pairings or spacing rhythm.
 *
 * The token bundle is organized as:
 *   variant     — the semantic tone (info | success | warning | danger | neutral)
 *   appearance  — the visual weight (soft | outline | solid)
 *   part        — padding + gap + typography per subcomponent slot
 *
 * Variant × appearance is intentionally symmetric — every variant is
 * defined under every appearance. Rendering picks the one 3-tuple
 * (background, text, border) that matches the current combination.
 * The `solid` appearance uses `text.inverse` for the ink so strong-
 * colored backgrounds stay legible without hard-coding hex.
 *
 * The Alert's visual language is deliberately aligned with Card —
 * same `radius.surface`, same `spacing.inline.lg` padding — so an
 * Alert reads as a compact Card carrying a single message.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, motion } = aliases;

type AlertPalette = {
  background: string;
  text:       string;
  border:     string;
  /** Icon color when Alert.Icon is present. */
  icon:       string;
};

/**
 * `soft` — subtle wash + variant-colored ink + variant-colored border.
 * The default appearance; sits inside a page without stealing focus.
 */
const soft = {
  info: {
    background: color.status.info.bg,
    text:       color.status.info.fg,
    border:     color.status.info.border,
    icon:       color.status.info.icon,
  },
  success: {
    background: color.status.success.bg,
    text:       color.status.success.fg,
    border:     color.status.success.border,
    icon:       color.status.success.icon,
  },
  warning: {
    background: color.status.warning.bg,
    text:       color.status.warning.fg,
    border:     color.status.warning.border,
    icon:       color.status.warning.icon,
  },
  danger: {
    background: color.status.error.bg,
    text:       color.status.error.fg,
    border:     color.status.error.border,
    icon:       color.status.error.icon,
  },
  neutral: {
    background: color.background.subtle,
    text:       color.text.secondary,
    border:     color.border.default,
    icon:       color.text.tertiary,
  },
} as const satisfies Record<string, AlertPalette>;

/**
 * `outline` — page background + variant-colored border + variant-
 * colored ink. Use when the parent surface already has a wash and the
 * soft appearance would clash.
 */
const outline = {
  info: {
    background: color.background.default,
    text:       color.status.info.fg,
    border:     color.status.info.border,
    icon:       color.status.info.icon,
  },
  success: {
    background: color.background.default,
    text:       color.status.success.fg,
    border:     color.status.success.border,
    icon:       color.status.success.icon,
  },
  warning: {
    background: color.background.default,
    text:       color.status.warning.fg,
    border:     color.status.warning.border,
    icon:       color.status.warning.icon,
  },
  danger: {
    background: color.background.default,
    text:       color.status.error.fg,
    border:     color.status.error.border,
    icon:       color.status.error.icon,
  },
  neutral: {
    background: color.background.default,
    text:       color.text.secondary,
    border:     color.border.default,
    icon:       color.text.tertiary,
  },
} as const satisfies Record<string, AlertPalette>;

/**
 * `solid` — filled variant color + inverse ink. Reserved for
 * high-emphasis moments — a critical outage banner, a scheduled-
 * downtime notice. Use sparingly; solid Alerts are loud.
 */
const solid = {
  info: {
    background: color.status.info.fg,
    text:       color.text.inverse,
    border:     color.status.info.fg,
    icon:       color.text.inverse,
  },
  success: {
    background: color.status.success.fg,
    text:       color.text.inverse,
    border:     color.status.success.fg,
    icon:       color.text.inverse,
  },
  warning: {
    background: color.status.warning.fg,
    text:       color.text.inverse,
    border:     color.status.warning.fg,
    icon:       color.text.inverse,
  },
  danger: {
    background: color.action.danger,
    text:       color.text.inverse,
    border:     color.action.danger,
    icon:       color.text.inverse,
  },
  neutral: {
    background: color.action.secondary,
    text:       color.text.inverse,
    border:     color.action.secondary,
    icon:       color.text.inverse,
  },
} as const satisfies Record<string, AlertPalette>;

export const alert = {
  radius: radius.surface,     // 12 — matches Card + Dialog

  padding: {
    /**
     * Inline padding — matches Card comfortable rhythm so an Alert
     * inside a Card feels like a nested surface, not a new family.
     */
    x: spacing.inline.lg,      // 16
    y: spacing.stack.md,       // 12
  },

  /**
   * Gap between the icon slot, the body stack, and the close control.
   * Matches Card.Header inline gap for cross-family consistency.
   */
  outerGap: spacing.inline.md, // 12

  /**
   * Gap between the vertically-stacked body pieces (Title / Description
   * / Actions). Small enough to read as one message, large enough to
   * separate the parts.
   */
  bodyGap: spacing.stack.xs,   // 4

  icon: {
    /** Alert.Icon slot size — matches Badge lg (16). */
    size: 20,
  },

  title: {
    font:   typography.body,           // 16 regular
    weight: 600,                       // semibold — same rule as Card title
  },

  description: {
    font: typography.bodyS,            // 14 regular
  },

  actions: {
    /** Gap between action buttons — matches Card.Actions and Dialog.Actions. */
    gap:  spacing.inline.sm,           // 8
    /** Top margin above the actions row so it doesn't hug the description. */
    padTop: spacing.stack.sm,          // 8
  },

  close: {
    /** Hit target — matches Button size='sm'. */
    size:      24,
    iconSize:  14,
    /**
     * Hover wash — uses color-mix on currentColor so the same rule
     * works across every variant × appearance without a per-variant
     * override.
     */
    hoverBg:   "color-mix(in oklab, currentColor 12%, transparent)",
  },

  appearance: {
    soft,
    outline,
    solid,
  },

  disabled: {
    opacity: 0.5,
  },

  motion: {
    transition: motion.hoverIn,
  },
} as const;

export type AlertTokens     = typeof alert;
export type AlertVariant    = keyof typeof soft;
export type AlertAppearance = keyof typeof alert.appearance;
