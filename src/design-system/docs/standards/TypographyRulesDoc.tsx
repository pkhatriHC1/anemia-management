import { DocPage, DocBlock, RuleList, DoDontGrid, Callout, t } from "./_shared";
import type { TypographyStyle } from "../../tokens";

type Group = {
  name: string;
  usage: string;
  scope: string;
  samples: { token: keyof typeof t.type; label: string }[];
};

const GROUPS: Group[] = [
  {
    name: "Display",
    usage: "Marketing only — hero moments, splash screens, empty-state anchors.",
    scope: "Not for in-product surfaces.",
    samples: [
      { token: "displayXL", label: "displayXL" },
      { token: "displayL",  label: "displayL"  },
    ],
  },
  {
    name: "Headings",
    usage: "Page hierarchy — page title, section title, subsection title.",
    scope: "One headingXL per page. Descend one step per nesting level.",
    samples: [
      { token: "headingXL", label: "headingXL" },
      { token: "headingL",  label: "headingL"  },
      { token: "headingM",  label: "headingM"  },
      { token: "headingS",  label: "headingS"  },
    ],
  },
  {
    name: "Body",
    usage: "Reading — paragraphs, descriptions, table cell content, help text.",
    scope: "Default for long-form content. Body-small for compact surfaces.",
    samples: [
      { token: "bodyL", label: "bodyL" },
      { token: "body",  label: "body"  },
      { token: "bodyS", label: "bodyS" },
    ],
  },
  {
    name: "Label",
    usage: "Controls — form labels, button labels, tab labels.",
    scope: "Any element that names an input or a control.",
    samples: [
      { token: "label", label: "label" },
    ],
  },
  {
    name: "Caption",
    usage: "Supporting information — timestamps, footnotes, meta.",
    scope: "Never for primary content or actionable text.",
    samples: [
      { token: "caption", label: "caption" },
    ],
  },
];

export function TypographyRulesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Type has roles — never sizes"
        lead="Components choose a typography role (headingM, body, label). They never pick a font-size, weight, or leading independently. Roles are the vocabulary; primitive typography values are internal implementation. If a role feels wrong for a component, the fix is usually a wrong role choice, not a new role."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Apply typography by spreading the whole role object — every role bundles size, weight, leading, and tracking together." },
            { tone: "must-not", text: "Never write raw font-size / line-height / font-weight in a component." },
            { tone: "must",     text: "One headingXL per page. Section titles are headingL; subsections are headingM." },
            { tone: "must-not", text: "Never italicize as a system convention. Italic is reserved for citations and inline foreign words." },
            { tone: "must",     text: "Numbers in tables, KPIs, and lab values use tabular-nums to prevent digit jitter." },
            { tone: "should",   text: "Never mix Display roles with in-product surfaces. Display is marketing." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Role groups">
        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
          {GROUPS.map(g => (
            <GroupCard key={g.name} g={g} />
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Spread the role",                  description: "style={{ ...typography.headingM }} — bundle stays intact." },
            { title: "Match role to semantic meaning",   description: "A section title is headingL because it's a section title, not because 24px looks right." },
          ]}
          donts={[
            { title: "Pick 15px because it 'fits'",      description: "Odd sizes destroy vertical rhythm. If 14 is too small and 16 too big, the layout is wrong, not the type." },
            { title: "Overriding font-weight per component", description: "Weight is bundled with role. Overriding one channel breaks the pairing the role encodes." },
          ]}
        />
      </DocBlock>

      <Callout tone="info">
        The one exception is number rendering — you may apply <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3 }}>font-variant-numeric: tabular-nums</code> on top of any role. Everything else is packaged.
      </Callout>
    </DocPage>
  );
}

function GroupCard({ g }: { g: Group }) {
  return (
    <div
      style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        padding: t.space.inline.lg,
        background: t.color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.md,
      }}
    >
      <div>
        <div style={{ ...t.type.headingS, color: t.color.text.primary }}>{g.name}</div>
        <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>{g.usage}</div>
        <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: 2 }}>{g.scope}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
        {g.samples.map(s => {
          const style = t.type[s.token] as TypographyStyle;
          return (
            <div key={s.token} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ ...style, color: t.color.text.primary }}>{previewFor(s.token)}</div>
              <code style={{ fontFamily: t.font.mono, fontSize: 11, color: t.color.text.tertiary }}>
                typography.{s.label} · {style.fontSize} / {style.lineHeight} / {style.fontWeight}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function previewFor(token: keyof typeof t.type) {
  switch (token) {
    case "displayXL":
    case "displayL":   return "Marketing hero";
    case "headingXL":  return "Page title";
    case "headingL":   return "Section title";
    case "headingM":   return "Subsection title";
    case "headingS":   return "Group heading";
    case "bodyL":      return "Lead paragraph for reading-heavy content.";
    case "body":       return "Standard body copy — the workhorse role.";
    case "bodyS":      return "Compact body for table cells and secondary paragraphs.";
    case "label":      return "STATUS · MRN · DEPARTMENT";
    case "caption":    return "Timestamps and supporting meta.";
    default:           return token;
  }
}
