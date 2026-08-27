import { forwardRef } from "react";
import type { GaugeProps, GaugeSize } from "./Gauge.types";

import "../../tokens/css/variables.css";
import "./Gauge.css";

const SIZE_PX: Record<GaugeSize, number> = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 72,
  xl: 96,
};

const VIEWBOX_W = 46;
const VIEWBOX_H = 30;
const ARC_RADIUS = 16;
const ARC_STROKE = 4;
const ARC_PATH = "M7 24 A16 16 0 0 1 39 24";

/**
 * Radial arc score primitive. See Gauge.types.ts for the full API doc.
 *
 * The arc is a fixed-viewport SVG path scaled to the requested diameter.
 * Track (background) uses --hc-color-neutral-300; arc (progress) uses
 * --hc-gauge-arc-color which is set by the tier class. Numeric readout
 * shares the same tier color.
 */
export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(function Gauge(
  { value, max = 10, tier, size = "md", sizePx, ariaLabel, hideValue = false, className, ...rest },
  ref,
) {
  const diameter = sizePx ?? SIZE_PX[size];
  const arcHeight = diameter * (VIEWBOX_H / VIEWBOX_W);

  const clamped = Math.max(0, Math.min(value, max));
  const fraction = max === 0 ? 0 : clamped / max;
  const arcLength = Math.PI * ARC_RADIUS;
  const dash = (arcLength * fraction).toFixed(1);

  const label = ariaLabel ?? `Score ${value} of ${max}, ${tier}`;

  const rootClass = ["hc-gauge", `hc-gauge--tier-${tier}`, className].filter(Boolean).join(" ");

  // Font size lives in SVG viewBox units (46×30). The whole SVG scales
  // with `diameter`, so the text scales too — a fixed 13 keeps the
  // number proportional to the arc at every size.
  //
  // Wide numbers (3+ chars) shrink via textLength so "100" fits inside
  // the arc's inner width without spilling over.
  const valueStr = String(value);
  const wideText = valueStr.length >= 3;
  const fontSize = valueStr.length >= 3 ? 11 : 13;

  return (
    <div
      ref={ref}
      className={rootClass}
      data-tier={tier}
      data-size={sizePx ? undefined : size}
      {...rest}
    >
      <svg
        className="hc-gauge__svg"
        width={diameter}
        height={arcHeight}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        role="img"
        aria-label={label}
      >
        <title>{label}</title>
        <path className="hc-gauge__track" d={ARC_PATH} strokeWidth={ARC_STROKE} />
        <path
          className="hc-gauge__arc"
          d={ARC_PATH}
          strokeWidth={ARC_STROKE}
          strokeDasharray={`${dash} ${arcLength}`}
        />
        {!hideValue && (
          <text
            className="hc-gauge__value"
            x={VIEWBOX_W / 2}
            y={23}
            textAnchor="middle"
            fontSize={fontSize}
            {...(wideText ? { textLength: 22, lengthAdjust: "spacingAndGlyphs" as const } : {})}
          >
            {value}
          </text>
        )}
      </svg>
    </div>
  );
});
