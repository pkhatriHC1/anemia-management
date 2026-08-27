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
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  ReactElement,
  ReactNode,
} from "react";

import type {
  TextareaCounterProps,
  TextareaDescriptionProps,
  TextareaHelperProps,
  TextareaLabelProps,
  TextareaProps,
  TextareaSize,
  TextareaValidation,
} from "./Textarea.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Textarea, regardless of where they mount.
import "../../tokens/css/variables.css";
import "./Textarea.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  field:           "hc-textarea-field",
  fieldFullWidth: "hc-textarea-field--full-width",
  fieldDisabled:  "hc-textarea-field--disabled",
  labelRow:        "hc-textarea-field__label-row",
  label:           "hc-textarea-field__label",
  description:     "hc-textarea-field__description",
  markerRequired: "hc-textarea-field__marker hc-textarea-field__marker--required",
  markerOptional: "hc-textarea-field__marker hc-textarea-field__marker--optional",
  footer:          "hc-textarea-field__footer",
  helper:          "hc-textarea-field__helper",
  message: (v: TextareaValidation) =>
    `hc-textarea-field__message hc-textarea-field__message--${v}`,
  counter:      "hc-textarea-field__counter",
  counterOver: "hc-textarea-field__counter hc-textarea-field__counter--over",

  frame:            "hc-textarea",
  size:             (s: string) => `hc-textarea--size-${s}`,
  frameDisabled:   "hc-textarea--disabled",
  frameReadonly:   "hc-textarea--readonly",
  frameLoading:    "hc-textarea--loading",
  frameAutoResize: "hc-textarea--auto-resize",
  frameValidation: (v: TextareaValidation) => `hc-textarea--${v}`,
  frameResize:      (r: "none" | "vertical") => `hc-textarea--resize-${r}`,
  control:          "hc-textarea__control",
  spinner:          "hc-textarea__spinner",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

/**
 * Bridge from root Textarea to subcomponents so they read ids + size
 * from a single source of truth. Subcomponents don't own state — they
 * just get contextual info to wire aria correctly.
 */
type TextareaContextValue = {
  inputId: string;
  descriptionId: string;
  helperId: string;
  messageId: string;
  counterId: string;
  size: TextareaSize;
  disabled: boolean;
  activeValidation: TextareaValidation | undefined;
  currentLength: number;
  maxLength: number | undefined;
  showCounter: boolean;
  registerDescription: (present: boolean) => void;
  registerHelper: (present: boolean) => void;
  registerCounter: (present: boolean) => void;
};

const TextareaContext = createContext<TextareaContextValue | null>(null);

function useTextareaContext(source: string): TextareaContextValue {
  const ctx = useContext(TextareaContext);
  if (!ctx) {
    throw new Error(
      `[hc1 Textarea] ${source} must be rendered inside a <Textarea> parent.`,
    );
  }
  return ctx;
}

/* ══════ CHILD SPLIT ═══════════════════════════════════════════════ */

type ChildBuckets = {
  label?: ReactElement;
  description?: ReactElement;
  helper?: ReactElement;
  counter?: ReactElement;
};

/**
 * Walk children once and bucket by subcomponent. First occurrence wins.
 * Unknown children are ignored (Textarea has no inline content slot —
 * pass explicit subcomponents or use the shorthand props).
 */
function splitChildren(children: ReactNode): ChildBuckets {
  const buckets: ChildBuckets = {};
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = (child as ReactElement).type as { displayName?: string };
    switch (type?.displayName) {
      case "Textarea.Label":
        buckets.label ??= child as ReactElement;
        return;
      case "Textarea.Description":
        buckets.description ??= child as ReactElement;
        return;
      case "Textarea.Helper":
        buckets.helper ??= child as ReactElement;
        return;
      case "Textarea.Counter":
        buckets.counter ??= child as ReactElement;
        return;
      default:
        return;
    }
  });
  return buckets;
}

/* ══════ RESOLVE VALIDATION ════════════════════════════════════════ */

/**
 * Derive the active validation state. Message presence takes precedence,
 * ordered error → warning → success. Explicit `validation` fills in when
 * no message is provided. Identical rules to Input.
 */
function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: TextareaValidation | undefined,
): TextareaValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Textarea — the canonical multi-line text input.
 *
 * Renders a native `<textarea>` inside a labelled field wrapper. Same
 * frame + footer philosophy as Input: label above, frame in the middle,
 * helper/message + counter footer beneath. Composition-first: Label,
 * Description, Helper, and Counter subcomponents; shorthand props for
 * the common case.
 *
 * Controlled with `value` + `onChange`. Uncontrolled with `defaultValue`.
 * `autoResize` grows the frame between `minRows` and `maxRows` as the
 * user types.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = "md",
    label,
    description,
    optional = false,
    requiredMarker = "*",
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    loading = false,
    showCounter = false,
    fullWidth = true,
    minRows = 3,
    maxRows = 12,
    autoResize = false,
    resize = "none",
    className,
    id: idProp,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    maxLength,
    onChange,
    style,
    children,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    placeholder,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = `${id}-description`;
  const helperId      = `${id}-helper`;
  const messageId     = `${id}-message`;
  const counterId     = `${id}-counter`;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement, []);

  // Track "current value" locally so the counter + auto-resize work for
  // both controlled and uncontrolled usage without asking the consumer to
  // lift state.
  const isControlled = value !== undefined;
  const initial =
    isControlled
      ? String(value ?? "")
      : String(defaultValue ?? "");
  const [innerValue, setInnerValue] = useState<string>(initial);
  const currentValue = isControlled ? String(value ?? "") : innerValue;
  const currentLength = currentValue.length;

  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInnerValue(event.target.value);
      onChange?.(event);
    },
    [isControlled, onChange],
  );

  // Track presence of composed subcomponents so we know whether to render
  // the shorthand-prop fallbacks.
  const buckets = splitChildren(children);
  const composedLabel       = buckets.label;
  const composedDescription = buckets.description;
  const composedHelper      = buckets.helper;
  const composedCounter     = buckets.counter;

  // Runtime registration lets a subcomponent unmount without leaving a
  // stale aria-describedby id behind. Same pattern Input + Checkbox use.
  const [descRegistered, setDescRegistered]     = useState(!!composedDescription || !!description);
  const [helperRegistered, setHelperRegistered] = useState(!!composedHelper || !!helperText);
  const [counterRegistered, setCounterRegistered] = useState(!!composedCounter || (showCounter && maxLength != null));

  const registerDescription = useCallback((v: boolean) => setDescRegistered(v), []);
  const registerHelper      = useCallback((v: boolean) => setHelperRegistered(v), []);
  const registerCounter     = useCallback((v: boolean) => setCounterRegistered(v), []);

  useEffect(() => {
    const wantsDesc    = !!composedDescription || !!description;
    if (wantsDesc !== descRegistered)    setDescRegistered(wantsDesc);
    const wantsHelper  = !!composedHelper || (!!helperText && !activeValidation);
    if (wantsHelper !== helperRegistered) setHelperRegistered(wantsHelper);
    const wantsCounter = !!composedCounter || (showCounter && maxLength != null);
    if (wantsCounter !== counterRegistered) setCounterRegistered(wantsCounter);
  }, [composedDescription, description, composedHelper, helperText, activeValidation, composedCounter, showCounter, maxLength, descRegistered, helperRegistered, counterRegistered]);

  // Auto-resize: measure scrollHeight, subtract padding, clamp between
  // minRows*lineHeight and maxRows*lineHeight. Runs on every value change
  // + on layout so the initial render + font swap both hit the right size.
  const lineHeightPx = size === "sm" ? 20 : size === "lg" ? 24 : 22;
  const paddingYPx   = size === "lg" ? 12 : 8;
  useLayoutEffect(() => {
    if (!autoResize) return;
    const el = innerRef.current;
    if (!el) return;

    // Reset height so we can measure the natural scrollHeight of the
    // current content. Without this, the previous inline height keeps
    // the measurement locked to whatever it was.
    el.style.height = "auto";
    const scroll = el.scrollHeight;
    const minH = minRows * lineHeightPx + paddingYPx * 2;
    const maxH = maxRows * lineHeightPx + paddingYPx * 2;
    const next = Math.min(Math.max(scroll, minH), maxH);
    el.style.height = `${next}px`;
    // If scrollHeight exceeds maxH, the browser will paint an internal
    // scrollbar automatically since overflow-y: auto.
  }, [currentValue, autoResize, minRows, maxRows, lineHeightPx, paddingYPx]);

  // Compose aria-describedby from description + helper/message + counter
  // in DOM order. Only include ids for slots that are currently rendered.
  const describedIds: string[] = [];
  if (descRegistered)   describedIds.push(descriptionId);
  if (activeValidation) describedIds.push(messageId);
  else if (helperRegistered) describedIds.push(helperId);
  if (counterRegistered) describedIds.push(counterId);
  const ariaDescribedBy =
    [ariaDescribedByProp, ...describedIds].filter(Boolean).join(" ") || undefined;

  const contextValue: TextareaContextValue = {
    inputId: id,
    descriptionId,
    helperId,
    messageId,
    counterId,
    size,
    disabled: !!disabled,
    activeValidation,
    currentLength,
    maxLength: maxLength ?? undefined,
    showCounter: !!showCounter && maxLength != null,
    registerDescription,
    registerHelper,
    registerCounter,
  };

  // Style: expose min/max row heights as inline CSS custom properties so
  // the frame's minHeight can be driven by them without JS.
  const frameStyle: React.CSSProperties = {
    ...style,
    "--hc-textarea-min-rows": String(minRows),
    "--hc-textarea-max-rows": String(maxRows),
  } as React.CSSProperties;

  const messageNode =
    (errorMessage as ReactNode) ??
    (warningMessage as ReactNode) ??
    (successMessage as ReactNode) ??
    null;

  const showFooterCounter = showCounter && maxLength != null && !composedCounter;
  const showFooterHelper  = !!helperText && !activeValidation && !composedHelper;
  const showFooterMessage = !!activeValidation && !!messageNode;
  const showFooter =
    showFooterHelper || showFooterMessage || showFooterCounter || !!composedHelper || !!composedCounter;

  return (
    <TextareaContext.Provider value={contextValue}>
      <div
        className={cx(
          CLASS.field,
          fullWidth && CLASS.fieldFullWidth,
          disabled && CLASS.fieldDisabled,
          className,
        )}
      >
        {/* Label row — subcomponent wins, else render from `label` prop. */}
        {(composedLabel || label) && (
          <div className={CLASS.labelRow}>
            {composedLabel ?? (
              <label htmlFor={id} className={CLASS.label}>
                {label}
                {required && (
                  <span className={CLASS.markerRequired} aria-hidden="true">
                    {requiredMarker}
                  </span>
                )}
              </label>
            )}
            {!required && optional && (
              <span className={CLASS.markerOptional}>Optional</span>
            )}
          </div>
        )}

        {/* Description — subcomponent wins, else render from `description`. */}
        {composedDescription ?? (description && (
          <span id={descriptionId} className={CLASS.description}>
            {description}
          </span>
        ))}

        {/* Frame ─ the visual textarea box. */}
        <div
          className={cx(
            CLASS.frame,
            CLASS.size(size),
            disabled && CLASS.frameDisabled,
            readOnly && !disabled && CLASS.frameReadonly,
            loading && CLASS.frameLoading,
            autoResize && CLASS.frameAutoResize,
            activeValidation && CLASS.frameValidation(activeValidation),
            CLASS.frameResize(resize),
          )}
          style={frameStyle}
          onClick={() => {
            if (!disabled && !readOnly) innerRef.current?.focus();
          }}
        >
          <textarea
            {...rest}
            ref={innerRef}
            id={id}
            className={CLASS.control}
            value={isControlled ? String(value ?? "") : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            rows={minRows}
            onChange={handleChange}
            aria-invalid={ariaInvalidProp ?? (isError || undefined)}
            aria-describedby={ariaDescribedBy}
            aria-busy={loading || undefined}
          />

          {loading && <span className={CLASS.spinner} aria-hidden="true" />}
        </div>

        {/* Footer — helper OR message on the left, counter on the right. */}
        {showFooter && (
          <div className={CLASS.footer}>
            {showFooterMessage ? (
              <span
                id={messageId}
                className={CLASS.message(activeValidation!)}
                role={activeValidation === "error" ? "alert" : undefined}
              >
                {messageNode}
              </span>
            ) : showFooterHelper ? (
              <span id={helperId} className={CLASS.helper}>
                {helperText}
              </span>
            ) : composedHelper ? (
              composedHelper
            ) : (
              <span />
            )}

            {composedCounter ?? (showFooterCounter && (
              <span
                id={counterId}
                className={
                  maxLength != null && currentLength > maxLength
                    ? CLASS.counterOver
                    : CLASS.counter
                }
              >
                {currentLength} / {maxLength}
              </span>
            ))}
          </div>
        )}
      </div>
    </TextareaContext.Provider>
  );
}) as ReturnType<typeof forwardRef<HTMLTextAreaElement, TextareaProps>> & {
  Label:       typeof TextareaLabel;
  Description: typeof TextareaDescription;
  Helper:      typeof TextareaHelper;
  Counter:     typeof TextareaCounter;
};

(Textarea as unknown as { displayName: string }).displayName = "Textarea";

/* ══════ LABEL ═════════════════════════════════════════════════════ */

const TextareaLabel = forwardRef<HTMLLabelElement, TextareaLabelProps>(function TextareaLabel(
  { className, children, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Label");
  return (
    <label
      ref={ref}
      htmlFor={ctx.inputId}
      className={cx(CLASS.label, className)}
      {...rest}
    >
      {children}
    </label>
  );
});
TextareaLabel.displayName = "Textarea.Label";

/* ══════ DESCRIPTION ═══════════════════════════════════════════════ */

const TextareaDescription = forwardRef<HTMLSpanElement, TextareaDescriptionProps>(function TextareaDescription(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Description");
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
TextareaDescription.displayName = "Textarea.Description";

/* ══════ HELPER ════════════════════════════════════════════════════ */

const TextareaHelper = forwardRef<HTMLSpanElement, TextareaHelperProps>(function TextareaHelper(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Helper");
  const helperId = idProp ?? ctx.helperId;

  useEffect(() => {
    ctx.registerHelper(true);
    return () => ctx.registerHelper(false);
  }, [ctx]);

  return (
    <span
      ref={ref}
      id={helperId}
      className={cx(CLASS.helper, className)}
      {...rest}
    >
      {children}
    </span>
  );
});
TextareaHelper.displayName = "Textarea.Helper";

/* ══════ COUNTER ═══════════════════════════════════════════════════ */

const TextareaCounter = forwardRef<HTMLSpanElement, TextareaCounterProps>(function TextareaCounter(
  { className, children, id: idProp, ...rest },
  ref,
) {
  const ctx = useTextareaContext("Textarea.Counter");
  const counterId = idProp ?? ctx.counterId;

  useEffect(() => {
    ctx.registerCounter(true);
    return () => ctx.registerCounter(false);
  }, [ctx]);

  const over = ctx.maxLength != null && ctx.currentLength > ctx.maxLength;
  const text =
    ctx.maxLength != null
      ? `${ctx.currentLength} / ${ctx.maxLength}`
      : `${ctx.currentLength}`;

  return (
    <span
      ref={ref}
      id={counterId}
      className={cx(over ? CLASS.counterOver : CLASS.counter, className)}
      {...rest}
    >
      {children ?? text}
    </span>
  );
});
TextareaCounter.displayName = "Textarea.Counter";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

Textarea.Label       = TextareaLabel;
Textarea.Description = TextareaDescription;
Textarea.Helper      = TextareaHelper;
Textarea.Counter     = TextareaCounter;
