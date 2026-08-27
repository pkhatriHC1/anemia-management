import { aliases, primitives } from "../../tokens";

const { color, typography, spacing, radius } = aliases;
const { elevation } = primitives;

const ENTRIES = Object.entries(elevation) as [keyof typeof elevation, string][];

export function ShadowsDoc() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: spacing.section.sm,
        padding: spacing.section.sm,
        background: color.background.subtle,
        borderRadius: radius.surface,
      }}
    >
      {ENTRIES.map(([key, value]) => (
        <ShadowTile key={key} name={String(key)} value={value} />
      ))}
    </div>
  );
}

function ShadowTile({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.stack.md }}>
      <div
        style={{
          width: "100%",
          height: 96,
          background: color.background.default,
          borderRadius: radius.surface,
          boxShadow: value,
          border: value === "none" ? `1px solid ${color.border.subtle}` : "none",
        }}
        aria-label={`elevation.${name}`}
      />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: primitives.fontFamily.mono, fontSize: 12, color: color.text.primary }}>
          elevation.{name}
        </div>
        <div
          style={{
            ...typography.caption,
            color: color.text.tertiary,
            marginTop: 2,
            wordBreak: "break-word" as const,
          }}
        >
          {value === "none" ? "none" : "compound shadow"}
        </div>
      </div>
    </div>
  );
}
