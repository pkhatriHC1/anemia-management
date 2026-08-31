import * as React from "react";
import { cn } from "@/lib/utils";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";
import "./Button.css";

const ICON_SIZE: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const SPINNER_SIZE: Record<ButtonSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      onClick,
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) {
    const isIcon = iconOnly || variant === "icon";

    if (isIcon && !ariaLabel && !props["aria-labelledby"]) {
      console.warn(
        "HC1 Button: icon-only buttons require an aria-label or aria-labelledby prop."
      );
    }

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (loading || disabled) return;
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          "hc-btn",
          `hc-btn--${variant}`,
          `hc-btn--size-${size}`,
          isIcon && "hc-btn--icon-only",
          fullWidth && !isIcon && "hc-btn--full-width",
          loading && "hc-btn--loading",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <span
            className="hc-btn__spinner"
            style={{
              width: SPINNER_SIZE[size],
              height: SPINNER_SIZE[size],
            }}
            aria-hidden="true"
          />
        )}
        {!loading && leftIcon && !isIcon && (
          <span className="hc-btn__icon hc-btn__icon--leading" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children && !isIcon && (
          <span className="hc-btn__label">{children}</span>
        )}
        {isIcon && !loading && children}
        {!loading && rightIcon && !isIcon && (
          <span className="hc-btn__icon hc-btn__icon--trailing" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);
