/**
 * Textarea component tokens.
 *
 * Textarea is the canonical multi-line text input in HC1. It's a sibling
 * primitive to Input: same form family, same font ladder, same state
 * palette, same focus ring, same validation model, same helper/counter
 * footer. Only the height changes — the frame grows vertically to hold
 * multiple lines.
 *
 * Visual language: identical to Input by direct token reference. If Input
 * ever retints, Textarea moves with it. The only new geometry is
 *   - paddingY: vertical padding inside the frame (Input has none —
 *     it's height-locked to a single line)
 *   - lineHeight: rendered line height so minRows / maxRows compute
 *     predictable heights
 *   - minRows / maxRows: default row counts when the consumer doesn't
 *     override them
 *
 * The token bundle covers:
 *   size    — font per size (reused from Input)
 *   paddingX / paddingY / gap
 *   lineHeight
 *   minRows / maxRows
 *   state   — reused verbatim from Input (rest/hover/focus/filled/
 *              disabled/readonly/error/warning/success)
 *   radius  — control (reused from Input)
 *   transition — hoverIn (reused from Input)
 */

import { aliases } from "../aliases";
import { input } from "./input";

const { spacing } = aliases;

export const textarea = {
  radius: input.radius,

  /**
   * Horizontal padding of the textarea frame per size. Matches Input.paddingX
   * exactly so a textarea placed next to an input reads as the same family.
   */
  paddingX: {
    sm: input.paddingX.sm,   // 8
    md: input.paddingX.md,   // 12
    lg: input.paddingX.md,   // 12
  },

  /**
   * Vertical padding of the textarea frame per size. Chosen so that the
   * first line of text sits at the same baseline offset Input uses at the
   * same size — roughly (height - font-size * line-height) / 2 for the
   * corresponding Input height.
   */
  paddingY: {
    sm: spacing.inline.sm,   // 8
    md: spacing.inline.sm,   // 8
    lg: spacing.inline.md,   // 12
  },

  /**
   * Gap between the control and adornments (loading spinner). Kept
   * consistent with Input so mixed forms read as one system.
   */
  gap: {
    sm: input.gap.sm,
    md: input.gap.md,
    lg: input.gap.lg,
  },

  font: {
    sm: input.font.sm,   // 12
    md: input.font.md,   // 14
    lg: input.font.lg,   // 16
  },

  /**
   * Rendered line height per size. Used with paddingY + rows to compute
   * a stable minHeight (in `ch`-independent px) so autoResize can grow
   * to full-height cleanly without a scrollbar flash. 20/22/24 correspond
   * to the ~1.4 line-height ratio at 12/14/16 font sizes rounded up to an
   * even pixel.
   */
  lineHeight: {
    sm: 20,
    md: 22,
    lg: 24,
  },

  /**
   * Default minRows / maxRows applied when the consumer doesn't override.
   * autoResize starts at minRows and stops growing at maxRows (further
   * content scrolls inside the frame).
   */
  rows: {
    min: 3,
    max: 12,
  },

  transition: input.transition,

  /**
   * State palette. Reused verbatim from Input so a form with mixed Input
   * and Textarea reads as one visual family. If Input's palette ever
   * changes, Textarea moves with it.
   */
  state: input.state,
} as const;

export type TextareaTokens   = typeof textarea;
export type TextareaSizeName = keyof typeof textarea.paddingX;
