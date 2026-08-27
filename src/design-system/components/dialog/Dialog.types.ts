import type { HTMLAttributes, ReactNode } from "react";

/**
 * Panel width ladder. Layout only — reference existing tokens.
 *   sm         — single question / short confirmation (400px)
 *   md         — most dialogs; default (560px)
 *   lg         — forms with grouped fields (720px)
 *   xl         — wide detail / two-column reads (960px)
 *   fullscreen — mobile / immersive edits; edge-to-edge
 */
export type DialogSize = "sm" | "md" | "lg" | "xl" | "fullscreen";

/**
 * Root Dialog controller. Controls open state and hands it to the
 * subcomponents via context. Uncontrolled by default (`defaultOpen`),
 * controlled by passing `open` + `onOpenChange`.
 */
export type DialogProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Fires when the dialog wants to open or close (Escape, overlay, close button). */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Compose with Dialog.Trigger + Dialog.Content. */
  children?: ReactNode;
};

/**
 * Renders an element that opens the dialog on click. Injects onClick
 * onto its single child (via a lightweight cloneElement) so consumers
 * can use any button/link — including HC1 Button — without wrapping.
 */
export type DialogTriggerProps = {
  /**
   * A single interactive child. The Dialog opens when it is activated.
   * If the child provides its own onClick, both handlers fire.
   */
  children: React.ReactElement;
  /**
   * When true, renders no wrapper and no clone — the child must call
   * `useDialogContext().open()` itself. Rare — for advanced composition.
   */
  asChild?: never;
};

/**
 * The dialog panel + its scrim. Portalled to `document.body`. Only
 * mounted while the dialog is open (or animating out).
 */
export type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Panel width. `fullscreen` fills the viewport edge-to-edge and
   * disables the panel radius/shadow.
   * @default 'md'
   */
  size?: DialogSize;
  /**
   * Clicking the dimmed backdrop closes the dialog.
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Escape closes the dialog.
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
   * sees which dialog is loading.
   */
  loading?: boolean;
  /**
   * Optional label rendered under the loading spinner.
   */
  loadingLabel?: ReactNode;
  /**
   * Content — typically Dialog.Header, Dialog.Body, Dialog.Footer.
   */
  children?: ReactNode;
};

export type DialogHeaderProps      = HTMLAttributes<HTMLDivElement>;
export type DialogTitleProps       = HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level for the title. Ranges 1..6. Defaults to 2. */
  as?: 1 | 2 | 3 | 4 | 5 | 6;
};
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DialogBodyProps        = HTMLAttributes<HTMLDivElement>;
export type DialogFooterProps      = HTMLAttributes<HTMLDivElement>;

/**
 * A right-aligned row of actions. Mirrors Card.Actions so cross-family
 * rhythm stays consistent.
 */
export type DialogActionsProps = HTMLAttributes<HTMLDivElement> & {
  /** @default 'end' */
  align?: "start" | "center" | "end";
};

/**
 * Close-button slot. Renders a passthrough element that closes the
 * dialog on click. Useful in footer action rows for a labeled Cancel
 * button that also closes the dialog.
 */
export type DialogCloseProps = {
  children: React.ReactElement;
};
