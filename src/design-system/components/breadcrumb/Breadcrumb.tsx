import { forwardRef, Fragment } from "react";
import type { ReactNode } from "react";

import type {
  BreadcrumbCurrentProps,
  BreadcrumbItemData,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from "./Breadcrumb.types";

import { Popover } from "../popover";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Breadcrumb, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Breadcrumb.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:         "hc-breadcrumb",
  list:         "hc-breadcrumb__list",
  item:         "hc-breadcrumb__item",
  link:         "hc-breadcrumb__link",
  linkDisabled: "hc-breadcrumb__link--disabled",
  linkIcon:     "hc-breadcrumb__link-icon",
  linkLabel:    "hc-breadcrumb__link-label",
  separator:    "hc-breadcrumb__separator",
  current:      "hc-breadcrumb__current",
  currentIcon:  "hc-breadcrumb__current-icon",
  ellipsis:     "hc-breadcrumb__ellipsis",
  ellipsisList: "hc-breadcrumb__ellipsis-list",
  ellipsisRow:  "hc-breadcrumb__ellipsis-row",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ DEFAULT SEPARATOR ICON ════════════════════════════════════ */

function CaretIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EllipsisIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  );
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Breadcrumb — the canonical hierarchical-location primitive.
 *
 * Compose with `Breadcrumb.List` + `Breadcrumb.Item` + `Breadcrumb.Link`
 * / `Breadcrumb.Current` + `Breadcrumb.Separator`, OR pass the `items`
 * shorthand for the common data-shape path. The last item is always
 * the current page and renders via `Breadcrumb.Current` with
 * `aria-current='page'`.
 *
 * The root is a semantic `<nav aria-label={label}>` — the assistive
 * technology landmark that announces this list as breadcrumb
 * navigation.
 */
const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    label = "Breadcrumb",
    items,
    separator,
    maxItems,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cx(CLASS.root, className)}
      {...rest}
    >
      {children ?? renderFromItems(items ?? [], separator, maxItems)}
    </nav>
  );
});
BreadcrumbRoot.displayName = "Breadcrumb";

/**
 * Renders the `items` shorthand as a full compound tree so the DOM
 * output is identical whether the consumer uses `items` OR composes
 * children manually.
 */
function renderFromItems(
  items: BreadcrumbItemData[],
  separator: ReactNode,
  maxItems?: number,
) {
  if (items.length === 0) return null;

  // Collapse if needed. We keep the first item, an ellipsis for hidden
  // ones, and the last (maxItems - 1) items. Under the maxItems
  // threshold (or when maxItems is not set) we render all items.
  const shouldCollapse =
    typeof maxItems === "number" && maxItems > 1 && items.length > maxItems;

  let visible: BreadcrumbItemData[];
  let hidden: BreadcrumbItemData[] = [];
  if (shouldCollapse) {
    const tailCount = Math.max(1, maxItems - 1);
    visible = [items[0], ...items.slice(items.length - tailCount)];
    hidden  = items.slice(1, items.length - tailCount);
  } else {
    visible = items;
  }

  return (
    <BreadcrumbList>
      {visible.map((item, index) => {
        const isLast = index === visible.length - 1;
        // The synthetic ellipsis slot only exists when we've
        // collapsed: it sits between the first crumb (index 0) and
        // the tail (index 1..n-1). We render it AFTER the first
        // separator so the sequence reads: root → sep → … → sep → tail.
        const injectEllipsisBefore =
          shouldCollapse && index === 1 && hidden.length > 0;

        return (
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}

            {injectEllipsisBefore && (
              <>
                <BreadcrumbEllipsisItem hidden={hidden} />
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              </>
            )}

            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbCurrent icon={item.icon}>{item.label}</BreadcrumbCurrent>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  disabled={item.disabled}
                  icon={item.icon}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        );
      })}
    </BreadcrumbList>
  );
}

/* ══════ LIST ══════════════════════════════════════════════════════ */

/**
 * The ordered list of crumbs. Ordered because breadcrumbs communicate
 * a directional path from the root to the current page.
 */
const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(function BreadcrumbList(
  { className, children, ...rest },
  ref,
) {
  return (
    <ol ref={ref} className={cx(CLASS.list, className)} {...rest}>
      {children}
    </ol>
  );
});
BreadcrumbList.displayName = "Breadcrumb.List";

/* ══════ ITEM ══════════════════════════════════════════════════════ */

/**
 * A single crumb wrapper. Wraps either a `Link` or a `Current`.
 */
const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <li ref={ref} className={cx(CLASS.item, className)} {...rest}>
      {children}
    </li>
  );
});
BreadcrumbItem.displayName = "Breadcrumb.Item";

/* ══════ LINK ══════════════════════════════════════════════════════ */

/**
 * A single navigable crumb — renders as a real `<a>` anchor. When
 * `disabled`, we swap the element for a `<span>` (native anchors have
 * no `disabled` attribute) so keyboard users can't tab into an inert
 * link. Focus, hover, and colour inherit from tokens; the class model
 * matches HC1 Link so the whole crumb strip reads as a single family.
 */
const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { className, children, href, disabled = false, icon, ...rest },
  ref,
) {
  const classes = cx(CLASS.link, disabled && CLASS.linkDisabled, className);
  const body = (
    <>
      {icon && <span className={CLASS.linkIcon} aria-hidden="true">{icon}</span>}
      <span className={CLASS.linkLabel}>{children}</span>
    </>
  );

  if (disabled) {
    return (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        className={classes}
        aria-disabled="true"
        {...(rest as unknown as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {body}
      </span>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      {...rest}
    >
      {body}
    </a>
  );
});
BreadcrumbLink.displayName = "Breadcrumb.Link";

/* ══════ SEPARATOR ═════════════════════════════════════════════════ */

/**
 * The visual pointer between two crumbs. Rendered as a
 * `<li aria-hidden='true' role='presentation'>` so screen readers do
 * not announce it. Defaults to a right-caret icon; pass `children` to
 * override with an arbitrary node (a slash, arrow, dot, etc.).
 */
const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(function BreadcrumbSeparator(
  { className, children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cx(CLASS.separator, className)}
      {...rest}
    >
      {children ?? <CaretIcon />}
    </li>
  );
});
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

/* ══════ CURRENT ═══════════════════════════════════════════════════ */

/**
 * The terminal crumb representing the user's current location. Renders
 * as a `<span aria-current='page'>` — screen readers announce "current
 * page" when the crumb is read.
 */
const BreadcrumbCurrent = forwardRef<HTMLSpanElement, BreadcrumbCurrentProps>(function BreadcrumbCurrent(
  { className, children, icon, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-current="page"
      className={cx(CLASS.current, className)}
      {...rest}
    >
      {icon && <span className={CLASS.currentIcon} aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
});
BreadcrumbCurrent.displayName = "Breadcrumb.Current";

/* ══════ ELLIPSIS ITEM (used by collapsed path shorthand) ══════════ */

/**
 * The ellipsis crumb used when the `items` shorthand collapses a long
 * path. Clicking the ellipsis opens a Popover listing the hidden
 * crumbs so the user can jump to any ancestor.
 *
 * This composition proves the Popover primitive's foundation role —
 * every downstream anchored floating surface (Dropdown Menu, Filter
 * Menu, this ellipsis reveal) reuses Popover rather than reinventing
 * the anchoring, portal, focus, and dismissal flow.
 */
function BreadcrumbEllipsisItem({ hidden }: { hidden: BreadcrumbItemData[] }) {
  return (
    <li className={CLASS.item}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <button
            type="button"
            className={CLASS.ellipsis}
            aria-label="Show collapsed crumbs"
          >
            <EllipsisIcon />
          </button>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Collapsed breadcrumbs" minWidth={200}>
          <ul className={CLASS.ellipsisList}>
            {hidden.map((item, i) => (
              <li key={i}>
                {item.href && !item.disabled ? (
                  <a
                    href={item.href}
                    className={CLASS.ellipsisRow}
                  >
                    {item.icon && (
                      <span aria-hidden="true" style={{ display: "inline-flex" }}>{item.icon}</span>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <span className={cx(CLASS.ellipsisRow, CLASS.linkDisabled)} aria-disabled={item.disabled || undefined}>
                    {item.icon && (
                      <span aria-hidden="true" style={{ display: "inline-flex" }}>{item.icon}</span>
                    )}
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover>
    </li>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type BreadcrumbCompound = typeof BreadcrumbRoot & {
  List:      typeof BreadcrumbList;
  Item:      typeof BreadcrumbItem;
  Link:      typeof BreadcrumbLink;
  Separator: typeof BreadcrumbSeparator;
  Current:   typeof BreadcrumbCurrent;
};

const Breadcrumb = BreadcrumbRoot as BreadcrumbCompound;
Breadcrumb.List      = BreadcrumbList;
Breadcrumb.Item      = BreadcrumbItem;
Breadcrumb.Link      = BreadcrumbLink;
Breadcrumb.Separator = BreadcrumbSeparator;
Breadcrumb.Current   = BreadcrumbCurrent;

export { Breadcrumb };
