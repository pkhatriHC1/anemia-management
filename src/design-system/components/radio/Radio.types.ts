import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Size ladder — matches HC1 Checkbox exactly so Radio + Checkbox stack
 * cleanly in mixed forms.
 *   sm — row 28 · box 14
 *   md — row 36 · box 16 (default)
 *   lg — row 44 · box 20
 */
export type RadioSize = "sm" | "md" | "lg";

/**
 * Orientation for RadioGroup layout.
 *   vertical   — stacked column (default; matches most forms)
 *   horizontal — inline row (short choices only; wraps on narrow viewports)
 */
export type RadioGroupOrientation = "vertical" | "horizontal";

/**
 * Single Radio button. Renders a real native `<input type="radio">`.
 *
 * Standalone usage: pass `checked` + `onCheckedChange` + `name` yourself,
 * OR use `defaultChecked` for uncontrolled.
 *
 * Inside a RadioGroup: `name`, `checked`, `size`, `disabled`, `invalid`,
 * `required`, and roving `tabIndex` are all derived from the group; the
 * consumer only needs to pass `value` (the string the group will report
 * when this radio is selected) plus the label.
 *
 * Composition-first: children can be `<Radio.Label>` + `<Radio.Description>`
 * (or plain text — treated as the label).
 */
export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "onChange" | "defaultChecked" | "checked"
> & {
  /**
   * The value this radio contributes when selected. Required inside a
   * RadioGroup — the group reports it back via `onValueChange`. Optional
   * standalone (uses native form `value`).
   */
  value?: string;
  /** Control size. Inherited from RadioGroup if unset. @default 'md' */
  size?: RadioSize;
  /** Controlled checked state. Ignored inside a RadioGroup (group owns it). */
  checked?: boolean;
  /** Uncontrolled initial checked state (standalone only). @default false */
  defaultChecked?: boolean;
  /** Fires when the user selects this radio. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Native onChange — the raw event if you need it. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Marks as invalid — red border + `aria-invalid='true'`. Inherited from group. */
  invalid?: boolean;
  /** Disable interaction; propagated to the native input. Inherited from group. */
  disabled?: boolean;
  /** Marks as required for form validation. Inherited from group. */
  required?: boolean;
  /**
   * Compose with `<Radio.Label>` and/or `<Radio.Description>`; plain text
   * children are treated as the label text.
   */
  children?: ReactNode;
  /** Override the native input id (default: useId-generated). */
  id?: string;
};

/**
 * Grouping wrapper that owns the shared radio state. Provides:
 *   - shared `name` (auto-generated via useId if omitted)
 *   - controlled `value` / uncontrolled `defaultValue` + `onValueChange`
 *   - inheritable `size`, `disabled`, `invalid`, `required`
 *   - `orientation` (vertical / horizontal)
 *   - roving tabindex — the currently selected radio is `tabIndex=0`,
 *     others `tabIndex=-1`. If nothing is selected, the first Radio in
 *     the group is tabbable so keyboard users can tab into it.
 *   - optional `label` + `description` slots rendered as a `<div>` group
 *     header with `aria-labelledby` / `aria-describedby` wired on the
 *     `role='radiogroup'` root.
 *
 * Arrow-key navigation between radios is handled natively by the browser
 * because all radios in a group share the same `name`. RadioGroup does
 * NOT reimplement arrow handling — it just makes sure focus + tabIndex
 * are set up correctly for the native behavior to work.
 */
export type RadioGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires when the user selects a different radio. */
  onValueChange?: (value: string) => void;
  /** Shared `name` for the native radio inputs. Auto-generated if omitted. */
  name?: string;
  /** Layout orientation. @default 'vertical' */
  orientation?: RadioGroupOrientation;
  /** Control size propagated to every child Radio. @default 'md' */
  size?: RadioSize;
  /** Disable every radio in the group. */
  disabled?: boolean;
  /** Mark the group as invalid (propagates to child radios). */
  invalid?: boolean;
  /** Mark the group as required (propagates to child radios). */
  required?: boolean;
  /**
   * Optional group label rendered as a `<div>` above the radios. The
   * root gets `aria-labelledby` pointing at this label id so assistive
   * tech reads the group name.
   */
  label?: ReactNode;
  /**
   * Optional group description rendered under the label. The root gets
   * `aria-describedby` pointing at this description id.
   */
  description?: ReactNode;
  /**
   * Optional error message rendered under the group. When present, the
   * group also emits `aria-invalid='true'` and the error text is red.
   */
  errorMessage?: ReactNode;
  /** Compose child `<Radio>` elements here. */
  children?: ReactNode;
};

/**
 * The visible circular indicator. Auto-rendered by the root — you rarely
 * compose it explicitly. Exposed for advanced overrides (custom inner
 * glyph / bespoke fill).
 */
export type RadioIndicatorProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Label text next to the indicator. Renders as a `<span>` inside the
 * root `<label>` so clicking the text still selects the radio.
 */
export type RadioLabelProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Secondary description under the label. Auto-wires `aria-describedby`
 * on the native input via a generated id.
 */
export type RadioDescriptionProps = HTMLAttributes<HTMLSpanElement>;
