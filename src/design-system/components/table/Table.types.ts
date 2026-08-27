import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

/**
 * Density controls the row-height ladder plus internal cell padding.
 * Row heights map 1:1 to the Button size ladder so inline Buttons and
 * Selects sit flush with a row without adding vertical noise.
 *   compact     → 28px  (Button sm)
 *   comfortable → 36px  (Button md)  ← default
 *   relaxed     → 44px  (Button lg)
 */
export type TableDensity = "compact" | "comfortable" | "relaxed";

/**
 * Sort direction for a sortable Table.Head cell. `null` means the
 * column is sortable but not currently the active sort column.
 */
export type SortDirection = "asc" | "desc" | null;

/* ══════ ROOT ═══════════════════════════════════════════════════════ */

export type TableProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
  /**
   * Row-height + cell-padding ladder.
   * @default 'comfortable'
   */
  density?: TableDensity;
  /**
   * Zebra striping on body rows. Off by default — HC1 tables are
   * typically dense and stripes double the visual noise.
   * @default false
   */
  striped?: boolean;
  /**
   * Whether hover feedback is applied to body rows. Off by default when
   * no row is clickable; on automatically when a row provides `onClick`.
   * Passing `hover` explicitly forces the feedback on regardless.
   * @default false
   */
  hover?: boolean;
  /**
   * Grow to fill the parent width. Default on — tables are surfaces
   * and usually stretch to their container.
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Whether to draw the outer surface frame (border + radius + shadow).
   * Turn off when embedding the table inside another framed surface
   * (e.g. a Card) so the borders don't double up.
   * @default true
   */
  bordered?: boolean;
  /**
   * A short label used to identify the table for assistive tech via
   * `aria-label`. Prefer passing this OR wiring your visible heading to
   * the table via `aria-labelledby`.
   */
  ariaLabel?: string;
  /**
   * When present, sets `aria-labelledby` on the table.
   */
  ariaLabelledBy?: string;
  children?: ReactNode;
};

/* ══════ TOOLBAR / SEARCH / FILTERS ════════════════════════════════ */

export type TableToolbarProps = HTMLAttributes<HTMLDivElement>;

/**
 * A slot for the primary search control. Consumers compose their own
 * Input or Search component inside — the Toolbar takes care of layout.
 */
export type TableSearchProps = HTMLAttributes<HTMLDivElement>;

/**
 * A slot for filter chips, filter Selects, or a filter menu button.
 */
export type TableFiltersProps = HTMLAttributes<HTMLDivElement>;

/* ══════ CONTENT / TABLE ═══════════════════════════════════════════ */

export type TableContentProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * When true, the header row sticks to the top of a scrolling content
   * region. The consumer is responsible for constraining the height of
   * the scroll region (usually with `maxHeight` inline or a parent
   * `.hc-table` inside a fixed-height container).
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * The maximum height of the scrolling content region. Passing this
   * turns the content region into a scroll container (`overflow: auto`)
   * so the header can stick to the top.
   */
  maxHeight?: number | string;
  /**
   * Marks the table as busy — sets `aria-busy` on the table element so
   * assistive tech announces the loading state. The consumer is still
   * responsible for rendering `Table.Loading` inside the body.
   * @default false
   */
  loading?: boolean;
};

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps   = HTMLAttributes<HTMLTableSectionElement>;

/* ══════ ROW ═══════════════════════════════════════════════════════ */

export type TableRowProps = Omit<HTMLAttributes<HTMLTableRowElement>, "onClick"> & {
  /**
   * When true, the row renders in the selected state — subtle wash +
   * left accent bar + `aria-selected='true'`. Pair with a checkbox
   * inside `Table.Cell` in your first column.
   */
  selected?: boolean;
  /**
   * When true, the row is non-interactive and reads as dimmed. Click
   * handlers do not fire and the row is skipped by keyboard focus.
   */
  disabled?: boolean;
  /**
   * Optional click handler. Providing it makes the row focusable
   * (`tabIndex=0`), keyboard-activatable (Enter/Space), and applies
   * hover feedback + a cursor pointer.
   *
   * Prefer wiring row interaction to a real navigation surface (a
   * Button in a trailing-actions cell, a link inside a cell) unless
   * every row unambiguously represents a single navigable resource.
   */
  onClick?: (event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>) => void;
};

/* ══════ HEAD CELL ═════════════════════════════════════════════════ */

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /**
   * When set to a non-null direction, the head-cell renders as a sort
   * control — it becomes a `<button>` inside the `<th>`, emits
   * `aria-sort`, and shows the active sort direction.
   *
   * Passing `null` marks the column as sortable but not the active
   * sort. Omitting the prop entirely renders a non-sortable head-cell.
   */
  sort?: SortDirection;
  /**
   * Fired when the sort control is activated (click or Enter/Space).
   * Consumers own the sort state and pass a new `sort` value back in.
   */
  onSortChange?: (next: SortDirection) => void;
  /**
   * Right-align the cell content (typical for numeric columns).
   * @default false
   */
  numeric?: boolean;
  /**
   * Fixed width for this column (px or css length). Head widths cascade
   * to the matching body cells via the `<colgroup>` — you don't need
   * to set widths on both the head and the body.
   */
  width?: number | string;
};

/* ══════ BODY CELL ═════════════════════════════════════════════════ */

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /**
   * Right-align the cell content and apply tabular-nums so digit
   * columns line up. Set this to true on every cell in a numeric
   * column, matching the head cell's `numeric` prop.
   */
  numeric?: boolean;
  /**
   * Optional leading icon rendered inline before the cell content.
   * Sizes with the density.
   */
  leadingIcon?: ReactNode;
  /**
   * Truncate overflowing content with an ellipsis instead of wrapping.
   * Default on — dense tables read better with clipped rows than with
   * ragged wraps.
   * @default true
   */
  truncate?: boolean;
};

/* ══════ EMPTY / LOADING ═══════════════════════════════════════════ */

export type TableEmptyProps = HTMLAttributes<HTMLDivElement> & {
  /** Icon rendered above the title. */
  icon?: ReactNode;
  /** Short title — one line, describing what's absent. */
  title?: ReactNode;
  /** Longer explanation. */
  description?: ReactNode;
  /** A single action (usually a Button) or an action group. */
  action?: ReactNode;
};

export type TableLoadingProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional label rendered under the spinner. */
  label?: ReactNode;
};

/* ══════ FOOTER / PAGINATION ═══════════════════════════════════════ */

export type TableFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * A slot for the pagination control. The Table doesn't ship a
 * pagination implementation — it hosts one via composition (usually
 * the HC1 Pagination primitive when it lands).
 */
export type TablePaginationProps = HTMLAttributes<HTMLDivElement>;
