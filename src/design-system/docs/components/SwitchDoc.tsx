import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  Cloud,
  FileText,
  Mail,
  Moon,
  Save,
  Sparkles,
} from "lucide-react";
import {
  Switch,
  type SwitchSize,
} from "../../components/switch";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  Checklist,
  t,
} from "../standards/_shared";

const SIZES: SwitchSize[] = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function SwitchDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <StatesBlock />
      <SizesBlock />
      <A11yBlock />
      <KeyboardBlock />
      <BestPracticesBlock />
      <CommonMistakesBlock />
      <PlaygroundBlock />
      <ExamplesBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
      <BuiltOnBlock />
      <UsedByBlock />
      <MigrationBlock />
      <StatusBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Switch"
      lead="Switch is the canonical binary toggle control of the HC1 design system. Every settings screen, every feature toggle, every notification preference, every permission that flips ON or OFF immediately composes this Switch rather than reimplementing toggle behavior. Switch is for immediate system state — toggling should change something the moment the user releases the click. Use Checkbox instead when the choice is part of a form submission."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [on, setOn] = useState(true);
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. The Indicator (track + thumb) is auto-rendered by the root — you rarely compose it explicitly."
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <Switch checked={on} onCheckedChange={setOn}>
          <Switch.Label>Enable notifications</Switch.Label>
          <Switch.Description>Push alerts for critical updates.</Switch.Description>
        </Switch>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Switch"             desc="Root <label>. Owns state; renders the native <input type='checkbox' role='switch'>, the pill track + thumb, and the text stack." />
        <Part name="Switch.Indicator"   desc="Pill track + circular thumb. Auto-rendered by the root; expose it here for advanced overrides." />
        <Part name="Switch.Label"       desc="The label text next to the pill. Click-to-toggle works because the whole row is a <label>." />
        <Part name="Switch.Description" desc="Secondary text under the label. Auto-wires aria-describedby on the native input via a generated id." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 12 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Composition ═══════════════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition"
      lead="Switch is a compound component. Compose Label + Description alongside the auto-rendered indicator; the pill track + thumb are drawn for you."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Switch
  checked={darkMode}
  onCheckedChange={setDarkMode}
>
  <Switch.Label>Dark mode</Switch.Label>
  <Switch.Description>
    Matches the surface tone to your OS.
  </Switch.Description>
</Switch>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`// Don't use Switch inside multi-select forms
<form>
  <Switch>Email</Switch>
  <Switch>SMS</Switch>
  <Switch>Push</Switch>
  {/* Use Checkbox — a form gathers selections. */}
</form>

// Don't reach for Switch when the choice is
// part of a wizard that submits later.
<Switch>Accept terms</Switch>
{/* Use Checkbox — nothing changes until submit. */}`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Use Switch when toggling immediately changes system state (dark mode, auto-save, notifications). The result should be visible on release." },
          { tone: "should",   text: "Pass a short string as children (`<Switch>Enable</Switch>`) when there's no description — it's the same as composing <Switch.Label>." },
          { tone: "must-not", text: "Never use Switch inside a multi-select form. If several options can be active simultaneously AND nothing changes until submit, use Checkbox." },
          { tone: "must-not", text: "Never reimplement the pill visual with a <div role='switch'>. This Switch renders a real native <input type='checkbox' role='switch'> so keyboard, form submission, and screen readers all work out of the box." },
          { tone: "must-not", text: "Never introduce boolean props like `showLabel` or `withDescription`. If a piece is needed, compose it." },
        ]}
      />
    </DocBlock>
  );
}

function CodeBlock({ title, tone, code }: { title: string; tone: "do" | "dont"; code: string }) {
  const fg = tone === "do" ? t.color.status.success.fg : t.color.status.error.fg;
  const bg = tone === "do" ? t.color.status.success.bg : t.color.status.error.bg;
  const border = tone === "do" ? t.color.status.success.border : t.color.status.error.border;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: t.radius.control, background: bg, overflow: "hidden" }}>
      <div style={{ padding: `${t.space.stack.sm} ${t.space.inline.md}`, borderBottom: `1px solid ${border}`, color: fg, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em" }}>
        {tone === "do" ? "✓ Do" : "✗ Don't"} — {title}
      </div>
      <pre style={{ margin: 0, padding: t.space.inline.md, fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6, color: t.color.text.primary, whiteSpace: "pre", overflowX: "auto" }}>
        {code}
      </pre>
    </div>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="States"
      lead="Every visual state maps to a data attribute + a CSS class so downstream tests and themes can read them without touching React."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Off" note="Default resting state. Neutral track, thumb at left.">
          <Switch>State</Switch>
        </StateTile>
        <StateTile name="On" note="Brand-filled track, thumb glides to the right.">
          <Switch defaultChecked>State</Switch>
        </StateTile>
        <StateTile name="Hover" note="Brand border cue on the track — hover me to see it.">
          <Switch>Hover me</Switch>
        </StateTile>
        <StateTile name="Focused" note="2px brand outline around the pill (same ring as Button + Input + Checkbox + Radio).">
          <Switch autoFocus defaultChecked>State</Switch>
        </StateTile>
        <StateTile name="Disabled" note="Dimmed track; pointer-events blocked; label + description muted.">
          <Switch disabled>Disabled</Switch>
        </StateTile>
        <StateTile name="Invalid" note="Red border + red focus ring; aria-invalid='true'.">
          <Switch invalid>Invalid</Switch>
        </StateTile>
        <StateTile name="Required" note="Native required + red * marker on the label.">
          <Switch required>Required</Switch>
        </StateTile>
        <StateTile name="Loading" note="Spinner in the thumb; input disabled; aria-busy='true'.">
          <Switch loading defaultChecked>Saving…</Switch>
        </StateTile>
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
        {name}
      </div>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 64, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        {children}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

/* ══════ Sizes ═════════════════════════════════════════════════════ */

const SIZE_META: Record<SwitchSize, { label: string; row: string; track: string; thumb: string; usage: string }> = {
  sm: { label: "Small",  row: "28px", track: "24×14",  thumb: "10px", usage: "Dense settings panels, compact toolbars, table cells." },
  md: { label: "Medium", row: "36px", track: "28×16",  thumb: "12px", usage: "Default. Settings, preferences, feature flags." },
  lg: { label: "Large",  row: "44px", track: "36×20",  thumb: "16px", usage: "Touch surfaces, primary toggles, large form pages." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Three size steps — row heights match Checkbox + Radio + Button + Input exactly (28 / 36 / 44). A mixed form of Switches, Checkboxes and Radios at the same size stacks cleanly."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {SIZES.map((size) => (
          <SizeCell key={size} size={size} />
        ))}
      </div>
    </DocBlock>
  );
}

function SizeCell({ size }: { size: SwitchSize }) {
  const meta = SIZE_META[size];
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 96 }}>
        <Switch checked={on} onCheckedChange={setOn} size={size}>
          {meta.label} · track {meta.track} · thumb {meta.thumb}
        </Switch>
      </div>
      <div>
        <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
          size=&quot;{size}&quot;
        </code>
        <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>
          {meta.usage}
        </div>
      </div>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Renders a real native <input type='checkbox'> with role='switch' — screen readers announce it as a two-state toggle (not a tri-state checkbox), and form submission + keyboard behavior are native." },
          { tone: "must", text: "aria-checked is maintained by the browser (native checkbox reports true/false automatically). We don't override it — ARIA discourages overriding native state for on/off." },
          { tone: "must", text: "Space toggles the switch. Enter is a no-op (native browser behavior for checkboxes)." },
          { tone: "must", text: "Focus lands on the native input; a 2px brand outline paints around the pill track (same ring as Button + Input + Checkbox + Radio)." },
          { tone: "must", text: "The outer <label> wraps the input, so clicking anywhere on the row (pill, label, description) toggles the switch without needing htmlFor/id gymnastics." },
          { tone: "must", text: "Invalid state emits aria-invalid='true' on the native input plus a red track and red focus ring." },
          { tone: "must", text: "Description registers a generated id and wires it into aria-describedby on the input automatically." },
          { tone: "must", text: "Required emits the native `required` attribute + a red `*` marker on the label." },
          { tone: "must", text: "Loading disables the input and sets aria-busy='true' on the row so AT announces the in-flight state." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the thumb glide + track transitions to 0ms and slows the loading spinner." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",       effect: "Move focus onto the switch." },
    { keys: "Shift+Tab", effect: "Move focus off the switch to the previous focusable element." },
    { keys: "Space",     effect: "Toggle the switch (native browser behavior for role='switch')." },
  ];
  return (
    <DocBlock title="Keyboard shortcuts">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {rows.map((row, i) => (
          <div
            key={row.keys}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>{row.keys}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.effect}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Use Switch for immediate state",   description: "Toggling should change something now — dark mode, auto-save, notifications, feature flags." },
          { title: "Keep labels imperative",           description: "\"Enable notifications\", \"Dark mode\", \"Auto-save\". Not \"Notifications?\" or \"Are notifications on?\"." },
          { title: "Add a Switch.Description",         description: "Always explain what the toggle changes — especially for settings that can't be visually observed." },
          { title: "Show loading during async saves",  description: "If flipping the switch triggers a network round-trip, set `loading` while it's in flight so the user knows the result is not final yet." },
        ]}
        donts={[
          { title: "Switch inside a form",             description: "If nothing changes until Submit, use Checkbox. Switch communicates immediate state." },
          { title: "Switches for multi-select",        description: "Use Checkbox. Multiple items → checkboxes; single ON/OFF → switch." },
          { title: "Custom OFF/ON labels",             description: "The pill IS the label — don't add \"OFF\"/\"ON\" labels next to it. The visual metaphor and the row label do the work." },
          { title: "Switches as confirmation",         description: "Never use a Switch for irreversible actions like \"Delete account\". Use a Button + Dialog." },
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
          { tone: "must-not", text: "Don't confuse Switch with Checkbox. Switch = immediate change of system state; Checkbox = a selection inside a form that submits later." },
          { tone: "must-not", text: "Don't wrap a Switch inside a clickable Card or clickable Table row without stopping propagation — clicking the Switch will also fire the row's onClick." },
          { tone: "must-not", text: "Don't render your own custom OFF/ON labels next to the switch. The pill itself is the visual affordance; adding text creates redundancy and clutters the row." },
          { tone: "must-not", text: "Don't use a Switch when the change is destructive or requires confirmation. Use a Button + Dialog so the user has a chance to review." },
          { tone: "must-not", text: "Don't hand-render your own track or thumb. The Indicator draws them based on state; if you override it, you own the state coupling too." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [checked, setChecked]     = useState(true);
  const [disabled, setDisabled]   = useState(false);
  const [required, setRequired]   = useState(false);
  const [invalid, setInvalid]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [size, setSize]           = useState<SwitchSize>("md");
  const [hasDescription, setHasDescription] = useState(true);
  const [hasLabel, setHasLabel]   = useState(true);
  const [controlled, setControlled] = useState(true);
  const [label, setLabel]         = useState("Enable notifications");
  const [description, setDescription] = useState("Push alerts for critical updates.");

  const commonProps = {
    size,
    disabled,
    required,
    invalid,
    loading,
  } as const;

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered Switch in real time. Live JSX is generated in the dark panel at the bottom.">
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
            justifyContent: "center",
            alignItems: "center",
            minHeight: 160,
          }}
        >
          {controlled ? (
            <Switch checked={checked} onCheckedChange={setChecked} {...commonProps}>
              {hasLabel && <Switch.Label>{label}</Switch.Label>}
              {hasDescription && <Switch.Description>{description}</Switch.Description>}
            </Switch>
          ) : (
            <Switch defaultChecked={checked} {...commonProps}>
              {hasLabel && <Switch.Label>{label}</Switch.Label>}
              {hasDescription && <Switch.Description>{description}</Switch.Description>}
            </Switch>
          )}
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size"      value={size}   options={SIZES} onChange={(v) => setSize(v as SwitchSize)} />
          <TextControl   label="label"       value={label}       onChange={setLabel} />
          <TextControl   label="description" value={description} onChange={setDescription} />
          <ToggleControl label="checked"     value={checked}     onChange={setChecked} />
          <ToggleControl label="disabled"    value={disabled}    onChange={setDisabled} />
          <ToggleControl label="required"    value={required}    onChange={setRequired} />
          <ToggleControl label="invalid"     value={invalid}     onChange={setInvalid} />
          <ToggleControl label="loading"     value={loading}     onChange={setLoading} />
          <ToggleControl label="description slot" value={hasDescription} onChange={setHasDescription} />
          <ToggleControl label="label slot"       value={hasLabel}       onChange={setHasLabel} />
          <ToggleControl label="controlled"  value={controlled}  onChange={setControlled} />
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
{renderCode({
  size, checked, controlled, disabled, required, invalid, loading,
  hasLabel, hasDescription, label, description,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: SwitchSize;
  checked: boolean;
  controlled: boolean;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  loading: boolean;
  hasLabel: boolean;
  hasDescription: boolean;
  label: string;
  description: string;
}) {
  const attrs: string[] = [];
  if (s.controlled) {
    attrs.push(`checked={checked}`);
    attrs.push(`onCheckedChange={setChecked}`);
  } else if (s.checked) {
    attrs.push(`defaultChecked`);
  }
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.disabled)      attrs.push(`disabled`);
  if (s.required)      attrs.push(`required`);
  if (s.invalid)       attrs.push(`invalid`);
  if (s.loading)       attrs.push(`loading`);

  const openTag = attrs.length > 0
    ? `<Switch\n  ${attrs.join("\n  ")}\n>`
    : `<Switch>`;

  const lines: string[] = [openTag];
  if (s.hasLabel)       lines.push(`  <Switch.Label>${esc(s.label)}</Switch.Label>`);
  if (s.hasDescription) lines.push(`  <Switch.Description>${esc(s.description)}</Switch.Description>`);
  lines.push(`</Switch>`);
  return lines.join("\n");
}

function esc(v: string) {
  return v.replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Six sketches of how downstream surfaces compose Switch. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <NotificationsExample />
        <DarkModeExample />
        <BackupsExample />
        <EmailAlertsExample />
        <AISuggestionsExample />
        <AutoSaveExample />
      </div>
    </DocBlock>
  );
}

function ExampleShell({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div
      style={{
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.md,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
        {icon}
        <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function NotificationsExample() {
  const [on, setOn] = useState(true);
  return (
    <ExampleShell title="Enable notifications" icon={<Bell size={16} color={t.color.action.primary} />}>
      <Switch checked={on} onCheckedChange={setOn}>
        <Switch.Label>Push notifications</Switch.Label>
        <Switch.Description>Alert me when a critical event happens.</Switch.Description>
      </Switch>
    </ExampleShell>
  );
}

function DarkModeExample() {
  const [on, setOn] = useState(false);
  return (
    <ExampleShell title="Dark mode" icon={<Moon size={16} color={t.color.action.primary} />}>
      <Switch checked={on} onCheckedChange={setOn}>
        <Switch.Label>Dark mode</Switch.Label>
        <Switch.Description>Uses a dark surface tone across the app.</Switch.Description>
      </Switch>
    </ExampleShell>
  );
}

function BackupsExample() {
  const [on, setOn] = useState(true);
  const [busy, setBusy] = useState(false);
  return (
    <ExampleShell title="Automatic backups" icon={<Cloud size={16} color={t.color.action.primary} />}>
      <Switch
        checked={on}
        loading={busy}
        onCheckedChange={(next) => {
          setBusy(true);
          // Simulated async save — flips value after "network" completes.
          setTimeout(() => { setOn(next); setBusy(false); }, 900);
        }}
      >
        <Switch.Label>Automatic backups</Switch.Label>
        <Switch.Description>Uploads every 24 hours to encrypted storage.</Switch.Description>
      </Switch>
      <Button size="sm" onClick={() => setOn((v) => !v)}>Toggle from outside</Button>
    </ExampleShell>
  );
}

function EmailAlertsExample() {
  const [on, setOn] = useState(false);
  return (
    <ExampleShell title="Email alerts" icon={<Mail size={16} color={t.color.action.primary} />}>
      <Switch checked={on} onCheckedChange={setOn} size="lg">
        <Switch.Label>Email alerts</Switch.Label>
        <Switch.Description>Send a daily summary to your inbox at 8 AM.</Switch.Description>
      </Switch>
    </ExampleShell>
  );
}

function AISuggestionsExample() {
  const [on, setOn] = useState(true);
  return (
    <ExampleShell title="AI suggestions" icon={<Sparkles size={16} color={t.color.action.primary} />}>
      <Switch checked={on} onCheckedChange={setOn}>
        <Switch.Label>AI suggestions</Switch.Label>
        <Switch.Description>Show inline hints while composing.</Switch.Description>
      </Switch>
    </ExampleShell>
  );
}

function AutoSaveExample() {
  const [on, setOn] = useState(true);
  return (
    <ExampleShell title="Auto save" icon={<Save size={16} color={t.color.action.primary} />}>
      <Switch checked={on} onCheckedChange={setOn} size="sm">
        <Switch.Label>Auto save</Switch.Label>
        <Switch.Description>Persists changes as you type.</Switch.Description>
      </Switch>
    </ExampleShell>
  );
}

/* ══════ Control primitives ════════════════════════════════════════ */

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

function TextControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function ToggleControl({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: t.space.inline.md, padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default, cursor: "pointer",
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{children}</span>;
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_SWITCH: PropRow[] = [
  { name: "size",            type: "'sm' | 'md' | 'lg'",              def: "'md'",  desc: "Row height + track/thumb dimensions." },
  { name: "checked",         type: "boolean",                          def: "—",     desc: "Controlled on/off state. Pair with onCheckedChange." },
  { name: "defaultChecked",  type: "boolean",                          def: "false", desc: "Uncontrolled initial on/off state." },
  { name: "onCheckedChange", type: "(checked, e) => void",             def: "—",     desc: "Fires when the user toggles the switch." },
  { name: "onChange",        type: "(e: ChangeEvent) => void",         def: "—",     desc: "Native onChange — the raw event if you need it." },
  { name: "invalid",         type: "boolean",                          def: "false", desc: "Red track + aria-invalid='true'." },
  { name: "disabled",        type: "boolean",                          def: "false", desc: "Disable interaction. Propagated to the native input." },
  { name: "required",        type: "boolean",                          def: "false", desc: "Native required + red * marker." },
  { name: "loading",         type: "boolean",                          def: "false", desc: "Show a spinner inside the thumb, disable the input, emit aria-busy='true'. Use during async saves." },
  { name: "id",              type: "string",                          def: "auto",  desc: "Override the native input id." },
  { name: "children",        type: "ReactNode",                        def: "—",     desc: "Compose <Switch.Label> + <Switch.Description>, or plain text (becomes the label)." },
];

const PROPS_INDICATOR: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Custom inner content. Rarely used — the root draws the track + thumb automatically." },
];

const PROPS_LABEL: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Label text next to the pill." },
];

const PROPS_DESCRIPTION: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—",    desc: "Secondary text under the label. Auto-wires aria-describedby." },
  { name: "id",       type: "string",    def: "auto", desc: "Override the description id (default: `${input-id}-description`)." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Switch"             rows={PROPS_SWITCH} />
      <PropsSubsection title="Switch.Indicator"   rows={PROPS_INDICATOR} />
      <PropsSubsection title="Switch.Label"       rows={PROPS_LABEL} />
      <PropsSubsection title="Switch.Description" rows={PROPS_DESCRIPTION} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Switch forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;input type=&quot;checkbox&quot;&gt;</code> HTML attributes (form, autoFocus, tabIndex, etc.) except the ones it manages internally (type, checked, defaultChecked, onChange).
      </div>
    </DocBlock>
  );
}

function PropsSubsection({ title, rows }: { title: string; rows: PropRow[] }) {
  return (
    <div style={{ marginTop: t.space.stack.md }}>
      <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.text.primary, marginBottom: t.space.stack.sm, fontFamily: t.font.mono }}>
        {title}
      </div>
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "180px 1.4fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1.4fr 100px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>{row.name}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>{row.type}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{row.def}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </div>
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
    { role: "Track radius",           alias: "aliases.radius.full (pill)" },
    { role: "Track border (rest)",    alias: "aliases.color.border.strong (same as Checkbox / Radio)" },
    { role: "Track background (off)", alias: "aliases.color.background.muted" },
    { role: "Hover border",           alias: "aliases.color.action.primary" },
    { role: "Checked track fill",     alias: "aliases.color.action.primary" },
    { role: "Checked hover fill",     alias: "aliases.color.action.primaryHover" },
    { role: "Thumb background",       alias: "aliases.color.background.default + shadow.xs" },
    { role: "Focus ring",             alias: "aliases.color.border.focus (identical to Button + Input + Select + Checkbox + Radio + Card + Dialog + Drawer)" },
    { role: "Invalid border/ring",    alias: "aliases.color.status.error.fg" },
    { role: "Disabled fill",          alias: "aliases.color.action.primaryDisabled + text.disabled" },
    { role: "Disabled row text",      alias: "aliases.color.text.disabled" },
    { role: "Label typography",       alias: "aliases.typography.caption / bodyS / body per size · weight medium (matches Checkbox)" },
    { role: "Description typography", alias: "aliases.typography.caption / bodyS per size · color text.tertiary (matches Checkbox)" },
    { role: "Required marker",        alias: "aliases.color.status.error.fg + font-weight semibold" },
    { role: "Row height ladder",      alias: "components.checkbox.size.{sm,md,lg}.row (28 / 36 / 44) — literally reused" },
    { role: "Track W × H ladder",     alias: "24×14 · 28×16 · 36×20 per size (sm / md / lg)" },
    { role: "Thumb size ladder",      alias: "10 · 12 · 16 per size (sm / md / lg)" },
    { role: "Motion",                 alias: "aliases.motion.hoverIn (duration 150, easing standard) for track colour + thumb glide" },
    { role: "Loading spinner",        alias: "800ms linear — 2400ms under prefers-reduced-motion" },
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
          { tone: "note", text: "Switch reuses Checkbox's DOM shape: a <label> wraps a native <input> that's absolutely-positioned + opacity-0 over the visible track. Pointer + focus land on the real element; the focus ring paints on the adjacent-sibling track via a CSS combinator." },
          { tone: "note", text: "The size ladder shares Checkbox's row heights (28 / 36 / 44) by direct token reference (see tokens/components/switch.ts: `row: checkbox.size.sm.row`) — the two controls always align vertically. Track and thumb geometry are Switch-specific." },
          { tone: "note", text: "Underlying input is `<input type='checkbox' role='switch'>`. role='switch' tells assistive tech this is a two-state toggle so it's announced as \"on\" / \"off\" instead of \"checked\" / \"not checked\". aria-checked is emitted natively by the checkbox — we don't override it." },
          { tone: "note", text: "The Switch component always renders its native input as internally controlled (checked={currentChecked}) — same fix as Checkbox PR #18. Consumer's controlled/uncontrolled facade is resolved above the render." },
          { tone: "note", text: "The thumb slides via CSS `transform: translate()` on the checked class. The translate distance = trackWidth − thumbSize − 4px (2px inset each side), computed per size so the thumb always sits flush at both ends." },
          { tone: "note", text: "Loading disables the native input, sets aria-busy='true' on the row, and paints a spinner inside the thumb. Consumer owns clearing loading when the async work finishes." },
        ]}
      />

      <Callout tone="info" title="Extending Switch">
        (1) A future Toggle Group primitive (a segmented row of two-state toggles for exclusive-choice patterns) would compose Switch semantics but present as a segmented control. Not built here — it's a distinct visual family.
        (2) A new size should only be added if a genuine layout intent emerges. Update
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/checkbox.ts
        </code>
        first (Switch's row heights come from there) and the matching CSS vars in
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          variables.css
        </code>
        before touching Switch.css.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "Native HTML checkbox + role='switch'", detail: "The core element is a real <input type='checkbox' role='switch'>. Space toggles, form submission works, screen readers announce it as a two-state toggle." },
    { name: "HC1 Checkbox tokens",                  detail: "Row heights, state palette, text typography, and spacing are literally shared with Checkbox by direct token reference. Same border tone, same focus ring, same hover cue, same disabled treatment." },
    { name: "HC1 design tokens",                    detail: "Every color, radius, spacing, motion, and size value is a token alias — no hex, no raw pixels, no bespoke shadows." },
    { name: "HC1 Button size ladder",               detail: "Row heights sm/md/lg map 1:1 to Button + Input + Checkbox + Radio 28/36/44 so a mixed form aligns perfectly on every row." },
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
    { name: "Settings",         detail: "Dark mode, auto-save, sound, telemetry — every immediate-effect setting toggle composes Switch." },
    { name: "Feature toggles",  detail: "Beta features and experimental behaviors that can be turned on and off without a form submit." },
    { name: "Notifications",    detail: "Push, email, in-app, SMS — each channel a separate Switch when they're immediate preferences." },
    { name: "Preferences",      detail: "AI suggestions, tips, keyboard shortcuts hints, telemetry, analytics." },
    { name: "Permissions",      detail: "Camera, microphone, clipboard, location — each an immediate ON/OFF toggle." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every binary immediate-state surface in HC1 should compose Switch. These are the anticipated consumers — none are shipped yet."
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
              <FileText size={14} color={t.color.action.primary} />
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

function MigrationBlock() {
  const rows = [
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke toggle rendering in review-flow settings and preference panels — replace with Switch at the same row size." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan toggle preferences and personalization toggles — swap to Switch and drop custom pill CSS." },
    { area: "ClinicalIQ · Starter",     detail: "Any settings toggles currently hand-rolled — sweep to the canonical primitive." },
    { area: "SourceIQ",                 detail: "Existing toggle surfaces should adopt the shared tokens + primitive so tone and geometry stay consistent." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce their own toggle rendering. Compose Switch from day one." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Switch replaces existing binary-toggle implementations. Standardize behavior — do not redesign the interactions."
    >
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {rows.map((row, i) => (
          <div
            key={row.area}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <span style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.text.primary }}>{row.area}</span>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.detail}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Component status ══════════════════════════════════════════ */

function StatusBlock() {
  return (
    <DocBlock title="Component status">
      <Checklist
        items={[
          { text: "HC1 Design Tokens only — every value references an alias" },
          { text: "Semantic aliases only — no primitive tokens consumed directly" },
          { text: "Accessible — native input with role='switch', aria-checked / aria-invalid / aria-describedby / aria-busy all wired" },
          { text: "Keyboard supported — Space toggles; Tab focuses the switch; focus ring paints on the pill" },
          { text: "Responsive — three sizes matching Checkbox + Radio + Button + Input row heights (28 / 36 / 44)" },
          { text: "Reuses Checkbox architecture — same DOM shape, same tokens, same focus ring, same text ladder" },
          { text: "Composable API — Switch + Indicator + Label + Description, no configuration booleans" },
          { text: "Loading state built in — spinner in thumb, disabled input, aria-busy on the row" },
          { text: "Production ready — controlled + uncontrolled, disabled + required + invalid + loading all covered" },
        ]}
      />
    </DocBlock>
  );
}
