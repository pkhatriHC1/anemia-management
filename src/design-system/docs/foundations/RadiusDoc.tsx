import { aliases, primitives } from "../../tokens";

const { color, typography, spacing } = aliases;
const { radius } = primitives;

const ENTRIES = Object.entries(radius) as [keyof typeof radius, string][];

export function RadiusDoc() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: spacing.inline.lg,
      }}
    >
      {ENTRIES.map(([key, value]) => (
        <RadiusTile key={key} name={String(key)} value={value} />
      ))}
    </div>
  );
}

function RadiusTile({ name, value }: { name: string; value: string }) {
  const isFull = name === "full";
  const displayRadius = isFull ? "50%" : value;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.stack.sm,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: displayRadius,
          background: color.action.primary,
        }}
        aria-label={`radius.${name}`}
      />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: primitives.fontFamily.mono,
            fontSize: 12,
            color: color.text.primary,
          }}
        >
          radius.{name}
        </div>
        <div
          style={{
            ...typography.caption,
            fontFamily: primitives.fontFamily.mono,
            color: color.text.tertiary,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
