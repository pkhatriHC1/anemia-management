import { t } from "./tokens";

export type ChecklistItem = { text: string; hint?: string };

export function Checklist({
  items,
  columns = 1,
}: {
  items: ChecklistItem[];
  columns?: 1 | 2;
}) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gridTemplateColumns: columns === 2 ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
        gap: t.space.stack.md,
      }}
    >
      {items.map((it, i) => (
        <li
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "20px 1fr",
            gap: t.space.inline.sm,
            padding: t.space.inline.sm,
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: t.color.status.success.fg,
              color: t.color.text.inverse,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              marginTop: 2,
              lineHeight: 1,
            }}
          >
            ✓
          </span>
          <div>
            <div style={{ ...t.type.bodyS, fontWeight: 500, color: t.color.text.primary }}>
              {it.text}
            </div>
            {it.hint && (
              <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: 2 }}>
                {it.hint}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
