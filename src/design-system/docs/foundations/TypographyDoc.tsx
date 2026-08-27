import { aliases, primitives } from "../../tokens";
import type { TypographyStyle } from "../../tokens";

const { typography, color, spacing, radius } = aliases;

const ROLES: { name: string; token: string; style: TypographyStyle; sample: string }[] = [
  { name: "Display XL",  token: "typography.displayXL",  style: typography.displayXL,  sample: "The intelligence layer" },
  { name: "Display L",   token: "typography.displayL",   style: typography.displayL,   sample: "One patient view" },
  { name: "Heading XL",  token: "typography.headingXL",  style: typography.headingXL,  sample: "Care plan approved" },
  { name: "Heading L",   token: "typography.headingL",   style: typography.headingL,   sample: "Recent lab activity" },
  { name: "Heading M",   token: "typography.headingM",   style: typography.headingM,   sample: "Blood health scorecard" },
  { name: "Heading S",   token: "typography.headingS",   style: typography.headingS,   sample: "Latest orders" },
  { name: "Body L",      token: "typography.bodyL",      style: typography.bodyL,      sample: "Iron supplementation reduces need for transfusion in eligible preoperative patients." },
  { name: "Body",        token: "typography.body",       style: typography.body,       sample: "Body text is the workhorse — reserved for long-form reading and primary content." },
  { name: "Body S",      token: "typography.bodyS",      style: typography.bodyS,      sample: "Compact body — table cells, secondary paragraphs, supporting copy." },
  { name: "Caption",     token: "typography.caption",    style: typography.caption,    sample: "Timestamps, footnotes, meta labels." },
  { name: "Label",       token: "typography.label",      style: typography.label,      sample: "STATUS · MRN · DEPARTMENT" },
];

export function TypographyDoc() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.section.sm }}>
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.stack.lg }}>
        {ROLES.map(role => (
          <TypeRow key={role.token} {...role} />
        ))}
      </div>
    </div>
  );
}

function TypeRow({
  name,
  token,
  style,
  sample,
}: {
  name: string;
  token: string;
  style: TypographyStyle;
  sample: string;
}) {
  return (
    <div
      style={{
        padding: spacing.inline.xl,
        border: `1px solid ${color.border.subtle}`,
        borderRadius: radius.surface,
        background: color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: spacing.stack.sm,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacing.inline.lg,
          alignItems: "baseline",
        }}
      >
        <div style={{ ...typography.caption, fontWeight: 700, color: color.action.primary, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          {name}
        </div>
        <code
          style={{
            fontFamily: primitives.fontFamily.mono,
            fontSize: 12,
            color: color.text.tertiary,
          }}
        >
          {token}
        </code>
        <span style={{ ...typography.caption, color: color.text.tertiary }}>
          {style.fontSize} · {style.lineHeight} · {style.fontWeight} · {style.letterSpacing}
        </span>
      </div>
      <div style={{ ...style, color: color.text.primary }}>{sample}</div>
    </div>
  );
}
