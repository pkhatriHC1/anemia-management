import { aliases, primitives } from "../../tokens";
import type { ColorScale } from "../../tokens";

const { color: alias, typography, spacing, radius } = aliases;
const { color: primitive } = primitives;

type ScaleEntry = { name: string; scale: ColorScale; note: string };
const SCALES: ScaleEntry[] = [
  {
    name: "brand",
    scale: primitive.brand,
    note: "Base #0D7782 — HC1 platform primary. Blended from ClinicalIQ's #1C6882 + SourceIQ's #00A79D.",
  },
  {
    name: "accent",
    scale: primitive.accent,
    note: "Base #B75E0B — amber. CTA + severity high/medium. Contrast-adjusted anchor carries white text at ≥4.5:1.",
  },
  {
    name: "violet",
    scale: primitive.violet,
    note: "Base #6C4DD1 — RESERVED FOR AI moments only. Consumed via the ai.* alias, never decorative.",
  },
  {
    name: "neutral",
    scale: primitive.neutral,
    note: "Custom HC1 cool-neutral bluish grey (~215° hue). Reads clinical rather than consumer-warm.",
  },
  { name: "green",  scale: primitive.green,  note: "Success status. Anchor #2E7028 contrast-adjusted for WCAG AA." },
  { name: "yellow", scale: primitive.yellow, note: "Medium severity — BACKGROUND ONLY. Text on yellow uses accent-700." },
  { name: "red",    scale: primitive.red,    note: "Critical severity + danger action. #B00A2F anchor, medical UI convention." },
  { name: "blue",   scale: primitive.blue,   note: "Supporting utility only — chart series, data-viz. Not a semantic role." },
];

const STEPS: (keyof ColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const ALIAS_GROUPS: { label: string; entries: [string, string][] }[] = [
  {
    label: "background",
    entries: Object.entries(alias.background),
  },
  {
    label: "border",
    entries: Object.entries(alias.border),
  },
  {
    label: "text",
    entries: Object.entries(alias.text),
  },
  {
    label: "action",
    entries: Object.entries(alias.action),
  },
];

const STATUS_GROUPS: [string, { fg: string; bg: string; border: string; icon: string }][] = [
  ["success", alias.status.success],
  ["warning", alias.status.warning],
  ["error",   alias.status.error],
  ["info",    alias.status.info],
];

export function ColorsDoc() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.section.md }}>
      <SubHeading label="Primitive scales" note="Raw values. Never consumed by components directly — see Alias tokens below." />
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.section.sm }}>
        {SCALES.map(({ name, scale, note }) => (
          <ScaleRow key={name} name={name} scale={scale} note={note} />
        ))}
      </div>

      <div style={{ display: "flex", gap: spacing.inline.lg }}>
        <BaseSwatch name="white" value={primitive.white} />
        <BaseSwatch name="black" value={primitive.black} />
      </div>

      <SubHeading label="Alias tokens" note="Semantic role names. This is the layer components must consume." />
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.section.sm }}>
        {ALIAS_GROUPS.map(g => (
          <AliasGroup key={g.label} label={g.label} entries={g.entries} />
        ))}
      </div>

      <SubHeading label="Status tokens" note="Every status role bundles fg / bg / border / icon values." />
      <div style={{ display: "flex", flexDirection: "column", gap: spacing.stack.md }}>
        {STATUS_GROUPS.map(([name, group]) => (
          <StatusRow key={name} name={name} group={group} />
        ))}
      </div>

      <UsageNotes />
    </div>
  );
}

function SubHeading({ label, note }: { label: string; note: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: alias.text.tertiary,
          marginBottom: spacing.stack.xs,
        }}
      >
        {label}
      </div>
      <p style={{ ...typography.bodyS, color: alias.text.secondary, margin: 0 }}>{note}</p>
    </div>
  );
}

function ScaleRow({ name, scale, note }: { name: string; scale: ColorScale; note: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: spacing.inline.sm, marginBottom: spacing.stack.sm }}>
        <span style={{ ...typography.bodyS, fontWeight: 600, color: alias.text.primary }}>
          color.{name}
        </span>
        <span style={{ ...typography.caption, color: alias.text.tertiary }}>{note}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 4 }}>
        {STEPS.map(step => (
          <ColorTile key={step} step={step} value={scale[step]} />
        ))}
      </div>
    </div>
  );
}

function ColorTile({ step, value }: { step: keyof ColorScale; value: string }) {
  const isDark = Number(step) >= 500;
  return (
    <div>
      <div
        style={{
          height: 56,
          background: value,
          borderRadius: radius.control,
          border: `1px solid ${alias.border.subtle}`,
        }}
        aria-label={`${step} · ${value}`}
      />
      <div style={{ marginTop: spacing.stack.xs }}>
        <div style={{ ...typography.caption, fontWeight: 600, color: alias.text.primary }}>
          {step}
        </div>
        <div
          style={{
            ...typography.caption,
            color: alias.text.tertiary,
            fontFamily: primitives.fontFamily.mono,
            fontSize: 10,
          }}
        >
          {value}
        </div>
      </div>
      {/* isDark reserved for future foreground-contrast preview */}
      <span hidden aria-hidden>{isDark ? "" : ""}</span>
    </div>
  );
}

function BaseSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: spacing.inline.md }}>
      <div
        style={{
          width: 48,
          height: 48,
          background: value,
          borderRadius: radius.control,
          border: `1px solid ${alias.border.default}`,
        }}
      />
      <div>
        <div style={{ ...typography.bodyS, fontWeight: 600, color: alias.text.primary }}>
          color.{name}
        </div>
        <div style={{ ...typography.caption, color: alias.text.tertiary, fontFamily: primitives.fontFamily.mono }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function AliasGroup({ label, entries }: { label: string; entries: [string, string][] }) {
  return (
    <div>
      <div style={{ ...typography.bodyS, fontWeight: 600, color: alias.text.primary, marginBottom: spacing.stack.sm }}>
        color.{label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: spacing.inline.md,
        }}
      >
        {entries.map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.inline.sm,
              padding: spacing.inline.sm,
              border: `1px solid ${alias.border.subtle}`,
              borderRadius: radius.control,
              background: alias.background.default,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.chip,
                background: value,
                border: `1px solid ${alias.border.subtle}`,
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ ...typography.caption, fontWeight: 600, color: alias.text.primary }}>{key}</div>
              <div
                style={{
                  ...typography.caption,
                  color: alias.text.tertiary,
                  fontFamily: primitives.fontFamily.mono,
                  fontSize: 10,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusRow({
  name,
  group,
}: {
  name: string;
  group: { fg: string; bg: string; border: string; icon: string };
}) {
  return (
    <div
      style={{
        padding: spacing.inline.md,
        background: group.bg,
        border: `1px solid ${group.border}`,
        borderRadius: radius.control,
        display: "flex",
        alignItems: "center",
        gap: spacing.inline.md,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: radius.circular,
          background: group.icon,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ ...typography.bodyS, fontWeight: 600, color: group.fg }}>
          status.{name}
        </div>
        <div style={{ ...typography.caption, color: group.fg, opacity: 0.9 }}>
          fg {group.fg} · bg {group.bg} · border {group.border} · icon {group.icon}
        </div>
      </div>
    </div>
  );
}

function UsageNotes() {
  return (
    <div
      style={{
        padding: spacing.inline.xl,
        borderRadius: radius.surface,
        background: alias.background.subtle,
        border: `1px solid ${alias.border.subtle}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: alias.text.tertiary,
          marginBottom: spacing.stack.sm,
        }}
      >
        Usage
      </div>
      <ul
        style={{
          ...typography.bodyS,
          color: alias.text.secondary,
          margin: 0,
          paddingLeft: spacing.inline.lg,
          display: "flex",
          flexDirection: "column",
          gap: spacing.stack.xs,
        }}
      >
        <li>
          Components import <code style={monoInline}>aliases.color.*</code> only. Reaching past to a raw scale is a token-boundary violation.
        </li>
        <li>
          Adding a new role? Add to the alias layer first, then let a component consume it.
        </li>
        <li>
          Contrast: the 700 shade of every ramp is the safe on-white text choice; 500 is the on-white large-text / on-dark small-text choice.
        </li>
      </ul>
    </div>
  );
}

const monoInline = {
  fontFamily: primitives.fontFamily.mono,
  fontSize: 12,
  background: alias.background.muted,
  padding: "1px 6px",
  borderRadius: 4,
} as const;
