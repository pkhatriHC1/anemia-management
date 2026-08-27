import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

/**
 * Semantic tone. Same map as Alert — a "success" Toast in one product
 * reads exactly like a "success" Toast in another.
 *   info    → informational, non-actionable notice
 *   success → the action completed
 *   warning → attention needed, non-blocking
 *   danger  → the action failed, or the surface is broken
 *   neutral → the quietest toast — for system messages, hints, muted meta
 */
export type ToastVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/**
 * ARIA role. Use `alert` only when the message needs immediate
 * announcement — a failed save, a lost connection. Everything else
 * should stay on `status` so screen readers announce it politely.
 */
export type ToastRole = "alert" | "status";

/**
 * The Toast's own lifecycle state. Exposed as `data-state` on the root
 * so consumers can hook animations or observe transitions.
 *   visible   — mounted and animating in (or settled)
 *   closing   — dismiss requested; exit animation is running
 *   dismissed — the exit animation completed; consumer should unmount
 */
export type ToastState = "visible" | "closing" | "dismissed";

/**
 * Root Toast props.
 *
 * Compose with `Toast.Icon`, `Toast.Title`, `Toast.Description`,
 * `Toast.Actions`, and `Toast.Close`. Children can be authored in any
 * order — the root positions the icon on the left, the body in the
 * middle, and the close control on the right.
 *
 * Toast is a *presentational* primitive — it does not portal itself,
 * queue itself, or manage sibling stacking. That belongs to a downstream
 * toast provider / region. The Toast owns its own auto-close timer and
 * exit animation lifecycle; the consumer owns whether the Toast is
 * mounted at all.
 */
export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  /**
   * Semantic tone. Pick by meaning, not color.
   * @default 'info'
   */
  variant?: ToastVariant;
  /**
   * ARIA role. Use `'alert'` only for urgent errors that must be
   * announced immediately. Everything else should stay on `'status'`.
   * @default 'status'
   */
  role?: ToastRole;
  /**
   * Auto-close duration in ms. Pass `false` (or set `persistent`) to
   * disable auto-close. The timer pauses while the pointer is over the
   * Toast or a descendant is focused, and resumes on leave/blur.
   * @default 4000
   */
  autoClose?: number | false;
  /**
   * Sugar for `autoClose={false}`. Persistent Toasts stay visible until
   * the user (or the parent) dismisses them.
   * @default false
   */
  persistent?: boolean;
  /**
   * When false, the built-in `Toast.Close` renders nothing. Use for
   * persistent toasts with a primary action that dismisses on its own.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Fires after the exit animation completes. The consumer should
   * unmount the Toast in response — the Toast never removes itself
   * from the DOM.
   */
  onDismiss?: () => void;
  /**
   * Composed subcomponents — Toast.Icon, Toast.Title, Toast.Description,
   * Toast.Actions, Toast.Close (any subset, in any order).
   */
  children?: ReactNode;
};

/* ══════ SUBCOMPONENTS ═════════════════════════════════════════════ */

/**
 * A leading icon slot. Placed on the left of the Toast. Icons here are
 * decorative — the meaning lives in the title + description.
 */
export type ToastIconProps = HTMLAttributes<HTMLSpanElement>;

export type ToastTitleProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Heading level. Defaults to a plain `<div>` — a Toast is a
   * transient notice, not a page landmark. `as={4..6}` is available
   * for the rare case a Toast is used as a page-level status region.
   * @default 'div'
   */
  as?: "div" | 1 | 2 | 3 | 4 | 5 | 6;
};

export type ToastDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * A row of actions — usually a single primary Button. Left-aligned
 * under the description. Keep to one action — a Toast is temporary and
 * should not carry a decision matrix.
 */
export type ToastActionsProps = HTMLAttributes<HTMLDivElement>;

/**
 * The dismiss control. Renders as a real `<button>` with an accessible
 * name ("Dismiss" by default) and calls the parent Toast's dismiss
 * handler on click. The Toast itself is never a button; only this
 * subcomponent is interactive.
 */
export type ToastCloseProps = Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** Accessible name for the dismiss control. */
  label?: string;
  /**
   * Optional additional handler fired *before* the parent's dismiss
   * flow starts. Rarely needed — the Toast already tears itself down.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};
