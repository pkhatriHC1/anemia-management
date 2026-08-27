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
  DrawerActionsProps,
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerPlacement,
  DrawerProps,
  DrawerSize,
  DrawerTitleProps,
  DrawerTriggerProps,
} from "./Drawer.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Drawer, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Drawer.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  scrim:           "hc-drawer-scrim",
  scrimOpen:       "hc-drawer-scrim--open",
  scrimTransparent:"hc-drawer-scrim--transparent",
  scrimPlacement:  (p: DrawerPlacement) => `hc-drawer-scrim--placement-${p}`,

  panel:           "hc-drawer-panel",
  panelPlacement:  (p: DrawerPlacement) => `hc-drawer-panel--placement-${p}`,
  panelSize:       (s: DrawerSize)      => `hc-drawer-panel--size-${s}`,
  panelOpen:       "hc-drawer-panel--open",
  panelLoading:    "hc-drawer-panel--loading",

  header:          "hc-drawer-panel__header",
  headerSticky:    "hc-drawer-panel__header--sticky",
  headerBody:      "hc-drawer-panel__header-body",
  title:           "hc-drawer-panel__title",
  description:     "hc-drawer-panel__description",

  body:            "hc-drawer-panel__body",

  footer:          "hc-drawer-panel__footer",
  footerSticky:    "hc-drawer-panel__footer--sticky",
  actions:         "hc-drawer-panel__actions",
  actionsAlign:    (a: "start" | "center" | "end") => `hc-drawer-panel__actions--${a}`,

  close:           "hc-drawer-panel__close",

  loading:         "hc-drawer-panel__loading",
  spinner:         "hc-drawer-panel__spinner",
  loadingLabel:    "hc-drawer-panel__loading-label",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type DrawerContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  registerTitle: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(source: string): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Drawer] ${source} must be rendered inside a <Drawer> parent.`,
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
      (el.offsetParent !== null || el === document.activeElement),
  );
}

/* ══════ BODY SCROLL LOCK ══════════════════════════════════════════ */

// Reference-counted so a Drawer opened over a Dialog (or vice-versa)
// does not race the outer scroll lock. Both primitives use the same
// counter via this module's local state.
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
 * HC1 Drawer — the canonical side-panel primitive.
 *
 * Compose with `Drawer.Trigger`, `Drawer.Content`, `Drawer.Header`,
 * `Drawer.Title`, `Drawer.Description`, `Drawer.Body`, `Drawer.Footer`,
 * `Drawer.Actions`, and `Drawer.Close`. Controlled and uncontrolled
 * usage are both supported; pair `open` with `onOpenChange` for controlled.
 *
 * A Drawer reads as a Dialog extended sideways — same scrim, same
 * focus behavior, same escape handling — anchored to the left or right
 * edge of the viewport rather than centered.
 */
function DrawerRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DrawerProps) {
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

  const contextValue = useMemo<DrawerContextValue>(
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
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

DrawerRoot.displayName = "Drawer";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

const DrawerTrigger = function DrawerTrigger({ children }: DrawerTriggerProps) {
  const ctx = useDrawerContext("Drawer.Trigger");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Drawer] Drawer.Trigger expects a single React element as its child.",
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
DrawerTrigger.displayName = "Drawer.Trigger";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

const DrawerClose = function DrawerClose({ children }: DrawerCloseProps) {
  const ctx = useDrawerContext("Drawer.Close");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Drawer] Drawer.Close expects a single React element as its child.",
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
DrawerClose.displayName = "Drawer.Close";

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

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  {
    placement = "right",
    size = "md",
    overlay = true,
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
  const ctx = useDrawerContext("Drawer.Content");
  const { open, setOpen, triggerRef } = ctx;

  const panelRef = useRef<HTMLDivElement | null>(null);

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
        window.setTimeout(() => restoreTarget.focus({ preventScroll: true }), 0);
      }
    };
  }, [open, triggerRef]);

  // Escape key — bound to document while open so the drawer closes even
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
    if (!overlay || !closeOnOverlayClick) return;
    setOpen(false);
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const panelClass = cx(
    CLASS.panel,
    CLASS.panelPlacement(placement),
    CLASS.panelSize(size),
    CLASS.panelOpen,
    loading && CLASS.panelLoading,
    className,
  );

  const scrimClass = cx(
    CLASS.scrim,
    CLASS.scrimOpen,
    CLASS.scrimPlacement(placement),
    !overlay && CLASS.scrimTransparent,
  );

  const portal = (
    <div
      className={scrimClass}
      onMouseDown={handleScrimClick}
      data-hc-drawer-scrim=""
      data-hc-drawer-overlay={overlay ? "" : undefined}
    >
      <div
        ref={setPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId || undefined}
        aria-describedby={ctx.descriptionId || undefined}
        aria-busy={loading || undefined}
        data-placement={placement}
        data-size={size}
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
DrawerContent.displayName = "Drawer.Content";

/* ══════ HEADER ════════════════════════════════════════════════════ */

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  { sticky = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.header, sticky && CLASS.headerSticky, className)}
      {...rest}
    >
      <div className={CLASS.headerBody}>{children}</div>
    </div>
  );
});
DrawerHeader.displayName = "Drawer.Header";

/* ══════ TITLE ═════════════════════════════════════════════════════ */

const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(function DrawerTitle(
  { as = 2, className, children, id, ...rest },
  ref,
) {
  const ctx = useDrawerContext("Drawer.Title");
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
DrawerTitle.displayName = "Drawer.Title";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(function DrawerDescription(
  { className, children, id, ...rest },
  ref,
) {
  const ctx = useDrawerContext("Drawer.Description");
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
DrawerDescription.displayName = "Drawer.Description";

/* ══════ BODY ══════════════════════════════════════════════════════ */

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.body, className)} {...rest}>
      {children}
    </div>
  );
});
DrawerBody.displayName = "Drawer.Body";

/* ══════ FOOTER ════════════════════════════════════════════════════ */

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { sticky = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(CLASS.footer, sticky && CLASS.footerSticky, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
DrawerFooter.displayName = "Drawer.Footer";

/* ══════ ACTIONS ═══════════════════════════════════════════════════ */

const DrawerActions = forwardRef<HTMLDivElement, DrawerActionsProps>(function DrawerActions(
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
DrawerActions.displayName = "Drawer.Actions";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type DrawerCompound = typeof DrawerRoot & {
  Trigger:     typeof DrawerTrigger;
  Content:     typeof DrawerContent;
  Header:      typeof DrawerHeader;
  Title:       typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Body:        typeof DrawerBody;
  Footer:      typeof DrawerFooter;
  Actions:     typeof DrawerActions;
  Close:       typeof DrawerClose;
};

const Drawer = DrawerRoot as DrawerCompound;
Drawer.Trigger     = DrawerTrigger;
Drawer.Content     = DrawerContent;
Drawer.Header      = DrawerHeader;
Drawer.Title       = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Body        = DrawerBody;
Drawer.Footer      = DrawerFooter;
Drawer.Actions     = DrawerActions;
Drawer.Close       = DrawerClose;

export { Drawer };
