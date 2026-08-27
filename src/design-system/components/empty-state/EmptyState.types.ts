import type { HTMLAttributes, ReactNode } from "react";

/**
 * Semantic variant. Only tints the icon container — the surrounding
 * layout, typography, and actions stay neutral. Pick by meaning:
 *
 *   default    → the quiet, most-common empty state
 *   search     → "no results found" for a query/filter
 *   onboarding → first-time setup, welcome moments (brand tint)
 *   error      → the surface failed to load (danger tint)
 *   permission → the user does not have access (warning tint)
 *   offline    → connectivity or environment issue (muted tint)
 */
export type EmptyStateVariant =
  | "default"
  | "search"
  | "onboarding"
  | "error"
  | "permission"
  | "offline";

/**
 * Layout mode.
 *   centered  → default. Generous padding, tall min-height, content
 *               centered. Use on a page or a full-height panel.
 *   contained → compact. Shorter min-height, tighter padding, still
 *               centered. Use inside a Card content, a Dialog body,
 *               or a Tab panel.
 */
export type EmptyStateLayout = "centered" | "contained";

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Semantic variant. Only the icon-container tint changes.
   * @default 'default'
   */
  variant?: EmptyStateVariant;
  /**
   * Layout mode.
   * @default 'centered'
   */
  layout?: EmptyStateLayout;
  /**
   * When true, render a skeleton placeholder instead of the composed
   * content. Sets `aria-busy='true'` on the root. Useful for the
   * one-shot moment before the empty state resolves — showing the
   * skeleton then swapping to the real empty state avoids a layout
   * jump.
   */
  loading?: boolean;
  /**
   * Compose with EmptyState.Icon (or Illustration), EmptyState.Title,
   * EmptyState.Description, EmptyState.Actions, and EmptyState.Footer.
   * Any subset, in any order — the root arranges them in a canonical
   * vertical stack (Icon/Illustration → Title → Description → Actions
   * → Footer).
   */
  children?: ReactNode;
};

/* ══════ SUBCOMPONENTS ═════════════════════════════════════════════ */

/**
 * A small icon rendered inside a rounded container. The container's
 * tint follows the root's `variant`. Only decorative — the meaning
 * lives in the title + description.
 */
export type EmptyStateIconProps = HTMLAttributes<HTMLSpanElement>;

/**
 * A larger illustration slot with no container background. Use for
 * bespoke SVG illustrations. Only one of Icon or Illustration should
 * appear in a given EmptyState — if both are provided, the Illustration
 * takes over the icon slot and the Icon is ignored.
 */
export type EmptyStateIllustrationProps = HTMLAttributes<HTMLDivElement>;

export type EmptyStateTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  /**
   * Heading level. Default is `h3` — pair with the surrounding page
   * outline (e.g. `as={2}` when the empty state IS the page's main
   * content).
   * @default 3
   */
  as?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type EmptyStateDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * A row of actions — usually one primary Button and one secondary /
 * ghost Button. Placed at the bottom of the content stack (above the
 * Footer, if present).
 */
export type EmptyStateActionsProps = HTMLAttributes<HTMLDivElement>;

/**
 * Small footer text or link row — help pointers, support links,
 * documentation nudges. Renders below the actions with a subtle
 * top border.
 */
export type EmptyStateFooterProps = HTMLAttributes<HTMLDivElement>;
