import { useState } from "react";
import { aliases, primitives } from "../../tokens";

const { color, typography, spacing, radius } = aliases;
const { duration, easing } = primitives;

const DURATIONS = Object.entries(duration);
const EASINGS = Object.entries(easing);

export function MotionDoc() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.section.sm }}>
      <SubBlock label="Durations">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: spacing.inline.lg,
          }}
        >
          {DURATIONS.map(([key, value]) => (
            <DurationTile key={key} name={String(key)} value={value} />
          ))}
        </div>
      </SubBlock>

      <SubBlock label="Easing curves">
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.stack.md }}>
          {EASINGS.map(([key, value]) => (
            <EasingRow key={key} name={String(key)} value={value} />
          ))}
        </div>
      </SubBlock>
    </div>
  );
}

function SubBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: color.text.tertiary,
          marginBottom: spacing.stack.md,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function DurationTile({ name, value }: { name: string; value: string }) {
  const [on, setOn] = useState(false);
  return (
    <div
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        padding: spacing.inline.lg,
        border: `1px solid ${color.border.subtle}`,
        borderRadius: radius.surface,
        background: color.background.default,
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 12,
          borderRadius: radius.chip,
          background: color.background.muted,
          overflow: "hidden",
          marginBottom: spacing.stack.md,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: on ? "100%" : "8%",
            background: color.action.primary,
            transition: `width ${value} cubic-bezier(0.2, 0, 0, 1)`,
          }}
        />
      </div>
      <div style={{ fontFamily: primitives.fontFamily.mono, fontSize: 12, color: color.text.primary }}>
        duration.{name}
      </div>
      <div style={{ ...typography.caption, color: color.text.tertiary }}>
        {value} · hover to preview
      </div>
    </div>
  );
}

function EasingRow({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: spacing.inline.lg,
        alignItems: "center",
        padding: spacing.inline.md,
        border: `1px solid ${color.border.subtle}`,
        borderRadius: radius.control,
        background: color.background.default,
      }}
    >
      <div>
        <div style={{ fontFamily: primitives.fontFamily.mono, fontSize: 12, color: color.text.primary }}>
          easing.{name}
        </div>
        <div
          style={{
            ...typography.caption,
            color: color.text.tertiary,
            fontFamily: primitives.fontFamily.mono,
            fontSize: 10,
            wordBreak: "break-all" as const,
          }}
        >
          {value}
        </div>
      </div>
      <EasingCurve easing={value} />
    </div>
  );
}

function EasingCurve({ easing: e }: { easing: string }) {
  const match = e.match(/cubic-bezier\(([^,]+),([^,]+),([^,]+),([^)]+)\)/);
  if (!match) {
    return (
      <div style={{ ...aliases.typography.caption, color: aliases.color.text.tertiary }}>
        (linear)
      </div>
    );
  }
  const [, x1, y1, x2, y2] = match.map(v => parseFloat(v));
  const w = 200;
  const h = 60;
  const px = (x: number) => x * w;
  const py = (y: number) => h - y * h;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`easing curve ${e}`}>
      <line x1={0} y1={h} x2={w} y2={0} stroke={aliases.color.border.subtle} strokeDasharray="2 4" />
      <path
        d={`M0 ${h} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${w} 0`}
        fill="none"
        stroke={aliases.color.action.primary}
        strokeWidth={2}
      />
    </svg>
  );
}
