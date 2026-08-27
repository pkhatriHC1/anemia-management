import type { ButtonHTMLAttributes, ReactNode } from "react";

export type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SelectValidation = "error" | "warning" | "success";

/**
 * One option in the Select's option list.
 *
 * Options are a flat array; grouping is derived at render time from the
 * `group` field so a group's order in the list is the order its first
 * option appears. Options without `group` render at the top ungrouped.
 */
export type SelectOption = {
  /** Human-readable label — the text shown in the option row and trigger. */
  label: string;
  /** The value written back via onChange when this option is selected. */
  value: string;
  /** Optional secondary text shown under the label. */
  description?: string;
  /** Optional leading icon rendered inside the option row. */
  icon?: ReactNode;
  /** Disabled options are visible but unselectable and skipped by keyboard nav. */
  disabled?: boolean;
  /** Group header this option belongs to. Options with the same group render together. */
  group?: string;
};

export type SelectProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "size" | "type" | "children"
> & {
  /**
   * The option set. See `SelectOption` for the shape.
   */
  options: SelectOption[];
  /**
   * Controlled selected value. Pass `undefined` for no selection.
   */
  value?: string;
  /**
   * Uncontrolled initial selected value.
   */
  defaultValue?: string;
  /**
   * Called whenever the selected value changes. Receives the new value
   * and the full option object for convenience.
   */
  onChange?: (value: string, option: SelectOption) => void;

  /**
   * Placeholder shown in the trigger when no option is selected.
   */
  placeholder?: string;

  /**
   * Size ladder — aligned with Button and Input so all three sit flush
   * on the same row.
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Visible label. Renders above the trigger and is linked via
   * `aria-labelledby` for correct label association.
   */
  label?: ReactNode;
  /**
   * Show an "Optional" marker next to the label. Ignored when `required`.
   */
  optional?: boolean;
  /**
   * Character rendered as the required marker.
   * @default '*'
   */
  requiredMarker?: ReactNode;
  /**
   * Native-required semantics. Renders a required marker on the label.
   */
  required?: boolean;

  /**
   * Helper text under the trigger. Suppressed while a validation message
   * is present.
   */
  helperText?: ReactNode;
  /** Error message — sets state='error', aria-invalid, role='alert'. */
  errorMessage?: ReactNode;
  /** Warning message — sets state='warning'. No aria-invalid. */
  warningMessage?: ReactNode;
  /** Success message — sets state='success'. */
  successMessage?: ReactNode;
  /**
   * Explicit validation state without a message. Overridden by any
   * message prop.
   */
  validation?: SelectValidation;

  /**
   * Icon rendered inside the trigger before the selected label.
   */
  leadingIcon?: ReactNode;

  /**
   * Show a spinner in place of the chevron. Sets aria-busy=true.
   */
  loading?: boolean;

  /**
   * Grow to fill parent width. Defaults on so Selects match Input
   * behavior in forms.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Message shown inside the popup when `options` is empty.
   * @default 'No options'
   */
  emptyStateMessage?: ReactNode;

  /**
   * Controlled open state. Pair with `onOpenChange` to drive the popup
   * from outside. Uncontrolled by default.
   */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Class name applied to the field wrapper (the outermost element).
   */
  className?: string;
};
