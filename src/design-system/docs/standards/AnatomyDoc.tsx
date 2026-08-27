import { DocPage, DocBlock, PlaceholderBox, RuleList, Callout, t } from "./_shared";

export function AnatomyDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Every component has a defined anatomy"
        lead="Anatomy names the parts. Once every part has a name, prop APIs, ARIA relationships, and slot composition follow mechanically — there is nothing left to invent. Anatomy is documented before any render code is written."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every component has a documented anatomy diagram before implementation begins." },
            { tone: "must",     text: "Anatomy part names match prop / slot / testId names 1:1." },
            { tone: "should",   text: "Prefer named slots over positional children when a component has multiple named regions." },
            { tone: "must-not", text: "Introduce a new anatomy part in the render code without updating the anatomy diagram first." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Button anatomy">
        <ButtonAnatomy />
      </DocBlock>

      <DocBlock title="Input anatomy">
        <InputAnatomy />
      </DocBlock>

      <DocBlock title="Card anatomy">
        <CardAnatomy />
      </DocBlock>

      <Callout tone="info">
        These diagrams use placeholder blocks — they are documentation, not the components themselves. The actual
        Button, Input, and Card ship in later PRs and must match these anatomies exactly.
      </Callout>
    </DocPage>
  );
}

function ButtonAnatomy() {
  return (
    <div
      style={{
        border: `1px dashed ${t.color.border.strong}`,
        borderRadius: t.radius.control,
        padding: t.space.inline.xl,
        background: t.color.background.subtle,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: t.space.inline.sm,
          padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
          border: `1px solid ${t.color.action.primary}`,
          borderRadius: t.radius.control,
          background: t.color.action.primary,
          color: t.color.text.inverse,
        }}
      >
        <span style={{ width: 14, height: 14, background: t.color.text.inverse, opacity: 0.6, borderRadius: 3 }} aria-hidden="true" />
        <span style={{ ...t.type.bodyS, fontWeight: 600 }}>Label</span>
        <span style={{ width: 14, height: 14, background: t.color.text.inverse, opacity: 0.6, borderRadius: 3 }} aria-hidden="true" />
      </div>
      <PartsGrid
        parts={[
          { name: "Container",         desc: "Bounding box that owns background, border, radius, focus ring." },
          { name: "Leading Icon",      desc: "Optional. Aligns baseline-center with the label." },
          { name: "Label",             desc: "Required. Uses button typography role; never truncates mid-word." },
          { name: "Trailing Icon",     desc: "Optional. Common for menu buttons and directional actions." },
          { name: "Loading Indicator", desc: "Replaces the label region when the button is in a loading state." },
        ]}
      />
    </div>
  );
}

function InputAnatomy() {
  return (
    <div
      style={{
        border: `1px dashed ${t.color.border.strong}`,
        borderRadius: t.radius.control,
        padding: t.space.inline.xl,
        background: t.color.background.subtle,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, maxWidth: 360 }}>
        <PlaceholderBox tone="muted" label="Label"           hint="Required. Describes the input." dashed minHeight={28} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: t.space.inline.sm,
            alignItems: "center",
            padding: `${t.space.inline.sm} ${t.space.inline.md}`,
            border: `1px solid ${t.color.border.default}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
          }}
        >
          <span style={{ width: 14, height: 14, background: t.color.text.tertiary, opacity: 0.5, borderRadius: 3 }} aria-hidden="true" />
          <span style={{ ...t.type.body, color: t.color.text.tertiary }}>Input Field</span>
          <span style={{ width: 14, height: 14, background: t.color.text.tertiary, opacity: 0.5, borderRadius: 3 }} aria-hidden="true" />
        </div>
        <PlaceholderBox tone="muted" label="Helper Text"     hint="Optional. Neutral guidance below the field." dashed minHeight={20} />
        <PlaceholderBox tone="warning" label="Validation Message" hint="Optional. Replaces helper when there's an error." dashed minHeight={20} />
        <PlaceholderBox tone="muted" label="Character Count" hint="Optional. Right-aligned when present." dashed minHeight={20} />
      </div>
      <PartsGrid
        parts={[
          { name: "Label",              desc: "Programmatically associated via htmlFor. Never a placeholder-only field." },
          { name: "Input Field",        desc: "Container for the leading icon, the input, and the trailing icon." },
          { name: "Helper Text",        desc: "Neutral hint. Aria-describedby links it to the field." },
          { name: "Validation Message", desc: "Replaces helper on error. Uses status.error tokens." },
          { name: "Character Count",    desc: "Optional. Updates on every keystroke; polite live region." },
          { name: "Leading Icon",       desc: "Optional. Read as decorative unless it conveys unique meaning." },
          { name: "Trailing Icon",      desc: "Optional. Interactive if it's a clear button; announce label if so." },
        ]}
      />
    </div>
  );
}

function CardAnatomy() {
  return (
    <div
      style={{
        border: `1px dashed ${t.color.border.strong}`,
        borderRadius: t.radius.control,
        padding: t.space.inline.xl,
        background: t.color.background.subtle,
      }}
    >
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.surface,
          background: t.color.background.default,
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: t.space.inline.xl, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginBottom: 2 }}>Header</div>
          <div style={{ ...t.type.headingS, color: t.color.text.primary }}>Title</div>
          <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>Description</div>
        </div>
        <div style={{ padding: t.space.inline.xl }}>
          <PlaceholderBox tone="muted" label="Content" dashed minHeight={64} />
        </div>
        <div
          style={{
            padding: t.space.inline.xl,
            borderTop: `1px solid ${t.color.border.subtle}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>Footer</div>
          <div style={{ display: "flex", gap: t.space.inline.sm }}>
            <PlaceholderBox tone="muted"   label="Action" minHeight={28} />
            <PlaceholderBox tone="brand"   label="Action" minHeight={28} />
          </div>
        </div>
      </div>
      <PartsGrid
        parts={[
          { name: "Header",      desc: "Title + optional description + optional trailing meta." },
          { name: "Title",       desc: "Uses heading-s role. Anchors the card semantically." },
          { name: "Description", desc: "Optional supporting line. Uses body-small role." },
          { name: "Content",     desc: "The scoped work area. Any composition is allowed here." },
          { name: "Actions",     desc: "Ordered from lowest to highest emphasis, right-aligned." },
          { name: "Footer",      desc: "Optional. Meta info, secondary actions, or timestamps." },
        ]}
      />
    </div>
  );
}

function PartsGrid({ parts }: { parts: { name: string; desc: string }[] }) {
  return (
    <div
      style={{
        marginTop: t.space.section.sm,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: t.space.inline.md,
      }}
    >
      {parts.map(p => (
        <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{p.name}</span>
          <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{p.desc}</span>
        </div>
      ))}
    </div>
  );
}
