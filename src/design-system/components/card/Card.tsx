import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties } from "react";
import type {
  CardActionsProps,
  CardContentProps,
  CardDensity,
  CardDescriptionProps,
  CardDividerProps,
  CardEmptyProps,
  CardFooterProps,
  CardHeaderProps,
  CardIconProps,
  CardLoadingProps,
  CardProps,
  CardTitleProps,
  CardVariant,
} from "./Card.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Card, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Card.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:            "hc-card",
  variant:         (v: CardVariant) => `hc-card--variant-${v}`,
  density:         (d: CardDensity) => `hc-card--density-${d}`,
  fullWidth:       "hc-card--full-width",
  clickable:       "hc-card--clickable",
  disabled:        "hc-card--disabled",
  loading:         "hc-card--loading",

  header:          "hc-card__header",
  headerBody:      "hc-card__header-body",
  icon:            "hc-card__icon",
  title:           "hc-card__title",
  description:     "hc-card__description",
  content:         "hc-card__content",
  footer:          "hc-card__footer",
  actions:         "hc-card__actions",
  actionsAlign:    (a: "start" | "center" | "end") => `hc-card__actions--${a}`,
  divider:         "hc-card__divider",
  loadingOverlay:  "hc-card__loading-overlay",
  loadingBlock:    "hc-card__loading",
  spinner:         "hc-card__spinner",
  loadingLabel:    "hc-card__loading-label",
  empty:           "hc-card__empty",
  emptyIcon:       "hc-card__empty-icon",
  emptyTitle:      "hc-card__empty-title",
  emptyDescription:"hc-card__empty-description",
  emptyAction:     "hc-card__empty-action",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type CardContextValue = {
  density: CardDensity;
  variant: CardVariant;
  disabled: boolean;
  loading: boolean;
};

const CardContext = createContext<CardContextValue>({
  density: "comfortable",
  variant: "default",
  disabled: false,
  loading: false,
});

const useCardContext = () => useContext(CardContext);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Card — the canonical surface primitive.
 *
 * Compose with `Card.Header`, `Card.Content`, `Card.Footer` and the
 * inline slots (`Card.Icon`, `Card.Title`, `Card.Description`,
 * `Card.Actions`, `Card.Divider`, `Card.Empty`, `Card.Loading`).
 *
 * Rendering rules:
 *   - Default: `<div>`.
 *   - If `onClick` is provided OR `variant='interactive'`: `<button>`
 *     with focus ring, hover, and keyboard activation.
 *   - If `pressed` is provided, the button emits `aria-pressed`.
 *   - If `disabled`: `<button disabled>` and pointer events are dead.
 *   - If `loading`: an overlay covers the card interior, `aria-busy`
 *     is set, and the interior is visually hidden but kept in the DOM
 *     so the card doesn't collapse.
 */
const CardRoot = forwardRef<HTMLElement, CardProps>(function CardRoot(
  {
    variant   = "default",
    density   = "comfortable",
    fullWidth = true,
    disabled  = false,
    loading   = false,
    onClick,
    pressed,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isClickable = variant === "interactive" || typeof onClick === "function";

  const contextValue = useMemo<CardContextValue>(
    () => ({ density, variant, disabled, loading }),
    [density, variant, disabled, loading],
  );

  const rootClass = cx(
    CLASS.root,
    CLASS.variant(variant),
    CLASS.density(density),
    fullWidth && CLASS.fullWidth,
    isClickable && CLASS.clickable,
    disabled && CLASS.disabled,
    loading && CLASS.loading,
    className,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const loadingOverlay = loading ? (
    <div className={CLASS.loadingOverlay} aria-hidden="true">
      <span className={CLASS.spinner} />
    </div>
  ) : null;

  if (isClickable) {
    return (
      <CardContext.Provider value={contextValue}>
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          aria-busy={loading || undefined}
          aria-pressed={pressed}
          aria-disabled={disabled || undefined}
          onClick={handleClick}
          className={rootClass}
          style={style as CSSProperties}
        >
          {children}
          {loadingOverlay}
        </button>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref as React.Ref<HTMLDivElement>}
        aria-busy={loading || undefined}
        className={rootClass}
        style={style as CSSProperties}
      >
        {children}
        {loadingOverlay}
      </div>
    </CardContext.Provider>
  );
});

CardRoot.displayName = "Card";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { children, className, ...rest },
  ref,
) {
  // Detect if children include a `Card.Actions` — if so, header body wraps
  // the non-action children so title+description stack in the middle
  // while actions align to the right. Consumers who already wrap in a
  // custom div get it as-is (no double wrapping).
  return (
    <div ref={ref} className={cx(CLASS.header, className)} {...rest}>
      <HeaderBody>{children}</HeaderBody>
    </div>
  );
});
CardHeader.displayName = "Card.Header";

function HeaderBody({ children }: { children: React.ReactNode }) {
  // Walk the header's children, split into left (icon + text stack) and right (actions).
  // - Card.Icon renders first (left)
  // - Card.Actions renders last (right, margin-left auto)
  // - Everything else stacks in the middle body div.
  const arr = flattenChildren(children);
  const iconChildren: React.ReactNode[] = [];
  const actionChildren: React.ReactNode[] = [];
  const bodyChildren: React.ReactNode[] = [];

  for (const child of arr) {
    if (isSubcomponent(child, CardIcon))         iconChildren.push(child);
    else if (isSubcomponent(child, CardActions)) actionChildren.push(child);
    else bodyChildren.push(child);
  }

  return (
    <>
      {iconChildren}
      <div className={CLASS.headerBody}>
        {bodyChildren}
      </div>
      {actionChildren}
    </>
  );
}

function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const push = (c: React.ReactNode) => {
    if (Array.isArray(c)) c.forEach(push);
    else if (c != null && c !== false) out.push(c);
  };
  push(children);
  return out;
}

function isSubcomponent(node: React.ReactNode, Comp: unknown): boolean {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in (node as object) &&
    (node as { type: unknown }).type === Comp
  );
}

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as = 3, className, children, ...rest },
  ref,
) {
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={cx(CLASS.title, className)} {...rest}>
      {children}
    </Tag>
  );
});
CardTitle.displayName = "Card.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <p ref={ref} className={cx(CLASS.description, className)} {...rest}>
      {children}
    </p>
  );
});
CardDescription.displayName = "Card.Description";

/* ══════ ICON ══════════════════════════════════════════════════════ */

const CardIcon = forwardRef<HTMLSpanElement, CardIconProps>(function CardIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(CLASS.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
});
CardIcon.displayName = "Card.Icon";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.content, className)} {...rest}>
      {children}
    </div>
  );
});
CardContent.displayName = "Card.Content";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.footer, className)} {...rest}>
      {children}
    </div>
  );
});
CardFooter.displayName = "Card.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
  { align = "end", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.actions, CLASS.actionsAlign(align), className)}
      {...rest}
    >
      {children}
    </div>
  );
});
CardActions.displayName = "Card.Actions";

/* ══════ DIVIDER ═══════════════════════════════════════════════════ */

const CardDivider = forwardRef<HTMLHRElement, CardDividerProps>(function CardDivider(
  { className, ...rest },
  ref,
) {
  return <hr ref={ref} className={cx(CLASS.divider, className)} {...rest} />;
});
CardDivider.displayName = "Card.Divider";

/* ══════ EMPTY ═════════════════════════════════════════════════════ */

const CardEmpty = forwardRef<HTMLDivElement, CardEmptyProps>(function CardEmpty(
  { icon, title, description, action, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.empty, className)} role="status" {...rest}>
      {icon && <span className={CLASS.emptyIcon}>{icon}</span>}
      {title && <div className={CLASS.emptyTitle}>{title}</div>}
      {description && <div className={CLASS.emptyDescription}>{description}</div>}
      {children}
      {action && <div className={CLASS.emptyAction}>{action}</div>}
    </div>
  );
});
CardEmpty.displayName = "Card.Empty";

/* ══════ LOADING ═══════════════════════════════════════════════════ */

/**
 * Composable loading block — use inside `<Card.Content>` when you want
 * a stable "loading…" region while data loads. For a whole-card scrim,
 * pass `loading` on the Card root instead.
 */
const CardLoading = forwardRef<HTMLDivElement, CardLoadingProps>(function CardLoading(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.loadingBlock, className)} role="status" aria-live="polite" {...rest}>
      <span className={CLASS.spinner} aria-hidden="true" />
      {label && <span className={CLASS.loadingLabel}>{label}</span>}
      {children}
    </div>
  );
});
CardLoading.displayName = "Card.Loading";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type CardCompound = typeof CardRoot & {
  Header:      typeof CardHeader;
  Title:       typeof CardTitle;
  Description: typeof CardDescription;
  Icon:        typeof CardIcon;
  Content:     typeof CardContent;
  Footer:      typeof CardFooter;
  Actions:     typeof CardActions;
  Divider:     typeof CardDivider;
  Empty:       typeof CardEmpty;
  Loading:     typeof CardLoading;
};

const Card = CardRoot as CardCompound;
Card.Header      = CardHeader;
Card.Title       = CardTitle;
Card.Description = CardDescription;
Card.Icon        = CardIcon;
Card.Content     = CardContent;
Card.Footer      = CardFooter;
Card.Actions     = CardActions;
Card.Divider     = CardDivider;
Card.Empty       = CardEmpty;
Card.Loading     = CardLoading;

export { Card, useCardContext };
