import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Palette,
  Truck,
  UserCircle2,
} from "lucide-react";
import {
  Radio,
  RadioGroup,
  type RadioGroupOrientation,
  type RadioSize,
} from "../../components/radio";
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

const SIZES:      RadioSize[]              = ["sm", "md", "lg"];
const ORIENTATIONS: RadioGroupOrientation[] = ["vertical", "horizontal"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function RadioDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <RadioGroupBlock />
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
      title="The canonical HC1 Radio"
      lead="Radio is the canonical single-selection control of the HC1 design system. Every settings screen, every preference form, every filter that forces one-choice-from-many composes this Radio rather than reimplementing radio behavior. Radios represent exactly one choice from a set — use Checkbox for zero-or-more, use Select for long lists, use Segmented Control (future) for compact toggles."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [value, setValue] = useState("email");
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
        <RadioGroup
          value={value}
          onValueChange={setValue}
          label="Notification channel"
          description="How would you like us to reach you?"
        >
          <Radio value="email">
            <Radio.Label>Email</Radio.Label>
            <Radio.Description>Daily digest at 8 AM.</Radio.Description>
          </Radio>
          <Radio value="sms">
            <Radio.Label>SMS</Radio.Label>
            <Radio.Description>Immediate — for critical alerts only.</Radio.Description>
          </Radio>
          <Radio value="push">
            <Radio.Label>Push notification</Radio.Label>
            <Radio.Description>Requires the mobile app.</Radio.Description>
          </Radio>
        </RadioGroup>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Radio"             desc="Root <label>. Owns per-radio state; renders the native <input type='radio'>, the circular indicator, and the text stack." />
        <Part name="Radio.Indicator"   desc="The visible circle + inner filled dot when checked. Auto-rendered by the root; expose it here for advanced overrides." />
        <Part name="Radio.Label"       desc="The label text next to the circle. Click-to-select works because the whole row is a <label>." />
        <Part name="Radio.Description" desc="Secondary text under the label. Auto-wires aria-describedby on the native input via a generated id." />
        <Part name="RadioGroup"        desc="Groups radios under a shared name + shared value. Manages roving tabIndex + inheritable size / disabled / invalid / required. Renders <div role='radiogroup'>." />
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
      lead="Radio is a compound component with a companion RadioGroup for shared state. Compose group + radios; the indicator is drawn automatically."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<RadioGroup
  value={theme}
  onValueChange={setTheme}
  label="Theme"
>
  <Radio value="light">Light</Radio>
  <Radio value="dark">Dark</Radio>
  <Radio value="system">
    <Radio.Label>Follow system</Radio.Label>
    <Radio.Description>
      Matches your OS setting.
    </Radio.Description>
  </Radio>
</RadioGroup>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`// Don't use Radio for zero-or-many selection
<RadioGroup>
  <Radio value="email">Email</Radio>
  <Radio value="sms">SMS</Radio>
  <Radio value="push">Push</Radio>
  {/* User wants email AND push? Use Checkbox. */}
</RadioGroup>

// Don't hand-manage \`name\` across sibling Radios
<Radio name="theme" value="light" />
<Radio name="theme" value="dark" />
{/* Use <RadioGroup> — it owns \`name\` and roving tabIndex. */}`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Wrap radios in <RadioGroup> whenever there are two or more choices — it owns shared name, value, and roving tabIndex so keyboard navigation and form submission both work." },
          { tone: "should",   text: "Pass a short string as children (`<Radio value='x'>Label</Radio>`) when there's no description — it's the same as composing <Radio.Label>." },
          { tone: "must-not", text: "Never use Radio for multi-selection. If two or more choices can be active simultaneously, use Checkbox." },
          { tone: "must-not", text: "Never reimplement the visual circle with a <div role='radio'>. This Radio renders a real native <input type='radio'> so keyboard, form submission, arrow-key nav, and screen readers all work out of the box." },
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

/* ══════ RadioGroup section ════════════════════════════════════════ */

function RadioGroupBlock() {
  const [vertical, setVertical]     = useState<string>("standard");
  const [horizontal, setHorizontal] = useState<string>("small");
  return (
    <DocBlock
      title="RadioGroup"
      lead="RadioGroup wraps a set of Radios under a shared name and shared value. It owns roving tabIndex so keyboard users tab INTO the group once, then use arrow keys to move between radios."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary, marginBottom: t.space.stack.md }}>Vertical (default)</div>
          <RadioGroup value={vertical} onValueChange={setVertical}>
            <Radio value="standard">Standard delivery</Radio>
            <Radio value="express">Express delivery</Radio>
            <Radio value="pickup">In-store pickup</Radio>
          </RadioGroup>
        </div>
        <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary, marginBottom: t.space.stack.md }}>Horizontal</div>
          <RadioGroup value={horizontal} onValueChange={setHorizontal} orientation="horizontal">
            <Radio value="small">Small</Radio>
            <Radio value="medium">Medium</Radio>
            <Radio value="large">Large</Radio>
          </RadioGroup>
        </div>
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note",     text: "RadioGroup generates a shared `name` via useId. Every child Radio inherits it — you never write name= yourself." },
            { tone: "note",     text: "Arrow keys move focus AND selection between radios (native browser behavior for radios sharing a name). Home / End jump to the first / last radio." },
            { tone: "note",     text: "Roving tabIndex: the currently-selected radio is tabIndex=0, others are tabIndex=-1. If nothing is selected, the first radio is tabbable so keyboard users can tab in." },
            { tone: "note",     text: "size, disabled, invalid, required, and orientation propagate from the group. Individual Radios can override any of these — explicit props always win." },
            { tone: "must-not", text: "Never nest a RadioGroup inside another RadioGroup. If you have branching choices, use a Select or a two-step flow." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  const [group, setGroup] = useState("");
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
          <RadioGroup value={group} onValueChange={setGroup}>
            <Radio value="opt-1">State</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Checked" note="Brand fill + inner white dot.">
          <RadioGroup value="opt-2" onValueChange={() => {}}>
            <Radio value="opt-2">State</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Hover" note="Brand border cue; subtle background wash.">
          <RadioGroup value="" onValueChange={() => {}}>
            <Radio value="opt-3">Hover me</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Focused" note="2px brand outline around the circle (same ring as Button + Input + Checkbox).">
          <RadioGroup value="opt-4" onValueChange={() => {}}>
            <Radio value="opt-4" autoFocus>State</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Disabled" note="Dimmed fill; pointer-events blocked; label + description muted.">
          <RadioGroup value="" disabled>
            <Radio value="opt-5">Disabled</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Disabled + checked" note="Faded brand fill.">
          <RadioGroup value="opt-6" disabled>
            <Radio value="opt-6">Disabled</Radio>
          </RadioGroup>
        </StateTile>
        <StateTile name="Invalid" note="Red border + red focus ring; aria-invalid='true'.">
          <RadioGroup value="" invalid>
            <Radio value="opt-7">Invalid</Radio>
          </RadioGroup>
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

const SIZE_META: Record<RadioSize, { label: string; row: string; box: string; usage: string }> = {
  sm: { label: "Small",  row: "28px", box: "14px", usage: "Dense filter panels, compact toolbars, table cells." },
  md: { label: "Medium", row: "36px", box: "16px", usage: "Default. Forms, settings, preference lists." },
  lg: { label: "Large",  row: "44px", box: "20px", usage: "Touch surfaces, primary choice flows, large form pages." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Three size steps — identical to Checkbox and matching Button + Input row heights (28 / 36 / 44). Mixed forms with both Radio and Checkbox stack cleanly at the same size."
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

function SizeCell({ size }: { size: RadioSize }) {
  const meta = SIZE_META[size];
  const [v, setV] = useState<string>("yes");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 96 }}>
        <RadioGroup value={v} onValueChange={setV} size={size}>
          <Radio value="yes">{meta.label} · box {meta.box} · row {meta.row}</Radio>
        </RadioGroup>
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
          { tone: "must", text: "Renders a real native <input type='radio'> — screen readers, keyboard, and form submission all work without JS shims." },
          { tone: "must", text: "RadioGroup renders <div role='radiogroup'> with aria-orientation, aria-labelledby (if `label` is provided), aria-describedby (if `description` or `errorMessage`), aria-required, aria-invalid, aria-disabled." },
          { tone: "must", text: "All radios in a group share the same `name` (auto-generated by RadioGroup via useId), so the browser handles arrow-key navigation + one-of-many selection natively." },
          { tone: "must", text: "Roving tabIndex — the currently-selected radio is tabIndex=0, others are tabIndex=-1. If nothing is selected, the first Radio in the group is tabbable so keyboard users can tab into it." },
          { tone: "must", text: "Space selects the focused radio. Arrow keys move focus AND selection to the previous / next radio (native browser behavior)." },
          { tone: "must", text: "Focus lands on the native input; a 2px brand outline paints around the circular indicator (same ring as Button + Input + Checkbox)." },
          { tone: "must", text: "The outer <label> wraps the input, so clicking anywhere on the row selects the radio without needing htmlFor/id gymnastics." },
          { tone: "must", text: "Invalid state emits aria-invalid='true' on both the group root AND every child radio input. Pair with `errorMessage` for a red text region below the radios." },
          { tone: "must", text: "Description registers a generated id and wires it into aria-describedby on the input automatically." },
          { tone: "must", text: "Required emits the native `required` attribute + a red `*` marker on the label. RadioGroup's `required` propagates to children AND emits aria-required on the group root." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses state transitions to 0ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",              effect: "Move focus INTO the group (lands on the selected radio, or the first if none is selected)." },
    { keys: "Shift+Tab",        effect: "Move focus OUT of the group to the previous focusable element." },
    { keys: "Arrow Down / Right", effect: "Move focus AND selection to the next radio in the group. Wraps at the end (native browser behavior)." },
    { keys: "Arrow Up / Left",  effect: "Move focus AND selection to the previous radio. Wraps at the start." },
    { keys: "Space",            effect: "Select the currently-focused radio (redundant with arrow-key behavior; matches WAI-ARIA authoring practice)." },
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
          { title: "Use Radio for exactly-one-of-many",  description: "If a user must choose one option (and only one), Radio is right." },
          { title: "Always compose inside RadioGroup",   description: "Even two radios need a group — it manages shared name, roving tabIndex, and arrow-key nav." },
          { title: "Set a default selection",            description: "Pre-select a sensible default whenever possible so the user doesn't face an empty state. Use `defaultValue` on RadioGroup." },
          { title: "Match size to context",              description: "sm in dense filters, md in forms / settings, lg on touch surfaces and primary flows." },
        ]}
        donts={[
          { title: "Radio for multi-select",             description: "Two-plus choices can be active? Use Checkbox — it's built for zero-or-many." },
          { title: "Very long lists",                    description: "Six or more options → use Select. Radios are for small, at-a-glance choice sets." },
          { title: "Radios without a group",             description: "Bare Radios don't share a name automatically. Wrap them so browsers can natively handle arrow-key nav." },
          { title: "Mixed sizes in one form",            description: "Every Radio + Checkbox in the same form should share a size. Pass `size` on RadioGroup once instead of per-Radio." },
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
          { tone: "must-not", text: "Don't confuse Radio with Checkbox. Radio = pick ONE from a set; Checkbox = pick ZERO OR MORE independently." },
          { tone: "must-not", text: "Don't set both `value` on RadioGroup AND `checked` on individual Radios — the group owns selection when radios are inside it." },
          { tone: "must-not", text: "Don't hand-manage `name` across sibling Radios. RadioGroup generates a shared name via useId; skipping it breaks native arrow-key nav." },
          { tone: "must-not", text: "Don't put a Radio inside a clickable Card or clickable Table row without stopping propagation — clicking the Radio will also fire the row's onClick." },
          { tone: "must-not", text: "Don't hand-render your own circle. The Indicator draws the circle + dot based on state; if you override it, you own the state coupling too." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [value, setValue]                     = useState("email");
  const [disabled, setDisabled]               = useState(false);
  const [required, setRequired]               = useState(false);
  const [invalid, setInvalid]                 = useState(false);
  const [size, setSize]                       = useState<RadioSize>("md");
  const [orientation, setOrientation]         = useState<RadioGroupOrientation>("vertical");
  const [hasDescription, setHasDescription]   = useState(true);
  const [hasLabel, setHasLabel]               = useState(true);
  const [controlled, setControlled]           = useState(true);
  const [errorMessage, setErrorMessage]       = useState("");
  const [groupLabel, setGroupLabel]           = useState("Notification channel");

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered RadioGroup in real time. Live JSX is generated in the dark panel at the bottom.">
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
            minHeight: 200,
          }}
        >
          {controlled ? (
            <RadioGroup
              value={value}
              onValueChange={setValue}
              size={size}
              orientation={orientation}
              disabled={disabled}
              invalid={invalid || !!errorMessage}
              required={required}
              label={hasLabel ? groupLabel : undefined}
              errorMessage={errorMessage || undefined}
            >
              <Radio value="email">
                <Radio.Label>Email</Radio.Label>
                {hasDescription && <Radio.Description>Daily digest at 8 AM.</Radio.Description>}
              </Radio>
              <Radio value="sms">
                <Radio.Label>SMS</Radio.Label>
                {hasDescription && <Radio.Description>Immediate — critical alerts only.</Radio.Description>}
              </Radio>
              <Radio value="push">
                <Radio.Label>Push notification</Radio.Label>
                {hasDescription && <Radio.Description>Requires the mobile app.</Radio.Description>}
              </Radio>
            </RadioGroup>
          ) : (
            <RadioGroup
              defaultValue={value}
              size={size}
              orientation={orientation}
              disabled={disabled}
              invalid={invalid || !!errorMessage}
              required={required}
              label={hasLabel ? groupLabel : undefined}
              errorMessage={errorMessage || undefined}
            >
              <Radio value="email">
                <Radio.Label>Email</Radio.Label>
                {hasDescription && <Radio.Description>Daily digest at 8 AM.</Radio.Description>}
              </Radio>
              <Radio value="sms">
                <Radio.Label>SMS</Radio.Label>
                {hasDescription && <Radio.Description>Immediate — critical alerts only.</Radio.Description>}
              </Radio>
              <Radio value="push">
                <Radio.Label>Push notification</Radio.Label>
                {hasDescription && <Radio.Description>Requires the mobile app.</Radio.Description>}
              </Radio>
            </RadioGroup>
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
          <SelectControl label="size"        value={size}        options={SIZES}         onChange={(v) => setSize(v as RadioSize)} />
          <SelectControl label="orientation" value={orientation} options={ORIENTATIONS} onChange={(v) => setOrientation(v as RadioGroupOrientation)} />
          <TextControl   label="group label"   value={groupLabel}    onChange={setGroupLabel} />
          <TextControl   label="error message" value={errorMessage}  onChange={setErrorMessage} />
          <ToggleControl label="checked (email)" value={value === "email"} onChange={(v) => setValue(v ? "email" : "sms")} />
          <ToggleControl label="disabled"      value={disabled}      onChange={setDisabled} />
          <ToggleControl label="required"      value={required}      onChange={setRequired} />
          <ToggleControl label="invalid"       value={invalid}       onChange={setInvalid} />
          <ToggleControl label="description"   value={hasDescription} onChange={setHasDescription} />
          <ToggleControl label="group label"   value={hasLabel}      onChange={setHasLabel} />
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
  size, orientation, controlled, disabled, required, invalid, errorMessage,
  hasLabel, hasDescription, groupLabel, value,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: RadioSize;
  orientation: RadioGroupOrientation;
  controlled: boolean;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  errorMessage: string;
  hasLabel: boolean;
  hasDescription: boolean;
  groupLabel: string;
  value: string;
}) {
  const attrs: string[] = [];
  if (s.controlled) {
    attrs.push(`value={value}`);
    attrs.push(`onValueChange={setValue}`);
  } else {
    attrs.push(`defaultValue="${s.value}"`);
  }
  if (s.size !== "md")            attrs.push(`size="${s.size}"`);
  if (s.orientation !== "vertical") attrs.push(`orientation="${s.orientation}"`);
  if (s.disabled)                 attrs.push(`disabled`);
  if (s.required)                 attrs.push(`required`);
  if (s.invalid)                  attrs.push(`invalid`);
  if (s.hasLabel && s.groupLabel) attrs.push(`label="${esc(s.groupLabel)}"`);
  if (s.errorMessage)             attrs.push(`errorMessage="${esc(s.errorMessage)}"`);

  const openTag = `<RadioGroup\n  ${attrs.join("\n  ")}\n>`;

  const options = [
    { v: "email", l: "Email",             d: "Daily digest at 8 AM." },
    { v: "sms",   l: "SMS",               d: "Immediate — critical alerts only." },
    { v: "push",  l: "Push notification", d: "Requires the mobile app." },
  ];

  const lines: string[] = [openTag];
  for (const opt of options) {
    lines.push(`  <Radio value="${opt.v}">`);
    lines.push(`    <Radio.Label>${opt.l}</Radio.Label>`);
    if (s.hasDescription) lines.push(`    <Radio.Description>${opt.d}</Radio.Description>`);
    lines.push(`  </Radio>`);
  }
  lines.push(`</RadioGroup>`);
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
      lead="Five sketches of how downstream surfaces compose the same Radio / RadioGroup. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <GenderExample />
        <NotificationExample />
        <ThemeExample />
        <PaymentExample />
        <DeliveryExample />
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

function GenderExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleShell title="Gender selection" icon={<UserCircle2 size={16} color={t.color.action.primary} />}>
      <RadioGroup
        value={value}
        onValueChange={setValue}
        label="Gender"
        description="Optional. Used to inform screening recommendations."
      >
        <Radio value="female">Female</Radio>
        <Radio value="male">Male</Radio>
        <Radio value="nonbinary">Non-binary</Radio>
        <Radio value="prefer-not">Prefer not to say</Radio>
      </RadioGroup>
    </ExampleShell>
  );
}

function NotificationExample() {
  const [value, setValue] = useState("email");
  return (
    <ExampleShell title="Notification preference" icon={<Bell size={16} color={t.color.action.primary} />}>
      <RadioGroup value={value} onValueChange={setValue} label="Where should we send updates?">
        <Radio value="email">
          <Radio.Label>Email</Radio.Label>
          <Radio.Description>Daily digest at 8 AM.</Radio.Description>
        </Radio>
        <Radio value="sms">
          <Radio.Label>SMS</Radio.Label>
          <Radio.Description>Immediate — for critical alerts only.</Radio.Description>
        </Radio>
        <Radio value="none">
          <Radio.Label>No notifications</Radio.Label>
          <Radio.Description>You'll only see updates in the app.</Radio.Description>
        </Radio>
      </RadioGroup>
    </ExampleShell>
  );
}

function ThemeExample() {
  const [value, setValue] = useState("system");
  return (
    <ExampleShell title="Theme choice" icon={<Palette size={16} color={t.color.action.primary} />}>
      <RadioGroup value={value} onValueChange={setValue} label="Appearance" orientation="horizontal">
        <Radio value="light">Light</Radio>
        <Radio value="dark">Dark</Radio>
        <Radio value="system">Follow system</Radio>
      </RadioGroup>
    </ExampleShell>
  );
}

function PaymentExample() {
  const [value, setValue] = useState("card");
  const [submitted, setSubmitted] = useState(false);
  return (
    <ExampleShell title="Payment method" icon={<CreditCard size={16} color={t.color.action.primary} />}>
      <RadioGroup
        value={value}
        onValueChange={(v) => { setValue(v); setSubmitted(false); }}
        label="Payment method"
        required
        invalid={submitted && !value}
        errorMessage={submitted && !value ? "Choose a payment method to continue." : undefined}
      >
        <Radio value="card">
          <Radio.Label>Credit / debit card</Radio.Label>
          <Radio.Description>Visa, MasterCard, Amex.</Radio.Description>
        </Radio>
        <Radio value="ach">
          <Radio.Label>ACH bank transfer</Radio.Label>
          <Radio.Description>3–5 business days.</Radio.Description>
        </Radio>
        <Radio value="invoice">
          <Radio.Label>Invoice (net 30)</Radio.Label>
          <Radio.Description>Enterprise customers only.</Radio.Description>
        </Radio>
      </RadioGroup>
      <Button size="sm" onClick={() => setSubmitted(true)}>Continue</Button>
    </ExampleShell>
  );
}

function DeliveryExample() {
  const [value, setValue] = useState("standard");
  return (
    <ExampleShell title="Delivery option" icon={<Truck size={16} color={t.color.action.primary} />}>
      <RadioGroup value={value} onValueChange={setValue} label="Delivery" size="lg">
        <Radio value="standard">
          <Radio.Label>Standard</Radio.Label>
          <Radio.Description>4–7 business days · Free</Radio.Description>
        </Radio>
        <Radio value="express">
          <Radio.Label>Express</Radio.Label>
          <Radio.Description>1–2 business days · $9.99</Radio.Description>
        </Radio>
        <Radio value="overnight">
          <Radio.Label>Overnight</Radio.Label>
          <Radio.Description>Next business day · $24.99</Radio.Description>
        </Radio>
      </RadioGroup>
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

const PROPS_GROUP: PropRow[] = [
  { name: "value",           type: "string",                          def: "—",           desc: "Controlled selected value. Pair with onValueChange." },
  { name: "defaultValue",    type: "string",                          def: "—",           desc: "Uncontrolled initial selected value." },
  { name: "onValueChange",   type: "(value: string) => void",         def: "—",           desc: "Fires when the user selects a different radio." },
  { name: "name",            type: "string",                          def: "auto",        desc: "Shared name for the child inputs. Auto-generated via useId if omitted." },
  { name: "orientation",     type: "'vertical' | 'horizontal'",       def: "'vertical'",  desc: "Layout direction. Horizontal rows wrap on narrow viewports." },
  { name: "size",            type: "'sm' | 'md' | 'lg'",              def: "'md'",        desc: "Propagated to every child Radio." },
  { name: "disabled",        type: "boolean",                          def: "false",       desc: "Disable every radio in the group." },
  { name: "invalid",         type: "boolean",                          def: "false",       desc: "Mark the group as invalid (propagates to child radios + emits aria-invalid)." },
  { name: "required",        type: "boolean",                          def: "false",       desc: "Native required on every child input + a red * on the group label." },
  { name: "label",           type: "ReactNode",                        def: "—",           desc: "Group label rendered above the radios. Auto-wires aria-labelledby on the root." },
  { name: "description",     type: "ReactNode",                        def: "—",           desc: "Group description under the label. Auto-wires aria-describedby." },
  { name: "errorMessage",    type: "ReactNode",                        def: "—",           desc: "Red error text under the group. When present, group is invalid and aria-describedby includes the error id." },
  { name: "children",        type: "ReactNode",                        def: "—",           desc: "Compose <Radio> children." },
];

const PROPS_RADIO: PropRow[] = [
  { name: "value",           type: "string",                          def: "—",     desc: "Value this radio contributes when selected. Required inside a RadioGroup." },
  { name: "size",            type: "'sm' | 'md' | 'lg'",              def: "'md'",  desc: "Inherited from RadioGroup if unset." },
  { name: "checked",         type: "boolean",                          def: "—",     desc: "Standalone controlled state. Ignored inside a RadioGroup (group owns it)." },
  { name: "defaultChecked",  type: "boolean",                          def: "false", desc: "Standalone uncontrolled initial state." },
  { name: "onCheckedChange", type: "(checked, e) => void",             def: "—",     desc: "Fires when the user selects this radio." },
  { name: "onChange",        type: "(e: ChangeEvent) => void",         def: "—",     desc: "Native onChange — the raw event if you need it." },
  { name: "invalid",         type: "boolean",                          def: "false", desc: "Red border + aria-invalid='true'. Inherited from group." },
  { name: "disabled",        type: "boolean",                          def: "false", desc: "Disable this radio. Inherited from group." },
  { name: "required",        type: "boolean",                          def: "false", desc: "Native required + red * marker. Inherited from group." },
  { name: "name",            type: "string",                          def: "group", desc: "Native input name. Inherited from RadioGroup — rarely set directly." },
  { name: "id",              type: "string",                          def: "auto",  desc: "Override the native input id." },
  { name: "children",        type: "ReactNode",                        def: "—",     desc: "Compose <Radio.Label> + <Radio.Description>, or plain text (becomes the label)." },
];

const PROPS_INDICATOR: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Custom inner glyph. Rarely used — the root draws the circle + dot automatically." },
];

const PROPS_LABEL: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Label text next to the circle." },
];

const PROPS_DESCRIPTION: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—",    desc: "Secondary text under the label. Auto-wires aria-describedby." },
  { name: "id",       type: "string",    def: "auto", desc: "Override the description id (default: `${input-id}-description`)." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="RadioGroup"        rows={PROPS_GROUP} />
      <PropsSubsection title="Radio"             rows={PROPS_RADIO} />
      <PropsSubsection title="Radio.Indicator"   rows={PROPS_INDICATOR} />
      <PropsSubsection title="Radio.Label"       rows={PROPS_LABEL} />
      <PropsSubsection title="Radio.Description" rows={PROPS_DESCRIPTION} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Radio forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;input type=&quot;radio&quot;&gt;</code> HTML attributes (form, autoFocus, tabIndex, etc.) except the ones it manages internally (type, checked, defaultChecked, onChange).
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
    { role: "Circle radius",        alias: "aliases.radius.full (perfect circle)" },
    { role: "Circle border (rest)", alias: "aliases.color.border.strong (same as Checkbox)" },
    { role: "Circle background",    alias: "aliases.color.background.default (same as Checkbox)" },
    { role: "Hover border",         alias: "aliases.color.action.primary (same as Checkbox)" },
    { role: "Hover background",     alias: "aliases.color.background.subtle (same as Checkbox)" },
    { role: "Checked fill",         alias: "aliases.color.action.primary" },
    { role: "Checked hover",        alias: "aliases.color.action.primaryHover" },
    { role: "Inner dot color",      alias: "aliases.color.text.inverse (currentColor on the indicator)" },
    { role: "Focus ring",           alias: "aliases.color.border.focus (identical to Button + Input + Select + Checkbox + Card + Dialog + Drawer)" },
    { role: "Invalid border/ring",  alias: "aliases.color.status.error.fg" },
    { role: "Disabled fill",        alias: "aliases.color.action.primaryDisabled + text.disabled" },
    { role: "Disabled row text",    alias: "aliases.color.text.disabled" },
    { role: "Label typography",     alias: "aliases.typography.caption / bodyS / body per size · weight medium (matches Checkbox)" },
    { role: "Description typography", alias: "aliases.typography.caption / bodyS per size · color text.tertiary (matches Checkbox)" },
    { role: "Required marker",      alias: "aliases.color.status.error.fg + font-weight semibold" },
    { role: "Row height ladder",    alias: "components.checkbox.size.{sm,md,lg}.row (28 / 36 / 44) — literally reused" },
    { role: "Control size ladder",  alias: "components.checkbox.size.{sm,md,lg}.control (14 / 16 / 20) — literally reused" },
    { role: "Inner dot size",       alias: "50% of control (6 / 8 / 10 px)" },
    { role: "Group vertical gap",   alias: "aliases.spacing.stack.sm (8)" },
    { role: "Group horizontal gap", alias: "aliases.spacing.inline.lg (16)" },
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
          { tone: "note", text: "Radio reuses Checkbox's DOM shape: a <label> wraps a native <input> that's absolutely-positioned + opacity-0 over the visible indicator. Pointer + focus land on the real element; the focus ring paints on the adjacent-sibling indicator via a CSS combinator." },
          { tone: "note", text: "The size ladder is a direct reference to Checkbox's tokens (see tokens/components/radio.ts: `size: checkbox.size`) — the two controls always share the same dimensions. If we ever want them to diverge, we extend the aliases layer, not this file." },
          { tone: "note", text: "The whole row is a <label> wrapping the input. Clicking anywhere on the row (circle, label, description) selects the radio without any custom click handler. htmlFor is deliberately omitted to avoid the double-click bug from PR #18." },
          { tone: "note", text: "RadioGroup generates a shared `name` via useId. Every child Radio inherits it, so the browser natively handles arrow-key nav + one-of-many selection — RadioGroup does NOT reimplement arrow handling." },
          { tone: "note", text: "Roving tabIndex is managed via a lightweight registration pattern: each Radio calls group.register(value) in an effect; the group picks the roving-tabbable value as `group.value ?? firstRegistered`. Radio compares its own value against `rovingValue` to set tabIndex 0 or -1." },
          { tone: "note", text: "The Radio component always renders its native input as internally controlled (checked={currentChecked}) — same fix as Checkbox PR #18. Consumer's controlled/uncontrolled/inGroup facades are all resolved above the render." },
          { tone: "note", text: "RadioGroup's `invalid` cascades through context to every child Radio's aria-invalid attribute. Providing `errorMessage` implies invalid=true automatically." },
        ]}
      />

      <Callout tone="info" title="Extending Radio">
        (1) A future Segmented Control primitive will compose RadioGroup for its selection semantics but present as a horizontal segmented button. Not built here — it's a distinct visual family.
        (2) A new size should only be added if a genuine layout intent emerges. Update
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/checkbox.ts
        </code>
        first (Radio inherits from there) and the matching CSS vars in
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          variables.css
        </code>
        before touching Radio.css.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "Native HTML radio",     detail: "The core element is a real <input type='radio'>. Space selects, arrow keys navigate + select (via shared name), form submission works, screen readers announce correctly — no synthetic role='radio' shims." },
    { name: "HC1 Checkbox tokens",   detail: "The size ladder + surface / state palette are literally the same as Checkbox by direct token reference. Same border tone, same focus ring, same hover cue, same disabled treatment." },
    { name: "HC1 design tokens",     detail: "Every color, radius, spacing, motion, and size value is a token alias — no hex, no raw pixels, no bespoke shadows." },
    { name: "HC1 Button size ladder", detail: "Row heights sm/md/lg map 1:1 to Button + Input + Checkbox 28/36/44 so a mixed form aligns perfectly on every row." },
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
    { name: "Settings",                detail: "Notification channel, theme, default view — every 'one-of-many' setting composes RadioGroup." },
    { name: "Preference forms",        detail: "User preferences with mutually exclusive choices (email vs SMS, light vs dark, standard vs express)." },
    { name: "Single-choice forms",     detail: "Gender, marital status, category, payment method — form fields where exactly one option must be selected." },
    { name: "Filter panels",           detail: "Time range (day/week/month), sort direction (asc/desc), pricing tier — filter dimensions with mutually exclusive options." },
    { name: "Configuration screens",   detail: "AI model selection, retention policy, region — configuration where exactly one option applies at a time." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every single-selection surface in HC1 should compose Radio + RadioGroup. These are the anticipated consumers — none are shipped yet."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke radio rendering in the BloodHealth review flow — replace with RadioGroup + Radio at the same size." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan option selectors and single-choice patient screening — swap to RadioGroup and drop the custom SVG paths." },
    { area: "ClinicalIQ · Starter",     detail: "Filter and settings radios currently hand-rolled — sweep to the canonical primitive." },
    { area: "SourceIQ",                 detail: "Existing single-selection surfaces should adopt the shared tokens + primitive so tone and geometry stay consistent." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce their own radio rendering. Compose Radio + RadioGroup from day one." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Radio replaces existing single-selection implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — native input, role='radiogroup' on group, aria-invalid / aria-labelledby / aria-describedby / aria-required all wired" },
          { text: "Keyboard supported — Space selects; arrow keys move focus + selection; Tab focuses the selected radio" },
          { text: "Roving tabIndex — checked radio is tabbable (or first if none is checked)" },
          { text: "Responsive — three sizes matching Checkbox + Button + Input row heights (28 / 36 / 44)" },
          { text: "Reuses Checkbox architecture — same DOM shape, same tokens, same focus ring" },
          { text: "Composable API — Radio + Indicator + Label + Description + companion RadioGroup, no configuration booleans" },
          { text: "Production ready — controlled + uncontrolled, standalone + in-group, invalid + required + disabled all covered" },
        ]}
      />
    </DocBlock>
  );
}
