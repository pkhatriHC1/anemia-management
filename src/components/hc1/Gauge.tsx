import * as React from "react";

type Tier = "critical" | "high" | "medium" | "low" | "normal";

const TIER_COLOR: Record<Tier, string> = {
  critical: "#B00A2F",
  high: "#F58126",
  medium: "#92600A",
  low: "#388032",
  normal: "#388032",
};

export interface GaugeProps {
  value: number;
  tier?: Tier;
  sizePx?: number;
}

export function Gauge({ value, tier = "low", sizePx = 44 }: GaugeProps) {
  const size = sizePx;
  const stroke = Math.max(3, size * 0.1);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value / 10, 0), 1);
  const dash = circumference * pct;
  const color = TIER_COLOR[tier];

  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E7E7E7"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.32,
          fontWeight: 600,
          color,
          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}
