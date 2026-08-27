import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Root Breadcrumb. Renders as `<nav aria-label={label}>` — the semantic
 * container that assistive tech treats as a breadcrumb navigation
 * landmark. Every list of crumbs, whether static or generated from a
 * router, composes this root.
 *
 * Composition:
 *   <Breadcrumb>
 *     <Breadcrumb.List>
 *       <Breadcrumb.Item><Breadcrumb.Link href="/patients">Patients</Breadcrumb.Link></Breadcrumb.Item>
 *       <Breadcrumb.Separator />
 *       <Breadcrumb.Item><Breadcrumb.Current>John Smith</Breadcrumb.Current></Breadcrumb.Item>
 *     </Breadcrumb.List>
 *   </Breadcrumb>
 *
 * A convenience shorthand is available: pass `items` for the common
 * data-shape path and the component renders the list + items +
 * separators + current automatically.
 */
export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  /**
   * The accessible name of the breadcrumb landmark.
   * @default "Breadcrumb"
   */
  label?: string;

  /**
   * Convenience shorthand. Pass an array of items and the component
   * renders `Breadcrumb.List`, `Breadcrumb.Item` × n, separators, and
   * the current crumb automatically. The last item is treated as the
   * current page and rendered via `Breadcrumb.Current`. Ignored when
   * `children` are composed.
   */
  items?: BreadcrumbItemData[];

  /**
   * Replace the default separator icon. Applied only when using the
   * `items` shorthand. Composed usage should render its own
   * `<Breadcrumb.Separator>` slots.
   */
  separator?: ReactNode;

  /**
   * When set to a positive integer, paths longer than `maxItems` are
   * collapsed: the first item + an ellipsis + the last `maxItems - 1`
   * items are rendered. The ellipsis reveals the hidden crumbs via a
   * popover on activation. Only applies to the `items` shorthand.
   */
  maxItems?: number;

  /** Compose Breadcrumb.List. Wins over items when both are supplied. */
  children?: ReactNode;
};

/**
 * Shape of a single crumb when using the `items` shorthand.
 */
export type BreadcrumbItemData = {
  /** Visible label. */
  label:    ReactNode;
  /** Destination. When omitted (and it is not the last item), the crumb renders as text. */
  href?:    string;
  /** Optional icon rendered before the label. Sized via the icon-size token. */
  icon?:    ReactNode;
  /** Disables interaction and dims the link. */
  disabled?: boolean;
};

/**
 * List slot — an `<ol>` (ordered list) container. Ordered because
 * breadcrumbs communicate a directional path from root to current.
 */
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;

/**
 * Item slot — an `<li>` container for a single crumb. Wraps a Link or
 * a Current.
 */
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

/**
 * Link slot — a real `<a>` anchor. Focus, hover, and colour inherit
 * from tokens. When `disabled`, the anchor renders as a `<span>`
 * with the disabled styling (native anchors do not have a `disabled`
 * attribute; we swap the element so keyboard users can't tab into
 * an inert link).
 */
export type BreadcrumbLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /**
   * Destination. Omit for a non-navigable label that still styles as
   * a link (rare — usually you want `<Breadcrumb.Current>` instead).
   */
  href?:    string;
  /** Disables the link. Renders as a span with `aria-disabled='true'`. */
  disabled?: boolean;
  /** Optional icon rendered before the label. */
  icon?:    ReactNode;
};

/**
 * Separator slot — the visual pointer between two items. Renders as
 * an `<li>` with `role='presentation'` and `aria-hidden='true'` so
 * assistive tech doesn't announce it. Defaults to a right-caret icon;
 * pass `children` to override with an arbitrary node (slash, arrow,
 * dot, etc.).
 */
export type BreadcrumbSeparatorProps = Omit<LiHTMLAttributes<HTMLLIElement>, "children"> & {
  /** Replace the default caret. */
  children?: ReactNode;
};

/**
 * Current slot — the terminal crumb representing the user's current
 * location. Renders as a `<span aria-current='page'>` so assistive
 * tech announces "current page" when the crumb is read.
 */
export type BreadcrumbCurrentProps = HTMLAttributes<HTMLSpanElement> & {
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
};
