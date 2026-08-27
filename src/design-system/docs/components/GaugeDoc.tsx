import { useState } from "react";
import type { ReactNode } from "react";
import { Gauge } from "../../components/gauge";
import type { GaugeSize } from "../../components/gauge";
import type { SeverityTier } from "../../tokens/aliases/color";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const TIERS: SeverityTier[] = ["critical", "high", "medium", "low", "normal"];
const SIZES: GaugeSize[]    = ["xs", "sm", "md", "lg", "xl"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function GaugeDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <TiersBlock />
      <SizesBlock />
      <FeaturesBlock />
      <A11yBlock />
      <BestPracticesBlock />
      <CommonMistakesBlock />
      <PlaygroundBlock />
      <ExamplesBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
      <BuiltOnBlock />
      <UsedByBlock />
      <MigrationTargetsBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="What Gauge is for"
      lead="A compact radial arc that plots a value on a 0–max scale and colors the arc and numeric readout by severity tier. Designed for risk and status scores — transfusion risk (TRS), ACOG-scaled risk, sepsis risk, any clinical or operational score where the number carries the meaning and the color reinforces urgency."
    >
      <RuleList
        rules={[
          { tone: "must",     text: "The number is the primary signal — the arc + color reinforces it." },
          { tone: "must",     text: "Consumer decides the tier — the Gauge does not map value → tier.", reason: "TRS 6 might be `high` in one pathway and `medium` in another. That's a business rule, not a component rule." },
          { tone: "must-not", text: "Never hardcode hex — colors read from severity aliases (severity.critical … severity.normal)." },
          { tone: "should",   text: "Use for a single score. For multi-value comparisons (percentile bar, range indicator), reach for a different primitive." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      eyebrow="Anatomy"
      title="Track · arc · value"
      lead="A fixed-viewport SVG scaled to the requested diameter. Track (background) is neutral-300; arc (progress) reads the tier color; the numeric readout shares the same tier color and uses tabular-nums so a row of Gauges lines up visually."
    >
      <Tile>
        <Gauge value={6} tier="high" size="lg" />
      </Tile>
    </DocBlock>
  );
}

/* ══════ Tiers ═════════════════════════════════════════════════════ */

function TiersBlock() {
  return (
    <DocBlock
      eyebrow="Tiers"
      title="Five severity levels"
      lead="Each tier renders the arc and value in its corresponding severity.text token. Pair the Gauge with a StatusChip when the tier itself is meaningful — the chip carries the label and icon; the Gauge carries the number."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {TIERS.map((tier) => (
          <Tile key={tier} label={tier}>
            <Gauge value={tierValue(tier)} tier={tier} size="md" />
          </Tile>
        ))}
      </div>
    </DocBlock>
  );
}

function tierValue(tier: SeverityTier): number {
  return tier === "critical" ? 9 : tier === "high" ? 7 : tier === "medium" ? 5 : tier === "low" ? 3 : 1;
}

/* ══════ Sizes ═════════════════════════════════════════════════════ */

function SizesBlock() {
  return (
    <DocBlock
      eyebrow="Sizes"
      title="xs · sm · md · lg · xl"
      lead="Diameter ladder 32 / 40 / 56 / 72 / 96. Aligns with Button / Input / Select so a Gauge sits flush inline with form controls. For one-off layouts (KPI hero, table cell), pass `sizePx` directly."
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 32 }}>
        {SIZES.map((size) => (
          <Tile key={size} label={size}>
            <Gauge value={6} tier="high" size={size} />
          </Tile>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ══════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      eyebrow="Features"
      title="hideValue · custom diameter"
      lead="Two optional features cover the compact / one-off cases that come up in worklists and dashboards."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        <FeatureTile
          title="Custom pixel diameter"
          note="`sizePx={40}` overrides the size ladder for a specific layout."
        >
          <Gauge value={7} tier="high" sizePx={40} />
        </FeatureTile>
        <FeatureTile
          title="hideValue for table cells"
          note="`hideValue` drops the numeric readout. The accessible label still announces the value."
        >
          <Gauge value={7} tier="high" size="sm" hideValue />
        </FeatureTile>
        <FeatureTile
          title="Out-of-range value"
          note="Values > max clamp the arc at full but display the raw number."
        >
          <Gauge value={12} tier="critical" size="md" />
        </FeatureTile>
        <FeatureTile
          title="Percentage (custom max)"
          note="Pass `max={100}` for percentile-style scores."
        >
          <Gauge value={78} max={100} tier="normal" size="md" />
        </FeatureTile>
      </div>
    </DocBlock>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock
      eyebrow="Accessibility"
      title="Announced as a scored role"
      lead="The SVG carries `role='img'` and an `aria-label` in the shape `Score {value} of {max}, {tier}`. Screen readers announce the numeric value AND the tier — so users who miss the color still hear urgency."
    >
      <RuleList
        rules={[
          { tone: "note",     text: "The whole SVG is one label; individual arc/track/value elements are not separately readable." },
          { tone: "should",   text: "Override the label via `ariaLabel` when the score has a unit ('TRS 6 of 10, high risk')." },
          { tone: "must",     text: "`hideValue` hides the number visually but keeps it in the label — never lose the value from assistive tech." },
          { tone: "must-not", text: "Color is never the only signal. Pair with a StatusChip or an adjacent numeric label when tier is decision-critical." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best Practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock eyebrow="Best Practices" title="Do / Don't">
      <DoDontGrid
        dos={[
          { title: "One score, one Gauge", description: "A Gauge shows a single value at a moment. Use it in worklist rows, patient summaries, KPI cards." },
          { title: "Override ariaLabel when the score has a name", description: '`ariaLabel="TRS 6 of 10, high risk"` beats the generic default for domain-specific scores.' },
          { title: "Pair with a StatusChip when tier matters", description: "The chip carries the label + icon; the Gauge carries the number. Colorblind users get both signals." },
        ]}
        donts={[
          { title: "Compare scores in one Gauge", description: "Two arcs on one gauge is a different primitive. Use a chart component or a paired-value visual." },
          { title: "Animate the arc on every render", description: "The 200ms tier-color transition is enough. Animated `value` writes on every render feel busy in a worklist." },
          { title: "Hardcode hex to match a legacy design", description: "If the tier color feels wrong, fix it at the severity alias — never in a Gauge instance." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Common Mistakes ═══════════════════════════════════════════ */

function CommonMistakesBlock() {
  return (
    <DocBlock eyebrow="Common Mistakes" title="What goes wrong">
      <RuleList
        rules={[
          { tone: "must-not", text: "Deriving `tier` from `value` inside the Gauge itself.", reason: "Tier mapping is a business rule; keep it in the caller so different pathways can use different thresholds." },
          { tone: "should",   text: "Using Gauge for a percentile.", reason: "Technically works with max={100}, but a percentile is better shown as a range indicator (min / current / max). Ship a PercentileBar primitive when you need one." },
          { tone: "note",     text: "Small size for large numbers: `xs` (32px) crowds a 3-digit value. Prefer `sm+` for anything above single digits, or `hideValue` in tight cells." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ═══════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [value, setValue] = useState(6);
  const [max, setMax] = useState(10);
  const [tier, setTier] = useState<SeverityTier>("high");
  const [size, setSize] = useState<GaugeSize>("md");
  const [hideValue, setHideValue] = useState(false);

  return (
    <DocBlock eyebrow="Playground" title="Try it live">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            background: t.color.background.surface,
            border: `1px solid ${t.color.border.default}`,
            borderRadius: 12,
            minHeight: 200,
          }}
        >
          <Gauge value={value} max={max} tier={tier} size={size} hideValue={hideValue} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Control label="value">
            <input
              type="range"
              min={0}
              max={max}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{value}</span>
          </Control>
          <Control label="max">
            <select value={max} onChange={(e) => setMax(Number(e.target.value))}>
              <option value={10}>10 (default)</option>
              <option value={100}>100</option>
              <option value={5}>5</option>
            </select>
          </Control>
          <Control label="tier">
            <select value={tier} onChange={(e) => setTier(e.target.value as SeverityTier)}>
              {TIERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Control>
          <Control label="size">
            <select value={size} onChange={(e) => setSize(e.target.value as GaugeSize)}>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Control>
          <Control label="hideValue">
            <input type="checkbox" checked={hideValue} onChange={(e) => setHideValue(e.target.checked)} />
          </Control>
          <pre
            style={{
              margin: "8px 0 0",
              padding: 12,
              background: t.color.background.default,
              border: `1px solid ${t.color.border.default}`,
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              color: t.color.text.primary,
              overflowX: "auto",
            }}
          >
{`<Gauge
  value={${value}}${max !== 10 ? `\n  max={${max}}` : ""}
  tier="${tier}"
  size="${size}"${hideValue ? "\n  hideValue" : ""}
/>`}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Real-world Examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock eyebrow="Real-world examples" title="Where Gauge shows up">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        <ExampleCard title="TRS in a worklist row">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Gauge value={9} tier="critical" size="sm" ariaLabel="TRS 9 of 10, critical" />
            <div>
              <div style={{ ...t.type.body, color: t.color.text.primary, fontWeight: 600 }}>Chen, Alice</div>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>Hgb 7.4 · pre-op</div>
            </div>
          </div>
        </ExampleCard>

        <ExampleCard title="ACOG risk score in patient summary">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Gauge value={5} tier="medium" size="lg" ariaLabel="ACOG risk 5 of 10, medium" />
            <div>
              <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>ACOG Risk</div>
              <div style={{ ...t.type.body, color: t.color.text.primary }}>Medium — monitor</div>
            </div>
          </div>
        </ExampleCard>

        <ExampleCard title="Sepsis risk KPI hero">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Gauge value={78} max={100} tier="high" size="xl" ariaLabel="Sepsis risk 78%, high" />
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>Sepsis risk (24h)</div>
          </div>
        </ExampleCard>

        <ExampleCard title="Compact table cell (hideValue)">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Gauge value={3} tier="low" size="xs" hideValue />
            <span style={{ ...t.type.bodyS, color: t.color.text.primary, fontFeatureSettings: '"tnum"' }}>3 / 10</span>
          </div>
        </ExampleCard>
      </div>
    </DocBlock>
  );
}

/* ══════ Props ════════════════════════════════════════════════════ */

function PropsTableBlock() {
  return (
    <DocBlock eyebrow="Props" title="Gauge API">
      <PropsTable
        rows={[
          ["value", "number", "—", "Current value on the 0–max scale. Arc clamps to range; readout shows raw value."],
          ["max", "number", "10", "Upper bound of the scale."],
          ["tier", "SeverityTier", "—", "critical | high | medium | low | normal"],
          ["size", "GaugeSize", "'md'", "xs | sm | md | lg | xl → 32 / 40 / 56 / 72 / 96 px"],
          ["sizePx", "number", "—", "Explicit diameter in px. Overrides `size`."],
          ["hideValue", "boolean", "false", "Hide the numeric readout; label still announces the value."],
          ["ariaLabel", "string", "auto", "Override the default 'Score {value} of {max}, {tier}' label."],
          ["className", "string", "—", "Applied to the outer wrapper."],
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Tokens Used ══════════════════════════════════════════════ */

function TokensUsedBlock() {
  return (
    <DocBlock eyebrow="Tokens Used" title="Every value comes from an alias">
      <PropsTable
        rows={[
          ["Arc track", "--hc-color-neutral-300", "Track ring behind the progress arc."],
          ["Arc + value (critical)", "--hc-color-red-500", "Consumes severity.critical.text."],
          ["Arc + value (high / medium)", "--hc-color-accent-700", "Consumes severity.{high,medium}.text — same token."],
          ["Arc + value (low)", "--hc-color-neutral-600", "Consumes severity.low.text."],
          ["Arc + value (normal)", "--hc-color-green-500", "Consumes severity.normal.text."],
          ["Value typography", "--hc-font-sans + tabular-nums", "Same numeric-alignment behavior as tables + KPIs."],
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Notes ═══════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock eyebrow="Implementation Notes" title="Non-obvious details">
      <Callout>
        Arc geometry is a fixed 46×30 viewBox SVG path scaled to the requested diameter. The consumer never picks radii — passing `size` or `sizePx` is enough. This keeps every Gauge on the same visual language regardless of container width.
      </Callout>
      <RuleList
        rules={[
          { tone: "note", text: "The `SeverityTier` type comes from `tokens/aliases/color` — shared with StatusChip and any severity-aware component." },
          { tone: "note", text: "Arc color is set via a CSS custom property (`--hc-gauge-arc-color`), which the tier class assigns. Both the arc stroke and the value fill read the same variable so they never drift." },
          { tone: "note", text: "The 200ms arc transition animates on `strokeDasharray` changes — safe under `prefers-reduced-motion: reduce` (transition collapses to 0)." },
          { tone: "note", text: "Values > max clamp the arc at full (100%) but the numeric readout shows the raw value. Deliberate — a lab result of 12 on a 10-scale is worth surfacing, not silently truncating." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Built On / Used By / Migration ════════════════════════════ */

function BuiltOnBlock() {
  return (
    <DocBlock eyebrow="Built On" title="Foundation">
      <RuleList
        rules={[
          { tone: "note", text: "SVG `<path>` for track + arc (a single `M7 24 A16 16 0 0 1 39 24` semicircle)." },
          { tone: "note", text: "`severity` alias from `tokens/aliases/color` for tier → color." },
          { tone: "note", text: "`--hc-color-*` CSS custom properties throughout — no JS color computation." },
        ]}
      />
    </DocBlock>
  );
}

function UsedByBlock() {
  return (
    <DocBlock eyebrow="Used By" title="Where the primitive lives in the wild">
      <RuleList
        rules={[
          { tone: "note", text: "ClinicalIQ · TRS (transfusion risk score) — worklist rows, patient summary, anemia workspace." },
          { tone: "note", text: "ClinicalIQ · ACOG-scaled clinical risk scores in bloodhealth and hercare flows." },
          { tone: "note", text: "Any IQ product · risk/status scores where a 0–10 or 0–100 value carries clinical urgency." },
        ]}
      />
    </DocBlock>
  );
}

function MigrationTargetsBlock() {
  return (
    <DocBlock eyebrow="Migration Targets" title="What this replaces">
      <RuleList
        rules={[
          { tone: "note",     text: "The product-scoped `src/components/hc1/Gauge.tsx` in ClinicalIQ (deleted in Wave 5)." },
          { tone: "should",   text: "Inline hand-rolled TRS/risk arcs in prototypes — migrate opportunistically when a prototype gets promoted to product." },
          { tone: "must-not", text: "Not intended to replace percentile bars, range indicators, or multi-value comparisons. Those are separate primitives." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Layout helpers ════════════════════════════════════════════ */

function Tile({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: 20,
        background: t.color.background.surface,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: 12,
        minWidth: 120,
      }}
    >
      {children}
      {label && (
        <div style={{ ...t.type.caption, color: t.color.text.tertiary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
          {label}
        </div>
      )}
    </div>
  );
}

function FeatureTile({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        background: t.color.background.surface,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 8, minHeight: 80 }}>
        {children}
      </div>
      <div>
        <div style={{ ...t.type.bodyS, color: t.color.text.primary, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{note}</div>
      </div>
    </div>
  );
}

function ExampleCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        background: t.color.background.surface,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: 12,
        minHeight: 140,
      }}
    >
      <div style={{ ...t.type.caption, color: t.color.text.tertiary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>{children}</div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ ...t.type.bodyS, color: t.color.text.secondary, minWidth: 80, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
        {label}
      </span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
    </label>
  );
}

function PropsTable({ rows }: { rows: (string | number)[][] }) {
  return (
    <div style={{ overflow: "auto", border: `1px solid ${t.color.border.default}`, borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: t.color.background.surface }}>
            {rows[0] && rows[0].map((_, i) => (
              <th
                key={i}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderBottom: `1px solid ${t.color.border.default}`,
                  color: t.color.text.tertiary,
                  textTransform: "uppercase",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                {["Prop / Slot", "Type", "Default", "Notes"][i] ?? ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} style={{ borderBottom: r < rows.length - 1 ? `1px solid ${t.color.border.default}` : undefined }}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  style={{
                    padding: "8px 12px",
                    color: c === 0 || c === 1 ? t.color.text.primary : t.color.text.secondary,
                    fontFamily: c === 0 || c === 1 || c === 2 ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
                    fontSize: c === 0 || c === 1 || c === 2 ? 12 : 13,
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
