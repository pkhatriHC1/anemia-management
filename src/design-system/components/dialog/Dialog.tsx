import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactElement } from "react";
import { createPortal } from "react-dom";

import type {
  DialogActionsProps,
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogSize,
  DialogTitleProps,
  DialogTriggerProps,
} from "./Dialog.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Dialog, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Dialog.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  scrim:          "hc-dialog-scrim",
  scrimOpen:      "hc-dialog-scrim--open",

  panel:          "hc-dialog-panel",
  panelSize:      (s: DialogSize) => `hc-dialog-panel--size-${s}`,
  panelOpen:      "hc-dialog-panel--open",
  panelLoading:   "hc-dialog-panel--loading",

  header:         "hc-dialog-panel__header",
  headerBody:     "hc-dialog-panel__header-body",
  title:          "hc-dialog-panel__title",
  description:    "hc-dialog-panel__description",

  body:           "hc-dialog-panel__body",

  footer:         "hc-dialog-panel__footer",
  actions:        "hc-dialog-panel__actions",
  actionsAlign:   (a: "start" | "center" | "end") => `hc-dialog-panel__actions--${a}`,

  close:          "hc-dialog-panel__close",

  loading:        "hc-dialog-panel__loading",
  spinner:        "hc-dialog-panel__spinner",
  loadingLabel:   "hc-dialog-panel__loading-label",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  registerTitle: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(source: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Dialog] ${source} must be rendered inside a <Dialog> parent.`,
    );
  }
  return ctx;
}

/* ══════ FOCUS UTILITIES ═══════════════════════════════════════════ */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      // Fast approximate visibility check — offsetParent is null for display:none.
      (el.offsetParent !== null || el === document.activeElement),
  );
}

/* ══════ BODY SCROLL LOCK ══════════════════════════════════════════ */

let scrollLockCount = 0;
let previousBodyOverflow: string | null = null;
let previousBodyPaddingRight: string | null = null;

function lockBodyScroll() {
  if (typeof document === "undefined") return;
  scrollLockCount += 1;
  if (scrollLockCount > 1) return;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  previousBodyOverflow = document.body.style.overflow;
  previousBodyPaddingRight = document.body.style.paddingRight;
  document.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount > 0) return;

  document.body.style.overflow = previousBodyOverflow ?? "";
  document.body.style.paddingRight = previousBodyPaddingRight ?? "";
  previousBodyOverflow = null;
  previousBodyPaddingRight = null;
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Dialog — the canonical overlay primitive.
 *
 * Compose with `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`,
 * `Dialog.Title`, `Dialog.Description`, `Dialog.Body`, `Dialog.Footer`,
 * `Dialog.Actions`, and `Dialog.Close`. Controlled and uncontrolled
 * usage are both supported; pair `open` with `onOpenChange` for controlled.
 */
function DialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);
  const open = isControlled ? !!controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const generatedTitleId = useId();
  const generatedDescId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const registerTitle = useCallback((present: boolean) => setHasTitle(present), []);
  const registerDescription = useCallback(
    (present: boolean) => setHasDescription(present),
    [],
  );

  const contextValue = useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      titleId: hasTitle ? generatedTitleId : "",
      descriptionId: hasDescription ? generatedDescId : "",
      registerTitle,
      registerDescription,
    }),
    [
      open,
      setOpen,
      generatedTitleId,
      generatedDescId,
      hasTitle,
      hasDescription,
      registerTitle,
      registerDescription,
    ],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

DialogRoot.displayName = "Dialog";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

const DialogTrigger = function DialogTrigger({ children }: DialogTriggerProps) {
  const ctx = useDialogContext("Dialog.Trigger");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Dialog] Dialog.Trigger expects a single React element as its child.",
    );
  }

  const child = children as ReactElement<{
    onClick?: (event: ReactMouseEvent) => void;
    ref?: React.Ref<HTMLElement>;
  }>;

  const handleClick = (event: ReactMouseEvent) => {
    child.props.onClick?.(event);
    if (event.defaultPrevented) return;
    ctx.setOpen(true);
  };

  const composedRef = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    const originalRef = (child as { ref?: React.Ref<HTMLElement> }).ref;
    if (typeof originalRef === "function") originalRef(node);
    else if (originalRef && typeof originalRef === "object") {
      (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return cloneElement(child, {
    onClick: handleClick,
    ref: composedRef,
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.open || undefined,
  } as Record<string, unknown>);
};
DialogTrigger.displayName = "Dialog.Trigger";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const DialogClose = function DialogClose({ children }: DialogCloseProps) {
  const ctx = useDialogContext("Dialog.Close");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Dialog] Dialog.Close expects a single React element as its child.",
    );
  }

  const child = children as ReactElement<{
    onClick?: (event: ReactMouseEvent) => void;
  }>;

  const handleClick = (event: ReactMouseEvent) => {
    child.props.onClick?.(event);
    if (event.defaultPrevented) return;
    ctx.setOpen(false);
  };

  return cloneElement(child, {
    onClick: handleClick,
  } as Record<string, unknown>);
};
DialogClose.displayName = "Dialog.Close";

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    size = "md",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    closeLabel = "Close",
    loading = false,
    loadingLabel,
    className,
    style,
    children,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const ctx = useDialogContext("Dialog.Content");
  const { open, setOpen, triggerRef } = ctx;

  const panelRef = useRef<HTMLDivElement | null>(null);

  // Compose forwarded ref with internal panelRef.
  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef],
  );

  // Body scroll lock + focus management. Fires only while open.
  useEffect(() => {
    if (!open) return;

    lockBodyScroll();
    const previouslyFocused = (document.activeElement as HTMLElement | null) ?? null;

    // Move focus into the panel after mount. Prefer the first focusable
    // element; fall back to the panel itself (which sets tabIndex=-1).
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = getFocusable(panel);
      const target = focusables[0] ?? panel;
      target.focus({ preventScroll: true });
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      unlockBodyScroll();
      // Restore focus to the trigger (or the element focused before open).
      const restoreTarget = triggerRef.current ?? previouslyFocused;
      if (restoreTarget && typeof restoreTarget.focus === "function") {
        // Defer to next tick so the browser doesn't fight our own blur.
        window.setTimeout(() => restoreTarget.focus({ preventScroll: true }), 0);
      }
    };
  }, [open, triggerRef]);

  // Escape key — bound to document while open so the dialog closes even
  // when focus has drifted (a rare but real edge case).
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeOnEscape, setOpen]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    // Focus trap — cycle Tab within the panel.
    if (event.key === "Tab") {
      const panel = panelRef.current;
      const focusables = getFocusable(panel);
      if (focusables.length === 0) {
        event.preventDefault();
        panel?.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !panel?.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
  };

  const handleScrimClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Only fire when the click landed on the scrim itself, not bubbled
    // from the panel.
    if (event.target !== event.currentTarget) return;
    if (!closeOnOverlayClick) return;
    setOpen(false);
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const panelClass = cx(
    CLASS.panel,
    CLASS.panelSize(size),
    CLASS.panelOpen,
    loading && CLASS.panelLoading,
    className,
  );

  const portal = (
    <div
      className={cx(CLASS.scrim, CLASS.scrimOpen)}
      onMouseDown={handleScrimClick}
      data-hc-dialog-scrim=""
    >
      <div
        ref={setPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId || undefined}
        aria-describedby={ctx.descriptionId || undefined}
        aria-busy={loading || undefined}
        tabIndex={-1}
        onKeyDown={handlePanelKeyDown}
        className={panelClass}
        style={style as CSSProperties}
        {...rest}
      >
        {children}

        {showCloseButton && (
          <button
            type="button"
            className={CLASS.close}
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          >
            <XIcon />
          </button>
        )}

        {loading && (
          <div
            className={CLASS.loading}
            role="status"
            aria-live="polite"
          >
            <span className={CLASS.spinner} aria-hidden="true" />
            {loadingLabel && (
              <span className={CLASS.loadingLabel}>{loadingLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(portal, document.body);
});
DialogContent.displayName = "Dialog.Content";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.header, className)} {...rest}>
      <div className={CLASS.headerBody}>{children}</div>
    </div>
  );
});
DialogHeader.displayName = "Dialog.Header";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { as = 2, className, children, id, ...rest },
  ref,
) {
  const ctx = useDialogContext("Dialog.Title");
  const Tag = `h${as}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const titleId = id ?? ctx.titleId;

  useEffect(() => {
    ctx.registerTitle(true);
    return () => ctx.registerTitle(false);
  }, [ctx]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      id={titleId || undefined}
      className={cx(CLASS.title, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
DialogTitle.displayName = "Dialog.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(function DialogDescription(
  { className, children, id, ...rest },
  ref,
) {
  const ctx = useDialogContext("Dialog.Description");
  const descId = id ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <p
      ref={ref}
      id={descId || undefined}
      className={cx(CLASS.description, className)}
      {...rest}
    >
      {children}
    </p>
  );
});
DialogDescription.displayName = "Dialog.Description";

/* ══════ BODY ══════════════════════════════════════════════════════ */

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.body, className)} {...rest}>
      {children}
    </div>
  );
});
DialogBody.displayName = "Dialog.Body";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.footer, className)} {...rest}>
      {children}
    </div>
  );
});
DialogFooter.displayName = "Dialog.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(function DialogActions(
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
DialogActions.displayName = "Dialog.Actions";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type DialogCompound = typeof DialogRoot & {
  Trigger:     typeof DialogTrigger;
  Content:     typeof DialogContent;
  Header:      typeof DialogHeader;
  Title:       typeof DialogTitle;
  Description: typeof DialogDescription;
  Body:        typeof DialogBody;
  Footer:      typeof DialogFooter;
  Actions:     typeof DialogActions;
  Close:       typeof DialogClose;
};

const Dialog = DialogRoot as DialogCompound;
Dialog.Trigger     = DialogTrigger;
Dialog.Content     = DialogContent;
Dialog.Header      = DialogHeader;
Dialog.Title       = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body        = DialogBody;
Dialog.Footer      = DialogFooter;
Dialog.Actions     = DialogActions;
Dialog.Close       = DialogClose;

export { Dialog };
