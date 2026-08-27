import { CATEGORIES, type SectionEntry } from "../utils";
import { aliases } from "../tokens";
import { SidebarLink } from "./SidebarLink";

const { color, spacing } = aliases;

export function Sidebar({
  sections,
  activeId,
}: {
  sections: SectionEntry[];
  activeId: string | null;
}) {
  return (
    <aside
      className="sticky top-0 flex h-[100dvh] w-64 shrink-0 flex-col"
      style={{
        background: color.background.surface,
        borderRight: `1px solid ${color.border.default}`,
      }}
    >
      <div
        style={{
          padding: `${spacing.section.sm} ${spacing.inline.xl}`,
          borderBottom: `1px solid ${color.border.default}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: color.text.primary }}>hc</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: color.action.accent }}>1</span>
        </div>
        <div
          style={{
            marginTop: spacing.stack.xs,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: color.action.primary,
          }}
        >
          Design System
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto"
        style={{ padding: `${spacing.inline.lg} ${spacing.inline.sm}` }}
      >
        {CATEGORIES.map(category => {
          const items = sections.filter(s => s.category === category.id);
          if (items.length === 0) return null;
          return (
            <div key={category.id} style={{ marginBottom: spacing.section.sm }}>
              <div
                style={{
                  padding: `0 ${spacing.inline.md}`,
                  marginBottom: spacing.stack.sm,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: color.text.tertiary,
                }}
              >
                {category.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map(item => (
                  <SidebarLink
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    active={activeId === item.id}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div
        style={{
          borderTop: `1px solid ${color.border.default}`,
          padding: `${spacing.inline.sm} ${spacing.inline.xl}`,
          fontSize: 11,
          lineHeight: 1.5,
          color: color.text.tertiary,
        }}
      >
        Consumed by every IQ module.
      </div>
    </aside>
  );
}
