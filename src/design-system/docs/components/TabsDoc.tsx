import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Tabs } from "../../components/tabs";
import type { TabsSize } from "../../components/tabs";
import { Badge } from "../../components/badge";
import { Card } from "../../components/card";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: TabsSize[] = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function TabsDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <VariantsBlock />
      <SizesBlock />
      <FeaturesBlock />
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
      <MigrationTargetsBlock />
      <ComponentStatusBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Tabs"
      lead="Tabs is the canonical section-navigation primitive of the HC1 design system. Dashboard tabs, settings tabs, profile tabs, analytics tabs, and detail tabs all compose this Tabs rather than reimplementing the roving-tabindex model or the underline treatment. It owns the ARIA wiring, the keyboard model, and the size ladder — so a tab strip in one product reads and behaves exactly like a tab strip in another."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. Tabs and Panels find each other by matching `value` — the root wires the ARIA relationship for you."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <Tabs defaultValue="overview" ariaLabel="Anatomy example">
          <Tabs.List>
            <Tabs.Tab value="overview" icon={<Home />}>Overview</Tabs.Tab>
            <Tabs.Tab value="analytics" icon={<BarChart3 />} badge={<Badge variant="primary" count={3} size="sm" />}>Analytics</Tabs.Tab>
            <Tabs.Tab value="settings" icon={<Settings />}>Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel value="overview">The Overview panel — mounted only while its tab is active.</Tabs.Panel>
            <Tabs.Panel value="analytics">The Analytics panel — mounts on selection.</Tabs.Panel>
            <Tabs.Panel value="settings">The Settings panel — mounts on selection.</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Tabs"        desc="Root wrapper. Owns active-value state (controlled + uncontrolled), size, and the shared aria id prefix." />
        <Part name="Tabs.List"   desc="<div role='tablist'>. Hosts the keyboard model (arrow / Home / End) and horizontal-scroll fallback." />
        <Part name="Tabs.Tab"    desc="<button role='tab'>. Roving tabindex; auto-wires aria-selected + aria-controls. Icon + badge slots." />
        <Part name="Tabs.Panels" desc="Panel container. Compositional — no props beyond standard HTML." />
        <Part name="Tabs.Panel"  desc="<div role='tabpanel'>. Renders when active; auto-wires aria-labelledby to its tab. Set keepMounted for expensive panels." />
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

/* ══════ Composition ═══════════════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition"
      lead="Tabs is a compound component. Prefer composing named subcomponents over configuring booleans."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel value="overview">…</Tabs.Panel>
    <Tabs.Panel value="analytics">…</Tabs.Panel>
    <Tabs.Panel value="settings">…</Tabs.Panel>
  </Tabs.Panels>
</Tabs>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<Tabs
  items={[
    { label: "Overview", key: "overview", content: <Overview /> },
    { label: "Analytics", key: "analytics", content: <Analytics /> },
  ]}
  showBadges
  showIcons
  variant="underline"
  defaultActive="overview"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Every Tabs.Tab needs a `value`; every Tabs.Panel needs a matching `value`. The root uses these to wire aria-controls + aria-labelledby." },
          { tone: "should",   text: "Order matters — Tabs.List always precedes Tabs.Panels. Panel content is the tab's payload, not a sidebar." },
          { tone: "must-not", text: "Never introduce a `columns` / `items` / `tabs` array prop. Tabs are Tabs.Tab elements the consumer authors — the whole point of a compound API." },
          { tone: "must-not", text: "Never render a Tab outside of Tabs.List — it loses the roving tabindex and its focus ring won't overlap the list's bottom border correctly." },
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

/* ══════ Variants ═════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="One selection style — the brand underline. HC1 tabs deliberately do not ship a pill / segmented / vertical variant; those are separate primitives (Segmented Control, Sidebar Navigation) with different interaction models."
    >
      <Callout tone="info" title="Why only one variant?">
        Underline tabs are the strongest signal for "you are inside a section
        of one surface". A segmented control implies mutually exclusive
        selection at the same level; a vertical rail implies top-level
        navigation. Reserving each visual for its own primitive keeps the
        meaning clean — every underline strip means the same thing across
        every HC1 product.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Sizes ════════════════════════════════════════════════════ */

function SizesBlock() {
  const SIZE_META: Record<TabsSize, { label: string; height: string; usage: string }> = {
    sm: { label: "Small",  height: "32px", usage: "Dense surfaces — inside Cards, side panels, secondary contexts." },
    md: { label: "Medium", height: "40px", usage: "Default. Dashboards, detail pages, settings screens." },
    lg: { label: "Large",  height: "48px", usage: "Marketing-adjacent pages, spacious layouts, primary landing sections." },
  };
  return (
    <DocBlock
      title="Sizes"
      lead="Three steps. Heights sit +4 above the matching Button (sm=28→32, md=36→40, lg=44→48) so a 2px selection underline fits inside without cramping the label."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        {SIZES.map((s) => (
          <div key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, marginBottom: t.space.stack.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                size=&quot;{s}&quot;
              </code>
              <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{SIZE_META[s].height} — {SIZE_META[s].usage}</span>
            </div>
            <Tabs size={s} defaultValue="overview" ariaLabel={`${SIZE_META[s].label} example`}>
              <Tabs.List>
                <Tabs.Tab value="overview" icon={<Home />}>Overview</Tabs.Tab>
                <Tabs.Tab value="analytics" icon={<BarChart3 />}>Analytics</Tabs.Tab>
                <Tabs.Tab value="settings" icon={<Settings />}>Settings</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ═════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock title="Features">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Icons" hint="icon">
          <Tabs defaultValue="overview" ariaLabel="Icons">
            <Tabs.List>
              <Tabs.Tab value="overview"  icon={<Home />}>Overview</Tabs.Tab>
              <Tabs.Tab value="analytics" icon={<BarChart3 />}>Analytics</Tabs.Tab>
              <Tabs.Tab value="settings"  icon={<Settings />}>Settings</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </FeatureTile>

        <FeatureTile title="Badges" hint="badge">
          <Tabs defaultValue="inbox" ariaLabel="Badges">
            <Tabs.List>
              <Tabs.Tab value="inbox"   badge={<Badge variant="primary" appearance="solid" count={12} size="sm" />}>Inbox</Tabs.Tab>
              <Tabs.Tab value="alerts"  badge={<Badge variant="danger" appearance="solid" count={2} size="sm" />}>Alerts</Tabs.Tab>
              <Tabs.Tab value="drafts"  badge={<Badge variant="neutral" size="sm" count={9} />}>Drafts</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </FeatureTile>

        <FeatureTile title="Disabled tabs" hint="disabled">
          <Tabs defaultValue="overview" ariaLabel="Disabled">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
              <Tabs.Tab value="reports" disabled>Reports (soon)</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </FeatureTile>

        <FeatureTile title="Scrollable" hint="scrollable (default)">
          <Tabs defaultValue="t1" ariaLabel="Scrollable">
            <Tabs.List>
              <Tabs.Tab value="t1">Overview</Tabs.Tab>
              <Tabs.Tab value="t2">Analytics</Tabs.Tab>
              <Tabs.Tab value="t3">Patients</Tabs.Tab>
              <Tabs.Tab value="t4">Orders</Tabs.Tab>
              <Tabs.Tab value="t5">Inventory</Tabs.Tab>
              <Tabs.Tab value="t6">Reports</Tabs.Tab>
              <Tabs.Tab value="t7">Settings</Tabs.Tab>
              <Tabs.Tab value="t8">Notifications</Tabs.Tab>
              <Tabs.Tab value="t9">Integrations</Tabs.Tab>
              <Tabs.Tab value="t10">Billing</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: t.space.stack.sm }}>
            Overflowing tabs scroll horizontally; the scrollbar is hidden by design.
          </div>
        </FeatureTile>
      </div>
    </DocBlock>
  );
}

function FeatureTile({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
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
      {children}
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The list is a <div role='tablist'> with aria-orientation='horizontal'. Every tab is a real <button role='tab'>." },
          { tone: "must", text: "Selected tabs emit aria-selected='true'; unselected tabs emit aria-selected='false'." },
          { tone: "must", text: "Roving tabindex — the selected tab has tabIndex=0; unselected tabs have tabIndex=-1. Screen readers announce the tab strip as a single stop; arrow keys move between tabs inside it." },
          { tone: "must", text: "Every Tabs.Tab auto-wires aria-controls to the matching Tabs.Panel's id. Every Tabs.Panel auto-wires aria-labelledby back to its Tabs.Tab. Both ids are derived from React's useId + the tab's `value`." },
          { tone: "must", text: "Disabled tabs are natively disabled — screen readers announce the state, and the roving keyboard handler skips them." },
          { tone: "must", text: "Automatic activation — arrow / Home / End move focus AND fire onValueChange. This matches the WAI-ARIA authoring practice for tabs whose panels do not require an explicit confirmation." },
          { tone: "must", text: "Focus ring on the tab is the same 2px brand outline used across Button, Input, Select, Card, Dialog, Table, Badge, and Alert — cross-family consistency." },
          { tone: "must", text: "Active Tabs.Panel is focusable (tabIndex=0) so Tab-key traversal moves from the tab strip into the panel content in reading order." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the tab hover / underline transitions to 0ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard ═════════════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",           effect: "Move focus into or out of the tab strip. Inside the strip, focus lands on the selected tab." },
    { keys: "Shift+Tab",     effect: "Move focus backwards. Skips inside the tab strip — the whole strip is one stop." },
    { keys: "ArrowRight",    effect: "Move to the next enabled tab (wraps at the end). Automatically selects the new tab and fires onValueChange." },
    { keys: "ArrowLeft",     effect: "Move to the previous enabled tab (wraps at the start). Automatically selects + fires onValueChange." },
    { keys: "Home",          effect: "Jump to the first enabled tab and select it." },
    { keys: "End",           effect: "Jump to the last enabled tab and select it." },
    { keys: "Enter / Space", effect: "Activate the currently focused tab (no-op if arrow-key navigation already selected it — automatic activation is enabled)." },
  ];
  return (
    <DocBlock title="Keyboard interaction">
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
              gridTemplateColumns: "180px 1fr",
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
          { title: "Tabs switch between related views",  description: "Use Tabs when the panels are peers of one another — different views of the same resource, or different tools inside the same section." },
          { title: "Preserve context across selection",  description: "Panel content on tab B should not depend on transient state from tab A. If it does, the surfaces aren't peers — split them into separate pages." },
          { title: "Keep tab labels short and consistent", description: "One or two words. Every label should read at a similar length so the strip doesn't jog when a tab is selected." },
          { title: "Wire icons and badges only when they add information", description: "An icon that duplicates the label is noise. A badge with a count changes what the user reads first — earn it." },
        ]}
        donts={[
          { title: "Use Tabs for top-level navigation",   description: "Top-level nav belongs in a Sidebar or a Nav Bar. Tabs are for switching between peer views of one surface." },
          { title: "Use Tabs as a breadcrumb",            description: "Breadcrumbs represent hierarchy. Tabs represent peers. Different meaning, different primitive." },
          { title: "Nest a Tabs inside another Tabs",     description: "Two levels of tabs erode the 'one active view' contract. Restructure into a section header + a single tab strip." },
          { title: "Hide overflowing tabs behind a menu", description: "Users cannot see what's hidden. Let the strip scroll (the default) — or move the tail-end tabs into a submenu inside their own panel." },
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
          { tone: "must-not", text: "Don't manage the selected tab inside Tabs.List — it's owned by the root. Passing `value` and `onValueChange` is the controlled mode; passing `defaultValue` is the uncontrolled mode." },
          { tone: "must-not", text: "Don't render Tabs.Tab or Tabs.Panel outside of Tabs — the components throw a runtime error explaining what's missing." },
          { tone: "must-not", text: "Don't wire aria-controls, aria-selected, or tabIndex yourself. The primitive wires them via useId + the tab's `value`." },
          { tone: "must-not", text: "Don't rely on the browser's default focus outline. The Tab uses the shared 2px brand ring inset by 2px so it aligns with every other interactive primitive." },
          { tone: "must-not", text: "Don't ship a specialized DashboardTabs / SettingsTabs / AnalyticsTabs component that reimplements this Tabs. Compose Tabs with the surface's opinionated tab list; every visual choice lives here." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [size, setSize]             = useState<TabsSize>("md");
  const [icons, setIcons]           = useState(true);
  const [badges, setBadges]         = useState(true);
  const [disabledTab, setDisabled]  = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [controlled, setControlled] = useState(false);
  const [activeValue, setActiveValue] = useState("overview");

  const extras = scrollable
    ? [
        { value: "inventory",     label: "Inventory" },
        { value: "reports",       label: "Reports" },
        { value: "notifications", label: "Notifications" },
        { value: "integrations",  label: "Integrations" },
        { value: "billing",       label: "Billing" },
      ]
    : [];

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered Tabs in real time. Live JSX is generated in the dark panel at the bottom.">
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
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <Tabs
              size={size}
              ariaLabel="Playground"
              {...(controlled
                ? { value: activeValue, onValueChange: setActiveValue }
                : { defaultValue: "overview" })}
            >
              <Tabs.List>
                <Tabs.Tab value="overview" icon={icons ? <Home /> : undefined}>Overview</Tabs.Tab>
                <Tabs.Tab
                  value="analytics"
                  icon={icons ? <BarChart3 /> : undefined}
                  badge={badges ? <Badge variant="primary" appearance="solid" size="sm" count={3} /> : undefined}
                >
                  Analytics
                </Tabs.Tab>
                <Tabs.Tab
                  value="patients"
                  icon={icons ? <Users /> : undefined}
                  badge={badges ? <Badge variant="danger" appearance="solid" size="sm" count={12} /> : undefined}
                >
                  Patients
                </Tabs.Tab>
                <Tabs.Tab
                  value="settings"
                  icon={icons ? <Settings /> : undefined}
                  disabled={disabledTab}
                >
                  Settings
                </Tabs.Tab>
                {extras.map((e) => (
                  <Tabs.Tab key={e.value} value={e.value}>{e.label}</Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panels>
                <Tabs.Panel value="overview"><PanelBox>Overview panel content.</PanelBox></Tabs.Panel>
                <Tabs.Panel value="analytics"><PanelBox>Analytics panel content.</PanelBox></Tabs.Panel>
                <Tabs.Panel value="patients"><PanelBox>Patients panel content.</PanelBox></Tabs.Panel>
                <Tabs.Panel value="settings"><PanelBox>Settings panel content.</PanelBox></Tabs.Panel>
                {extras.map((e) => (
                  <Tabs.Panel key={e.value} value={e.value}><PanelBox>{e.label} panel content.</PanelBox></Tabs.Panel>
                ))}
              </Tabs.Panels>
            </Tabs>
            {controlled && (
              <div style={{ marginTop: t.space.stack.sm, ...t.type.caption, color: t.color.text.tertiary, fontFamily: t.font.mono }}>
                activeValue = &quot;{activeValue}&quot;
              </div>
            )}
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
          <SelectControl label="size" value={size} options={SIZES} onChange={(v) => setSize(v as TabsSize)} />
          <ToggleControl label="icons"         value={icons}       onChange={setIcons} />
          <ToggleControl label="badges"        value={badges}      onChange={setBadges} />
          <ToggleControl label="disabled tab"  value={disabledTab} onChange={setDisabled} />
          <ToggleControl label="scrollable"    value={scrollable}  onChange={setScrollable} />
          <ToggleControl label="controlled"    value={controlled}  onChange={setControlled} />
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
{renderCode({ size, icons, badges, disabledTab, scrollable, controlled })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function PanelBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        color: t.color.text.secondary,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function renderCode(s: {
  size: TabsSize;
  icons: boolean;
  badges: boolean;
  disabledTab: boolean;
  scrollable: boolean;
  controlled: boolean;
}) {
  const rootAttrs: string[] = [];
  if (s.size !== "md") rootAttrs.push(`size="${s.size}"`);
  rootAttrs.push(s.controlled ? `value={value}` : `defaultValue="overview"`);
  if (s.controlled) rootAttrs.push(`onValueChange={setValue}`);

  const lines: string[] = [];
  lines.push(`<Tabs ${rootAttrs.join(" ")}>`);
  lines.push(`  <Tabs.List>`);
  lines.push(`    <Tabs.Tab value="overview"${s.icons ? ` icon={<Home />}` : ""}>Overview</Tabs.Tab>`);
  const anaAttrs: string[] = [];
  if (s.icons)  anaAttrs.push(`icon={<BarChart3 />}`);
  if (s.badges) anaAttrs.push(`badge={<Badge variant="primary" appearance="solid" size="sm" count={3} />}`);
  lines.push(`    <Tabs.Tab value="analytics"${anaAttrs.length ? " " + anaAttrs.join(" ") : ""}>Analytics</Tabs.Tab>`);
  const patAttrs: string[] = [];
  if (s.icons)  patAttrs.push(`icon={<Users />}`);
  if (s.badges) patAttrs.push(`badge={<Badge variant="danger" appearance="solid" size="sm" count={12} />}`);
  lines.push(`    <Tabs.Tab value="patients"${patAttrs.length ? " " + patAttrs.join(" ") : ""}>Patients</Tabs.Tab>`);
  const setAttrs: string[] = [];
  if (s.icons)       setAttrs.push(`icon={<Settings />}`);
  if (s.disabledTab) setAttrs.push(`disabled`);
  lines.push(`    <Tabs.Tab value="settings"${setAttrs.length ? " " + setAttrs.join(" ") : ""}>Settings</Tabs.Tab>`);
  if (s.scrollable) {
    lines.push(`    <Tabs.Tab value="inventory">Inventory</Tabs.Tab>`);
    lines.push(`    …`);
  }
  lines.push(`  </Tabs.List>`);
  lines.push(`  <Tabs.Panels>`);
  lines.push(`    <Tabs.Panel value="overview">…</Tabs.Panel>`);
  lines.push(`    <Tabs.Panel value="analytics">…</Tabs.Panel>`);
  lines.push(`    <Tabs.Panel value="patients">…</Tabs.Panel>`);
  lines.push(`    <Tabs.Panel value="settings">…</Tabs.Panel>`);
  lines.push(`  </Tabs.Panels>`);
  lines.push(`</Tabs>`);
  return lines.join("\n");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Illustrative — not shipped as reusable components. Every example uses the same primitive with different composition."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        <ExampleShell title="Dashboard">
          <Tabs defaultValue="overview" ariaLabel="Dashboard">
            <Tabs.List>
              <Tabs.Tab value="overview" icon={<Home />}>Overview</Tabs.Tab>
              <Tabs.Tab value="analytics" icon={<BarChart3 />}>Analytics</Tabs.Tab>
              <Tabs.Tab value="reports" icon={<FileText />}>Reports</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel value="overview"><PanelStat label="Active patients" value="1,284" /></Tabs.Panel>
              <Tabs.Panel value="analytics"><PanelStat label="Trends" value="Up 4.2%" /></Tabs.Panel>
              <Tabs.Panel value="reports"><PanelStat label="Reports available" value="14" /></Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Analytics">
          <Tabs defaultValue="daily" size="sm" ariaLabel="Analytics">
            <Tabs.List>
              <Tabs.Tab value="daily">Daily</Tabs.Tab>
              <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
              <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
              <Tabs.Tab value="ytd">YTD</Tabs.Tab>
              <Tabs.Tab value="custom">Custom range</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Patients">
          <Tabs defaultValue="active" ariaLabel="Patients">
            <Tabs.List>
              <Tabs.Tab value="active"   badge={<Badge variant="primary" size="sm" count={284} />}>Active</Tabs.Tab>
              <Tabs.Tab value="pending"  badge={<Badge variant="warning" size="sm" count={12} />}>Pending</Tabs.Tab>
              <Tabs.Tab value="archived" badge={<Badge variant="neutral" size="sm" count={1024} maxCount={999} />}>Archived</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Orders">
          <Tabs defaultValue="open" ariaLabel="Orders">
            <Tabs.List>
              <Tabs.Tab value="open"     icon={<Package />}                                                       badge={<Badge variant="warning" appearance="solid" size="sm" count={42} />}>Open</Tabs.Tab>
              <Tabs.Tab value="shipped"  icon={<ArrowRight />}                                                    badge={<Badge variant="neutral" size="sm" count={128} />}>Shipped</Tabs.Tab>
              <Tabs.Tab value="canceled" icon={<Bell />}>Cancelled</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Settings">
          <Tabs defaultValue="account" ariaLabel="Settings">
            <Tabs.List>
              <Tabs.Tab value="account"     icon={<User />}>Account</Tabs.Tab>
              <Tabs.Tab value="preferences" icon={<Settings />}>Preferences</Tabs.Tab>
              <Tabs.Tab value="security"    icon={<ClipboardList />}>Security</Tabs.Tab>
              <Tabs.Tab value="billing"     icon={<FileText />} disabled>Billing (soon)</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Reports">
          <Tabs defaultValue="operational" size="lg" ariaLabel="Reports">
            <Tabs.List>
              <Tabs.Tab value="operational">Operational</Tabs.Tab>
              <Tabs.Tab value="financial">Financial</Tabs.Tab>
              <Tabs.Tab value="quality">Quality</Tabs.Tab>
              <Tabs.Tab value="compliance">Compliance</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </ExampleShell>

        <ExampleShell title="Profile">
          <Card>
            <Card.Content>
              <Tabs defaultValue="details" size="sm" ariaLabel="Profile">
                <Tabs.List>
                  <Tabs.Tab value="details"       icon={<User />}>Details</Tabs.Tab>
                  <Tabs.Tab value="activity"      icon={<ClipboardList />}>Activity</Tabs.Tab>
                  <Tabs.Tab value="notifications" icon={<Bell />} badge={<Badge variant="danger" appearance="solid" size="sm" count={4} />}>Notifications</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                  <Tabs.Panel value="details"><PanelStat label="Role" value="Attending physician" /></Tabs.Panel>
                  <Tabs.Panel value="activity"><PanelStat label="Last sign-in" value="12m ago" /></Tabs.Panel>
                  <Tabs.Panel value="notifications"><PanelStat label="Unread" value="4 alerts" /></Tabs.Panel>
                </Tabs.Panels>
              </Tabs>
            </Card.Content>
          </Card>
        </ExampleShell>
      </div>
    </DocBlock>
  );
}

function ExampleShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary, marginBottom: t.space.stack.sm }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary, textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: t.color.text.primary, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "value",          type: "string",                    def: "—",       desc: "Controlled active value. Pair with onValueChange." },
  { name: "defaultValue",   type: "string",                    def: "—",       desc: "Uncontrolled initial active value. Ignored when `value` is set." },
  { name: "onValueChange",  type: "(value: string) => void",   def: "—",       desc: "Fired on every selection — click, arrow, Home, End." },
  { name: "size",           type: "'sm' | 'md' | 'lg'",        def: "'md'",    desc: "Size ladder. Heights 32 / 40 / 48." },
  { name: "ariaLabel",      type: "string",                    def: "—",       desc: "Accessible name for the whole tabs surface." },
  { name: "ariaLabelledBy", type: "string",                    def: "—",       desc: "Wire an existing heading's id for aria-labelledby." },
];

const PROPS_LIST: PropRow[] = [
  { name: "scrollable",     type: "boolean",                   def: "true",    desc: "Enable horizontal scroll when tabs overflow the container width." },
];

const PROPS_TAB: PropRow[] = [
  { name: "value",          type: "string",                    def: "—",       desc: "Required. Identifies the tab. Must match a Tabs.Panel value." },
  { name: "icon",           type: "ReactNode",                 def: "—",       desc: "Leading icon slot. Sized by the tab's size prop." },
  { name: "badge",          type: "ReactNode",                 def: "—",       desc: "Trailing badge slot — usually a Badge with a count." },
  { name: "disabled",       type: "boolean",                   def: "false",   desc: "Skip keyboard navigation + reject clicks. Native disabled." },
  { name: "onClick",        type: "(e) => void",               def: "—",       desc: "Fires after the internal selection handler (for click telemetry)." },
];

const PROPS_PANEL: PropRow[] = [
  { name: "value",          type: "string",                    def: "—",       desc: "Required. Must match a Tabs.Tab value." },
  { name: "keepMounted",    type: "boolean",                   def: "false",   desc: "Keep the panel mounted while inactive (hidden). Useful for expensive panels." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Tabs"        rows={PROPS_ROOT} />
      <PropsSubsection title="Tabs.List"   rows={PROPS_LIST} />
      <PropsSubsection title="Tabs.Tab"    rows={PROPS_TAB} />
      <PropsSubsection title="Tabs.Panel"  rows={PROPS_PANEL} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Tabs.Panels has no props beyond standard HTML attributes.
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
        <div style={{ display: "grid", gridTemplateColumns: "170px 1.6fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "170px 1.6fr 100px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
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
    { role: "List border",         alias: "aliases.color.border.subtle (bottom border under the strip)" },
    { role: "List background",     alias: "aliases.color.background.default" },
    { role: "Tab default text",    alias: "aliases.color.text.tertiary" },
    { role: "Tab hover text",      alias: "aliases.color.text.primary (with bg.subtle wash)" },
    { role: "Tab selected text",   alias: "aliases.color.action.primary (Button primary — cross-family selection color)" },
    { role: "Selection underline", alias: "aliases.color.action.primary at 2px — reserved width so tabs don't jump on select" },
    { role: "Disabled text",       alias: "aliases.color.text.disabled" },
    { role: "Focus ring",          alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Table + Badge + Alert)" },
    { role: "Size heights",        alias: "components.tabs.size.height — 32 / 40 / 48 (Button sm/md/lg + 4 for the underline)" },
    { role: "Tab padding",         alias: "components.tabs.size.padX — inline.md · inline.lg · inline.xl per size" },
    { role: "Tab typography",      alias: "aliases.typography.bodyS (sm/md) · body (lg)" },
    { role: "Icon size",           alias: "components.tabs.size.iconSize — 14 / 16 / 18 per size" },
    { role: "Panel padding-top",   alias: "aliases.spacing.stack.lg (16 — matches Card content top rhythm)" },
    { role: "Panel typography",    alias: "aliases.typography.body (16/24)" },
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
          { tone: "note", text: "Automatic activation — arrow keys, Home, and End both move focus and fire onValueChange. This matches the WAI-ARIA authoring practice for tab strips whose panel content is cheap to switch." },
          { tone: "note", text: "Roving tabindex is enforced by the Tab itself — the selected tab has tabIndex=0; the rest have tabIndex=-1. The list is one Tab stop; arrow keys move inside it." },
          { tone: "note", text: "Tabs and Panels find each other by matching `value`. React's useId generates the shared id prefix on the root; each subcomponent computes its own id from the prefix + its value. Passing string ids as `value` is required — the value is embedded in the DOM id." },
          { tone: "note", text: "Selection is painted as a 2px bottom-border on the selected tab that sits 1px below the list's own bottom-border (via -1px margin-bottom). The unselected tab reserves the 2px transparent border up front so tabs don't jump 2px when selected." },
          { tone: "note", text: "Tabs.Panel unmounts inactive panels by default. Pass `keepMounted` for expensive panels (a data grid, a form with local state) — the panel is hidden via `hidden` + `display: none` but remains in the DOM." },
          { tone: "note", text: "Overflowing tabs scroll horizontally by default (scrollable=true on Tabs.List). The scrollbar is hidden via CSS — the affordance is the horizontal scroll gesture on touch + the trailing tab edge on desktop." },
        ]}
      />

      <Callout tone="info" title="Extending Tabs">
        (1) Downstream navigation surfaces (DashboardTabs, SettingsTabs,
        AnalyticsTabs, ProfileTabs, DetailTabs, WizardSteps) should be thin
        compositions on top of this Tabs — wrap it with an opinionated tab
        list and reuse every visual choice. (2) Alternative selection styles
        (segmented control, vertical rail) are separate primitives with
        different interaction models — do not bolt them onto this Tabs.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",  detail: "Every color, spacing, motion, and radius value is a token alias — no hex, no raw pixels in the component." },
    { name: "HC1 Button ladder",  detail: "Size heights sit +4 above Button sm/md/lg so a 2px selection underline fits inside without cramping the label." },
    { name: "HC1 focus ring",     detail: "Every tab uses the same 2px brand outline used across Button, Input, Select, Card, Dialog, Table, Badge, and Alert." },
    { name: "HC1 Badge",          detail: "The `badge` slot renders a Badge — count pills, 'New' flags, unread indicators all render as the shared Badge primitive." },
    { name: "React useId",        detail: "Shared id prefix for aria-controls / aria-labelledby is generated with useId so multiple Tabs on a page never collide." },
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
    { name: "Dashboard Tabs",   detail: "Overview / Analytics / Reports on landing pages. Wraps Tabs with a typed value union and default 'overview'." },
    { name: "Settings Tabs",    detail: "Account / Preferences / Security / Billing inside settings pages. Wraps Tabs with icons + optional disabled." },
    { name: "Profile Tabs",     detail: "Details / Activity / Notifications inside a user profile Card. Wraps Tabs with size='sm' + notification badges." },
    { name: "Analytics Tabs",   detail: "Daily / Weekly / Monthly / YTD / Custom range time-window picker. Wraps Tabs with size='sm'." },
    { name: "Detail Tabs",      detail: "Peer views of one resource — Overview / Timeline / Documents / Related. Wraps Tabs with per-view panels." },
    { name: "Wizard Steps",     detail: "Sequential multi-step forms. Wraps Tabs with a typed step union + step-number badges + disabled future steps." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every tab strip in HC1 should compose this Tabs. These are the anticipated consumers — none are shipped yet."
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
              <ClipboardList size={14} color={t.color.action.primary} />
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
    { name: "ClinicalIQ dashboard tabs",     detail: "Bloodhealth + HerCare landing tabs currently render bespoke button rows. Migrate to Tabs — no UX change, just token + ARIA unification." },
    { name: "SourceIQ pipeline tabs",         detail: "SourceIQ pipeline views use a divergent underline color. Migrate to Tabs; selection tone follows action.primary automatically." },
    { name: "Settings / profile tab strips",  detail: "Any tab-shaped surface inside a Card that currently manages its own visibility state should switch to Tabs (controlled or uncontrolled)." },
    { name: "Analytics time-window pickers",  detail: "Daily / Weekly / Monthly / YTD selectors are Tabs — not a Select, not a Segmented Control. Migrate for keyboard support and shared focus ring." },
    { name: "Prototype ad-hoc tab bars",      detail: "Any prototype rendering '<button class=\"tab\">' rows should switch to Tabs. Get roving tabindex, arrow-key navigation, and aria wiring for free." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Tabs is the intended replacement for every tab strip across the HC1 ecosystem. Do not redesign — standardize."
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

/* ══════ Component status ══════════════════════════════════════════ */

function ComponentStatusBlock() {
  const rows: { label: string; ok: boolean }[] = [
    { label: "HC1 Design Tokens only",   ok: true },
    { label: "Semantic aliases only",    ok: true },
    { label: "Keyboard accessible",      ok: true },
    { label: "Responsive",               ok: true },
    { label: "Composable API",           ok: true },
    { label: "Production ready",         ok: true },
  ];
  return (
    <DocBlock title="Component status">
      <div
        style={{
          border: `1px solid ${t.color.status.success.border}`,
          borderRadius: t.radius.control,
          background: t.color.status.success.bg,
          padding: t.space.inline.lg,
        }}
      >
        <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.status.success.fg, marginBottom: t.space.stack.sm, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          Shipped · Quality checklist
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: t.space.inline.sm }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, color: t.color.status.success.fg, fontSize: 14 }}>
              <span aria-hidden="true">✓</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
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
