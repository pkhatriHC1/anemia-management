import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Checkbox, type CheckboxSize } from "../../components/checkbox";
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

const SIZES: CheckboxSize[] = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function CheckboxDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <StatesBlock />
      <SizesBlock />
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
      title="The canonical HC1 Checkbox"
      lead="Checkbox is the canonical multi-selection control of the HC1 design system. Every table with row selection, every bulk-action toolbar, every permission matrix, every filter panel, and every preference form composes this Checkbox rather than reimplementing checkbox behavior. Checkboxes represent zero, one, or many independent choices — never mutually exclusive ones (use Radio for that)."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. The Indicator is auto-rendered by the root — you rarely compose it explicitly."
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
        <Checkbox defaultChecked>
          <Checkbox.Label>Send weekly digest</Checkbox.Label>
          <Checkbox.Description>Monday 8 AM summary of the past week's activity.</Checkbox.Description>
        </Checkbox>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Checkbox"             desc="Root <label>. Owns checked state; renders the native <input>, the visual box, and the text stack." />
        <Part name="Checkbox.Indicator"   desc="The visible box + check/dash glyph. Auto-rendered by the root; expose it here for advanced overrides." />
        <Part name="Checkbox.Label"       desc="The label text next to the box. Click-to-toggle works because the whole row is a <label>." />
        <Part name="Checkbox.Description" desc="Secondary text under the label. Auto-wires aria-describedby on the native input via a generated id." />
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
      lead="Checkbox is a compound component. Compose subcomponents for the text stack; the Indicator is drawn automatically."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Checkbox checked={agreed} onCheckedChange={setAgreed}>
  <Checkbox.Label>Accept terms</Checkbox.Label>
  <Checkbox.Description>
    You agree to our terms of service.
  </Checkbox.Description>
</Checkbox>

// Bare checkbox for table row selection:
<Checkbox
  aria-label="Select row"
  checked={row.selected}
  onCheckedChange={onSelectRow}
/>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`// Don't reimplement checkbox rendering
<div
  className="my-checkbox"
  onClick={toggle}
  role="checkbox"
  aria-checked={agreed}
>
  <div className="my-box">{agreed && "✓"}</div>
  <span>Accept terms</span>
</div>

// Don't stack booleans that all mean "one thing"
<Checkbox
  showLabel
  showDescription
  labelText="Accept"
  descText="…"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Only <Checkbox> is required. Label, Description, and Indicator are opt-in." },
          { tone: "should",   text: "Pass a short string as children (`<Checkbox>Accept</Checkbox>`) when there's no description — it's the same as composing <Checkbox.Label>." },
          { tone: "should",   text: "For bare checkboxes (table row selection, icon rows), always provide `aria-label` so screen readers know what's being selected." },
          { tone: "must-not", text: "Never introduce boolean props like `showLabel` or `withDescription`. If a piece is needed, compose it." },
          { tone: "must-not", text: "Never use Checkbox for mutually exclusive choices. That is Radio's job. If exactly one of many must be selected, use Radio." },
          { tone: "must-not", text: "Never reimplement the visual box with a <div role='checkbox'>. This Checkbox renders a real native <input type='checkbox'> so keyboard, form submission, and screen readers all work out of the box." },
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
        <StateTile name="Unchecked" note="Default resting state. Neutral border + white fill.">
          <Checkbox>State</Checkbox>
        </StateTile>
        <StateTile name="Checked" note="Brand fill + white check.">
          <Checkbox defaultChecked>State</Checkbox>
        </StateTile>
        <StateTile name="Indeterminate" note="Brand fill + horizontal bar. aria-checked='mixed'.">
          <Checkbox indeterminate>State</Checkbox>
        </StateTile>
        <StateTile name="Hover" note="Brand border cue; subtle background wash.">
          <div style={{ opacity: 1 }}>
            <Checkbox>Hover me</Checkbox>
          </div>
        </StateTile>
        <StateTile name="Focused" note="2px brand outline around the box (same ring as Button + Input).">
          <Checkbox autoFocus>State</Checkbox>
        </StateTile>
        <StateTile name="Disabled" note="Dimmed fill; pointer-events blocked; label + description muted.">
          <Checkbox disabled>Disabled</Checkbox>
        </StateTile>
        <StateTile name="Disabled + checked" note="Faded brand fill.">
          <Checkbox disabled defaultChecked>Disabled</Checkbox>
        </StateTile>
        <StateTile name="Invalid" note="Red border + red focus ring; aria-invalid='true'.">
          <Checkbox invalid>Invalid</Checkbox>
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

const SIZE_META: Record<CheckboxSize, { label: string; row: string; box: string; usage: string }> = {
  sm: { label: "Small",  row: "28px", box: "14px", usage: "Table cells, dense filter panels, compact toolbars." },
  md: { label: "Medium", row: "36px", box: "16px", usage: "Default. Forms, settings, preference lists." },
  lg: { label: "Large",  row: "44px", box: "20px", usage: "Touch surfaces, permission matrices, primary flows." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Three size steps. Row heights match Button + Input (28 / 36 / 44) so an inline Checkbox sits flush with them on the same row."
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

function SizeCell({ size }: { size: CheckboxSize }) {
  const meta = SIZE_META[size];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 96 }}>
        <Checkbox size={size} defaultChecked>
          <Checkbox.Label>{meta.label} · box {meta.box} · row {meta.row}</Checkbox.Label>
        </Checkbox>
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
          { tone: "must", text: "Renders a real native <input type='checkbox'> — screen readers, keyboard, and form submission all work without JS shims." },
          { tone: "must", text: "Space toggles the state — the native input handles this without any custom key handler." },
          { tone: "must", text: "Focus lands on the native input; a 2px brand outline paints around the visual box (same ring as Button + Input + Select)." },
          { tone: "must", text: "The outer <label> wraps the input, so clicking anywhere on the row toggles the state without needing htmlFor/id gymnastics." },
          { tone: "must", text: "Indeterminate state reports aria-checked='mixed'. The native `indeterminate` DOM property is also set so assistive tech reads it accurately." },
          { tone: "must", text: "Invalid state emits aria-invalid='true' + a red border. Combine with an error message container using aria-describedby for full context." },
          { tone: "must", text: "Description registers a generated id and wires it into aria-describedby automatically." },
          { tone: "must", text: "Required emits the native `required` attribute + a red `*` marker on the label." },
          { tone: "must", text: "Bare (no-text) checkboxes must be given `aria-label` so assistive tech can identify what's being selected." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses hover/state transitions to 0ms." },
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
          { title: "Use Checkbox for zero-to-many",     description: "If a user can select any subset (including nothing at all), Checkbox is right." },
          { title: "Pair select-all with indeterminate",description: "In a table header, when some but not all rows are selected, the master Checkbox should be indeterminate." },
          { title: "Provide aria-label for bare rows",  description: "Table row Checkboxes with no visible label need `aria-label='Select row {n}'` so screen readers know what's toggled." },
          { title: "Match size to context",             description: "sm in table cells / dense filters, md in forms / settings, lg on touch surfaces and permission matrices." },
        ]}
        donts={[
          { title: "Checkbox for exclusive choices",     description: "Only one of many? Use Radio. Two states of one thing (on/off)? Use Switch, when it lands." },
          { title: "Custom rendering",                   description: "Do not roll a <div role='checkbox'> to change the visual — override the token layer or extend the Indicator instead." },
          { title: "Silent required",                    description: "If the field is required, mark it visibly (the `*` on the label) — don't rely on the native validation popup alone." },
          { title: "Nested checkbox trees",              description: "This primitive is one checkbox. Tree selection is a separate composition and is not in scope here." },
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
          { tone: "must-not", text: "Don't confuse Checkbox with Switch. Checkbox = select from a set; Switch = toggle a single setting on/off (a Switch primitive is not built yet — use Checkbox for now if the framing is 'include this in a set')." },
          { tone: "must-not", text: "Don't mount a Checkbox inside a clickable Card or clickable Table row without stopping propagation — clicking the Checkbox will also fire the row's onClick and toggle twice." },
          { tone: "must-not", text: "Don't set both `checked` and `defaultChecked`. Controlled vs uncontrolled is one or the other." },
          { tone: "must-not", text: "Don't hand-render your own check icon. The Indicator draws the check/dash based on state; if you override it, you own the state coupling too." },
          { tone: "must-not", text: "Don't put a Checkbox in a form and rely on `required` alone for HTML validation — pair with an error message region for real feedback." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [checked, setChecked]                 = useState(false);
  const [indeterminate, setIndeterminate]     = useState(false);
  const [disabled, setDisabled]               = useState(false);
  const [required, setRequired]               = useState(false);
  const [invalid, setInvalid]                 = useState(false);
  const [hasLabel, setHasLabel]               = useState(true);
  const [hasDescription, setHasDescription]   = useState(true);
  const [controlled, setControlled]           = useState(true);
  const [size, setSize]                       = useState<CheckboxSize>("md");
  const [labelText, setLabelText]             = useState("Receive weekly digest");
  const [descriptionText, setDescriptionText] = useState("Monday 8 AM summary of the past week's activity.");

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered checkbox in real time. Live JSX is generated in the dark panel at the bottom.">
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
            minHeight: 120,
          }}
        >
          {controlled ? (
            <Checkbox
              size={size}
              checked={checked}
              onCheckedChange={setChecked}
              indeterminate={indeterminate}
              disabled={disabled}
              required={required}
              invalid={invalid}
              aria-label={hasLabel ? undefined : "Playground checkbox"}
            >
              {hasLabel && <Checkbox.Label>{labelText || "Untitled"}</Checkbox.Label>}
              {hasDescription && descriptionText && (
                <Checkbox.Description>{descriptionText}</Checkbox.Description>
              )}
            </Checkbox>
          ) : (
            <Checkbox
              size={size}
              defaultChecked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              required={required}
              invalid={invalid}
              aria-label={hasLabel ? undefined : "Playground checkbox"}
            >
              {hasLabel && <Checkbox.Label>{labelText || "Untitled"}</Checkbox.Label>}
              {hasDescription && descriptionText && (
                <Checkbox.Description>{descriptionText}</Checkbox.Description>
              )}
            </Checkbox>
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
          <SelectControl label="size"      value={size} options={SIZES} onChange={(v) => setSize(v as CheckboxSize)} />
          <TextControl   label="label"     value={labelText}       onChange={setLabelText} />
          <TextControl   label="description" value={descriptionText} onChange={setDescriptionText} />
          <ToggleControl label="checked"       value={checked}       onChange={setChecked} />
          <ToggleControl label="indeterminate" value={indeterminate} onChange={setIndeterminate} />
          <ToggleControl label="disabled"      value={disabled}      onChange={setDisabled} />
          <ToggleControl label="required"      value={required}      onChange={setRequired} />
          <ToggleControl label="invalid"       value={invalid}       onChange={setInvalid} />
          <ToggleControl label="description slot" value={hasDescription} onChange={setHasDescription} />
          <ToggleControl label="label slot"    value={hasLabel}      onChange={setHasLabel} />
          <ToggleControl label="controlled"    value={controlled}    onChange={setControlled} />
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
  size, checked, indeterminate, disabled, required, invalid, controlled,
  hasLabel, hasDescription, labelText, descriptionText,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: CheckboxSize;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  controlled: boolean;
  hasLabel: boolean;
  hasDescription: boolean;
  labelText: string;
  descriptionText: string;
}) {
  const attrs: string[] = [];
  if (s.size !== "md")     attrs.push(`size="${s.size}"`);
  if (s.controlled) {
    attrs.push(`checked={${s.checked}}`);
    attrs.push(`onCheckedChange={setChecked}`);
  } else if (s.checked) {
    attrs.push(`defaultChecked`);
  }
  if (s.indeterminate) attrs.push(`indeterminate`);
  if (s.disabled)      attrs.push(`disabled`);
  if (s.required)      attrs.push(`required`);
  if (s.invalid)       attrs.push(`invalid`);
  if (!s.hasLabel)     attrs.push(`aria-label="Playground checkbox"`);

  const hasChildren = s.hasLabel || (s.hasDescription && !!s.descriptionText);

  const openTag = attrs.length > 1
    ? `<Checkbox\n  ${attrs.join("\n  ")}\n${hasChildren ? ">" : "/>"}`
    : `<Checkbox${attrs.length ? " " + attrs[0] : ""}${hasChildren ? ">" : " />"}`;

  const lines: string[] = [openTag];
  if (hasChildren) {
    if (s.hasLabel)                              lines.push(`  <Checkbox.Label>${esc(s.labelText || "Untitled")}</Checkbox.Label>`);
    if (s.hasDescription && s.descriptionText)   lines.push(`  <Checkbox.Description>${esc(s.descriptionText)}</Checkbox.Description>`);
    lines.push(`</Checkbox>`);
  }
  return lines.join("\n");
}

function esc(v: string) {
  return v.replace(/</g, "&lt;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Six sketches of how downstream surfaces compose the same Checkbox. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <AcceptTermsExample />
        <NotificationsExample />
        <BulkSelectExample />
        <PermissionMatrixExample />
        <FilterPanelExample />
        <SettingsExample />
      </div>
    </DocBlock>
  );
}

function ExampleShell({ title, children }: { title: string; children: ReactNode }) {
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
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function AcceptTermsExample() {
  const [accepted, setAccepted] = useState(false);
  return (
    <ExampleShell title="Accept terms">
      <Checkbox checked={accepted} onCheckedChange={setAccepted} required invalid={!accepted}>
        <Checkbox.Label>Accept terms of service</Checkbox.Label>
        <Checkbox.Description>
          You agree to our terms and privacy policy. Required to continue.
        </Checkbox.Description>
      </Checkbox>
      <Button size="sm" disabled={!accepted}>Continue</Button>
    </ExampleShell>
  );
}

function NotificationsExample() {
  const [prefs, setPrefs] = useState({
    critical: true,
    consults: true,
    digest: false,
  });
  const update = (k: keyof typeof prefs) => (v: boolean) =>
    setPrefs((p) => ({ ...p, [k]: v }));
  return (
    <ExampleShell title="Receive notifications">
      <Checkbox checked={prefs.critical} onCheckedChange={update("critical")}>
        <Checkbox.Label>Critical lab results</Checkbox.Label>
        <Checkbox.Description>Sent immediately, 24/7.</Checkbox.Description>
      </Checkbox>
      <Checkbox checked={prefs.consults} onCheckedChange={update("consults")}>
        <Checkbox.Label>New consult requests</Checkbox.Label>
        <Checkbox.Description>Batched every 15 minutes.</Checkbox.Description>
      </Checkbox>
      <Checkbox checked={prefs.digest} onCheckedChange={update("digest")}>
        <Checkbox.Label>Weekly digest</Checkbox.Label>
        <Checkbox.Description>Monday 8 AM summary of the past week.</Checkbox.Description>
      </Checkbox>
    </ExampleShell>
  );
}

const BULK_ROWS = [
  { id: "P-001", name: "Jane Cooper",  ward: "Cardiology" },
  { id: "P-002", name: "Marcus Ortiz", ward: "Neurology"  },
  { id: "P-003", name: "Ada Sun",      ward: "ICU"        },
  { id: "P-004", name: "Reese Kim",    ward: "Oncology"   },
];

function BulkSelectExample() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected],
  );

  const allChecked = BULK_ROWS.every((r) => selected[r.id]);
  const noneChecked = BULK_ROWS.every((r) => !selected[r.id]);
  const someChecked = !allChecked && !noneChecked;

  const toggleAll = (v: boolean) => {
    setSelected(v ? Object.fromEntries(BULK_ROWS.map((r) => [r.id, true])) : {});
  };
  const toggleRow = (id: string) => (v: boolean) => {
    setSelected((s) => ({ ...s, [id]: v }));
  };

  return (
    <ExampleShell title="Bulk select table rows">
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr", padding: `${t.space.stack.sm} ${t.space.inline.md}`, background: t.color.background.subtle, borderBottom: `1px solid ${t.color.border.subtle}`, alignItems: "center" }}>
          <Checkbox
            size="sm"
            aria-label={allChecked ? "Deselect all rows" : "Select all rows"}
            checked={allChecked}
            indeterminate={someChecked}
            onCheckedChange={toggleAll}
          />
          <span style={{ ...t.type.caption, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary }}>Patient</span>
          <span style={{ ...t.type.caption, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary }}>Ward</span>
        </div>
        {BULK_ROWS.map((row) => (
          <div key={row.id} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr", padding: `${t.space.stack.sm} ${t.space.inline.md}`, alignItems: "center", borderBottom: `1px solid ${t.color.border.subtle}`, background: selected[row.id] ? t.color.background.subtle : t.color.background.default }}>
            <Checkbox
              size="sm"
              aria-label={`Select ${row.name}`}
              checked={!!selected[row.id]}
              onCheckedChange={toggleRow(row.id)}
            />
            <span style={{ fontSize: 14, color: t.color.text.primary }}>{row.name}</span>
            <span style={{ fontSize: 14, color: t.color.text.secondary }}>{row.ward}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: t.space.inline.md }}>
        <span style={{ ...t.type.caption, color: t.color.text.tertiary }}>
          {selectedIds.length} of {BULK_ROWS.length} selected
        </span>
        <Button size="sm" variant="secondary" disabled={selectedIds.length === 0}>Assign team</Button>
      </div>
    </ExampleShell>
  );
}

const PERMISSION_ROLES = ["View", "Edit", "Publish"] as const;
const PERMISSION_ROWS  = ["Care plans", "Orders", "Lab results", "AI insights"];

function PermissionMatrixExample() {
  type Role = typeof PERMISSION_ROLES[number];
  type Perms = Record<string, Record<Role, boolean>>;
  const [perms, setPerms] = useState<Perms>(() =>
    Object.fromEntries(PERMISSION_ROWS.map((r) => [r, { View: true, Edit: false, Publish: false }])),
  );

  const toggle = (row: string, role: Role) => (v: boolean) =>
    setPerms((p) => ({ ...p, [row]: { ...p[row], [role]: v } }));

  return (
    <ExampleShell title="Permission matrix">
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 60px)", padding: `${t.space.stack.sm} ${t.space.inline.md}`, background: t.color.background.subtle, borderBottom: `1px solid ${t.color.border.subtle}`, alignItems: "center", gap: t.space.inline.sm }}>
          <span style={{ ...t.type.caption, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary }}>Resource</span>
          {PERMISSION_ROLES.map((role) => (
            <span key={role} style={{ ...t.type.caption, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary, textAlign: "center" }}>{role}</span>
          ))}
        </div>
        {PERMISSION_ROWS.map((row) => (
          <div key={row} style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 60px)", padding: `${t.space.stack.sm} ${t.space.inline.md}`, alignItems: "center", borderBottom: `1px solid ${t.color.border.subtle}`, gap: t.space.inline.sm }}>
            <span style={{ fontSize: 14, color: t.color.text.primary }}>{row}</span>
            {PERMISSION_ROLES.map((role) => (
              <div key={role} style={{ display: "flex", justifyContent: "center" }}>
                <Checkbox
                  size="sm"
                  aria-label={`${role} ${row}`}
                  checked={perms[row][role]}
                  onCheckedChange={toggle(row, role)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </ExampleShell>
  );
}

const FILTER_ITEMS = [
  { label: "Cardiology",   count: 42 },
  { label: "Neurology",    count: 31 },
  { label: "Oncology",     count: 18 },
  { label: "ICU",          count: 12 },
  { label: "Pulmonology",  count: 9  },
];

function FilterPanelExample() {
  const [active, setActive] = useState<Record<string, boolean>>({ Cardiology: true, ICU: true });
  const toggle = (label: string) => (v: boolean) =>
    setActive((s) => ({ ...s, [label]: v }));

  return (
    <ExampleShell title="Filter panel">
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, padding: t.space.inline.md, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
        <span style={{ ...t.type.caption, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary, marginBottom: t.space.stack.xs }}>
          Care team
        </span>
        {FILTER_ITEMS.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: t.space.inline.md }}>
            <Checkbox
              size="sm"
              checked={!!active[item.label]}
              onCheckedChange={toggle(item.label)}
            >
              <Checkbox.Label>{item.label}</Checkbox.Label>
            </Checkbox>
            <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 12, color: t.color.text.tertiary }}>{item.count}</span>
          </div>
        ))}
      </div>
    </ExampleShell>
  );
}

function SettingsExample() {
  const [settings, setSettings] = useState({
    autoAssign: true,
    aiSuggestions: true,
    beta: false,
  });
  const update = (k: keyof typeof settings) => (v: boolean) =>
    setSettings((s) => ({ ...s, [k]: v }));

  return (
    <ExampleShell title="Settings">
      <Checkbox size="lg" checked={settings.autoAssign} onCheckedChange={update("autoAssign")}>
        <Checkbox.Label>Auto-assign incoming consults</Checkbox.Label>
        <Checkbox.Description>Consults route to the on-call member of your team automatically.</Checkbox.Description>
      </Checkbox>
      <Checkbox size="lg" checked={settings.aiSuggestions} onCheckedChange={update("aiSuggestions")}>
        <Checkbox.Label>Show AI care-plan suggestions</Checkbox.Label>
        <Checkbox.Description>Inline suggestions appear in the care-plan editor.</Checkbox.Description>
      </Checkbox>
      <Checkbox size="lg" checked={settings.beta} onCheckedChange={update("beta")}>
        <Checkbox.Label>Enroll in beta features</Checkbox.Label>
        <Checkbox.Description>New features may be unstable and change without notice.</Checkbox.Description>
      </Checkbox>
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

const PROPS_ROOT: PropRow[] = [
  { name: "size",            type: "'sm' | 'md' | 'lg'",                          def: "'md'",  desc: "Control size — rows match Button + Input sizes exactly." },
  { name: "checked",         type: "boolean",                                     def: "—",     desc: "Controlled checked state. Pair with onCheckedChange." },
  { name: "defaultChecked",  type: "boolean",                                     def: "false", desc: "Uncontrolled initial checked state." },
  { name: "onCheckedChange", type: "(checked: boolean, e: ChangeEvent) => void",  def: "—",     desc: "Fires when the user activates the checkbox." },
  { name: "onChange",        type: "(e: ChangeEvent) => void",                    def: "—",     desc: "Native onChange — the raw event if you need it." },
  { name: "indeterminate",   type: "boolean",                                     def: "false", desc: "Third visual state — box shows a dash; aria-checked='mixed'." },
  { name: "invalid",         type: "boolean",                                     def: "false", desc: "Red border + aria-invalid='true'. Pair with an external error message." },
  { name: "disabled",        type: "boolean",                                     def: "false", desc: "Dim the row; block interaction; propagate to the native input." },
  { name: "required",        type: "boolean",                                     def: "false", desc: "Native `required` on the input + a red `*` marker on the label." },
  { name: "id",              type: "string",                                      def: "auto",  desc: "Override the native input id (default: useId-generated)." },
  { name: "children",        type: "ReactNode",                                   def: "—",     desc: "Compose with Checkbox.Label + Checkbox.Description; plain text becomes the label." },
];

const PROPS_INDICATOR: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Custom check/dash glyphs. Rarely used — the root Indicator draws the right glyph automatically." },
];

const PROPS_LABEL: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Label text next to the box." },
];

const PROPS_DESCRIPTION: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Secondary text under the label. Auto-wires aria-describedby." },
  { name: "id",       type: "string",    def: "auto", desc: "Override the description id (default: `${input-id}-description`)." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Checkbox"             rows={PROPS_ROOT} />
      <PropsSubsection title="Checkbox.Indicator"   rows={PROPS_INDICATOR} />
      <PropsSubsection title="Checkbox.Label"       rows={PROPS_LABEL} />
      <PropsSubsection title="Checkbox.Description" rows={PROPS_DESCRIPTION} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Checkbox forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;input type=&quot;checkbox&quot;&gt;</code> HTML attributes (name, value, form, autoFocus, tabIndex, etc.) except the ones it manages internally (checked, defaultChecked, onChange).
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
    { role: "Box radius",           alias: "aliases.radius.chip (4)" },
    { role: "Box border (rest)",    alias: "aliases.color.border.strong" },
    { role: "Box background",       alias: "aliases.color.background.default" },
    { role: "Hover border",         alias: "aliases.color.action.primary" },
    { role: "Hover background",     alias: "aliases.color.background.subtle" },
    { role: "Checked fill",         alias: "aliases.color.action.primary" },
    { role: "Checked hover",        alias: "aliases.color.action.primaryHover" },
    { role: "Check glyph color",    alias: "aliases.color.text.inverse" },
    { role: "Focus ring",           alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Drawer)" },
    { role: "Invalid border/ring",  alias: "aliases.color.status.error.fg" },
    { role: "Disabled fill",        alias: "aliases.color.action.primaryDisabled + text.disabled" },
    { role: "Disabled row text",    alias: "aliases.color.text.disabled" },
    { role: "Label typography",     alias: "aliases.typography.caption / bodyS / body per size · weight medium" },
    { role: "Description typography", alias: "aliases.typography.caption / bodyS per size · color text.tertiary" },
    { role: "Required marker",      alias: "aliases.color.status.error.fg + font-weight semibold" },
    { role: "Row height ladder",    alias: "components.checkbox.size.{sm,md,lg}.row (28 / 36 / 44) — matches Button + Input" },
    { role: "Control size ladder",  alias: "components.checkbox.size.{sm,md,lg}.control (14 / 16 / 20)" },
    { role: "Motion",               alias: "aliases.motion.hoverIn (duration 150, easing standard)" },
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
          { tone: "note", text: "The native <input type='checkbox'> is visually collapsed to zero size but stays interactive — pointer, keyboard, and form submission all flow through the real element. The visual box is a sibling <span>; the focus ring paints on that sibling via a CSS adjacent selector." },
          { tone: "note", text: "The whole row is a <label> wrapping the input. Clicking anywhere on the row (box, label, description) toggles the checkbox without any custom click handler." },
          { tone: "note", text: "Controlled + uncontrolled coexist on the same root — mixing them is guarded internally so React never warns about switching between the two." },
          { tone: "note", text: "`indeterminate` is applied both as `aria-checked='mixed'` AND as the runtime `input.indeterminate` DOM property (via useEffect). Assistive tech will read the state whichever it inspects." },
          { tone: "note", text: "Checkbox.Description registers with the root via context and generates the id that gets wired into aria-describedby. If you use Checkbox without a Description, no aria-describedby is set." },
          { tone: "note", text: "The check glyph uses inline SVG (not a font icon) so it scales cleanly and inherits currentColor for the state transitions." },
        ]}
      />

      <Callout tone="info" title="Extending Checkbox">
        (1) Downstream selection surfaces — Table row selection, bulk-action toolbars, permission matrices — should compose this Checkbox verbatim. Do not wrap it in a bespoke component that hides state; wire your controlled state directly.
        (2) A new size should only be added if a genuine layout intent emerges. Update
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/checkbox.ts
        </code>
        and the matching CSS variables in
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          variables.css
        </code>
        before touching Checkbox.css.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "Native HTML checkbox",   detail: "The core element is a real <input type='checkbox'>. Space toggles, form submission works, screen readers announce it correctly — no synthetic role='checkbox' shims." },
    { name: "HC1 design tokens",      detail: "Every color, radius, spacing, motion, and size value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Input focus ring",   detail: "The 2px brand outline uses the same aliases.color.border.focus as Button, Input, Select, Card, Dialog, and Drawer — cross-family consistency." },
    { name: "HC1 Button size ladder", detail: "Row heights sm/md/lg map 1:1 to Button + Input 28/36/44 so an inline Checkbox on the same row aligns perfectly." },
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
    { name: "Table row selection",     detail: "Per-row and select-all Checkboxes in the canonical Table. Select-all uses `indeterminate` when some rows are selected." },
    { name: "Bulk action toolbars",    detail: "Selection driven by the Table's Checkboxes fans out into bulk operations (assign, archive, delete)." },
    { name: "Permission matrix",       detail: "Grid of Checkboxes representing per-role, per-resource access. Uses `size='sm'` so dense matrices stay readable." },
    { name: "Filter panels",           detail: "Multi-select filter tray inside a Drawer. Each option is a Checkbox with a count on the right." },
    { name: "Preference forms",        detail: "Notification preferences, feature-flag opt-ins, digest schedules — every checkbox in a Settings surface." },
    { name: "Playground doc controls", detail: "The design-system playground's own ToggleControls will migrate off native `<input>` to this Checkbox in a future sweep." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every multi-selection surface in HC1 should compose this Checkbox. These are the anticipated consumers — none are shipped yet."
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
              <ShieldCheck size={14} color={t.color.action.primary} />
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke checkbox rendering in the BloodHealth review flow — replace with the canonical Checkbox at the same size." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan selection lists and consent capture — swap to Checkbox and drop the custom SVG paths." },
    { area: "ClinicalIQ · Starter",     detail: "Filter and settings checkboxes currently hand-rolled — sweep to the canonical primitive." },
    { area: "SourceIQ",                 detail: "Existing selection lists should adopt the shared tokens + primitive so tone and geometry stay consistent." },
    { area: "Design-system doc controls", detail: "Every existing ToggleControl in this playground uses a raw <input type='checkbox'>. Sweep to <Checkbox> in a follow-up PR." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce their own checkbox rendering. Compose Checkbox from day one." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Checkbox replaces existing selection implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — native input, aria-checked='mixed' for indeterminate, aria-invalid, aria-describedby, required" },
          { text: "Keyboard supported — Space toggles; Tab moves focus; native input handles both" },
          { text: "Responsive — three sizes matching Button + Input row heights (28 / 36 / 44)" },
          { text: "Composable API — root + Indicator + Label + Description, no configuration booleans" },
          { text: "Reduced motion honored — state transitions collapse to 0ms" },
          { text: "Production ready — controlled + uncontrolled, indeterminate, invalid, required, disabled all covered" },
        ]}
      />

      <div
        style={{
          marginTop: t.space.stack.lg,
          padding: t.space.inline.lg,
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          display: "flex",
          gap: t.space.inline.md,
          alignItems: "center",
        }}
      >
        <Bell size={20} color={t.color.action.primary} />
        <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
          Not built here: Checkbox Groups, Tree Selection, and Permission Matrix as reusable components. Those are compositions on top of this Checkbox — the doc has an illustrative Permission Matrix, not a shipped API.
        </div>
      </div>
    </DocBlock>
  );
}
