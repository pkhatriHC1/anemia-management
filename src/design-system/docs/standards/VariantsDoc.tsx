import { DocPage, DocBlock, PlaceholderBox, RuleList, DoDontGrid, Callout, t } from "./_shared";

type Variant = {
  name: string;
  tone: React.ComponentProps<typeof PlaceholderBox>["tone"];
  purpose: string;
  when: string;
  emphasis: number;
};

const VARIANTS: Variant[] = [
  { name: "Filled",    tone: "brand",   purpose: "Primary actions",       when: "The most important thing the user should do on this screen.",  emphasis: 5 },
  { name: "Secondary", tone: "muted",   purpose: "Supporting actions",    when: "Alternatives to the primary — 'Cancel', 'View details'.",     emphasis: 3 },
  { name: "Ghost",     tone: "neutral", purpose: "Low emphasis",          when: "Tertiary actions in dense layouts; toolbar buttons.",         emphasis: 1 },
  { name: "Danger",    tone: "danger",  purpose: "Destructive actions",   when: "Deletes, disables, unrecoverable operations.",                emphasis: 4 },
  { name: "Success",   tone: "success", purpose: "Positive feedback only",when: "Feedback surfaces only — never actions.",                     emphasis: 4 },
  { name: "Info",      tone: "brand",   purpose: "Informational",         when: "Informational callouts, badges, tags.",                       emphasis: 2 },
];

export function VariantsDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="One variant per intent"
        lead="Every visual variant maps to a single, unambiguous intent. Variants exist to remove decisions — 'is this action destructive?' has a right answer, not a taste answer. When designers reach for a variant to convey a different intent than its documented one, they're inventing a new variant and should propose one instead."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every component ships with a fixed enum of variants — no free-form 'appearance' prop." },
            { tone: "must",     text: "Only one filled (highest-emphasis) variant may appear per action group." },
            { tone: "must-not", text: "Never use Success as an action variant. Success is feedback, not an intent." },
            { tone: "must-not", text: "Never use Danger for anything that isn't destructive or unrecoverable." },
            { tone: "should",   text: "Ghost variants pair well with icon-only buttons in dense toolbars." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Visual examples">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          {VARIANTS.map(v => (
            <VariantCard key={v.name} v={v} />
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "One filled action per group",       description: "The eye needs an anchor. Multiple filled buttons compete." },
            { title: "Danger for destructive intents",    description: "Delete, remove, revoke, disable — anything the user can't undo one-click." },
            { title: "Ghost in dense contexts",           description: "Toolbars, tables, and inline actions where filled would over-index." },
          ]}
          donts={[
            { title: "Success as a 'go' button",          description: "Green save buttons train users to conflate 'this action' with 'success outcome'." },
            { title: "Filled for every action in a row",  description: "If everything is emphasized, nothing is. Demote all but one." },
            { title: "Custom in-between variants",        description: "'Semi-primary' and 'primary-outline' are code smells. Propose a system change or pick an existing variant." },
          ]}
        />
      </DocBlock>

      <Callout tone="info">
        A new variant proposal must include: (a) an intent that no existing variant covers, (b) a written distinction rule that
        answers 'when is this variant right vs. the closest existing one?', and (c) a token addition to the alias layer if new colors are needed.
      </Callout>
    </DocPage>
  );
}

function VariantCard({ v }: { v: Variant }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
      }}
    >
      <PlaceholderBox tone={v.tone} label={v.name} align="center" minHeight={56} />
      <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
        {v.purpose}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{v.when}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: t.space.stack.xs }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              width: 24,
              height: 4,
              borderRadius: 2,
              background: i < v.emphasis ? t.color.action.primary : t.color.background.muted,
            }}
          />
        ))}
        <span style={{ ...t.type.caption, color: t.color.text.tertiary, marginLeft: t.space.inline.xs }}>
          emphasis {v.emphasis}/5
        </span>
      </div>
    </div>
  );
}
