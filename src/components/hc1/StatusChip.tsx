/**
 * @deprecated Legacy design-system file — pending migration to `@hc1/design-system`.
 * See LEGACY_ARCHIVE.md at project root for the full replacement mapping.
 * Do NOT add new consumers.
 */
import * as React from "react";
import { AlertCircle, ShieldAlert, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatusChip — the ONE severity/status badge in the system. Replaces both
 * ClinicalIQ's ad-hoc chip colors and SourceIQ's separate data-quality palette.
 * Color is never the only signal — every tier carries its icon and its label.
 */
export type SeverityTier = "critical" | "high" | "medium" | "low" | "normal";

const TIER_STYLE: Record<SeverityTier, { cls: string; Icon: React.ElementType; label: string }> = {
  critical: { cls: "text-error-400 bg-error-100",     Icon: AlertCircle,  label: "Critical" },
  high:     { cls: "text-orange-400 bg-orange-100",   Icon: ShieldAlert,  label: "High" },
  medium:   { cls: "text-amber-text bg-yellow-100",   Icon: Shield,       label: "Medium" },
  low:      { cls: "text-grey-700 bg-grey-300",       Icon: ShieldCheck,  label: "Low" },
  normal:   { cls: "text-success-400 bg-success-100", Icon: ShieldCheck,  label: "Normal" },
};

export interface StatusChipProps {
  tier: SeverityTier;
  /** Override the default tier label, e.g. "SEVERE", "CRITICAL FERRITIN". Rendered uppercase regardless. */
  label?: string;
  className?: string;
}

export function StatusChip({ tier, label, className }: StatusChipProps) {
  const { cls, Icon, label: defaultLabel } = TIER_STYLE[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-[7px] py-0.5 text-xs font-bold uppercase tracking-[0.06em] leading-tight",
        cls,
        className
      )}
    >
      <Icon size={12} className="shrink-0" aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  );
}
