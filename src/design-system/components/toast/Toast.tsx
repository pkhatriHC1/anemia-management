import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from "react";

import type {
  ToastActionsProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastIconProps,
  ToastProps,
  ToastState,
  ToastTitleProps,
  ToastVariant,
} from "./Toast.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Toast.
import "../../tokens/css/variables.css";
import "./Toast.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:        "hc-toast",
  variant:     (v: ToastVariant) => `hc-toast--variant-${v}`,
  state:       (s: ToastState)   => `hc-toast--state-${s}`,

  icon:        "hc-toast__icon",
  body:        "hc-toast__body",
  title:       "hc-toast__title",
  description: "hc-toast__description",
  actions:     "hc-toast__actions",
  close:       "hc-toast__close",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type ToastContextValue = {
  variant:     ToastVariant;
  dismissible: boolean;
  requestDismiss: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext(source: string): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Toast] ${source} must be rendered inside a <Toast> parent.`,
    );
  }
  return ctx;
}

/* ══════ EXIT DURATION ═════════════════════════════════════════════
 * Matches `motion.overlayExit` (150ms) — kept as a constant so the JS
 * timer and the CSS transition stay in sync. Update both if either
 * changes. */
const EXIT_DURATION_MS = 150;

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Toast — the canonical transient-feedback primitive.
 *
 * Compose with `Toast.Icon`, `Toast.Title`, `Toast.Description`,
 * `Toast.Actions`, and `Toast.Close`. Children can be authored in any
 * order — the root splits them into three layout slots (Icon / body /
 * Close) so the visual arrangement is stable.
 *
 * The Toast owns its own auto-close lifecycle. The consumer owns
 * whether the Toast is mounted — Toast never portals itself, never
 * manages a queue, never removes itself from the DOM. When the exit
 * animation completes, `onDismiss` fires and the consumer should
 * unmount.
 */
const ToastRoot = forwardRef<HTMLDivElement, ToastProps>(function ToastRoot(
  {
    variant     = "info",
    role        = "status",
    autoClose   = 4000,
    persistent  = false,
    dismissible = true,
    onDismiss,
    className,
    children,
    style,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  /* ─── State ────────────────────────────────────────────────────── */

  const [state, setState] = useState<ToastState>("visible");

  /* ─── Auto-close timer with pause / resume ─────────────────────── */

  const effectiveDuration = persistent || autoClose === false ? null : autoClose;

  const timerRef     = useRef<number | null>(null);
  const remainingRef = useRef<number>(effectiveDuration ?? Infinity);
  const startedAtRef = useRef<number>(0);
  const pausedRef    = useRef<boolean>(false);
  const dismissedRef = useRef<boolean>(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    clearTimer();
    setState("closing");
    window.setTimeout(() => {
      setState("dismissed");
      onDismissRef.current?.();
    }, EXIT_DURATION_MS);
  }, [clearTimer]);

  const scheduleDismiss = useCallback(
    (ms: number) => {
      clearTimer();
      if (!Number.isFinite(ms)) return;
      startedAtRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        requestDismiss();
      }, ms);
    },
    [clearTimer, requestDismiss],
  );

  const pauseTimer = useCallback(() => {
    if (pausedRef.current) return;
    if (effectiveDuration == null) return;
    pausedRef.current = true;
    if (timerRef.current != null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimer();
    }
  }, [clearTimer, effectiveDuration]);

  const resumeTimer = useCallback(() => {
    if (!pausedRef.current) return;
    if (effectiveDuration == null) return;
    pausedRef.current = false;
    scheduleDismiss(remainingRef.current);
  }, [effectiveDuration, scheduleDismiss]);

  // Start the timer on mount. Also restart if `autoClose` / `persistent`
  // change while the Toast is visible (rare, but well-defined).
  useEffect(() => {
    remainingRef.current = effectiveDuration ?? Infinity;
    if (effectiveDuration != null && state === "visible") {
      scheduleDismiss(effectiveDuration);
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDuration]);

  /* ─── Event forwarding + timer pause ───────────────────────────── */

  const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>) => {
    pauseTimer();
    onMouseEnter?.(event);
  };
  const handleMouseLeave = (event: ReactMouseEvent<HTMLDivElement>) => {
    resumeTimer();
    onMouseLeave?.(event);
  };
  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    pauseTimer();
    onFocus?.(event);
  };
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // Only resume when focus leaves the Toast subtree entirely.
    if (
      event.currentTarget &&
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      onBlur?.(event);
      return;
    }
    resumeTimer();
    onBlur?.(event);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && dismissible) {
      event.stopPropagation();
      requestDismiss();
    }
    onKeyDown?.(event);
  };

  /* ─── Context + child splitting ────────────────────────────────── */

  const contextValue = useMemo<ToastContextValue>(
    () => ({ variant, dismissible, requestDismiss }),
    [variant, dismissible, requestDismiss],
  );

  const { icon, close, body } = splitChildren(children);

  // Once the exit animation has completed the parent is expected to
  // unmount. If it does not, we render nothing so the DOM stays clean
  // and no residual focusable node is left behind.
  if (state === "dismissed") return null;

  return (
    <ToastContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        aria-atomic="true"
        data-state={state}
        className={cx(
          CLASS.root,
          CLASS.variant(variant),
          CLASS.state(state),
          className,
        )}
        style={style as CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {icon}
        <div className={CLASS.body}>{body}</div>
        {dismissible && close}
      </div>
    </ToastContext.Provider>
  );
});
ToastRoot.displayName = "Toast";

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
    if (el.type === ToastIcon) {
      if (!icon) icon = el;
      return;
    }
    if (el.type === ToastClose) {
      if (!close) close = el;
      return;
    }
    body.push(el);
  });

  return { icon, close, body };
}

/* ══════ ICON ══════════════════════════════════════════════════════ */

const ToastIcon = forwardRef<HTMLSpanElement, ToastIconProps>(function ToastIcon(
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
ToastIcon.displayName = "Toast.Icon";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
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
ToastTitle.displayName = "Toast.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(function ToastDescription(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.description, className)} {...rest}>
      {children}
    </div>
  );
});
ToastDescription.displayName = "Toast.Description";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const ToastActions = forwardRef<HTMLDivElement, ToastActionsProps>(function ToastActions(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.actions, className)} {...rest}>
      {children}
    </div>
  );
});
ToastActions.displayName = "Toast.Actions";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { label = "Dismiss", className, onClick, ...rest },
  ref,
) {
  const ctx = useToastContext("Toast.Close");
  return (
    <button
      ref={ref}
      type="button"
      className={cx(CLASS.close, className)}
      onClick={(event) => {
        onClick?.(event);
        ctx.requestDismiss();
      }}
      aria-label={label}
      {...rest}
    >
      <CloseIcon />
    </button>
  );
});
ToastClose.displayName = "Toast.Close";

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

type ToastCompound = typeof ToastRoot & {
  Icon:        typeof ToastIcon;
  Title:       typeof ToastTitle;
  Description: typeof ToastDescription;
  Actions:     typeof ToastActions;
  Close:       typeof ToastClose;
};

const Toast = ToastRoot as ToastCompound;
Toast.Icon        = ToastIcon;
Toast.Title       = ToastTitle;
Toast.Description = ToastDescription;
Toast.Actions     = ToastActions;
Toast.Close       = ToastClose;

export { Toast, useToastContext };
