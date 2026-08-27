import { DocPage, DocBlock, PlaceholderBox, RuleList, DoDontGrid, Callout, t } from "./_shared";

type Semantic = { name: string; usage: string; forbidden: string; tone: React.ComponentProps<typeof PlaceholderBox>["tone"] };

const SEMANTICS: Semantic[] = [
  { name: "Brand",   usage: "Primary actions only — the one CTA per surface, links, focus rings.",     forbidden: "Never for decoration or backgrounds larger than the CTA itself.", tone: "brand"   },
  { name: "Accent",  usage: "Highlights only — new-feature badges, promotional callouts.",              forbidden: "Never for actions. Never for status.",                            tone: "accent"  },
  { name: "Success", usage: "Positive system feedback — save confirmations, validation-passed messages.", forbidden: "Never a 'save' button color. Never for actions of any kind.",   tone: "success" },
  { name: "Warning", usage: "Needs attention — approaching limits, deprecation notices.",              forbidden: "Never for errors. Warning is not the same as danger.",            tone: "warning" },
  { name: "Danger",  usage: "Destructive actions and hard errors.",                                    forbidden: "Never for validation warnings. Never for 'attention' effects.",   tone: "danger"  },
  { name: "Info",    usage: "Neutral information — tips, ambient context.",                            forbidden: "Never for status. Info is context, not judgment.",                tone: "brand"   },
];

export function ColorUsageDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Color has meaning — never decoration"
        lead="Every semantic color is scoped to a single intent. Users learn the mapping once (danger = destructive, success = positive feedback) and rely on it everywhere. Reusing a color for a second meaning breaks the mapping and forces users to read context to decode intent."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Use the semantic alias that names the intent — action.primary, status.success, etc." },
            { tone: "must-not", text: "Never assign color from a scale directly (color.brand[500]). Aliases only." },
            { tone: "must",     text: "Every colored surface pairs with a designated text token — status.success.bg pairs with status.success.fg. Do not mix pairs." },
            { tone: "must-not", text: "Never use color as the only signal — pair with an icon, label, or shape for accessibility." },
            { tone: "must",     text: "Meet WCAG AA contrast (4.5:1 body, 3:1 large text) for every text-on-background combination." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Semantic map">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: t.space.inline.lg }}>
          {SEMANTICS.map(s => (
            <div
              key={s.name}
              style={{
                border: `1px solid ${t.color.border.subtle}`,
                borderRadius: t.radius.control,
                background: t.color.background.default,
                padding: t.space.inline.lg,
                display: "flex",
                flexDirection: "column",
                gap: t.space.stack.sm,
              }}
            >
              <PlaceholderBox tone={s.tone} label={s.name} align="center" minHeight={48} />
              <div style={{ ...t.type.bodyS, color: t.color.text.primary, fontWeight: 600 }}>Use for</div>
              <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{s.usage}</div>
              <div style={{ ...t.type.bodyS, color: t.color.text.primary, fontWeight: 600, marginTop: t.space.stack.xs }}>Never for</div>
              <div style={{ ...t.type.caption, color: t.color.status.error.fg }}>{s.forbidden}</div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Common mistakes">
        <DoDontGrid
          dos={[
            { title: "Green for feedback",     description: "'Saved successfully' — feedback that a positive thing happened. That's the whole use." },
            { title: "Red for destructive",    description: "Delete, remove, revoke — the user can't easily undo this action." },
          ]}
          donts={[
            { title: "Green 'Save' button",    description: "'Save' is a primary action, not a feedback event. Use brand." },
            { title: "Yellow for errors",      description: "Warning means 'heads up'; error means 'this failed'. Not interchangeable." },
            { title: "Accent for status pills",description: "Accent is for freshness and highlights, not for conveying condition." },
          ]}
        />
      </DocBlock>

      <Callout tone="warning">
        The most common violation: someone reuses a status color as a decoration because it 'looks nice'. This is the single
        biggest source of accessibility regressions in mature design systems. Reviewers should call it every time.
      </Callout>
    </DocPage>
  );
}
