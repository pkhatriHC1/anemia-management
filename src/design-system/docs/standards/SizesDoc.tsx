import { DocPage, DocBlock, PlaceholderBox, RuleList, Callout, t } from "./_shared";

type Size = {
  name: string;
  usage: string;
  height: number;
  typo: keyof typeof t.type;
  padY: string;
  padX: string;
};

const SIZES: Size[] = [
  { name: "XS", usage: "Dense inline chips, keyboard-shortcut hints, tag rows.",   height: 20, typo: "caption", padY: t.space.stack.xs, padX: t.space.inline.xs },
  { name: "SM", usage: "Table row actions, filter bars, secondary toolbars.",      height: 28, typo: "caption", padY: t.space.stack.xs, padX: t.space.inline.sm },
  { name: "MD", usage: "Default control size for forms, primary page actions.",    height: 36, typo: "bodyS",   padY: t.space.stack.sm, padX: t.space.inline.md },
  { name: "LG", usage: "Landing hero CTAs, prominent single-action surfaces.",     height: 44, typo: "body",    padY: t.space.stack.md, padX: t.space.inline.lg },
  { name: "XL", usage: "Marketing, empty-state prompts, splash actions only.",     height: 56, typo: "bodyL",   padY: t.space.stack.lg, padX: t.space.inline.xl },
];

export function SizesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Five sizes, no in-betweens"
        lead="Every component supporting size ships exactly these five options. Sizes are not free parameters — they resolve to specific combinations of spacing tokens, typography roles, and control-height contracts. A component that does not fit the five-size ladder needs a design review, not a new size."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Component size props accept exactly XS / SM / MD / LG / XL. MD is the default." },
            { tone: "must-not", text: "Never introduce arbitrary pixel sizes ('height: 32') — every size resolves to spacing + typography tokens." },
            { tone: "must",     text: "Icons scale with size: XS 12 · SM 14 · MD 16 · LG 20 · XL 24 (in px)." },
            { tone: "should",   text: "Not every component supports every size — document the supported subset in its anatomy page." },
            { tone: "must",     text: "Interactive controls at MD or larger meet the 44px touch target on touch inputs (extend hit area if needed)." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Visual examples">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.stack.md,
            padding: t.space.inline.xl,
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
          }}
        >
          {SIZES.map(s => (
            <div
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "48px minmax(180px, 260px) 1fr",
                gap: t.space.inline.lg,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  ...t.type.bodyS,
                  fontWeight: 700,
                  color: t.color.action.primary,
                  fontFamily: t.font.mono,
                }}
              >
                {s.name}
              </span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: t.space.inline.xs,
                    height: s.height,
                    padding: `0 ${s.padX}`,
                    background: t.color.action.primary,
                    color: t.color.text.inverse,
                    borderRadius: t.radius.control,
                    ...t.type[s.typo],
                    fontWeight: 600,
                  }}
                >
                  Label
                </div>
              </div>
              <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{s.usage}</span>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Density mapping">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: t.space.inline.md }}>
          <PlaceholderBox tone="muted" label="Compact · XS / SM"    hint="Tables, filters, toolbars"      minHeight={72} />
          <PlaceholderBox tone="muted" label="Comfortable · MD"     hint="Forms, dialogs, most surfaces"  minHeight={72} />
          <PlaceholderBox tone="muted" label="Relaxed · LG / XL"    hint="Empty states, hero CTAs"        minHeight={72} />
        </div>
      </DocBlock>

      <Callout tone="warning">
        Do not solve 'this doesn't fit' by picking a smaller size. Fix the layout — sizes are not padding controls.
      </Callout>
    </DocPage>
  );
}
