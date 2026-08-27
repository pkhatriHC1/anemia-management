import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, MouseEvent } from "react";
import type { InputProps, InputValidation } from "./Input.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Input, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Input.css";

const CLASS = {
  field:              "hc-input-field",
  fieldFullWidth:     "hc-input-field--full-width",
  fieldDisabled:      "hc-input-field--disabled",
  labelRow:           "hc-input-field__label-row",
  label:              "hc-input-field__label",
  markerRequired:     "hc-input-field__marker hc-input-field__marker--required",
  markerOptional:     "hc-input-field__marker hc-input-field__marker--optional",
  footer:             "hc-input-field__footer",
  helper:             "hc-input-field__helper",
  message:            (v: InputValidation) =>
    `hc-input-field__message hc-input-field__message--${v}`,
  counter:            "hc-input-field__counter",
  counterOver:        "hc-input-field__counter hc-input-field__counter--over",

  frame:              "hc-input",
  size:               (s: string) => `hc-input--size-${s}`,
  frameDisabled:      "hc-input--disabled",
  frameReadonly:      "hc-input--readonly",
  frameLoading:       "hc-input--loading",
  frameValidation:    (v: InputValidation) => `hc-input--${v}`,
  control:            "hc-input__control",
  iconLeading:        "hc-input__icon hc-input__icon--leading",
  iconTrailing:       "hc-input__icon hc-input__icon--trailing",
  clear:              "hc-input__clear",
  spinner:            "hc-input__spinner",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Derive the active validation state. Message presence takes precedence,
 * ordered error → warning → success. Explicit `validation` fills in when
 * no message is provided (bulk-edit / summary surfaces).
 */
function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: InputValidation | undefined,
): InputValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/**
 * HC1 Input — the canonical text input.
 *
 * This is the reference form control. Textarea, Select, Combobox, Date
 * Picker, Number Input, and Password Input should all inherit this
 * design language — same sizes, same focus ring, same validation model,
 * same helper/counter footer.
 *
 * See docs/components/InputDoc for the full spec.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    size = "md",
    label,
    optional = false,
    requiredMarker = "*",
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    leadingIcon,
    trailingIcon,
    clearable = false,
    onClear,
    loading = false,
    showCounter = false,
    fullWidth = true,
    className,
    id: idProp,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    maxLength,
    onChange,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId  = `${id}-helper`;
  const messageId = `${id}-message`;
  const counterId = `${id}-counter`;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  // Track "has value" locally so the clear button shows for both controlled
  // and uncontrolled usage without asking the consumer to lift state.
  const isControlled = value !== undefined;
  const initial =
    isControlled
      ? String(value ?? "")
      : String(defaultValue ?? "");
  const [innerValue, setInnerValue] = useState<string>(initial);
  const currentValue = isControlled ? String(value ?? "") : innerValue;
  const hasValue = currentValue.length > 0;

  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerValue(event.target.value);
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const el = innerRef.current;
      if (!el) return;

      // Reset the DOM value + fire a native input event so uncontrolled
      // forms and any bound listeners observe the change.
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value",
      )?.set;
      nativeSetter?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));

      if (!isControlled) setInnerValue("");
      onClear?.(el);

      // Return focus to the input so keyboard flow is preserved.
      el.focus();
    },
    [isControlled, onClear],
  );

  // Compose aria-describedby from helper / message / counter as visible.
  const describedIds: string[] = [];
  if (helperText && !activeValidation) describedIds.push(helperId);
  if (activeValidation)                describedIds.push(messageId);
  if (showCounter && maxLength != null) describedIds.push(counterId);
  const ariaDescribedBy = [ariaDescribedByProp, ...describedIds]
    .filter(Boolean)
    .join(" ") || undefined;

  const showClear =
    clearable && hasValue && !disabled && !readOnly && !loading;

  const showFooter =
    Boolean(helperText || activeValidation || (showCounter && maxLength != null));

  const message =
    (errorMessage as unknown) ||
    (warningMessage as unknown) ||
    (successMessage as unknown) ||
    null;

  const counter =
    showCounter && maxLength != null ? `${currentValue.length} / ${maxLength}` : null;
  const counterOver =
    showCounter && maxLength != null ? currentValue.length > maxLength : false;

  return (
    <div
      className={cx(
        CLASS.field,
        fullWidth && CLASS.fieldFullWidth,
        disabled && CLASS.fieldDisabled,
        className,
      )}
    >
      {label && (
        <div className={CLASS.labelRow}>
          <label htmlFor={id} className={CLASS.label}>
            {label}
            {required && (
              <span className={CLASS.markerRequired} aria-hidden="true">
                {requiredMarker}
              </span>
            )}
          </label>
          {!required && optional && (
            <span className={CLASS.markerOptional}>Optional</span>
          )}
        </div>
      )}

      <div
        className={cx(
          CLASS.frame,
          CLASS.size(size),
          disabled && CLASS.frameDisabled,
          readOnly && !disabled && CLASS.frameReadonly,
          loading && CLASS.frameLoading,
          activeValidation && CLASS.frameValidation(activeValidation),
        )}
        onClick={() => {
          // Clicking the frame around the control should focus the control,
          // mirroring how native <label> around <input> behaves.
          if (!disabled && !readOnly) innerRef.current?.focus();
        }}
      >
        {leadingIcon && (
          <span className={CLASS.iconLeading} aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        <input
          {...rest}
          ref={innerRef}
          id={id}
          type={type}
          className={CLASS.control}
          value={isControlled ? String(value ?? "") : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={ariaInvalidProp ?? (isError || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-busy={loading || undefined}
        />

        {showClear && (
          <button
            type="button"
            className={CLASS.clear}
            aria-label="Clear input"
            onClick={handleClear}
            tabIndex={-1}
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {loading ? (
          <span className={CLASS.spinner} aria-hidden="true" />
        ) : (
          trailingIcon && !showClear && (
            <span className={CLASS.iconTrailing} aria-hidden="true">
              {trailingIcon}
            </span>
          )
        )}
      </div>

      {showFooter && (
        <div className={CLASS.footer}>
          {activeValidation && message ? (
            <span
              id={messageId}
              className={CLASS.message(activeValidation)}
              role={activeValidation === "error" ? "alert" : undefined}
            >
              {message as React.ReactNode}
            </span>
          ) : helperText ? (
            <span id={helperId} className={CLASS.helper}>
              {helperText}
            </span>
          ) : (
            <span />
          )}

          {counter != null && (
            <span
              id={counterId}
              className={counterOver ? CLASS.counterOver : CLASS.counter}
            >
              {counter}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";
