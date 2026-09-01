import * as React from "react";
import { cn } from "@/lib/utils";

type Tier = "critical" | "high" | "medium" | "low" | "normal";
type GaugeSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface GaugeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  max?: number;
  tier: Tier;
  size?: GaugeSize;
  sizePx?: number;
  hideValue?: boolean;
  ariaLabel?: string;
}

const SIZE_PX: Record<GaugeSize, number> = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 72,
  xl: 96,
};

const TIER_COLOR_VAR: Record<Tier, string> = {
  critical: "var(--hc-color-severity-critical)",
  high: "var(--hc-color-severity-high)",
  medium: "var(--hc-color-severity-medium)",
  low: "var(--hc-color-severity-low)",
  normal: "var(--hc-color-severity-normal)",
};

const ARC_PATH = "M7 24 A16 16 0 0 1 39 24";
const ARC_LENGTH = Math.PI * 16;

export function Gauge({
  value,
  max = 10,
  tier,
  size = "md",
  sizePx,
  hideValue = false,
  ariaLabel,
  className,
  ...props
}: GaugeProps) {
  const diameter = sizePx ?? SIZE_PX[size];
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const dash = ARC_LENGTH * fraction;
  const arcColor = TIER_COLOR_VAR[tier];
  const defaultLabel = `Score ${value} of ${max}, ${tier}`;
  const label = ariaLabel ?? defaultLabel;

  return (
    <div
      className={cn("hc-gauge", `hc-gauge--tier-${tier}`, className)}
      style={{
        width: diameter,
        height: diameter,
        position: "relative",
        flexShrink: 0,
        ...props.style,
      }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox="0 0 46 30"
        role="img"
        aria-label={label}
        style={{ display: "block", overflow: "visible" }}
      >
        <title>{label}</title>
        <path
          d={ARC_PATH}
          fill="none"
          stroke="var(--hc-color-neutral-300)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d={ARC_PATH}
          fill="none"
          stroke={arcColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${ARC_LENGTH}`}
          style={{
            transition: "stroke-dasharray 200ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </svg>
      {!hideValue && (
        <span
          className="tabular-nums-hc1"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: diameter * 0.28,
            fontWeight: 700,
            color: arcColor,
            fontFamily: "var(--hc-font-sans)",
            lineHeight: 1,
            pointerEvents: "none",
            paddingTop: diameter * 0.05,
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
