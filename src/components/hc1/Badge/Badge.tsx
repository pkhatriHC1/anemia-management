import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BadgeProps, BadgeSize, BadgeVariant } from "./Badge.types";
import "./Badge.css";

const ICON_SIZE: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

const DOT_SIZE: Record<BadgeSize, number> = {
  sm: 6,
  md: 8,
  lg: 10,
};

const DOT_COLOR: Record<BadgeVariant, string> = {
  default: "hc-badge__dot--default",
  primary: "hc-badge__dot--primary",
  success: "hc-badge__dot--success",
  warning: "hc-badge__dot--warning",
  danger: "hc-badge__dot--danger",
  info: "hc-badge__dot--info",
  neutral: "hc-badge__dot--neutral",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = "default",
      appearance = "soft",
      size = "md",
      dot = false,
      leadingIcon,
      trailingIcon,
      count,
      maxCount = 99,
      onRemove,
      removeLabel = "Remove",
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    const isCount = count !== undefined && count !== null;
    const isRemovable = onRemove !== undefined;

    const displayCount = isCount
      ? count! > maxCount
        ? `${maxCount}+`
        : String(count!)
      : null;

    const showLeading = dot || (!isCount && leadingIcon !== undefined && leadingIcon !== null);
    const showTrailing = !isCount && !isRemovable && trailingIcon !== undefined && trailingIcon !== null;

    return (
      <span
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(
          "hc-badge",
          `hc-badge--variant-${variant}`,
          `hc-badge--appearance-${appearance}`,
          `hc-badge--size-${size}`,
          isCount && "hc-badge--count",
          isRemovable && "hc-badge--removable",
          disabled && "hc-badge--disabled",
          className
        )}
        {...props}
      >
        {showLeading && dot && (
          <span
            className={cn("hc-badge__dot", DOT_COLOR[variant])}
            style={{ width: DOT_SIZE[size], height: DOT_SIZE[size] }}
            aria-hidden="true"
          />
        )}
        {showLeading && !dot && (
          <span className="hc-badge__leading" aria-hidden="true">
            {leadingIcon &&
              React.cloneElement(leadingIcon as React.ReactElement, {
                size: ICON_SIZE[size],
                strokeWidth: 1.5,
              })}
          </span>
        )}
        <span className="hc-badge__label">
          {isCount ? displayCount : children}
        </span>
        {showTrailing && (
          <span className="hc-badge__trailing" aria-hidden="true">
            {trailingIcon &&
              React.cloneElement(trailingIcon as React.ReactElement, {
                size: ICON_SIZE[size],
                strokeWidth: 1.5,
              })}
          </span>
        )}
        {isRemovable && (
          <button
            type="button"
            className="hc-badge__remove"
            aria-label={removeLabel}
            disabled={disabled}
            onClick={onRemove}
          >
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </span>
    );
  }
);
