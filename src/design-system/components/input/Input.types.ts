import type { InputHTMLAttributes, ReactNode } from "react";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Validation intent, derived automatically from message props but also
 * settable directly for cases where you want the visual without a message
 * (e.g. a bulk-edit view where messages live elsewhere).
 */
export type InputValidation = "error" | "warning" | "success";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  /**
   * Native input type. Extend the design language later with Textarea,
   * Select, Combobox etc. — this component stays text-input-only.
   * @default 'text'
   */
  type?: InputType;
  /**
   * Size ladder — aligned to the Button height ladder so a size='md'
   * Input sits next to a size='md' Button without visual drift.
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Visible label. Renders above the input frame and is `htmlFor`-linked
   * to the input for correct label association.
   */
  label?: ReactNode;
  /**
   * Show an "Optional" marker next to the label. Ignored when the input
   * is `required` — required takes precedence and renders the required
   * marker.
   */
  optional?: boolean;
  /**
   * Custom character rendered as the required marker.
   * @default '*'
   */
  requiredMarker?: ReactNode;

  /**
   * Helper text shown beneath the input. Suppressed while a validation
   * message is present (error > warning > success takes over the slot).
   */
  helperText?: ReactNode;
  /**
   * When set, applies the error state and displays the message.
   * Takes precedence over warning and success.
   */
  errorMessage?: ReactNode;
  /**
   * When set, applies the warning state and displays the message.
   * Takes precedence over success.
   */
  warningMessage?: ReactNode;
  /**
   * When set, applies the success state and displays the message.
   */
  successMessage?: ReactNode;
  /**
   * Explicit validation state. Use only when a message is not desired
   * (e.g., displayed elsewhere). Messages auto-imply the matching state
   * and override this if both are provided.
   */
  validation?: InputValidation;

  /**
   * Icon rendered inside the frame before the input control.
   */
  leadingIcon?: ReactNode;
  /**
   * Icon rendered inside the frame after the input control. Hidden while
   * `loading` is true (the spinner takes the trailing slot).
   */
  trailingIcon?: ReactNode;

  /**
   * Show a clear (✕) button when the input has a value. Suppressed
   * while disabled, read-only, or loading. See `onClear` to observe.
   */
  clearable?: boolean;
  /**
   * Called when the clear button is pressed. Receives the input element
   * (already cleared) so callers can also update controlled state.
   */
  onClear?: (input: HTMLInputElement) => void;

  /**
   * Show a spinner in the trailing slot and set aria-busy=true. The
   * input stays interactive — loading signifies async validation or
   * lookup, not "input is unusable".
   */
  loading?: boolean;

  /**
   * Show a character counter (`value / maxLength`) in the footer.
   * Requires `maxLength` to be set. Turns red once the count exceeds
   * the limit (which shouldn't happen when maxLength is enforced, but
   * we handle it for `soft` counters).
   */
  showCounter?: boolean;

  /**
   * Grow to fill the parent width. Off by default so inline usage sizes
   * to content.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Class name applied to the field wrapper (the outermost element).
   * Prefer this over passing className via native input props — that
   * would style the inner control, not the field.
   */
  className?: string;
};
