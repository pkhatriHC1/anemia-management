import type { ReactNode } from "react";
import { t } from "./tokens";

export type CalloutTone = "info" | "warning" | "note";

const TONE_MAP: Record<CalloutTone, { fg: string; bg: string; border: string; label: string }> = {
  info:    { fg: t.color.status.info.fg,    bg: t.color.status.info.bg,    border: t.color.status.info.border,    label: "Implementation note" },
  warning: { fg: t.color.status.warning.fg, bg: t.color.status.warning.bg, border: t.color.status.warning.border, label: "Watch out" },
  note:    { fg: t.color.text.secondary,    bg: t.color.background.subtle, border: t.color.border.default,        label: "Note" },
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
}) {
  const c = TONE_MAP[tone];
  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        background: c.bg,
        borderRadius: t.radius.control,
        padding: t.space.inline.lg,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: c.fg,
          marginBottom: t.space.stack.xs,
        }}
      >
        {title ?? c.label}
      </div>
      <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{children}</div>
    </div>
  );
}
