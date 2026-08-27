import { t } from "./tokens";

export type Practice = { title: string; description: string };

export function DoDontGrid({
  dos,
  donts,
}: {
  dos: Practice[];
  donts: Practice[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: t.space.inline.lg,
      }}
    >
      <Column
        heading="Do"
        symbol="✓"
        toneFg={t.color.status.success.fg}
        toneBg={t.color.status.success.bg}
        toneBorder={t.color.status.success.border}
        items={dos}
      />
      <Column
        heading="Don't"
        symbol="✗"
        toneFg={t.color.status.error.fg}
        toneBg={t.color.status.error.bg}
        toneBorder={t.color.status.error.border}
        items={donts}
      />
    </div>
  );
}

function Column({
  heading,
  symbol,
  toneFg,
  toneBg,
  toneBorder,
  items,
}: {
  heading: string;
  symbol: string;
  toneFg: string;
  toneBg: string;
  toneBorder: string;
  items: Practice[];
}) {
  return (
    <div
      style={{
        border: `1px solid ${toneBorder}`,
        borderRadius: t.radius.surface,
        padding: t.space.inline.lg,
        background: toneBg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: t.space.inline.xs,
          marginBottom: t.space.stack.md,
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: t.radius.circular,
            background: toneFg,
            color: t.color.text.inverse,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {symbol}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: toneFg,
          }}
        >
          {heading}
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.md,
        }}
      >
        {items.map((it, i) => (
          <li key={i}>
            <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
              {it.title}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>
              {it.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
