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
  AlertActionsProps,
  AlertAppearance,
  AlertCloseProps,
  AlertDescriptionProps,
  AlertIconProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "./Alert.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Alert.
import "../../tokens/css/variables.css";
import "./Alert.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:        "hc-alert",
  variant:     (v: AlertVariant)    => `hc-alert--variant-${v}`,
  appearance:  (a: AlertAppearance) => `hc-alert--appearance-${a}`,
  disabled:    "hc-alert--disabled",

  icon:        "hc-alert__icon",
  body:        "hc-alert__body",
  title:       "hc-alert__title",
  description: "hc-alert__description",
  actions:     "hc-alert__actions",
  close:       "hc-alert__close",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type AlertContextValue = {
  variant:    AlertVariant;
  appearance: AlertAppearance;
  disabled:   boolean;
};

const AlertContext = createContext<AlertContextValue>({
  variant:    "info",
  appearance: "soft",
  disabled:   false,
});

const useAlertContext = () => useContext(AlertContext);

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Alert — the canonical inline-feedback primitive.
 *
 * Compose with `Alert.Icon`, `Alert.Title`, `Alert.Description`,
 * `Alert.Actions`, and `Alert.Close`. Children can be authored in any
 * order — the root splits them into three layout slots:
 *   - Icon (left)
 *   - Body: Title + Description + Actions (middle, stacked)
 *   - Close (right)
 *
 * The Alert itself is never a button and never wraps a link. Only the
 * built-in `Alert.Close` is interactive.
 */
const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(function AlertRoot(
  {
    variant    = "info",
    appearance = "soft",
    role       = "status",
    disabled   = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const contextValue = useMemo<AlertContextValue>(
    () => ({ variant, appearance, disabled }),
    [variant, appearance, disabled],
  );

  const rootClass = cx(
    CLASS.root,
    CLASS.variant(variant),
    CLASS.appearance(appearance),
    disabled && CLASS.disabled,
    className,
  );

  // Split children into three layout slots based on the subcomponent
  // type. Order is stable and independent of the order the consumer
  // authored the children in.
  const { icon, close, body } = splitChildren(children);

  return (
    <AlertContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        aria-disabled={disabled || undefined}
        className={rootClass}
        style={style as CSSProperties}
      >
        {icon}
        <div className={CLASS.body}>
          {body}
        </div>
        {close}
      </div>
    </AlertContext.Provider>
  );
});
AlertRoot.displayName = "Alert";

/* ══════ CHILD SPLITTING ═══════════════════════════════════════════ */

function splitChildren(children: ReactNode): {
  icon:  ReactNode | null;
  close: ReactNode | null;
  body:  ReactNode[];
} {
  let icon:  ReactNode | null = null;
  let close: ReactNode | null = null;
  const body: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) body.push(child);
      return;
    }
    const el = child as ReactElement;
    // Only the first Icon / Close wins if the consumer accidentally
    // authors two. Everything else falls through to the body stack.
    if (el.type === AlertIcon) {
      if (!icon) icon = el;
      return;
    }
    if (el.type === AlertClose) {
      if (!close) close = el;
      return;
    }
    body.push(el);
  });

  return { icon, close, body };
}

/* ══════ ICON ══════════════════════════════════════════════════════ */

const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(function AlertIcon(
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
AlertIcon.displayName = "Alert.Icon";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
  { as = "div", className, children, ...rest },
  ref,
) {
  const Tag = (typeof as === "number" ? `h${as}` : as) as
    | "div"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLHeadingElement>}
      className={cx(CLASS.title, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
AlertTitle.displayName = "Alert.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(function AlertDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.description, className)} {...rest}>
      {children}
    </div>
  );
});
AlertDescription.displayName = "Alert.Description";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(function AlertActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.actions, className)} {...rest}>
      {children}
    </div>
  );
});
AlertActions.displayName = "Alert.Actions";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(function AlertClose(
  { label = "Dismiss", className, disabled, onClick, ...rest },
  ref,
) {
  const ctx = useAlertContext();
  const isDisabled = disabled ?? ctx.disabled;
  return (
    <button
      ref={ref}
      type="button"
      className={cx(CLASS.close, className)}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      {...rest}
    >
      <CloseIcon />
    </button>
  );
});
AlertClose.displayName = "Alert.Close";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 3 L11 11 M11 3 L3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type AlertCompound = typeof AlertRoot & {
  Icon:        typeof AlertIcon;
  Title:       typeof AlertTitle;
  Description: typeof AlertDescription;
  Actions:     typeof AlertActions;
  Close:       typeof AlertClose;
};

const Alert = AlertRoot as AlertCompound;
Alert.Icon        = AlertIcon;
Alert.Title       = AlertTitle;
Alert.Description = AlertDescription;
Alert.Actions     = AlertActions;
Alert.Close       = AlertClose;

export { Alert, useAlertContext };
