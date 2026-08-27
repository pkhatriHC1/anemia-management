import { useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Star,
  BookOpen,
} from "lucide-react";
import {
  Textarea,
  type TextareaSize,
} from "../../components/textarea";
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

const SIZES: TextareaSize[] = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function TextareaDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <StatesBlock />
      <SizesBlock />
      <AutoResizeBlock />
      <CounterBlock />
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
      title="The canonical HC1 Textarea"
      lead="Textarea is the canonical multi-line text input of the HC1 design system. Every clinical note, comment, feedback field, description, internal note, and AI prompt composes this Textarea rather than reimplementing multi-line input behavior. Use Textarea when input naturally wraps to more than one line; use Input when a single line is enough."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [value, setValue] = useState("Patient reports mild pain in lower back for 3 days.");
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent or a shorthand prop. The label + description + helper + counter are auto-rendered from props; compose them explicitly for advanced layouts."
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
        <div style={{ width: "100%", maxWidth: 480 }}>
          <Textarea
            label="Patient notes"
            description="Include symptoms, duration, and any relevant history."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            helperText="Notes are visible to the care team."
            showCounter
            maxLength={500}
            placeholder="e.g. Patient reports mild back pain…"
          />
        </div>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Textarea"             desc="Root wrapper. Owns state; renders the label, frame, and footer; drives auto-resize and validation." />
        <Part name="Textarea.Label"       desc="Real <label htmlFor={inputId}>. Auto-rendered from the `label` prop; compose to add icons or tooltips alongside the text." />
        <Part name="Textarea.Description" desc="Muted secondary text under the label. Auto-wires aria-describedby via a generated id." />
        <Part name="Textarea.Helper"      desc="Helper text under the frame. Auto-rendered from `helperText`; suppressed while a validation message is showing." />
        <Part name="Textarea.Counter"     desc="Right-aligned character counter in the footer. Auto-rendered when `showCounter` + `maxLength` are set." />
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
      lead="Textarea is a compound component with shorthand props for the common shape. Pass `label`, `description`, `helperText`, and `showCounter` for 95% of cases; compose subcomponents when you need custom content in a slot."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred (shorthand)"
          tone="do"
          code={`<Textarea
  label="Clinical notes"
  description="Include symptoms and history."
  helperText="Visible to the care team."
  showCounter
  maxLength={500}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>`}
        />
        <CodeBlock
          title="Compose slots when needed"
          tone="do"
          code={`<Textarea value={notes} onChange={...} maxLength={500} showCounter>
  <Textarea.Label>
    Notes <Tooltip>Only clinicians can see these.</Tooltip>
  </Textarea.Label>
  <Textarea.Description>
    Include symptoms and duration.
  </Textarea.Description>
  <Textarea.Helper>Autosaves as you type.</Textarea.Helper>
</Textarea>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Use Textarea when the input is multi-line by nature (notes, comments, descriptions, AI prompts). Use Input for single-line text." },
          { tone: "should",   text: "Prefer the shorthand `label` / `helperText` / `showCounter` props unless you need custom content inside a slot." },
          { tone: "must-not", text: "Never reimplement multi-line input with a contenteditable <div>. Textarea uses a real native <textarea> so form submission, screen readers, and IME work." },
          { tone: "must-not", text: "Never introduce boolean props like `showLabel` or `withDescription`. If a piece is needed, pass its content prop or compose the slot." },
          { tone: "must-not", text: "Never combine Textarea and Input for the same field. Pick one based on the natural line count of the content." },
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
      lead="Every visual state maps to a CSS class and (when needed) a data attribute so downstream tests and themes can read them without touching React. Identical rules to Input — Textarea just carries them across more rows."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Empty" note="Default resting state. Neutral border + white fill + placeholder tone.">
          <Textarea label="State" placeholder="Type something…" minRows={2} />
        </StateTile>
        <StateTile name="Filled" note="Content present; frame stays neutral until interaction.">
          <Textarea label="State" defaultValue="Some entered content." minRows={2} />
        </StateTile>
        <StateTile name="Focused" note="2px brand outline; brand border. Same ring as Input + Button.">
          <Textarea label="State" defaultValue="Focused frame." autoFocus minRows={2} />
        </StateTile>
        <StateTile name="Disabled" note="Muted fill; not focusable; cursor: not-allowed.">
          <Textarea label="State" defaultValue="Cannot edit." disabled minRows={2} />
        </StateTile>
        <StateTile name="Read only" note="Muted fill; focusable + selectable; input blocked.">
          <Textarea label="State" defaultValue="Read-only content." readOnly minRows={2} />
        </StateTile>
        <StateTile name="Loading" note="Spinner in the corner; aria-busy='true'. Still typable.">
          <Textarea label="State" defaultValue="Autosaving…" loading minRows={2} />
        </StateTile>
        <StateTile name="Required" note="Native required + red * marker on the label.">
          <Textarea label="State" required placeholder="Required field" minRows={2} />
        </StateTile>
        <StateTile name="Error" note="Red border + red focus ring + role='alert' message.">
          <Textarea label="State" defaultValue="oh no" errorMessage="Notes are too short — describe the symptoms in detail." minRows={2} />
        </StateTile>
        <StateTile name="Warning" note="Yellow border + warning message. Non-blocking.">
          <Textarea label="State" defaultValue="Notes look thin." warningMessage="Consider adding vital signs." minRows={2} />
        </StateTile>
        <StateTile name="Success" note="Green border + success message. Confirms input passed validation.">
          <Textarea label="State" defaultValue="Complete clinical picture with vitals." successMessage="Notes look great." minRows={2} />
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
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 100, display: "flex" }}>
        <div style={{ width: "100%" }}>{children}</div>
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

/* ══════ Sizes ═════════════════════════════════════════════════════ */

const SIZE_META: Record<TextareaSize, { label: string; padY: string; font: string; line: string; usage: string }> = {
  sm: { label: "Small",  padY: "8px",  font: "12px", line: "20px", usage: "Dense settings panels, compact side panes." },
  md: { label: "Medium", padY: "8px",  font: "14px", line: "22px", usage: "Default. Notes, comments, descriptions." },
  lg: { label: "Large",  padY: "12px", font: "16px", line: "24px", usage: "Reading-heavy contexts. AI prompts, long-form entry." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Three size steps — same font + horizontal padding ladder as Input's sm / md / lg so mixed forms stack cleanly. The frame height comes from rows × line-height."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

function SizeCell({ size }: { size: TextareaSize }) {
  const meta = SIZE_META[size];
  const [value, setValue] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 140 }}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size={size}
          label={`${meta.label} · font ${meta.font} / line ${meta.line}`}
          placeholder="Type here…"
          minRows={2}
        />
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

/* ══════ Auto Resize ═══════════════════════════════════════════════ */

function AutoResizeBlock() {
  const [a, setA] = useState("Type a few lines and watch the frame grow to fit.\nIt stops at maxRows and starts scrolling.");
  const [b, setB] = useState("Fixed frame — content scrolls internally past minRows.\nTry pressing Enter a few times.");
  return (
    <DocBlock
      title="Auto resize"
      lead="autoResize grows the frame between minRows and maxRows as the user types. When off, the frame stays at minRows and content scrolls internally. Choose auto-resize for input where every line matters visually (notes, comments); leave it off in fixed-height layouts (side panes, small cards)."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary, marginBottom: t.space.stack.md }}>autoResize · minRows=2 · maxRows=6</div>
          <Textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            autoResize
            minRows={2}
            maxRows={6}
            label="Notes"
          />
        </div>
        <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary, marginBottom: t.space.stack.md }}>Fixed · minRows=3 · maxRows=6</div>
          <Textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            minRows={3}
            maxRows={6}
            label="Notes"
          />
        </div>
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note",     text: "autoResize measures scrollHeight on every value change and clamps between minRows × line-height and maxRows × line-height. Line-heights: sm=20 · md=22 · lg=24 (rounded to even pixels)." },
            { tone: "note",     text: "Beyond maxRows the frame stops growing and the browser paints an internal vertical scrollbar. The consumer never has to handle the scroll case explicitly." },
            { tone: "note",     text: "Without autoResize, the frame stays at minRows and content scrolls inside — good for compact panes where the frame's height must be predictable." },
            { tone: "should",   text: "Pair autoResize with a sensible maxRows so a rogue paste doesn't push other content off the screen. Default maxRows is 12 rows." },
            { tone: "must-not", text: "Don't use `resize='vertical'` and `autoResize` at the same time — the drag handle fights the JS-measured height. Pick one." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Character Counter ═════════════════════════════════════════ */

function CounterBlock() {
  const [value, setValue] = useState("Some notes so far.");
  return (
    <DocBlock
      title="Character counter"
      lead="Show a counter in the footer when the input has a length constraint. Reads the current length + maxLength; turns red when over. Kept out of aria-describedby's front so the screen reader announces the label + description + validation before the count."
    >
      <div style={{ maxWidth: 480 }}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="Feedback"
          helperText="Tell us what you liked or didn't."
          showCounter
          maxLength={120}
          minRows={2}
        />
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "must",     text: "Show the counter only when there's a real length limit. Vanity counters (\"12 characters typed\") are noise." },
            { tone: "must",     text: "Pair `showCounter` with `maxLength`; without maxLength the counter is suppressed. maxLength also caps native input so the user can't type past it." },
            { tone: "should",   text: "For advanced formatting (character + word count, remaining vs total), compose <Textarea.Counter> and read length off the value manually." },
            { tone: "note",     text: "The counter is included in aria-describedby but comes last so screen readers announce label → description → validation → count." },
            { tone: "note",     text: "When the count exceeds maxLength (only possible via programmatic value, since native maxLength blocks typing past it), the counter turns red and uses a semibold weight." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Renders a real native <textarea> — screen readers, keyboard, form submission, IME composition, and browser autofill all work without JS shims." },
          { tone: "must", text: "Label is a real <label htmlFor={inputId}>. Clicking the label focuses the textarea; screen readers announce the label when the textarea is focused." },
          { tone: "must", text: "aria-describedby is composed from description + helper (or message) + counter ids in DOM order. Slots are only referenced when they render." },
          { tone: "must", text: "Error state emits aria-invalid='true' on the textarea + role='alert' on the message so AT announces it immediately." },
          { tone: "must", text: "Required emits the native required attribute + a red * marker on the label. Optional emits an (Optional) marker only when not required." },
          { tone: "must", text: "Focus lands on the native textarea; a 2px brand outline paints on the surrounding frame via focus-within (same ring as Button + Input + Select + Checkbox + Radio + Switch)." },
          { tone: "must", text: "Loading emits aria-busy='true' on the textarea and paints a spinner in the corner. The textarea stays interactive — loading signifies async validation/autosave, not \"input is unusable\"." },
          { tone: "must", text: "The character counter is decorative (no role) but included in aria-describedby so users of AT know the constraint. Placed last in the aria-describedby order so it doesn't interrupt more important information." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses hover/focus transitions to 0ms and slows the loading spinner." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",          effect: "Move focus into the textarea. Once inside, Tab moves focus OUT (Textarea is not a Tab trap)." },
    { keys: "Shift+Tab",    effect: "Move focus out of the textarea to the previous focusable element." },
    { keys: "Enter",        effect: "Insert a newline (native <textarea> behavior). Textarea deliberately doesn't submit on Enter — use Ctrl/Cmd+Enter in the parent form if you need submit-on-enter." },
    { keys: "Ctrl/Cmd+A",   effect: "Select all text." },
    { keys: "Ctrl/Cmd+Z / Y", effect: "Undo / redo (native browser behavior)." },
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
          { title: "Match rows to expected content", description: "Notes → minRows=3–5. Comments → minRows=2. AI prompts → minRows=4 with autoResize." },
          { title: "Set maxLength when relevant",    description: "Any user-facing character limit should be enforced natively (maxLength) AND shown with `showCounter`." },
          { title: "Prefer autoResize for long-form",description: "Notes, comments, AI prompts read better when the frame grows to fit — capped at maxRows so nothing explodes." },
          { title: "Show loading during autosave",   description: "Set `loading` while the value is being saved to the server so users know their input is persisted." },
        ]}
        donts={[
          { title: "Textarea for single-line text",  description: "Use Input. Textarea is for content that naturally spans multiple lines." },
          { title: "resize='vertical' + autoResize", description: "Pick one. Both compete for the height and produce jittery UX." },
          { title: "Textarea inside a Table cell",   description: "Table rows expect a fixed height per row. Use Input in the cell + Textarea in an inspector or dialog." },
          { title: "Custom submit-on-Enter",         description: "Textarea Enter inserts a newline — that's what users expect for multi-line input. Wire submit to Ctrl/Cmd+Enter in the parent form if needed." },
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
          { tone: "must-not", text: "Don't confuse Textarea with Input. Textarea = multi-line by nature; Input = single line." },
          { tone: "must-not", text: "Don't hardcode a fixed pixel height on the frame. Use `minRows` / `maxRows` — they compute the height from tokens and stay consistent when the font size ladder ever changes." },
          { tone: "must-not", text: "Don't set `autoResize` and `resize='vertical'` at the same time — the drag handle fights the JS measurement and the frame flickers." },
          { tone: "must-not", text: "Don't wrap the Textarea in a `<form onSubmit>` that submits on Enter — Enter should insert a newline. Wire Ctrl/Cmd+Enter to submit if needed." },
          { tone: "must-not", text: "Don't use a Textarea to accept short values that Input handles better (phone number, email, single-word). The multi-line affordance implies \"more coming\" and misleads users." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [value, setValue]           = useState("Type here to see live behavior.");
  const [size, setSize]             = useState<TextareaSize>("md");
  const [minRows, setMinRows]       = useState(3);
  const [maxRows, setMaxRows]       = useState(8);
  const [autoResize, setAutoResize] = useState(false);
  const [disabled, setDisabled]     = useState(false);
  const [readOnly, setReadOnly]     = useState(false);
  const [required, setRequired]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [helperText, setHelperText] = useState("Helper text under the frame.");
  const [errorMessage, setErrorMessage]     = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCounter, setShowCounter] = useState(true);
  const [maxLength, setMaxLength]   = useState(200);
  const [label, setLabel]           = useState("Notes");

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered Textarea in real time. Live JSX is generated in the dark panel at the bottom.">
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
            alignItems: "flex-start",
            minHeight: 240,
          }}
        >
          <div style={{ width: "100%", maxWidth: 560 }}>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size={size}
              minRows={minRows}
              maxRows={maxRows}
              autoResize={autoResize}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              loading={loading}
              label={label}
              helperText={helperText || undefined}
              errorMessage={errorMessage || undefined}
              warningMessage={warningMessage || undefined}
              successMessage={successMessage || undefined}
              showCounter={showCounter}
              maxLength={maxLength}
              placeholder="Type here…"
            />
          </div>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size"      value={size}   options={SIZES} onChange={(v) => setSize(v as TextareaSize)} />
          <NumberControl label="minRows"   value={minRows} min={1} max={20} onChange={setMinRows} />
          <NumberControl label="maxRows"   value={maxRows} min={1} max={40} onChange={setMaxRows} />
          <NumberControl label="maxLength" value={maxLength} min={0} max={5000} onChange={setMaxLength} />
          <TextControl   label="label"       value={label}       onChange={setLabel} />
          <TextControl   label="helper text" value={helperText}  onChange={setHelperText} />
          <TextControl   label="error"       value={errorMessage}   onChange={setErrorMessage} />
          <TextControl   label="warning"     value={warningMessage} onChange={setWarningMessage} />
          <TextControl   label="success"     value={successMessage} onChange={setSuccessMessage} />
          <ToggleControl label="autoResize"  value={autoResize}  onChange={setAutoResize} />
          <ToggleControl label="disabled"    value={disabled}    onChange={setDisabled} />
          <ToggleControl label="readOnly"    value={readOnly}    onChange={setReadOnly} />
          <ToggleControl label="required"    value={required}    onChange={setRequired} />
          <ToggleControl label="loading"     value={loading}     onChange={setLoading} />
          <ToggleControl label="showCounter" value={showCounter} onChange={setShowCounter} />
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
  size, minRows, maxRows, autoResize, disabled, readOnly, required, loading,
  helperText, errorMessage, warningMessage, successMessage, showCounter, maxLength, label,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: TextareaSize;
  minRows: number;
  maxRows: number;
  autoResize: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  loading: boolean;
  helperText: string;
  errorMessage: string;
  warningMessage: string;
  successMessage: string;
  showCounter: boolean;
  maxLength: number;
  label: string;
}) {
  const attrs: string[] = [];
  attrs.push(`value={value}`);
  attrs.push(`onChange={(e) => setValue(e.target.value)}`);
  if (s.size !== "md") attrs.push(`size="${s.size}"`);
  if (s.minRows !== 3) attrs.push(`minRows={${s.minRows}}`);
  if (s.maxRows !== 12) attrs.push(`maxRows={${s.maxRows}}`);
  if (s.autoResize) attrs.push(`autoResize`);
  if (s.disabled) attrs.push(`disabled`);
  if (s.readOnly) attrs.push(`readOnly`);
  if (s.required) attrs.push(`required`);
  if (s.loading) attrs.push(`loading`);
  if (s.label) attrs.push(`label="${esc(s.label)}"`);
  if (s.helperText) attrs.push(`helperText="${esc(s.helperText)}"`);
  if (s.errorMessage) attrs.push(`errorMessage="${esc(s.errorMessage)}"`);
  if (s.warningMessage) attrs.push(`warningMessage="${esc(s.warningMessage)}"`);
  if (s.successMessage) attrs.push(`successMessage="${esc(s.successMessage)}"`);
  if (s.showCounter) attrs.push(`showCounter`);
  if (s.maxLength) attrs.push(`maxLength={${s.maxLength}}`);

  return `<Textarea\n  ${attrs.join("\n  ")}\n/>`;
}

function esc(v: string) {
  return v.replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Six sketches of how downstream surfaces compose Textarea. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <PatientNotesExample />
        <InternalCommentsExample />
        <SupportReplyExample />
        <AIPromptExample />
        <FeedbackExample />
        <DescriptionExample />
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

function PatientNotesExample() {
  const [value, setValue] = useState("Patient reports a persistent cough for 5 days without fever.\nNo relevant travel history.");
  return (
    <ExampleShell title="Patient notes" icon={<ClipboardList size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Clinical notes"
        description="Include symptoms, duration, and any relevant history."
        autoResize
        minRows={4}
        maxRows={10}
        maxLength={500}
        showCounter
        helperText="Visible to the entire care team."
      />
    </ExampleShell>
  );
}

function InternalCommentsExample() {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <ExampleShell title="Internal comments" icon={<MessageSquare size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Team comment"
        placeholder="Only visible to your team…"
        minRows={2}
        maxRows={6}
        autoResize
        loading={saving}
      />
      <div style={{ display: "flex", gap: t.space.inline.sm }}>
        <Button
          size="sm"
          onClick={() => {
            setSaving(true);
            setTimeout(() => { setSaving(false); setValue(""); }, 900);
          }}
          disabled={!value || saving}
        >
          Post
        </Button>
      </div>
    </ExampleShell>
  );
}

function SupportReplyExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleShell title="Support ticket reply" icon={<FileText size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Reply"
        required
        errorMessage={value.length > 0 && value.length < 20 ? "Reply must be at least 20 characters." : undefined}
        minRows={4}
        autoResize
        showCounter
        maxLength={2000}
        placeholder="Type your response…"
      />
    </ExampleShell>
  );
}

function AIPromptExample() {
  const [value, setValue] = useState("Summarize the patient's history into 3 sentences for handoff.");
  return (
    <ExampleShell title="AI prompt" icon={<Sparkles size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Prompt"
        description="The AI model has access to the patient chart."
        autoResize
        minRows={3}
        maxRows={12}
        size="lg"
        helperText="Ctrl+Enter to submit."
      />
    </ExampleShell>
  );
}

function FeedbackExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleShell title="Product feedback" icon={<Star size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="What could be better?"
        placeholder="Anything specific we should improve…"
        minRows={3}
        maxRows={8}
        autoResize
        optional
        showCounter
        maxLength={500}
      />
    </ExampleShell>
  );
}

function DescriptionExample() {
  const [value, setValue] = useState("");
  return (
    <ExampleShell title="Description field" icon={<BookOpen size={16} color={t.color.action.primary} />}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Description"
        helperText="Explain what this program covers."
        minRows={3}
        showCounter
        maxLength={280}
        size="sm"
      />
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

const PROPS_TEXTAREA: PropRow[] = [
  { name: "size",           type: "'sm' | 'md' | 'lg'",       def: "'md'",  desc: "Font size + padding ladder. Matches Input's sm/md/lg." },
  { name: "value",          type: "string",                    def: "—",     desc: "Controlled value. Pair with onChange." },
  { name: "defaultValue",   type: "string",                    def: "—",     desc: "Uncontrolled initial value." },
  { name: "onChange",       type: "(e: ChangeEvent) => void",  def: "—",     desc: "Native onChange — fires on every keystroke." },
  { name: "placeholder",    type: "string",                    def: "—",     desc: "Placeholder text shown when empty." },
  { name: "label",          type: "ReactNode",                 def: "—",     desc: "Visible label above the frame. Renders as <label htmlFor={inputId}>." },
  { name: "description",    type: "ReactNode",                 def: "—",     desc: "Muted secondary text under the label. Auto-wires aria-describedby." },
  { name: "optional",       type: "boolean",                    def: "false", desc: "Show an (Optional) marker next to the label. Suppressed when required." },
  { name: "requiredMarker", type: "ReactNode",                 def: "'*'",   desc: "Custom character rendered as the required marker." },
  { name: "helperText",     type: "ReactNode",                 def: "—",     desc: "Helper text under the frame. Suppressed while a validation message is showing." },
  { name: "errorMessage",   type: "ReactNode",                 def: "—",     desc: "Error message + red border + aria-invalid='true' + role='alert'." },
  { name: "warningMessage", type: "ReactNode",                 def: "—",     desc: "Warning message + yellow border. Non-blocking." },
  { name: "successMessage", type: "ReactNode",                 def: "—",     desc: "Success message + green border." },
  { name: "validation",     type: "'error' | 'warning' | 'success'", def: "—", desc: "Explicit validation state without a message. Messages override this." },
  { name: "loading",        type: "boolean",                    def: "false", desc: "Corner spinner + aria-busy='true'. Textarea stays interactive." },
  { name: "showCounter",    type: "boolean",                    def: "false", desc: "Show character counter in the footer. Requires maxLength." },
  { name: "maxLength",      type: "number",                    def: "—",     desc: "Native maxLength. Pair with showCounter for a visible count." },
  { name: "fullWidth",      type: "boolean",                    def: "true",  desc: "Grow to fill parent width." },
  { name: "minRows",        type: "number",                    def: "3",     desc: "Minimum row count. Frame starts at this height." },
  { name: "maxRows",        type: "number",                    def: "12",    desc: "Maximum row count. With autoResize, growth caps here; without, this is the max before scrolling." },
  { name: "autoResize",     type: "boolean",                    def: "false", desc: "Grow the frame between minRows and maxRows as the user types." },
  { name: "resize",         type: "'none' | 'vertical'",       def: "'none'", desc: "User-drag-resize handle. Don't combine with autoResize." },
  { name: "disabled",       type: "boolean",                    def: "false", desc: "Muted fill; not focusable; cursor: not-allowed." },
  { name: "readOnly",       type: "boolean",                    def: "false", desc: "Muted fill; focusable + selectable; input blocked." },
  { name: "required",       type: "boolean",                    def: "false", desc: "Native required + red * marker." },
  { name: "id",             type: "string",                    def: "auto",  desc: "Override the native textarea id. Auto-generated via useId." },
  { name: "children",       type: "ReactNode",                 def: "—",     desc: "Compose Textarea.Label / Description / Helper / Counter. Wins over shorthand props." },
];

const PROPS_LABEL: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Label content. Rendered inside a real <label htmlFor={inputId}>." },
];

const PROPS_DESCRIPTION: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—",    desc: "Secondary description text under the label." },
  { name: "id",       type: "string",    def: "auto", desc: "Override the description id (default: `${input-id}-description`)." },
];

const PROPS_HELPER: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—",    desc: "Helper text under the frame. Suppressed while a validation message is showing." },
  { name: "id",       type: "string",    def: "auto", desc: "Override the helper id (default: `${input-id}-helper`)." },
];

const PROPS_COUNTER: PropRow[] = [
  { name: "children", type: "ReactNode", def: "current/max", desc: "Custom counter content. Reads current length + maxLength from context." },
  { name: "id",       type: "string",    def: "auto",         desc: "Override the counter id (default: `${input-id}-counter`)." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Textarea"             rows={PROPS_TEXTAREA} />
      <PropsSubsection title="Textarea.Label"       rows={PROPS_LABEL} />
      <PropsSubsection title="Textarea.Description" rows={PROPS_DESCRIPTION} />
      <PropsSubsection title="Textarea.Helper"      rows={PROPS_HELPER} />
      <PropsSubsection title="Textarea.Counter"     rows={PROPS_COUNTER} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Textarea forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;textarea&gt;</code> HTML attributes (form, autoFocus, tabIndex, spellCheck, wrap, etc.) except the ones it manages internally (size, rows).
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
    { role: "Frame radius",           alias: "aliases.radius.control (same as Input)" },
    { role: "Frame border (rest)",    alias: "aliases.color.border.default (same as Input)" },
    { role: "Frame hover border",     alias: "aliases.color.border.strong (same as Input)" },
    { role: "Frame focus ring/border",alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Drawer + Checkbox + Radio + Switch)" },
    { role: "Placeholder color",      alias: "aliases.color.text.tertiary (same as Input)" },
    { role: "Disabled fill",          alias: "aliases.color.background.subtle + border.subtle + text.disabled (same as Input)" },
    { role: "Read-only fill",         alias: "aliases.color.background.subtle + border.subtle (same as Input)" },
    { role: "Error border/message",   alias: "aliases.color.status.error.fg (same as Input)" },
    { role: "Warning border/message", alias: "aliases.color.status.warning.fg (same as Input)" },
    { role: "Success border/message", alias: "aliases.color.status.success.fg (same as Input)" },
    { role: "Label typography",       alias: "font-size 14, weight semibold, color text.primary (same as Input)" },
    { role: "Description typography", alias: "font-size 12, color text.tertiary (matches Input helper tone)" },
    { role: "Helper / message typography", alias: "font-size 12 · caption ladder (same as Input footer)" },
    { role: "Counter typography",     alias: "font-size 12, tabular-nums, color text.tertiary (same as Input counter)" },
    { role: "Font ladder",            alias: "components.input.font.{sm,md,lg} — 12 / 14 / 16 (reused verbatim)" },
    { role: "Horizontal padding",     alias: "components.input.paddingX.{sm,md,lg} — 8 / 12 / 12 (reused verbatim)" },
    { role: "Vertical padding",       alias: "components.textarea.paddingY.{sm,md,lg} — 8 / 8 / 12" },
    { role: "Line height ladder",     alias: "components.textarea.lineHeight.{sm,md,lg} — 20 / 22 / 24 (rounded to even pixels)" },
    { role: "Default row bounds",     alias: "components.textarea.rows.min=3, .max=12" },
    { role: "Motion",                 alias: "aliases.motion.hoverIn (duration 150, easing standard) — reused from Input" },
    { role: "Loading spinner",        alias: "900ms linear — 2500ms under prefers-reduced-motion (same cadence as Input)" },
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
          { tone: "note", text: "Textarea reuses Input's field-wrapper philosophy: label + labelled frame + footer with helper/message + counter. The frame is a <div> with focus-within so the 2px brand ring paints outside without shifting layout." },
          { tone: "note", text: "The size ladder shares Input's font ladder + horizontal padding via direct token reference (see tokens/components/textarea.ts: `paddingX: input.paddingX`, `font: input.font`, `state: input.state`). If Input's palette changes, Textarea moves with it." },
          { tone: "note", text: "Auto-resize measures scrollHeight after resetting height to 'auto' (otherwise the previous inline height locks the measurement). Clamps between minRows × line-height + 2 × paddingY and maxRows × line-height + 2 × paddingY. Runs in useLayoutEffect so measurements happen before paint — no flicker." },
          { tone: "note", text: "Line heights (sm=20, md=22, lg=24) are rounded to even pixels so autoResize produces stable integer heights across font-size changes." },
          { tone: "note", text: "aria-describedby is composed from description + (helper OR message) + counter in DOM order. Slots are only included when actually rendered so screen readers don't chase phantom ids after a subcomponent unmounts." },
          { tone: "note", text: "Subcomponents register their presence via a context callback (`registerDescription` / `registerHelper` / `registerCounter`) so aria wiring updates correctly when a Textarea.Helper mounts inside a conditional." },
          { tone: "note", text: "Loading is compatible with typing — the spinner is decorative (aria-hidden) and the textarea stays interactive. Consumer owns clearing loading when the async work completes (usually an autosave)." },
        ]}
      />

      <Callout tone="info" title="Extending Textarea">
        (1) A future Rich Text Editor primitive would compose Textarea's shell but replace the native textarea with a contenteditable surface. Not built here — it's a distinct interaction family.
        (2) A future Markdown Editor primitive would compose Textarea + a preview pane + a toolbar. Same shell, different content. Not built here.
        (3) A new size should only be added if a genuine layout intent emerges. Update
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/input.ts
        </code>
        first (Textarea's font + padding ladders come from there) and the matching CSS vars in
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          variables.css
        </code>
        before touching Textarea.css.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "Native HTML textarea", detail: "The core element is a real <textarea>. IME composition, form submission, undo/redo, native maxLength enforcement, browser spell-check, autofill — all inherited without JS shims." },
    { name: "HC1 Input tokens",     detail: "The font ladder, horizontal padding, state palette, focus ring, and transition all come from Input's token bundle by direct reference. Textarea moves with Input on any palette change." },
    { name: "HC1 Input architecture", detail: "Same field wrapper + labelled frame + footer layout as Input, so a form with both reads as one visual family. Same validation model (message-first, explicit-fallback), same helper/counter footer." },
    { name: "HC1 design tokens",    detail: "Every color, radius, spacing, motion, and typography value is a token alias — no hex, no raw pixels, no bespoke shadows." },
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
    { name: "Clinical notes",     detail: "Chart entry, progress notes, handoff summaries — every multi-line clinician input surface." },
    { name: "Comments + replies", detail: "Team comments, ticket replies, inline discussion threads — anywhere users leave prose." },
    { name: "Feedback forms",     detail: "Product feedback, NPS follow-up, support tickets — always with a counter and helper text." },
    { name: "Descriptions",       detail: "Care program descriptions, policy summaries, resource copy — short-to-medium prose fields." },
    { name: "Internal notes",     detail: "Private admin annotations, moderation notes, review comments — visible only to internal roles." },
    { name: "AI prompt inputs",   detail: "Prompt fields for AI assistants — size='lg' + autoResize is the default." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every multi-line text surface in HC1 should compose Textarea. These are the anticipated consumers — none are shipped yet."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke <textarea> in the review flow (clinician notes, escalation reason, referral notes) — swap to Textarea at the same row size." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan step notes, patient message composer, and journal fields — replace and drop the custom CSS." },
    { area: "ClinicalIQ · Starter",     detail: "Any bare <textarea> currently hand-styled — sweep to the canonical primitive." },
    { area: "SourceIQ",                 detail: "Existing textarea surfaces (feedback, comments, prompt inputs) — adopt the shared tokens + primitive." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce bare <textarea>. Compose Textarea from day one so labels, validation, and counters follow the shared model." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Textarea replaces existing multi-line input implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — native <textarea>, aria-invalid + aria-describedby + aria-busy + role='alert' on errors" },
          { text: "Keyboard supported — Tab in/out, Enter inserts newline, undo/redo native" },
          { text: "Responsive — fullWidth default, minRows/maxRows for predictable heights, autoResize for content-fit" },
          { text: "Reuses Input architecture — same field wrapper, same footer, same validation model, same tokens" },
          { text: "Composable API — Label + Description + Helper + Counter subcomponents, plus shorthand props for the common case" },
          { text: "Loading state built in — corner spinner + aria-busy, textarea stays interactive during autosave" },
          { text: "Auto-resize built in — grows between minRows and maxRows, stops and scrolls at the cap" },
          { text: "Production ready — controlled + uncontrolled, all validation states, disabled + readOnly + required + loading all covered" },
        ]}
      />
    </DocBlock>
  );
}
