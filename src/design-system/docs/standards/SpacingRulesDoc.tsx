import { DocPage, DocBlock, PlaceholderBox, RuleList, DoDontGrid, Callout, t } from "./_shared";

type Density = { name: string; usage: string; inline: string; stack: string };

const DENSITIES: Density[] = [
  {
    name: "Compact",
    usage: "Data-dense surfaces: worklists, filter bars, table rows, toolbars.",
    inline: t.space.inline.sm,
    stack:  t.space.stack.xs,
  },
  {
    name: "Comfortable",
    usage: "Default for most surfaces: forms, dialogs, dashboards, detail views.",
    inline: t.space.inline.lg,
    stack:  t.space.stack.md,
  },
  {
    name: "Relaxed",
    usage: "Reading-heavy layouts: empty states, marketing, splash screens.",
    inline: t.space.inline.xl,
    stack:  t.space.stack.xl,
  },
];

export function SpacingRulesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Spacing is decided, not designed"
        lead="Every padding, gap, and margin resolves to a spacing token. Density is the vocabulary — Compact, Comfortable, or Relaxed. Individual components do not pick spacing values; they pick a density, and the density resolves the tokens."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "All spacing values come from the spacing tokens (inline / stack / section families)." },
            { tone: "must-not", text: "Never write raw padding or margin values ('padding: 14px'). Never." },
            { tone: "must",     text: "Prefer the semantic families over primitive numbers: inline for padding, stack for gap, section for between-sections." },
            { tone: "should",   text: "A single surface holds a single density — do not mix Compact and Relaxed inside one card." },
            { tone: "should",   text: "When adjacent spacing feels wrong, question the density choice before adjusting the value." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Density definitions">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: t.space.inline.lg }}>
          {DENSITIES.map(d => (
            <div
              key={d.name}
              style={{
                border: `1px solid ${t.color.border.subtle}`,
                borderRadius: t.radius.control,
                padding: t.space.inline.lg,
                background: t.color.background.default,
                display: "flex",
                flexDirection: "column",
                gap: t.space.stack.sm,
              }}
            >
              <div style={{ ...t.type.headingS, color: t.color.text.primary }}>{d.name}</div>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{d.usage}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: d.stack, marginTop: t.space.stack.sm }}>
                <PlaceholderBox tone="muted" minHeight={16} width="100%" />
                <PlaceholderBox tone="muted" minHeight={16} width="80%" />
                <PlaceholderBox tone="muted" minHeight={16} width="60%" />
              </div>
              <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: t.space.stack.sm, fontFamily: t.font.mono }}>
                inline {d.inline} · stack {d.stack}
              </div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Spacing families">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: t.space.inline.md }}>
          <PlaceholderBox tone="muted" label="inline.*" hint="Padding within an element" minHeight={72} />
          <PlaceholderBox tone="muted" label="stack.*"  hint="Gap between vertical siblings" minHeight={72} />
          <PlaceholderBox tone="muted" label="section.*" hint="Space between whole sections" minHeight={72} />
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Pick a density per surface",     description: "The card decides Compact once; every gap and pad in it inherits from that decision." },
            { title: "Use section.* between sections", description: "Section spacing is a separate scale from inline spacing — do not conflate." },
          ]}
          donts={[
            { title: "'Just a 14px padding here'",     description: "14 is not on the scale. Round to the nearest token and adjust the surrounding layout instead." },
            { title: "Ad-hoc margin resets",           description: "If margin fights layout, the components on that surface disagree about density. Fix the disagreement." },
          ]}
        />
      </DocBlock>

      <Callout tone="warning">
        The most common way this rule fails: someone drops a component into a slightly-wrong context, then patches the fit with
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>marginTop</code>
        or negative spacing. Both are token-scale escapes — remove the component or fix the container.
      </Callout>
    </DocPage>
  );
}
