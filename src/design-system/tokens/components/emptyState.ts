/**
 * Empty State component tokens.
 *
 * EmptyState is the canonical zero-state primitive in HC1. Empty
 * tables, no-search-results screens, first-time setup panels, offline
 * fallbacks, and permission-denied surfaces all compose this
 * EmptyState rather than reimplementing centered stacks.
 *
 * The token bundle covers:
 *   layout     — padding + min-height for the two layout modes
 *   variant    — a semantic tint applied only to the icon container
 *   icon       — icon-in-circle container sizing + color per variant
 *   illustration — larger illustration slot (no container, just a size cap)
 *   title / description / actions / footer — typography + spacing
 *   loading    — skeleton placeholder tokens
 *
 * The variant tint is deliberately restrained — the empty state's
 * *content* carries the meaning. A soft brand tint on the icon
 * circle for `onboarding` or a soft red for `error` is enough to
 * hint at the state without turning the whole surface into an Alert.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, motion } = aliases;

type IconTint = {
  /** Background of the round icon container. */
  background: string;
  /** Color of the icon glyph itself. */
  color:      string;
};

/**
 * Per-variant tint for the icon container. Only the icon changes —
 * title, description, and footer stay neutral. Consumers can override
 * a specific empty state's palette by passing className / inline style
 * on `EmptyState.Icon` if they need to.
 */
const iconTint = {
  default: {
    background: color.background.subtle,
    color:      color.text.tertiary,
  },
  search: {
    background: color.background.subtle,
    color:      color.text.tertiary,
  },
  onboarding: {
    background: color.status.info.bg,
    color:      color.action.primary,
  },
  error: {
    background: color.status.error.bg,
    color:      color.status.error.fg,
  },
  permission: {
    background: color.status.warning.bg,
    color:      color.status.warning.fg,
  },
  offline: {
    background: color.background.subtle,
    color:      color.text.secondary,
  },
} as const satisfies Record<string, IconTint>;

export const emptyState = {
  radius: radius.surface,   // 12 — matches Card + Alert when embedded

  layout: {
    /**
     * `centered` — the default. Generous padding, taller min-height,
     * content vertically + horizontally centered. Use inside a page or
     * a full-height panel.
     */
    centered: {
      padX:      spacing.inline.xl,   // 24
      padY:      spacing.section.md,  // 48
      minHeight: "320px",
      maxWidth:  "460px",
    },
    /**
     * `contained` — compact. Shorter min-height, tighter vertical
     * padding, still centered. Use inside a Card content area, a
     * Dialog body, or a Tab panel where the surrounding surface
     * already provides its own frame.
     */
    contained: {
      padX:      spacing.inline.lg,   // 16
      padY:      spacing.section.sm,  // 32
      minHeight: "240px",
      maxWidth:  "420px",
    },
  },

  icon: {
    /** Round icon container. Sized to feel like a compact Badge lg. */
    container: {
      size:   56,
      radius: radius.circular,
    },
    /** Glyph size inside the container. */
    glyphSize: 24,
    variant:   iconTint,
  },

  illustration: {
    /** Cap the illustration size so surfaces stay quiet. */
    maxWidth:  200,
    maxHeight: 160,
    marginBottom: spacing.stack.md,
  },

  title: {
    font:   typography.headingS,       // 20 / 28 — matches Card comfortable title
    color:  color.text.primary,
    /**
     * Spacing above the title when following an Icon or Illustration.
     */
    marginTop: spacing.stack.md,
  },

  description: {
    font:  typography.body,            // 16 / 24
    color: color.text.tertiary,
    /**
     * Spacing above the description when following the Title.
     */
    marginTop: spacing.stack.xs,
  },

  actions: {
    /** Spacing above the actions row. */
    marginTop: spacing.stack.lg,
    /** Gap between action buttons — matches Card.Actions + Dialog.Actions. */
    gap:       spacing.inline.sm,
  },

  footer: {
    marginTop: spacing.stack.lg,
    font:      typography.bodyS,       // 14 / 20 — quieter than description
    color:     color.text.tertiary,
    /** Divider between description and footer for visual separation. */
    borderTop: color.border.subtle,
    padTop:    spacing.stack.md,
  },

  loading: {
    /**
     * Skeleton bar surface. Uses subtle bg so the shimmer reads on
     * both light and elevated backgrounds without being distracting.
     */
    background: color.background.subtle,
    /** Skeleton pulse duration under prefers-reduced-motion. */
    duration:   motion.transitionSlow.duration,
  },
} as const;

export type EmptyStateTokens  = typeof emptyState;
export type EmptyStateVariant = keyof typeof iconTint;
export type EmptyStateLayout  = keyof typeof emptyState.layout;
