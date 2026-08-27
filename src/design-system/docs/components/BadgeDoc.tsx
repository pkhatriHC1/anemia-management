import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CircleDot,
  Clock,
  FileText,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "../../components/badge";
import type {
  BadgeAppearance,
  BadgeSize,
  BadgeVariant,
} from "../../components/badge";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: BadgeVariant[]       = ["default", "primary", "success", "warning", "danger", "info", "neutral"];
const APPEARANCES: BadgeAppearance[] = ["soft", "solid", "outline"];
const SIZES: BadgeSize[]             = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function BadgeDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <VariantsBlock />
      <AppearancesBlock />
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
      title="The canonical HC1 Badge"
      lead="Badge is the canonical status-indicator primitive of the HC1 design system. Status pills, meta labels, counters, filter pill visuals, and version tags all compose this Badge rather than reimplementing color pairings. It owns the color-to-meaning map, the size ladder, and the appearance rules — so a 'Success' badge in one product reads exactly like a 'Success' badge in another."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="A Badge is a single inline span with a tone, a weight, and an optional slot for an indicator (dot or leading icon). Everything else is composition."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: t.space.inline.lg,
        }}
      >
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning" leadingIcon={<Clock />}>Pending</Badge>
        <Badge variant="primary">Beta</Badge>
        <Badge variant="danger" count={12} />
        <Badge variant="info" onRemove={() => {}}>Removable</Badge>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Badge"          desc="Root <span>. Owns variant, appearance, size, and disabled state." />
        <Part name="Dot"            desc="Optional variant-colored circle rendered before the label." />
        <Part name="Leading icon"   desc="Optional icon slot before the label. Mutually exclusive with dot." />
        <Part name="Label"          desc="The badge text. Overridden by `count` when provided." />
        <Part name="Trailing icon"  desc="Optional icon after the label. Suppressed when `onRemove` is set." />
        <Part name="Remove control" desc="A real <button> with an accessible name. Only rendered when onRemove is provided." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 13 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Variants ═════════════════════════════════════════════════ */

const VARIANT_META: Record<BadgeVariant, { title: string; usage: string; example: string }> = {
  default: { title: "Default",  usage: "Meta labels — draft, version, MRN. The neutral-but-readable badge.", example: "Draft" },
  primary: { title: "Primary",  usage: "Brand moments — Beta ribbons, product flags. Signature, not decorative.", example: "Beta" },
  success: { title: "Success",  usage: "Completed, healthy, active. The green means it's good.", example: "Active" },
  warning: { title: "Warning",  usage: "Attention, pending, degraded. Needs a look, not a fix.", example: "Pending" },
  danger:  { title: "Danger",   usage: "Failed, blocked, critical. The red means it's broken.", example: "Failed" },
  info:    { title: "Info",     usage: "Informational, non-actionable notice.", example: "New" },
  neutral: { title: "Neutral",  usage: "The quietest badge. For counts, subtle meta, muted tags.", example: "63" },
};

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Seven semantic tones. Pick by meaning — the token layer decides the exact color. Every product uses the same variant for the same meaning."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {VARIANTS.map((v) => (
          <div
            key={v}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
              display: "flex",
              flexDirection: "column",
              gap: t.space.stack.sm,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
              <Badge variant={v}>{VARIANT_META[v].example}</Badge>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
                variant=&quot;{v}&quot;
              </code>
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{VARIANT_META[v].usage}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Appearances ═════════════════════════════════════════════ */

function AppearancesBlock() {
  const APPEARANCE_NOTE: Record<BadgeAppearance, string> = {
    soft:    "Subtle wash + colored ink. The default — quiet enough to sit inside dense tables and dashboards without stealing focus.",
    solid:   "Filled background + inverse ink. High-emphasis — a launch flag, a critical callout, a count on a nav badge. Use sparingly.",
    outline: "Transparent bg + colored border + colored ink. For badges on colored parent surfaces where the soft wash would clash.",
  };

  return (
    <DocBlock
      title="Appearances"
      lead="Three visual weights. Every variant is defined under every appearance — so switching appearance doesn't change meaning."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Appearance</HeaderCell>
          <HeaderCell>Variants (default · primary · success · warning · danger · info · neutral)</HeaderCell>
        </div>
        {APPEARANCES.map((a, i) => (
          <div
            key={a}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === APPEARANCES.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <div>
              <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>
                {a}
              </code>
              <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: 4 }}>{APPEARANCE_NOTE[a]}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: t.space.inline.sm }}>
              {VARIANTS.map((v) => (
                <Badge key={v} variant={v} appearance={a}>
                  {VARIANT_META[v].example}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Sizes ════════════════════════════════════════════════════ */

function SizesBlock() {
  const SIZE_META: Record<BadgeSize, { label: string; height: string; usage: string }> = {
    sm: { label: "Small",  height: "20px", usage: "Dense tables, list rows, inline meta." },
    md: { label: "Medium", height: "24px", usage: "Default. Toolbars, cards, filter tags." },
    lg: { label: "Large",  height: "28px", usage: "Detail headers, page banners, notice callouts." },
  };
  return (
    <DocBlock
      title="Sizes"
      lead="Three steps. Badges are compact by definition — if you need something bigger, you probably want a callout or a Card header, not a badge."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {SIZES.map((s) => (
          <div
            key={s}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
              display: "flex",
              flexDirection: "column",
              gap: t.space.stack.sm,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: t.space.inline.sm, alignItems: "center" }}>
              <Badge size={s} variant="success">Active</Badge>
              <Badge size={s} variant="warning" dot>Pending</Badge>
              <Badge size={s} variant="danger" count={12} />
            </div>
            <div>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary }}>size=&quot;{s}&quot;</code>
              <span style={{ ...t.type.caption, color: t.color.text.tertiary, marginLeft: 8 }}>{SIZE_META[s].height}</span>
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{SIZE_META[s].usage}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ═════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Every feature is a one-prop opt-in. There is no compound API and no configuration explosion — pick the pieces you need."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <FeatureTile
          title="Dot indicator"
          hint="dot"
          desc="Small variant-colored circle rendered before the label. Always uses the variant's solid tone."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap" }}>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
            <Badge variant="danger" dot>Failed</Badge>
            <Badge variant="neutral" dot>Offline</Badge>
          </div>
        </FeatureTile>
        <FeatureTile
          title="Leading icon"
          hint="leadingIcon"
          desc="Icon rendered before the label. Ignored when `dot` is set."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap" }}>
            <Badge variant="success" leadingIcon={<Check />}>Completed</Badge>
            <Badge variant="warning" leadingIcon={<Clock />}>Pending</Badge>
            <Badge variant="info" leadingIcon={<Sparkles />}>New</Badge>
          </div>
        </FeatureTile>
        <FeatureTile
          title="Trailing icon"
          hint="trailingIcon"
          desc="Icon after the label. Not rendered when the badge is removable."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap" }}>
            <Badge variant="primary" trailingIcon={<ArrowRight />}>Next</Badge>
            <Badge variant="danger"  trailingIcon={<Bell />}>Alert</Badge>
          </div>
        </FeatureTile>
        <FeatureTile
          title="Numeric count"
          hint="count / maxCount"
          desc="Pill shape for numbers. Values above maxCount render as `${maxCount}+`."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap", alignItems: "center" }}>
            <Badge variant="primary" count={3} />
            <Badge variant="primary" count={42} />
            <Badge variant="danger"  count={128} />
            <Badge variant="neutral" count={9999} maxCount={999} />
          </div>
        </FeatureTile>
        <FeatureTile
          title="Removable"
          hint="onRemove"
          desc="Trailing X becomes a real button with an accessible name. The badge itself is not a button."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap" }}>
            <Badge variant="default" onRemove={() => {}}>Draft</Badge>
            <Badge variant="primary" onRemove={() => {}}>Beta</Badge>
            <Badge variant="success" onRemove={() => {}} dot>Signed</Badge>
          </div>
        </FeatureTile>
        <FeatureTile
          title="Disabled"
          hint="disabled"
          desc="Dims the badge and disables the remove control. Purely visual — the badge is not a form control."
        >
          <div style={{ display: "flex", gap: t.space.inline.sm, flexWrap: "wrap" }}>
            <Badge variant="success" disabled>Active</Badge>
            <Badge variant="info" disabled onRemove={() => {}}>Filter</Badge>
            <Badge variant="danger" disabled count={5} />
          </div>
        </FeatureTile>
      </div>
    </DocBlock>
  );
}

function FeatureTile({ title, hint, desc, children }: { title: string; hint: string; desc: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: t.space.inline.sm }}>
        <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
        <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{hint}</code>
      </div>
      <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{desc}</div>
      <div style={{ padding: `${t.space.inline.md} 0` }}>{children}</div>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The badge text carries the meaning — never rely on color alone to communicate status. A red badge that says 'Failed' is legible; a red dot without a label is not." },
          { tone: "must", text: "Every appearance × variant pairing meets WCAG AA (4.5:1 for text ≥ 14px, 3:1 for text ≥ 18px) on the design-system background swatches." },
          { tone: "must", text: "Icons inside the badge are aria-hidden by default — they're decorative alongside the text label. If the icon is the only content (icon-only meta), pass an aria-label on the root." },
          { tone: "must", text: "The remove control is a real <button> with an accessible name (via the `removeLabel` prop, default 'Remove'). It uses the same 2px brand focus ring used across Button, Input, Select, Card, Dialog, and Table." },
          { tone: "must", text: "Disabled badges get aria-disabled='true'. The remove control receives native `disabled` so it is skipped in the tab order." },
          { tone: "must", text: "The badge itself is inline non-interactive — it is not tabbable, does not receive focus, and never has role='button'. Only the remove control is interactive." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the color/background transitions to 0ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Use the semantic variant every time",  description: "Success for completed, Warning for pending, Danger for failed. Same variant → same meaning across every HC1 product." },
          { title: "Default to soft appearance",           description: "Soft badges sit inside dense surfaces without stealing focus. Reach for solid only for genuine emphasis." },
          { title: "Pair color with text",                 description: "Add a label, an icon, or an aria-label — never rely on color alone to convey the status." },
          { title: "Use count for numeric counters",       description: "The pill shape + tabular-nums + auto-cap ('99+') is what makes a count read as a count and not a dense chip." },
        ]}
        donts={[
          { title: "Use a badge as a button",              description: "Badges are not interactive. If it needs a click, it's a Button — the visual density is wrong for a target that resists hover states." },
          { title: "Invent a new variant for a one-off",   description: "There are exactly seven. If a new one seems necessary, the label almost always fixes it. Purple is not a status." },
          { title: "Chain three badges to show a workflow", description: "Two is a legend; three is a mess. If the row needs a workflow, use a Stepper or a Timeline — not a stack of pills." },
          { title: "Stretch a badge to a full-width block", description: "Badges are inline. If it needs to span a row, it's a Callout, an Alert, or a Card header — not a Badge." },
        ]}
      />
    </DocBlock>
  );
}

function CommonMistakesBlock() {
  return (
    <DocBlock title="Common mistakes">
      <RuleList
        rules={[
          { tone: "must-not", text: "Don't render a badge as a <button> or a <a>. Interactivity is out of scope — the only interactive element inside a badge is the optional remove control." },
          { tone: "must-not", text: "Don't override the badge's colors inline. Every variant × appearance pairing is a token contract — a hand-picked hex breaks the color-to-meaning map for the whole product." },
          { tone: "must-not", text: "Don't use Badge to filter a list. Filter chips need selection state, keyboard support, and menu integration — build a Filter component that composes Badge for its visual, not the other way around." },
          { tone: "must-not", text: "Don't wrap a Badge in another badge, chip, or pill for emphasis. Nesting doesn't add meaning; it just doubles the visual noise." },
          { tone: "must-not", text: "Don't ship a specialized StatusChip / SeverityPill / DeptTag that reimplements this Badge. Compose Badge with a typed variant instead — the appearance-to-meaning map lives here, not in each product." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]           = useState<BadgeVariant>("success");
  const [appearance, setAppearance]     = useState<BadgeAppearance>("soft");
  const [size, setSize]                 = useState<BadgeSize>("md");
  const [label, setLabel]               = useState("Active");
  const [leadingIcon, setLeadingIcon]   = useState(false);
  const [trailingIcon, setTrailingIcon] = useState(false);
  const [dot, setDot]                   = useState(false);
  const [useCount, setUseCount]         = useState(false);
  const [countValue, setCountValue]     = useState(42);
  const [removable, setRemovable]       = useState(false);
  const [disabled, setDisabled]         = useState(false);

  const badgeProps: React.ComponentProps<typeof Badge> = {
    variant,
    appearance,
    size,
    disabled,
    ...(dot && !useCount ? { dot: true } : null),
    ...(leadingIcon && !dot && !useCount ? { leadingIcon: <Check /> } : null),
    ...(trailingIcon && !removable && !useCount ? { trailingIcon: <ArrowRight /> } : null),
    ...(removable ? { onRemove: () => {} } : null),
    ...(useCount ? { count: countValue } : null),
  };

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered badge in real time. Live JSX is generated in the dark panel at the bottom.">
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: t.space.section.sm,
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 140,
          }}
        >
          <Badge {...badgeProps}>{useCount ? undefined : label}</Badge>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="variant"    value={variant}    options={VARIANTS}    onChange={(v) => setVariant(v as BadgeVariant)} />
          <SelectControl label="appearance" value={appearance} options={APPEARANCES} onChange={(v) => setAppearance(v as BadgeAppearance)} />
          <SelectControl label="size"       value={size}       options={SIZES}       onChange={(v) => setSize(v as BadgeSize)} />
          <TextControl   label="label"      value={label}      onChange={setLabel}   disabled={useCount} />
          <ToggleControl label="leading icon"  value={leadingIcon}  onChange={setLeadingIcon}  disabled={dot || useCount} />
          <ToggleControl label="trailing icon" value={trailingIcon} onChange={setTrailingIcon} disabled={removable || useCount} />
          <ToggleControl label="dot"           value={dot}          onChange={setDot}          disabled={useCount} />
          <ToggleControl label="count"         value={useCount}     onChange={setUseCount} />
          <NumberControl label="count value" value={countValue} onChange={setCountValue} disabled={!useCount} />
          <ToggleControl label="removable" value={removable} onChange={setRemovable} disabled={useCount} />
          <ToggleControl label="disabled"  value={disabled}  onChange={setDisabled} />
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            borderTop: `1px solid ${t.color.border.subtle}`,
            background: t.color.background.inverse,
          }}
        >
          <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: t.space.stack.sm }}>
            Rendered code
          </div>
          <pre style={{ margin: 0, fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6, color: t.color.text.inverse, whiteSpace: "pre", overflowX: "auto" }}>
{renderCode({ variant, appearance, size, label, leadingIcon, trailingIcon, dot, useCount, countValue, removable, disabled })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: BadgeVariant;
  appearance: BadgeAppearance;
  size: BadgeSize;
  label: string;
  leadingIcon: boolean;
  trailingIcon: boolean;
  dot: boolean;
  useCount: boolean;
  countValue: number;
  removable: boolean;
  disabled: boolean;
}) {
  const attrs: string[] = [];
  if (s.variant !== "default")    attrs.push(`variant="${s.variant}"`);
  if (s.appearance !== "soft")    attrs.push(`appearance="${s.appearance}"`);
  if (s.size !== "md")            attrs.push(`size="${s.size}"`);
  if (s.useCount)                 attrs.push(`count={${s.countValue}}`);
  if (s.dot && !s.useCount)       attrs.push(`dot`);
  if (s.leadingIcon && !s.dot && !s.useCount)    attrs.push(`leadingIcon={<Check />}`);
  if (s.trailingIcon && !s.removable && !s.useCount) attrs.push(`trailingIcon={<ArrowRight />}`);
  if (s.removable && !s.useCount) attrs.push(`onRemove={() => {}}`);
  if (s.disabled)                 attrs.push(`disabled`);

  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  if (s.useCount) return `<Badge${attrStr} />`;
  return `<Badge${attrStr}>${esc(s.label || " ")}</Badge>`;
}

function esc(v: string) {
  return v.replace(/</g, "&lt;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Illustrative — not shipped as reusable components. Every example uses the same primitive, only the props change."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <ExampleTile title="Status pills">
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="success">Completed</Badge>
          <Badge variant="default">Draft</Badge>
          <Badge variant="danger">Failed</Badge>
        </ExampleTile>

        <ExampleTile title="Product moments">
          <Badge variant="info"    appearance="solid" leadingIcon={<Sparkles />}>New</Badge>
          <Badge variant="primary" appearance="solid" leadingIcon={<Rocket />}>Beta</Badge>
          <Badge variant="primary" appearance="outline">Preview</Badge>
        </ExampleTile>

        <ExampleTile title="Numeric counters">
          <Badge variant="primary" count={3} />
          <Badge variant="primary" count={42} />
          <Badge variant="danger"  count={128} />
          <Badge variant="neutral" count={12000} maxCount={999} />
        </ExampleTile>

        <ExampleTile title="Presence indicators">
          <Badge variant="success" appearance="outline" dot>Online</Badge>
          <Badge variant="warning" appearance="outline" dot>Idle</Badge>
          <Badge variant="neutral" appearance="outline" dot>Offline</Badge>
        </ExampleTile>

        <ExampleTile title="Meta labels">
          <Badge variant="neutral">MRN 4482991</Badge>
          <Badge variant="neutral">Guideline v3</Badge>
          <Badge variant="default" leadingIcon={<FileText />}>Report</Badge>
        </ExampleTile>

        <ExampleTile title="Removable">
          <Badge variant="default" onRemove={() => {}}>Cardiology</Badge>
          <Badge variant="default" onRemove={() => {}}>Adult</Badge>
          <Badge variant="default" onRemove={() => {}}>ICU</Badge>
        </ExampleTile>

        <ExampleTile title="Nav counters">
          <Row><span>Inbox</span><Badge variant="primary" appearance="solid" count={7} /></Row>
          <Row><span>Alerts</span><Badge variant="danger" appearance="solid" count={2} /></Row>
          <Row><span>Drafts</span><Badge variant="neutral" count={12} /></Row>
        </ExampleTile>

        <ExampleTile title="Table cell chips">
          <Row><span>Order #1042</span><Badge size="sm" variant="success">Fulfilled</Badge></Row>
          <Row><span>Order #1041</span><Badge size="sm" variant="warning">In transit</Badge></Row>
          <Row><span>Order #1040</span><Badge size="sm" variant="danger">Cancelled</Badge></Row>
        </ExampleTile>

        <ExampleTile title="Alert callouts">
          <Badge size="lg" variant="danger" appearance="solid" leadingIcon={<Zap />}>Critical</Badge>
          <Badge size="lg" variant="warning" leadingIcon={<Clock />}>Watch</Badge>
          <Badge size="lg" variant="success" leadingIcon={<Check />}>Signed</Badge>
        </ExampleTile>

        <ExampleTile title="Empty content · dot only">
          <Row><span>Server</span><Badge variant="success" dot aria-label="Online" /></Row>
          <Row><span>Queue</span><Badge variant="warning" dot aria-label="Degraded" /></Row>
          <Row><span>Sync</span><Badge variant="danger" dot aria-label="Offline" /></Row>
        </ExampleTile>
      </div>
    </DocBlock>
  );
}

function ExampleTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: t.space.inline.sm, alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: t.space.inline.sm, ...t.type.bodyS, color: t.color.text.secondary, minWidth: "100%", justifyContent: "space-between", padding: `${t.space.stack.xs} 0` }}>
      {children}
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "variant",       type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'", def: "'default'", desc: "Semantic tone. Pick by meaning, not color." },
  { name: "appearance",    type: "'soft' | 'solid' | 'outline'",                                                 def: "'soft'",    desc: "Visual weight." },
  { name: "size",          type: "'sm' | 'md' | 'lg'",                                                            def: "'md'",      desc: "Size ladder — 20 / 24 / 28 px." },
  { name: "dot",           type: "boolean",                                                                       def: "false",     desc: "Render a variant-colored dot before the label." },
  { name: "leadingIcon",   type: "ReactNode",                                                                     def: "—",         desc: "Icon before the label. Ignored when dot is set." },
  { name: "trailingIcon",  type: "ReactNode",                                                                     def: "—",         desc: "Icon after the label. Suppressed when onRemove is set." },
  { name: "count",         type: "number",                                                                        def: "—",         desc: "Numeric count — turns the badge into a pill and overrides children." },
  { name: "maxCount",      type: "number",                                                                        def: "99",        desc: "Cap for count — values above render as '99+'." },
  { name: "onRemove",      type: "(e) => void",                                                                   def: "—",         desc: "When set, renders a trailing X button that fires this handler." },
  { name: "removeLabel",   type: "string",                                                                        def: "'Remove'",  desc: "Accessible name for the remove control." },
  { name: "disabled",      type: "boolean",                                                                       def: "false",     desc: "Dims the badge and disables the remove control." },
  { name: "children",      type: "ReactNode",                                                                     def: "—",         desc: "Label content. Ignored when count is provided." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "160px 1.6fr 90px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {PROPS.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1.6fr 90px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>{row.name}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>{row.type}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{row.def}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary }}>
      {children}
    </span>
  );
}

/* ══════ Tokens used ═══════════════════════════════════════════════ */

function TokensUsedBlock() {
  const tokens: { role: string; alias: string }[] = [
    { role: "Radius",              alias: "aliases.radius.chip (4 — matches every chip-shaped surface in HC1)" },
    { role: "Count radius",        alias: "aliases.radius.circular (9999 — pill shape)" },
    { role: "Typography",          alias: "aliases.typography.label (12 semibold + wide tracking)" },
    { role: "Height ladder",       alias: "components.badge.size.height — 20 / 24 / 28" },
    { role: "Horizontal padding",  alias: "aliases.spacing.inline.sm (sm/md) · inline.md (lg)" },
    { role: "Gap between parts",   alias: "aliases.spacing.inline.xs (4)" },
    { role: "Soft palette",        alias: "brand-50 / status.*.bg backgrounds · action-primary / status.*.fg ink" },
    { role: "Solid palette",       alias: "action-primary · status.*.fg · action-danger · action-secondary backgrounds · text.inverse ink" },
    { role: "Outline palette",     alias: "bg.default background · action-primary / status.*.fg ink · matching border" },
    { role: "Dot color",           alias: "components.badge.dot.color — action-primary · status.*.fg · action-danger · text.tertiary (always solid tone)" },
    { role: "Remove hover wash",   alias: "color-mix(currentColor 15%, transparent) — inherits the badge's ink so it works on every variant × appearance" },
    { role: "Remove focus ring",   alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Table)" },
    { role: "Disabled opacity",    alias: "components.badge.disabled.opacity (0.5)" },
    { role: "Transition",          alias: "aliases.motion.hoverIn — duration 150, easing standard (matches Button)" },
  ];

  return (
    <DocBlock title="Tokens used">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {tokens.map((row, i) => (
          <div
            key={row.role}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === tokens.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <span style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{row.role}</span>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary }}>{row.alias}</code>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Implementation notes">
      <RuleList
        rules={[
          { tone: "note", text: "The root is a <span>, not a <div>. Badges are inline surfaces — mounting them inside inline text or a table cell should not force a new line." },
          { tone: "note", text: "Variant × appearance is a 7 × 3 matrix — 21 combinations, each one a single CSS selector that sets --hc-badge-{bg,fg,border}. The base .hc-badge selector reads those three vars, so every combination shares the same layout code." },
          { tone: "note", text: "The dot color is always the variant's *solid* ink (bright), regardless of the badge's appearance. An 'active' dot on a soft green badge still reads as unambiguous green." },
          { tone: "note", text: "count takes over the content. Passing both `count` and `children` is intentionally not composed — count wins, children are ignored. This keeps the rendering rules unambiguous." },
          { tone: "note", text: "The remove control is a real <button> inside the badge. The badge itself never becomes a button — that would break the 'not a filter / not a link' rule and create ambiguous focus targets." },
          { tone: "note", text: "The remove hover wash uses color-mix(currentColor 15%, transparent) so the same rule works on every variant × appearance without a per-variant override." },
        ]}
      />

      <Callout tone="info" title="Extending Badge">
        (1) Downstream chip/tag/filter surfaces (Chip, FilterPill, Tag,
        Counter, StatusIndicator) should be thin compositions on top of this
        Badge — wrap it with the surface's opinionated state model and reuse
        every visual choice. (2) A new variant should only be added if a
        genuine semantic role emerges (e.g. a compliance-mandated 'legal'
        tone). Add the tone to
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/badge.ts
        </code>
        and the matching CSS rule in Badge.css before using it.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",     detail: "Every color, radius, spacing, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 label typography",  detail: "Uses aliases.typography.label (12/16 semibold + wide tracking) so a badge reads as a label at every size." },
    { name: "HC1 status colors",     detail: "success / warning / error / info map through the same color.status.* aliases used by Callouts, Alerts, and Empty states — one source of tone." },
    { name: "HC1 focus ring",        detail: "The remove control uses the same 2px brand outline used by every interactive primitive — cross-family consistency." },
    { name: "Native <span>",         detail: "The root is a real inline <span>, not a <div> — so a badge inside inline text does not force a new line." },
  ];
  return (
    <DocBlock title="Built on">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: t.space.inline.md }}>
        {rows.map((row) => (
          <div
            key={row.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <FileText size={14} color={t.color.action.primary} />
              {row.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Used by ═══════════════════════════════════════════════════ */

function UsedByBlock() {
  const consumers = [
    { name: "Chip",              detail: "The generic chip surface for meta labels. Wraps Badge with size='sm' + neutral variant defaults." },
    { name: "Tag",               detail: "Removable label used inside detail pages and dashboards. Wraps Badge with onRemove wired through." },
    { name: "Counter",           detail: "Numeric-only pill used on nav items and inbox rows. Wraps Badge with count + auto-cap." },
    { name: "Filter Pill",       detail: "Filter chip with selected/hover state. Composes Badge for its visual + wraps it in a <button> for interaction." },
    { name: "Status Indicator",  detail: "Dot-only presence indicator. Composes Badge with dot + aria-label + no text." },
    { name: "Severity Chip",     detail: "Clinical severity marker (Critical / Watch / Stable). Composes Badge with a typed severity → variant map." },
    { name: "Dept Tag",          detail: "Department label on patient rows. Composes Badge with variant='neutral' + optional leading icon." },
    { name: "Notification Dot",  detail: "Unread indicator on avatars and nav items. Composes Badge with dot + variant='danger' + no label + aria-label." },
    { name: "Callout Ribbon",    detail: "Larger 'New' / 'Beta' ribbons on feature cards. Composes Badge with size='lg' + solid appearance." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every chip / tag / label / counter / status indicator in HC1 should compose this Badge. These are the anticipated consumers — none are shipped yet."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {consumers.map((c) => (
          <div
            key={c.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <CircleDot size={14} color={t.color.action.primary} />
              {c.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Migration targets ═════════════════════════════════════════ */

function MigrationTargetsBlock() {
  const targets = [
    { name: "ClinicalIQ StatusChip",     detail: "Severity / status / data-quality badges across Bloodhealth + HerCare currently render through a bespoke StatusChip. Migrate to Badge with a typed severity → variant map — same meaning, unified color contract." },
    { name: "SourceIQ pipeline tags",     detail: "SourceIQ 'stage' and 'result' pills use a divergent green-teal palette. Migrate as a token swap — Badge already ships all seven variants in the shared color contract." },
    { name: "HerCare guideline versions", detail: "'v3', 'v4' meta labels currently rendered as ad-hoc styled spans. Migrate to variant='neutral' size='sm'." },
    { name: "Inbox / notification counts", detail: "Any span rendering a number-in-a-pill (7, 42, 99+) is a Badge with `count`. Migrate to inherit the auto-cap and pill shape." },
    { name: "Prototype status pills",     detail: "Any prototype rendering a 'Draft' / 'Active' / 'Failed' pill with inline styles should switch to Badge with the semantic variant. Do not redesign — just standardize." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Badge is the intended replacement for every chip, label, and status pill across the HC1 ecosystem. Do not redesign — standardize."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {targets.map((c) => (
          <div
            key={c.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <ArrowRight size={14} color={t.color.action.primary} />
              {c.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Playground control primitives ═════════════════════════════ */

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextControl({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      />
    </label>
  );
}

function NumberControl({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      />
    </label>
  );
}

function ToggleControl({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: t.space.inline.md, padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{children}</span>;
}
