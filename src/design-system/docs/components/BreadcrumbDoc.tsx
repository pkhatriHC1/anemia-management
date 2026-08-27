import { useState } from "react";
import type { ReactNode } from "react";
import {
  Home,
  Users,
  Shield,
  BarChart2,
  FileText,
  Settings as SettingsIcon,
  Slash,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Breadcrumb, type BreadcrumbItemData } from "../../components/breadcrumb";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  Checklist,
  t,
} from "../standards/_shared";

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function BreadcrumbDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <A11yBlock />
      <CollapsedBlock />
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
      title="The canonical HC1 Breadcrumb"
      lead="Breadcrumb is the canonical hierarchical-location component of HC1. Every page that lives more than one level deep in the information architecture — Patient Details, Reports, Settings, Administration, Analytics, and every multi-level detail page across every HC1 IQ module — shows its ancestry via this Breadcrumb. Breadcrumb communicates hierarchy; it is never the primary navigation."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Compose Breadcrumb → List → Item → Link | Current + Separator, or pass the items shorthand. The root is a semantic <nav aria-label>; the list is an <ol>; the current crumb is a <span aria-current='page'> — the shape assistive tech expects."
    >
      <div
        style={{
          padding: t.space.inline.xl,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#patients">Patients</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Current>John Smith</Breadcrumb.Current>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Breadcrumb"           desc="Root. Renders <nav aria-label='Breadcrumb'>. Supports composed children OR the items shorthand for the common data-shape path." />
        <Part name="Breadcrumb.List"      desc="An <ol> — ordered because breadcrumbs communicate a directional path from root to current page." />
        <Part name="Breadcrumb.Item"      desc="An <li> for one crumb. Wraps a Link OR a Current — one or the other, never both." />
        <Part name="Breadcrumb.Link"      desc="A real <a> anchor. When disabled, renders as a <span aria-disabled='true'> so keyboard users can't tab into an inert link." />
        <Part name="Breadcrumb.Separator" desc="An <li aria-hidden='true' role='presentation'> so screen readers skip it. Defaults to a right-caret; pass children to override." />
        <Part name="Breadcrumb.Current"   desc="A <span aria-current='page'> for the terminal crumb. Screen readers announce 'current page'." />
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

/* ══════ Composition ══════════════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition"
      lead="Two equivalent shapes. Use the shorthand for router-generated paths; compose children when a crumb has custom content (a tooltip, a badge, a menu, etc.)."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <ExampleTile title="Shorthand — items prop">
          <Breadcrumb
            items={[
              { label: "Reports", href: "#reports", icon: <FileText size={14} /> },
              { label: "Monthly", href: "#monthly" },
              { label: "August 2026" },
            ]}
          />
          <PreBlock>{`<Breadcrumb
  items={[
    { label: "Reports",     href: "#reports", icon: <FileText/> },
    { label: "Monthly",     href: "#monthly" },
    { label: "August 2026" },  // last item → current page
  ]}
/>`}</PreBlock>
        </ExampleTile>

        <ExampleTile title="Composed children">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#reports" icon={<FileText size={14} />}>Reports</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#monthly">Monthly</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Current>August 2026</Breadcrumb.Current>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <PreBlock>{`<Breadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#reports">Reports</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#monthly">Monthly</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Current>August 2026</Breadcrumb.Current>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>`}</PreBlock>
        </ExampleTile>
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note", text: "Both shapes render identical DOM — same <nav>, same <ol>, same <li>, same <a>. The shorthand is a convenience for the 95% case; composition is for when a crumb needs bespoke content." },
            { tone: "note", text: "The LAST item in the items shorthand is always the current page. It renders via Breadcrumb.Current with aria-current='page' — never as a link, even if you provide an href (the href is ignored on the last item)." },
            { tone: "note", text: "Composed children win over items. If both are passed, items is ignored." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Accessibility ════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Root is a semantic <nav aria-label='Breadcrumb'>. Assistive tech treats the strip as a landmark; the label distinguishes it from other navigation regions on the page." },
          { tone: "must", text: "List is an <ol> — the order matters (root → current), and screen readers announce list position (\"3 of 4\") which reinforces depth." },
          { tone: "must", text: "The current page uses <span aria-current='page'> — announced as \"current page\" by every mainstream screen reader." },
          { tone: "must", text: "Separators are <li aria-hidden='true' role='presentation'> so they don't get announced as list items — the user hears the labels, not the punctuation." },
          { tone: "must", text: "Disabled links render as <span aria-disabled='true'> instead of <a> — native anchors have no disabled attribute, and an inert but tabbable anchor traps keyboard users." },
          { tone: "must", text: "Focus ring on every link is 2px brand outline with outline-offset — same ring shared with Button, Input, Card. Visible, non-shifting." },
          { tone: "must", text: "The collapsed-path ellipsis (used by the items shorthand when maxItems is exceeded) opens a Popover — inheriting Popover's Escape / outside-click / focus-move behavior." },
          { tone: "must-not", text: "Never use Breadcrumb as primary navigation. It's a location indicator, not a top-level nav. Primary navigation lives in the Sidebar or NavigationMenu (future)." },
          { tone: "must-not", text: "Never omit the label prop. The label distinguishes multiple <nav> landmarks on the same page — an unlabelled Breadcrumb reads as a generic nav." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Collapsed paths ══════════════════════════════════════════ */

function CollapsedBlock() {
  const longPath: BreadcrumbItemData[] = [
    { label: "Home",           href: "#home", icon: <Home size={14} /> },
    { label: "Administration", href: "#admin" },
    { label: "Organizations",  href: "#orgs" },
    { label: "HC1 Health",     href: "#org" },
    { label: "Users",          href: "#users" },
    { label: "Puja Patel" },
  ];
  return (
    <DocBlock
      title="Collapsed paths"
      lead="Long paths overflow single-line strips. Pass maxItems={N} to keep the first crumb, an ellipsis, and the last N-1 crumbs. Clicking the ellipsis opens a Popover listing the hidden ancestors."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: t.space.inline.md,
        }}
      >
        <ExampleTile title="Full path (6 crumbs)">
          <Breadcrumb items={longPath} />
        </ExampleTile>

        <ExampleTile title="Collapsed to maxItems={4}">
          <Breadcrumb items={longPath} maxItems={4} />
          <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>
            Click the ellipsis to reveal the hidden crumbs.
          </div>
        </ExampleTile>
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note", text: "The ellipsis reveal reuses the Popover primitive — anchor, portal, focus, and dismissal all come from there." },
            { tone: "note", text: "Collapse rule: keep index 0 + inject the ellipsis + keep the last (maxItems - 1) items. Under the threshold the strip renders in full." },
            { tone: "note", text: "Collapse applies only to the items shorthand. Composed children render exactly as authored — the consumer owns collapse logic." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

/* ══════ Best practices ═══════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Reflect the real hierarchy",         description: "The path in the crumb strip must match the site's information architecture. If Patients → John Smith is what the URL is, that's what the crumb reads." },
          { title: "Keep paths concise",                 description: "3-5 crumbs is comfortable; more than 6 should collapse via maxItems. If your IA is 8 levels deep, question the IA before styling the crumb." },
          { title: "Truncate long labels, not the path", description: "A single long label (patient name, report title) truncates with ellipsis; the crumb chain stays intact. The current crumb has a 320px max-width; links max at 220px." },
          { title: "Use icons sparingly",                description: "One home icon at the root, or an icon on a status-heavy category. Icons on every crumb clutter the strip." },
        ]}
        donts={[
          { title: "Breadcrumb as primary nav",          description: "Breadcrumb is a location indicator, not top-level navigation. Primary nav lives in the sidebar or NavigationMenu." },
          { title: "Missing current page",               description: "The last crumb is ALWAYS the current page — rendered via Breadcrumb.Current with aria-current='page'. Never render it as a link." },
          { title: "Custom separators mid-path",         description: "Pick one separator per surface (caret, slash, arrow) and use it consistently. Mixing separators inside a single crumb strip is disorienting." },
          { title: "Interactive icons inside crumbs",    description: "Icons are decorative in a breadcrumb — never wrap them in their own click target inside a crumb. If an action belongs there, put it beside the strip." },
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
          { tone: "must-not", text: "Don't make the current crumb a link. It has nowhere to go — the user is already there. Rendering it as a link is a broken affordance and breaks aria-current." },
          { tone: "must-not", text: "Don't reproduce the page title in the last crumb only to repeat it as the H1 on the page. The crumb is chrome; the page title is content — either the labels differ (crumb = short, H1 = full), or the last crumb IS the page title." },
          { tone: "must-not", text: "Don't stack multiple Breadcrumb components on the same page. There is exactly one location strip per page; multiple confuse the landmark." },
          { tone: "must-not", text: "Don't animate crumb entries. The crumb strip is chrome; motion pulls the eye away from real content." },
          { tone: "must-not", text: "Don't use Breadcrumb inside a Dialog or Popover. Those surfaces are focused tasks — location context lives on the page beneath, not inside the overlay." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ═══════════════════════════════════════════════ */

type SeparatorKind = "caret" | "slash" | "arrow" | "dot";

function PlaygroundBlock() {
  const [separator, setSeparator]   = useState<SeparatorKind>("caret");
  const [collapsed, setCollapsed]   = useState(false);
  const [maxItems, setMaxItems]     = useState(4);
  const [icons, setIcons]           = useState(true);
  const [longPath, setLongPath]     = useState(false);
  const [currentDisabled, setCurrentDisabled] = useState(false);
  const [disabledMiddle, setDisabledMiddle]   = useState(false);

  const base: BreadcrumbItemData[] = longPath
    ? [
        { label: "Home",           href: "#home", icon: icons ? <Home size={14} /> : undefined },
        { label: "Administration", href: "#admin", icon: icons ? <Shield size={14} /> : undefined },
        { label: "Organizations",  href: "#orgs",  disabled: disabledMiddle },
        { label: "HC1 Health",     href: "#org" },
        { label: "Users",          href: "#users" },
        { label: currentDisabled ? "(no current)" : "Puja Patel" },
      ]
    : [
        { label: "Patients", href: "#patients", icon: icons ? <Users size={14} /> : undefined },
        { label: "John Smith" },
      ];

  const separatorNode = separatorFor(separator);

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered Breadcrumb in real time.">
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
            justifyContent: "flex-start",
            alignItems: "center",
            minHeight: 100,
          }}
        >
          <Breadcrumb
            items={base}
            separator={separatorNode}
            maxItems={collapsed ? maxItems : undefined}
          />
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="separator" value={separator} options={["caret", "slash", "arrow", "dot"]} onChange={(v) => setSeparator(v as SeparatorKind)} />
          <ToggleControl label="collapsed"        value={collapsed}       onChange={setCollapsed} />
          <NumberControl label="maxItems"         value={maxItems} min={2} max={6} onChange={setMaxItems} />
          <ToggleControl label="icons"            value={icons}           onChange={setIcons} />
          <ToggleControl label="long path"        value={longPath}        onChange={setLongPath} />
          <ToggleControl label="disable middle"   value={disabledMiddle}  onChange={setDisabledMiddle} />
          <ToggleControl label="hide current"     value={currentDisabled} onChange={setCurrentDisabled} />
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
{renderCode({ items: base, separator, collapsed, maxItems })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function separatorFor(kind: SeparatorKind): ReactNode {
  if (kind === "slash")   return <Slash size={12} />;
  if (kind === "arrow")   return <ArrowRight size={12} />;
  if (kind === "dot")     return <span aria-hidden="true">·</span>;
  return <ChevronRight size={14} />;
}

function renderCode(s: { items: BreadcrumbItemData[]; separator: SeparatorKind; collapsed: boolean; maxItems: number }) {
  const attrs: string[] = [];
  if (s.separator !== "caret") attrs.push(`separator={<${labelFor(s.separator)}/>}`);
  if (s.collapsed)             attrs.push(`maxItems={${s.maxItems}}`);
  const opening = attrs.length > 0
    ? `<Breadcrumb\n  items={items}\n  ${attrs.join("\n  ")}\n/>`
    : `<Breadcrumb items={items} />`;
  return opening;
}

function labelFor(kind: SeparatorKind): string {
  if (kind === "slash") return "Slash";
  if (kind === "arrow") return "ArrowRight";
  if (kind === "dot")   return `span aria-hidden='true'>·</span`;
  return "ChevronRight";
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Five sketches of how downstream surfaces compose Breadcrumb. Illustrative — none shipped as reusable business components."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: t.space.inline.md }}>
        <ExampleTile title="Patients → John Smith" icon={<Users size={16} color={t.color.action.primary} />}>
          <Breadcrumb
            items={[
              { label: "Patients", href: "#patients", icon: <Users size={14} /> },
              { label: "John Smith" },
            ]}
          />
        </ExampleTile>

        <ExampleTile title="Settings → Users → Roles" icon={<SettingsIcon size={16} color={t.color.action.primary} />}>
          <Breadcrumb
            items={[
              { label: "Settings", href: "#settings", icon: <SettingsIcon size={14} /> },
              { label: "Users",    href: "#settings/users" },
              { label: "Roles" },
            ]}
          />
        </ExampleTile>

        <ExampleTile title="Reports → Monthly Report" icon={<FileText size={16} color={t.color.action.primary} />}>
          <Breadcrumb
            items={[
              { label: "Reports",         href: "#reports", icon: <FileText size={14} /> },
              { label: "Monthly Report" },
            ]}
          />
        </ExampleTile>

        <ExampleTile title="Analytics → Dashboard" icon={<BarChart2 size={16} color={t.color.action.primary} />}>
          <Breadcrumb
            items={[
              { label: "Analytics", href: "#analytics", icon: <BarChart2 size={14} /> },
              { label: "Dashboard" },
            ]}
          />
        </ExampleTile>

        <ExampleTile title="Administration → Permissions" icon={<Shield size={16} color={t.color.action.primary} />}>
          <Breadcrumb
            items={[
              { label: "Administration", href: "#admin", icon: <Shield size={14} /> },
              { label: "Permissions" },
            ]}
          />
        </ExampleTile>
      </div>
    </DocBlock>
  );
}

function ExampleTile({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
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

function PreBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: t.space.inline.md,
        background: t.color.background.subtle,
        borderRadius: t.radius.control,
        fontFamily: t.font.mono,
        fontSize: 12,
        lineHeight: 1.6,
        color: t.color.text.primary,
        overflowX: "auto",
      }}
    >
      {children}
    </pre>
  );
}

/* ══════ Control primitives ═══════════════════════════════════════ */

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

const PROPS_ROOT: PropRow[] = [
  { name: "label",     type: "string",              def: "'Breadcrumb'", desc: "Accessible name for the <nav> landmark." },
  { name: "items",     type: "BreadcrumbItemData[]", def: "—",           desc: "Shorthand data path. Last item is the current page. Ignored when children are composed." },
  { name: "separator", type: "ReactNode",           def: "<Caret/>",     desc: "Custom separator applied to the items shorthand. Composed usage renders its own <Breadcrumb.Separator> slots." },
  { name: "maxItems",  type: "number",              def: "—",            desc: "Collapse paths longer than this. Keeps the first item + ellipsis + last (maxItems - 1) items. Ellipsis opens a Popover of hidden crumbs." },
  { name: "children",  type: "ReactNode",           def: "—",            desc: "Compose Breadcrumb.List directly. Wins over items when both are supplied." },
];

const PROPS_LIST: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "Breadcrumb.Item + Breadcrumb.Separator slots." },
];

const PROPS_ITEM: PropRow[] = [
  { name: "children", type: "ReactNode", def: "—", desc: "One Link OR one Current — never both." },
];

const PROPS_LINK: PropRow[] = [
  { name: "href",     type: "string",   def: "—",    desc: "Destination. Omit for a non-navigable label (rare — use Current instead)." },
  { name: "disabled", type: "boolean",  def: "false",desc: "Disables interaction and renders as a <span aria-disabled='true'>." },
  { name: "icon",     type: "ReactNode",def: "—",    desc: "Optional icon before the label." },
  { name: "children", type: "ReactNode",def: "—",    desc: "The label." },
];

const PROPS_SEPARATOR: PropRow[] = [
  { name: "children", type: "ReactNode", def: "<Caret/>", desc: "Override the default caret with any node (slash, arrow, dot, etc.)." },
];

const PROPS_CURRENT: PropRow[] = [
  { name: "icon",     type: "ReactNode", def: "—", desc: "Optional icon before the label." },
  { name: "children", type: "ReactNode", def: "—", desc: "The current page label." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Breadcrumb"           rows={PROPS_ROOT} />
      <PropsSubsection title="Breadcrumb.List"      rows={PROPS_LIST} />
      <PropsSubsection title="Breadcrumb.Item"      rows={PROPS_ITEM} />
      <PropsSubsection title="Breadcrumb.Link"      rows={PROPS_LINK} />
      <PropsSubsection title="Breadcrumb.Separator" rows={PROPS_SEPARATOR} />
      <PropsSubsection title="Breadcrumb.Current"   rows={PROPS_CURRENT} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        All slots forward standard HTML attributes (className, style, data-*) to their underlying element.
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
        <div style={{ display: "grid", gridTemplateColumns: "180px 1.4fr 120px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "180px 1.4fr 120px 2fr",
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
    { role: "Root typography",           alias: "aliases.typography.bodyS (14/20 · regular) — chrome, never competes with the page title beneath" },
    { role: "Link colour (rest)",        alias: "aliases.color.text.secondary — chrome ink" },
    { role: "Link colour (hover)",       alias: "aliases.color.text.primary + underline" },
    { role: "Link colour (focus)",       alias: "aliases.color.text.link — brand ink so ring + colour together read as focused" },
    { role: "Link colour (current)",     alias: "aliases.color.text.primary + medium weight — destination, not another link" },
    { role: "Link colour (disabled)",    alias: "aliases.color.text.disabled — muted, cursor: not-allowed" },
    { role: "Separator colour",          alias: "aliases.color.text.tertiary — labels read first, separators second" },
    { role: "Row height",                alias: "28 — matches sm Button so mixed rows sit flush" },
    { role: "Padding + gap",             alias: "aliases.spacing.inline.xs (4) horizontal / 2 vertical / 4 gap between crumbs" },
    { role: "Link radius",               alias: "4 — same corner rounding on the interactive rectangle as focus ring / hover bg" },
    { role: "Focus ring",                alias: "2px aliases.color.border.focus with 2px outline-offset — shared with Button, Input, Card" },
    { role: "Motion",                    alias: "aliases.motion.hoverIn (150ms, standard) — colour transition only, no motion on the label" },
    { role: "Collapsed-path ellipsis",   alias: "composes Popover — the ellipsis is a Popover.Trigger, the hidden crumbs list is Popover.Content" },
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
          { tone: "note", text: "The items shorthand and composed children render IDENTICAL DOM — same <nav>, <ol>, <li>, <a>. Consumers can start with the shorthand and graduate to composition without changing the output shape." },
          { tone: "note", text: "Disabled links swap the element from <a> to <span> at render time. Native anchors have no disabled attribute, and an inert but tabbable anchor traps keyboard users. Doing the swap in the primitive means product code never has to think about it." },
          { tone: "note", text: "Separators live in the <ol> as <li aria-hidden='true' role='presentation'> — semantically hidden but structurally present so the flexbox rhythm stays uniform." },
          { tone: "note", text: "The default separator is a right-caret SVG inlined into the component. Consumers passing `separator={<Slash/>}` or another node replace the caret globally for that Breadcrumb (shorthand mode only)." },
          { tone: "note", text: "Long labels truncate: links max at 220px, the current crumb at 320px. Both use overflow: hidden + text-overflow: ellipsis + white-space: nowrap — cleaner than shrinking the whole strip." },
          { tone: "note", text: "The collapsed-path ellipsis is a Popover — anchor, portal, focus-into-content, Escape / outside-click dismissal all inherited. This is the first downstream component to prove Popover's foundation role." },
        ]}
      />

      <Callout tone="info" title="Composition with Popover">
        The ellipsis reveal for collapsed paths reuses the HC1 Popover primitive rather than reinventing the anchoring, portal, focus, and dismissal flow. If Popover ever changes — a new placement engine, a different focus contract — Breadcrumb picks the change up for free. Do not fork this ellipsis behavior into a bespoke floating menu.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 Link colour ladder",  detail: "Rest / hover / focus / disabled colours inherit from the same aliases used by any inline link (color.text.secondary → primary → link → disabled). Retinting Link retints Breadcrumb too." },
    { name: "HC1 Button focus ring",   detail: "2px brand outline with 2px outline-offset — the same ring shared with Button, Input, Card. Visible without shifting layout." },
    { name: "HC1 Popover",             detail: "The collapsed-path ellipsis is a Popover — anchoring, portal, focus, and dismissal all inherited. Breadcrumb never re-implements floating surface logic." },
    { name: "HC1 design tokens",       detail: "Every colour, spacing, radius, motion, and typography value is a token alias — no hex, no raw pixels for colour, no bespoke shadows." },
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
    { name: "Patient Details",   detail: "Every patient detail page shows Patients → {patient name} at the top so the user knows where they are in the patient hierarchy." },
    { name: "Reports",           detail: "Multi-level report drill-downs: Reports → Monthly → August 2026. The crumb communicates the level, the page title carries the report name." },
    { name: "Settings",          detail: "Every settings subpage: Settings → Users → Roles, Settings → Billing → Invoices, etc. Breadcrumb is the primary way settings users navigate back up the tree." },
    { name: "Administration",    detail: "Multi-level admin flows: Administration → Organizations → HC1 Health → Permissions." },
    { name: "Analytics",         detail: "Analytics dashboards drilled into a specific metric: Analytics → Dashboard → Recovery Rate." },
    { name: "Multi-level detail pages", detail: "Any HC1 IQ module page whose IA depth is > 1 — the crumb communicates ancestry uniformly across products." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every multi-level page in HC1 will show a Breadcrumb. These are the anticipated consumers; none ship as reusable business components — each product composes the primitive directly."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any current breadcrumb-like strip at the top of a detail page — swap to Breadcrumb so aria + focus + colour behave uniformly." },
    { area: "ClinicalIQ · HerCare",     detail: "Care-plan detail pages and referral drill-downs — adopt Breadcrumb; drop bespoke chevron implementations." },
    { area: "ClinicalIQ · Starter",     detail: "Any prototype location strips currently rendered as a Text row with slashes — sweep to the canonical primitive." },
    { area: "SourceIQ",                 detail: "Existing breadcrumb surfaces — adopt the shared tokens + primitive so tone and geometry stay consistent across products." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce bespoke breadcrumb behavior. Compose Breadcrumb from day one so nav landmark, ordered list semantics, and current-page ARIA all work uniformly." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Breadcrumb replaces existing implementations. Standardize behavior — do not redesign navigation."
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
          { text: "Accessible — <nav aria-label>, <ol> semantics, aria-current='page' on Current, aria-hidden separators, aria-disabled on disabled links" },
          { text: "Keyboard supported — every link is a real focusable anchor with a visible focus ring" },
          { text: "Composition-first API — Breadcrumb + List + Item + Link + Current + Separator" },
          { text: "Convenience shorthand — pass items[] for the common data-shape path" },
          { text: "Custom separators — caret (default) / slash / arrow / dot / any node" },
          { text: "Icons — leading icons on Link and Current" },
          { text: "Long paths — links truncate at 220px, current at 320px" },
          { text: "Collapsed paths — maxItems={N} collapses to first + ellipsis + last (N-1); ellipsis reveals hidden crumbs via Popover" },
          { text: "Reuses Popover primitive — no bespoke floating surface logic" },
          { text: "Production ready — items + composed children render identical DOM" },
        ]}
      />
    </DocBlock>
  );
}
