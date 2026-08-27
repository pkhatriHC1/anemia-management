import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";

import type {
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPlacement,
  PopoverProps,
  PopoverTriggerProps,
} from "./Popover.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Popover, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Popover.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  scrim:       "hc-popover-scrim",
  content:     "hc-popover",
  contentOpen: "hc-popover--open",
  contentSide: (s: ResolvedSide) => `hc-popover--side-${s}`,
  arrow:       "hc-popover__arrow",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type ResolvedSide = "top" | "bottom" | "left" | "right";

type PopoverContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  placement: PopoverPlacement;
  modal: boolean;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(source: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Popover] ${source} must be rendered inside a <Popover> parent.`,
    );
  }
  return ctx;
}

/* ══════ FOCUS UTILITIES (shared shape with Dialog) ════════════════ */

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

/* ══════ BODY SCROLL LOCK (shared shape with Dialog) ═══════════════ */

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
 * HC1 Popover — the canonical floating surface primitive.
 *
 * Popover is the interactive complement to Tooltip. Compose with
 * `Popover.Trigger` (the anchor element) and `Popover.Content` (the
 * floating panel). Click-to-open, click-outside / Escape / composed
 * `Popover.Close` to close. `modal` upgrades the panel with a scrim +
 * focus trap + body scroll lock — a hybrid of Popover positioning and
 * Dialog dismissal.
 *
 * Downstream components (Dropdown Menu, User Menu, Date Picker, Colour
 * Picker, Filter Menu, Combobox, Command Palette, Context Menu) will
 * compose this primitive rather than reinventing floating surfaces.
 */
function PopoverRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  modal = false,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  children,
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);
  const open = isControlled ? !!controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();

  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      triggerRef,
      placement,
      modal,
      closeOnOutsideClick,
      closeOnEscape,
    }),
    [open, setOpen, contentId, placement, modal, closeOnOutsideClick, closeOnEscape],
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}
PopoverRoot.displayName = "Popover";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

/**
 * Clones its single child and attaches an onClick handler + ref +
 * `aria-haspopup='dialog'` + `aria-expanded` + `aria-controls`. Any
 * existing onClick on the child fires first, and Popover's toggle only
 * runs if the child didn't preventDefault the event.
 */
function PopoverTrigger({ children }: PopoverTriggerProps) {
  const ctx = usePopoverContext("Popover.Trigger");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Popover] Popover.Trigger expects a single React element as its child.",
    );
  }

  const child = children as ReactElement<{
    onClick?: (event: ReactMouseEvent) => void;
    ref?: React.Ref<HTMLElement>;
  }>;

  const handleClick = (event: ReactMouseEvent) => {
    child.props.onClick?.(event);
    if (event.defaultPrevented) return;
    ctx.setOpen(!ctx.open);
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
    "aria-controls": ctx.open ? ctx.contentId : undefined,
  } as Record<string, unknown>);
}
PopoverTrigger.displayName = "Popover.Trigger";

/* ══════ CLOSE ═════════════════════════════════════════════════════ */

/**
 * Clones a single child and attaches an onClick handler that flips the
 * popover closed. Use for a composed "Done" button, an inline cancel
 * link, or any element that dismisses without pressing Escape.
 */
function PopoverClose({ children }: PopoverCloseProps) {
  const ctx = usePopoverContext("Popover.Close");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Popover] Popover.Close expects a single React element as its child.",
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
}
PopoverClose.displayName = "Popover.Close";

/* ══════ POSITIONING ═══════════════════════════════════════════════ */

type Position = {
  side:   ResolvedSide;
  top:    number;
  left:   number;
  arrowX: number | null;
  arrowY: number | null;
};

const VIEWPORT_PADDING = 8;

/**
 * Compute the popover's viewport position. Same shape as Tooltip's
 * engine so the two overlays behave identically at the edge cases:
 * measure trigger + panel, check what fits, flip if the requested side
 * collides, clamp to the viewport with padding, and place the arrow so
 * it tracks the trigger centre even when the panel is clamped away
 * from it.
 */
function computePosition(
  triggerRect: DOMRect,
  panelRect: { width: number; height: number },
  arrowSize: number,
  offset: number,
  placement: PopoverPlacement,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space = {
    top:    triggerRect.top,
    bottom: vh - triggerRect.bottom,
    left:   triggerRect.left,
    right:  vw - triggerRect.right,
  };

  const needed = {
    top:    panelRect.height + offset + arrowSize + VIEWPORT_PADDING,
    bottom: panelRect.height + offset + arrowSize + VIEWPORT_PADDING,
    left:   panelRect.width  + offset + arrowSize + VIEWPORT_PADDING,
    right:  panelRect.width  + offset + arrowSize + VIEWPORT_PADDING,
  };

  const fits = {
    top:    space.top    >= needed.top,
    bottom: space.bottom >= needed.bottom,
    left:   space.left   >= needed.left,
    right:  space.right  >= needed.right,
  };

  let side: ResolvedSide;
  if (placement === "auto") {
    // Popovers open on click so bottom is the canonical resting place —
    // prefer bottom → top → right → left when they fit.
    if (fits.bottom)    side = "bottom";
    else if (fits.top)  side = "top";
    else if (fits.right)side = "right";
    else if (fits.left) side = "left";
    else {
      const entries: [ResolvedSide, number][] = [
        ["bottom", space.bottom],
        ["top",    space.top],
        ["right",  space.right],
        ["left",   space.left],
      ];
      entries.sort((a, b) => b[1] - a[1]);
      side = entries[0][0];
    }
  } else if (fits[placement]) {
    side = placement;
  } else {
    const opposite: Record<ResolvedSide, ResolvedSide> = {
      top: "bottom", bottom: "top", left: "right", right: "left",
    };
    const opp = opposite[placement];
    side = fits[opp] ? opp : placement;
  }

  let top: number;
  let left: number;
  if (side === "top") {
    top  = triggerRect.top - panelRect.height - offset - arrowSize / 2;
    left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
  } else if (side === "bottom") {
    top  = triggerRect.bottom + offset + arrowSize / 2;
    left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
  } else if (side === "left") {
    top  = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
    left = triggerRect.left - panelRect.width - offset - arrowSize / 2;
  } else {
    top  = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
    left = triggerRect.right + offset + arrowSize / 2;
  }

  const minLeft = VIEWPORT_PADDING;
  const maxLeft = vw - panelRect.width - VIEWPORT_PADDING;
  const minTop  = VIEWPORT_PADDING;
  const maxTop  = vh - panelRect.height - VIEWPORT_PADDING;

  const clampedLeft = Math.max(minLeft, Math.min(left, maxLeft));
  const clampedTop  = Math.max(minTop,  Math.min(top,  maxTop));

  let arrowX: number | null = null;
  let arrowY: number | null = null;
  if (side === "top" || side === "bottom") {
    const triggerCentreX = triggerRect.left + triggerRect.width / 2;
    arrowX = triggerCentreX - clampedLeft;
    arrowX = Math.max(arrowSize, Math.min(arrowX, panelRect.width - arrowSize));
  } else {
    const triggerCentreY = triggerRect.top + triggerRect.height / 2;
    arrowY = triggerCentreY - clampedTop;
    arrowY = Math.max(arrowSize, Math.min(arrowY, panelRect.height - arrowSize));
  }

  return { side, top: clampedTop, left: clampedLeft, arrowX, arrowY };
}

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    arrow = true,
    minWidth,
    maxWidth,
    ariaLabel,
    className,
    style,
    children,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const ctx = usePopoverContext("Popover.Content");
  const { open, setOpen, contentId, triggerRef, placement, modal, closeOnOutsideClick, closeOnEscape } = ctx;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<Position | null>(null);

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

  // Position on open + follow the trigger through scroll / resize.
  // useLayoutEffect ensures placement runs before paint so the panel
  // never flashes at 0,0.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const measure = () => {
      const triggerRect = trigger.getBoundingClientRect();
      const rect = panel.getBoundingClientRect();
      const arrowSize = 8;
      const offset = 8;
      const next = computePosition(
        triggerRect,
        { width: rect.width, height: rect.height },
        arrowSize,
        offset,
        placement,
      );
      setPosition(next);
    };

    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, placement, triggerRef]);

  // Focus into the panel on open + restore focus to the trigger on
  // close. In non-modal mode we still move focus in — Popover content
  // IS focusable, unlike Tooltip. Modal mode adds scroll lock; the
  // scroll-lock counter is shared with Dialog so nested overlays
  // decrement correctly.
  useEffect(() => {
    if (!open) return;
    if (modal) lockBodyScroll();
    const previouslyFocused = (document.activeElement as HTMLElement | null) ?? null;

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = getFocusable(panel);
      const target = focusables[0] ?? panel;
      target.focus({ preventScroll: true });
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      if (modal) unlockBodyScroll();
      const restoreTarget = triggerRef.current ?? previouslyFocused;
      if (restoreTarget && typeof restoreTarget.focus === "function") {
        // Defer to next tick so the browser doesn't fight our own blur.
        window.setTimeout(() => restoreTarget.focus({ preventScroll: true }), 0);
      }
    };
  }, [open, modal, triggerRef]);

  // Escape closes the popover even when focus has drifted outside the
  // panel — a bound document listener catches the case where a
  // downstream composition parked focus somewhere else on purpose.
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

  // Outside-click dismissal for non-modal mode. Modal mode uses the
  // scrim's own click handler so the panel doesn't fight it. Bound to
  // pointerdown so the popover closes on the leading edge of the
  // gesture (feels tighter than click, matches Radix / floating-ui
  // defaults).
  useEffect(() => {
    if (!open || modal || !closeOnOutsideClick) return;
    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const panel = panelRef.current;
      const trigger = triggerRef.current;
      if (panel && panel.contains(target)) return;
      if (trigger && trigger.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer, true);
    return () => document.removeEventListener("pointerdown", handlePointer, true);
  }, [open, modal, closeOnOutsideClick, setOpen, triggerRef]);

  // In modal mode, trap Tab / Shift+Tab inside the panel — same shape
  // as Dialog's focus trap. Non-modal mode leaves Tab alone: focus can
  // move out into the underlying page, which closes the popover via
  // outside click on the next interaction.
  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!modal) return;

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

  const handleScrimPointerDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!closeOnOutsideClick) return;
    setOpen(false);
  };

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const side: ResolvedSide = position?.side ?? (placement === "auto" ? "bottom" : placement);

  const combinedStyle: CSSProperties = {
    ...style,
    // Hidden until measured so no flash at 0,0.
    visibility: position ? "visible" : "hidden",
    top:  position?.top  ?? 0,
    left: position?.left ?? 0,
    minWidth,
    maxWidth,
  };

  const arrowStyle: CSSProperties = {};
  if (position?.arrowX != null) arrowStyle.left = position.arrowX;
  if (position?.arrowY != null) arrowStyle.top  = position.arrowY;

  const panel = (
    <div
      ref={setPanelRef}
      id={contentId}
      role="dialog"
      aria-modal={modal || undefined}
      aria-label={ariaLabel}
      tabIndex={-1}
      data-side={side}
      className={cx(CLASS.content, CLASS.contentOpen, CLASS.contentSide(side), className)}
      style={combinedStyle}
      onKeyDown={handlePanelKeyDown}
      {...rest}
    >
      {children}
      {arrow && (
        <span
          className={CLASS.arrow}
          data-side={side}
          style={arrowStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );

  const portal = modal ? (
    <div className={CLASS.scrim} onPointerDown={handleScrimPointerDown}>
      {panel}
    </div>
  ) : (
    panel
  );

  return createPortal(portal, document.body);
});
PopoverContent.displayName = "Popover.Content";

/* ══════ ARROW (standalone subcomponent) ═══════════════════════════ */

const PopoverArrow = forwardRef<HTMLSpanElement, PopoverArrowProps>(function PopoverArrow(
  { className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx(CLASS.arrow, className)}
      aria-hidden="true"
      {...rest}
    />
  );
});
PopoverArrow.displayName = "Popover.Arrow";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type PopoverCompound = typeof PopoverRoot & {
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Arrow:   typeof PopoverArrow;
  Close:   typeof PopoverClose;
};

const Popover = PopoverRoot as PopoverCompound;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Arrow   = PopoverArrow;
Popover.Close   = PopoverClose;

export { Popover };
