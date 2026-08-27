import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import type {
  EmptyStateActionsProps,
  EmptyStateDescriptionProps,
  EmptyStateFooterProps,
  EmptyStateIconProps,
  EmptyStateIllustrationProps,
  EmptyStateLayout,
  EmptyStateProps,
  EmptyStateTitleProps,
  EmptyStateVariant,
} from "./EmptyState.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the EmptyState.
import "../../tokens/css/variables.css";
import "./EmptyState.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:            "hc-empty",
  variant:         (v: EmptyStateVariant) => `hc-empty--variant-${v}`,
  layout:          (l: EmptyStateLayout)  => `hc-empty--layout-${l}`,
  loading:         "hc-empty--loading",

  icon:            "hc-empty__icon",
  illustration:    "hc-empty__illustration",
  title:           "hc-empty__title",
  description:     "hc-empty__description",
  actions:         "hc-empty__actions",
  footer:          "hc-empty__footer",

  skeleton:        "hc-empty__skeleton",
  skeletonIcon:    "hc-empty__skeleton-icon",
  skeletonTitle:   "hc-empty__skeleton-title",
  skeletonDesc:    "hc-empty__skeleton-desc",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type EmptyStateContextValue = {
  variant: EmptyStateVariant;
  layout:  EmptyStateLayout;
};

const EmptyStateContext = createContext<EmptyStateContextValue>({
  variant: "default",
  layout:  "centered",
});

const useEmptyStateContext = () => useContext(EmptyStateContext);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 EmptyState — the canonical zero-state primitive.
 *
 * Compose with `EmptyState.Icon` (or `.Illustration`), `.Title`,
 * `.Description`, `.Actions`, and `.Footer`. The root arranges them in
 * the canonical vertical stack regardless of the order they're
 * authored in. Only one of Icon or Illustration is rendered — if both
 * are provided, Illustration wins.
 *
 * Every EmptyState should answer three questions in its content:
 *   1. What happened?
 *   2. Why is the screen empty?
 *   3. What should the user do next?
 *
 * Skip the primary action when there is nothing the user can do to
 * resolve the situation.
 */
const EmptyStateRoot = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyStateRoot(
  {
    variant   = "default",
    layout    = "centered",
    loading   = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const contextValue = useMemo<EmptyStateContextValue>(
    () => ({ variant, layout }),
    [variant, layout],
  );

  const rootClass = cx(
    CLASS.root,
    CLASS.variant(variant),
    CLASS.layout(layout),
    loading && CLASS.loading,
    className,
  );

  const rendered = loading ? <LoadingSkeleton /> : arrangeChildren(children);

  return (
    <EmptyStateContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy={loading || undefined}
        className={rootClass}
        style={style as CSSProperties}
      >
        {rendered}
      </div>
    </EmptyStateContext.Provider>
  );
});
EmptyStateRoot.displayName = "EmptyState";

/* ══════ CHILD ARRANGEMENT ════════════════════════════════════════
 * Walk children, bucket by subcomponent type, then render in the
 * canonical order: Illustration|Icon → Title → Description → Actions →
 * Footer. Unrecognized children fall through in author order between
 * Description and Actions so consumers can drop in an inline note or
 * a small custom element without breaking the layout.
 * ─────────────────────────────────────────────────────────────── */

function arrangeChildren(children: ReactNode): ReactNode {
  let icon:         ReactNode | null = null;
  let illustration: ReactNode | null = null;
  let title:        ReactNode | null = null;
  let description:  ReactNode | null = null;
  let actions:      ReactNode | null = null;
  let footer:       ReactNode | null = null;
  const extras: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) extras.push(child);
      return;
    }
    const el = child as ReactElement;
    if      (el.type === EmptyStateIllustration && !illustration) illustration = el;
    else if (el.type === EmptyStateIcon         && !icon)         icon = el;
    else if (el.type === EmptyStateTitle        && !title)        title = el;
    else if (el.type === EmptyStateDescription  && !description)  description = el;
    else if (el.type === EmptyStateActions      && !actions)      actions = el;
    else if (el.type === EmptyStateFooter       && !footer)       footer = el;
    else extras.push(el);
  });

  return (
    <>
      {illustration || icon}
      {title}
      {description}
      {extras}
      {actions}
      {footer}
    </>
  );
}

/* ══════ ICON ══════════════════════════════════════════════════════ */

const EmptyStateIcon = forwardRef<HTMLSpanElement, EmptyStateIconProps>(function EmptyStateIcon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx(CLASS.icon, className)}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </span>
  );
});
EmptyStateIcon.displayName = "EmptyState.Icon";

/* ══════ ILLUSTRATION ══════════════════════════════════════════════ */

const EmptyStateIllustration = forwardRef<HTMLDivElement, EmptyStateIllustrationProps>(function EmptyStateIllustration(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.illustration, className)}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </div>
  );
});
EmptyStateIllustration.displayName = "EmptyState.Illustration";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(function EmptyStateTitle(
  { as = 3, className, children, ...rest },
  ref,
) {
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cx(CLASS.title, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
EmptyStateTitle.displayName = "EmptyState.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(function EmptyStateDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <p ref={ref} className={cx(CLASS.description, className)} {...rest}>
      {children}
    </p>
  );
});
EmptyStateDescription.displayName = "EmptyState.Description";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(function EmptyStateActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.actions, className)} {...rest}>
      {children}
    </div>
  );
});
EmptyStateActions.displayName = "EmptyState.Actions";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const EmptyStateFooter = forwardRef<HTMLDivElement, EmptyStateFooterProps>(function EmptyStateFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.footer, className)} {...rest}>
      {children}
    </div>
  );
});
EmptyStateFooter.displayName = "EmptyState.Footer";

/* ══════ LOADING SKELETON ══════════════════════════════════════════ */

function LoadingSkeleton() {
  return (
    <div className={CLASS.skeleton} aria-hidden="true">
      <div className={CLASS.skeletonIcon} />
      <div className={CLASS.skeletonTitle} />
      <div className={CLASS.skeletonDesc} />
      <div className={CLASS.skeletonDesc} style={{ width: "60%" }} />
    </div>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type EmptyStateCompound = typeof EmptyStateRoot & {
  Icon:         typeof EmptyStateIcon;
  Illustration: typeof EmptyStateIllustration;
  Title:        typeof EmptyStateTitle;
  Description:  typeof EmptyStateDescription;
  Actions:      typeof EmptyStateActions;
  Footer:       typeof EmptyStateFooter;
};

const EmptyState = EmptyStateRoot as EmptyStateCompound;
EmptyState.Icon         = EmptyStateIcon;
EmptyState.Illustration = EmptyStateIllustration;
EmptyState.Title        = EmptyStateTitle;
EmptyState.Description  = EmptyStateDescription;
EmptyState.Actions      = EmptyStateActions;
EmptyState.Footer       = EmptyStateFooter;

export { EmptyState, useEmptyStateContext };
