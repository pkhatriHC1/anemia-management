import { forwardRef } from "react";
import type { MouseEvent } from "react";
import type { ButtonProps } from "./Button.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically when they import Button, regardless of where they mount it.
import "../../tokens/css/variables.css";
import "./Button.css";

const CLASS = {
  base:        "hc-btn",
  variant:     (v: string) => `hc-btn--${v}`,
  size:        (s: string) => `hc-btn--size-${s}`,
  fullWidth:   "hc-btn--full-width",
  iconOnly:    "hc-btn--icon-only",
  loading:     "hc-btn--loading",
  label:       "hc-btn__label",
  iconLeading: "hc-btn__icon hc-btn__icon--leading",
  iconTrailing:"hc-btn__icon hc-btn__icon--trailing",
  spinner:     "hc-btn__spinner",
};

function classNames(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * HC1 Button — the reference implementation.
 *
 * See Standards → Component Checklist for the acceptance criteria this
 * component satisfies. See docs/components/ButtonDoc for the full spec.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    disabled,
    type = "button",
    onClick,
    children,
    className,
    "aria-label": ariaLabel,
    ...rest
  },
  ref
) {
  const isIconOnly = variant === "icon" || iconOnly;

  // Dev-time assertion: any icon-only button must have an accessible name.
  if (import.meta.env?.DEV && isIconOnly && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn(
      "[hc1 Button] icon-only buttons require aria-label — the button has no visible text."
    );
  }

  const isDisabled = disabled || loading;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={classNames(
        CLASS.base,
        CLASS.variant(variant),
        CLASS.size(size),
        fullWidth && CLASS.fullWidth,
        iconOnly && variant !== "icon" && CLASS.iconOnly,
        loading && CLASS.loading,
        className,
      )}
      {...rest}
    >
      {!isIconOnly && leftIcon && (
        <span className={CLASS.iconLeading} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {isIconOnly ? (
        <span className="hc-btn__icon" aria-hidden={ariaLabel ? undefined : "true"}>
          {children}
        </span>
      ) : (
        children != null && (
          <span className={CLASS.label}>{children}</span>
        )
      )}
      {!isIconOnly && rightIcon && (
        <span className={CLASS.iconTrailing} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {loading && <span className={CLASS.spinner} aria-hidden="true" />}
    </button>
  );
});

Button.displayName = "Button";
