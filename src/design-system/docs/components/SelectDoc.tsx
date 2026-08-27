import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Beaker,
  Briefcase,
  FlaskConical,
  Heart,
  MapPin,
  Microscope,
  Stethoscope,
  User,
} from "lucide-react";
import {
  Select,
  type SelectOption,
  type SelectSize,
} from "../../components/select";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: SelectSize[] = ["xs", "sm", "md", "lg", "xl"];

/* ══════ Sample option pools ═══════════════════════════════════════ */

const SPECIALTIES: SelectOption[] = [
  { label: "Cardiology",       value: "cardio",     icon: <Heart /> },
  { label: "Endocrinology",    value: "endo",       icon: <Activity /> },
  { label: "Hematology",       value: "hem",        icon: <Beaker /> },
  { label: "Internal Medicine", value: "internal",  icon: <Stethoscope /> },
  { label: "Oncology",         value: "onc",        icon: <Microscope />, disabled: true },
  { label: "Rheumatology",     value: "rheum",      icon: <FlaskConical /> },
];

const SPECIALTIES_GROUPED: SelectOption[] = [
  { label: "Cardiology",         value: "cardio",   description: "Heart and vascular",        icon: <Heart />,       group: "Adult" },
  { label: "Endocrinology",      value: "endo",     description: "Diabetes, thyroid, hormones", icon: <Activity />,  group: "Adult" },
  { label: "Hematology",         value: "hem",      description: "Blood and clotting",         icon: <Beaker />,     group: "Adult" },
  { label: "Pediatric Cardiology", value: "pcardio", description: "Children — heart",          icon: <Heart />,      group: "Pediatric" },
  { label: "Pediatric Endocrinology", value: "pendo", description: "Children — endocrine",    icon: <Activity />,   group: "Pediatric" },
];

const SITES: SelectOption[] = [
  { label: "Main Hospital",    value: "main",   icon: <Briefcase /> },
  { label: "Downtown Clinic",  value: "down",   icon: <MapPin /> },
  { label: "East Campus",      value: "east",   icon: <MapPin /> },
];

/* ══════ Doc entry ═════════════════════════════════════════════════ */

export function SelectDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <FeaturesBlock />
      <SizesBlock />
      <StatesBlock />
      <A11yBlock />
      <KeyboardBlock />
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
      title="The canonical HC1 Select"
      lead="Select is the reference single-selection control. It renders a trigger that visually matches an Input frame — same height, same focus ring, same validation model — and opens a listbox popup with keyboard navigation and grouped options. Every future dropdown-shaped control (Combobox, Multi Select, User Picker, Command Palette, Filter Dropdown, Date Picker) should inherit its trigger, its popup, and its option row."
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
        <div style={{ width: "min(420px, 100%)" }}>
          <Select
            label="Care team specialty"
            required
            leadingIcon={<Stethoscope />}
            placeholder="Select a specialty"
            options={SPECIALTIES}
            defaultValue="cardio"
            helperText="Determines which order sets appear on the review screen."
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
        <Part name="label"       desc="Visible label, linked to the trigger via aria-labelledby." />
        <Part name="trigger"     desc="Button styled to match the Input frame. Owns the focus ring and validation border." />
        <Part name="leadingIcon" desc="Decorative icon before the value in the trigger." />
        <Part name="value / placeholder" desc="Selected option's label, or the placeholder when no value is set." />
        <Part name="chevron"     desc="Rotates 180° when the popup is open. Replaced by a spinner when loading." />
        <Part name="popup"       desc="Absolute-positioned listbox. Flips above the trigger when there's no room below." />
        <Part name="group header" desc="Uppercase category label. Groups are ordered by first-appearance of an option." />
        <Part name="option"      desc="One row per option. Reads label, description, icon, and disabled." />
        <Part name="check"       desc="Right-aligned checkmark on the selected option. Uses the brand color." />
        <Part name="empty state" desc="Shown when options is empty. Customise via emptyStateMessage." />
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
      lead="Single selection, placeholder, disabled and required, leading icon, grouped options, option icons and descriptions, loading, and an empty state — everything a base dropdown needs."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <FeatureTile
          title="Placeholder"
          code={`placeholder`}
          content={<Select options={SPECIALTIES} placeholder="Select a specialty" />}
        />
        <FeatureTile
          title="Default value"
          code={`defaultValue`}
          content={<Select options={SPECIALTIES} defaultValue="hem" />}
        />
        <FeatureTile
          title="Leading icon"
          code={`leadingIcon`}
          content={<Select options={SITES} defaultValue="main" leadingIcon={<Briefcase />} />}
        />
        <FeatureTile
          title="Option icons"
          code={`option.icon`}
          content={<Select options={SPECIALTIES} defaultValue="cardio" />}
        />
        <FeatureTile
          title="Option descriptions"
          code={`option.description`}
          content={<Select options={SPECIALTIES_GROUPED} defaultValue="cardio" />}
        />
        <FeatureTile
          title="Grouped options"
          code={`option.group`}
          content={<Select options={SPECIALTIES_GROUPED} defaultValue="pcardio" />}
        />
        <FeatureTile
          title="Disabled option"
          code={`option.disabled`}
          content={<Select options={SPECIALTIES} defaultValue="cardio" />}
        />
        <FeatureTile
          title="Loading"
          code={`loading`}
          content={<Select options={SPECIALTIES} defaultValue="cardio" loading />}
        />
        <FeatureTile
          title="Empty state"
          code={`emptyStateMessage`}
          content={<Select options={[]} emptyStateMessage="No specialties on file" placeholder="Select…" />}
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

const SIZE_HINT: Record<SelectSize, string> = {
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
      lead="Five sizes matching Button and Input exactly. A size='md' Select trigger stands flush with a size='md' Input and a size='md' Button on the same row."
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
            <Select
              size={s}
              options={SPECIALTIES}
              defaultValue="cardio"
              leadingIcon={<Stethoscope />}
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
        <StateTile name="Default"   note="Rest state, no selection."          content={<Select options={SPECIALTIES} placeholder="Select a specialty" />} />
        <StateTile name="Hover"     note="Hover the trigger to see the state."content={<Select options={SPECIALTIES} placeholder="Select a specialty" />} />
        <StateTile name="Focused"   note="Tab to reveal the focus ring."      content={<Select options={SPECIALTIES} placeholder="Select a specialty" />} />
        <StateTile name="Selected"  note="A value is chosen — label replaces placeholder." content={<Select options={SPECIALTIES} defaultValue="cardio" />} />
        <StateTile name="Disabled"  note="Muted surface, not focusable."       content={<Select options={SPECIALTIES} defaultValue="cardio" disabled />} />
        <StateTile name="Loading"   note="Spinner replaces chevron. aria-busy=true." content={<Select options={SPECIALTIES} defaultValue="cardio" loading />} />
        <StateTile name="Error"     note="Border + message + aria-invalid."    content={<Select options={SPECIALTIES} errorMessage="Choose a specialty to continue." />} />
        <StateTile name="Warning"   note="Border + message. No aria-invalid."  content={<Select options={SPECIALTIES} defaultValue="cardio" warningMessage="Team review recommended." />} />
        <StateTile name="Success"   note="Border + message. Confirmation."      content={<Select options={SPECIALTIES} defaultValue="cardio" successMessage="Assignment saved." />} />
        <StateTile name="Open"      note="Click the trigger to open the popup." content={<Select options={SPECIALTIES} defaultValue="cardio" />} />
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

/* ══════ Accessibility ══════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The trigger uses role='combobox' with aria-haspopup='listbox', aria-expanded, aria-controls, and aria-activedescendant per the ARIA Authoring Practices Select-only Combobox pattern." },
          { tone: "must", text: "DOM focus stays on the trigger while the popup is open. The active option is signaled via aria-activedescendant — no roving focus, no focus traps." },
          { tone: "must", text: "The label is linked via aria-labelledby so screen readers announce '<label>, combobox, <value>'. IDs are auto-generated via useId." },
          { tone: "must", text: "Each option has role='option' and aria-selected. Group containers use role='group' and aria-labelledby to name the section." },
          { tone: "must", text: "Disabled options carry aria-disabled=true and are skipped by keyboard navigation entirely." },
          { tone: "must", text: "errorMessage sets aria-invalid=true on the trigger and role='alert' on the message so validation failures announce." },
          { tone: "must", text: "loading sets aria-busy=true. The trigger stays interactive — loading signals async work, not disablement." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses transitions and the popup enter animation, and slows the spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: Array<[string, string, string]> = [
    ["Enter / Space",       "closed", "Open the popup. Highlights the selected option (or first)."],
    ["ArrowDown",           "closed", "Open. Highlights the selected option (or first)."],
    ["ArrowUp",             "closed", "Open. Highlights the selected option (or last)."],
    ["ArrowDown",           "open",   "Move highlight to next enabled option."],
    ["ArrowUp",             "open",   "Move highlight to previous enabled option."],
    ["Home",                "open",   "Highlight the first enabled option."],
    ["End",                 "open",   "Highlight the last enabled option."],
    ["Enter / Space",       "open",   "Select the highlighted option and close."],
    ["Escape",              "open",   "Close without changing the value."],
    ["Tab",                 "open",   "Close and move focus to the next tabstop."],
    ["Click outside",       "open",   "Close without changing the value."],
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 80px 1fr",
            background: t.color.background.subtle,
            padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
            borderBottom: `1px solid ${t.color.border.subtle}`,
          }}
        >
          <HeaderCell>Key</HeaderCell>
          <HeaderCell>When</HeaderCell>
          <HeaderCell>Behavior</HeaderCell>
        </div>
        {rows.map(([key, when, behavior], i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 80px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
              {key}
            </code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>
              {when}
            </code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
              {behavior}
            </span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Do / Don't ══════════════════════════════════════════════════ */

function DoDontBlock() {
  return (
    <DocBlock title="Do & Don't">
      <DoDontGrid
        dos={[
          { title: "Match Input size on the same row",  description: "size='md' Select next to size='md' Input — heights align. Same for xs/sm/lg/xl." },
          { title: "Use groups for &gt;7 options",       description: "Group options with a shared category so users can scan by section." },
          { title: "Use descriptions to disambiguate",   description: "When two options share a label prefix or need clarification, add a short description." },
          { title: "Disable options that don't apply",   description: "Prefer disabling to hiding when the option is expected — users know why it's greyed out." },
        ]}
        donts={[
          { title: "Reach for Select for boolean choices", description: "Use a switch, checkbox, or radio pair — not a two-option Select." },
          { title: "Mix icons for some options only",     description: "If any option has an icon, all should. Inconsistent icons break scanning." },
          { title: "Cram &gt;12 options without groups",  description: "Long ungrouped lists become a scroll test. Group by category or introduce Combobox with search." },
          { title: "Style the trigger with custom padding", description: "Sizes are the API. Bespoke padding breaks alignment with Input and Button." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ══════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [size, setSize]             = useState<SelectSize>("md");
  const [placeholder, setPlaceholder] = useState("Select a specialty");
  const [disabled, setDisabled]     = useState(false);
  const [required, setRequired]     = useState(true);
  const [loading, setLoading]       = useState(false);
  const [state, setState]           = useState<"none" | "error" | "warning" | "success">("none");
  const [count, setCount]           = useState(6);
  const [grouped, setGrouped]       = useState(false);
  const [hasLeading, setHasLeading] = useState(true);
  const [withIcons, setWithIcons]   = useState(true);
  const [withDesc, setWithDesc]     = useState(false);
  const [label, setLabel]           = useState("Care team specialty");
  const [helper, setHelper]         = useState("Determines which order sets appear.");
  const [value, setValue]           = useState<string | undefined>("cardio");

  const options = useMemo<SelectOption[]>(() => {
    const pool: Array<Omit<SelectOption, "value"> & { value: string }> = [
      { label: "Cardiology",         value: "cardio",   icon: withIcons ? <Heart />        : undefined, description: withDesc ? "Heart and vascular" : undefined,     group: grouped ? "Adult"     : undefined },
      { label: "Endocrinology",      value: "endo",     icon: withIcons ? <Activity />     : undefined, description: withDesc ? "Diabetes, thyroid"   : undefined,     group: grouped ? "Adult"     : undefined },
      { label: "Hematology",         value: "hem",      icon: withIcons ? <Beaker />       : undefined, description: withDesc ? "Blood and clotting"  : undefined,     group: grouped ? "Adult"     : undefined },
      { label: "Internal Medicine",  value: "internal", icon: withIcons ? <Stethoscope />  : undefined, description: withDesc ? "General adult care"  : undefined,     group: grouped ? "Adult"     : undefined },
      { label: "Oncology",           value: "onc",      icon: withIcons ? <Microscope />   : undefined, description: withDesc ? "Cancer care"         : undefined,     group: grouped ? "Adult"     : undefined, disabled: true },
      { label: "Rheumatology",       value: "rheum",    icon: withIcons ? <FlaskConical /> : undefined, description: withDesc ? "Autoimmune"          : undefined,     group: grouped ? "Adult"     : undefined },
      { label: "Pediatric Cardiology", value: "pcardio", icon: withIcons ? <Heart />        : undefined, description: withDesc ? "Children — heart"    : undefined,    group: grouped ? "Pediatric" : undefined },
      { label: "Pediatric Endocrinology", value: "pendo", icon: withIcons ? <Activity />     : undefined, description: withDesc ? "Children — endocrine" : undefined,  group: grouped ? "Pediatric" : undefined },
      { label: "Pediatric Neurology", value: "pneuro",  icon: withIcons ? <User />         : undefined, description: withDesc ? "Children — neuro"    : undefined,     group: grouped ? "Pediatric" : undefined },
      { label: "Pediatric Oncology",  value: "ponc",    icon: withIcons ? <Microscope />   : undefined, description: withDesc ? "Children — cancer"   : undefined,     group: grouped ? "Pediatric" : undefined },
    ];
    return pool.slice(0, count);
  }, [count, withIcons, withDesc, grouped]);

  const errorMessage   = state === "error"   ? "Choose a specialty to continue."     : undefined;
  const warningMessage = state === "warning" ? "Team review recommended."             : undefined;
  const successMessage = state === "success" ? "Assignment saved."                    : undefined;

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered select in real time.">
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
            minHeight: 220,
          }}
        >
          <div style={{ width: "min(480px, 100%)" }}>
            <Select
              size={size}
              label={label || undefined}
              required={required}
              placeholder={placeholder}
              options={options}
              value={value}
              onChange={v => setValue(v)}
              disabled={disabled}
              loading={loading}
              leadingIcon={hasLeading ? <Stethoscope /> : undefined}
              helperText={helper || undefined}
              errorMessage={errorMessage}
              warningMessage={warningMessage}
              successMessage={successMessage}
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
          <SelectControl label="size" value={size} options={SIZES} onChange={v => setSize(v as SelectSize)} />
          <SelectControl label="state" value={state} options={["none", "error", "warning", "success"]} onChange={v => setState(v as typeof state)} />
          <SelectControl label="options" value={String(count)} options={["1", "3", "5", "6", "8", "10"]} onChange={v => setCount(Number(v))} />

          <TextControl label="label" value={label} onChange={setLabel} />
          <TextControl label="placeholder" value={placeholder} onChange={setPlaceholder} />
          <TextControl label="helperText" value={helper} onChange={setHelper} />

          <ToggleControl label="required"    value={required}    onChange={setRequired} />
          <ToggleControl label="disabled"    value={disabled}    onChange={setDisabled} />
          <ToggleControl label="loading"     value={loading}     onChange={setLoading} />
          <ToggleControl label="grouped"     value={grouped}     onChange={setGrouped} />
          <ToggleControl label="leadingIcon" value={hasLeading}  onChange={setHasLeading} />
          <ToggleControl label="option icons" value={withIcons}  onChange={setWithIcons} />
          <ToggleControl label="option descriptions" value={withDesc} onChange={setWithDesc} />
        </div>

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
  size, label, required, placeholder, helper,
  errorMessage, warningMessage, successMessage,
  disabled, loading, hasLeading, count, grouped, withIcons, withDesc,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: SelectSize;
  label: string;
  required: boolean;
  placeholder: string;
  helper: string;
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
  disabled: boolean;
  loading: boolean;
  hasLeading: boolean;
  count: number;
  grouped: boolean;
  withIcons: boolean;
  withDesc: boolean;
}) {
  const attrs: string[] = [];
  if (s.size !== "md")       attrs.push(`size="${s.size}"`);
  if (s.label)               attrs.push(`label="${esc(s.label)}"`);
  if (s.required)            attrs.push("required");
  if (s.placeholder)         attrs.push(`placeholder="${esc(s.placeholder)}"`);
  if (s.hasLeading)          attrs.push("leadingIcon={<Stethoscope />}");
  attrs.push(`options={${s.grouped ? "groupedOptions" : "flatOptions"}${s.withIcons || s.withDesc ? "" : ""}}`);
  if (s.loading)             attrs.push("loading");
  if (s.disabled)            attrs.push("disabled");
  if (s.helper && !s.errorMessage && !s.warningMessage && !s.successMessage) {
    attrs.push(`helperText="${esc(s.helper)}"`);
  }
  if (s.errorMessage)   attrs.push(`errorMessage="${esc(s.errorMessage)}"`);
  if (s.warningMessage) attrs.push(`warningMessage="${esc(s.warningMessage)}"`);
  if (s.successMessage) attrs.push(`successMessage="${esc(s.successMessage)}"`);
  void s.count; void s.withIcons; void s.withDesc;

  return `<Select\n  ${attrs.join("\n  ")}\n/>`;
}

function esc(v: string) {
  return v.replace(/"/g, "\\\"");
}

/* ══════ Playground control primitives ══════════════════════════════ */

function SelectControl({
  label, value, options, onChange,
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
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
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
      />
    </label>
  );
}

function ToggleControl({
  label, value, onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
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
        cursor: "pointer",
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
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
  { name: "options",         type: "SelectOption[]",                                                       def: "—",       desc: "The option set — flat array. Groups are derived from option.group." },
  { name: "value",           type: "string",                                                               def: "—",       desc: "Controlled selected value." },
  { name: "defaultValue",    type: "string",                                                               def: "—",       desc: "Uncontrolled initial selected value." },
  { name: "onChange",        type: "(value, option) => void",                                              def: "—",       desc: "Called with the new value and full option object on selection." },
  { name: "placeholder",     type: "string",                                                               def: "'Select…'", desc: "Text shown in the trigger when no value is selected." },
  { name: "size",            type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",                                     def: "'md'",    desc: "Trigger height ladder — matches Button and Input." },
  { name: "label",           type: "ReactNode",                                                            def: "—",       desc: "Visible label, aria-labelledby-linked to the trigger." },
  { name: "optional",        type: "boolean",                                                              def: "false",   desc: "Show '(Optional)' next to the label. Ignored when required." },
  { name: "required",        type: "boolean",                                                              def: "false",   desc: "aria-required + red asterisk in the label." },
  { name: "helperText",      type: "ReactNode",                                                            def: "—",       desc: "Guidance under the trigger. Suppressed while a validation message is present." },
  { name: "errorMessage",    type: "ReactNode",                                                            def: "—",       desc: "Sets state='error', role='alert', aria-invalid=true." },
  { name: "warningMessage",  type: "ReactNode",                                                            def: "—",       desc: "Sets state='warning'. No aria-invalid." },
  { name: "successMessage",  type: "ReactNode",                                                            def: "—",       desc: "Sets state='success' for confirmations that need to persist." },
  { name: "validation",      type: "'error' | 'warning' | 'success'",                                      def: "—",       desc: "Explicit visual state without a message. Overridden by any message prop." },
  { name: "leadingIcon",     type: "ReactNode",                                                            def: "—",       desc: "Decorative icon inside the trigger before the value." },
  { name: "loading",         type: "boolean",                                                              def: "false",   desc: "Shows a spinner in place of the chevron. aria-busy=true." },
  { name: "disabled",        type: "boolean",                                                              def: "false",   desc: "Muted trigger, not focusable, popup cannot open." },
  { name: "fullWidth",       type: "boolean",                                                              def: "true",    desc: "Grow the trigger to fill the parent width." },
  { name: "emptyStateMessage", type: "ReactNode",                                                          def: "'No options'", desc: "Shown inside the popup when options is empty." },
  { name: "open",            type: "boolean",                                                              def: "—",       desc: "Controlled open state. Pair with onOpenChange." },
  { name: "onOpenChange",    type: "(open: boolean) => void",                                              def: "—",       desc: "Called when the popup opens or closes." },
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
        <div style={{ display: "grid", gridTemplateColumns: "170px 1.4fr 110px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "170px 1.4fr 110px 2fr",
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
    { role: "Trigger radius",   alias: "aliases.radius.control (xs uses radius.4) — same as Input" },
    { role: "Trigger motion",   alias: "aliases.motion.hoverIn (matches Button + Input)" },
    { role: "Focus ring",       alias: "aliases.color.border.focus (matches Button + Input)" },
    { role: "Trigger rest",     alias: "aliases.color.background.default / border.default / text.primary" },
    { role: "Trigger hover",    alias: "aliases.color.border.strong" },
    { role: "Trigger open",     alias: "same treatment as focus — brand outline stays pinned" },
    { role: "Trigger disabled", alias: "aliases.color.background.subtle / border.subtle / text.disabled" },
    { role: "Trigger error",    alias: "aliases.color.status.error.fg (border, message, icon)" },
    { role: "Trigger warning",  alias: "aliases.color.status.warning.fg (border, message, icon)" },
    { role: "Trigger success",  alias: "aliases.color.status.success.fg (border, message, icon)" },
    { role: "Placeholder",      alias: "aliases.color.text.tertiary" },
    { role: "Popup background", alias: "aliases.color.background.elevated" },
    { role: "Popup border",     alias: "aliases.color.border.default" },
    { role: "Popup elevation",  alias: "aliases.elevation.popover" },
    { role: "Popup radius",     alias: "aliases.radius.control" },
    { role: "Popup enter motion", alias: "aliases.motion.overlayEnter" },
    { role: "Option rest",      alias: "transparent + text.primary" },
    { role: "Option active",    alias: "aliases.color.background.subtle" },
    { role: "Option selected",  alias: "aliases.color.background.subtle + action.primary check" },
    { role: "Option disabled",  alias: "aliases.color.text.disabled" },
    { role: "Group header",     alias: "typography.label + text.tertiary" },
    { role: "Typography",       alias: "caption (xs / sm) · bodyS (md) · body (lg) · bodyL (xl)" },
    { role: "Spacing",          alias: "spacing.inline.xs → inline.lg (matches Input padding)" },
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
          { tone: "note", text: "The component's CSS lives at Select.css and references CSS custom properties from tokens/css/variables.css. Importing Select pulls both in." },
          { tone: "note", text: "Keyboard nav uses the ARIA Authoring Practices Select-only Combobox pattern: role='combobox' on the trigger, aria-activedescendant instead of moving DOM focus. No focus trap, no roving tabindex." },
          { tone: "note", text: "The popup is portal-less — absolute-positioned under a position:relative anchor. It flips above when there's insufficient room below. If a consumer places a Select inside an overflow-hidden ancestor, a follow-up portal-based version will be added." },
          { tone: "note", text: "The trigger deliberately duplicates a subset of Input frame CSS (same tokens, same values) rather than sharing selectors. This lets Select evolve independently while staying pixel-aligned today." },
          { tone: "note", text: "Combobox, Multi Select, User Picker, and Command Palette should reuse .hc-select-popup, .hc-select-listbox, .hc-select-group, and .hc-select-option classes as-is. Only the trigger and selection model change." },
        ]}
      />

      <Callout tone="info" title="Extending the family">
        (1) Combobox — reuse the trigger shell but swap the value span for an
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          &lt;input&gt;
        </code>
        that also drives filtering. (2) Multi Select — reuse the popup and option classes; add
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          aria-multiselectable
        </code>
        to the listbox and render selected chips in the trigger. (3) User Picker — same shell as Combobox, options carry avatar + email. (4) Command Palette — same popup and option shell, mounted globally with Cmd-K.
      </Callout>
    </DocBlock>
  );
}
