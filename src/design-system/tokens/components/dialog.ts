/**
 * Dialog component tokens.
 *
 * Dialog is the canonical overlay primitive in HC1. Every future overlay
 * — Alert Dialog, Confirmation Dialog, Form Dialog, Wizard Dialog — must
 * compose this Dialog rather than reimplement overlay behavior.
 *
 * The token bundle covers:
 *   surface  — background, border, radius, shadow of the dialog panel
 *   scrim    — the dimmed backdrop behind the panel
 *   size     — width ladder for the panel (sm / md / lg / xl / fullscreen)
 *   part     — padding + typography per subcomponent slot
 *   motion   — enter and exit transitions (shared with all overlays)
 *
 * The panel's visual language is intentionally aligned with Card — same
 * radius, same elevated background, same border tone — so a Dialog reads
 * as a Card floated above the scrim rather than a new surface family.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const dialog = {
  surface: {
    background: color.background.elevated,
    border:     color.border.subtle,
    radius:     radius.surface,
    shadow:     elevation.modal,
    color:      color.text.primary,
  },

  scrim: {
    /**
     * Semantic scrim: derived from the inverse background at 50% opacity.
     * Consumers should reference `--hc-dialog-scrim` in CSS rather than
     * a raw rgba() so the tone follows the neutral ramp.
     */
    background: color.background.inverse,
    opacity:    0.5,
  },

  /**
   * Panel width ladder. Values are px because a dialog is a discrete
   * modal surface — not part of the spacing scale. Sizes map roughly to
   * "single question / short form / long form / wide detail / edge-to-edge".
   */
  size: {
    sm:         "400px",
    md:         "560px",
    lg:         "720px",
    xl:         "960px",
    fullscreen: "100vw",
  },

  header: {
    padding: {
      x: spacing.inline.xl,   // 24
      y: spacing.stack.lg,    // 16
    },
    gap:              spacing.stack.xs,       // 4 between title + description
    titleFont:        typography.headingS,    // 20 / 28 (matches Card comfortable title)
    descriptionFont:  typography.bodyS,
    descriptionColor: color.text.tertiary,
  },

  body: {
    padding: {
      x: spacing.inline.xl,   // 24
      y: spacing.stack.md,    // 12
    },
    text: color.text.secondary,
    font: typography.body,
  },

  footer: {
    padding: {
      x: spacing.inline.xl,   // 24
      y: spacing.stack.lg,    // 16
    },
    background: color.background.default,
    borderTop:  color.border.subtle,
    text:       color.text.tertiary,
    font:       typography.bodyS,
  },

  actions: {
    gap: spacing.inline.sm,   // 8 — matches Button + Card actions
  },

  close: {
    /** Icon-button hit target — matches Button size='sm'. */
    size:      28,
    iconSize:  16,
    color:     color.text.tertiary,
    colorHover: color.text.primary,
    background:      "transparent",
    backgroundHover: color.background.subtle,
  },

  loading: {
    background: color.background.default,
    spinnerBg:  color.border.default,
    spinnerFg:  color.action.primary,
    minHeight:  "160px",
  },

  motion: {
    enter: motion.overlayEnter,
    exit:  motion.overlayExit,
  },
} as const;

export type DialogTokens = typeof dialog;
export type DialogSize   = keyof typeof dialog.size;
