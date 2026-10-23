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

const TIER_COLOR_FALLBACK: Record<Tier, string> = {
  critical: "#DC2626",
  high: "#EA580C",
  medium: "#CA8A04",
  low: "#2563EB",
  normal: "#16A34A",
};

// 180° semi-circle gauge: spans from left (270°) clockwise through top to right (90°)
const SWEEP_DEG = 180;
const START_DEG = 270;
const CX = 50;
const CY = 52;
const R = 40;
const R_TRACK = R;
const R_INNER_TICK = R - 6;
const R_OUTER_TICK = R - 2;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = polar(cx, cy, r, startDeg);
  const [ex, ey] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

function tierColor(tier: Tier): string {
  const v = TIER_COLOR_VAR[tier];
  const fb = TIER_COLOR_FALLBACK[tier];
  return `color-mix(in srgb, ${v}, ${fb} 100%)`;
}

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
  const arcColor = tierColor(tier);
  const defaultLabel = `Score ${value} of ${max}, ${tier}`;
  const label = ariaLabel ?? defaultLabel;

  const endDeg = START_DEG + SWEEP_DEG * fraction;
  const fullEndDeg = START_DEG + SWEEP_DEG;
  const trackPath = arcPath(CX, CY, R_TRACK, START_DEG, fullEndDeg);
  const valuePath = fraction > 0.001 ? arcPath(CX, CY, R_TRACK, START_DEG, endDeg) : "";

  // Unique gradient id per instance to avoid collisions
  const gradId = React.useId().replace(/[:]/g, "");

  const ticks = Array.from({ length: max + 1 }, (_, i) => {
    const deg = START_DEG + (SWEEP_DEG * i) / max;
    const active = i <= value;
    const [x1, y1] = polar(CX, CY, R_INNER_TICK, deg);
    const [x2, y2] = polar(CX, CY, R_OUTER_TICK, deg);
    return { i, x1, y1, x2, y2, active, deg };
  });

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
        viewBox="0 0 100 100"
        role="img"
        aria-label={label}
        style={{ display: "block", overflow: "visible" }}
      >
        <title>{label}</title>
        <defs>
          <linearGradient id={`grad-${gradId}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={arcColor} stopOpacity={0.65} />
            <stop offset="100%" stopColor={arcColor} stopOpacity={1} />
          </linearGradient>
          <filter id={`shadow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.12)" />
          </filter>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--hc-color-neutral-300, #D1D5DB)"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Value arc with gradient */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={`url(#grad-${gradId})`}
            strokeWidth={6}
            strokeLinecap="round"
            filter={`url(#shadow-${gradId})`}
            style={{
              transition: "all 300ms cubic-bezier(0.2, 0, 0, 1)",
            }}
          />
        )}

        {/* Tick marks for each point */}
        {ticks.map((tk) => (
          <line
            key={tk.i}
            x1={tk.x1}
            y1={tk.y1}
            x2={tk.x2}
            y2={tk.y2}
            stroke={tk.active ? arcColor : "var(--hc-color-neutral-400, #9CA3AF)"}
            strokeWidth={tk.active ? 1.8 : 1}
            strokeLinecap="round"
            opacity={tk.active ? 0.85 : 0.4}
            style={{ transition: "all 200ms ease" }}
          />
        ))}


      </svg>

      {!hideValue && (
        <span
          className="tabular-nums-hc1"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: diameter * 0.28,
            fontWeight: 700,
            color: arcColor,
            fontFamily: "var(--hc-font-sans)",
            lineHeight: 1,
            pointerEvents: "none",
            paddingTop: diameter * 0.18,
          }}
        >
          {value}
          <span
            style={{
              fontSize: diameter * 0.11,
              fontWeight: 600,
              color: "var(--hc-color-neutral-500, #6B7280)",
              marginTop: diameter * 0.03,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            of {max}
          </span>
        </span>
      )}
    </div>
  );
}
