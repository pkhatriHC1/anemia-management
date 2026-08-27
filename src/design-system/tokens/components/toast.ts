/**
 * Toast component tokens.
 *
 * Toast is the canonical transient-feedback primitive in HC1. Save
 * confirmations, delete confirmations, upload completions, background-
 * job completions, validation summaries, warnings, errors, and
 * informational notices all compose this Toast rather than
 * reimplementing floating-notification treatments.
 *
 * The token bundle covers:
 *   surface  — floating card treatment (bg + border + radius + shadow)
 *   accent   — variant-colored left stripe + variant-colored icon
 *   part     — padding + gap + typography per subcomponent slot
 *   motion   — enter + exit + auto-close defaults
 *
 * The Toast's visual language is deliberately Card + Alert: an elevated
 * white card with Alert-style content and a variant-colored left
 * accent stripe. This keeps the tone unambiguous without tinting the
 * whole surface — the accent stripe carries the meaning while the
 * body typography stays neutral and legible.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

type ToastAccent = {
  /** Variant-colored left stripe. */
  stripe: string;
  /** Icon color when Toast.Icon is present — always the bright, solid tone. */
  icon:   string;
};

/**
 * Per-variant accent. Only the stripe + icon color change — the body
 * surface stays neutral (elevated white) so the message reads at the
 * same intensity across every tone.
 */
const accent = {
  info: {
    stripe: color.status.info.fg,
    icon:   color.status.info.icon,
  },
  success: {
    stripe: color.status.success.fg,
    icon:   color.status.success.icon,
  },
  warning: {
    stripe: color.status.warning.fg,
    icon:   color.status.warning.icon,
  },
  danger: {
    stripe: color.action.danger,
    icon:   color.status.error.icon,
  },
  neutral: {
    stripe: color.border.strong,
    icon:   color.text.tertiary,
  },
} as const satisfies Record<string, ToastAccent>;

export const toast = {
  /**
   * Floating card surface. Every Toast reads as an elevated white
   * card — the tone lives on the accent stripe, not on the card body.
   */
  surface: {
    background: color.background.elevated,
    border:     color.border.default,
    text:       color.text.primary,
    radius:     radius.surface,        // 12 — matches Card + Dialog + Alert
    shadow:     elevation.overlay,     // shadow-lg
    /** Width of the variant-colored left accent stripe. */
    stripeWidth: 4,
    /** Comfortable min/max widths — narrower than Alert since Toasts float. */
    minWidth: 320,
    maxWidth: 420,
  },

  /**
   * Per-variant accent palette (stripe + icon). The body surface is
   * variant-agnostic so the same padding + border + shadow apply to
   * every combination.
   */
  accent,

  padding: {
    /**
     * Inline padding — matches Alert / Card comfortable rhythm. The
     * left padding is bumped by 4px to make room for the accent stripe
     * without visually shortening the body.
     */
    x: spacing.inline.lg,              // 16
    y: spacing.stack.md,               // 12
  },

  /**
   * Gap between the icon slot, the body stack, and the close control.
   * Matches Alert outer gap for cross-family consistency.
   */
  outerGap: spacing.inline.md,         // 12

  /**
   * Gap between the vertically-stacked body pieces (Title / Description
   * / Actions). Same rhythm as Alert — small enough to read as one
   * message, large enough to separate the parts.
   */
  bodyGap: spacing.stack.xs,           // 4

  icon: {
    /** Toast.Icon slot size — matches Alert.Icon + Badge lg. */
    size: 20,
  },

  title: {
    font:   typography.bodyS,          // 14 regular — Toasts are more compact than Alert
    weight: 600,                       // semibold — same rule as Card / Alert title
  },

  description: {
    font: typography.bodyS,            // 14 regular
  },

  actions: {
    /** Gap between action buttons — matches Alert / Card / Dialog. */
    gap:    spacing.inline.sm,         // 8
    /** Top margin above the actions row so it doesn't hug the description. */
    padTop: spacing.stack.sm,          // 8
  },

  close: {
    /** Hit target — matches Alert.Close + Button size='sm'. */
    size:     24,
    iconSize: 14,
    /** Hover wash — subtle neutral so it doesn't compete with the accent. */
    hoverBg:  color.background.subtle,
  },

  motion: {
    /** Enter animation — slide-up + fade. Matches overlay entrance. */
    enter: motion.overlayEnter,        // 250ms cubic-bezier(0,0,0.2,1)
    /** Exit animation — slide-down + fade. Matches overlay exit. */
    exit:  motion.overlayExit,         // 150ms cubic-bezier(0.4,0,1,1)
    /**
     * Default auto-close duration. Long enough to read a short
     * sentence, short enough to stay temporary. Pauses on hover /
     * focus per WCAG 2.2.1 Timing Adjustable.
     */
    autoCloseDefaultMs: 4000,
  },
} as const;

export type ToastTokens  = typeof toast;
export type ToastVariant = keyof typeof accent;
