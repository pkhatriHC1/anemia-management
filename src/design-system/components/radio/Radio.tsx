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
  useMemo,
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
  RadioDescriptionProps,
  RadioGroupOrientation,
  RadioGroupProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioProps,
  RadioSize,
} from "./Radio.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Radio, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Radio.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:              "hc-radio",
  rootSize:          (s: RadioSize) => `hc-radio--size-${s}`,
  rootChecked:       "hc-radio--checked",
  rootDisabled:      "hc-radio--disabled",
  rootInvalid:       "hc-radio--invalid",
  rootRequired:      "hc-radio--required",
  rootHasText:       "hc-radio--has-text",

  input:             "hc-radio__input",
  indicator:         "hc-radio__indicator",
  dot:               "hc-radio__dot",

  text:              "hc-radio__text",
  label:             "hc-radio__label",
  labelRequired:     "hc-radio__label-required",
  description:       "hc-radio__description",

  group:             "hc-radio-group",
  groupOrientation:  (o: RadioGroupOrientation) => `hc-radio-group--${o}`,
  groupDisabled:     "hc-radio-group--disabled",
  groupInvalid:      "hc-radio-group--invalid",
  groupHeader:       "hc-radio-group__header",
  groupLabel:        "hc-radio-group__label",
  groupLabelRequired:"hc-radio-group__label-required",
  groupDescription:  "hc-radio-group__description",
  groupItems:        "hc-radio-group__items",
  groupError:        "hc-radio-group__error",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ GROUP CONTEXT ═════════════════════════════════════════════ */

/**
 * Bridge from RadioGroup to each descendant Radio. Radios read shared
 * state (name/value/size/disabled/invalid/required) and register their
 * own `value` so the group can determine which one owns the roving
 * `tabIndex=0`.
 */
type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  onValueChange: (next: string) => void;
  size: RadioSize | undefined;
  disabled: boolean | undefined;
  invalid: boolean | undefined;
  required: boolean | undefined;
  /** Registers this Radio's value with the group. Returns unregister fn. */
  register: (value: string) => () => void;
  /**
   * The value that should own `tabIndex=0`. Equals `value` when the group
   * has a selection; otherwise the first registered radio's value.
   */
  rovingValue: string | undefined;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ══════ CHILD SPLIT (Radio) ═══════════════════════════════════════ */

type ChildBuckets = {
  indicator?: ReactElement;
  label?: ReactElement;
  description?: ReactElement;
  /** Fallback: non-subcomponent children treated as inline label text. */
  fallbackLabel: ReactNode[];
};

function splitRadioChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = { fallbackLabel: [] };
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) buckets.fallbackLabel.push(child);
      return;
    }
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Radio.Indicator":
        buckets.indicator ??= child as ReactElement;
        return;
      case "Radio.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Radio.Description":
        buckets.description ??= child as ReactElement;
        return;
      default:
        buckets.fallbackLabel.push(child);
    }
  });
  return buckets;
}

/* ══════ RADIO ROOT ════════════════════════════════════════════════ */

/**
 * HC1 Radio — a single radio button.
 *
 * Same DOM shape as Checkbox: `<label>` wrapping a native
 * `<input type="radio">` + a sibling visual indicator (circular) + an
 * optional text stack (Label + Description). Every visual state and
 * token comes from the Checkbox palette so mixed forms read as one
 * system.
 *
 * Inside a `<RadioGroup>`, all shared state (name, checked, size,
 * disabled, invalid, required, tabIndex) is derived from group context.
 * Standalone usage is supported too: pass `name` + `checked`/`onCheckedChange`
 * (controlled) or `defaultChecked` (uncontrolled) directly.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    size: sizeProp,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    onChange,
    invalid: invalidProp,
    disabled: disabledProp,
    required: requiredProp,
    id: idProp,
    name: nameProp,
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
  const group = useContext(RadioGroupContext);
  const inGroup = !!group;

  // Merge props with group context — explicit props win over group.
  const size     = sizeProp     ?? group?.size     ?? "md";
  const disabled = disabledProp ?? group?.disabled ?? false;
  const invalid  = invalidProp  ?? group?.invalid  ?? false;
  const required = requiredProp ?? group?.required ?? false;
  const name     = nameProp     ?? group?.name;

  // Selection state:
  //   - In group: derived from group.value === this.value
  //   - Standalone controlled: from `checked` prop
  //   - Standalone uncontrolled: from local state seeded by defaultChecked
  const isControlled = checkedProp !== undefined;
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked);
  const currentChecked =
    inGroup && value !== undefined ? group!.value === value
    : isControlled                  ? !!checkedProp
    :                                 innerChecked;

  // Register this radio's value with the group so it can pick the
  // roving-tabbable radio.
  useEffect(() => {
    if (!inGroup || value === undefined) return;
    return group!.register(value);
  }, [inGroup, group, value]);

  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // Native radio change events fire only when the radio becomes
      // checked (browsers don't fire change on the deselected sibling).
      if (inGroup && value !== undefined) {
        group!.onValueChange(value);
      } else if (!isControlled) {
        setInnerChecked(event.target.checked);
      }
      onCheckedChange?.(event.target.checked, event);
      onChange?.(event);
    },
    [inGroup, group, value, isControlled, onCheckedChange, onChange],
  );

  const buckets = splitRadioChildren(children);
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

  const contextValue: RadioSubcomponentContextValue = {
    inputId,
    descriptionId,
    size,
    registerDescription,
  };

  const rootClass = cx(
    CLASS.root,
    CLASS.rootSize(size),
    currentChecked && CLASS.rootChecked,
    disabled        && CLASS.rootDisabled,
    invalid         && CLASS.rootInvalid,
    required        && CLASS.rootRequired,
    hasText         && CLASS.rootHasText,
    className,
  );

  // Compose aria-describedby (consumer's + our description if present).
  const describedIds: string[] = [];
  if (ariaDescribedByProp) describedIds.push(ariaDescribedByProp);
  if (hasDescriptionRegistered) describedIds.push(descriptionId);
  const ariaDescribedBy = describedIds.length > 0 ? describedIds.join(" ") : undefined;

  // Roving tabindex: only the currently-selected radio (or the first if
  // none is selected) is tabbable within a RadioGroup.
  const tabIndex = inGroup
    ? (value !== undefined && group!.rovingValue === value ? 0 : -1)
    : rest.tabIndex;

  return (
    <RadioSubcomponentContext.Provider value={contextValue}>
      {/* The outer <label> wraps the native input, so label→input click
          association works via containment alone. We deliberately do NOT
          set htmlFor here — pairing htmlFor with wrapping causes some
          browsers to dispatch two synthetic clicks, netting the toggle
          back to zero. Wrapping alone is spec-compliant and reliable.
          (Same fix as Checkbox — see PR #18 gotcha.) */}
      <label
        className={rootClass}
        style={style as CSSProperties}
        data-state={currentChecked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
      >
        {/* Native input — the accessibility surface. Same containment
            pattern Checkbox uses: absolutely positioned inside the label,
            opacity 0, sized to the visible indicator so pointer + focus
            land on the real element. Always internally controlled so
            React never bails to the "uncontrolled" path unpredictably
            (Checkbox PR #18 gotcha — same fix here). */}
        <input
          {...rest}
          ref={innerRef}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          className={CLASS.input}
          checked={currentChecked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          tabIndex={tabIndex}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
        {/* Visible indicator — sibling to the native input so the input can
            paint the focus ring on it via a CSS adjacent selector. If a
            consumer composed <Radio.Indicator> explicitly, use it verbatim
            (they own its children). Otherwise render our internal one. */}
        {buckets.indicator ?? <RadioIndicatorInternal checked={currentChecked} />}

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
    </RadioSubcomponentContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLInputElement, RadioProps>> & {
  Indicator:   typeof RadioIndicator;
  Label:       typeof RadioLabel;
  Description: typeof RadioDescription;
};

(Radio as unknown as { displayName: string }).displayName = "Radio";

/* ══════ SUBCOMPONENT CONTEXT (Description ↔ root) ══════════════════ */

type RadioSubcomponentContextValue = {
  inputId: string;
  descriptionId: string;
  size: RadioSize;
  registerDescription: (present: boolean) => void;
};

const RadioSubcomponentContext = createContext<RadioSubcomponentContextValue | null>(null);

function useRadioSubcomponentContext(source: string): RadioSubcomponentContextValue {
  const ctx = useContext(RadioSubcomponentContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Radio] ${source} must be rendered inside a <Radio> parent.`,
    );
  }
  return ctx;
}

/* ══════ INDICATOR ═════════════════════════════════════════════════ */

function RadioIndicatorInternal({ checked }: { checked: boolean }) {
  return (
    <span className={CLASS.indicator} aria-hidden="true">
      {checked && <span className={CLASS.dot} />}
    </span>
  );
}

const RadioIndicator = forwardRef<HTMLSpanElement, RadioIndicatorProps>(function RadioIndicator(
  { className, children, ...rest },
  ref,
) {
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
RadioIndicator.displayName = "Radio.Indicator";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const RadioLabel = forwardRef<HTMLSpanElement, RadioLabelProps>(function RadioLabel(
  { className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(CLASS.label, className)} {...rest}>
      {children}
    </span>
  );
});
RadioLabel.displayName = "Radio.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const RadioDescription = forwardRef<HTMLSpanElement, RadioDescriptionProps>(function RadioDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useRadioSubcomponentContext("Radio.Description");
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
RadioDescription.displayName = "Radio.Description";

/* ══════ RADIO GROUP ═══════════════════════════════════════════════ */

/**
 * HC1 RadioGroup — groups Radio buttons under a shared name + selection.
 *
 * Provides:
 *   - shared `name` (auto via useId)
 *   - controlled `value` + `onValueChange` (or uncontrolled `defaultValue`)
 *   - inheritable `size`, `disabled`, `invalid`, `required`
 *   - `orientation` (vertical / horizontal)
 *   - roving `tabIndex` — the checked radio is tabbable; if nothing is
 *     checked, the first registered radio is tabbable so keyboard users
 *     can tab INTO the group
 *   - optional `label` + `description` + `errorMessage` slots
 *
 * Arrow-key navigation between radios is handled NATIVELY by the browser
 * because all radios share the same `name`. RadioGroup does not
 * reimplement it — it only wires up focus + tabIndex so the native
 * behavior works.
 */
export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  name: nameProp,
  orientation = "vertical",
  size,
  disabled,
  invalid,
  required,
  label,
  description,
  errorMessage,
  className,
  children,
  "aria-labelledby": ariaLabelledByProp,
  "aria-describedby": ariaDescribedByProp,
  ...rest
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue);
  const currentValue = isControlled ? controlledValue : innerValue;

  const generatedName    = useId();
  const generatedLabelId = useId();
  const generatedDescId  = useId();
  const generatedErrorId = useId();
  const name = nameProp ?? generatedName;

  const labelId = label       ? generatedLabelId : undefined;
  const descId  = description ? generatedDescId  : undefined;
  const errorId = errorMessage ? generatedErrorId : undefined;

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  // Track registered radio values in insertion order so we can pick the
  // roving-tabbable one (the checked value, or first if none checked).
  const [registered, setRegistered] = useState<string[]>([]);
  const register = useCallback((v: string) => {
    setRegistered((r) => (r.includes(v) ? r : [...r, v]));
    return () => {
      setRegistered((r) => r.filter((x) => x !== v));
    };
  }, []);

  const rovingValue =
    currentValue !== undefined && registered.includes(currentValue)
      ? currentValue
      : registered[0];

  const groupInvalid = invalid || !!errorMessage;

  const contextValue: RadioGroupContextValue = useMemo(
    () => ({
      name,
      value: currentValue,
      onValueChange: handleValueChange,
      size,
      disabled,
      invalid: groupInvalid,
      required,
      register,
      rovingValue,
    }),
    [name, currentValue, handleValueChange, size, disabled, groupInvalid, required, register, rovingValue],
  );

  const rootClass = cx(
    CLASS.group,
    CLASS.groupOrientation(orientation),
    disabled     && CLASS.groupDisabled,
    groupInvalid && CLASS.groupInvalid,
    className,
  );

  const composedLabelledBy = [ariaLabelledByProp, labelId].filter(Boolean).join(" ") || undefined;
  const composedDescribedBy = [ariaDescribedByProp, descId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      {...rest}
      role="radiogroup"
      aria-orientation={orientation}
      aria-labelledby={composedLabelledBy}
      aria-describedby={composedDescribedBy}
      aria-required={required || undefined}
      aria-invalid={groupInvalid || undefined}
      aria-disabled={disabled || undefined}
      className={rootClass}
    >
      {(label || description) && (
        <div className={CLASS.groupHeader}>
          {label && (
            <div id={labelId} className={CLASS.groupLabel}>
              {label}
              {required && (
                <span className={CLASS.groupLabelRequired} aria-hidden="true">
                  *
                </span>
              )}
            </div>
          )}
          {description && (
            <div id={descId} className={CLASS.groupDescription}>
              {description}
            </div>
          )}
        </div>
      )}
      <RadioGroupContext.Provider value={contextValue}>
        <div className={CLASS.groupItems}>{children}</div>
      </RadioGroupContext.Provider>
      {errorMessage && (
        <div id={errorId} className={CLASS.groupError} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
RadioGroup.displayName = "RadioGroup";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Radio.Indicator   = RadioIndicator;
Radio.Label       = RadioLabel;
Radio.Description = RadioDescription;
