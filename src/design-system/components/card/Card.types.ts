import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "outlined"
  | "elevated"
  | "interactive"
  | "selected";

export type CardDensity = "compact" | "comfortable" | "relaxed";

/**
 * Root Card props. The Card renders as a `<div>` unless `onClick` is
 * provided or `variant='interactive'`, in which case it renders as a
 * `<button>` with keyboard focus and hover states.
 */
export type CardProps = Omit<HTMLAttributes<HTMLElement>, "onClick"> & {
  /**
   * Visual variant.
   * @default 'default'
   */
  variant?: CardVariant;
  /**
   * Density controls the internal spacing rhythm — padding, gaps, and
   * heading size. All three values reference spacing tokens directly;
   * never a bespoke pixel value.
   * @default 'comfortable'
   */
  density?: CardDensity;
  /**
   * Grow to fill the parent width. Default on — Cards are surfaces and
   * usually fill their container.
   * @default true
   */
  fullWidth?: boolean;
  /**
   * When true, the Card is treated as non-interactive. If also
   * clickable, click handlers are not invoked and focus is removed.
   */
  disabled?: boolean;
  /**
   * When true, an overlay spinner covers the Card body and sets
   * aria-busy on the root. Composed contents remain in the DOM (so the
   * card doesn't collapse) but are visually hidden and inert.
   */
  loading?: boolean;
  /**
   * Optional click handler. Providing it (or variant='interactive')
   * upgrades the root element to a `<button>` with proper keyboard and
   * focus treatment.
   */
  onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
  /**
   * When the Card is clickable AND represents a toggle-selectable item,
   * pass the current selection state. Sets aria-pressed on the button.
   * If your card is more like a radio, pair with `selected` on the
   * clicked one and use variant='selected' visually.
   */
  pressed?: boolean;
  /**
   * Content — typically a mix of `Card.Header`, `Card.Content`, and
   * `Card.Footer` subcomponents.
   */
  children?: ReactNode;
};

/**
 * Header — always renders at the top of a Card, above content.
 * Composes with `Card.Icon`, `Card.Title`, `Card.Description`, and
 * `Card.Actions` (right-aligned).
 */
export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  /**
   * Heading level for the title. Ranges 1..6.
   * @default 3
   */
  as?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardIconProps        = HTMLAttributes<HTMLSpanElement>;
export type CardContentProps     = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps      = HTMLAttributes<HTMLDivElement>;

/**
 * A row of actions — buttons, links. Right-aligned by default; use
 * `align='start'` for left-aligned action rows (rare).
 */
export type CardActionsProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Horizontal alignment of the action group.
   * @default 'end'
   */
  align?: "start" | "center" | "end";
};

/**
 * A themed divider between Card sections. Uses `border.subtle` and
 * spans the full width of the Card (edge-to-edge — no side padding).
 */
export type CardDividerProps = HTMLAttributes<HTMLHRElement>;

export type CardEmptyProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional icon to render at the top of the empty block. */
  icon?: ReactNode;
  /** Short title. */
  title?: ReactNode;
  /** Longer explanation. */
  description?: ReactNode;
  /** A single action or a `Card.Actions` group. */
  action?: ReactNode;
};

export type CardLoadingProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional label rendered under the spinner. */
  label?: ReactNode;
};
