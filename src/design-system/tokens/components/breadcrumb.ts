/**
 * Breadcrumb component tokens.
 *
 * Breadcrumb is the canonical hierarchical-location component of HC1.
 * Every page that lives more than one level deep in the information
 * architecture (Patient Details, Reports, Settings, Administration,
 * Analytics, and every multi-level detail page across every HC1 IQ
 * module) shows its ancestry via this Breadcrumb.
 *
 * Visual language:
 *   - Body-S typography (14/20 · regular) so the crumb strip reads as
 *     secondary chrome — never competing with the page title beneath.
 *   - Link ink follows the Link/Text alias family (secondary at rest,
 *     primary on hover, brand focus ring) so it inherits any future
 *     retint without churn.
 *   - Current item is primary ink + medium weight — it must look
 *     like a destination, not another link.
 *   - Separator is the muted tertiary ink so the eye traces the
 *     labels first, the separators second.
 *   - Focus ring matches Button + Input + Link — 2px brand outline
 *     with an outline-offset so the ring paints outside the crumb
 *     without shifting layout.
 *   - Motion follows Button hover (150ms colour transition).
 *
 * The token bundle covers:
 *   surface   — row height (single-line strip), padding, gap
 *   link      — colour ladder (rest / hover / focus / current / disabled)
 *   separator — colour, gap, size of the icon separator
 *   text      — bodyS typography for labels + separator
 *   motion    — 150ms colour transition
 */

import { aliases } from "../aliases";

const { color, spacing, typography, motion } = aliases;

export const breadcrumb = {
  surface: {
    /** Single-line strip height — matches sm Button so a breadcrumb + Button in the same row sit flush. */
    rowHeight: 28,
    /** Horizontal padding inside each link (creates hit-target beyond the text). */
    padX: spacing.inline.xs,   // 4
    /** Vertical padding — smaller than padX because rowHeight already sets the frame. */
    padY: 2,
    /** Gap between item + separator + next item. */
    gap:  spacing.inline.xs,   // 4
  },

  link: {
    /** Rest — secondary ink so links read as chrome, not primary content. */
    color:         color.text.secondary,
    /** Hover — primary ink + underline so intent is obvious. */
    colorHover:    color.text.primary,
    /** Focused — brand ink so the focus ring + colour together shout "you're here". */
    colorFocus:    color.text.link,
    /** Current — primary ink + medium weight; NEVER a link, ARIA aria-current='page'. */
    colorCurrent:  color.text.primary,
    /** Disabled — muted, no hover cue, cursor: not-allowed. */
    colorDisabled: color.text.disabled,
    /** Radius on the interactive rectangle so focus ring / hover bg don't paint hard corners. */
    radius:        4,
    /** Focus ring — 2px brand outline, matches Button + Input. */
    ringColor:     color.border.focus,
    ringWidth:     2,
    ringOffset:    2,
  },

  separator: {
    /** Muted tertiary ink so labels are read first, separators second. */
    color:    color.text.tertiary,
    /** Sized to match the caret icon that ships as the default separator. */
    iconSize: 14,
    /** Inline gap between separator + adjacent items (adds to surface.gap). */
    gap:      spacing.inline.xs,  // 4
  },

  text: {
    /** Body-S — 14/20 regular. Same ladder as Input helper text and Card description. */
    font:         typography.bodyS,
    /** Semibold current so the destination reads distinctly from the link chain. */
    weightCurrent: 500,
  },

  motion: {
    duration: motion.hoverIn.duration,   // 150ms
    easing:   motion.hoverIn.easing,     // standard
  },
} as const;

export type BreadcrumbTokens = typeof breadcrumb;
