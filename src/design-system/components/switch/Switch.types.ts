import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Control size ladder. Row heights match Checkbox + Radio + Button + Input
 * 1:1 so inline form controls on the same row sit flush.
 *   sm — row 28 · track 24×14 · thumb 10
 *   md — row 36 · track 28×16 · thumb 12   (default)
 *   lg — row 44 · track 36×20 · thumb 16
 */
export type SwitchSize = "sm" | "md" | "lg";

/**
 * Root Switch controller. Renders a `<label>` wrapping a real native
 * `<input type="checkbox" role="switch">` plus the visual track/thumb
 * (Switch.Indicator) and an optional text stack (Switch.Label + Switch.Description).
 *
 * Controlled with `checked` + `onCheckedChange`. Uncontrolled with
 * `defaultChecked`. `loading` is a transient state — while true the
 * switch shows a spinner overlay and is not toggleable.
 *
 * Composition-first: children are walked and bucketed by subcomponent.
 * If no `Switch.Label` / `Switch.Description` is composed, plain text /
 * inline children are treated as the label text.
 */
export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "onChange" | "defaultChecked" | "checked"
> & {
  /** Control size — sm / md / lg. @default 'md' */
  size?: SwitchSize;
  /** Controlled checked (on) state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Uncontrolled initial checked state. @default false */
  defaultChecked?: boolean;
  /** Fires when the user toggles the switch. */
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Preserve the native `onChange` for consumers that need the raw event. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Marks the control as invalid — red track + `aria-invalid='true'`. */
  invalid?: boolean;
  /**
   * Transient in-flight state — while true, a spinner paints in the thumb,
   * the input is disabled, and `aria-busy='true'` is set on the row. Use
   * this while an async settings save is pending so the user can't toggle
   * again mid-flight.
   */
  loading?: boolean;
  /**
   * Compose with `Switch.Label` and/or `Switch.Description` for the text
   * stack. If a plain string / non-subcomponent child is passed, it is
   * rendered as the label.
   */
  children?: ReactNode;
  /**
   * Override the native input `id`. Auto-generated via `useId` if omitted.
   */
  id?: string;
};

/**
 * The visible pill track + circular thumb. Auto-rendered by `<Switch>` if
 * not composed. Compose it explicitly only for advanced overrides — the
 * default composition puts the indicator at the start of the row.
 *
 * The Indicator is purely presentational — it reflects the parent
 * Switch's state via CSS classes set on the root. It never owns state.
 */
export type SwitchIndicatorProps = HTMLAttributes<HTMLSpanElement>;

/**
 * The label text alongside the track. Rendered as a `<span>` inside the
 * root `<label>` so a single click on the text still toggles the switch.
 */
export type SwitchLabelProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Secondary description under the label. Auto-wires `aria-describedby`
 * on the native input via a generated id.
 */
export type SwitchDescriptionProps = HTMLAttributes<HTMLSpanElement>;
