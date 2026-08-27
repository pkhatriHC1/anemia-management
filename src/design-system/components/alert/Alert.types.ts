import type { HTMLAttributes, MouseEvent, ReactNode } from "react";

/**
 * Semantic tone.
 *   info    → informational, non-blocking notice
 *   success → the action completed
 *   warning → attention needed, non-blocking
 *   danger  → the action failed, or the surface is broken
 *   neutral → the quietest alert — for system messages, hints, muted meta
 */
export type AlertVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/**
 * Visual weight.
 *   soft    → subtle wash + colored ink + colored border (default; most common)
 *   outline → page background + colored border + colored ink
 *   solid   → filled variant color + inverse ink (loud; use sparingly)
 */
export type AlertAppearance = "soft" | "outline" | "solid";

/**
 * The Alert's ARIA role. Use `alert` only when the message needs
 * immediate announcement — a form-submit failure, a lost connection.
 * Everything else should use `status` (the default).
 */
export type AlertRole = "alert" | "status";

/**
 * Root Alert props.
 *
 * Compose with `Alert.Icon`, `Alert.Title`, `Alert.Description`,
 * `Alert.Actions`, and `Alert.Close`. The root positions the icon on
 * the left, the body (title + description + actions) in the middle,
 * and the close control on the right — regardless of the order in
 * which the children are authored.
 */
export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Semantic tone. Pick by meaning, not color.
   * @default 'info'
   */
  variant?: AlertVariant;
  /**
   * Visual weight.
   * @default 'soft'
   */
  appearance?: AlertAppearance;
  /**
   * ARIA role. Use `'alert'` only when the message needs immediate
   * announcement — form-submit failures, lost connections. Everything
   * else should stay on `'status'`.
   * @default 'status'
   */
  role?: AlertRole;
  /**
   * When true, the Alert renders dimmed and its close control (if any)
   * is disabled. Purely a visual state — the Alert is not a form
   * control.
   */
  disabled?: boolean;
  /**
   * Composed subcomponents — Alert.Icon, Alert.Title, Alert.Description,
   * Alert.Actions, Alert.Close (any subset, in any order).
   */
  children?: ReactNode;
};

/* ══════ SUBCOMPONENTS ═════════════════════════════════════════════ */

/**
 * A leading icon slot. Placed on the left of the Alert. Icons here are
 * decorative — the meaning lives in the title + description.
 */
export type AlertIconProps = HTMLAttributes<HTMLSpanElement>;

export type AlertTitleProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Heading level. Defaults to a plain `<div>` because most Alerts are
   * inline notices, not page-level landmarks. Set `as={4}` (or higher)
   * when the Alert *is* a page-level notice — a form validation summary
   * or a top-of-page banner.
   * @default 'div'
   */
  as?: "div" | 1 | 2 | 3 | 4 | 5 | 6;
};

export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * A row of actions — usually one or two `<Button>`s.
 * Left-aligned under the description by default; the Alert layout
 * places the row at the bottom of the body stack.
 */
export type AlertActionsProps = HTMLAttributes<HTMLDivElement>;

/**
 * The dismiss control. Renders as a real `<button>` with an accessible
 * name ("Dismiss" by default). Provide `onClick` to handle the
 * dismissal — the Alert itself does not manage its own open state.
 *
 * The Alert is never a button itself; only this subcomponent is
 * interactive. That preserves the "an Alert is a message, not an
 * action" rule.
 */
export type AlertCloseProps = Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> & {
  /** Accessible name for the dismiss control. */
  label?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * When true, the button is rendered disabled. Automatically true
   * when the parent Alert is disabled.
   */
  disabled?: boolean;
};
