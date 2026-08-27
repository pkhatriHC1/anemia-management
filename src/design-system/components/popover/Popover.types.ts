import type { HTMLAttributes, ReactElement, ReactNode } from "react";

/**
 * Preferred placement of the popover relative to the trigger.
 * `auto` picks the side with the most room; the resolved side is available
 * on the content via `data-side`.
 */
export type PopoverPlacement = "top" | "bottom" | "left" | "right" | "auto";

/**
 * Root Popover. Holds shared open state and shares an id for
 * aria-controls / aria-labelledby wiring between Trigger and Content.
 *
 * Controlled with `open` + `onOpenChange`. Uncontrolled works out of the
 * box — the Trigger drives open/close via click.
 *
 * Popover is the interactive complement to Tooltip. Where Tooltip is a
 * passive hint that appears on hover/focus and never receives focus,
 * Popover is opened by click and its content IS focusable. Use Popover
 * whenever the floating content must be interacted with (buttons,
 * inputs, lists); use Tooltip for supplemental hints; use Dialog for
 * focused, task-completion flows that gate the underlying surface.
 */
export type PopoverProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Fires when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Preferred placement. @default 'bottom' */
  placement?: PopoverPlacement;

  /**
   * Modal mode. When true the popover paints a full-viewport scrim
   * behind the panel, traps focus inside the content, and locks body
   * scroll — a hybrid of Popover positioning + Dialog dismissal.
   * @default false
   */
  modal?: boolean;

  /**
   * Close when the user clicks outside the content. Applies to
   * non-modal mode (modal mode dismisses on scrim click).
   * @default true
   */
  closeOnOutsideClick?: boolean;

  /**
   * Close when the user presses Escape. @default true
   */
  closeOnEscape?: boolean;

  /** Compose <Popover.Trigger>, <Popover.Content>. */
  children?: ReactNode;
};

/**
 * Trigger slot — the element the popover is anchored to.
 *
 * Clones its single child and attaches an onClick handler + ref +
 * `aria-haspopup='dialog'` + `aria-expanded` + `aria-controls` pointing
 * at the Content id. The child MUST be a single React element that
 * forwards its ref and props (Button, plain button, <a>, etc.).
 */
export type PopoverTriggerProps = {
  /** The trigger element. Must be a single React element. */
  children: ReactElement;
};

/**
 * Content slot — the floating panel. Rendered into a portal on
 * `document.body` so it escapes overflow-hidden ancestors and paints
 * above the surrounding surface.
 *
 * The panel has `role='dialog'` (or `role='menu'` when composed with a
 * downstream menu), `tabIndex=-1`, and receives focus on open. Escape,
 * outside click, and — in modal mode — the scrim all close it.
 */
export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  /** The popover content. */
  children?: ReactNode;
  /** Show or hide the arrow. Uses `<Popover.Arrow>` internally when true. @default true */
  arrow?: boolean;
  /** Override the min inline width. */
  minWidth?: number | string;
  /** Override the max inline width. */
  maxWidth?: number | string;
  /**
   * Accessible label for the panel. Rendered as `aria-label` on the
   * dialog role. Prefer this OR aria-labelledby via a heading inside
   * Content — never both.
   */
  ariaLabel?: string;
};

/**
 * Arrow slot — the small triangular pointer. Auto-rendered by Content
 * when `arrow` is true; exposed as a standalone subcomponent for the
 * rare case of a fully composed Content with a custom shell.
 */
export type PopoverArrowProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Close slot — clones its single child and attaches an onClick handler
 * that flips the popover closed. Compose inside Content to build a
 * "Done" or dismiss button that participates in the same close flow as
 * the built-in Escape / outside-click paths.
 */
export type PopoverCloseProps = {
  /** The close element. Must be a single React element. */
  children: ReactElement;
};
