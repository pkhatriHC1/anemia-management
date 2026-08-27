import type { HTMLAttributes, ReactElement, ReactNode } from "react";

/**
 * Preferred placement of the tooltip relative to the trigger.
 * `auto` picks the side with the most room; the resolved side is available
 * on the content via `data-side`.
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "auto";

/**
 * Root Tooltip. Holds shared state (open, delays, placement) and shares
 * ids for aria-describedby wiring between Trigger and Content.
 *
 * Controlled with `open` + `onOpenChange`. Uncontrolled works out of the
 * box — the Trigger drives open/close from hover + focus.
 *
 * Tooltip is deliberately non-interactive: content is announced to the
 * screen reader via aria-describedby but the tooltip itself never
 * receives focus. If you need interactive content, use Popover (future).
 */
export type TooltipProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Fires when the tooltip open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Preferred placement. @default 'top' */
  placement?: TooltipPlacement;

  /**
   * Show delay in ms. Prevents accidental reveal on drive-by mouse
   * motion. @default 200
   */
  delayShow?: number;
  /**
   * Hide delay in ms. Bridges tiny pointer gaps (e.g. when the pointer
   * briefly leaves the trigger between hover intents). @default 100
   */
  delayHide?: number;

  /**
   * Disable the tooltip entirely — trigger stops emitting hover/focus
   * events. Useful when the trigger's own state (e.g. loading) shouldn't
   * show the tooltip.
   * @default false
   */
  disabled?: boolean;

  /** Compose <Tooltip.Trigger>, <Tooltip.Content>. */
  children?: ReactNode;
};

/**
 * Trigger slot — the element the tooltip is attached to.
 *
 * The Trigger clones its single child and attaches hover/focus/keyboard
 * handlers plus `aria-describedby` pointing at the Content id. The child
 * MUST be a single React element that forwards its ref and props (Button,
 * a plain icon button, an <a>, etc.).
 *
 * If the child is a disabled `<button>`, hover events won't fire in some
 * browsers. Wrap it in an inline span (`asChild={false}` future feature)
 * OR simply hover the surrounding label — for now, wrap disabled controls
 * in a small span with `tabIndex={0}` if you need tooltip on hover.
 */
export type TooltipTriggerProps = {
  /** The trigger element. Must be a single React element. */
  children: ReactElement;
};

/**
 * Content slot — the floating panel with the hint text. Rendered into a
 * portal on `document.body` so it escapes overflow-hidden ancestors.
 *
 * The tooltip itself has `role='tooltip'` and `tabIndex=-1` — it MUST
 * NEVER receive focus. It's announced to screen readers via the
 * `aria-describedby` on the Trigger, not by focusing into the tooltip.
 */
export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  /** The tooltip content. Text or short inline nodes only. */
  children?: ReactNode;
  /** Show or hide the arrow. Uses `<Tooltip.Arrow>` internally when true. @default true */
  arrow?: boolean;
  /** Override the max width of the tooltip content. */
  maxWidth?: number | string;
};

/**
 * Arrow slot — the small triangular pointer. Auto-rendered by Content
 * when `arrow` is true; expose as a standalone subcomponent for the rare
 * case of a fully composed Content with a custom shell.
 */
export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement>;
