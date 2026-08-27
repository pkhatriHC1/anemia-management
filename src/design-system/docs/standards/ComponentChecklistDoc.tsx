import { DocPage, DocBlock, Checklist, Callout, t } from "./_shared";

const TOKENS = [
  { text: "Uses semantic aliases only",       hint: "Never reaches past to primitives (color.brand[500], space[16])." },
  { text: "No hardcoded colors",              hint: "Every color resolves to aliases.color.*." },
  { text: "No hardcoded spacing",             hint: "Every padding, gap, and margin resolves to aliases.spacing.*." },
  { text: "No hardcoded typography",          hint: "Font sizing / weight / leading come from aliases.typography.*." },
  { text: "Uses elevation aliases only",      hint: "No bespoke box-shadow values." },
  { text: "Motion via tokens",                hint: "Durations and easings come from aliases.motion." },
];

const BEHAVIOR = [
  { text: "Responsive",                        hint: "Renders correctly at sm / md / lg / xl / 2xl breakpoints." },
  { text: "Keyboard accessible",               hint: "Reachable via Tab; operable via Enter / Space / arrow keys as appropriate." },
  { text: "Focus state",                       hint: "Visible 2px focus ring at 2px offset in the brand focus color." },
  { text: "Disabled state",                    hint: "aria-disabled=true, tabIndex=-1, uses disabled tokens." },
  { text: "Loading state",                     hint: "aria-busy=true, preserves layout dimensions, announces politely." },
  { text: "Reduced-motion friendly",           hint: "Transitions collapse to instant under prefers-reduced-motion: reduce." },
];

const QUALITY = [
  { text: "Proper spacing (density is picked)",hint: "Component sits at one density — Compact / Comfortable / Relaxed — not a mix." },
  { text: "Correct typography role",           hint: "Text uses a documented role (heading, body, label, caption)." },
  { text: "Supports dark mode",                hint: "Renders correctly under the dark palette (once dark alias set ships)." },
  { text: "Documented anatomy",                hint: "Every named part in code matches the anatomy diagram." },
  { text: "Documented variants and sizes",     hint: "The variant enum and size enum match the standards documentation." },
  { text: "Has documentation",                 hint: "Purpose, Rules, Visual Examples, Best Practices, Common Mistakes, Implementation Notes." },
  { text: "Has tests",                         hint: "Interaction, accessibility, and visual regression coverage." },
];

export function ComponentChecklistDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="The gate every component must pass"
        lead="This list is the acceptance criteria for every future hc1 component. It is not a suggestion — a component that fails any item is not ready to merge. Reviewers check this list explicitly; PR authors self-check before requesting review."
      />

      <DocBlock title="Token compliance">
        <Checklist items={TOKENS} columns={2} />
      </DocBlock>

      <DocBlock title="Interactive behavior">
        <Checklist items={BEHAVIOR} columns={2} />
      </DocBlock>

      <DocBlock title="Quality and documentation">
        <Checklist items={QUALITY} columns={2} />
      </DocBlock>

      <Callout tone="info" title="How to use this checklist">
        Copy the checklist into every component-shipping PR description. Tick each box before requesting review. Reviewers
        should not approve a PR that has unchecked items — the request-review loop is the enforcement mechanism.
      </Callout>

      <div
        style={{
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          padding: t.space.inline.lg,
          background: t.color.background.subtle,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.xs,
        }}
      >
        <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.text.primary }}>
          Success criterion for this PR
        </div>
        <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
          Another engineer — or another Claude Code session — should be able to build any future hc1 component solely by reading
          the Standards section. If a component ship needs a design decision that this documentation does not answer, the gap is
          in this documentation, not in the engineer.
        </div>
      </div>
    </DocPage>
  );
}
