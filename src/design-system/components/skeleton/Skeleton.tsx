import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type { SkeletonProps, SkeletonVariant } from "./Skeleton.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Skeleton.
import "../../tokens/css/variables.css";
import "./Skeleton.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:     "hc-skeleton",
  variant:  (v: SkeletonVariant) => `hc-skeleton--variant-${v}`,
  animated: "hc-skeleton--animated",
  static:   "hc-skeleton--static",
  group:    "hc-skeleton-group",
  last:     "hc-skeleton--last",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function toCss(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * HC1 Skeleton — the canonical loading-placeholder primitive.
 *
 * A single flexible block. Variants set sensible defaults for the four
 * shapes that cover 99% of loading UI (text line, title line, circle,
 * rectangle, rounded block) and every dimension can still be
 * overridden via `width` / `height` / `radius`.
 *
 * Skeletons are decorative — `aria-hidden='true'` by default. Guard the
 * *parent* surface with `aria-busy='true'` so screen readers announce
 * the loading state once, not per skeleton bar.
 *
 * When `lines` is passed on a `text` or `title` variant, the component
 * renders `lines` stacked bars; the last bar drops to 60% width so the
 * ragged edge reads as text, not a rectangle.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    variant  = "text",
    width,
    height,
    lines,
    animated = true,
    radius,
    className,
    style,
    ...rest
  },
  ref,
) {
  const supportsLines = variant === "text" || variant === "title";
  const lineCount     = supportsLines && lines && lines > 1 ? lines : 1;

  // Build inline styles from the numeric / string dimensions. Undefined
  // values fall through to the CSS defaults per variant.
  const buildStyle = (isLast: boolean): CSSProperties => {
    const w = isLast && lineCount > 1 && !width ? "60%" : toCss(width);
    return {
      width:        w,
      height:       toCss(height),
      borderRadius: toCss(radius),
      ...(style as CSSProperties),
    };
  };

  const rootClass = cx(
    CLASS.root,
    CLASS.variant(variant),
    animated ? CLASS.animated : CLASS.static,
    className,
  );

  if (lineCount > 1) {
    // Render as a group of stacked lines. The outer wrapper is inert
    // and inherits aria-hidden so screen readers skip the whole block.
    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={CLASS.group}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cx(rootClass, i === lineCount - 1 && CLASS.last)}
            style={buildStyle(i === lineCount - 1)}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={rootClass}
      style={buildStyle(false)}
    />
  );
});
Skeleton.displayName = "Skeleton";
