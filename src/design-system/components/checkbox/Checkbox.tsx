import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";

import type {
  CheckboxDescriptionProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxProps,
  CheckboxSize,
} from "./Checkbox.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Checkbox, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Checkbox.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:              "hc-checkbox",
  rootSize:          (s: CheckboxSize) => `hc-checkbox--size-${s}`,
  rootChecked:       "hc-checkbox--checked",
  rootIndeterminate: "hc-checkbox--indeterminate",
  rootDisabled:      "hc-checkbox--disabled",
  rootInvalid:       "hc-checkbox--invalid",
  rootRequired:      "hc-checkbox--required",
  rootHasText:       "hc-checkbox--has-text",

  input:             "hc-checkbox__input",
  indicator:         "hc-checkbox__indicator",
  glyph:             "hc-checkbox__glyph",
  glyphCheck:        "hc-checkbox__glyph--check",
  glyphDash:         "hc-checkbox__glyph--dash",

  text:              "hc-checkbox__text",
  label:             "hc-checkbox__label",
  labelRequired:     "hc-checkbox__label-required",
  description:       "hc-checkbox__description",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

/**
 * Context bridge from root Checkbox to its subcomponents. Subcomponents
 * don't own state — they read presentational info (id, size, disabled)
 * from context so ids wire up automatically.
 */
type CheckboxContextValue = {
  inputId: string;
  descriptionId: string;
  size: CheckboxSize;
  disabled: boolean;
  required: boolean;
  registerDescription: (present: boolean) => void;
};

const CheckboxContext = createContext<CheckboxContextValue | null>(null);

function useCheckboxContext(source: string): CheckboxContextValue {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Checkbox] ${source} must be rendered inside a <Checkbox> parent.`,
    );
  }
  return ctx;
}

/* ══════ CHILD SPLIT ═══════════════════════════════════════════════ */

type ChildBuckets = {
  indicator?: ReactElement;
  label?: ReactElement;
  description?: ReactElement;
  /** Fallback: non-subcomponent children treated as inline label text. */
  fallbackLabel: ReactNode[];
};

/**
 * Walk children once and bucket by subcomponent. First occurrence wins.
 * Nodes that are not one of our named subcomponents fall through as
 * label text (so `<Checkbox>Accept</Checkbox>` works with no ceremony).
 */
function splitChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = { fallbackLabel: [] };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) buckets.fallbackLabel.push(child);
      return;
    }
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Checkbox.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Checkbox.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Checkbox.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ GLYPHS ════════════════════════════════════════════════════ */

function CheckGlyph({ size }: { size: number }) {
  return (
    <svg
      className={cx(CLASS.glyph, CLASS.glyphCheck)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashGlyph({ size }: { size: number }) {
  return (
    <svg
      className={cx(CLASS.glyph, CLASS.glyphDash)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 8H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Checkbox — the canonical multi-selection control.
 *
 * Renders a real native `<input type="checkbox">` inside a `<label>`
 * wrapper. The visual box (`Checkbox.Indicator`) is auto-rendered at the
 * start of the row unless composed explicitly. Label + Description are
 * opt-in subcomponents; plain text children work too.
 *
 * Controlled with `checked` + `onCheckedChange`. Uncontrolled with
 * `defaultChecked`. `indeterminate` is a visual third state that ARIA
 * exposes as `aria-checked="mixed"` — the underlying input remains
 * a real checkbox; consumers own when to clear the indeterminate flag.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    size = "md",
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    indeterminate = false,
    invalid = false,
    disabled = false,
    required = false,
    id: idProp,
    className,
    style,
    children,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const descriptionId = `${inputId}-description`;

  // Compose forwarded ref with our own for indeterminate management.
  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  // Track checked locally so uncontrolled usage can drive the visual state
  // without asking consumers to lift state. In controlled mode the prop
  // is the source of truth.
  const isControlled = checked !== undefined;
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked);
  const currentChecked = isControlled ? !!checked : innerChecked;

  // Native `indeterminate` is a runtime property — it has no HTML attribute.
  // Sync it every render so the DOM reflects the prop.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.indeterminate = indeterminate;
  }, [indeterminate, currentChecked]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerChecked(event.target.checked);
      onCheckedChange?.(event.target.checked, event);
      onChange?.(event);
    },
    [isControlled, onCheckedChange, onChange],
  );

  const buckets = splitChildren(children);
  const hasLabel       = !!(buckets.label || buckets.fallbackLabel.length > 0);
  const hasDescription = !!buckets.description;
  const hasText        = hasLabel || hasDescription;

  // Track description presence so we can conditionally wire aria-describedby.
  const [hasDescriptionRegistered, setHasDescriptionRegistered] = useState(hasDescription);
  const registerDescription = useCallback(
    (present: boolean) => setHasDescriptionRegistered(present),
    [],
  );
  // Keep the initial-render inference in sync with the runtime registration.
  useEffect(() => {
    if (hasDescription !== hasDescriptionRegistered) {
      setHasDescriptionRegistered(hasDescription);
    }
  }, [hasDescription, hasDescriptionRegistered]);

  const contextValue: CheckboxContextValue = {
    inputId,
    descriptionId,
    size,
    disabled,
    required,
    registerDescription,
  };

  const rootClass = cx(
    CLASS.root,
    CLASS.rootSize(size),
    currentChecked && !indeterminate && CLASS.rootChecked,
    indeterminate && CLASS.rootIndeterminate,
    disabled && CLASS.rootDisabled,
    invalid && CLASS.rootInvalid,
    required && CLASS.rootRequired,
    hasText && CLASS.rootHasText,
    className,
  );

  // Compose aria-describedby (consumer's + our description if present).
  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  const iconSize = size === "sm" ? 10 : size === "lg" ? 16 : 12;

  return (
    <CheckboxContext.Provider value={contextValue}>
      {/* The outer <label> wraps the native input, so label→input click
          association works via containment alone. We deliberately do NOT
          set htmlFor here — pairing htmlFor with wrapping causes some
          browsers to dispatch two synthetic clicks, netting the toggle
          back to zero. Wrapping alone is spec-compliant and reliable. */}
      <label
        className={rootClass}
        style={style as CSSProperties}
        data-state={indeterminate ? "indeterminate" : currentChecked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
      >
        {/* Native input — the accessibility surface. We always drive it as
            a controlled input (checked={currentChecked}); the consumer's
            controlled/uncontrolled facade is managed above via isControlled.
            aria-checked is only overridden for indeterminate — native input
            reports "true"/"false" automatically otherwise, and setting an
            explicit aria-checked value on a native checkbox is discouraged
            by ARIA spec. */}
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="checkbox"
          className={CLASS.input}
          checked={currentChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...(indeterminate ? { "aria-checked": "mixed" as const } : {})}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
        {/* The visual box — sibling to the native input so the input can
            paint the focus ring around the box via a CSS adjacent selector.
            If a consumer composed <Checkbox.Indicator> explicitly, use it
            verbatim (they own its children). Otherwise render our internal
            indicator with the right glyph for the current state. */}
        {buckets.indicator ?? (
          <CheckboxIndicatorInternal
            iconSize={iconSize}
            indeterminate={indeterminate}
            currentChecked={currentChecked}
          />
        )}

        {hasText && (
          <span className={CLASS.text}>
            {(buckets.label || buckets.fallbackLabel.length > 0) && (
              <span className={CLASS.label}>
                {buckets.label ?? buckets.fallbackLabel}
                {required && (
                  <span className={CLASS.labelRequired} aria-hidden="true">
                    *
                  </span>
                )}
              </span>
            )}
            {buckets.description}
          </span>
        )}
      </label>
    </CheckboxContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, CheckboxProps>> & {
  Indicator:   typeof CheckboxIndicator;
  Label:       typeof CheckboxLabel;
  Description: typeof CheckboxDescription;
};

(Checkbox as unknown as { displayName: string }).displayName = "Checkbox";

/* ══════ INDICATOR ═════════════════════════════════════════════════ */

/**
 * Auto-rendered by the root Checkbox. Consumers rarely compose this
 * explicitly — it's exported so custom check icons or custom positions
 * are possible in advanced compositions.
 */
function CheckboxIndicatorInternal({
  iconSize,
  indeterminate,
  currentChecked,
  className,
  ...rest
}: CheckboxIndicatorProps & {
  iconSize: number;
  indeterminate: boolean;
  currentChecked: boolean;
}) {
  return (
    <span
      className={cx(CLASS.indicator, className)}
      aria-hidden="true"
      {...rest}
    >
      {indeterminate ? (
        <DashGlyph size={iconSize} />
      ) : currentChecked ? (
        <CheckGlyph size={iconSize} />
      ) : null}
    </span>
  );
}

const CheckboxIndicator = forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(function CheckboxIndicator(
  { className, children, ...rest },
  ref,
) {
  // When composed explicitly, we don't have direct access to the parent's
  // checked/indeterminate state via context (kept small on purpose).
  // Consumers who compose Indicator can override children; otherwise the
  // internal one drawn by the root wins.
  return (
    <span
      ref={ref}
      className={cx(CLASS.indicator, className)}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </span>
  );
});
CheckboxIndicator.displayName = "Checkbox.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>(function CheckboxLabel(
  { className, children, ...rest },
  ref,
) {
  // No htmlFor — the outer <label> already wraps the input. This is
  // rendered as a semantic <span> so the click bubbles up to the label.
  return (
    <span ref={ref} className={cx(CLASS.label, className)} {...rest}>
      {children}
    </span>
  );
});
CheckboxLabel.displayName = "Checkbox.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const CheckboxDescription = forwardRef<HTMLSpanElement, CheckboxDescriptionProps>(function CheckboxDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useCheckboxContext("Checkbox.Description");
  const descId = idProp ?? ctx.descriptionId;

  useEffect(() => {
    ctx.registerDescription(true);
    return () => ctx.registerDescription(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={descId}
      className={cx(CLASS.description, className)}
      {...rest}
    >
      {children}
    </span>
  );
});
CheckboxDescription.displayName = "Checkbox.Description";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Checkbox.Indicator   = CheckboxIndicator;
Checkbox.Label       = CheckboxLabel;
Checkbox.Description = CheckboxDescription;
