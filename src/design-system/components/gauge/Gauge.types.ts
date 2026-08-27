import type { HTMLAttributes } from "react";
import type { SeverityTier } from "../../tokens/aliases/color";

export type GaugeSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * A compact radial arc that plots a value on a 0–max scale and colors the
 * arc + numeric readout by severity tier. Designed for risk / status
 * scores: transfusion risk (TRS), ACOG-scaled risk, sepsis risk, any
 * clinical or operational score where "the number carries the meaning
 * and the color reinforces urgency."
 *
 * The Gauge does NOT decide the tier — the consumer maps `value` to a
 * `tier` and passes both. This keeps the primitive dumb and lets each
 * product own its threshold rules (a TRS of 6 might be `high` in one
 * pathway and `medium` in another).
 *
 * Colors read from the severity alias (severity.critical, severity.high,
 * severity.medium, severity.low, severity.normal). The Gauge never sees
 * raw hex.
 */
export type GaugeProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * The current value on the 0–`max` scale. Values are clamped to
   * `[0, max]` for the arc render; the numeric readout shows the raw
   * value as-passed so callers who want to display an out-of-range
   * number (unusual, but valid for e.g. a lab that exceeds the standard
   * scale) can.
   */
  value: number;
  /**
   * The upper bound of the scale.
   * @default 10
   */
  max?: number;
  /**
   * Severity tier for color. See SeverityTier — the taxonomy is shared
   * with StatusChip and any future severity-aware component.
   */
  tier: SeverityTier;
  /**
   * Size ladder — diameter of the arc in px.
   *   xs = 32  · sm = 40  · md = 56  · lg = 72  · xl = 96
   * Aligned with the size ladder of Button / Input / Select for
   * inline-with-form layouts. If you need a specific pixel size, pass
   * `sizePx` — that wins over `size`.
   * @default 'md'
   */
  size?: GaugeSize;
  /**
   * Explicit diameter in pixels. Overrides `size`. Use for one-off
   * layouts (a KPI hero card, a table cell) where the size ladder
   * doesn't fit. Values below 24 render legibly but the numeric
   * readout starts to crowd — prefer sm+ for legibility.
   */
  sizePx?: number;
  /**
   * Override the accessible label. The default reads
   * "Score {value} of {max}, {tier}". Set this when the value carries a
   * unit or specific label (e.g. "TRS 6 of 10, high risk").
   */
  ariaLabel?: string;
  /**
   * When true, hides the numeric readout in the center of the arc. Use
   * for compact table-cell renderings where the number lives in an
   * adjacent column. The accessible label still announces the value.
   * @default false
   */
  hideValue?: boolean;
  /**
   * Class name applied to the outer wrapper.
   */
  className?: string;
};
