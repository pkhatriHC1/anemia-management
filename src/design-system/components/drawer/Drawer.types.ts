import type { HTMLAttributes, ReactElement, ReactNode } from "react";

/**
 * Panel placement — which edge of the viewport the drawer anchors to.
 *   right — most common; details/edit panels slide in from the right
 *   left  — filters, navigation-style trays
 */
export type DrawerPlacement = "left" | "right";

/**
 * Panel width ladder. Values match `--hc-drawer-size-*` in variables.css.
 *   sm         — narrow filter/settings tray (360px)
 *   md         — most drawers; default edit/detail panel (480px)
 *   lg         — spacious editors, multi-column reads (640px)
 *   fullscreen — mobile / immersive edits; edge-to-edge (100vw)
 */
export type DrawerSize = "sm" | "md" | "lg" | "fullscreen";

/**
 * Root Drawer controller. Controls open state and hands it to the
 * subcomponents via context. Uncontrolled by default (`defaultOpen`),
 * controlled by passing `open` + `onOpenChange`.
 */
export type DrawerProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Fires when the drawer wants to open or close (Escape, overlay, close button). */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Compose with Drawer.Trigger + Drawer.Content. */
  children?: ReactNode;
};

/**
 * Renders an element that opens the drawer on click. Injects onClick
 * onto its single child (via a lightweight cloneElement) so consumers
 * can use any button/link — including HC1 Button — without wrapping.
 */
export type DrawerTriggerProps = {
  /**
   * A single interactive child. The Drawer opens when it is activated.
   * If the child provides its own onClick, both handlers fire.
   */
  children: ReactElement;
};

/**
 * The drawer panel + its scrim. Portalled to `document.body`. Only
 * mounted while the drawer is open.
 */
export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Which edge of the viewport the drawer anchors to.
   * @default 'right'
   */
  placement?: DrawerPlacement;
  /**
   * Panel width. `fullscreen` fills the viewport edge-to-edge and
   * disables the panel radius/shadow.
   * @default 'md'
   */
  size?: DrawerSize;
  /**
   * Render the semi-transparent scrim behind the panel.
   * @default true
   */
  overlay?: boolean;
  /**
   * Clicking the dimmed backdrop closes the drawer. Ignored when
   * `overlay` is false.
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Escape closes the drawer.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Render the built-in close (X) button in the top-right of the header.
   * When false, consumers must provide their own close affordance.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Text used as the accessible name for the close button.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * When true, replaces the body with a centered spinner and sets
   * aria-busy on the panel. Header + footer remain visible so the user
   * sees which drawer is loading.
   */
  loading?: boolean;
  /**
   * Optional label rendered under the loading spinner.
   */
  loadingLabel?: ReactNode;
  /**
   * Content — typically Drawer.Header, Drawer.Body, Drawer.Footer.
   */
  children?: ReactNode;
};

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Pin the header to the top of the panel; the body scrolls beneath.
   * When true, a subtle border + shadow appear so the header visually
   * detaches from scrolled content.
   * @default false
   */
  sticky?: boolean;
};

export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level for the title. Ranges 1..6. Defaults to 2. */
  as?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Pin the footer to the bottom of the panel; the body scrolls above.
   * When true, a subtle border + shadow appear so the footer visually
   * detaches from scrolled content.
   * @default false
   */
  sticky?: boolean;
};

/**
 * A right-aligned row of actions. Mirrors Dialog.Actions and Card.Actions
 * so cross-family rhythm stays consistent.
 */
export type DrawerActionsProps = HTMLAttributes<HTMLDivElement> & {
  /** @default 'end' */
  align?: "start" | "center" | "end";
};

/**
 * Close-button slot. Wraps a passthrough element that closes the drawer
 * on click. Useful in footer action rows for a labeled Cancel button
 * that also closes the drawer.
 */
export type DrawerCloseProps = {
  children: ReactElement;
};
