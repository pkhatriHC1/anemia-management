import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
} from "react";
import type { CSSProperties, ReactNode } from "react";

import type {
  PaginationInfoProps,
  PaginationNextProps,
  PaginationPageListProps,
  PaginationPageProps,
  PaginationPageSizeProps,
  PaginationPreviousProps,
  PaginationProps,
  PaginationSize,
  PaginationWindowItem,
} from "./Pagination.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Pagination.
import "../../tokens/css/variables.css";
import "./Pagination.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:      "hc-pagination",
  size:      (s: PaginationSize) => `hc-pagination--size-${s}`,
  disabled:  "hc-pagination--disabled",
  loading:   "hc-pagination--loading",

  info:      "hc-pagination__info",
  list:      "hc-pagination__list",
  item:      "hc-pagination__item",
  page:      "hc-pagination__page",
  pageCurrent: "hc-pagination__page--current",
  ellipsis:  "hc-pagination__ellipsis",
  prev:      "hc-pagination__prev",
  next:      "hc-pagination__next",
  navLabel:  "hc-pagination__nav-label",
  pageSize:  "hc-pagination__page-size",
  pageSizeLabel: "hc-pagination__page-size-label",
  pageSizeSelect: "hc-pagination__page-size-select",
  srOnly:    "hc-pagination__sr-only",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type PaginationContextValue = {
  page: number;
  pageCount: number;
  size: PaginationSize;
  siblingCount: number;
  boundaryCount: number;
  disabled: boolean;
  loading: boolean;

  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;

  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  /** Stable id prefix so subcomponents can compose ids without collisions. */
  idBase: string;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext(source: string): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Pagination] ${source} must be rendered inside a <Pagination> parent.`,
    );
  }
  return ctx;
}

/* ══════ PAGE-WINDOW ALGORITHM ═════════════════════════════════════
 * Standard book-end + siblings window. Always shows `boundaryCount`
 * pages at the start and end, and `siblingCount` pages on each side
 * of the current page. Gaps of two or more collapse into an ellipsis;
 * gaps of one render the missing page (no ellipsis that just replaces
 * a single page — that's noise). */

export function buildPageWindow(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationWindowItem[] {
  const safePageCount = Math.max(1, Math.floor(pageCount));
  const safePage      = clamp(Math.floor(page), 1, safePageCount);
  const sibling       = Math.max(0, Math.floor(siblingCount));
  const boundary      = Math.max(0, Math.floor(boundaryCount));

  const startPages = range(1, Math.min(boundary, safePageCount));
  const endPages   = range(
    Math.max(safePageCount - boundary + 1, boundary + 1),
    safePageCount,
  );

  const siblingsStart = Math.max(
    Math.min(safePage - sibling, safePageCount - boundary - sibling * 2 - 1),
    boundary + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(safePage + sibling, boundary + sibling * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : safePageCount - 1,
  );

  const items: PaginationWindowItem[] = [];

  for (const p of startPages) items.push({ type: "page", page: p });

  if (siblingsStart > boundary + 2) {
    items.push({ type: "ellipsis", key: "start" });
  } else if (boundary + 1 < safePageCount - boundary) {
    items.push({ type: "page", page: boundary + 1 });
  }

  for (const p of range(siblingsStart, siblingsEnd)) {
    items.push({ type: "page", page: p });
  }

  if (siblingsEnd < safePageCount - boundary - 1) {
    items.push({ type: "ellipsis", key: "end" });
  } else if (safePageCount - boundary > boundary) {
    items.push({ type: "page", page: safePageCount - boundary });
  }

  for (const p of endPages) items.push({ type: "page", page: p });

  // De-dupe (adjacent) — the ends of the sibling window can overlap the
  // boundary bookends when pageCount is small.
  return dedupeAdjacent(items);
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function dedupeAdjacent(items: PaginationWindowItem[]): PaginationWindowItem[] {
  const out: PaginationWindowItem[] = [];
  const seenPages = new Set<number>();
  for (const item of items) {
    if (item.type === "page") {
      if (seenPages.has(item.page)) continue;
      seenPages.add(item.page);
    }
    const prev = out[out.length - 1];
    if (prev && prev.type === "ellipsis" && item.type === "ellipsis") continue;
    out.push(item);
  }
  return out;
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Pagination — the canonical navigation primitive for paged data.
 *
 * Compose with `Pagination.Info`, `Pagination.PageList`,
 * `Pagination.Previous`, `Pagination.Next`, and `Pagination.PageSize`
 * (any subset, in any order). The root is a `<nav>` landmark; the
 * subcomponents read the current page + page count from context and
 * fire `onPageChange` when the user activates a control.
 */
const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(function PaginationRoot(
  {
    page,
    pageCount,
    onPageChange,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    totalItems,
    size = "md",
    siblingCount = 1,
    boundaryCount = 1,
    disabled = false,
    loading = false,
    className,
    style,
    children,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  },
  ref,
) {
  const idBase = useId();

  const contextValue = useMemo<PaginationContextValue>(
    () => ({
      page,
      pageCount: Math.max(1, pageCount),
      size,
      siblingCount,
      boundaryCount,
      disabled,
      loading,
      pageSize,
      pageSizeOptions,
      totalItems,
      onPageChange,
      onPageSizeChange,
      idBase,
    }),
    [page, pageCount, size, siblingCount, boundaryCount, disabled, loading, pageSize, pageSizeOptions, totalItems, onPageChange, onPageSizeChange, idBase],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <nav
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        className={cx(
          CLASS.root,
          CLASS.size(size),
          disabled && CLASS.disabled,
          loading && CLASS.loading,
          className,
        )}
        style={style as CSSProperties}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
});
PaginationRoot.displayName = "Pagination";

/* ══════ INFO ══════════════════════════════════════════════════════ */

const PaginationInfo = forwardRef<HTMLDivElement, PaginationInfoProps>(function PaginationInfo(
  { render, className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Info");

  const content = useMemo<ReactNode>(() => {
    if (children != null) return children;

    const firstItem =
      ctx.pageSize != null ? (ctx.page - 1) * ctx.pageSize + 1 : undefined;
    const lastItem =
      ctx.pageSize != null && ctx.totalItems != null
        ? Math.min(ctx.page * ctx.pageSize, ctx.totalItems)
        : ctx.pageSize != null
        ? ctx.page * ctx.pageSize
        : undefined;

    if (render) {
      return render({
        page: ctx.page,
        pageCount: ctx.pageCount,
        pageSize: ctx.pageSize,
        totalItems: ctx.totalItems,
        firstItem,
        lastItem,
      });
    }

    if (ctx.pageSize != null && ctx.totalItems != null) {
      return (
        <>
          Showing{" "}
          <strong>{fmt(firstItem!)}</strong>
          –<strong>{fmt(lastItem!)}</strong> of{" "}
          <strong>{fmt(ctx.totalItems)}</strong>
        </>
      );
    }
    return (
      <>
        Page <strong>{fmt(ctx.page)}</strong> of <strong>{fmt(ctx.pageCount)}</strong>
      </>
    );
  }, [children, render, ctx.page, ctx.pageCount, ctx.pageSize, ctx.totalItems]);

  return (
    <div
      ref={ref}
      className={cx(CLASS.info, className)}
      aria-live="polite"
      {...rest}
    >
      {content}
    </div>
  );
});
PaginationInfo.displayName = "Pagination.Info";

function fmt(n: number): string {
  return n.toLocaleString();
}

/* ══════ PAGE LIST ═════════════════════════════════════════════════ */

const PaginationPageList = forwardRef<HTMLUListElement, PaginationPageListProps>(function PaginationPageList(
  { className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.PageList");

  const items = useMemo(
    () => buildPageWindow(ctx.page, ctx.pageCount, ctx.siblingCount, ctx.boundaryCount),
    [ctx.page, ctx.pageCount, ctx.siblingCount, ctx.boundaryCount],
  );

  // If the consumer authors their own children, use those verbatim.
  const auto = children == null;

  return (
    <ul
      ref={ref}
      className={cx(CLASS.list, className)}
      {...rest}
    >
      {auto
        ? items.map((item, i) =>
            item.type === "ellipsis" ? (
              <li key={`e-${item.key}-${i}`} className={CLASS.item}>
                <Ellipsis />
              </li>
            ) : (
              <li key={`p-${item.page}`} className={CLASS.item}>
                <PaginationPage page={item.page} />
              </li>
            ),
          )
        : children}
    </ul>
  );
});
PaginationPageList.displayName = "Pagination.PageList";

function Ellipsis() {
  return (
    <span className={CLASS.ellipsis} aria-hidden="true">
      &hellip;
    </span>
  );
}

/* ══════ PAGE ══════════════════════════════════════════════════════ */

const PaginationPage = forwardRef<HTMLButtonElement, PaginationPageProps>(function PaginationPage(
  { page, disabled, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Page");
  const isCurrent = page === ctx.page;
  const isDisabled = disabled ?? (ctx.disabled || ctx.loading);

  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        CLASS.page,
        isCurrent && CLASS.pageCurrent,
        className,
      )}
      onClick={() => {
        if (isDisabled || isCurrent) return;
        ctx.onPageChange?.(page);
      }}
      disabled={isDisabled}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={ariaLabel ?? (isCurrent ? `Page ${page}, current page` : `Go to page ${page}`)}
      {...rest}
    >
      {children ?? fmt(page)}
    </button>
  );
});
PaginationPage.displayName = "Pagination.Page";

/* ══════ PREVIOUS ══════════════════════════════════════════════════ */

const PaginationPrevious = forwardRef<HTMLButtonElement, PaginationPreviousProps>(function PaginationPrevious(
  { label = "Previous", labelHidden = false, disabled, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Previous");
  const isDisabled = (disabled ?? false) || ctx.disabled || ctx.loading || ctx.page <= 1;

  return (
    <button
      ref={ref}
      type="button"
      className={cx(CLASS.page, CLASS.prev, className)}
      onClick={() => {
        if (isDisabled) return;
        ctx.onPageChange?.(ctx.page - 1);
      }}
      disabled={isDisabled}
      aria-label={label}
      {...rest}
    >
      <ChevronLeftIcon />
      {label && (labelHidden
        ? <span className={CLASS.srOnly}>{label}</span>
        : <span className={CLASS.navLabel}>{label}</span>
      )}
    </button>
  );
});
PaginationPrevious.displayName = "Pagination.Previous";

/* ══════ NEXT ══════════════════════════════════════════════════════ */

const PaginationNext = forwardRef<HTMLButtonElement, PaginationNextProps>(function PaginationNext(
  { label = "Next", labelHidden = false, disabled, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.Next");
  const isDisabled = (disabled ?? false) || ctx.disabled || ctx.loading || ctx.page >= ctx.pageCount;

  return (
    <button
      ref={ref}
      type="button"
      className={cx(CLASS.page, CLASS.next, className)}
      onClick={() => {
        if (isDisabled) return;
        ctx.onPageChange?.(ctx.page + 1);
      }}
      disabled={isDisabled}
      aria-label={label}
      {...rest}
    >
      {label && (labelHidden
        ? <span className={CLASS.srOnly}>{label}</span>
        : <span className={CLASS.navLabel}>{label}</span>
      )}
      <ChevronRightIcon />
    </button>
  );
});
PaginationNext.displayName = "Pagination.Next";

/* ══════ PAGE SIZE ═════════════════════════════════════════════════ */

const PaginationPageSize = forwardRef<HTMLDivElement, PaginationPageSizeProps>(function PaginationPageSize(
  { label = "Per page", labelHidden = false, className, ...rest },
  ref,
) {
  const ctx = usePaginationContext("Pagination.PageSize");
  const selectId = `${ctx.idBase}-page-size`;

  if (!ctx.pageSizeOptions || ctx.pageSizeOptions.length === 0) return null;
  if (!ctx.onPageSizeChange) return null;

  const isDisabled = ctx.disabled || ctx.loading;

  return (
    <div ref={ref} className={cx(CLASS.pageSize, className)} {...rest}>
      <label
        htmlFor={selectId}
        className={cx(CLASS.pageSizeLabel, labelHidden && CLASS.srOnly)}
      >
        {label}
      </label>
      <select
        id={selectId}
        className={CLASS.pageSizeSelect}
        value={ctx.pageSize}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isFinite(next)) return;
          ctx.onPageSizeChange?.(next);
        }}
        disabled={isDisabled}
      >
        {ctx.pageSizeOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
});
PaginationPageSize.displayName = "Pagination.PageSize";

/* ══════ ICONS ═════════════════════════════════════════════════════ */

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type PaginationCompound = typeof PaginationRoot & {
  Info:     typeof PaginationInfo;
  PageList: typeof PaginationPageList;
  Page:     typeof PaginationPage;
  Previous: typeof PaginationPrevious;
  Next:     typeof PaginationNext;
  PageSize: typeof PaginationPageSize;
};

const Pagination = PaginationRoot as PaginationCompound;
Pagination.Info     = PaginationInfo;
Pagination.PageList = PaginationPageList;
Pagination.Page     = PaginationPage;
Pagination.Previous = PaginationPrevious;
Pagination.Next     = PaginationNext;
Pagination.PageSize = PaginationPageSize;

export { Pagination, usePaginationContext };
