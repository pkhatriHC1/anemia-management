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
  SwitchDescriptionProps,
  SwitchIndicatorProps,
  SwitchLabelProps,
  SwitchProps,
  SwitchSize,
} from "./Switch.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Switch, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Switch.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:           "hc-switch",
  rootSize:       (s: SwitchSize) => `hc-switch--size-${s}`,
  rootChecked:    "hc-switch--checked",
  rootDisabled:   "hc-switch--disabled",
  rootInvalid:    "hc-switch--invalid",
  rootRequired:   "hc-switch--required",
  rootHasText:    "hc-switch--has-text",
  rootLoading:    "hc-switch--loading",

  input:          "hc-switch__input",
  indicator:      "hc-switch__indicator",
  track:          "hc-switch__track",
  thumb:          "hc-switch__thumb",
  spinner:        "hc-switch__spinner",

  text:           "hc-switch__text",
  label:          "hc-switch__label",
  labelRequired:  "hc-switch__label-required",
  description:    "hc-switch__description",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

/**
 * Bridge from root Switch to its subcomponents. Subcomponents don't own
 * state — they read presentational info (id, size, disabled) from context
 * so ids wire up automatically. Same shape as Checkbox / Radio.
 */
type SwitchContextValue = {
  inputId: string;
  descriptionId: string;
  size: SwitchSize;
  disabled: boolean;
  required: boolean;
  registerDescription: (present: boolean) => void;
};

const SwitchContext = createContext<SwitchContextValue | null>(null);

function useSwitchContext(source: string): SwitchContextValue {
  const ctx = useContext(SwitchContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Switch] ${source} must be rendered inside a <Switch> parent.`,
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

function splitChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = { fallbackLabel: [] };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) buckets.fallbackLabel.push(child);
      return;
    }
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Switch.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Switch.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Switch.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ SPINNER GLYPH ═════════════════════════════════════════════ */

function Spinner({ size }: { size: number }) {
  return (
    <svg
      className={CLASS.spinner}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path
        d="M14 8A6 6 0 0 0 8 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Switch — the canonical binary toggle control.
 *
 * Renders a real native `<input type="checkbox" role="switch">` inside a
 * `<label>` wrapper. The visual pill track (`Switch.Indicator`) is
 * auto-rendered at the start of the row unless composed explicitly.
 * Label + Description are opt-in subcomponents; plain text children work
 * too.
 *
 * Controlled with `checked` + `onCheckedChange`. Uncontrolled with
 * `defaultChecked`. `loading` freezes the switch and paints a spinner
 * in the thumb — useful while an async save round-trips.
 *
 * The DOM shape and internal-controlled input pattern are identical to
 * Checkbox / Radio. Only the visual metaphor changes.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = "md",
    checked,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    invalid = false,
    disabled = false,
    required = false,
    loading = false,
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

  // Compose forwarded ref with our own.
  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  // Track checked locally so uncontrolled usage works without the consumer
  // lifting state. In controlled mode the prop is the source of truth.
  const isControlled = checked !== undefined;
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked);
  const currentChecked = isControlled ? !!checked : innerChecked;

  const effectiveDisabled = disabled || loading;

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
  useEffect(() => {
    if (hasDescription !== hasDescriptionRegistered) {
      setHasDescriptionRegistered(hasDescription);
    }
  }, [hasDescription, hasDescriptionRegistered]);

  const contextValue: SwitchContextValue = {
    inputId,
    descriptionId,
    size,
    disabled: effectiveDisabled,
    required,
    registerDescription,
  };

  const rootClass = cx(
    CLASS.root,
    CLASS.rootSize(size),
    currentChecked  && CLASS.rootChecked,
    effectiveDisabled && CLASS.rootDisabled,
    invalid           && CLASS.rootInvalid,
    required          && CLASS.rootRequired,
    hasText           && CLASS.rootHasText,
    loading           && CLASS.rootLoading,
    className,
  );

  // Compose aria-describedby (consumer's + our description if present).
  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  // Spinner sits inside the thumb — sized to the thumb per size step.
  const spinnerSize = size === "sm" ? 8 : size === "lg" ? 12 : 10;

  return (
    <SwitchContext.Provider value={contextValue}>
      {/* The outer <label> wraps the native input, so label→input click
          association works via containment alone. htmlFor is deliberately
          omitted — pairing htmlFor with wrapping causes some browsers to
          dispatch two synthetic clicks, netting the toggle back to zero.
          (Same fix as Checkbox PR #18 gotcha.) */}
      <label
        className={rootClass}
        style={style as CSSProperties}
        data-state={currentChecked ? "checked" : "unchecked"}
        data-disabled={effectiveDisabled || undefined}
        data-invalid={invalid || undefined}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
      >
        {/* Native input — the accessibility surface. role="switch" tells
            assistive tech this is a two-state toggle, not a tri-state
            checkbox. aria-checked reflects native input.checked (no
            explicit override needed for on/off; ARIA discourages
            overriding native state). Always internally controlled so
            React never bails to the uncontrolled path unpredictably
            (Checkbox PR #18 gotcha — same fix here). */}
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="checkbox"
          role="switch"
          className={CLASS.input}
          checked={currentChecked}
          disabled={effectiveDisabled}
          required={required}
          onChange={handleChange}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
        {/* Visible indicator — sibling to the native input so the input
            can paint the focus ring on it via a CSS adjacent selector.
            If a consumer composed <Switch.Indicator> explicitly, use it
            verbatim (they own its children). Otherwise render our own
            internal track + thumb. */}
        {buckets.indicator ?? (
          <SwitchIndicatorInternal loading={loading} spinnerSize={spinnerSize} />
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
    </SwitchContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, SwitchProps>> & {
  Indicator:   typeof SwitchIndicator;
  Label:       typeof SwitchLabel;
  Description: typeof SwitchDescription;
};

(Switch as unknown as { displayName: string }).displayName = "Switch";

/* ══════ INDICATOR ═════════════════════════════════════════════════ */

/**
 * Internal indicator: pill track + circular thumb. The `off` and `on`
 * positions are CSS-driven (translateX on .hc-switch--checked). When
 * `loading`, a small spinner paints inside the thumb.
 */
function SwitchIndicatorInternal({ loading, spinnerSize }: { loading: boolean; spinnerSize: number }) {
  return (
    <span className={cx(CLASS.indicator, CLASS.track)} aria-hidden="true">
      <span className={CLASS.thumb}>
        {loading && <Spinner size={spinnerSize} />}
      </span>
    </span>
  );
}

const SwitchIndicator = forwardRef<HTMLSpanElement, SwitchIndicatorProps>(function SwitchIndicator(
  { className, children, ...rest },
  ref,
) {
  // When composed explicitly, the consumer controls the children — but
  // classes remain so the CSS state cascade still applies.
  return (
    <span
      ref={ref}
      className={cx(CLASS.indicator, CLASS.track, className)}
      aria-hidden="true"
      {...rest}
    >
      {children ?? <span className={CLASS.thumb} />}
    </span>
  );
});
SwitchIndicator.displayName = "Switch.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const SwitchLabel = forwardRef<HTMLSpanElement, SwitchLabelProps>(function SwitchLabel(
  { className, children, ...rest },
  ref,
) {
  // No htmlFor — the outer <label> already wraps the input. Rendered as a
  // semantic <span> so the click bubbles up to the label. Same shape as
  // Checkbox / Radio labels.
  return (
    <span ref={ref} className={cx(CLASS.label, className)} {...rest}>
      {children}
    </span>
  );
});
SwitchLabel.displayName = "Switch.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const SwitchDescription = forwardRef<HTMLSpanElement, SwitchDescriptionProps>(function SwitchDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useSwitchContext("Switch.Description");
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
SwitchDescription.displayName = "Switch.Description";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Switch.Indicator   = SwitchIndicator;
Switch.Label       = SwitchLabel;
Switch.Description = SwitchDescription;
