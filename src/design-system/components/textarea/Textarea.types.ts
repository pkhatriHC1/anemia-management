import type { HTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

/**
 * Size ladder — mirrors the Input ladder for sm / md / lg. Textarea skips
 * xs and xl because a 20px-tall multi-line surface reads as broken and
 * xl is reserved for hero single-line search bars.
 *   sm — font 12 · padding 8×8   · line-height 20
 *   md — font 14 · padding 12×8  · line-height 22   (default)
 *   lg — font 16 · padding 12×12 · line-height 24
 */
export type TextareaSize = "sm" | "md" | "lg";

/**
 * Validation intent — derived automatically from message props but also
 * settable directly for cases where the visual is wanted without a message
 * (e.g. summary surfaces where the message lives elsewhere). Identical to
 * InputValidation so a mixed form reads consistently.
 */
export type TextareaValidation = "error" | "warning" | "success";

/**
 * Root Textarea controller. Renders a `<textarea>` inside a labelled
 * field wrapper plus an optional footer with helper text, validation
 * message, and character counter.
 *
 * Controlled with `value` + `onChange`; uncontrolled with `defaultValue`.
 * `autoResize` grows the frame between `minRows` and `maxRows` as the
 * user types; when off, the frame stays at `minRows` and content scrolls
 * inside.
 *
 * Composition-first: children can be `<Textarea.Label>`, `<Textarea.Description>`,
 * `<Textarea.Helper>`, and `<Textarea.Counter>` — or use the equivalent
 * top-level props (`label`, `helperText`, `showCounter`) for the common
 * shape. Composed subcomponents always win over the equivalent prop.
 */
export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "rows"
> & {
  /**
   * Control size — sm / md / lg. Matches Input's sm / md / lg for font
   * size + horizontal padding so mixed forms read as one visual family.
   * @default 'md'
   */
  size?: TextareaSize;

  /**
   * Visible label. Renders above the textarea frame and is `htmlFor`-linked
   * to the textarea for correct label association.
   */
  label?: ReactNode;
  /** Optional description under the label — muted secondary text. */
  description?: ReactNode;
  /**
   * Show an "Optional" marker next to the label. Ignored when the textarea
   * is `required` — required takes precedence and renders the required
   * marker.
   */
  optional?: boolean;
  /** Custom character rendered as the required marker. @default '*' */
  requiredMarker?: ReactNode;

  /**
   * Helper text under the frame. Suppressed while a validation message
   * is present (error > warning > success takes over the slot).
   */
  helperText?: ReactNode;
  /** Error message — applies error visual + `aria-invalid='true'`. */
  errorMessage?: ReactNode;
  /** Warning message — applies warning visual. */
  warningMessage?: ReactNode;
  /** Success message — applies success visual. */
  successMessage?: ReactNode;
  /**
   * Explicit validation state. Use when a message is not desired
   * (e.g., summary surfaces). Messages auto-imply the matching state and
   * override this if both are provided.
   */
  validation?: TextareaValidation;

  /**
   * Show a spinner in the frame corner and set aria-busy=true. The
   * textarea stays interactive — loading signifies async validation or
   * autosave, not "input is unusable".
   */
  loading?: boolean;

  /**
   * Show a character counter (`value / maxLength`) in the footer.
   * Requires `maxLength` to be set. Turns red once the count exceeds
   * the limit.
   */
  showCounter?: boolean;

  /**
   * Grow to fill the parent width. On by default so a textarea takes
   * the full form column.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Minimum number of rows the frame renders at. When `autoResize` is on,
   * the frame starts here and grows up to `maxRows`. When off, the frame
   * stays fixed at this many rows.
   * @default 3
   */
  minRows?: number;
  /**
   * Maximum number of rows the frame grows to when `autoResize` is on.
   * Once the content would exceed `maxRows`, the frame stops growing and
   * the internal scrollbar takes over.
   * @default 12
   */
  maxRows?: number;
  /**
   * Grow the frame vertically as the user types, between `minRows` and
   * `maxRows`. When off, the frame is a fixed `minRows`-tall box with
   * an internal scrollbar for overflow.
   * @default false
   */
  autoResize?: boolean;
  /**
   * Whether the user can drag-resize the textarea. Off by default so the
   * autoResize behaviour + row bounds stay predictable.
   *   - 'none'     — no drag handle
   *   - 'vertical' — allow vertical drag-resize (native browser handle)
   * @default 'none'
   */
  resize?: "none" | "vertical";

  /**
   * Class name applied to the field wrapper (the outermost element).
   * Prefer this over passing className via native textarea props — that
   * would style the inner control, not the field.
   */
  className?: string;
};

/**
 * Label slot. Rendered as a real `<label htmlFor={inputId}>` so click
 * associates natively. Auto-renders when `label` prop is provided; compose
 * explicitly to append content (icons, tooltips) alongside the text.
 */
export type TextareaLabelProps = HTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
};

/**
 * Secondary description under the label. Auto-wires `aria-describedby` on
 * the native textarea via a generated id.
 */
export type TextareaDescriptionProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

/**
 * Helper text under the frame. Suppressed automatically when a validation
 * message is showing. Wires into `aria-describedby` on the textarea.
 */
export type TextareaHelperProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

/**
 * Character counter — right-aligned in the footer. Reads the current
 * length + maxLength from context; consumers rarely compose it explicitly
 * (setting `showCounter` on the root is the common path). Compose only
 * for advanced layouts.
 */
export type TextareaCounterProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};
