import { DocPage, DocBlock, PlaceholderBox, RuleList, DoDontGrid, Callout, t } from "./_shared";

export function LayoutRulesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Layout is a system-level decision"
        lead="Layout consistency is what makes hc1 products feel like siblings rather than cousins. Every module — ClinicalIQ, SourceIQ, and everything after — obeys the same content widths, section rhythms, and stacking rules. Individual screens do not get to invent new ones."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Content width is capped by role — reading columns max 720px, dashboard columns max 1200px, table surfaces span the container." },
            { tone: "must",     text: "Section-to-section spacing uses the section.* spacing family (sm / md / lg / xl) — never inline or stack values." },
            { tone: "must",     text: "Grid alignment is 4px-based. All column starts and gutters resolve to spacing tokens." },
            { tone: "should",   text: "Containers stack top-to-bottom below md; side-by-side at md and up. Never invent a different responsive break." },
            { tone: "must-not", text: "Never introduce new layout primitives (a bespoke Row, Column, or Stack). Compose with flex / grid + spacing tokens." },
            { tone: "should",   text: "Adjacent cards use the same padding density. Do not mix a Compact card next to a Relaxed one." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Content widths">
        <div style={{ display: "grid", gap: t.space.stack.sm }}>
          <PlaceholderBox tone="muted" label="Reading column · max 720px" minHeight={40} width={480} />
          <PlaceholderBox tone="muted" label="Dashboard column · max 1200px" minHeight={40} width="80%" />
          <PlaceholderBox tone="muted" label="Table / worklist · full container" minHeight={40} width="100%" />
        </div>
      </DocBlock>

      <DocBlock title="Section spacing">
        <div
          style={{
            padding: t.space.inline.xl,
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            display: "flex",
            flexDirection: "column",
            gap: t.space.section.md,
          }}
        >
          <PlaceholderBox tone="muted" label="Section A" hint="section.md between siblings" minHeight={56} />
          <PlaceholderBox tone="muted" label="Section B" minHeight={56} />
          <PlaceholderBox tone="muted" label="Section C" minHeight={56} />
        </div>
      </DocBlock>

      <DocBlock title="Responsive stacking">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: t.space.inline.md }}>
          <PlaceholderBox tone="muted" label="Below md" hint="Stacks vertically, full-width children" minHeight={72} />
          <PlaceholderBox tone="muted" label="md and up" hint="Side-by-side, gap = inline.lg" minHeight={72} />
          <PlaceholderBox tone="muted" label="lg and up" hint="Reveals right-rail if the layout defines one" minHeight={72} />
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Contain first, then align",   description: "Set the container width once; children align to its bounds via flex/grid — not with hand-tuned margins." },
            { title: "One rhythm per surface",      description: "A dashboard's section spacing is chosen once; every panel obeys it." },
          ]}
          donts={[
            { title: "Bespoke Row/Stack wrappers",  description: "flex / grid + spacing tokens do this natively. Wrappers accumulate maintenance." },
            { title: "Width-per-screen hacks",      description: "'This screen looks best at 960' is a screen-specific override that becomes a system inconsistency." },
          ]}
        />
      </DocBlock>

      <Callout tone="note">
        If a screen genuinely needs a layout the system doesn't offer, propose it as a Template (see the Templates section).
        Templates ARE the way to introduce a new page shape.
      </Callout>
    </DocPage>
  );
}
