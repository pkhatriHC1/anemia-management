import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Control size ladder. Matches the Button + Input size ladder 1:1 so
 * inline controls on the same row sit flush:
 *   sm — row 28  · box 14
 *   md — row 36  · box 16   (default)
 *   lg — row 44  · box 20
 */
export type CheckboxSize = "sm" | "md" | "lg";

/**
 * Root Checkbox controller. Renders a `<label>` wrapping a real native
 * `<input type="checkbox">` plus the visual box (Checkbox.Indicator) and
 * an optional text stack (Checkbox.Label + Checkbox.Description).
 *
 * Controlled with `checked` + `onCheckedChange`, uncontrolled with
 * `defaultChecked`. `indeterminate` is a third visual state that ARIA
 * exposes as `aria-checked="mixed"` — the underlying input is toggled
 * to "not checked" on activation, and `onCheckedChange` fires with the
 * new checked value; consumers use that as the cue to clear indeterminate.
 *
 * Composition-first: children are walked and buckets by subcomponent.
 * If no `Checkbox.Label` / `Checkbox.Description` is composed, plain
 * text/inline children are treated as the label text.
 */
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "onChange" | "defaultChecked" | "checked"
> & {
  /** Control size — sm / md / lg. @default 'md' */
  size?: CheckboxSize;
  /** Controlled checked state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Uncontrolled initial checked state. @default false */
  defaultChecked?: boolean;
  /** Fires when the user activates the checkbox. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Preserve the native `onChange` for consumers that need the raw event. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Third visual state — box shows a horizontal bar and reports
   * `aria-checked="mixed"`. Common in "select-all" checkboxes when some
   * (but not all) rows are selected.
   */
  indeterminate?: boolean;
  /** Marks the control as invalid — red border + `aria-invalid='true'`. */
  invalid?: boolean;
  /**
   * Compose with `Checkbox.Label` and/or `Checkbox.Description` for the
   * text stack. If a plain string / non-subcomponent child is passed, it
   * is rendered as the label.
   */
  children?: ReactNode;
  /**
   * Override the native input `id`. Auto-generated via `useId` if omitted;
   * the auto id is what `Checkbox.Label` uses for its `htmlFor`.
   */
  id?: string;
};

/**
 * The visual box + check/dash glyph. Auto-rendered by `<Checkbox>` if
 * not composed. Compose it explicitly only when you need to change the
 * visual position (rare) — the default composition puts the indicator
 * at the start of the row.
 *
 * The Indicator is purely presentational — it reflects the parent
 * Checkbox's state via CSS classes set on the root. It never owns state.
 */
export type CheckboxIndicatorProps = HTMLAttributes<HTMLSpanElement>;

/**
 * The label text alongside the box. Rendered as a `<span>` inside the
 * root `<label>` so a single click on the text still toggles the input.
 * Semantic labelling is handled by the outer `<label>` wrapping the
 * native input.
 */
export type CheckboxLabelProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Secondary description under the label. Auto-wires `aria-describedby`
 * on the native input via a generated id.
 */
export type CheckboxDescriptionProps = HTMLAttributes<HTMLSpanElement>;
