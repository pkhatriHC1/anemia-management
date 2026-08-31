import * as React from "react";
import { CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type SeverityTier = "critical" | "high" | "medium" | "low" | "normal";

const TIER_CONFIG: Record<
  SeverityTier,
  { variant: string; Icon: React.ElementType; label: string }
> = {
  critical: { variant: "danger",  Icon: AlertCircle,   label: "Critical" },
  high:     { variant: "warning", Icon: AlertTriangle,  label: "High" },
  medium:   { variant: "warning", Icon: AlertTriangle,  label: "Medium" },
  low:      { variant: "neutral", Icon: Info,          label: "Low" },
  normal:   { variant: "success", Icon: ShieldCheck,    label: "Normal" },
};

const VARIANT_SOFT: Record<string, string> = {
  danger:  "bg-[#F4DFE4] text-[var(--hc-color-severity-critical)]",
  warning: "bg-[var(--hc-color-yellow-50)] text-[var(--hc-color-severity-high)]",
  neutral: "bg-[var(--hc-color-bg-subtle)] text-[var(--hc-color-severity-low)]",
  success: "bg-[#D7E7D6] text-[var(--hc-color-severity-normal)]",
};

export interface StatusChipProps {
  tier: SeverityTier;
  label?: string;
  className?: string;
}

export function StatusChip({ tier, label, className }: StatusChipProps) {
  const { variant, Icon, label: defaultLabel } = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        "hc-badge",
        `hc-badge--variant-${variant}`,
        "hc-badge--appearance-soft",
        "hc-badge--size-sm",
        "inline-flex items-center gap-1 rounded-[var(--hc-radius-chip)] px-2 py-0.5",
        "text-xs font-semibold uppercase tracking-[0.02em] leading-tight",
        VARIANT_SOFT[variant],
        className
      )}
    >
      <Icon size={12} className="shrink-0" aria-hidden="true" strokeWidth={1.5} />
      <span className="hc-badge__label">{label ?? defaultLabel}</span>
    </span>
  );
}
