import { aliases, primitives } from "../../tokens";

const { color, typography, spacing: spaceAlias, radius } = aliases;
const { spacing } = primitives;

const ENTRIES = Object.entries(spacing);

export function SpacingDoc() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spaceAlias.section.sm }}>
      <div
        style={{
          padding: spaceAlias.inline.xl,
          border: `1px solid ${color.border.subtle}`,
          borderRadius: radius.surface,
          background: color.background.default,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px", rowGap: spaceAlias.stack.sm, alignItems: "center" }}>
          <span style={headerCell}>Token</span>
          <span style={headerCell}>Visual</span>
          <span style={{ ...headerCell, textAlign: "right" as const }}>Value</span>
          {ENTRIES.map(([key, value]) => (
            <SpaceRow key={key} name={String(key)} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}

const headerCell = {
  fontFamily: primitives.fontFamily.sans,
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color: aliases.color.text.tertiary,
  paddingBottom: aliases.spacing.stack.sm,
  borderBottom: `1px solid ${aliases.color.border.subtle}`,
};

function SpaceRow({ name, value }: { name: string; value: string }) {
  const px = parseInt(value, 10);
  return (
    <>
      <span
        style={{
          fontFamily: primitives.fontFamily.mono,
          fontSize: 12,
          color: color.text.primary,
        }}
      >
        space.{name}
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            height: 12,
            width: `${Math.max(px, 1)}px`,
            background: color.action.primary,
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          ...typography.caption,
          fontFamily: primitives.fontFamily.mono,
          color: color.text.tertiary,
          textAlign: "right" as const,
        }}
      >
        {value}
      </span>
    </>
  );
}
