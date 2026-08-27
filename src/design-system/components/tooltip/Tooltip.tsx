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
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";

import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipTriggerProps,
} from "./Tooltip.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Tooltip, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Tooltip.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  content:      "hc-tooltip",
  contentOpen:  "hc-tooltip--open",
  contentSide:  (s: ResolvedSide) => `hc-tooltip--side-${s}`,
  arrow:        "hc-tooltip__arrow",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type ResolvedSide = "top" | "bottom" | "left" | "right";

type TooltipContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  /** Show request, subject to delayShow. */
  scheduleShow: () => void;
  /** Hide request, subject to delayHide. */
  scheduleHide: () => void;
  /** Immediate hide (skips delayHide). Used by Escape / blur. */
  hideNow: () => void;
  contentId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  placement: TooltipPlacement;
  disabled: boolean;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(source: string): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Tooltip] ${source} must be rendered inside a <Tooltip> parent.`,
    );
  }
  return ctx;
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Tooltip — the canonical contextual hint primitive.
 *
 * Compose with `Tooltip.Trigger` (the element the hint is attached to)
 * and `Tooltip.Content` (the floating hint text). Show + hide are driven
 * by hover, focus, and Escape — the consumer never wires event handlers
 * directly.
 *
 * Deliberately non-interactive: the tooltip content is announced to
 * screen readers via aria-describedby on the trigger, and the tooltip
 * itself never receives focus. If content needs interaction, use Popover
 * (future primitive built on the same positioning + portal foundation).
 */
function TooltipRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "top",
  delayShow = 200,
  delayHide = 100,
  disabled = false,
  children,
}: TooltipProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);
  const open = isControlled ? !!controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) return;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [disabled, isControlled, onOpenChange],
  );

  // Delay timers — use module-scope refs so back-to-back schedule
  // calls cancel each other cleanly.
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current != null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);
  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    if (disabled) return;
    clearHideTimer();
    if (open) return; // already open
    if (delayShow <= 0) {
      setOpen(true);
      return;
    }
    clearShowTimer();
    showTimerRef.current = window.setTimeout(() => {
      showTimerRef.current = null;
      setOpen(true);
    }, delayShow);
  }, [disabled, open, delayShow, setOpen, clearHideTimer, clearShowTimer]);

  const scheduleHide = useCallback(() => {
    clearShowTimer();
    if (!open) return;
    if (delayHide <= 0) {
      setOpen(false);
      return;
    }
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null;
      setOpen(false);
    }, delayHide);
  }, [open, delayHide, setOpen, clearShowTimer, clearHideTimer]);

  const hideNow = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    setOpen(false);
  }, [clearShowTimer, clearHideTimer, setOpen]);

  // Clean up any pending timers on unmount to avoid setState-after-unmount.
  useEffect(
    () => () => {
      clearShowTimer();
      clearHideTimer();
    },
    [clearShowTimer, clearHideTimer],
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();

  const contextValue = useMemo<TooltipContextValue>(
    () => ({
      open,
      setOpen,
      scheduleShow,
      scheduleHide,
      hideNow,
      contentId,
      triggerRef,
      placement,
      disabled,
    }),
    [open, setOpen, scheduleShow, scheduleHide, hideNow, contentId, placement, disabled],
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}
TooltipRoot.displayName = "Tooltip";

/* ══════ TRIGGER ═══════════════════════════════════════════════════ */

/**
 * Clones its single child and attaches hover/focus/keyboard handlers +
 * `aria-describedby` pointing at the Content id. The child must be a
 * single React element (Button, a plain icon button, an <a>, etc.).
 *
 * Handlers COMPOSE with any that the child already has — we call the
 * child's onMouseEnter/onMouseLeave/onFocus/onBlur/onKeyDown first, and
 * only fire the Tooltip's behavior if the event isn't default-prevented.
 */
function TooltipTrigger({ children }: TooltipTriggerProps) {
  const ctx = useTooltipContext("Tooltip.Trigger");

  if (!isValidElement(children)) {
    throw new Error(
      "[hc1 Tooltip] Tooltip.Trigger expects a single React element as its child.",
    );
  }

  const child = children as ReactElement<{
    onMouseEnter?: (e: ReactMouseEvent) => void;
    onMouseLeave?: (e: ReactMouseEvent) => void;
    onFocus?: (e: ReactFocusEvent) => void;
    onBlur?: (e: ReactFocusEvent) => void;
    onKeyDown?: (e: ReactKeyboardEvent) => void;
    ref?: React.Ref<HTMLElement>;
    "aria-describedby"?: string;
  }>;

  const handleMouseEnter = (event: ReactMouseEvent) => {
    child.props.onMouseEnter?.(event);
    if (event.defaultPrevented) return;
    ctx.scheduleShow();
  };
  const handleMouseLeave = (event: ReactMouseEvent) => {
    child.props.onMouseLeave?.(event);
    if (event.defaultPrevented) return;
    ctx.scheduleHide();
  };
  const handleFocus = (event: ReactFocusEvent) => {
    child.props.onFocus?.(event);
    if (event.defaultPrevented) return;
    ctx.scheduleShow();
  };
  const handleBlur = (event: ReactFocusEvent) => {
    child.props.onBlur?.(event);
    if (event.defaultPrevented) return;
    // Blur is a definitive close — no need to wait for delayHide.
    ctx.hideNow();
  };
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    child.props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Escape" && ctx.open) {
      // Don't stop propagation — a dialog above may want to consume
      // Escape too; the tooltip just needs to disappear underneath.
      ctx.hideNow();
    }
  };

  const composedRef = (node: HTMLElement | null) => {
    ctx.triggerRef.current = node;
    const originalRef = (child as { ref?: React.Ref<HTMLElement> }).ref;
    if (typeof originalRef === "function") originalRef(node);
    else if (originalRef && typeof originalRef === "object") {
      (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  // Compose aria-describedby with any existing value on the child.
  const existingDescribedBy = child.props["aria-describedby"];
  const describedBy = ctx.open
    ? [existingDescribedBy, ctx.contentId].filter(Boolean).join(" ")
    : existingDescribedBy;

  return cloneElement(child, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus:      handleFocus,
    onBlur:       handleBlur,
    onKeyDown:    handleKeyDown,
    ref:          composedRef,
    "aria-describedby": describedBy,
  } as Record<string, unknown>);
}
TooltipTrigger.displayName = "Tooltip.Trigger";

/* ══════ POSITIONING ═══════════════════════════════════════════════ */

type Position = {
  side:   ResolvedSide;
  top:    number;
  left:   number;
  arrowX: number | null;  /* px from tooltip left edge (top/bottom) */
  arrowY: number | null;  /* px from tooltip top  edge (left/right) */
};

const VIEWPORT_PADDING = 8;

/**
 * Compute the tooltip's viewport position given the trigger + tooltip
 * measurements and the requested placement. For `auto`, pick the side
 * with the most room, preferring top → bottom → right → left.
 */
function computePosition(
  triggerRect: DOMRect,
  tooltipRect: { width: number; height: number },
  arrowSize: number,
  offset: number,
  placement: TooltipPlacement,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Space available on each side of the trigger.
  const space = {
    top:    triggerRect.top,
    bottom: vh - triggerRect.bottom,
    left:   triggerRect.left,
    right:  vw - triggerRect.right,
  };

  // Required space for the tooltip on each side.
  const needed = {
    top:    tooltipRect.height + offset + arrowSize + VIEWPORT_PADDING,
    bottom: tooltipRect.height + offset + arrowSize + VIEWPORT_PADDING,
    left:   tooltipRect.width  + offset + arrowSize + VIEWPORT_PADDING,
    right:  tooltipRect.width  + offset + arrowSize + VIEWPORT_PADDING,
  };

  const fits = {
    top:    space.top    >= needed.top,
    bottom: space.bottom >= needed.bottom,
    left:   space.left   >= needed.left,
    right:  space.right  >= needed.right,
  };

  let side: ResolvedSide;
  if (placement === "auto") {
    // Prefer top → bottom → right → left when they fit.
    if (fits.top)         side = "top";
    else if (fits.bottom) side = "bottom";
    else if (fits.right)  side = "right";
    else if (fits.left)   side = "left";
    // Nothing fits nicely → pick the side with the most space.
    else {
      const entries: [ResolvedSide, number][] = [
        ["top",    space.top],
        ["bottom", space.bottom],
        ["right",  space.right],
        ["left",   space.left],
      ];
      entries.sort((a, b) => b[1] - a[1]);
      side = entries[0][0];
    }
  } else if (fits[placement]) {
    side = placement;
  } else {
    // Requested side doesn't fit — flip to the opposite if that fits.
    const opposite: Record<ResolvedSide, ResolvedSide> = {
      top: "bottom", bottom: "top", left: "right", right: "left",
    };
    const opp = opposite[placement];
    side = fits[opp] ? opp : placement;
  }

  // Base position along the primary axis.
  let top: number;
  let left: number;
  if (side === "top") {
    top  = triggerRect.top - tooltipRect.height - offset - arrowSize / 2;
    left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
  } else if (side === "bottom") {
    top  = triggerRect.bottom + offset + arrowSize / 2;
    left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
  } else if (side === "left") {
    top  = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
    left = triggerRect.left - tooltipRect.width - offset - arrowSize / 2;
  } else {
    top  = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
    left = triggerRect.right + offset + arrowSize / 2;
  }

  // Clamp to viewport with a small padding so nothing crashes into the
  // window edges.
  const minLeft = VIEWPORT_PADDING;
  const maxLeft = vw - tooltipRect.width - VIEWPORT_PADDING;
  const minTop  = VIEWPORT_PADDING;
  const maxTop  = vh - tooltipRect.height - VIEWPORT_PADDING;

  const clampedLeft = Math.max(minLeft, Math.min(left, maxLeft));
  const clampedTop  = Math.max(minTop,  Math.min(top,  maxTop));

  // Arrow position along the cross axis (relative to the tooltip's own
  // top-left corner). Tracks the trigger centre so the arrow "points at"
  // the trigger even when the tooltip has been clamped away from centre.
  let arrowX: number | null = null;
  let arrowY: number | null = null;
  if (side === "top" || side === "bottom") {
    const triggerCentreX = triggerRect.left + triggerRect.width / 2;
    arrowX = triggerCentreX - clampedLeft;
    // Keep the arrow inside the tooltip (with some inset).
    arrowX = Math.max(arrowSize, Math.min(arrowX, tooltipRect.width - arrowSize));
  } else {
    const triggerCentreY = triggerRect.top + triggerRect.height / 2;
    arrowY = triggerCentreY - clampedTop;
    arrowY = Math.max(arrowSize, Math.min(arrowY, tooltipRect.height - arrowSize));
  }

  return { side, top: clampedTop, left: clampedLeft, arrowX, arrowY };
}

/* ══════ CONTENT ═══════════════════════════════════════════════════ */

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  {
    arrow = true,
    maxWidth,
    className,
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  forwardedRef,
) {
  const ctx = useTooltipContext("Tooltip.Content");
  const { open, contentId, triggerRef, placement, hideNow } = ctx;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const setContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef],
  );

  // Re-measure + reposition whenever open flips on, and on scroll / resize
  // while open. Use useLayoutEffect so we place before paint (no flicker).
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;

    const measure = () => {
      const triggerRect = trigger.getBoundingClientRect();
      const rect = content.getBoundingClientRect();
      const arrowSize = 8; // matches --hc-tooltip-arrow-size
      const offset = 8;    // matches --hc-tooltip-offset
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

    // Follow the trigger as the viewport moves.
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, placement, triggerRef]);

  // Escape closes the tooltip even when focus is elsewhere — the
  // trigger's own Escape handler covers the focused case; this document
  // listener covers hover-only cases.
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideNow();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, hideNow]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const side: ResolvedSide = position?.side ?? (placement === "auto" ? "top" : placement);

  const combinedStyle: CSSProperties = {
    ...style,
    // Hidden until we've measured the first time so no flash at 0,0.
    visibility: position ? "visible" : "hidden",
    top:  position?.top  ?? 0,
    left: position?.left ?? 0,
    maxWidth,
  };

  const arrowStyle: CSSProperties = {};
  if (position?.arrowX != null) arrowStyle.left = position.arrowX;
  if (position?.arrowY != null) arrowStyle.top  = position.arrowY;

  const portal = (
    <div
      ref={setContentRef}
      id={contentId}
      role="tooltip"
      tabIndex={-1}
      data-side={side}
      className={cx(CLASS.content, CLASS.contentOpen, CLASS.contentSide(side), className)}
      style={combinedStyle}
      // Pointer-events are disabled by CSS (tooltip is non-interactive)
      // so the trigger's hover flow doesn't hitch as the pointer moves
      // over the tooltip — but keep these handlers for callers that
      // override pointer-events on custom content.
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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

  return createPortal(portal, document.body);
});
TooltipContent.displayName = "Tooltip.Content";

/* ══════ ARROW (standalone subcomponent) ═══════════════════════════ */

const TooltipArrow = forwardRef<HTMLSpanElement, TooltipArrowProps>(function TooltipArrow(
  { className, ...rest },
  ref,
) {
  // Standalone arrow — used when a consumer composes a fully custom
  // Content shell but still wants the design-system arrow. Position is
  // owned by Content in the common path; this variant leaves position
  // to the consumer (data-side attribute drives geometry).
  return (
    <span
      ref={ref}
      className={cx(CLASS.arrow, className)}
      aria-hidden="true"
      {...rest}
    />
  );
});
TooltipArrow.displayName = "Tooltip.Arrow";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TooltipCompound = typeof TooltipRoot & {
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow:   typeof TooltipArrow;
};

const Tooltip = TooltipRoot as TooltipCompound;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow   = TooltipArrow;

export { Tooltip };
