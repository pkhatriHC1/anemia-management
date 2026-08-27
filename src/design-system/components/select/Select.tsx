import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type {
  SelectOption,
  SelectProps,
  SelectSize,
  SelectValidation,
} from "./Select.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Select, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Select.css";

/* ══════ CLASS NAMES ════════════════════════════════════════════════ */

const CLASS = {
  field:           "hc-select-field",
  fieldFullWidth:  "hc-select-field--full-width",
  fieldDisabled:   "hc-select-field--disabled",
  labelRow:        "hc-select-field__label-row",
  label:           "hc-select-field__label",
  markerRequired:  "hc-select-field__marker hc-select-field__marker--required",
  markerOptional:  "hc-select-field__marker hc-select-field__marker--optional",
  footer:          "hc-select-field__footer",
  helper:          "hc-select-field__helper",
  message:         (v: SelectValidation) =>
    `hc-select-field__message hc-select-field__message--${v}`,

  anchor:          "hc-select-anchor",

  trigger:         "hc-select-trigger",
  triggerSize:     (s: SelectSize) => `hc-select-trigger--size-${s}`,
  triggerDisabled: "hc-select-trigger--disabled",
  triggerLoading:  "hc-select-trigger--loading",
  triggerValidation: (v: SelectValidation) => `hc-select-trigger--${v}`,
  triggerLeading:  "hc-select-trigger__leading",
  triggerValue:    "hc-select-trigger__value",
  triggerPlaceholder: "hc-select-trigger__placeholder",
  triggerChevron:  "hc-select-trigger__chevron",
  triggerSpinner:  "hc-select-trigger__spinner",

  popup:           "hc-select-popup",
  popupAbove:      "hc-select-popup--above",
  listbox:         "hc-select-listbox",
  group:           "hc-select-group",
  groupHeader:     "hc-select-group__header",

  option:          "hc-select-option",
  optionSize:      (s: SelectSize) => `hc-select-option--size-${s}`,
  optionWithDesc:  "hc-select-option--with-description",
  optionIcon:      "hc-select-option__icon",
  optionBody:      "hc-select-option__body",
  optionLabel:     "hc-select-option__label",
  optionDesc:      "hc-select-option__description",
  optionCheck:     "hc-select-option__check",

  empty:           "hc-select-empty",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ ICONS ═════════════════════════════════════════════════════ */

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════ HELPERS ═══════════════════════════════════════════════════ */

function resolveValidation(
  errorMessage: unknown,
  warningMessage: unknown,
  successMessage: unknown,
  validation: SelectValidation | undefined,
): SelectValidation | undefined {
  if (errorMessage)   return "error";
  if (warningMessage) return "warning";
  if (successMessage) return "success";
  return validation;
}

/** Group options in first-appearance order, preserving intra-group order. */
function groupOptions(options: SelectOption[]): Array<{ name: string; items: SelectOption[] }> {
  const groups: Array<{ name: string; items: SelectOption[] }> = [];
  const byName = new Map<string, SelectOption[]>();
  for (const opt of options) {
    const name = opt.group ?? "";
    if (!byName.has(name)) {
      const items: SelectOption[] = [];
      byName.set(name, items);
      groups.push({ name, items });
    }
    byName.get(name)!.push(opt);
  }
  return groups;
}

/** Enabled options in render order — the list keyboard nav walks. */
function enabledFlat(options: SelectOption[]): SelectOption[] {
  return options.filter(o => !o.disabled);
}

function nextEnabledIndex(
  options: SelectOption[],
  from: number,
  direction: 1 | -1,
): number {
  const len = options.length;
  if (len === 0) return -1;
  let i = from;
  for (let step = 0; step < len; step++) {
    i = (i + direction + len) % len;
    if (!options[i].disabled) return i;
  }
  return -1;
}

/* ══════ COMPONENT ═════════════════════════════════════════════════ */

/**
 * HC1 Select — the canonical single-selection control.
 *
 * The trigger is styled to match the Input frame exactly. Future dropdown
 * controls — Combobox, Multi Select, User Picker, Searchable Select —
 * should reuse the trigger classes and the popup+option classes here
 * rather than reinvent them.
 *
 * Keyboard model uses aria-activedescendant so DOM focus stays on the
 * trigger while the highlighted option moves. This is the ARIA Authoring
 * Practices "Select-only Combobox" pattern.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select…",
    size = "md",
    label,
    optional = false,
    requiredMarker = "*",
    required,
    helperText,
    errorMessage,
    warningMessage,
    successMessage,
    validation,
    leadingIcon,
    loading = false,
    fullWidth = true,
    emptyStateMessage = "No options",
    open: openProp,
    onOpenChange,
    disabled,
    className,
    id: idProp,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
    onKeyDown,
    onClick,
    onBlur,
    ...rest
  },
  ref,
) {
  const reactId       = useId();
  const id            = idProp ?? reactId;
  const labelId       = `${id}-label`;
  const listboxId     = `${id}-listbox`;
  const helperId      = `${id}-helper`;
  const messageId     = `${id}-message`;
  const optionIdFor   = useCallback(
    (v: string) => `${id}-opt-${encodeURIComponent(v)}`,
    [id],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popupRef   = useRef<HTMLDivElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);

  /* ─── Controlled / uncontrolled value ─── */
  const isValueControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState<string | undefined>(
    isValueControlled ? value : defaultValue,
  );
  const currentValue = isValueControlled ? value : innerValue;
  const selectedOption = useMemo(
    () => options.find(o => o.value === currentValue),
    [options, currentValue],
  );

  /* ─── Controlled / uncontrolled open ─── */
  const isOpenControlled = openProp !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const isOpen = isOpenControlled ? openProp : innerOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isOpenControlled) setInnerOpen(next);
    onOpenChange?.(next);
  }, [isOpenControlled, onOpenChange]);

  /* ─── Active index (into the enabled-flat list) ─── */
  const enabledOptions = useMemo(() => enabledFlat(options), [options]);
  const grouped = useMemo(() => groupOptions(options), [options]);

  const [activeValue, setActiveValue] = useState<string | undefined>(currentValue);

  const activeIndex = useMemo(
    () => (activeValue == null ? -1 : enabledOptions.findIndex(o => o.value === activeValue)),
    [enabledOptions, activeValue],
  );

  /* ─── Positioning: flip above if not enough room below ─── */
  const [above, setAbove] = useState(false);
  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const popup   = popupRef.current;
    if (!trigger || !popup) return;

    const rect = trigger.getBoundingClientRect();
    const popupH = popup.offsetHeight || 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setAbove(spaceBelow < popupH + 16 && spaceAbove > spaceBelow);
  }, [isOpen, options.length]);

  /* ─── Scroll active option into view ─── */
  useEffect(() => {
    if (!isOpen || activeValue == null) return;
    const el = listboxRef.current?.querySelector<HTMLElement>(
      `[data-value="${CSS.escape(activeValue)}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeValue]);

  /* ─── Open/close side-effects ─── */
  const openWith = useCallback((initial: "selected" | "first" | "last") => {
    let seed: string | undefined;
    if (initial === "selected" && currentValue != null &&
        enabledOptions.some(o => o.value === currentValue)) {
      seed = currentValue;
    } else if (initial === "last") {
      seed = enabledOptions[enabledOptions.length - 1]?.value;
    } else {
      seed = enabledOptions[0]?.value;
    }
    setActiveValue(seed);
    setOpen(true);
  }, [currentValue, enabledOptions, setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const commit = useCallback((opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isValueControlled) setInnerValue(opt.value);
    onChange?.(opt.value, opt);
    setActiveValue(opt.value);
    setOpen(false);
    // Return focus to the trigger for clean keyboard flow.
    triggerRef.current?.focus();
  }, [isValueControlled, onChange, setOpen]);

  /* ─── Outside click / blur ─── */
  useEffect(() => {
    if (!isOpen) return;
    const handleDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popupRef.current?.contains(target)) {
        close();
      }
    };
    document.addEventListener("pointerdown", handleDown, true);
    return () => document.removeEventListener("pointerdown", handleDown, true);
  }, [isOpen, close]);

  /* ─── Reposition on scroll/resize ─── */
  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => {
      const trigger = triggerRef.current;
      const popup   = popupRef.current;
      if (!trigger || !popup) return;
      const rect = trigger.getBoundingClientRect();
      const popupH = popup.offsetHeight || 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setAbove(spaceBelow < popupH + 16 && spaceAbove > spaceBelow);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [isOpen]);

  /* ─── Keyboard handler on trigger ─── */
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (disabled || loading) return;

    const key = event.key;

    if (!isOpen) {
      if (key === "Enter" || key === " " || key === "ArrowDown") {
        event.preventDefault();
        openWith(currentValue != null ? "selected" : "first");
      } else if (key === "ArrowUp") {
        event.preventDefault();
        openWith(currentValue != null ? "selected" : "last");
      }
      return;
    }

    // Open
    if (key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (key === "Tab") {
      // Allow default tab, but close.
      close();
      return;
    }
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (activeIndex >= 0) commit(enabledOptions[activeIndex]);
      return;
    }
    if (key === "ArrowDown") {
      event.preventDefault();
      const next = nextEnabledIndex(enabledOptions, activeIndex < 0 ? -1 : activeIndex, 1);
      if (next >= 0) setActiveValue(enabledOptions[next].value);
      return;
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      const next = nextEnabledIndex(enabledOptions, activeIndex < 0 ? 0 : activeIndex, -1);
      if (next >= 0) setActiveValue(enabledOptions[next].value);
      return;
    }
    if (key === "Home") {
      event.preventDefault();
      if (enabledOptions.length > 0) setActiveValue(enabledOptions[0].value);
      return;
    }
    if (key === "End") {
      event.preventDefault();
      if (enabledOptions.length > 0) setActiveValue(enabledOptions[enabledOptions.length - 1].value);
      return;
    }
  }, [
    onKeyDown, disabled, loading, isOpen, currentValue,
    openWith, close, activeIndex, enabledOptions, commit,
  ]);

  const handleTriggerClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (disabled || loading) return;
    if (isOpen) close();
    else openWith(currentValue != null ? "selected" : "first");
  }, [onClick, disabled, loading, isOpen, close, openWith, currentValue]);

  /* ─── Derived visuals ─── */
  const activeValidation = resolveValidation(
    errorMessage, warningMessage, successMessage, validation,
  );
  const isError = activeValidation === "error";

  const activeDescendantId =
    isOpen && activeValue != null ? optionIdFor(activeValue) : undefined;

  const describedIds: string[] = [];
  if (helperText && !activeValidation) describedIds.push(helperId);
  if (activeValidation)                describedIds.push(messageId);
  const ariaDescribedBy = [ariaDescribedByProp, ...describedIds]
    .filter(Boolean)
    .join(" ") || undefined;

  const showFooter = Boolean(helperText || activeValidation);
  const message =
    (errorMessage as unknown) ||
    (warningMessage as unknown) ||
    (successMessage as unknown) ||
    null;

  /* ─── Render option ─── */
  const renderOption = (opt: SelectOption): ReactNode => {
    const isSelected = opt.value === currentValue;
    const isActive   = isOpen && opt.value === activeValue;
    const hasDesc    = Boolean(opt.description);
    return (
      <div
        key={opt.value}
        id={optionIdFor(opt.value)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={opt.disabled || undefined}
        data-value={opt.value}
        data-active={isActive || undefined}
        data-selected={isSelected || undefined}
        className={cx(CLASS.option, CLASS.optionSize(size), hasDesc && CLASS.optionWithDesc)}
        onMouseEnter={() => {
          if (!opt.disabled) setActiveValue(opt.value);
        }}
        onMouseDown={(event) => {
          // Prevent trigger from losing focus + blur-close race.
          event.preventDefault();
        }}
        onClick={() => commit(opt)}
      >
        {opt.icon && (
          <span className={CLASS.optionIcon} aria-hidden="true">
            {opt.icon}
          </span>
        )}
        <span className={CLASS.optionBody}>
          <span className={CLASS.optionLabel}>{opt.label}</span>
          {hasDesc && (
            <span className={CLASS.optionDesc}>{opt.description}</span>
          )}
        </span>
        <span className={CLASS.optionCheck} aria-hidden="true">
          <Check />
        </span>
      </div>
    );
  };

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
          <span id={labelId} className={CLASS.label}>
            {label}
            {required && (
              <span className={CLASS.markerRequired} aria-hidden="true">
                {requiredMarker}
              </span>
            )}
          </span>
          {!required && optional && (
            <span className={CLASS.markerOptional}>Optional</span>
          )}
        </div>
      )}

      <div className={CLASS.anchor}>
        <button
          {...rest}
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={ariaInvalidProp ?? (isError || undefined)}
          aria-describedby={ariaDescribedBy}
          aria-required={required || undefined}
          aria-busy={loading || undefined}
          aria-activedescendant={activeDescendantId}
          disabled={disabled}
          data-state={isOpen ? "open" : "closed"}
          className={cx(
            CLASS.trigger,
            CLASS.triggerSize(size),
            disabled && CLASS.triggerDisabled,
            loading && CLASS.triggerLoading,
            activeValidation && CLASS.triggerValidation(activeValidation),
          )}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        >
          {leadingIcon && (
            <span className={CLASS.triggerLeading} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          {selectedOption ? (
            <span className={CLASS.triggerValue}>{selectedOption.label}</span>
          ) : (
            <span className={CLASS.triggerPlaceholder}>{placeholder}</span>
          )}
          {loading ? (
            <span className={CLASS.triggerSpinner} aria-hidden="true" />
          ) : (
            <span className={CLASS.triggerChevron} aria-hidden="true">
              <ChevronDown />
            </span>
          )}
        </button>

        {isOpen && (
          <div
            ref={popupRef}
            className={cx(CLASS.popup, above && CLASS.popupAbove)}
            // Prevent mousedown on empty popup area from moving focus.
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.length === 0 ? (
              <div className={CLASS.empty} role="status">
                {emptyStateMessage}
              </div>
            ) : (
              <div
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? labelId : undefined}
                className={CLASS.listbox}
                tabIndex={-1}
              >
                {grouped.map(({ name, items }, idx) => {
                  const headerId = `${id}-group-${idx}`;
                  return (
                    <div
                      key={name || "__nogroup"}
                      className={CLASS.group}
                      role="group"
                      aria-labelledby={name ? headerId : undefined}
                    >
                      {name && (
                        <div id={headerId} className={CLASS.groupHeader}>
                          {name}
                        </div>
                      )}
                      {items.map(renderOption)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";
