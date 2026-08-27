import type { HTMLAttributes, ReactNode } from "react";

/**
 * Size ladder — matches the Button ladder (sm=28, md=36, lg=44) so an
 * inline Button placed next to a Pagination.Page sits flush without
 * adding vertical noise.
 */
export type PaginationSize = "sm" | "md" | "lg";

/**
 * A page-window slot as produced by the built-in page-window algorithm.
 * `type: 'page'` items carry a `page` number; `type: 'ellipsis'` items
 * carry a stable `key` so React reconciliation does not thrash when
 * ellipses appear/disappear.
 */
export type PaginationWindowItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: "start" | "end" };

/**
 * Root Pagination props.
 *
 * Pagination is a **controlled** primitive — the consumer owns `page`
 * and reacts to `onPageChange`. The primitive does not remember the
 * current page across renders; that lives with the surface that owns
 * the data.
 *
 * Compose with `Pagination.Info`, `Pagination.PageList`,
 * `Pagination.Previous`, `Pagination.Next`, `Pagination.PageSize`
 * (any subset, in any order). Root positions the compound children
 * with a flex row.
 */
export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  /**
   * Current page (1-based). Clamped to `[1, pageCount]` internally.
   */
  page: number;
  /**
   * Total number of pages. Must be ≥ 1.
   */
  pageCount: number;
  /**
   * Fires when the user selects a different page — via Previous, Next,
   * or a Page button. Consumer is responsible for updating `page`.
   */
  onPageChange?: (page: number) => void;

  /**
   * Current page size (rows per page). Optional — only needed when
   * rendering `Pagination.Info` with an item count, or when using
   * `Pagination.PageSize`.
   */
  pageSize?: number;
  /**
   * Available page-size choices. When provided together with
   * `onPageSizeChange`, `Pagination.PageSize` renders a Select.
   */
  pageSizeOptions?: number[];
  /**
   * Fires when the user selects a different page size.
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Total number of items across all pages. Optional — enables the
   * "Showing X–Y of Z" summary in `Pagination.Info`.
   */
  totalItems?: number;

  /**
   * Size ladder — matches Button sm/md/lg (28/36/44 heights).
   * @default 'md'
   */
  size?: PaginationSize;

  /**
   * Number of pages to always show on each side of the current page
   * (excluding first / last / boundary pages).
   * @default 1
   */
  siblingCount?: number;

  /**
   * Number of pages to always show at the start and end (the "book
   * ends"). Setting to 1 means the first and last page are always
   * visible.
   * @default 1
   */
  boundaryCount?: number;

  /**
   * When true, every control renders disabled and no click fires an
   * `onPageChange`. Purely a visual + interaction state — the
   * navigation landmark still announces normally.
   */
  disabled?: boolean;

  /**
   * When true, controls render disabled and the root sets
   * `aria-busy='true'`. Use while the underlying data is refetching.
   */
  loading?: boolean;

  /**
   * Composed subcomponents — any subset, in any order.
   */
  children?: ReactNode;
};

/* ══════ SUBCOMPONENTS ═════════════════════════════════════════════ */

/**
 * A results summary — "Showing 1–10 of 100" or "Page 1 of 10".
 * Reads `page`, `pageCount`, `pageSize`, and `totalItems` from the
 * Pagination context. Consumers can pass their own children to
 * override the default text.
 */
export type PaginationInfoProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Optional custom summary formatter. Receives the current page, page
   * count, and (when available) the item range. Return any ReactNode.
   */
  render?: (state: {
    page: number;
    pageCount: number;
    pageSize?: number;
    totalItems?: number;
    firstItem?: number;
    lastItem?: number;
  }) => ReactNode;
};

/**
 * The list of page buttons — first, last, sibling window, and
 * ellipses. Reads the page window from context.
 *
 * When the consumer authors children inside `<Pagination.PageList>`,
 * those children replace the auto-generated window entirely — use for
 * unusual layouts (e.g. jump-to-page input). Pass no children to get
 * the standard window.
 */
export type PaginationPageListProps = HTMLAttributes<HTMLUListElement>;

/**
 * A single page button. Rendered by `Pagination.PageList` by default;
 * consumers rarely author this directly.
 */
export type PaginationPageProps = Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** The 1-based page number this button navigates to. */
  page: number;
  /** Explicit disabled — falls back to the parent `disabled` / `loading`. */
  disabled?: boolean;
};

/**
 * Previous-page button. Reads the current page from context and fires
 * `onPageChange(page - 1)`. Disabled when the current page is 1.
 */
export type PaginationPreviousProps = Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /**
   * Visible label. Set to an empty string for icon-only.
   * @default 'Previous'
   */
  label?: string;
  /**
   * When true, the label is hidden visually but kept in the DOM for
   * screen readers. Use for compact pagination bars.
   * @default false
   */
  labelHidden?: boolean;
  /** Explicit disabled — combined with the parent disabled / loading. */
  disabled?: boolean;
};

/**
 * Next-page button. Reads the current page from context and fires
 * `onPageChange(page + 1)`. Disabled when the current page equals
 * `pageCount`.
 */
export type PaginationNextProps = Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /**
   * Visible label. Set to an empty string for icon-only.
   * @default 'Next'
   */
  label?: string;
  /**
   * When true, the label is hidden visually but kept in the DOM for
   * screen readers.
   * @default false
   */
  labelHidden?: boolean;
  /** Explicit disabled — combined with the parent disabled / loading. */
  disabled?: boolean;
};

/**
 * A page-size selector — "10 per page ▼". Renders nothing unless
 * `pageSizeOptions` and `onPageSizeChange` are supplied to the root.
 */
export type PaginationPageSizeProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Visible label prefix. Follows the shape "{label} <select>".
   * @default 'Per page'
   */
  label?: string;
  /**
   * When true, the label is hidden visually but kept in the DOM for
   * screen readers.
   * @default false
   */
  labelHidden?: boolean;
};
