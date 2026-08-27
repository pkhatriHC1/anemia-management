import { useState } from "react";
import type { ReactNode } from "react";
import {
  AtSign,
  CreditCard,
  Globe,
  Info,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import {
  Input,
  type InputSize,
  type InputType,
} from "../../components/input";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const TYPES: InputType[] = ["text", "email", "password", "number", "search", "tel", "url"];
const SIZES: InputSize[] = ["xs", "sm", "md", "lg", "xl"];

export function InputDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <FeaturesBlock />
      <SizesBlock />
      <StatesBlock />
      <ValidationBlock />
      <A11yBlock />
      <DoDontBlock />
      <PlaygroundBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Input"
      lead="Input is the reference form control in the HC1 design system. Every other text-shaped control — Textarea, Search, Select, Combobox, Date Picker, Number, Password — should inherit its size ladder, focus ring, validation model, and helper/counter footer. It consumes semantic tokens only, aligns pixel-for-pixel with Button, and ships every required state."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

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
        <div style={{ width: "min(420px, 100%)" }}>
          <Input
            label="Work email"
            required
            leadingIcon={<Mail />}
            placeholder="you@company.com"
            helperText="We'll use this to send account notifications."
            defaultValue="paresh@hc1.com"
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
        <Part name="label"          desc="Visible label. Rendered above the frame and linked via htmlFor." />
        <Part name="required marker" desc="Red asterisk from the required prop. Never render manually." />
        <Part name="optional marker" desc="Right-aligned '(Optional)' when optional and not required." />
        <Part name="leadingIcon"    desc="Decorative icon inside the frame before the control. Non-interactive." />
        <Part name="control"        desc="The native <input>. Owns type, value, placeholder, keyboard behavior." />
        <Part name="trailingIcon"   desc="Decorative icon after the control. Hidden while loading or when clear is visible." />
        <Part name="clear"          desc="Auto-appears when clearable and hasValue. Tab-skipped; focus returns to input." />
        <Part name="spinner"        desc="Trailing spinner while loading=true. Preserves layout width." />
        <Part name="helperText"     desc="Static guidance. Suppressed while a validation message is present." />
        <Part name="validation"     desc="Error / warning / success message. Takes over the helper slot." />
        <Part name="counter"        desc="'x / max' counter, right-aligned. Requires maxLength + showCounter." />
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

/* ══════ Features ═════════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Seven input types, plus disabled, read-only, required, loading, leading/trailing icons, and a clear button. Everything a text-shaped control needs."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="Text"
          code={`type="text"`}
          content={<Input placeholder="John Doe" defaultValue="Jane Cooper" leadingIcon={<User />} />}
        />
        <FeatureTile
          title="Email"
          code={`type="email"`}
          content={<Input type="email" placeholder="you@company.com" leadingIcon={<AtSign />} />}
        />
        <FeatureTile
          title="Password"
          code={`type="password"`}
          content={<Input type="password" placeholder="Enter password" defaultValue="hunter2!" />}
        />
        <FeatureTile
          title="Number"
          code={`type="number"`}
          content={<Input type="number" placeholder="0" defaultValue="42" leadingIcon={<CreditCard />} />}
        />
        <FeatureTile
          title="Search"
          code={`type="search" clearable`}
          content={
            <Input
              type="search"
              placeholder="Search patients"
              defaultValue="Cooper"
              leadingIcon={<Search />}
              clearable
            />
          }
        />
        <FeatureTile
          title="Tel"
          code={`type="tel"`}
          content={<Input type="tel" placeholder="(555) 123-4567" leadingIcon={<Phone />} />}
        />
        <FeatureTile
          title="URL"
          code={`type="url"`}
          content={<Input type="url" placeholder="https://…" leadingIcon={<Globe />} />}
        />
        <FeatureTile
          title="Loading"
          code={`loading`}
          content={<Input placeholder="Checking availability…" defaultValue="jane_cooper" loading />}
        />
      </div>
    </DocBlock>
  );
}

function FeatureTile({ title, code, content }: { title: string; code: string; content: ReactNode }) {
  return (
    <div
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
      <div>{content}</div>
      <div>
        <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>
          {title}
        </div>
        <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
          {code}
        </code>
      </div>
    </div>
  );
}

/* ══════ Sizes ══════════════════════════════════════════════════════ */

const SIZE_HINT: Record<InputSize, string> = {
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
      lead="Five sizes, no in-betweens. Heights match Button exactly so an Input can sit next to a Button of the same size without visual drift."
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
              gridTemplateColumns: "40px minmax(220px, 1fr) minmax(180px, 240px)",
              gap: t.space.inline.lg,
              alignItems: "center",
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontWeight: 700, color: t.color.action.primary }}>
              {s}
            </code>
            <Input
              size={s}
              placeholder="Search patients"
              leadingIcon={<Search />}
            />
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
    <DocBlock title="States" lead="Every interactive and validation state exists. Focus is never suppressed.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Default"   note="Rest state."                     content={<Input placeholder="Placeholder" />} />
        <StateTile name="Hover"     note="Hover the frame to see the state." content={<Input placeholder="Placeholder" />} />
        <StateTile name="Focused"   note="Tab to reveal the focus ring."   content={<Input placeholder="Placeholder" autoFocus={false} />} />
        <StateTile name="Filled"    note="Value present, resting frame."   content={<Input defaultValue="Jane Cooper" />} />
        <StateTile name="Disabled"  note="Muted surface, not focusable."   content={<Input placeholder="Disabled" disabled />} />
        <StateTile name="Read only" note="Muted surface, still focusable." content={<Input defaultValue="Read-only value" readOnly />} />
        <StateTile name="Loading"   note="aria-busy=true. Layout preserved." content={<Input placeholder="Checking…" defaultValue="jane_cooper" loading />} />
        <StateTile name="Error"     note="Border + message + aria-invalid." content={<Input defaultValue="not-an-email" errorMessage="Enter a valid email." />} />
        <StateTile name="Warning"   note="Border + message. No aria-invalid." content={<Input defaultValue="short" warningMessage="Consider a longer value." />} />
        <StateTile name="Success"   note="Border + message. Confirmation only." content={<Input defaultValue="jane@hc1.com" successMessage="Email verified." />} />
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, content }: { name: string; note: string; content: ReactNode }) {
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
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control }}>
        {content}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

/* ══════ Validation ═══════════════════════════════════════════════════ */

function ValidationBlock() {
  return (
    <DocBlock
      title="Validation"
      lead="Validation is a first-class prop, not a className hack. Message presence auto-derives the state, ordered error → warning → success."
    >
      <RuleList
        rules={[
          { tone: "must",     text: "errorMessage present → state='error', role='alert' on the message, aria-invalid=true on the input." },
          { tone: "must",     text: "warningMessage present → state='warning'. No aria-invalid — a warning is not an error." },
          { tone: "must",     text: "successMessage present → state='success'. Use sparingly, only for confirmations that need to stick." },
          { tone: "should",   text: "Prefer messages over the bare validation prop — a state without a message is unhelpful to the user." },
          { tone: "must-not", text: "Never render your own <p style={{color:'red'}}>error</p> under an Input. Use errorMessage." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Accessibility ══════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The label is a real <label htmlFor={id}> — clicking it focuses the input. IDs are auto-generated via useId if none is provided." },
          { tone: "must", text: "The 2px brand focus ring uses :focus-within so tabbing into the control lights the whole frame — matches Button exactly." },
          { tone: "must", text: "Helper text, validation messages, and the counter are wired to the input via aria-describedby." },
          { tone: "must", text: "errorMessage sets aria-invalid=true and role='alert' on the message so screen readers announce validation failures." },
          { tone: "must", text: "The clear button is tab-skipped (tabIndex=-1) to avoid trapping focus mid-flow; users clear with Backspace or Cmd-A + Delete." },
          { tone: "must", text: "loading sets aria-busy=true. The input stays interactive — loading signals async work, not disablement." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses transitions to 0ms and slows the spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Do / Don't ═══════════════════════════════════════════════════ */

function DoDontBlock() {
  return (
    <DocBlock title="Do & Don't">
      <DoDontGrid
        dos={[
          { title: "Always render a label",       description: "Even in dense tables. If space is tight, use size='sm' — never drop the label to save room." },
          { title: "Use messages for validation", description: "errorMessage / warningMessage / successMessage are the API. They auto-set the state and wire aria correctly." },
          { title: "Match Button size on the same row", description: "size='md' Input next to size='md' Button — heights align. Same for xs/sm/lg/xl." },
          { title: "Use type='search' + clearable together", description: "Search fields feel broken without a clear affordance. Turn it on." },
        ]}
        donts={[
          { title: "Custom padding via style",    description: "Sizes are the API. If a size doesn't fit, the layout is wrong, not the input." },
          { title: "Placeholder as label",        description: "Placeholder disappears the moment the user types. Labels don't. Always use the label prop." },
          { title: "Multiple messages at once",   description: "Show one message. Order is error > warning > success — messages don't stack." },
          { title: "Hand-styled error text",      description: "A red <span> under a plain Input skips aria wiring and drifts from the token palette." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ═══════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [type, setType]                 = useState<InputType>("text");
  const [size, setSize]                 = useState<InputSize>("md");
  const [state, setState]               = useState<"none" | "error" | "warning" | "success">("none");
  const [disabled, setDisabled]         = useState(false);
  const [readOnly, setReadOnly]         = useState(false);
  const [required, setRequired]         = useState(true);
  const [optional, setOptional]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [hasLeading, setHasLeading]     = useState(true);
  const [hasTrailing, setHasTrailing]   = useState(false);
  const [clearable, setClearable]       = useState(true);
  const [showCounter, setShowCounter]   = useState(false);

  const [label, setLabel]           = useState("Work email");
  const [placeholder, setPlaceholder] = useState("you@company.com");
  const [helper, setHelper]         = useState("We'll use this to send account notifications.");
  const [errorMsg, setErrorMsg]     = useState("Enter a valid email address.");
  const [successMsg, setSuccessMsg] = useState("Email verified.");
  const [warningMsg, setWarningMsg] = useState("This looks like a personal address.");

  const [value, setValue] = useState("jane@hc1.com");

  const errorMessage   = state === "error"   ? errorMsg   : undefined;
  const warningMessage = state === "warning" ? warningMsg : undefined;
  const successMessage = state === "success" ? successMsg : undefined;

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered input in real time.">
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
            minHeight: 160,
          }}
        >
          <div style={{ width: "min(480px, 100%)" }}>
            <Input
              type={type}
              size={size}
              label={label || undefined}
              required={required}
              optional={optional}
              placeholder={placeholder}
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={disabled}
              readOnly={readOnly}
              loading={loading}
              leadingIcon={hasLeading ? <Mail /> : undefined}
              trailingIcon={hasTrailing ? <Info /> : undefined}
              clearable={clearable}
              helperText={helper || undefined}
              errorMessage={errorMessage}
              warningMessage={warningMessage}
              successMessage={successMessage}
              showCounter={showCounter}
              maxLength={showCounter ? 40 : undefined}
            />
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
          <SelectControl label="type" value={type} options={TYPES} onChange={v => setType(v as InputType)} />
          <SelectControl label="size" value={size} options={SIZES} onChange={v => setSize(v as InputSize)} />
          <SelectControl
            label="state"
            value={state}
            options={["none", "error", "warning", "success"]}
            onChange={v => setState(v as typeof state)}
          />

          <TextControl label="label"       value={label}       onChange={setLabel} />
          <TextControl label="placeholder" value={placeholder} onChange={setPlaceholder} />
          <TextControl label="helperText"  value={helper}      onChange={setHelper} />

          {state === "error"   && <TextControl label="errorMessage"   value={errorMsg}   onChange={setErrorMsg} />}
          {state === "warning" && <TextControl label="warningMessage" value={warningMsg} onChange={setWarningMsg} />}
          {state === "success" && <TextControl label="successMessage" value={successMsg} onChange={setSuccessMsg} />}

          <ToggleControl label="required"    value={required}    onChange={v => { setRequired(v); if (v) setOptional(false); }} />
          <ToggleControl label="optional"    value={optional}    onChange={v => { setOptional(v); if (v) setRequired(false); }} />
          <ToggleControl label="disabled"    value={disabled}    onChange={setDisabled} />
          <ToggleControl label="readOnly"    value={readOnly}    onChange={setReadOnly} />
          <ToggleControl label="loading"     value={loading}     onChange={setLoading} />
          <ToggleControl label="leadingIcon" value={hasLeading}  onChange={setHasLeading} />
          <ToggleControl label="trailingIcon" value={hasTrailing} onChange={setHasTrailing} />
          <ToggleControl label="clearable"   value={clearable}   onChange={setClearable} />
          <ToggleControl label="showCounter" value={showCounter} onChange={setShowCounter} />
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
{renderCode({
  type, size, label, placeholder, helper,
  errorMessage, warningMessage, successMessage,
  disabled, readOnly, required, optional,
  loading, hasLeading, hasTrailing, clearable,
  showCounter,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  type: InputType;
  size: InputSize;
  label: string;
  placeholder: string;
  helper: string;
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  optional: boolean;
  loading: boolean;
  hasLeading: boolean;
  hasTrailing: boolean;
  clearable: boolean;
  showCounter: boolean;
}) {
  const attrs: string[] = [];
  if (s.type !== "text")     attrs.push(`type="${s.type}"`);
  if (s.size !== "md")       attrs.push(`size="${s.size}"`);
  if (s.label)               attrs.push(`label="${escapeAttr(s.label)}"`);
  if (s.required)            attrs.push("required");
  if (s.optional)            attrs.push("optional");
  if (s.placeholder)         attrs.push(`placeholder="${escapeAttr(s.placeholder)}"`);
  if (s.hasLeading)          attrs.push("leadingIcon={<Mail />}");
  if (s.hasTrailing)         attrs.push("trailingIcon={<Info />}");
  if (s.clearable)           attrs.push("clearable");
  if (s.loading)             attrs.push("loading");
  if (s.disabled)            attrs.push("disabled");
  if (s.readOnly)            attrs.push("readOnly");
  if (s.helper && !s.errorMessage && !s.warningMessage && !s.successMessage) {
    attrs.push(`helperText="${escapeAttr(s.helper)}"`);
  }
  if (s.errorMessage)   attrs.push(`errorMessage="${escapeAttr(s.errorMessage)}"`);
  if (s.warningMessage) attrs.push(`warningMessage="${escapeAttr(s.warningMessage)}"`);
  if (s.successMessage) attrs.push(`successMessage="${escapeAttr(s.successMessage)}"`);
  if (s.showCounter) {
    attrs.push("showCounter");
    attrs.push("maxLength={40}");
  }

  const multiline = attrs.length > 3;
  if (multiline) {
    return `<Input\n  ${attrs.join("\n  ")}\n/>`;
  }
  return `<Input${attrs.length ? " " + attrs.join(" ") : ""} />`;
}

function escapeAttr(v: string) {
  return v.replace(/"/g, "\\\"");
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

function ControlLabel({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
      {children}
    </span>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "type",           type: "'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'", def: "'text'", desc: "Native input type." },
  { name: "size",           type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",                                     def: "'md'",   desc: "Height ladder — matches Button so controls align on the same row." },
  { name: "label",          type: "ReactNode",                                                             def: "—",       desc: "Visible label, linked to the control via htmlFor." },
  { name: "optional",       type: "boolean",                                                               def: "false",   desc: "Show '(Optional)' next to the label. Ignored when required is true." },
  { name: "requiredMarker", type: "ReactNode",                                                             def: "'*'",     desc: "Character rendered as the required marker." },
  { name: "helperText",     type: "ReactNode",                                                             def: "—",       desc: "Guidance text under the input. Suppressed when a validation message is present." },
  { name: "errorMessage",   type: "ReactNode",                                                             def: "—",       desc: "Sets state='error', role='alert', aria-invalid=true. Overrides warning and success." },
  { name: "warningMessage", type: "ReactNode",                                                             def: "—",       desc: "Sets state='warning'. Overrides success. No aria-invalid." },
  { name: "successMessage", type: "ReactNode",                                                             def: "—",       desc: "Sets state='success' for confirmations that need to persist." },
  { name: "validation",     type: "'error' | 'warning' | 'success'",                                       def: "—",       desc: "Explicit visual state without a message. Any message prop overrides this." },
  { name: "leadingIcon",    type: "ReactNode",                                                             def: "—",       desc: "Decorative icon inside the frame before the control." },
  { name: "trailingIcon",   type: "ReactNode",                                                             def: "—",       desc: "Decorative icon after the control. Hidden while loading or clear is visible." },
  { name: "clearable",      type: "boolean",                                                               def: "false",   desc: "Show a clear (✕) button when the input has a value." },
  { name: "onClear",        type: "(input: HTMLInputElement) => void",                                     def: "—",       desc: "Called after clearing so controlled callers can sync state." },
  { name: "loading",        type: "boolean",                                                               def: "false",   desc: "Shows spinner in the trailing slot, sets aria-busy=true. Input stays interactive." },
  { name: "showCounter",    type: "boolean",                                                               def: "false",   desc: "Show a 'value / maxLength' counter. Requires maxLength." },
  { name: "fullWidth",      type: "boolean",                                                               def: "true",    desc: "Grow to fill parent width." },
  { name: "disabled",       type: "boolean",                                                               def: "false",   desc: "Muted surface, not focusable, no clear button." },
  { name: "readOnly",       type: "boolean",                                                               def: "false",   desc: "Muted surface, still focusable and selectable." },
  { name: "required",       type: "boolean",                                                               def: "false",   desc: "Native required + red asterisk in the label." },
  { name: "onChange",       type: "(e: ChangeEvent<HTMLInputElement>) => void",                            def: "—",       desc: "Native change handler. Fires from clear-button as well." },
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
        <div style={{ display: "grid", gridTemplateColumns: "160px 1.4fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "160px 1.4fr 100px 2fr",
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

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
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
    { role: "Radius",         alias: "aliases.radius.control (xs uses radius.4)" },
    { role: "Motion",         alias: "aliases.motion.hoverIn (matches Button)" },
    { role: "Focus ring",     alias: "aliases.color.border.focus (matches Button)" },
    { role: "Frame — rest",   alias: "aliases.color.background.default / border.default / text.primary" },
    { role: "Frame — hover",  alias: "aliases.color.border.strong" },
    { role: "Frame — focus",  alias: "aliases.color.border.focus" },
    { role: "Frame — disabled", alias: "aliases.color.background.subtle / border.subtle / text.disabled" },
    { role: "Frame — read-only", alias: "aliases.color.background.subtle / border.subtle" },
    { role: "Frame — error",  alias: "aliases.color.status.error.fg (border, message, icon)" },
    { role: "Frame — warning", alias: "aliases.color.status.warning.fg (border, message, icon)" },
    { role: "Frame — success", alias: "aliases.color.status.success.fg (border, message, icon)" },
    { role: "Placeholder",    alias: "aliases.color.text.tertiary" },
    { role: "Icon slot",      alias: "aliases.color.text.tertiary; picks up status color when validated" },
    { role: "Clear hover",    alias: "aliases.color.background.subtle / bg.muted" },
    { role: "Typography",     alias: "typography.caption (xs / sm) · bodyS (md) · body (lg) · bodyL (xl)" },
    { role: "Spacing",        alias: "spacing.inline.xs → inline.lg (frame padding + gap)" },
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
          { tone: "note", text: "The component's CSS lives at Input.css and references CSS custom properties from tokens/css/variables.css. Importing Input pulls both in — no separate setup step." },
          { tone: "note", text: "The clear button works for both controlled and uncontrolled inputs. It writes an empty string through the native value setter and dispatches an input event so any form observer sees the change." },
          { tone: "note", text: "Height ladder is authored to match Button exactly. If you change one, change both." },
          { tone: "note", text: "The frame uses focus-within so the focus ring lights on tab-in to the inner <input> — the same visual as clicking directly on the input." },
          { tone: "note", text: "Textarea, Search, Select, Combobox, Date Picker, Number, and Password should all inherit this design language when added. Reuse the same size ladder, focus ring, validation model, and footer." },
        ]}
      />

      <Callout tone="info" title="Extending the family">
        (1) If a new control needs a role not in the alias layer, add the alias first. (2) Add a component token module under
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/
        </code>
        that mirrors the Input structure — same size keys, same state keys. (3) Ship the component under
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          src/design-system/components/
        </code>
        with a matching four-file layout (Component.tsx, Component.types.ts, Component.css, index.ts). (4) Reuse the Input frame classes where the shape is truly identical — don't rewrite from scratch.
      </Callout>
    </DocBlock>
  );
}
