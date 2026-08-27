import type { CSSProperties, ReactNode } from "react";
import { t } from "./tokens";

export type PlaceholderTone = "neutral" | "brand" | "accent" | "success" | "warning" | "danger" | "muted";

const TONE_MAP: Record<PlaceholderTone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: t.color.background.default, fg: t.color.text.primary,   border: t.color.border.strong },
  brand:   { bg: t.color.action.primary,     fg: t.color.text.inverse,   border: t.color.action.primary },
  accent:  { bg: t.color.action.accent,      fg: t.color.text.inverse,   border: t.color.action.accent },
  success: { bg: t.color.status.success.fg,  fg: t.color.text.inverse,   border: t.color.status.success.fg },
  warning: { bg: t.color.status.warning.bg,  fg: t.color.status.warning.fg, border: t.color.status.warning.border },
  danger:  { bg: t.color.action.danger,      fg: t.color.text.inverse,   border: t.color.action.danger },
  muted:   { bg: t.color.background.muted,   fg: t.color.text.secondary, border: t.color.border.strong },
};

export function PlaceholderBox({
  label,
  hint,
  tone = "neutral",
  dashed,
  minHeight = 48,
  width,
  align = "start",
  style,
  children,
}: {
  label?: string;
  hint?: string;
  tone?: PlaceholderTone;
  dashed?: boolean;
  minHeight?: number;
  width?: number | string;
  align?: "start" | "center";
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const c = TONE_MAP[tone];
  return (
    <div
      style={{
        minHeight,
        width,
        background: c.bg,
        color: c.fg,
        border: dashed ? `1px dashed ${c.border}` : `1px solid ${c.border}`,
        borderRadius: t.radius.control,
        padding: `${t.space.inline.sm} ${t.space.inline.md}`,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: "center",
        ...style,
      }}
    >
      {label && (
        <span style={{ ...t.type.bodyS, fontWeight: 600 }}>{label}</span>
      )}
      {hint && (
        <span style={{ ...t.type.caption, opacity: 0.85, marginTop: 2 }}>{hint}</span>
      )}
      {children}
    </div>
  );
}
