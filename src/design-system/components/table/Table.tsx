import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type {
  SortDirection,
  TableBodyProps,
  TableCellProps,
  TableContentProps,
  TableDensity,
  TableEmptyProps,
  TableFiltersProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableLoadingProps,
  TablePaginationProps,
  TableProps,
  TableRowProps,
  TableSearchProps,
  TableToolbarProps,
} from "./Table.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Table.
import "../../tokens/css/variables.css";
import "./Table.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:            "hc-table",
  density:         (d: TableDensity) => `hc-table--density-${d}`,
  fullWidth:       "hc-table--full-width",
  bordered:        "hc-table--bordered",
  striped:         "hc-table--striped",
  hover:           "hc-table--hover",

  toolbar:         "hc-table__toolbar",
  toolbarSearch:   "hc-table__search",
  toolbarFilters:  "hc-table__filters",

  content:         "hc-table__content",
  contentSticky:   "hc-table__content--sticky",
  contentScroll:   "hc-table__content--scroll",
  contentLoading:  "hc-table__content--loading",

  el:              "hc-table__el",
  head:            "hc-table__thead",
  body:            "hc-table__tbody",
  row:             "hc-table__row",
  rowClickable:    "hc-table__row--clickable",
  rowSelected:     "hc-table__row--selected",
  rowDisabled:     "hc-table__row--disabled",

  headCell:        "hc-table__th",
  headCellNumeric: "hc-table__th--numeric",
  headSortBtn:     "hc-table__sort",
  headSortIndicator: "hc-table__sort-indicator",
  headSortIndicatorActive: "hc-table__sort-indicator--active",

  cell:            "hc-table__td",
  cellNumeric:     "hc-table__td--numeric",
  cellTruncate:    "hc-table__td--truncate",
  cellLeadingIcon: "hc-table__cell-icon",
  cellContent:     "hc-table__cell-content",

  empty:           "hc-table__empty",
  emptyIcon:       "hc-table__empty-icon",
  emptyTitle:      "hc-table__empty-title",
  emptyDescription:"hc-table__empty-description",
  emptyAction:     "hc-table__empty-action",

  loading:         "hc-table__loading",
  spinner:         "hc-table__spinner",
  loadingLabel:    "hc-table__loading-label",

  footer:          "hc-table__footer",
  pagination:      "hc-table__pagination",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type TableContextValue = {
  density: TableDensity;
  striped: boolean;
};

const TableContext = createContext<TableContextValue>({
  density: "comfortable",
  striped: false,
});

const useTableContext = () => useContext(TableContext);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Table — the canonical data-presentation primitive.
 *
 * Compose with `Table.Toolbar` (top strip), `Table.Content` (the actual
 * table), and `Table.Footer` (bottom strip). Inside the content, use
 * `Table.Header` / `Table.Body` / `Table.Row` / `Table.Head` /
 * `Table.Cell`. Empty and loading states live inside the body area via
 * `Table.Empty` and `Table.Loading`.
 *
 * The outer wrapper is a `<div>` that owns the surface frame; the
 * inner element rendered by `Table.Content` is a real `<table>` so
 * assistive tech gets proper table semantics.
 */
const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  {
    density        = "comfortable",
    striped        = false,
    hover          = false,
    fullWidth      = true,
    bordered       = true,
    ariaLabel,
    ariaLabelledBy,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const contextValue = useMemo<TableContextValue>(
    () => ({ density, striped }),
    [density, striped],
  );

  const rootClass = cx(
    CLASS.root,
    CLASS.density(density),
    fullWidth && CLASS.fullWidth,
    bordered && CLASS.bordered,
    striped && CLASS.striped,
    hover && CLASS.hover,
    className,
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={rootClass}
        style={style as CSSProperties}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
});
TableRoot.displayName = "Table";

/* ══════ TOOLBAR / SEARCH / FILTERS ════════════════════════════════ */

const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.toolbar, className)} {...rest}>
      {children}
    </div>
  );
});
TableToolbar.displayName = "Table.Toolbar";

const TableSearch = forwardRef<HTMLDivElement, TableSearchProps>(function TableSearch(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.toolbarSearch, className)} {...rest}>
      {children}
    </div>
  );
});
TableSearch.displayName = "Table.Search";

const TableFilters = forwardRef<HTMLDivElement, TableFiltersProps>(function TableFilters(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.toolbarFilters, className)} {...rest}>
      {children}
    </div>
  );
});
TableFilters.displayName = "Table.Filters";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

/**
 * Wraps the actual `<table>` element. Owns scroll behavior for sticky
 * headers and `aria-busy` for loading. The `<table>` is rendered here
 * rather than in the root Card wrapper so that assistive tech gets a
 * clean, unwrapped table.
 */
const TableContent = forwardRef<HTMLDivElement, TableContentProps>(function TableContent(
  {
    stickyHeader = false,
    maxHeight,
    loading      = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const scroll = stickyHeader || maxHeight != null;
  const contentClass = cx(
    CLASS.content,
    stickyHeader && CLASS.contentSticky,
    scroll && CLASS.contentScroll,
    loading && CLASS.contentLoading,
    className,
  );

  const contentStyle: CSSProperties = {
    ...(style as CSSProperties),
    ...(maxHeight != null
      ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
      : null),
  };

  return (
    <div
      ref={ref}
      className={contentClass}
      style={contentStyle}
      {...rest}
    >
      <table
        className={CLASS.el}
        role="table"
        aria-busy={loading || undefined}
      >
        {children}
      </table>
    </div>
  );
});
TableContent.displayName = "Table.Content";

/* ══════ HEADER / BODY ═════════════════════════════════════════════ */

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <thead ref={ref} className={cx(CLASS.head, className)} {...rest}>
      {children}
    </thead>
  );
});
TableHeader.displayName = "Table.Header";

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <tbody ref={ref} className={cx(CLASS.body, className)} {...rest}>
      {children}
    </tbody>
  );
});
TableBody.displayName = "Table.Body";

/* ══════ ROW ═══════════════════════════════════════════════════════ */

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  {
    selected,
    disabled,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isClickable = typeof onClick === "function" && !disabled;

  const handleClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (!isClickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <tr
      ref={ref}
      className={cx(
        CLASS.row,
        isClickable && CLASS.rowClickable,
        selected && CLASS.rowSelected,
        disabled && CLASS.rowDisabled,
        className,
      )}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      {...rest}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = "Table.Row";

/* ══════ HEAD CELL ═════════════════════════════════════════════════ */

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  {
    sort,
    onSortChange,
    numeric,
    width,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isSortable = sort !== undefined;

  const ariaSort: "ascending" | "descending" | "none" | undefined = isSortable
    ? sort === "asc"
      ? "ascending"
      : sort === "desc"
        ? "descending"
        : "none"
    : undefined;

  const nextSort = (current: SortDirection): SortDirection => {
    if (current === null) return "asc";
    if (current === "asc") return "desc";
    return null;
  };

  const handleSort = () => {
    if (!isSortable) return;
    onSortChange?.(nextSort(sort ?? null));
  };

  const headStyle: CSSProperties = {
    ...(style as CSSProperties),
    ...(width != null
      ? { width: typeof width === "number" ? `${width}px` : width }
      : null),
  };

  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={ariaSort}
      className={cx(
        CLASS.headCell,
        numeric && CLASS.headCellNumeric,
        className,
      )}
      style={headStyle}
      {...rest}
    >
      {isSortable ? (
        <button
          type="button"
          className={CLASS.headSortBtn}
          onClick={handleSort}
        >
          <span>{children}</span>
          <SortIndicator direction={sort ?? null} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});
TableHead.displayName = "Table.Head";

function SortIndicator({ direction }: { direction: SortDirection }) {
  const active = direction !== null;
  return (
    <span
      className={cx(
        CLASS.headSortIndicator,
        active && CLASS.headSortIndicatorActive,
      )}
      aria-hidden="true"
    >
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 1 L9 5 H1 Z"
          fill="currentColor"
          opacity={direction === "asc" ? 1 : direction === "desc" ? 0.3 : 0.5}
        />
        <path
          d="M5 11 L9 7 H1 Z"
          fill="currentColor"
          opacity={direction === "desc" ? 1 : direction === "asc" ? 0.3 : 0.5}
        />
      </svg>
    </span>
  );
}

/* ══════ CELL ══════════════════════════════════════════════════════ */

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {
    numeric,
    leadingIcon,
    truncate = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cx(
        CLASS.cell,
        numeric && CLASS.cellNumeric,
        truncate && CLASS.cellTruncate,
        className,
      )}
      {...rest}
    >
      {leadingIcon ? (
        <span className={CLASS.cellContent}>
          <span className={CLASS.cellLeadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </td>
  );
});
TableCell.displayName = "Table.Cell";

/* ══════ EMPTY / LOADING ═══════════════════════════════════════════ */

/**
 * A body-replacement state — render as the single child of `Table.Body`
 * (or in place of the body entirely) when the dataset is empty. The
 * component paints the empty block inside a spanning `<td>` so the
 * `<table>` semantics stay intact.
 */
const TableEmpty = forwardRef<HTMLDivElement, TableEmptyProps>(function TableEmpty(
  { icon, title, description, action, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.empty, className)}
      role="status"
      {...rest}
    >
      {icon && <span className={CLASS.emptyIcon}>{icon}</span>}
      {title && <div className={CLASS.emptyTitle}>{title}</div>}
      {description && <div className={CLASS.emptyDescription}>{description}</div>}
      {children}
      {action && <div className={CLASS.emptyAction}>{action}</div>}
    </div>
  );
});
TableEmpty.displayName = "Table.Empty";

const TableLoading = forwardRef<HTMLDivElement, TableLoadingProps>(function TableLoading(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.loading, className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className={CLASS.spinner} aria-hidden="true" />
      {label && <span className={CLASS.loadingLabel}>{label}</span>}
      {children}
    </div>
  );
});
TableLoading.displayName = "Table.Loading";

/* ══════ FOOTER / PAGINATION ═══════════════════════════════════════ */

const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(function TableFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.footer, className)} {...rest}>
      {children}
    </div>
  );
});
TableFooter.displayName = "Table.Footer";

const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(function TablePagination(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.pagination, className)} {...rest}>
      {children}
    </div>
  );
});
TablePagination.displayName = "Table.Pagination";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TableCompound = typeof TableRoot & {
  Toolbar:    typeof TableToolbar;
  Search:     typeof TableSearch;
  Filters:    typeof TableFilters;
  Content:    typeof TableContent;
  Header:     typeof TableHeader;
  Head:       typeof TableHead;
  Body:       typeof TableBody;
  Row:        typeof TableRow;
  Cell:       typeof TableCell;
  Empty:      typeof TableEmpty;
  Loading:    typeof TableLoading;
  Footer:     typeof TableFooter;
  Pagination: typeof TablePagination;
};

const Table = TableRoot as TableCompound;
Table.Toolbar    = TableToolbar;
Table.Search     = TableSearch;
Table.Filters    = TableFilters;
Table.Content    = TableContent;
Table.Header     = TableHeader;
Table.Head       = TableHead;
Table.Body       = TableBody;
Table.Row        = TableRow;
Table.Cell       = TableCell;
Table.Empty      = TableEmpty;
Table.Loading    = TableLoading;
Table.Footer     = TableFooter;
Table.Pagination = TablePagination;

export { Table, useTableContext };
