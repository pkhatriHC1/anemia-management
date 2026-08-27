import { forwardRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  Save,
  Trash2,
  HelpCircle,
  Settings,
  Copy,
  Info,
  FileText,
} from "lucide-react";
import { Tooltip, type TooltipPlacement } from "../../components/tooltip";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  Checklist,
  t,
} from "../standards/_shared";

const PLACEMENTS: TooltipPlacement[] = ["top", "bottom", "left", "right", "auto"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function TooltipDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <PlacementBlock />
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
      title="The canonical HC1 Tooltip"
      lead="Tooltip is the canonical contextual hint of the HC1 design system. Every icon-only button, disabled action, table row action, and form-field hint attaches this Tooltip rather than reimplementing hover behavior. Tooltips provide SUPPLEMENTAL information — they never contain actions, never require interaction, and disappear automatically. If your hint needs a button or a form field, use Popover (future)."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Compose Tooltip → Trigger → Content. The Arrow is auto-rendered inside Content. The Content portals to document.body so it escapes overflow-hidden ancestors."
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: t.space.section.md,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          minHeight: 140,
        }}
      >
        <Tooltip defaultOpen placement="top">
          <Tooltip.Trigger>
            <Button size="md" variant="secondary">Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Save your changes</Tooltip.Content>
        </Tooltip>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Tooltip"         desc="Root. Owns open state, delayShow / delayHide timers, placement, and shares an id for aria-describedby wiring." />
        <Part name="Tooltip.Trigger" desc="Clones its single child and attaches hover/focus/keyboard handlers + aria-describedby. Composes with any existing handlers on the child." />
        <Part name="Tooltip.Content" desc="Floating panel. Rendered into a portal on document.body with role='tooltip' and tabIndex=-1 (never focusable)." />
        <Part name="Tooltip.Arrow"   desc="Triangular pointer. Auto-rendered inside Content when `arrow` is true; exposed as a standalone for custom Content shells." />
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

/* ══════ Placement ═════════════════════════════════════════════════ */

function PlacementBlock() {
  return (
    <DocBlock
      title="Placement"
      lead="Four cardinal placements plus `auto`. When the requested side would collide with the viewport edge, the tooltip flips to the opposite side; when nothing fits, it picks the side with the most room. The resolved side is exposed as `data-side` on the content for downstream tests + themes."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <PlacementTile name="top"    label="Top" />
        <PlacementTile name="bottom" label="Bottom" />
        <PlacementTile name="left"   label="Left" />
        <PlacementTile name="right"  label="Right" />
        <PlacementTile name="auto"   label="Auto" />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note", text: "Positioning re-measures on scroll + resize while open so the tooltip follows its trigger through layout shifts." },
            { tone: "note", text: "The arrow tracks the trigger centre horizontally (top/bottom sides) or vertically (left/right sides) so it always points at the trigger even when the tooltip is clamped away from centre by a viewport edge." },
            { tone: "note", text: "`auto` prefers top → bottom → right → left when they fit; if none fit, it picks the side with the most space." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

function PlacementTile({ name, label }: { name: TooltipPlacement; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
        {label}
      </div>
      <div
        style={{
          padding: t.space.inline.xl,
          background: t.color.background.subtle,
          borderRadius: t.radius.control,
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip placement={name} defaultOpen delayShow={0} delayHide={0}>
          <Tooltip.Trigger>
            <Button size="sm" variant="secondary">Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Placement · {name}</Tooltip.Content>
        </Tooltip>
      </div>
      <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
        placement=&quot;{name}&quot;
      </code>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The tooltip content has role='tooltip' — assistive tech treats it as a supplemental hint attached to a trigger, not as a new landmark." },
          { tone: "must", text: "The Trigger receives aria-describedby={content id} while the tooltip is open. Screen readers announce the tooltip text when the trigger is focused or navigated to." },
          { tone: "must", text: "The tooltip content is NEVER focusable (tabIndex=-1). Tab always skips over it. If content needs interaction, use Popover (future primitive) — that's what Popover is for." },
          { tone: "must", text: "Focus moves show the tooltip; blur hides it immediately (no delayHide). Hover moves show + hide with the configured delays." },
          { tone: "must", text: "Escape hides the tooltip whether focus is on the trigger or elsewhere — a document keydown listener catches the hover-only case; the trigger's own onKeyDown catches the focused case." },
          { tone: "must", text: "The tooltip panel has pointer-events: none by default so the trigger's own hover flow isn't interrupted when the pointer glides over the tooltip." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the fade + scale animation to 0ms — the tooltip appears instantly." },
          { tone: "must-not", text: "Never put actions inside a Tooltip. If clickable content is needed, use Popover." },
          { tone: "must-not", text: "Never rely on hover alone — the tooltip must also appear on focus (Tab). This primitive wires both automatically." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",       effect: "Focus the trigger. The tooltip appears (subject to delayShow if configured; typically instant on focus)." },
    { keys: "Shift+Tab", effect: "Move focus off the trigger. The tooltip hides immediately (no delayHide)." },
    { keys: "Escape",    effect: "Hide the tooltip. Fires even when the pointer is over the trigger — the tooltip disappears until the pointer leaves and re-enters." },
  ];
  return (
    <DocBlock title="Keyboard">
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
          { title: "Use for supplemental hints",       description: "Icon-only actions, disabled reasons, table row actions, form-field hints. The tooltip explains what a control does or why it's unavailable." },
          { title: "Keep content short",               description: "One sentence or fragment. If you need more than a line, the trigger's own label should carry the meaning." },
          { title: "Always attach to a focusable element", description: "Tooltip visibility must respect keyboard users — attach to a Button, <a>, or another focusable element." },
          { title: "Wrap disabled buttons if needed",  description: "Disabled <button>s don't fire hover events in some browsers. Wrap in a small span with tabIndex={0} so the tooltip can attach." },
        ]}
        donts={[
          { title: "Actions inside a tooltip",         description: "Tooltips disappear on mouseleave and can't be tabbed into. If you need clicks inside, use Popover." },
          { title: "Long-form content",                description: "More than one line becomes a mini modal. Move it to a Popover or Dialog." },
          { title: "Tooltips for critical information",description: "If it MUST be seen, put it in the label, use an inline helper, or use an Alert. Tooltips can be missed entirely." },
          { title: "Nested tooltips",                  description: "A tooltip trigger inside another tooltip trigger creates confusing hover cascades. Restructure the surface." },
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
          { tone: "must-not", text: "Don't confuse Tooltip with Popover. Tooltip = passive hint on hover/focus; Popover = interactive content anchored to a trigger. If the content has buttons or inputs, use Popover." },
          { tone: "must-not", text: "Don't use a Tooltip to explain something critical. Users on touch devices and users using screen readers on trigger navigation may miss the tooltip entirely." },
          { tone: "must-not", text: "Don't nest a Tooltip inside another Tooltip's Trigger — the hover event cascade will fight the delay timers." },
          { tone: "must-not", text: "Don't put interactive content inside Tooltip.Content. Pointer events are disabled by default, and even if you re-enabled them, screen readers can't focus into the tooltip." },
          { tone: "must-not", text: "Don't set delayShow to 0 for every tooltip. Small delays prevent accidental reveals as the pointer glides across a toolbar." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [placement, setPlacement] = useState<TooltipPlacement>("top");
  const [delayShow, setDelayShow] = useState(200);
  const [delayHide, setDelayHide] = useState(100);
  const [arrow, setArrow]         = useState(true);
  const [disabled, setDisabled]   = useState(false);
  const [longContent, setLongContent] = useState(false);
  const [content, setContent]     = useState("Save your changes to the current draft");

  const label = longContent
    ? "This is a longer tooltip that wraps at the configured max-width. Keep tooltip content short — one sentence is ideal — because tooltips disappear on mouseleave and cannot be reread easily."
    : content;

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered Tooltip in real time. Hover or focus the trigger to see it in action.">
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
            padding: t.space.section.md,
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 160,
          }}
        >
          <Tooltip
            placement={placement}
            delayShow={delayShow}
            delayHide={delayHide}
            disabled={disabled}
          >
            <Tooltip.Trigger>
              <Button size="md">Hover or focus me</Button>
            </Tooltip.Trigger>
            <Tooltip.Content arrow={arrow}>{label}</Tooltip.Content>
          </Tooltip>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="placement" value={placement} options={PLACEMENTS} onChange={(v) => setPlacement(v as TooltipPlacement)} />
          <NumberControl label="delayShow (ms)" value={delayShow} min={0} max={2000} onChange={setDelayShow} />
          <NumberControl label="delayHide (ms)" value={delayHide} min={0} max={2000} onChange={setDelayHide} />
          <TextControl   label="content"        value={content}   onChange={setContent} />
          <ToggleControl label="arrow"          value={arrow}     onChange={setArrow} />
          <ToggleControl label="disabled"       value={disabled}  onChange={setDisabled} />
          <ToggleControl label="long content"   value={longContent} onChange={setLongContent} />
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
{renderCode({ placement, delayShow, delayHide, arrow, disabled, label })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  placement: TooltipPlacement;
  delayShow: number;
  delayHide: number;
  arrow: boolean;
  disabled: boolean;
  label: string;
}) {
  const attrs: string[] = [];
  if (s.placement !== "top")    attrs.push(`placement="${s.placement}"`);
  if (s.delayShow !== 200)      attrs.push(`delayShow={${s.delayShow}}`);
  if (s.delayHide !== 100)      attrs.push(`delayHide={${s.delayHide}}`);
  if (s.disabled)               attrs.push(`disabled`);

  const rootOpen = attrs.length > 0
    ? `<Tooltip\n  ${attrs.join("\n  ")}\n>`
    : `<Tooltip>`;

  const contentAttrs: string[] = [];
  if (!s.arrow) contentAttrs.push(`arrow={false}`);
  const contentOpen = contentAttrs.length > 0
    ? `<Tooltip.Content ${contentAttrs.join(" ")}>`
    : `<Tooltip.Content>`;

  return [
    rootOpen,
    `  <Tooltip.Trigger>`,
    `    <Button>Hover or focus me</Button>`,
    `  </Tooltip.Trigger>`,
    `  ${contentOpen}${esc(s.label)}</Tooltip.Content>`,
    `</Tooltip>`,
  ].join("\n");
}

function esc(v: string) {
  return v.replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Six sketches of how downstream surfaces compose Tooltip. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <SaveExample />
        <DeleteExample />
        <HelpIconExample />
        <TableActionExample />
        <SettingsExample />
        <FormHintExample />
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
      <div style={{ minHeight: 44, display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Forward refs + spread props so Tooltip.Trigger's cloneElement can attach
 * its ref + handlers + aria-describedby to the real <button>.
 */
const IconButton = forwardRef<
  HTMLButtonElement,
  { label: string; icon: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
>(function IconButton({ label, icon, style, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        padding: 0,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        color: t.color.text.secondary,
        cursor: "pointer",
        ...style,
      }}
    >
      {icon}
    </button>
  );
});

function SaveExample() {
  return (
    <ExampleShell title="Save button" icon={<Save size={16} color={t.color.action.primary} />}>
      <Tooltip>
        <Tooltip.Trigger>
          <IconButton label="Save" icon={<Save size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Save (⌘S)</Tooltip.Content>
      </Tooltip>
      <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>Hover the icon</span>
    </ExampleShell>
  );
}

function DeleteExample() {
  return (
    <ExampleShell title="Delete action" icon={<Trash2 size={16} color={t.color.action.primary} />}>
      <Tooltip placement="top">
        <Tooltip.Trigger>
          <IconButton label="Delete" icon={<Trash2 size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Move this item to trash</Tooltip.Content>
      </Tooltip>
      <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>Explains the destructive action</span>
    </ExampleShell>
  );
}

function HelpIconExample() {
  return (
    <ExampleShell title="Help icon" icon={<HelpCircle size={16} color={t.color.action.primary} />}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: t.space.inline.xs }}>
        <span style={{ fontSize: 14, color: t.color.text.primary, fontWeight: 500 }}>Recovery rate</span>
        <Tooltip placement="right">
          <Tooltip.Trigger>
            <button
              type="button"
              aria-label="What is recovery rate?"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 20, height: 20, padding: 0, border: 0, background: "transparent",
                color: t.color.text.tertiary, cursor: "help", borderRadius: 999,
              }}
            >
              <HelpCircle size={14} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Percentage of patients whose vitals returned to baseline within 30 days.</Tooltip.Content>
        </Tooltip>
      </span>
    </ExampleShell>
  );
}

function TableActionExample() {
  return (
    <ExampleShell title="Table row action" icon={<Copy size={16} color={t.color.action.primary} />}>
      <Tooltip placement="top">
        <Tooltip.Trigger>
          <IconButton label="Copy link" icon={<Copy size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Copy public link</Tooltip.Content>
      </Tooltip>
      <Tooltip placement="top">
        <Tooltip.Trigger>
          <IconButton label="Duplicate row" icon={<FileText size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Duplicate this row</Tooltip.Content>
      </Tooltip>
      <Tooltip placement="top">
        <Tooltip.Trigger>
          <IconButton label="Delete row" icon={<Trash2 size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Delete</Tooltip.Content>
      </Tooltip>
    </ExampleShell>
  );
}

function SettingsExample() {
  return (
    <ExampleShell title="Settings toolbar" icon={<Settings size={16} color={t.color.action.primary} />}>
      <Tooltip placement="bottom">
        <Tooltip.Trigger>
          <IconButton label="Open settings" icon={<Settings size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Open settings</Tooltip.Content>
      </Tooltip>
      <Tooltip placement="bottom">
        <Tooltip.Trigger>
          <IconButton label="Help" icon={<HelpCircle size={16} />} />
        </Tooltip.Trigger>
        <Tooltip.Content>Help &amp; support</Tooltip.Content>
      </Tooltip>
    </ExampleShell>
  );
}

function FormHintExample() {
  return (
    <ExampleShell title="Form field hint" icon={<Info size={16} color={t.color.action.primary} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, width: "100%" }}>
        <label
          htmlFor="mrn-example"
          style={{ display: "flex", alignItems: "center", gap: t.space.inline.xs, fontSize: 14, fontWeight: 600, color: t.color.text.primary }}
        >
          MRN
          <Tooltip placement="right">
            <Tooltip.Trigger>
              <button
                type="button"
                aria-label="What is an MRN?"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 20, height: 20, padding: 0, border: 0, background: "transparent",
                  color: t.color.text.tertiary, cursor: "help", borderRadius: 999,
                }}
              >
                <Info size={14} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Medical Record Number — the 8-digit identifier printed on the patient wristband.</Tooltip.Content>
          </Tooltip>
        </label>
        <Input id="mrn-example" placeholder="e.g. 12345678" size="sm" />
      </div>
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

function NumberControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
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

const PROPS_TOOLTIP: PropRow[] = [
  { name: "open",         type: "boolean",                                     def: "—",     desc: "Controlled open state. Pair with onOpenChange." },
  { name: "defaultOpen",  type: "boolean",                                     def: "false", desc: "Uncontrolled initial open state." },
  { name: "onOpenChange", type: "(open: boolean) => void",                     def: "—",     desc: "Fires whenever open flips (both controlled + uncontrolled)." },
  { name: "placement",    type: "'top' | 'bottom' | 'left' | 'right' | 'auto'",def: "'top'", desc: "Preferred side. auto picks the side with the most room." },
  { name: "delayShow",    type: "number (ms)",                                 def: "200",   desc: "Hover-to-show delay. Focus shows immediately." },
  { name: "delayHide",    type: "number (ms)",                                 def: "100",   desc: "Hover-to-hide delay. Blur hides immediately." },
  { name: "disabled",     type: "boolean",                                     def: "false", desc: "Disable the tooltip entirely — trigger stops emitting hover/focus events." },
  { name: "children",     type: "ReactNode",                                    def: "—",     desc: "Compose Tooltip.Trigger + Tooltip.Content." },
];

const PROPS_TRIGGER: PropRow[] = [
  { name: "children", type: "ReactElement", def: "—", desc: "A single React element (Button, icon button, <a>, etc.). The Trigger clones and attaches handlers + aria-describedby." },
];

const PROPS_CONTENT: PropRow[] = [
  { name: "arrow",    type: "boolean",           def: "true", desc: "Show the arrow. Auto-positioned per side." },
  { name: "maxWidth", type: "number | string",   def: "260",  desc: "Override max inline width before content wraps." },
  { name: "children", type: "ReactNode",         def: "—",    desc: "Tooltip text. Short — one sentence ideally." },
];

const PROPS_ARROW: PropRow[] = [
  { name: "className", type: "string", def: "—", desc: "Custom classes for the arrow element." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Tooltip"         rows={PROPS_TOOLTIP} />
      <PropsSubsection title="Tooltip.Trigger" rows={PROPS_TRIGGER} />
      <PropsSubsection title="Tooltip.Content" rows={PROPS_CONTENT} />
      <PropsSubsection title="Tooltip.Arrow"   rows={PROPS_ARROW} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Tooltip.Content forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;div&gt;</code> HTML attributes (className, style, data-*) to the panel.
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
    { role: "Panel background",       alias: "aliases.color.background.inverse (dark surface — reads as secondary annotation)" },
    { role: "Panel text",             alias: "aliases.color.text.inverse (white on dark)" },
    { role: "Panel border",           alias: "aliases.color.border.inverse (neutral-700 — matches dark surface)" },
    { role: "Panel radius",           alias: "aliases.radius.control (8 — half-step of surface radius; tooltips are compact)" },
    { role: "Panel shadow",           alias: "aliases.elevation.popover (shadow-md — floating but not lifted like Dialog)" },
    { role: "Panel max width",        alias: "260 — wide enough for a full sentence without dominating the viewport" },
    { role: "Panel padding",          alias: "aliases.spacing.stack.xs (4) vertical × aliases.spacing.inline.sm (8) horizontal" },
    { role: "Panel typography",       alias: "aliases.typography.caption (12 / 16 · regular)" },
    { role: "Arrow size",             alias: "8px base (4px half). Rotated square gives a clean tip on any monitor without polygon anti-alias fuzz." },
    { role: "Offset from trigger",    alias: "8px including arrow" },
    { role: "z-index",                alias: "--hc-z-tooltip (50) — above popover, below modal scrim" },
    { role: "Motion",                 alias: "aliases.motion.hoverIn (150ms, standard) — fade + subtle scale (0.96 → 1)" },
    { role: "Default show delay",     alias: "200ms — prevents accidental reveal on drive-by mouse motion" },
    { role: "Default hide delay",     alias: "100ms — bridges tiny pointer gaps without flicker" },
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
          { tone: "note", text: "Tooltip.Content is rendered into a portal on document.body — same technique Dialog uses — so it escapes overflow-hidden ancestors and always paints above the surrounding surface. No z-index gymnastics on the parent required." },
          { tone: "note", text: "Positioning is done in a useLayoutEffect that runs before paint. It reads the trigger's getBoundingClientRect + the (already-mounted, visibility:hidden) content's size, computes the placement, and writes inline top/left. This means one measure pass per open; no flicker at 0,0." },
          { tone: "note", text: "The arrow is a rotated 8×8 square anchored half-inside the panel edge. JS writes an inline `left` (top/bottom sides) or `top` (left/right sides) that tracks the trigger centre so the arrow always points at the trigger even when the tooltip has been clamped away from centre by a viewport edge." },
          { tone: "note", text: "Timers are held in refs so back-to-back schedule calls cancel each other. Blur and Escape both hide via `hideNow()` which skips delayHide entirely." },
          { tone: "note", text: "Pointer-events on the tooltip panel are disabled by default — the trigger's hover flow doesn't hitch as the pointer glides over the tooltip. Consumers of custom Content who need pointer-events should reconsider — that's usually a Popover, not a Tooltip." },
          { tone: "note", text: "Trigger uses cloneElement to attach handlers + ref + aria-describedby to a single child. Multi-child triggers are not supported; wrap in an inline span if you need composition." },
          { tone: "note", text: "aria-describedby is added ONLY while the tooltip is open. This avoids leaking dangling references when the tooltip is closed and its content id is nowhere in the DOM." },
        ]}
      />

      <Callout tone="info" title="Foundation for Popover">
        Tooltip's positioning engine, portal, arrow, and side-flip logic are deliberately kept API-agnostic so a future Popover primitive can reuse them. Popover swaps hover/focus semantics for click-to-open, adds focus management (Popover content IS focusable), and inherits everything else. When Popover ships, expect much of this file to move to a shared `_positioning` module.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "React portals",       detail: "Content renders into a portal on document.body via createPortal — same technique Dialog uses. Escapes overflow-hidden ancestors and paints above the surrounding surface." },
    { name: "HC1 Dialog motion",   detail: "Entrance uses the same easing family as Dialog but at the shorter 150ms duration so tooltips feel snappy rather than ceremonial." },
    { name: "HC1 Card visual",     detail: "Radius (control), shadow (popover elevation), border tone follow the Card family — tooltips read as compact floating cards." },
    { name: "HC1 design tokens",   detail: "Every color, radius, spacing, motion, and typography value is a token alias — no hex, no raw pixels, no bespoke shadows." },
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
    { name: "Icon-only buttons", detail: "Save, delete, duplicate, copy, share — any button whose only label is an icon must attach a tooltip so the icon's meaning is discoverable." },
    { name: "Disabled actions",  detail: "\"Why can't I click this?\" — attach a tooltip to explain the gate. Wrap the disabled button in a span so hover events fire." },
    { name: "Table row actions", detail: "Compact icon rows in tables need tooltips to name each action without eating column width." },
    { name: "Form field hints",  detail: "An (i) icon next to a label opens a tooltip with a short explanation of what the field means or how it's used." },
    { name: "Toolbar hints",     detail: "Settings icons, keyboard shortcut cues, mode indicators — every toolbar icon should have a tooltip with a one-liner." },
    { name: "Truncated labels",  detail: "When a card / table cell truncates a long label, a tooltip on hover surfaces the full text." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every icon-only or hint-carrying surface in HC1 should compose Tooltip. These are the anticipated consumers — none are shipped yet."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke tooltip / title-attribute hover in review-flow icon rows — swap to Tooltip." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan step action rows and inline (i) hints — replace with Tooltip." },
    { area: "ClinicalIQ · Starter",     detail: "Any title-attribute tooltips currently in use — sweep to the canonical primitive so keyboard users get the same experience." },
    { area: "SourceIQ",                 detail: "Existing tooltip surfaces — adopt the shared tokens + primitive so tone and geometry stay consistent." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce bespoke tooltip behavior. Compose Tooltip from day one so hover, focus, keyboard, and Escape all work uniformly." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Tooltip replaces existing tooltip implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — role='tooltip', aria-describedby wired to the trigger, tabIndex=-1 (never focusable), Escape hides" },
          { text: "Keyboard supported — shows on Tab focus, hides on blur / Escape / mouseleave" },
          { text: "Placement — top / bottom / left / right / auto; flips when the requested side collides with the viewport" },
          { text: "Arrow — auto-positioned to track trigger centre; rotated square gives clean tips on any monitor" },
          { text: "Delay — configurable delayShow / delayHide with sensible defaults (200 / 100)" },
          { text: "Reuses overlay infrastructure — createPortal + Escape pattern shared with Dialog; no scroll lock, no focus trap (deliberately)" },
          { text: "Foundation for Popover — positioning, portal, arrow, and side-flip logic will be shared" },
          { text: "Production ready — controlled + uncontrolled, all 5 placements, arrow / no-arrow, disabled, custom delays" },
        ]}
      />
    </DocBlock>
  );
}
