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

const SIZE_CLASS: Record<Size, string> = {
  xs: "text-xs h-5 px-1",
  sm: "text-xs h-7 px-2",
  md: "text-sm h-9 px-3",
  lg: "text-base h-11 px-4",
  xl: "text-lg h-14 px-6",
};

const ICON_SIZE_CLASS: Record<Size, string> = {
  xs: "h-5 w-5 p-1",
  sm: "h-7 w-7 p-1.5",
  md: "h-9 w-9 p-2",
  lg: "h-11 w-11 p-2.5",
  xl: "h-14 w-14 p-4",
};

const ICON_PX: Record<Size, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };

const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--hc-button-bg-primary)",
    color: "var(--hc-button-text-primary)",
    borderRadius: "var(--hc-button-radius)",
  },
  secondary: {
    backgroundColor: "var(--hc-button-bg-secondary)",
    color: "var(--hc-button-text-secondary)",
    border: "1px solid var(--hc-button-border-secondary)",
    borderRadius: "var(--hc-button-radius)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--hc-button-text-ghost)",
    borderRadius: "var(--hc-button-radius)",
  },
  danger: {
    backgroundColor: "var(--hc-button-bg-danger)",
    color: "var(--hc-button-text-danger)",
    borderRadius: "var(--hc-button-radius)",
  },
  cta: {
    backgroundColor: "var(--hc-button-bg-cta)",
    color: "var(--hc-button-text-cta)",
    border: "1px solid var(--hc-button-border-cta)",
    borderRadius: "var(--hc-button-radius)",
  },
  link: {
    backgroundColor: "transparent",
    color: "var(--hc-button-text-link)",
  },
  icon: {
    backgroundColor: "transparent",
    color: "var(--hc-color-text-secondary)",
    borderRadius: "var(--hc-button-radius)",
  },
};

const VARIANT_HOVER: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: "var(--hc-button-bg-primary-hover)" },
  secondary: { backgroundColor: "var(--hc-button-bg-secondary-hover)" },
  ghost: { backgroundColor: "var(--hc-button-bg-ghost-hover)" },
  danger: { backgroundColor: "var(--hc-button-bg-danger-hover)" },
  cta: { backgroundColor: "var(--hc-button-bg-cta-hover)" },
  link: { color: "var(--hc-button-text-link-hover)", textDecoration: "underline" },
  icon: { backgroundColor: "var(--hc-button-bg-ghost-hover)" },
};

const VARIANT_ACTIVE: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: "var(--hc-button-bg-primary-active)" },
  secondary: { backgroundColor: "var(--hc-button-bg-secondary-active)" },
  ghost: { backgroundColor: "var(--hc-button-bg-ghost-active)" },
  danger: { backgroundColor: "var(--hc-button-bg-danger-active)" },
  cta: { backgroundColor: "var(--hc-button-bg-cta-active)" },
  link: {},
  icon: { backgroundColor: "var(--hc-button-bg-ghost-active)" },
};

const VARIANT_DISABLED: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: "var(--hc-button-bg-primary-disabled)", color: "var(--hc-button-text-disabled)" },
  secondary: { color: "var(--hc-button-text-disabled)" },
  ghost: { color: "var(--hc-button-text-disabled)" },
  danger: { backgroundColor: "var(--hc-button-bg-primary-disabled)", color: "var(--hc-button-text-disabled)" },
  cta: { backgroundColor: "var(--hc-button-bg-primary-disabled)", color: "var(--hc-button-text-disabled)" },
  link: { color: "var(--hc-button-text-disabled)" },
  icon: { color: "var(--hc-button-text-disabled)" },
};

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
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const stateStyle = disabled
    ? VARIANT_DISABLED[variant]
    : pressed
    ? VARIANT_ACTIVE[variant]
    : hovered
    ? VARIANT_HOVER[variant]
    : {};

  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        BASE,
        isIcon ? ICON_SIZE_CLASS[size] : SIZE_CLASS[size],
        fullWidth && !isIcon && "w-full",
        loading && "cursor-wait",
        className
      )}
      style={{
        ...VARIANT_STYLE[variant],
        ...stateStyle,
        transitionDuration: "var(--hc-duration-150)",
        transitionTimingFunction: "var(--hc-easing-standard)",
        outlineColor: "var(--hc-color-border-focus)",
        ...props.style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
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
      {children && !isIcon && (
        <span className="hc-btn__label inline-flex items-center whitespace-nowrap">{children}</span>
      )}
      {isIcon && !loading && children}
      {!loading && rightIcon && !isIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
