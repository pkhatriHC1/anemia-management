import { useEffect, useState } from "react";
import { aliases, primitives } from "../../tokens";

const { color, typography, spacing, radius } = aliases;
const { breakpoints } = primitives;

const ENTRIES = Object.entries(breakpoints) as [keyof typeof breakpoints, string][];
const MAX_PX = 1536;

export function BreakpointsDoc() {
  const [width, setWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const currentBp = ENTRIES.reduce<string>((acc, [key, value]) => {
    return width >= parseInt(value, 10) ? String(key) : acc;
  }, "base");

  return (
    <div
      style={{
        padding: spacing.inline.xl,
        border: `1px solid ${color.border.subtle}`,
        borderRadius: radius.surface,
        background: color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: spacing.stack.lg,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: spacing.inline.sm }}>
        <span style={{ ...typography.bodyS, fontWeight: 600, color: color.text.primary }}>
          Current viewport
        </span>
        <span
          style={{
            fontFamily: primitives.fontFamily.mono,
            fontSize: 14,
            color: color.action.primary,
            fontWeight: 600,
          }}
        >
          {width}px · {currentBp}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: 40,
          background: color.background.subtle,
          borderRadius: radius.chip,
          overflow: "hidden",
        }}
      >
        {ENTRIES.map(([key, value]) => {
          const px = parseInt(value, 10);
          const leftPct = (px / MAX_PX) * 100;
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${leftPct}%`,
                borderLeft: `1px dashed ${color.border.strong}`,
                paddingLeft: 4,
                fontFamily: primitives.fontFamily.mono,
                fontSize: 10,
                color: color.text.tertiary,
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 4,
              }}
            >
              {key}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${Math.min((width / MAX_PX) * 100, 100)}%`,
            background: color.action.primary,
            opacity: 0.2,
            transition: "width 250ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing.stack.xs }}>
        {ENTRIES.map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 100px 1fr",
              gap: spacing.inline.md,
              padding: `${spacing.stack.xs} 0`,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: primitives.fontFamily.mono,
                fontSize: 14,
                fontWeight: 600,
                color: key === currentBp ? color.action.primary : color.text.primary,
              }}
            >
              {key}
            </span>
            <span
              style={{
                fontFamily: primitives.fontFamily.mono,
                fontSize: 12,
                color: color.text.tertiary,
              }}
            >
              {value}
            </span>
            <span style={{ ...typography.caption, color: color.text.secondary }}>
              {descriptionFor(String(key))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function descriptionFor(bp: string) {
  switch (bp) {
    case "sm":  return "Small tablets and large phones in landscape.";
    case "md":  return "Tablets and small laptops.";
    case "lg":  return "Standard desktop and laptop screens.";
    case "xl":  return "Large desktop monitors.";
    case "2xl": return "Ultra-wide and extra-large displays.";
    default:    return "";
  }
}
