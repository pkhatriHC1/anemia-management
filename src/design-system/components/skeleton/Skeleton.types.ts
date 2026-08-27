import type { HTMLAttributes } from "react";

/**
 * Visual variant. Only sets the default height and radius — every
 * dimension can still be overridden via `width` / `height` / `radius`.
 *
 *   text      → a line of body-text height (14 · chip radius)
 *   title     → a headline line (24 · chip radius)
 *   circle    → perfect circle (40×40 · full radius); avatars, dots
 *   rectangle → a block (100×100% · zero radius); hero images
 *   rounded   → a block (100×100% · control radius); cards, buttons
 */
export type SkeletonVariant =
  | "text"
  | "title"
  | "circle"
  | "rectangle"
  | "rounded";

export type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Visual variant. Sets the default height + radius.
   * @default 'text'
   */
  variant?: SkeletonVariant;
  /**
   * Width — a number (px) or a CSS length. When omitted, uses the
   * variant's default (100% for text/rectangle/rounded, 60% for title,
   * or equal to `height` for circle).
   */
  width?: number | string;
  /**
   * Height — a number (px) or a CSS length. When omitted, uses the
   * variant's default (14 for text, 24 for title, 40 for circle,
   * 100 for rectangle/rounded).
   */
  height?: number | string;
  /**
   * When set on a `text` or `title` variant, render `lines` stacked
   * skeleton bars. The last bar renders at 60% width for realism.
   * Ignored for circle / rectangle / rounded.
   * @default 1
   */
  lines?: number;
  /**
   * Toggle the shimmer animation. When false, the skeleton renders as
   * a static block. Consumers may set this to false for high-frequency
   * loading states that would otherwise thrash the animation.
   * @default true
   */
  animated?: boolean;
  /**
   * Explicit border-radius override — a number (px) or a CSS length.
   * When omitted, the variant's default radius applies.
   */
  radius?: number | string;
};
