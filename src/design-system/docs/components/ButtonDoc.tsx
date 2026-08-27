import { useState } from "react";
import {
  ArrowRight,
  Download,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger", "danger-outline", "success", "cta", "link", "icon"];
const SIZES: ButtonSize[]        = ["xs", "sm", "md", "lg", "xl"];

export function ButtonDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <VariantsBlock />
      <SizesBlock />
      <StatesBlock />
      <A11yBlock />
      <DoDontBlock />
      <PlaygroundBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ══════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Button"
      lead="Button is the first shipped component in the HC1 design system and the reference implementation for every component that follows. It consumes semantic tokens only, ships all six variants and five sizes, supports every required interactive state, and passes the Component Checklist end-to-end."
    />
  );
}

/* ══════ Anatomy ═════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a prop or slot on the component."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="primary" size="lg" leftIcon={<Download />} rightIcon={<ArrowRight />}>
          Export report
        </Button>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Container"        desc="Owns background, border, radius, focus ring. Never the target of custom styles." />
        <Part name="leftIcon"         desc="Optional. Aligns baseline-center with the label. Sized per Sizes." />
        <Part name="children"         desc="The label. Uses button-appropriate typography role." />
        <Part name="rightIcon"        desc="Optional. Common for menu buttons and directional actions." />
        <Part name="Loading spinner"  desc="Overlaid centered when loading. Preserves layout width." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 13 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Variants ════════════════════════════════════════════════════ */

const VARIANT_META: Record<ButtonVariant, { usage: string }> = {
  primary:   { usage: "The one primary action per surface — Save, Submit, Create, Generate." },
  secondary: { usage: "Supporting actions alongside the primary — Cancel, Reset, Back." },
  ghost:     { usage: "Low-emphasis actions in dense surfaces — toolbars, table row actions." },
  danger:    { usage: "Destructive and unrecoverable actions — Delete, Revoke, Disable." },
  cta:       { usage: "Execute / irreversible actions — Publish, Send, Approve, Finalize. Reserved: never the default." },
  link:      { usage: "Actions that read as text but behave as buttons — inline 'Learn more', 'Undo'." },
  icon:      { usage: "Icon-only actions where space is scarce — requires an aria-label." },
};

function VariantsBlock() {
  return (
    <DocBlock title="Variants" lead="Six variants, one intent each. See Standards → Variants for the intent map.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        {VARIANTS.map(v => (
          <div
            key={v}
            style={{
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
              padding: t.space.inline.lg,
              display: "flex",
              flexDirection: "column",
              gap: t.space.stack.md,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56 }}>
              {v === "icon" ? (
                <Button variant="icon" aria-label="Search">
                  <Search />
                </Button>
              ) : (
                <Button variant={v}>
                  {v === "link" ? "Learn more" : "Button"}
                </Button>
              )}
            </div>
            <div>
              <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
                variant=&quot;{v}&quot;
              </code>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>
                {VARIANT_META[v].usage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Sizes ══════════════════════════════════════════════════════ */

const SIZE_HINT: Record<ButtonSize, string> = {
  xs: "Height 20 · caption",
  sm: "Height 28 · caption",
  md: "Height 36 · body-small",
  lg: "Height 44 · body",
  xl: "Height 56 · body-large",
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Five sizes, no in-betweens. Icons scale automatically: 12 · 14 · 16 · 20 · 24 px."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          padding: t.space.inline.xl,
          display: "flex",
          flexDirection: "column",
          gap: t.space.stack.md,
        }}
      >
        {SIZES.map(s => (
          <div
            key={s}
            style={{
              display: "grid",
              gridTemplateColumns: "40px minmax(220px, 320px) minmax(180px, 240px) 1fr",
              gap: t.space.inline.lg,
              alignItems: "center",
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontWeight: 700, color: t.color.action.primary }}>
              {s}
            </code>
            <div>
              <Button variant="primary" size={s} leftIcon={<Plus />}>
                Add patient
              </Button>
            </div>
            <div>
              <Button variant="icon" size={s} aria-label="More">
                <MoreHorizontal />
              </Button>
            </div>
            <span style={{ ...t.type.caption, color: t.color.text.secondary }}>
              {SIZE_HINT[s]}
            </span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="States" lead="Every interactive state exists. Focus is never suppressed.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile
          name="Default"
          note="Rest state."
          content={<Button variant="primary">Button</Button>}
        />
        <StateTile
          name="Hover"
          note="Hover the tile below to see the state."
          content={<Button variant="primary">Button</Button>}
        />
        <StateTile
          name="Focused"
          note="Tab to reveal the focus ring."
          content={<Button variant="primary">Button</Button>}
        />
        <StateTile
          name="Pressed"
          note="Uses the -active token."
          content={<Button variant="primary">Button</Button>}
        />
        <StateTile
          name="Disabled"
          note="aria-disabled + no focus."
          content={<Button variant="primary" disabled>Button</Button>}
        />
        <StateTile
          name="Loading"
          note="aria-busy=true. Layout preserved."
          content={<Button variant="primary" loading>Button</Button>}
        />
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, content }: { name: string; note: string; content: React.ReactNode }) {
  return (
    <div
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
      <div
        style={{
          ...t.type.caption,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: t.color.text.tertiary,
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control }}>
        {content}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Defaults to type='button' to prevent accidental form submission." },
          { tone: "must", text: "Focus is visible via a 2px brand outline at 2px offset. :focus-visible only." },
          { tone: "must", text: "Loading sets aria-busy=true and rejects click events without dispatching handlers." },
          { tone: "must", text: "Disabled sets the native disabled attribute and aria-disabled=true. Focus is removed by the browser." },
          { tone: "must", text: "variant='icon' logs a dev-time warning when aria-label is not provided." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses transitions to 0ms and slows the spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Do / Don't ═════════════════════════════════════════════════ */

function DoDontBlock() {
  return (
    <DocBlock title="Do & Don't">
      <DoDontGrid
        dos={[
          { title: "One primary per surface",   description: "The primary variant anchors the surface. Everything else demotes to secondary, ghost, or link." },
          { title: "Danger for destruction",    description: "Delete / Revoke / Disable — anything unrecoverable in one click." },
          { title: "Link for inline actions",   description: "Reads as body text but behaves as a button — '(learn more)', 'undo', 'try again'." },
          { title: "Ghost in dense contexts",   description: "Table row actions, toolbars, quick actions where filled would over-index." },
        ]}
        donts={[
          { title: "Multiple primary buttons",  description: "Two filled buttons in one action group flatten the hierarchy — pick one." },
          { title: "Danger for warnings",       description: "Warning ≠ danger. Danger is destructive intent, not attention-getting." },
          { title: "Icon without aria-label",   description: "Icon-only buttons have no accessible name unless you provide aria-label." },
          { title: "Custom padding via style",  description: "Sizes are the API. If a size doesn't fit, the layout is wrong, not the button." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]     = useState<ButtonVariant>("primary");
  const [size, setSize]           = useState<ButtonSize>("md");
  const [loading, setLoading]     = useState(false);
  const [disabled, setDisabled]   = useState(false);
  const [hasLeftIcon, setLeft]    = useState(false);
  const [hasRightIcon, setRight]  = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [label, setLabel]         = useState("Save changes");

  const isIcon = variant === "icon";

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered button below in real time.">
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {/* Preview */}
        <div
          style={{
            padding: t.space.section.sm,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            minHeight: 140,
          }}
        >
          <div style={{ width: fullWidth ? "100%" : "auto", display: "flex", justifyContent: "center" }}>
            <Button
              variant={variant}
              size={size}
              loading={loading}
              disabled={disabled}
              fullWidth={fullWidth}
              leftIcon={!isIcon && hasLeftIcon ? <Download /> : undefined}
              rightIcon={!isIcon && hasRightIcon ? <ArrowRight /> : undefined}
              aria-label={isIcon ? "Search" : undefined}
            >
              {isIcon ? <Search /> : label || "Label"}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl
            label="variant"
            value={variant}
            options={VARIANTS}
            onChange={v => setVariant(v as ButtonVariant)}
          />
          <SelectControl
            label="size"
            value={size}
            options={SIZES}
            onChange={v => setSize(v as ButtonSize)}
          />
          <TextControl
            label="children (label)"
            value={label}
            onChange={setLabel}
            disabled={isIcon}
          />
          <ToggleControl label="loading"   value={loading}      onChange={setLoading} />
          <ToggleControl label="disabled"  value={disabled}     onChange={setDisabled} />
          <ToggleControl label="fullWidth" value={fullWidth}    onChange={setFullWidth} />
          <ToggleControl label="leftIcon"  value={hasLeftIcon}  onChange={setLeft}  disabled={isIcon} />
          <ToggleControl label="rightIcon" value={hasRightIcon} onChange={setRight} disabled={isIcon} />
        </div>

        {/* Generated code */}
        <div
          style={{
            padding: t.space.inline.xl,
            borderTop: `1px solid ${t.color.border.subtle}`,
            background: t.color.background.inverse,
          }}
        >
          <div
            style={{
              ...t.type.caption,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              marginBottom: t.space.stack.sm,
            }}
          >
            Rendered code
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: t.font.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: t.color.text.inverse,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
{renderCode({ variant, size, loading, disabled, fullWidth, hasLeftIcon, hasRightIcon, label, isIcon })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  label: string;
  isIcon: boolean;
}) {
  const attrs: string[] = [];
  if (s.variant !== "primary") attrs.push(`variant="${s.variant}"`);
  if (s.size !== "md")         attrs.push(`size="${s.size}"`);
  if (s.loading)                attrs.push("loading");
  if (s.disabled)               attrs.push("disabled");
  if (s.fullWidth)              attrs.push("fullWidth");
  if (!s.isIcon && s.hasLeftIcon)  attrs.push("leftIcon={<Download />}");
  if (!s.isIcon && s.hasRightIcon) attrs.push("rightIcon={<ArrowRight />}");
  if (s.isIcon) attrs.push('aria-label="Search"');
  const body = s.isIcon ? "<Search />" : (s.label || "Label");
  const opening = attrs.length > 2
    ? `<Button\n  ${attrs.join("\n  ")}\n>`
    : `<Button${attrs.length ? " " + attrs.join(" ") : ""}>`;
  return `${opening}${attrs.length > 2 ? "\n  " : ""}${body}${attrs.length > 2 ? "\n" : ""}</Button>`;
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 36,
          padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control,
          border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default,
          color: t.color.text.primary,
          fontFamily: t.font.sans,
          fontSize: 14,
        }}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TextControl({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          height: 36,
          padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control,
          border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default,
          color: t.color.text.primary,
          fontFamily: t.font.sans,
          fontSize: 14,
        }}
      />
    </label>
  );
}

function ToggleControl({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.space.inline.md,
        padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control,
        border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: t.font.mono,
        fontSize: 12,
        color: t.color.text.tertiary,
      }}
    >
      {children}
    </span>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "variant",   type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'cta' | 'link' | 'icon'", def: "'primary'", desc: "Visual variant. See Standards → Variants." },
  { name: "size",      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",                                def: "'md'",      desc: "Size ladder. See Standards → Sizes." },
  { name: "loading",   type: "boolean",                                                          def: "false",     desc: "Show spinner, reject clicks, announce via aria-busy. Preserves layout." },
  { name: "disabled",  type: "boolean",                                                          def: "false",     desc: "Native disabled + aria-disabled. Not focusable." },
  { name: "fullWidth", type: "boolean",                                                          def: "false",     desc: "Grow to fill parent width." },
  { name: "iconOnly",  type: "boolean",                                                          def: "false",     desc: "Render as a square (h=w at each size) preserving the variant's colors. Requires aria-label. Ignored when variant='icon' (already square)." },
  { name: "leftIcon",  type: "ReactNode",                                                        def: "—",         desc: "Icon before label. Ignored when variant='icon'." },
  { name: "rightIcon", type: "ReactNode",                                                        def: "—",         desc: "Icon after label. Ignored when variant='icon'." },
  { name: "children",  type: "ReactNode",                                                        def: "—",         desc: "Label content. For variant='icon', pass the icon as children." },
  { name: "type",      type: "'button' | 'submit' | 'reset'",                                    def: "'button'",  desc: "Native button type. Defaults to 'button' to prevent accidental submits." },
  { name: "onClick",   type: "(e: MouseEvent) => void",                                          def: "—",         desc: "Click handler. Not invoked when loading or disabled." },
  { name: "aria-label",type: "string",                                                           def: "—",         desc: "Accessible name. Required for variant='icon'." },
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
        <div style={{ display: "grid", gridTemplateColumns: "140px 1.5fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "140px 1.5fr 100px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>
              {row.name}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>
              {row.type}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
              {row.def}
            </code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
              {row.desc}
            </span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: t.color.text.tertiary,
      }}
    >
      {children}
    </span>
  );
}

/* ══════ Tokens Used ═══════════════════════════════════════════════ */

function TokensUsedBlock() {
  const tokens: { role: string; alias: string }[] = [
    { role: "Radius",       alias: "aliases.radius.control" },
    { role: "Motion",       alias: "aliases.motion.hoverIn" },
    { role: "Focus ring",   alias: "aliases.color.border.focus" },
    { role: "Primary fill", alias: "aliases.color.action.primary / primaryHover / primaryActive / primaryDisabled" },
    { role: "Primary text", alias: "aliases.color.text.inverse / text.disabled" },
    { role: "Secondary",    alias: "aliases.color.background.default / bg.subtle / bg.muted / border.default / border.strong" },
    { role: "Ghost",        alias: "aliases.color.background.subtle / bg.muted" },
    { role: "Danger",       alias: "aliases.color.action.danger + red-600 / red-700 for hover / pressed" },
    { role: "Link",         alias: "aliases.color.text.link / text.linkHover" },
    { role: "Icon",         alias: "aliases.color.text.primary + bg.subtle / bg.muted on hover / press" },
    { role: "Typography",   alias: "typography.caption (xs / sm) · bodyS (md) · body (lg) · bodyL (xl)" },
    { role: "Spacing",      alias: "spacing.inline.xs → inline.xl (padding and gap)" },
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
              gridTemplateColumns: "180px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === tokens.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <span style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
              {row.role}
            </span>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary }}>
              {row.alias}
            </code>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Implementation notes ══════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Implementation notes">
      <RuleList
        rules={[
          { tone: "note", text: "The component's CSS lives at Button.css and references CSS custom properties from tokens/css/variables.css. Importing Button pulls both in — no separate setup step." },
          { tone: "note", text: "No Tailwind color utilities are used anywhere in the component. All colors resolve to --hc-color-* variables via the alias layer." },
          { tone: "note", text: "The component does not currently support asChild / polymorphism. A follow-up PR may add Radix Slot support when a real use case appears." },
          { tone: "note", text: "Success and Info are documented in Standards → Variants but are not shipped as Button variants — they are feedback intents, not action intents (see the Variants standard)." },
        ]}
      />

      <Callout tone="info" title="Adding a new variant">
        (1) Propose an alias if a new color role is needed. (2) Extend
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/button.ts
        </code>
        with the variant tokens. (3) Add a
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          .hc-btn--{"{name}"}
        </code>
        block in Button.css. (4) Extend the ButtonVariant union in Button.types.ts. (5) Update this doc page. No shell changes.
      </Callout>
    </DocBlock>
  );
}
