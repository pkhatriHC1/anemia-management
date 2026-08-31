import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "cta" | "link" | "icon";
type Size = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-1.5 font-normal whitespace-nowrap cursor-pointer select-none transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-[var(--hc-button-bg-primary)] text-[var(--hc-button-text-primary)] hover:bg-[var(--hc-button-bg-primary-hover)] active:bg-[var(--hc-button-bg-primary-active)] disabled:bg-[var(--hc-button-bg-primary-disabled)] disabled:text-[var(--hc-button-text-disabled)]",
  secondary:
    "bg-[var(--hc-button-bg-secondary)] text-[var(--hc-button-text-secondary)] border border-[var(--hc-button-border-secondary)] hover:bg-[var(--hc-button-bg-secondary-hover)] active:bg-[var(--hc-button-bg-secondary-active)] disabled:text-[var(--hc-button-text-disabled)]",
  ghost:
    "bg-[var(--hc-button-bg-ghost)] text-[var(--hc-button-text-ghost)] hover:bg-[var(--hc-button-bg-ghost-hover)] active:bg-[var(--hc-button-bg-ghost-active)] disabled:text-[var(--hc-button-text-disabled)]",
  danger:
    "bg-[var(--hc-button-bg-danger)] text-[var(--hc-button-text-danger)] hover:bg-[var(--hc-button-bg-danger-hover)] active:bg-[var(--hc-button-bg-danger-active)] disabled:bg-[var(--hc-button-bg-primary-disabled)] disabled:text-[var(--hc-button-text-disabled)]",
  cta:
    "bg-[var(--hc-button-bg-cta)] text-[var(--hc-button-text-cta)] border border-[var(--hc-button-border-cta)] hover:bg-[var(--hc-button-bg-cta-hover)] active:bg-[var(--hc-button-bg-cta-active)] disabled:bg-[var(--hc-button-bg-primary-disabled)] disabled:text-[var(--hc-button-text-disabled)]",
  link:
    "bg-transparent text-[var(--hc-button-text-link)] hover:text-[var(--hc-button-text-link-hover)] underline-offset-2 hover:underline disabled:text-[var(--hc-button-text-disabled)]",
  icon:
    "bg-transparent text-[var(--hc-color-text-secondary)] hover:bg-[var(--hc-button-bg-ghost-hover)] active:bg-[var(--hc-button-bg-ghost-active)] disabled:text-[var(--hc-button-text-disabled)]",
};

const SIZE_CLASS: Record<Size, string> = {
  xs: "text-xs h-5 px-1 rounded-[var(--hc-radius-control)]",
  sm: "text-xs h-7 px-2 rounded-[var(--hc-radius-control)]",
  md: "text-sm h-9 px-3 rounded-[var(--hc-radius-control)]",
  lg: "text-base h-11 px-4 rounded-[var(--hc-radius-control)]",
  xl: "text-lg h-14 px-6 rounded-[var(--hc-radius-control)]",
};

const ICON_SIZE_CLASS: Record<Size, string> = {
  xs: "h-5 w-5 p-1 rounded-[var(--hc-radius-control)]",
  sm: "h-7 w-7 p-1.5 rounded-[var(--hc-radius-control)]",
  md: "h-9 w-9 p-2 rounded-[var(--hc-radius-control)]",
  lg: "h-11 w-11 p-2.5 rounded-[var(--hc-radius-control)]",
  xl: "h-14 w-14 p-4 rounded-[var(--hc-radius-control)]",
};

const ICON_PX: Record<Size, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };

export function Button({
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
  ...props
}: ButtonProps) {
  const isIcon = iconOnly || variant === "icon";

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        BASE,
        VARIANT_CLASS[variant],
        isIcon ? ICON_SIZE_CLASS[size] : SIZE_CLASS[size],
        fullWidth && !isIcon && "w-full",
        loading && "cursor-wait",
        className
      )}
      style={{
        transitionDuration: "var(--hc-duration-150)",
        transitionTimingFunction: "var(--hc-easing-standard)",
        outlineColor: "var(--hc-color-border-focus)",
        ...props.style,
      }}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <span
          className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{
            width: ICON_PX[size] - 4,
            height: ICON_PX[size] - 4,
            animationDuration: "900ms",
          }}
          aria-hidden="true"
        />
      )}
      {!loading && leftIcon && !isIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children && !isIcon && <span className="hc-btn__label inline-flex items-center whitespace-nowrap">{children}</span>}
      {isIcon && !loading && children}
      {!loading && rightIcon && !isIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
