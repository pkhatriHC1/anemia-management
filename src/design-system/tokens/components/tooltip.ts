/**
 * Tooltip component tokens.
 *
 * Tooltip is the canonical contextual hint primitive of HC1. It's a
 * lightweight floating card that appears next to a trigger to explain,
 * hint, or clarify — never to gate an action, never to require input.
 *
 * Visual language:
 *   - Surface reads as a dark inverted Card — the same radius family
 *     (radius.surface at half-step for compactness) and the same
 *     shadow tone (popover elevation) so tooltips read as members of
 *     the overlay family (Dialog, Drawer, Popover-future).
 *   - Body typography follows caption (12 · regular) so tooltips stay
 *     visually secondary to the trigger's own type.
 *   - Motion mirrors Dialog's entrance easing but at a shorter duration
 *     — tooltips must feel snappy, not ceremonial.
 *
 * The token bundle covers:
 *   surface   — background (inverse), text (inverse), border (subtle),
 *               radius (surface), shadow (popover), maxWidth
 *   arrow     — geometry per placement (base, half-base)
 *   spacing   — padding inside the panel, offset from trigger
 *   text      — caption typography
 *   motion    — entrance / exit duration + easing + delay defaults
 *
 * This primitive is designed to be reused later by Popover — a Popover
 * takes Tooltip's positioning + arrow, drops delay + hover semantics,
 * gains interactive content + focus management.
 */

import { aliases } from "../aliases";

const { color, radius, spacing, typography, elevation, motion } = aliases;

export const tooltip = {
  surface: {
    background: color.background.inverse,   // dark surface
    text:       color.text.inverse,         // white text
    border:     color.border.inverse,       // matches dark surface
    radius:     radius.control,             // 8 — half-step of surface radius; tooltips are compact
    shadow:     elevation.popover,          // shadow-md — floating but not lifted like a Dialog
    /**
     * Maximum inline width before content wraps. 260px is wide enough
     * for a full sentence of caption text without dominating the
     * viewport. Consumers can override via CSS var if needed.
     */
    maxWidth:   260,
  },

  arrow: {
    /**
     * Base width and half-base of the triangular arrow. 8px base gives
     * a proportion that reads well at the caption font size.
     */
    size:     8,
    halfSize: 4,
  },

  spacing: {
    /** Inside padding — tight because content is short. */
    padY: spacing.stack.xs,     // 4
    padX: spacing.inline.sm,    // 8
    /** Distance between trigger and tooltip (accounting for the arrow). */
    offset: 8,
  },

  text: {
    font:  typography.caption,  // 12/16 regular
    color: color.text.inverse,
  },

  motion: {
    duration: motion.hoverIn.duration,   // 150ms
    easing:   motion.hoverIn.easing,     // standard
    /**
     * Default show / hide delay. Show delay prevents accidental reveal
     * on drive-by mouse motion; hide delay bridges quick trigger→content
     * pointer moves (though Tooltip content is non-interactive so this
     * is mostly about not flickering during pointer travel).
     */
    delayShow: 200,
    delayHide: 100,
  },
} as const;

export type TooltipTokens = typeof tooltip;
