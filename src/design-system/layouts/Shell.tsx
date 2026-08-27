import { useMemo } from "react";
import { CATEGORIES, type SectionEntry } from "../utils";
import { useActiveSection } from "../hooks";
import { aliases } from "../tokens";
import { Sidebar } from "./Sidebar";
import { PageHeader } from "./PageHeader";
import { SectionHeader } from "./SectionHeader";

const { color, spacing, typography } = aliases;

export function Shell({ sections }: { sections: SectionEntry[] }) {
  const ids = useMemo(() => sections.map(s => s.id), [sections]);
  const active = useActiveSection(ids);

  return (
    <div
      className="flex min-h-[100dvh]"
      style={{
        background: color.background.default,
        color: color.text.primary,
        fontFamily: typography.body.fontFamily,
      }}
    >
      <Sidebar sections={sections} activeId={active} />

      <main className="flex-1 overflow-x-hidden">
        <div
          className="mx-auto"
          style={{
            maxWidth: 960,
            padding: `${spacing.section.md} ${spacing.section.sm}`,
          }}
        >
          <PageHeader />

          {CATEGORIES.map(category => {
            const items = sections.filter(s => s.category === category.id);
            if (items.length === 0) return null;
            return (
              <div key={category.id} style={{ marginBottom: spacing.section.lg }}>
                <div
                  style={{
                    marginBottom: spacing.section.sm,
                    paddingBottom: spacing.stack.md,
                    borderBottom: `1px solid ${color.border.default}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: color.text.tertiary,
                    }}
                  >
                    {category.label}
                  </div>
                  <p
                    style={{
                      ...typography.bodyS,
                      color: color.text.secondary,
                      marginTop: spacing.stack.xs,
                      marginBottom: 0,
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: spacing.section.md }}
                >
                  {items.map(item => (
                    <section key={item.id} id={item.id} className="scroll-mt-8">
                      <SectionHeader
                        eyebrow={category.label}
                        title={item.label}
                        description={sectionDescription(item, category.label)}
                      />
                      <item.Component />
                    </section>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function sectionDescription(item: SectionEntry, categoryLabel: string) {
  return `${item.label} — part of ${categoryLabel}.`;
}
