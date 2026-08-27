import { useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  Inbox,
  MapPin,
  Mail,
  MoreHorizontal,
  Plus,
  Settings,
  Shield,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import { Card, type CardDensity, type CardVariant } from "../../components/card";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: CardVariant[]     = ["default", "outlined", "elevated", "interactive", "selected"];
const DENSITIES: CardDensity[]    = ["compact", "comfortable", "relaxed"];

export function CardDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <VariantsBlock />
      <DensityBlock />
      <StatesBlock />
      <A11yBlock />
      <BestPracticesBlock />
      <CommonMistakesBlock />
      <ExamplesBlock />
      <PlaygroundBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
      <UsedByBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═════════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Card"
      lead="Card is the foundational surface primitive of the HC1 design system. Every dashboard, detail page, widget, and modal composes with Cards. It defines the surface rhythm — how header, content, footer, actions, dividers, and empty/loading states sit together — so every downstream surface reads as part of the same product."
    />
  );
}

/* ══════ Anatomy ════════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent."
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
        <div style={{ width: "min(520px, 100%)" }}>
          <Card>
            <Card.Header>
              <Card.Icon><Stethoscope /></Card.Icon>
              <Card.Title>Care team specialty</Card.Title>
              <Card.Description>Assigned to Dr. Cooper · updated 3 minutes ago</Card.Description>
              <Card.Actions>
                <Button variant="icon" size="sm" aria-label="More options">
                  <MoreHorizontal />
                </Button>
              </Card.Actions>
            </Card.Header>
            <Card.Divider />
            <Card.Content>
              Every named part inside a Card is a named subcomponent — no positional props, no boolean flags. Compose whichever pieces you need and skip the rest.
            </Card.Content>
            <Card.Divider />
            <Card.Footer>
              Last synced with Epic at 09:42
              <Card.Actions>
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </Card.Actions>
            </Card.Footer>
          </Card>
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
        <Part name="Card"             desc="Root surface. Owns background, border, radius, shadow, focus ring." />
        <Part name="Card.Header"      desc="Top row. Composes icon + title + description + actions in one line." />
        <Part name="Card.Icon"        desc="Optional leading icon slot in the header — sized by density." />
        <Part name="Card.Title"       desc="The heading. Renders as an h3 by default (change with as prop)." />
        <Part name="Card.Description" desc="Secondary text under the title. Tertiary color." />
        <Part name="Card.Actions"     desc="A flex row of buttons. Right-aligned by default; align='start|center' available." />
        <Part name="Card.Divider"     desc="Edge-to-edge themed hr between sections. Optional." />
        <Part name="Card.Content"     desc="Main body area. Padding scales with density." />
        <Part name="Card.Footer"      desc="Bottom row. Often pairs helper text with a Card.Actions group." />
        <Part name="Card.Empty"       desc="A centered empty-state block: icon + title + description + action." />
        <Part name="Card.Loading"     desc="A centered loading block: spinner + label. Use inside Content." />
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

/* ══════ Composition ════════════════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition"
      lead="Card is a compound component. Prefer composing the pieces you need over configuring booleans. Every subcomponent is optional; only Card itself is required."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: t.space.inline.lg,
        }}
      >
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Card>
  <Card.Header>
    <Card.Title>Vitals</Card.Title>
    <Card.Description>Live from device</Card.Description>
  </Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>
    <Card.Actions>
      <Button>Refresh</Button>
    </Card.Actions>
  </Card.Footer>
</Card>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<Card
  title="Vitals"
  description="Live from device"
  content={<Vitals />}
  showFooter
  footerActions={[…]}
  hasDivider
  variant="default"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Only Card itself is required. Everything else is opt-in and named." },
          { tone: "should",   text: "Order matters visually — Header → Divider → Content → Divider → Footer is the canonical rhythm." },
          { tone: "should",   text: "Nest Card.Actions inside Card.Header or Card.Footer — that's where actions live." },
          { tone: "must-not", text: "Never introduce boolean props like `showDivider` or `withHeader`. If a piece is needed, compose it." },
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
    <div
      style={{
        border: `1px solid ${border}`,
        borderRadius: t.radius.control,
        background: bg,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: `${t.space.stack.sm} ${t.space.inline.md}`, borderBottom: `1px solid ${border}`, color: fg, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em" }}>
        {tone === "do" ? "✓ Do" : "✗ Don't"} — {title}
      </div>
      <pre
        style={{
          margin: 0,
          padding: t.space.inline.md,
          fontFamily: t.font.mono,
          fontSize: 12,
          lineHeight: 1.6,
          color: t.color.text.primary,
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

/* ══════ Variants ═══════════════════════════════════════════════════ */

const VARIANT_META: Record<CardVariant, { usage: string }> = {
  default:     { usage: "Standard surface. Use for most content — dashboards, detail sections, forms." },
  outlined:    { usage: "Stronger border, no shadow. Use when nested inside another elevated surface (a modal, an overlay)." },
  elevated:    { usage: "Subtle shadow, no visible border. Use for surfaces that should float — floating panels, hero cards." },
  interactive: { usage: "Renders as a button. Whole-card click target with hover + focus. Use for list items and card links." },
  selected:    { usage: "Brand-bordered surface for the chosen option in a selection group. Combine with interactive for clickable selectables." },
};

function VariantsBlock() {
  return (
    <DocBlock title="Variants" lead="Five variants, one intent each. Don't invent more — extend the semantic role in the alias layer if a new intent appears.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        {VARIANTS.map(v => (
          <div key={v} style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <Card variant={v}>
              <Card.Header>
                <Card.Title>Variant · {v}</Card.Title>
                <Card.Description>Sample body text.</Card.Description>
              </Card.Header>
            </Card>
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

/* ══════ Density ════════════════════════════════════════════════════ */

const DENSITY_META: Record<CardDensity, { hint: string }> = {
  compact:     { hint: "Padding 12 · title 16 · gap 4. Dense grids and list rows." },
  comfortable: { hint: "Padding 16 · title 18 · gap 8. Default for most surfaces." },
  relaxed:     { hint: "Padding 24 · title 20 · gap 12. Hero cards and single-focus panels." },
};

function DensityBlock() {
  return (
    <DocBlock
      title="Sizes · Density"
      lead="Three densities control the internal spacing rhythm. All three reference spacing tokens — no bespoke pixels. Choose by the surface's role, not by the size of its content."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        {DENSITIES.map(d => (
          <div key={d} style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <Card density={d}>
              <Card.Header>
                <Card.Icon><TrendingUp /></Card.Icon>
                <Card.Title>Density · {d}</Card.Title>
                <Card.Description>Header + description at this density.</Card.Description>
              </Card.Header>
              <Card.Content>
                Content sits below the header with matching padding.
              </Card.Content>
              <Card.Footer>
                <Card.Actions>
                  <Button variant="ghost" size="sm">Skip</Button>
                  <Button size="sm">Confirm</Button>
                </Card.Actions>
              </Card.Footer>
            </Card>
            <div>
              <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
                density=&quot;{d}&quot;
              </code>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>
                {DENSITY_META[d].hint}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="States" lead="Every interactive and non-interactive state exists. Focus is never suppressed for clickable Cards.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Default" note="Non-interactive surface.">
          <Card>
            <Card.Header>
              <Card.Title>Default</Card.Title>
              <Card.Description>Non-interactive.</Card.Description>
            </Card.Header>
          </Card>
        </StateTile>
        <StateTile name="Hover" note="Hover the tile to see the state.">
          <Card variant="interactive" onClick={() => {}}>
            <Card.Header>
              <Card.Title>Hover me</Card.Title>
              <Card.Description>Interactive card, hover to preview.</Card.Description>
            </Card.Header>
          </Card>
        </StateTile>
        <StateTile name="Focused" note="Tab to reveal the focus ring.">
          <Card variant="interactive" onClick={() => {}}>
            <Card.Header>
              <Card.Title>Tab into me</Card.Title>
              <Card.Description>Focus ring uses the brand color.</Card.Description>
            </Card.Header>
          </Card>
        </StateTile>
        <StateTile name="Selected" note="variant='selected' + interactive.">
          <Card variant="selected" onClick={() => {}} pressed>
            <Card.Header>
              <Card.Title>Selected</Card.Title>
              <Card.Description>aria-pressed=true.</Card.Description>
            </Card.Header>
          </Card>
        </StateTile>
        <StateTile name="Disabled" note="Non-interactive, muted opacity.">
          <Card variant="interactive" onClick={() => {}} disabled>
            <Card.Header>
              <Card.Title>Disabled</Card.Title>
              <Card.Description>aria-disabled=true; no clicks.</Card.Description>
            </Card.Header>
          </Card>
        </StateTile>
        <StateTile name="Loading" note="Overlay scrim; layout preserved.">
          <Card loading>
            <Card.Header>
              <Card.Title>Loading</Card.Title>
              <Card.Description>Interior is preserved but hidden.</Card.Description>
            </Card.Header>
            <Card.Content>Body content here.</Card.Content>
          </Card>
        </StateTile>
        <StateTile name="Empty" note="Composed via Card.Empty.">
          <Card>
            <Card.Empty
              icon={<Inbox />}
              title="No results"
              description="Adjust your filters to see more."
              action={<Button size="sm" variant="ghost">Clear filters</Button>}
            />
          </Card>
        </StateTile>
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
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
        {children}
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
          { tone: "must", text: "Cards with onClick or variant='interactive' render as <button> — full keyboard support (Enter, Space) and focus ring are automatic." },
          { tone: "must", text: "The focus ring is the same 2px brand outline used by Button, Input, and Select — cross-family consistency." },
          { tone: "must", text: "pressed on a clickable Card emits aria-pressed for toggle-style selection semantics." },
          { tone: "must", text: "disabled sets the native disabled attribute + aria-disabled on the button. The card is not tabbable and click handlers are not invoked." },
          { tone: "must", text: "loading sets aria-busy=true on the root. The interior is visually hidden but remains in the DOM so the card doesn't collapse." },
          { tone: "must", text: "Card.Title renders as an h3 by default — override via `as` (1..6) to match the surrounding document outline. Never skip heading levels." },
          { tone: "must", text: "Card.Empty and Card.Loading use role='status' with aria-live='polite' so state changes announce without stealing focus." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses transitions to 0ms and slows the spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best Practices ═════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Compose named subcomponents", description: "Reach for Card.Header/Content/Footer before writing custom section divs." },
          { title: "Match density to purpose",   description: "compact for list rows, comfortable for most surfaces, relaxed for hero panels." },
          { title: "Use interactive for whole-card clicks", description: "A clickable card should have variant='interactive' — the click target is the whole surface." },
          { title: "Pair selected with interactive", description: "Selected cards are usually chosen from a set — keep them clickable so users can change their mind." },
        ]}
        donts={[
          { title: "Nested cards for grouping",    description: "A card inside a card doubles the surface treatment. Use a Card.Divider or a plain section." },
          { title: "Custom shadows / borders",     description: "Stick to the five variants. If a new one is needed, add it to the alias layer, not inline." },
          { title: "Wrapping title in another h*", description: "Card.Title is already a heading. Wrapping it in <h2>Title</h2> breaks the outline." },
          { title: "Empty state as an ad-hoc div", description: "Use Card.Empty. It aligns the icon/title/description/action stack for you and reads correctly to a screen reader." },
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
          { tone: "must-not", text: "Don't use variant='elevated' as a shortcut for 'more important'. Elevation is spatial, not emphatic — use headings and hierarchy instead." },
          { tone: "must-not", text: "Don't hand-roll a click handler on a <div> Card. Passing onClick automatically upgrades the root to a <button> with proper semantics." },
          { tone: "must-not", text: "Don't stack two Card.Dividers back-to-back. If you need thicker separation, add a Card.Content spacer between them." },
          { tone: "must-not", text: "Don't put a Card inside a Card just to add padding. Use density='relaxed' on the outer Card." },
          { tone: "must-not", text: "Don't nest a Button (or any interactive element) inside a clickable Card — that creates invalid nested-button HTML. If a clickable card needs a secondary action, promote the card to a link-style layout with the action outside the card, or make the whole card non-clickable and keep the action buttons inside." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Real-world examples ════════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Nine sketches of how downstream product surfaces compose the same Card. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <MetricCard />
        <PatientSummaryCard />
        <AnalyticsCard />
        <SettingsCard />
        <NotificationCard />
        <ProfileCard />
        <ListCard />
        <EmptyStateExample />
        <LoadingExample />
      </div>
    </DocBlock>
  );
}

function MetricCard() {
  return (
    <Card density="compact">
      <Card.Header>
        <Card.Icon><TrendingUp /></Card.Icon>
        <Card.Title>Active patients</Card.Title>
        <Card.Description>Last 7 days</Card.Description>
      </Card.Header>
      <Card.Content>
        <div style={{ fontSize: 32, fontWeight: 700, color: t.color.text.primary, letterSpacing: "-0.02em", lineHeight: 1 }}>
          1,248
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: t.color.status.success.fg, fontWeight: 600 }}>
          +12.4% vs prior week
        </div>
      </Card.Content>
    </Card>
  );
}

function PatientSummaryCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Icon><Heart /></Card.Icon>
        <Card.Title>Jane Cooper</Card.Title>
        <Card.Description>MRN 4482991 · 62F · A+</Card.Description>
        <Card.Actions>
          <Button variant="icon" size="sm" aria-label="More"><MoreHorizontal /></Button>
        </Card.Actions>
      </Card.Header>
      <Card.Divider />
      <Card.Content>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.md, fontSize: 13 }}>
          <div>
            <div style={{ color: t.color.text.tertiary, fontSize: 12 }}>BP</div>
            <div style={{ fontWeight: 600, color: t.color.text.primary, fontVariantNumeric: "tabular-nums" }}>128 / 82</div>
          </div>
          <div>
            <div style={{ color: t.color.text.tertiary, fontSize: 12 }}>HR</div>
            <div style={{ fontWeight: 600, color: t.color.text.primary, fontVariantNumeric: "tabular-nums" }}>76 bpm</div>
          </div>
          <div>
            <div style={{ color: t.color.text.tertiary, fontSize: 12 }}>SpO2</div>
            <div style={{ fontWeight: 600, color: t.color.text.primary, fontVariantNumeric: "tabular-nums" }}>98%</div>
          </div>
          <div>
            <div style={{ color: t.color.text.tertiary, fontSize: 12 }}>Temp</div>
            <div style={{ fontWeight: 600, color: t.color.text.primary, fontVariantNumeric: "tabular-nums" }}>98.4°F</div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        Last vitals sync: 09:42
        <Card.Actions>
          <Button size="sm" variant="ghost">History</Button>
          <Button size="sm">Open chart</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  );
}

function AnalyticsCard() {
  const bars = [40, 62, 55, 78, 60, 82, 90];
  return (
    <Card>
      <Card.Header>
        <Card.Icon><Activity /></Card.Icon>
        <Card.Title>Order volume</Card.Title>
        <Card.Description>This week</Card.Description>
        <Card.Actions>
          <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight />}>Report</Button>
        </Card.Actions>
      </Card.Header>
      <Card.Content>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 96 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: `linear-gradient(180deg, ${t.color.action.primary}, ${t.color.action.primary}80)`,
                height: `${h}%`,
                borderRadius: 4,
                minWidth: 8,
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: t.space.stack.sm, display: "flex", justifyContent: "space-between", fontSize: 11, color: t.color.text.tertiary, fontVariantNumeric: "tabular-nums" }}>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </Card.Content>
    </Card>
  );
}

function SettingsCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Icon><Settings /></Card.Icon>
        <Card.Title>Notification preferences</Card.Title>
        <Card.Description>Choose what triggers a page or email.</Card.Description>
      </Card.Header>
      <Card.Content>
        <SettingRow label="Critical lab results" description="Sent immediately, 24/7" defaultOn />
        <SettingRow label="New consult requests" description="Batched every 15 minutes" defaultOn />
        <SettingRow label="Weekly digest" description="Monday 8 AM summary" />
      </Card.Content>
      <Card.Footer>
        <Card.Actions>
          <Button variant="ghost" size="sm">Reset defaults</Button>
          <Button size="sm">Save changes</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  );
}

function SettingRow({ label, description, defaultOn }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: t.space.inline.md, padding: `${t.space.stack.sm} 0`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary }}>{label}</div>
        <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{description}</div>
      </div>
      <button
        type="button"
        onClick={() => setOn(v => !v)}
        aria-pressed={on}
        style={{
          width: 36, height: 20, borderRadius: 10, border: "none",
          background: on ? t.color.action.primary : t.color.border.strong,
          position: "relative", cursor: "pointer", padding: 0,
          transition: "background 150ms",
        }}
      >
        <span
          style={{
            position: "absolute", top: 2, left: on ? 18 : 2,
            width: 16, height: 16, borderRadius: 8,
            background: t.color.text.inverse,
            transition: "left 150ms",
          }}
        />
      </button>
    </div>
  );
}

function NotificationCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Icon><Bell /></Card.Icon>
        <Card.Title>New order set available</Card.Title>
        <Card.Description>Sepsis Adult v3 was published by the ID committee.</Card.Description>
        <Card.Actions>
          <Button variant="icon" size="sm" aria-label="Dismiss"><MoreHorizontal /></Button>
        </Card.Actions>
      </Card.Header>
      <Card.Footer>
        2 minutes ago
        <Card.Actions>
          <Button size="sm" variant="ghost">Later</Button>
          <Button size="sm">Review</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  );
}

function ProfileCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Icon>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color.action.primary, color: t.color.text.inverse, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
            PC
          </div>
        </Card.Icon>
        <Card.Title>Dr. Paresh Cooper</Card.Title>
        <Card.Description>Internal Medicine · Main Hospital</Card.Description>
      </Card.Header>
      <Card.Divider />
      <Card.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, fontSize: 13 }}>
          <ProfileRow icon={<Mail />} text="p.cooper@hc1.com" />
          <ProfileRow icon={<MapPin />} text="Suite 4B · Ward 12" />
          <ProfileRow icon={<Calendar />} text="On call: Mon, Wed, Fri" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Card.Actions>
          <Button variant="ghost" size="sm">Message</Button>
          <Button size="sm">View schedule</Button>
        </Card.Actions>
      </Card.Footer>
    </Card>
  );
}

function ProfileRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, color: t.color.text.secondary }}>
      <span style={{ color: t.color.text.tertiary, display: "inline-flex", width: 14, height: 14 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ListCard() {
  const items = [
    { title: "Draft care plan for J. Cooper", meta: "Cardiology · Due today" },
    { title: "Review sepsis criteria",         meta: "ID committee · Due Fri" },
    { title: "Sign chart · Room 4B",           meta: "Rounds · 09:15" },
  ];
  return (
    <Card density="compact">
      <Card.Header>
        <Card.Icon><CheckCircle2 /></Card.Icon>
        <Card.Title>Today's tasks</Card.Title>
        <Card.Description>3 remaining</Card.Description>
      </Card.Header>
      <Card.Content style={{ padding: 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: `${t.space.stack.sm} ${t.space.inline.lg}`, borderBottom: i === items.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: t.space.inline.md }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary }}>{item.title}</div>
              <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{item.meta}</div>
            </div>
            <ChevronRight size={14} color={t.color.text.tertiary} />
          </div>
        ))}
      </Card.Content>
    </Card>
  );
}

function EmptyStateExample() {
  return (
    <Card>
      <Card.Empty
        icon={<Inbox />}
        title="No orders today"
        description="New orders will appear here as your team submits them."
        action={
          <>
            <Button size="sm" variant="ghost">Refresh</Button>
            <Button size="sm" leftIcon={<Plus />}>New order</Button>
          </>
        }
      />
    </Card>
  );
}

function LoadingExample() {
  return (
    <Card>
      <Card.Header>
        <Card.Icon><Shield /></Card.Icon>
        <Card.Title>Verifying access</Card.Title>
        <Card.Description>Checking Epic session…</Card.Description>
      </Card.Header>
      <Card.Content style={{ padding: 0 }}>
        <Card.Loading label="Contacting Epic" />
      </Card.Content>
    </Card>
  );
}

/* ══════ Playground ═════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]           = useState<CardVariant>("default");
  const [density, setDensity]           = useState<CardDensity>("comfortable");
  const [clickable, setClickable]       = useState(false);
  const [selected, setSelected]         = useState(false);
  const [disabled, setDisabled]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [empty, setEmpty]               = useState(false);
  const [hasHeader, setHasHeader]       = useState(true);
  const [hasDescription, setHasDesc]    = useState(true);
  const [hasFooter, setHasFooter]       = useState(true);
  const [hasActions, setHasActions]     = useState(true);
  const [hasIcon, setHasIcon]           = useState(true);
  const [hasDivider, setHasDivider]     = useState(false);

  const [title, setTitle]               = useState("Care plan overview");
  const [description, setDescription]   = useState("Assigned to Dr. Cooper · updated 3 minutes ago");

  // The effective variant reflects the selected toggle if set.
  const effectiveVariant: CardVariant =
    selected ? "selected" : variant;
  const effectiveOnClick = clickable ? () => {} : undefined;

  // A clickable Card renders as <button>. Nested <button>s inside it are
  // invalid HTML. So when the card is clickable, suppress interactive
  // children inside the header — this is a real usage rule, documented
  // in Common Mistakes.
  const isClickableRoot = clickable || effectiveVariant === "interactive";
  const showHeaderActions = hasActions && !isClickableRoot;
  const showFooterActions = hasActions;

  return (
    <DocBlock title="Playground" lead="Live component. Every control below rebinds the rendered card in real time.">
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
          <div style={{ width: "min(520px, 100%)" }}>
            <Card
              variant={effectiveVariant}
              density={density}
              onClick={effectiveOnClick}
              pressed={selected || undefined}
              disabled={disabled}
              loading={loading}
            >
              {empty ? (
                <Card.Empty
                  icon={<Inbox />}
                  title="Nothing to show"
                  description="Empty-state block composed via Card.Empty."
                  action={<Button size="sm" variant="ghost">Retry</Button>}
                />
              ) : (
                <>
                  {hasHeader && (
                    <Card.Header>
                      {hasIcon && <Card.Icon><Stethoscope /></Card.Icon>}
                      <Card.Title>{title || "Untitled"}</Card.Title>
                      {hasDescription && <Card.Description>{description}</Card.Description>}
                      {showHeaderActions && (
                        <Card.Actions>
                          <Button variant="icon" size="sm" aria-label="More"><MoreHorizontal /></Button>
                        </Card.Actions>
                      )}
                    </Card.Header>
                  )}
                  {hasDivider && hasHeader && <Card.Divider />}
                  <Card.Content>
                    Card body content. Use whichever child fits the surface —
                    grids, forms, charts, list rows, or plain prose.
                  </Card.Content>
                  {hasDivider && hasFooter && <Card.Divider />}
                  {hasFooter && (
                    <Card.Footer>
                      Auto-saved just now
                      {showFooterActions && !isClickableRoot && (
                        <Card.Actions>
                          <Button size="sm" variant="ghost">Cancel</Button>
                          <Button size="sm">Save</Button>
                        </Card.Actions>
                      )}
                    </Card.Footer>
                  )}
                </>
              )}
            </Card>
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
          <SelectControl label="variant" value={variant} options={VARIANTS} onChange={v => setVariant(v as CardVariant)} disabled={selected} />
          <SelectControl label="density" value={density} options={DENSITIES} onChange={v => setDensity(v as CardDensity)} />

          <TextControl label="title"       value={title}       onChange={setTitle}       disabled={empty} />
          <TextControl label="description" value={description} onChange={setDescription} disabled={empty || !hasDescription} />

          <ToggleControl label="clickable"     value={clickable}     onChange={setClickable} />
          <ToggleControl label="selected"      value={selected}      onChange={setSelected} />
          <ToggleControl label="disabled"      value={disabled}      onChange={setDisabled} />
          <ToggleControl label="loading"       value={loading}       onChange={setLoading} />
          <ToggleControl label="empty"         value={empty}         onChange={setEmpty} />

          <ToggleControl label="header"        value={hasHeader}     onChange={setHasHeader}    disabled={empty} />
          <ToggleControl label="description"   value={hasDescription} onChange={setHasDesc}     disabled={empty || !hasHeader} />
          <ToggleControl label="footer"        value={hasFooter}     onChange={setHasFooter}    disabled={empty} />
          <ToggleControl label="actions"       value={hasActions}    onChange={setHasActions}   disabled={empty || clickable || variant === "interactive"} />
          <ToggleControl label="leading icon"  value={hasIcon}       onChange={setHasIcon}      disabled={empty || !hasHeader} />
          <ToggleControl label="divider"       value={hasDivider}    onChange={setHasDivider}   disabled={empty} />
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
              whiteSpace: "pre",
              overflowX: "auto",
            }}
          >
{renderCode({
  variant: effectiveVariant, density, clickable, selected,
  disabled, loading, empty,
  hasHeader, hasDescription, hasFooter, hasActions, hasIcon, hasDivider,
  title, description,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: CardVariant;
  density: CardDensity;
  clickable: boolean;
  selected: boolean;
  disabled: boolean;
  loading: boolean;
  empty: boolean;
  hasHeader: boolean;
  hasDescription: boolean;
  hasFooter: boolean;
  hasActions: boolean;
  hasIcon: boolean;
  hasDivider: boolean;
  title: string;
  description: string;
}) {
  const rootAttrs: string[] = [];
  if (s.variant !== "default") rootAttrs.push(`variant="${s.variant}"`);
  if (s.density !== "comfortable") rootAttrs.push(`density="${s.density}"`);
  if (s.clickable) rootAttrs.push("onClick={handleClick}");
  if (s.selected) rootAttrs.push("pressed");
  if (s.disabled) rootAttrs.push("disabled");
  if (s.loading)  rootAttrs.push("loading");

  const open = rootAttrs.length > 2
    ? `<Card\n  ${rootAttrs.join("\n  ")}\n>`
    : `<Card${rootAttrs.length ? " " + rootAttrs.join(" ") : ""}>`;

  const lines: string[] = [];
  if (s.empty) {
    lines.push(`  <Card.Empty`);
    lines.push(`    icon={<Inbox />}`);
    lines.push(`    title="Nothing to show"`);
    lines.push(`    description="Empty-state block…"`);
    lines.push(`  />`);
  } else {
    if (s.hasHeader) {
      lines.push(`  <Card.Header>`);
      if (s.hasIcon) lines.push(`    <Card.Icon><Stethoscope /></Card.Icon>`);
      lines.push(`    <Card.Title>${esc(s.title)}</Card.Title>`);
      if (s.hasDescription) lines.push(`    <Card.Description>${esc(s.description)}</Card.Description>`);
      if (s.hasActions) {
        lines.push(`    <Card.Actions>`);
        lines.push(`      <Button variant="icon" size="sm">…</Button>`);
        lines.push(`    </Card.Actions>`);
      }
      lines.push(`  </Card.Header>`);
    }
    if (s.hasDivider && s.hasHeader) lines.push(`  <Card.Divider />`);
    lines.push(`  <Card.Content>Body…</Card.Content>`);
    if (s.hasDivider && s.hasFooter) lines.push(`  <Card.Divider />`);
    if (s.hasFooter) {
      lines.push(`  <Card.Footer>`);
      lines.push(`    Auto-saved just now`);
      if (s.hasActions) {
        lines.push(`    <Card.Actions>`);
        lines.push(`      <Button size="sm">Save</Button>`);
        lines.push(`    </Card.Actions>`);
      }
      lines.push(`  </Card.Footer>`);
    }
  }

  return `${open}\n${lines.join("\n")}\n</Card>`;
}

function esc(v: string) {
  return v.replace(/</g, "&lt;");
}

/* ══════ Control primitives ═════════════════════════════════════════ */

function SelectControl({ label, value, options, onChange, disabled }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <select
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
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextControl({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
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

function ToggleControl({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
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
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} disabled={disabled} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{children}</span>;
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_CARD: PropRow[] = [
  { name: "variant",   type: "'default' | 'outlined' | 'elevated' | 'interactive' | 'selected'", def: "'default'",     desc: "Visual variant." },
  { name: "density",   type: "'compact' | 'comfortable' | 'relaxed'",                              def: "'comfortable'", desc: "Internal spacing rhythm — padding, gaps, and heading size all scale together." },
  { name: "fullWidth", type: "boolean",                                                            def: "true",          desc: "Grow to fill parent width." },
  { name: "onClick",   type: "(e) => void",                                                        def: "—",             desc: "Upgrades the root to a <button> with keyboard focus and hover states." },
  { name: "pressed",   type: "boolean",                                                            def: "—",             desc: "aria-pressed on the clickable root — for toggle-select semantics." },
  { name: "disabled",  type: "boolean",                                                            def: "false",         desc: "Non-interactive, muted opacity, not focusable." },
  { name: "loading",   type: "boolean",                                                            def: "false",         desc: "Overlay scrim + aria-busy. Interior kept in DOM but visually hidden." },
];

const PROPS_HEADER: PropRow[] = [
  { name: "children",  type: "ReactNode", def: "—", desc: "Composes Card.Icon, Card.Title, Card.Description, Card.Actions in any order — Card.Actions renders right-aligned automatically." },
];

const PROPS_TITLE: PropRow[] = [
  { name: "as",       type: "1 | 2 | 3 | 4 | 5 | 6", def: "3", desc: "Heading level. Match to the surrounding document outline." },
  { name: "children", type: "ReactNode",              def: "—", desc: "Title text." },
];

const PROPS_ACTIONS: PropRow[] = [
  { name: "align",    type: "'start' | 'center' | 'end'", def: "'end'", desc: "Horizontal alignment of the action row." },
  { name: "children", type: "ReactNode",                  def: "—",     desc: "Buttons or links to render in the row." },
];

const PROPS_EMPTY: PropRow[] = [
  { name: "icon",        type: "ReactNode", def: "—", desc: "Optional icon at the top of the block." },
  { name: "title",       type: "ReactNode", def: "—", desc: "Short title." },
  { name: "description", type: "ReactNode", def: "—", desc: "Longer explanation." },
  { name: "action",      type: "ReactNode", def: "—", desc: "One button or a Card.Actions group." },
];

const PROPS_LOADING: PropRow[] = [
  { name: "label",  type: "ReactNode", def: "—", desc: "Optional label under the spinner." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Card"             rows={PROPS_CARD} />
      <PropsSubsection title="Card.Header"      rows={PROPS_HEADER} />
      <PropsSubsection title="Card.Title"       rows={PROPS_TITLE} />
      <PropsSubsection title="Card.Actions"     rows={PROPS_ACTIONS} />
      <PropsSubsection title="Card.Empty"       rows={PROPS_EMPTY} />
      <PropsSubsection title="Card.Loading"     rows={PROPS_LOADING} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Card.Icon, Card.Description, Card.Content, Card.Footer, Card.Divider have no props beyond standard HTML attributes.
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
        <div style={{ display: "grid", gridTemplateColumns: "140px 1.4fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "140px 1.4fr 100px 2fr",
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
    { role: "Radius",           alias: "aliases.radius.surface (12px)" },
    { role: "Motion",           alias: "aliases.motion.hoverIn (matches Button + Input + Select)" },
    { role: "Focus ring",       alias: "aliases.color.border.focus (matches every other component)" },
    { role: "Surface (default)",alias: "aliases.color.background.elevated + border.default + elevation.surface" },
    { role: "Surface (outlined)", alias: "aliases.color.background.default + border.strong" },
    { role: "Surface (elevated)", alias: "aliases.color.background.elevated + border.subtle + elevation.raised" },
    { role: "Surface (interactive)", alias: "same as default + hover → bg.subtle + elevation.raised" },
    { role: "Surface (selected)",   alias: "aliases.color.border.focus (brand) frame; body stays elevated" },
    { role: "Title",            alias: "typography size scales 16 / 18 / 20 per density; weight semibold" },
    { role: "Description",      alias: "font-size 14 + aliases.color.text.tertiary" },
    { role: "Content text",     alias: "aliases.color.text.secondary + font-size 16" },
    { role: "Footer text",      alias: "aliases.color.text.tertiary + font-size 14" },
    { role: "Density padding",  alias: "aliases.spacing.inline.md | inline.lg | inline.xl (compact | comfortable | relaxed)" },
    { role: "Icon color",       alias: "aliases.color.action.primary" },
    { role: "Divider",          alias: "aliases.color.border.subtle" },
    { role: "Empty state",      alias: "aliases.color.text.primary (title) · text.tertiary (description) · bg.subtle (icon chip)" },
    { role: "Loading spinner",  alias: "aliases.color.border.default + action.primary on the top arc" },
    { role: "Loading overlay",  alias: "color-mix from aliases.color.background.elevated with 85% opacity" },
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

/* ══════ Notes ══════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Implementation notes">
      <RuleList
        rules={[
          { tone: "note", text: "The compound component pattern lives at Card.tsx — Card.Header, Card.Title etc. are static properties on the Card function. Consumers can destructure or dot-access." },
          { tone: "note", text: "Density flows via React context — the root sets the --hc-card-pad and --hc-card-gap CSS custom properties, and every subcomponent reads them. Change density on the root, every child scales." },
          { tone: "note", text: "The loading overlay uses color-mix(in oklab, ...) for the scrim so the tint follows the surface token exactly. Falls back gracefully on browsers without color-mix (all evergreen browsers support it since 2023)." },
          { tone: "note", text: "Card.Header rearranges children internally — Card.Icon renders first, Card.Actions renders last, everything else stacks in the middle. This keeps composition natural: consumers author children in any order." },
          { tone: "note", text: "Card renders as <button> when onClick is present OR when variant='interactive'. Otherwise it's a plain <div>. This mirrors the design principle: elements gain interactivity by intent, not by default." },
        ]}
      />

      <Callout tone="info" title="Extending Card">
        (1) A new variant is only justified if a new semantic surface intent
        emerges. Add the color role to the alias layer first, then extend
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/card.ts
        </code>
        + Card.css. (2) A new subcomponent should be composable — no boolean
        props on the root to enable it. Add
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          Card.Media
        </code>,
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          Card.Badge
        </code>,
        etc., as its own file that reads the density context.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Used By (future) ═══════════════════════════════════════════ */

function UsedByBlock() {
  const consumers = [
    { name: "Dashboard cards",     detail: "KPI tiles, activity feeds, chart panels — all sit inside Cards with density='compact' or 'comfortable'." },
    { name: "Statistic / Metric cards", detail: "Single-number displays with a title, delta, and optional sparkline in Card.Content." },
    { name: "Insight cards",       detail: "AI-generated summaries — composed with an icon, headline, longer body, and 'Explore' action." },
    { name: "Profile cards",       detail: "User + care-team members. Icon slot holds an avatar, actions hold messaging + schedule buttons." },
    { name: "Settings cards",      detail: "One card per settings group. Rows composed inside Card.Content; save actions in Card.Footer." },
    { name: "Tables",              detail: "Wrapped in a Card for the elevated surface. Header holds table title + filters; content holds the table." },
    { name: "Forms",               detail: "One card per form section. Density='comfortable' by default; 'relaxed' for hero forms like intake." },
    { name: "Empty states",        detail: "Card.Empty is the primary empty-state block. Use it in list views, tabs, and search results." },
    { name: "Charts",              detail: "Chart panels compose Card.Header (title + legend) with Card.Content holding the chart itself." },
    { name: "Timeline cards",      detail: "Each event as a compact Card with an icon, timestamp description, and a short body." },
    { name: "Modal bodies",        detail: "Modal shells reuse Card semantics for the header/content/footer rhythm." },
  ];

  return (
    <DocBlock
      title="Used by (future)"
      lead="Every downstream surface in HC1 should inherit this Card. These are the anticipated consumers — none are shipped yet."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {consumers.map(c => (
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

