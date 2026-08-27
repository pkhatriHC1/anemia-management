/**
 * Drawer component tokens.
 *
 * Drawer is the canonical side-panel primitive in HC1. Every future
 * side-anchored surface — Patient Detail Panel, User Profile Panel,
 * Advanced Filters, Settings Panel, AI Inspector, Activity Details —
 * must compose this Drawer rather than reimplement slide-over behavior.
 *
 * The drawer intentionally reads as Dialog extended sideways: same
 * radius family, same elevated background, same border tone, same
 * scrim, same focus + Escape + body-scroll-lock behavior. Only the
 * geometry and the motion differ.
 *
 * The token bundle covers:
 *   surface  — background, border, shadow of the drawer panel
 *   scrim    — the dimmed backdrop behind the panel (shared with Dialog)
 *   size     — width ladder for the panel (sm / md / lg / fullscreen)
 *   header / body / footer  — padding + typography per subcomponent slot
 *   sticky   — header/footer pinned state, border tone + shadow
 *   close    — icon-button hit target + tint
 *   loading  — overlay + spinner tint (shared visual language with Dialog)
 *   motion   — slide-in / slide-out per placement
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const drawer = {
  surface: {
    background: color.background.elevated,
    border:     color.border.subtle,
    /**
     * Only the *inner* edge is rounded (top-left/bottom-left for a right
     * drawer; top-right/bottom-right for a left drawer). The panel abuts
     * the viewport edge so the outer corners are square.
     */
    radius:     radius.surface,
    shadow:     elevation.modal,
    color:      color.text.primary,
  },

  scrim: {
    /**
     * Shared with Dialog so both overlay families read as one system.
     * Consumers should reference `--hc-dialog-scrim` in CSS.
     */
    background: color.background.inverse,
    opacity:    0.5,
  },

  /**
   * Panel width ladder. Values are px because a drawer is a discrete
   * modal surface — not part of the spacing scale. Sizes map roughly to
   * "narrow / default / spacious / edge-to-edge". Height is always 100dvh.
   */
  size: {
    sm:         "360px",
    md:         "480px",
    lg:         "640px",
    fullscreen: "100vw",
  },

  header: {
    padding: {
      x: spacing.inline.xl,   // 24
      y: spacing.stack.lg,    // 16
    },
    gap:              spacing.stack.xs,       // 4 between title + description
    titleFont:        typography.headingS,    // 20 / 28 (matches Dialog + Card comfortable title)
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
    gap: spacing.inline.sm,   // 8 — matches Button + Card + Dialog actions
  },

  /**
   * Sticky header/footer treatment. When the body scrolls, a subtle 1px
   * shadow appears under the sticky region so it visually detaches.
   */
  sticky: {
    headerBorder: color.border.subtle,
    footerBorder: color.border.subtle,
    /** Same tone the Table sticky header uses so the family stays cohesive. */
    shadow: "0 1px 2px rgba(15, 20, 25, 0.08)",
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

export type DrawerTokens    = typeof drawer;
export type DrawerSize      = keyof typeof drawer.size;
export type DrawerPlacement = "left" | "right";
