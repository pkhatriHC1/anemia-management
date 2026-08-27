import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  ChevronRight,
  Filter,
  FileText,
  Pencil,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import {
  Drawer,
  type DrawerPlacement,
  type DrawerSize,
} from "../../components/drawer";
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

const PLACEMENTS: DrawerPlacement[] = ["left", "right"];
const SIZES:      DrawerSize[]      = ["sm", "md", "lg", "fullscreen"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function DrawerDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <PlacementBlock />
      <SizesBlock />
      <FeaturesBlock />
      <StatesBlock />
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
      title="The canonical HC1 Drawer"
      lead="Drawer is the canonical side-panel primitive of the HC1 design system. Patient Details, User Profiles, Advanced Filters, Settings, Activity Details, AI Inspector, and every edit-in-context panel across every HC1 IQ module compose this Drawer rather than reimplementing slide-over behavior. A Drawer reads as a Dialog extended sideways — same scrim, same focus behavior, same Escape handling — anchored to the left or right edge of the viewport instead of centered. It exists so contextual work happens without pulling the user off the underlying page."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [open, setOpen] = useState(false);
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. Open the drawer to see how the pieces stack."
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
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger>
            <Button>Open example drawer</Button>
          </Drawer.Trigger>
          <Drawer.Content placement="right" size="md">
            <Drawer.Header>
              <Drawer.Title>Care plan overview</Drawer.Title>
              <Drawer.Description>
                Every named part inside a Drawer is a subcomponent — Header, Title, Description, Body, Footer, Actions.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              The Body area scrolls when its content exceeds the panel height, so the header and footer stay pinned. Compose whichever pieces you need and skip the rest.
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Actions>
                <Drawer.Close>
                  <Button variant="ghost">Cancel</Button>
                </Drawer.Close>
                <Button>Save</Button>
              </Drawer.Actions>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Drawer"             desc="Root controller. Owns open state; passes it through context to the trigger + content." />
        <Part name="Drawer.Trigger"     desc="Wraps any interactive element and opens the drawer on activation." />
        <Part name="Drawer.Content"     desc="Portalled panel + scrim. Placement, size, overlay, close-on-Escape, close-on-overlay, loading, and close button live here." />
        <Part name="Drawer.Header"      desc="Top row. Composes Drawer.Title and Drawer.Description. Optional sticky prop pins it while the body scrolls." />
        <Part name="Drawer.Title"       desc="The heading. Renders as an h2 by default; auto-wires aria-labelledby on the panel." />
        <Part name="Drawer.Description" desc="Secondary text. Auto-wires aria-describedby on the panel." />
        <Part name="Drawer.Body"        desc="Scrollable content area. Padding aligns with header + footer." />
        <Part name="Drawer.Footer"      desc="Bottom row. Usually houses the action set. Optional sticky prop pins it while the body scrolls." />
        <Part name="Drawer.Actions"     desc="Right-aligned row of buttons. Same shape as Dialog.Actions and Card.Actions." />
        <Part name="Drawer.Close"       desc="Wraps any button to make it close the drawer on click." />
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
      lead="Drawer is a compound component. Prefer composing named subcomponents over configuring booleans. Only Drawer and Drawer.Content are structurally required."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Drawer>
  <Drawer.Trigger>
    <Button>Edit patient</Button>
  </Drawer.Trigger>
  <Drawer.Content placement="right" size="md">
    <Drawer.Header>
      <Drawer.Title>Edit patient</Drawer.Title>
      <Drawer.Description>Update fields and save.</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>…</Drawer.Body>
    <Drawer.Footer sticky>
      <Drawer.Actions>
        <Drawer.Close><Button variant="ghost">Cancel</Button></Drawer.Close>
        <Button>Save</Button>
      </Drawer.Actions>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<Drawer
  placement="right"
  title="Edit patient"
  description="Update fields and save."
  body={<PatientForm />}
  footerActions={[…]}
  showHeader
  showFooter
  showCloseButton
  size="md"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Only Drawer and Drawer.Content are required. Header, Body, Footer, Actions, and Close are opt-in." },
          { tone: "should",   text: "Order matters visually — Header → Body → Footer is the canonical rhythm. Match Dialog." },
          { tone: "should",   text: "Nest Drawer.Actions inside Drawer.Footer. Actions belong at the bottom-right of the panel." },
          { tone: "should",   text: "Reach for sticky footer when the body scrolls — users should never have to scroll to find the save button." },
          { tone: "must-not", text: "Never introduce boolean props like `showHeader` or `withFooter`. If a piece is needed, compose it." },
          { tone: "must-not", text: "Never reimplement side-panel behavior in a downstream component. Filter panels, detail panels, and AI inspectors all compose this Drawer." },
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

/* ══════ Placement ═════════════════════════════════════════════════ */

const PLACEMENT_META: Record<DrawerPlacement, { label: string; usage: string }> = {
  right: { label: "Right",  usage: "Default. Details, edit forms, AI inspector, activity details. Anchored to the right so the user's left-to-right reading path stays intact." },
  left:  { label: "Left",   usage: "Filter trays, navigation-style panels, batch selection editors. Anchored to the left so it feels like a companion to the primary content area." },
};

function PlacementBlock() {
  return (
    <DocBlock
      title="Placement"
      lead="Two placements. Right is the default and covers most use cases. Left is reserved for filter and navigation-style trays."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {PLACEMENTS.map((p) => (
          <PlacementCell key={p} placement={p} />
        ))}
      </div>
    </DocBlock>
  );
}

function PlacementCell({ placement }: { placement: DrawerPlacement }) {
  const [open, setOpen] = useState(false);
  const meta = PLACEMENT_META[placement];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger>
          <Button variant="secondary" fullWidth>
            {meta.label} drawer
          </Button>
        </Drawer.Trigger>
        <Drawer.Content placement={placement} size="md">
          <Drawer.Header>
            <Drawer.Title>{meta.label} drawer</Drawer.Title>
            <Drawer.Description>Slides in from the {placement} edge.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <p style={{ margin: 0 }}>
              Same panel treatment as the other placement. Only the anchor edge, the inner-corner radius, and the enter animation differ.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Close</Button>
              </Drawer.Close>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
      <div>
        <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
          placement=&quot;{placement}&quot;
        </code>
        <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginTop: 2 }}>
          {meta.usage}
        </div>
      </div>
    </div>
  );
}

/* ══════ Sizes ═════════════════════════════════════════════════════ */

const SIZE_META: Record<DrawerSize, { label: string; width: string; usage: string }> = {
  sm:         { label: "Small",      width: "360px", usage: "Narrow filter trays, quick settings, notification panels." },
  md:         { label: "Medium",     width: "480px", usage: "Default. Edit forms, patient details, user profiles." },
  lg:         { label: "Large",      width: "640px", usage: "Advanced editors, activity details, AI inspector, multi-column reads." },
  fullscreen: { label: "Fullscreen", width: "100vw", usage: "Mobile-first flows or immersive edit modes. No radius, no shadow." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Four width steps. Height is always 100dvh. Choose by the drawer's role, not by how much content you have — content should shape itself to the smallest size that reads well."
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

function SizeCell({ size }: { size: DrawerSize }) {
  const [open, setOpen] = useState(false);
  const meta = SIZE_META[size];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger>
          <Button variant="secondary" fullWidth>
            {meta.label}
          </Button>
        </Drawer.Trigger>
        <Drawer.Content placement="right" size={size}>
          <Drawer.Header>
            <Drawer.Title>{meta.label} drawer · {meta.width}</Drawer.Title>
            <Drawer.Description>{meta.usage}</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <p style={{ margin: 0 }}>
              Sample body content for the <code style={{ fontFamily: t.font.mono, color: t.color.action.primary }}>size=&quot;{size}&quot;</code> width.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Close</Button>
              </Drawer.Close>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
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

/* ══════ Features ══════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock title="Features" lead="Every feature below is a one-prop opt-in on Drawer.Content or a subcomponent. Composition beats configuration.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <FeatureTile label="Sticky header"       hint="<Drawer.Header sticky>"                 />
        <FeatureTile label="Sticky footer"       hint="<Drawer.Footer sticky>"                 />
        <FeatureTile label="Scrollable body"     hint="Automatic — body scrolls when content exceeds panel height" />
        <FeatureTile label="Overlay scrim"       hint="overlay={true} (default) — dimmed backdrop closes on click" />
        <FeatureTile label="Panel-only mode"     hint="overlay={false} — no scrim; underlying page stays interactive" />
        <FeatureTile label="Loading state"       hint="loading + loadingLabel — body dimmed, aria-busy" />
      </div>
    </DocBlock>
  );
}

function FeatureTile({ label, hint }: { label: string; hint: string }) {
  return (
    <div style={{ padding: t.space.inline.md, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14, marginBottom: 4 }}>{label}</div>
      <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary }}>{hint}</code>
    </div>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="States" lead="Every lifecycle stage maps to a control. Loading is a body-level scrim so the header and footer keep their context.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Closed" note="The default. Nothing rendered.">
          <StateStatic label="No panel in the DOM" />
        </StateTile>
        <StateTile name="Opening" note="Scrim fades in; panel slides in from the edge.">
          <StateStatic label="Enter — 250ms slide" />
        </StateTile>
        <StateTile name="Open" note="Focus trapped; body scroll locked.">
          <StateOpen />
        </StateTile>
        <StateTile name="Closing" note="Scrim fades out; focus returns to the trigger.">
          <StateStatic label="Exit — synchronous" />
        </StateTile>
        <StateTile name="Loading" note="Body dimmed under a spinner; aria-busy=true.">
          <StateLoading />
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
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 88, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

function StateStatic({ label }: { label: string }) {
  return <span style={{ ...t.type.bodyS, color: t.color.text.tertiary, fontFamily: t.font.mono }}>{label}</span>;
}

function StateOpen() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button size="sm">Preview</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="right" size="sm">
        <Drawer.Header>
          <Drawer.Title>Open state</Drawer.Title>
          <Drawer.Description>Focus is trapped; Escape closes.</Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Drawer.Actions>
            <Drawer.Close>
              <Button size="sm" variant="ghost">Close</Button>
            </Drawer.Close>
          </Drawer.Actions>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

function StateLoading() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button size="sm" variant="secondary">Preview loading</Button>
      </Drawer.Trigger>
      <Drawer.Content placement="right" size="sm" loading loadingLabel="Saving changes…">
        <Drawer.Header>
          <Drawer.Title>Saving…</Drawer.Title>
          <Drawer.Description>The body is dimmed under the spinner.</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Body content is not visible while loading.</Drawer.Body>
        <Drawer.Footer>
          <Drawer.Actions>
            <Button size="sm" disabled>Save</Button>
          </Drawer.Actions>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The panel has role='dialog' + aria-modal='true'. When Drawer.Title and Drawer.Description are present, aria-labelledby and aria-describedby are wired automatically." },
          { tone: "must", text: "Focus moves into the panel on open — to the first focusable element, or to the panel itself if none exists (tabIndex=-1)." },
          { tone: "must", text: "Focus is trapped inside the panel — Tab cycles forward, Shift+Tab cycles backward." },
          { tone: "must", text: "On close, focus is restored to the element that opened the drawer." },
          { tone: "must", text: "Escape closes the drawer (unless closeOnEscape={false})." },
          { tone: "must", text: "The scrim intercepts pointer events, preventing interaction with the background. When overlay={false}, the panel still traps focus but the surrounding page stays interactive." },
          { tone: "must", text: "The body scroll is locked while a drawer is open. The scrollbar gutter is reserved to prevent layout shift." },
          { tone: "must", text: "The built-in close button uses the same 2px brand focus ring as Button, Input, Select, Card, and Dialog." },
          { tone: "must", text: "loading sets aria-busy=true on the panel. The loading overlay uses role='status' + aria-live='polite'." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the enter/exit slide animations to 0ms and slows the loading spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",       effect: "Move focus to the next focusable element inside the panel. Wraps at the end." },
    { keys: "Shift+Tab", effect: "Move focus to the previous focusable element inside the panel. Wraps at the start." },
    { keys: "Escape",    effect: "Close the drawer (when closeOnEscape is true, the default). Focus returns to the trigger." },
    { keys: "Enter / Space", effect: "Activate the currently focused button — the same as any other button." },
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
          { title: "Use Drawer for contextual work",   description: "The user should keep awareness of the underlying page. Editing a patient, adjusting filters, inspecting an AI decision." },
          { title: "Anchor right by default",          description: "Left is reserved for filter and navigation-style trays. Right handles details, edits, inspectors." },
          { title: "Reach for the smallest size that reads", description: "sm for filters/settings, md for most editors, lg only when the content genuinely earns the width." },
          { title: "Make save-actions sticky",         description: "Use <Drawer.Footer sticky> so users never have to scroll to find the primary action." },
        ]}
        donts={[
          { title: "Use Drawer when full focus is required", description: "Confirmations, destructive prompts, or decision-forcing flows belong in a Dialog. Reach for Dialog when the user must not be distracted." },
          { title: "Stack drawers",                          description: "Nested drawers confuse focus order and slide-in geometry. Redesign the flow — link to a dedicated page or use a wizard inside one drawer." },
          { title: "Suppress the close button silently",     description: "If a drawer cannot be dismissed, communicate why — a loading state, a required decision, or a confirmation step." },
          { title: "Disable overlay-click + escape together",description: "Removing both dismissal paths leaves users trapped. Reserve for confirmations that truly need a decision." },
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
          { tone: "must-not", text: "Don't hand-render a scrim div. Drawer.Content already portals the scrim into document.body and handles overlay clicks." },
          { tone: "must-not", text: "Don't put focus-stealing content (auto-focused inputs, live regions) inside the panel — the Drawer manages initial focus for you." },
          { tone: "must-not", text: "Don't build a Bottom Sheet, Sidebar, or Inspector Layout with Drawer. Those are separate primitives with different semantics — Drawer is only for side-anchored, dismissible slide-overs." },
          { tone: "must-not", text: "Don't use Drawer for tooltips, popovers, or dropdown menus. Those get their own primitives — Tooltip, Popover, DropdownMenu." },
          { tone: "must-not", text: "Don't reimplement Patient Detail Panel or Advanced Filters as bespoke slide-overs. Both are thin compositions on top of this Drawer — they inherit its focus, ESC, and scrim behavior." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [open, setOpen] = useState(false);

  const [placement, setPlacement]             = useState<DrawerPlacement>("right");
  const [size, setSize]                       = useState<DrawerSize>("md");
  const [stickyHeader, setStickyHeader]       = useState(false);
  const [stickyFooter, setStickyFooter]       = useState(true);
  const [overlay, setOverlay]                 = useState(true);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [closeOnOverlay, setCloseOnOverlay]   = useState(true);
  const [closeOnEsc, setCloseOnEsc]           = useState(true);
  const [loading, setLoading]                 = useState(false);
  const [longContent, setLongContent]         = useState(true);

  const [title, setTitle]             = useState("Edit patient");
  const [description, setDescription] = useState("Review and update the fields below before saving.");
  const [hasFooter, setHasFooter]     = useState(true);

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered drawer in real time. Live JSX is generated in the dark panel at the bottom.">
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
          <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger>
              <Button>Open drawer</Button>
            </Drawer.Trigger>
            <Drawer.Content
              placement={placement}
              size={size}
              overlay={overlay}
              showCloseButton={showCloseButton}
              closeOnOverlayClick={closeOnOverlay}
              closeOnEscape={closeOnEsc}
              loading={loading}
              loadingLabel="Working…"
            >
              <Drawer.Header sticky={stickyHeader}>
                <Drawer.Title>{title || "Untitled"}</Drawer.Title>
                {description && <Drawer.Description>{description}</Drawer.Description>}
              </Drawer.Header>
              <Drawer.Body>
                {longContent ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
                    {Array.from({ length: 18 }, (_, i) => (
                      <p key={i} style={{ margin: 0 }}>
                        Paragraph {i + 1}. The body area scrolls when content exceeds the panel height. Toggle sticky header or footer to see them detach with a subtle shadow.
                      </p>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0 }}>
                    Standard body content. Compose forms, lists, previews, or plain prose here.
                  </p>
                )}
              </Drawer.Body>
              {hasFooter && (
                <Drawer.Footer sticky={stickyFooter}>
                  <Drawer.Actions>
                    <Drawer.Close>
                      <Button variant="ghost">Cancel</Button>
                    </Drawer.Close>
                    <Button>Save</Button>
                  </Drawer.Actions>
                </Drawer.Footer>
              )}
            </Drawer.Content>
          </Drawer>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="placement" value={placement} options={PLACEMENTS} onChange={(v) => setPlacement(v as DrawerPlacement)} />
          <SelectControl label="size"      value={size}      options={SIZES}      onChange={(v) => setSize(v as DrawerSize)} />
          <TextControl   label="title"       value={title}       onChange={setTitle} />
          <TextControl   label="description" value={description} onChange={setDescription} />
          <ToggleControl label="sticky header"     value={stickyHeader}    onChange={setStickyHeader} />
          <ToggleControl label="sticky footer"     value={stickyFooter}    onChange={setStickyFooter} />
          <ToggleControl label="footer"            value={hasFooter}       onChange={setHasFooter} />
          <ToggleControl label="overlay"           value={overlay}         onChange={setOverlay} />
          <ToggleControl label="close button"      value={showCloseButton} onChange={setShowCloseButton} />
          <ToggleControl label="close on overlay"  value={closeOnOverlay}  onChange={setCloseOnOverlay} />
          <ToggleControl label="close on escape"   value={closeOnEsc}      onChange={setCloseOnEsc} />
          <ToggleControl label="loading"           value={loading}         onChange={setLoading} />
          <ToggleControl label="long content"      value={longContent}     onChange={setLongContent} />
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
  placement, size, overlay, showCloseButton, closeOnOverlay, closeOnEsc, loading,
  hasFooter, stickyHeader, stickyFooter, title, description,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  placement: DrawerPlacement;
  size: DrawerSize;
  overlay: boolean;
  showCloseButton: boolean;
  closeOnOverlay: boolean;
  closeOnEsc: boolean;
  loading: boolean;
  hasFooter: boolean;
  stickyHeader: boolean;
  stickyFooter: boolean;
  title: string;
  description: string;
}) {
  const contentAttrs: string[] = [];
  if (s.placement !== "right")    contentAttrs.push(`placement="${s.placement}"`);
  if (s.size !== "md")            contentAttrs.push(`size="${s.size}"`);
  if (!s.overlay)                 contentAttrs.push(`overlay={false}`);
  if (!s.showCloseButton)         contentAttrs.push(`showCloseButton={false}`);
  if (!s.closeOnOverlay)          contentAttrs.push(`closeOnOverlayClick={false}`);
  if (!s.closeOnEsc)              contentAttrs.push(`closeOnEscape={false}`);
  if (s.loading)                  contentAttrs.push(`loading loadingLabel="Working…"`);

  const contentOpen = contentAttrs.length > 1
    ? `  <Drawer.Content\n    ${contentAttrs.join("\n    ")}\n  >`
    : `  <Drawer.Content${contentAttrs.length ? " " + contentAttrs[0] : ""}>`;

  const headerOpen = s.stickyHeader ? `    <Drawer.Header sticky>` : `    <Drawer.Header>`;
  const footerOpen = s.stickyFooter ? `    <Drawer.Footer sticky>` : `    <Drawer.Footer>`;

  const lines: string[] = [];
  lines.push(`<Drawer>`);
  lines.push(`  <Drawer.Trigger>`);
  lines.push(`    <Button>Open drawer</Button>`);
  lines.push(`  </Drawer.Trigger>`);
  lines.push(contentOpen);
  lines.push(headerOpen);
  lines.push(`      <Drawer.Title>${esc(s.title || "Untitled")}</Drawer.Title>`);
  if (s.description) lines.push(`      <Drawer.Description>${esc(s.description)}</Drawer.Description>`);
  lines.push(`    </Drawer.Header>`);
  lines.push(`    <Drawer.Body>…</Drawer.Body>`);
  if (s.hasFooter) {
    lines.push(footerOpen);
    lines.push(`      <Drawer.Actions>`);
    lines.push(`        <Drawer.Close>`);
    lines.push(`          <Button variant="ghost">Cancel</Button>`);
    lines.push(`        </Drawer.Close>`);
    lines.push(`        <Button>Save</Button>`);
    lines.push(`      </Drawer.Actions>`);
    lines.push(`    </Drawer.Footer>`);
  }
  lines.push(`  </Drawer.Content>`);
  lines.push(`</Drawer>`);
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
      lead="Six sketches of how downstream surfaces compose the same Drawer. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <EditPatientExample />
        <UserProfileExample />
        <AdvancedFiltersExample />
        <AIInspectorExample />
        <SettingsExample />
        <ActivityDetailsExample />
      </div>
    </DocBlock>
  );
}

function ExampleShell({
  trigger,
  title,
  children,
}: {
  trigger: ReactElement;
  title: string;
  children: (setOpen: (v: boolean) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger>{trigger}</Drawer.Trigger>
        {children(setOpen)}
      </Drawer>
    </div>
  );
}

function EditPatientExample() {
  return (
    <ExampleShell
      title="Edit patient"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Pencil />}>Edit patient</Button>}
    >
      {() => (
        <Drawer.Content placement="right" size="md">
          <Drawer.Header sticky>
            <Drawer.Title>Edit patient</Drawer.Title>
            <Drawer.Description>MRN 4482991 · Update fields and save.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <FakeField label="Display name" value="Jane Cooper" />
            <FakeField label="Date of birth" value="1962-04-18" />
            <FakeField label="Primary language" value="English" />
            <FakeField label="Preferred pronouns" value="She / her" />
            <FakeField label="Contact number" value="(555) 214-9922" />
            <FakeField label="Email" value="jane.cooper@example.com" />
            <FakeField label="Emergency contact" value="Mark Cooper — (555) 214-9923" />
            <FakeField label="Insurance provider" value="BlueCross BlueShield" />
          </Drawer.Body>
          <Drawer.Footer sticky>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Cancel</Button>
              </Drawer.Close>
              <Button>Save changes</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function UserProfileExample() {
  return (
    <ExampleShell
      title="User profile"
      trigger={<Button variant="secondary" fullWidth leftIcon={<User />}>View profile</Button>}
    >
      {() => (
        <Drawer.Content placement="right" size="md">
          <Drawer.Header>
            <Drawer.Title>Dr. Paresh Cooper</Drawer.Title>
            <Drawer.Description>Internal Medicine · Attending · Sinai Hospital</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.md, marginBottom: t.space.stack.lg }}>
              <DetailStat label="Patients this month" value="128" />
              <DetailStat label="Consult response" value="4.2 min" />
              <DetailStat label="Care plans" value="46" />
              <DetailStat label="AI adherence"  value="93%" />
            </div>
            <FakeField label="Email"      value="p.cooper@hc1.com" />
            <FakeField label="Extension"  value="4432" />
            <FakeField label="Team"       value="Cardiology Ward 3B" />
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Close</Button>
              </Drawer.Close>
              <Button>Message</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function AdvancedFiltersExample() {
  return (
    <ExampleShell
      title="Advanced filters"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Filter />}>Advanced filters</Button>}
    >
      {() => (
        <Drawer.Content placement="left" size="sm">
          <Drawer.Header>
            <Drawer.Title>Filter patients</Drawer.Title>
            <Drawer.Description>3 filters active</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <FilterRow label="Age" hint="18 – 90" />
            <FilterRow label="Sex" hint="All" />
            <FilterRow label="Care team" hint="Cardiology, Neurology" />
            <FilterRow label="Risk score" hint="Moderate+" />
            <FilterRow label="Admission date" hint="Last 30 days" />
            <FilterRow label="Insurance" hint="Any" />
          </Drawer.Body>
          <Drawer.Footer sticky>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Reset</Button>
              </Drawer.Close>
              <Button>Apply filters</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function AIInspectorExample() {
  return (
    <ExampleShell
      title="AI inspector"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Sparkles />}>Inspect AI decision</Button>}
    >
      {() => (
        <Drawer.Content placement="right" size="lg">
          <Drawer.Header sticky>
            <Drawer.Title>AI care-plan reasoning</Drawer.Title>
            <Drawer.Description>Model · MedLLM v3.2 · Confidence 0.87</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <ReasoningStep icon={<Bot />} title="Input signals" body="Patient age, most recent troponin trend, prior MI, BNP > 400." />
            <ReasoningStep icon={<Activity />} title="Retrieved evidence" body="ACC/AHA 2022 · Class IIa · GDMT titration protocol for HFrEF." />
            <ReasoningStep icon={<AlertTriangle />} title="Risk flags" body="Renal function borderline — recommend eGFR before dose increase." />
            <ReasoningStep icon={<ChevronRight />} title="Recommended plan" body="Start empagliflozin 10mg daily · re-check labs in 2 weeks · cardiology f/u in 4 weeks." />
          </Drawer.Body>
          <Drawer.Footer sticky>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Dismiss</Button>
              </Drawer.Close>
              <Button>Accept & apply</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function SettingsExample() {
  return (
    <ExampleShell
      title="Settings"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Settings />}>Preferences</Button>}
    >
      {() => (
        <Drawer.Content placement="right" size="md">
          <Drawer.Header sticky>
            <Drawer.Title>Notification preferences</Drawer.Title>
            <Drawer.Description>Choose what triggers a page or email.</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <SettingRow label="Critical lab results"  hint="Sent immediately, 24/7" />
            <SettingRow label="New consult requests"  hint="Batched every 15 minutes" />
            <SettingRow label="Weekly digest"         hint="Monday 8 AM summary" />
            <SettingRow label="Medication interactions" hint="Immediate — always on" />
            <SettingRow label="AI care-plan updates"  hint="Batched every hour" />
          </Drawer.Body>
          <Drawer.Footer sticky>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Cancel</Button>
              </Drawer.Close>
              <Button>Save preferences</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function ActivityDetailsExample() {
  return (
    <ExampleShell
      title="Activity details"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Bell />}>View activity</Button>}
    >
      {() => (
        <Drawer.Content placement="right" size="md">
          <Drawer.Header>
            <Drawer.Title>Care plan · v3</Drawer.Title>
            <Drawer.Description>Published 2 hours ago · 4 revisions</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            <TimelineRow when="2 hrs ago" who="Dr. Cooper"  what="Published v3" />
            <TimelineRow when="2 hrs ago" who="Dr. Cooper"  what="Added empagliflozin 10mg" />
            <TimelineRow when="1 day ago" who="Dr. Kaur"    what="Reviewed labs" />
            <TimelineRow when="1 day ago" who="System"      what="AI reasoning generated" />
            <TimelineRow when="2 days ago" who="Dr. Cooper" what="Created care plan draft" />
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Actions>
              <Drawer.Close>
                <Button variant="ghost">Close</Button>
              </Drawer.Close>
              <Button>Open full log</Button>
            </Drawer.Actions>
          </Drawer.Footer>
        </Drawer.Content>
      )}
    </ExampleShell>
  );
}

function FakeField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, marginBottom: t.space.stack.md }}>
      <span style={{ fontSize: 12, color: t.color.text.tertiary, fontWeight: 600 }}>{label}</span>
      <div style={{
        height: 36, padding: `0 ${t.space.inline.md}`, display: "flex", alignItems: "center",
        border: `1px solid ${t.color.border.default}`, borderRadius: t.radius.control,
        background: t.color.background.default, color: t.color.text.primary, fontSize: 14,
      }}>
        {value}
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: t.space.inline.md, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
      <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: t.color.text.primary, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{value}</div>
    </div>
  );
}

function SettingRow({ label, hint }: { label: string; hint: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: t.space.inline.md, padding: `${t.space.stack.sm} 0`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary }}>{label}</div>
        <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{hint}</div>
      </div>
      <input type="checkbox" defaultChecked />
    </div>
  );
}

function FilterRow({ label, hint }: { label: string; hint: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: `${t.space.stack.sm} 0`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary }}>{label}</div>
      <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{hint}</div>
    </div>
  );
}

function ReasoningStep({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div style={{ display: "flex", gap: t.space.inline.md, padding: `${t.space.stack.md} 0`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
      <div style={{ width: 32, height: 32, borderRadius: t.radius.control, background: t.color.background.subtle, color: t.color.action.primary, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
        {icon}
      </div>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.color.text.primary, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 13, color: t.color.text.secondary, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

function TimelineRow({ when, who, what }: { when: string; who: string; what: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: t.space.inline.md, padding: `${t.space.stack.md} 0`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
      <div style={{ fontSize: 12, color: t.color.text.tertiary, fontVariantNumeric: "tabular-nums" }}>{when}</div>
      <div>
        <div style={{ fontSize: 14, color: t.color.text.primary }}>{what}</div>
        <div style={{ fontSize: 12, color: t.color.text.tertiary }}>{who}</div>
      </div>
    </div>
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
  { name: "open",         type: "boolean",                     def: "—",     desc: "Controlled open state. Pair with onOpenChange." },
  { name: "defaultOpen",  type: "boolean",                     def: "false", desc: "Uncontrolled initial open state." },
  { name: "onOpenChange", type: "(open: boolean) => void",     def: "—",     desc: "Fired whenever the drawer wants to open or close." },
  { name: "children",     type: "ReactNode",                   def: "—",     desc: "Compose with Drawer.Trigger and Drawer.Content." },
];

const PROPS_CONTENT: PropRow[] = [
  { name: "placement",           type: "'left' | 'right'",                         def: "'right'", desc: "Which edge of the viewport the drawer anchors to." },
  { name: "size",                type: "'sm' | 'md' | 'lg' | 'fullscreen'",        def: "'md'",    desc: "Panel width step. Height is always 100dvh." },
  { name: "overlay",             type: "boolean",                                  def: "true",    desc: "Render the semi-transparent scrim behind the panel." },
  { name: "showCloseButton",     type: "boolean",                                  def: "true",    desc: "Render the built-in close (X) button in the top-right." },
  { name: "closeLabel",          type: "string",                                   def: "'Close'", desc: "Accessible name for the close button." },
  { name: "closeOnOverlayClick", type: "boolean",                                  def: "true",    desc: "Clicking the scrim closes the drawer. Ignored when overlay is false." },
  { name: "closeOnEscape",       type: "boolean",                                  def: "true",    desc: "Pressing Escape closes the drawer." },
  { name: "loading",             type: "boolean",                                  def: "false",   desc: "Overlay spinner + aria-busy on the panel." },
  { name: "loadingLabel",        type: "ReactNode",                                def: "—",       desc: "Text under the loading spinner." },
];

const PROPS_HEADER: PropRow[] = [
  { name: "sticky",   type: "boolean",   def: "false", desc: "Pin the header while the body scrolls. Adds a subtle border + shadow on detach." },
  { name: "children", type: "ReactNode", def: "—",     desc: "Typically Drawer.Title and Drawer.Description." },
];

const PROPS_FOOTER: PropRow[] = [
  { name: "sticky",   type: "boolean",   def: "false", desc: "Pin the footer while the body scrolls. Adds a subtle border + shadow on detach." },
  { name: "children", type: "ReactNode", def: "—",     desc: "Typically Drawer.Actions." },
];

const PROPS_TITLE: PropRow[] = [
  { name: "as",       type: "1 | 2 | 3 | 4 | 5 | 6", def: "2", desc: "Heading level. Match to the surrounding document outline." },
  { name: "children", type: "ReactNode",              def: "—", desc: "Title text. Auto-wires aria-labelledby on the panel." },
];

const PROPS_ACTIONS: PropRow[] = [
  { name: "align",    type: "'start' | 'center' | 'end'", def: "'end'", desc: "Horizontal alignment of the action row." },
  { name: "children", type: "ReactNode",                  def: "—",     desc: "Buttons or links inside the row." },
];

const PROPS_TRIGGER: PropRow[] = [
  { name: "children", type: "ReactElement", def: "—", desc: "A single interactive element. onClick and ref are composed automatically." },
];

const PROPS_CLOSE: PropRow[] = [
  { name: "children", type: "ReactElement", def: "—", desc: "A single interactive element. onClick is composed to close the drawer." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Drawer"          rows={PROPS_ROOT} />
      <PropsSubsection title="Drawer.Trigger"  rows={PROPS_TRIGGER} />
      <PropsSubsection title="Drawer.Content"  rows={PROPS_CONTENT} />
      <PropsSubsection title="Drawer.Header"   rows={PROPS_HEADER} />
      <PropsSubsection title="Drawer.Footer"   rows={PROPS_FOOTER} />
      <PropsSubsection title="Drawer.Title"    rows={PROPS_TITLE} />
      <PropsSubsection title="Drawer.Actions"  rows={PROPS_ACTIONS} />
      <PropsSubsection title="Drawer.Close"    rows={PROPS_CLOSE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Drawer.Description and Drawer.Body have no props beyond standard HTML attributes.
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
    { role: "Panel radius",         alias: "aliases.radius.surface (12px — inner edge only; outer edge abuts viewport)" },
    { role: "Panel background",     alias: "aliases.color.background.elevated (matches Dialog + Card default variant)" },
    { role: "Panel border",         alias: "aliases.color.border.subtle" },
    { role: "Panel shadow",         alias: "primitives.shadow.xl via aliases.elevation.modal" },
    { role: "Scrim",                alias: "shared var(--hc-dialog-scrim) — Drawer + Dialog use the same tint" },
    { role: "Scrim z-index",        alias: "primitives.zIndex.modalScrim (60) / .modal (70)" },
    { role: "Size ladder",          alias: "components.drawer.size (360 / 480 / 640 / 100vw)" },
    { role: "Header padding",       alias: "aliases.spacing.stack.lg + inline.xl" },
    { role: "Body padding",         alias: "aliases.spacing.stack.md + inline.xl" },
    { role: "Footer padding",       alias: "aliases.spacing.stack.lg + inline.xl · bg = background.default" },
    { role: "Sticky header shadow", alias: "var(--hc-drawer-sticky-shadow) — same tone as Table sticky header" },
    { role: "Title",                alias: "font-size 20 · weight semibold · color text.primary" },
    { role: "Description",          alias: "font-size 14 · color text.tertiary" },
    { role: "Body text",            alias: "aliases.color.text.secondary + font-size 16" },
    { role: "Footer text",          alias: "aliases.color.text.tertiary + font-size 14" },
    { role: "Actions gap",          alias: "aliases.spacing.inline.sm (matches Dialog + Card + Button rhythm)" },
    { role: "Close button",         alias: "aliases.color.text.tertiary → text.primary on hover · bg.subtle on hover" },
    { role: "Focus ring",           alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog)" },
    { role: "Enter animation",      alias: "translateX from ±100% via aliases.motion.overlayEnter (250ms, easing entrance)" },
    { role: "Loading overlay",      alias: "color-mix from aliases.color.background.elevated at 85% opacity" },
    { role: "Loading spinner",      alias: "aliases.color.border.default + action.primary on the top arc" },
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
          { tone: "note", text: "Drawer.Content is portalled into document.body — the panel is not a child of the trigger in the DOM. This keeps the scrim and stacking context predictable no matter where the Drawer is composed." },
          { tone: "note", text: "The panel slides in from its anchor edge — translateX(-100%) → 0 for left, translateX(100%) → 0 for right. Both use aliases.motion.overlayEnter for consistency with Dialog." },
          { tone: "note", text: "Only the inner-facing corners are rounded (top-left/bottom-left on a right drawer; top-right/bottom-right on a left drawer). The outer edge abuts the viewport, so those corners are square." },
          { tone: "note", text: "Open state can be controlled (open + onOpenChange) or uncontrolled (defaultOpen). Both are supported by the same root component — no separate ControlledDrawer." },
          { tone: "note", text: "Body scroll is locked while any drawer is open — via the same reference-counted lock Dialog uses. Opening a Drawer inside an already-open Dialog does not race the lock. The scrollbar gutter is preserved so opening a drawer does not shift the underlying layout." },
          { tone: "note", text: "The focus trap cycles Tab and Shift+Tab within the panel. Focus falls back to the panel itself if there are no focusable children — so keyboard users are never dumped back to the page." },
          { tone: "note", text: "Drawer.Title and Drawer.Description register with the root via context and generate the ids that get wired into aria-labelledby / aria-describedby. Omit either — the corresponding aria attribute is not set." },
          { tone: "note", text: "The scrim is shared with Dialog via the same --hc-dialog-scrim CSS variable. Retinting the inverse alias retints every overlay in the product — Dialog and Drawer together." },
          { tone: "note", text: "overlay={false} keeps the scrim div for positioning but makes it pointer-events: none and background: transparent so the underlying page stays interactive. Focus is still trapped inside the panel." },
        ]}
      />

      <Callout tone="info" title="Extending Drawer">
        (1) A new drawer variant (Patient Detail Panel, User Profile Panel,
        Advanced Filters, AI Inspector, Settings Panel, Activity Details)
        should be a thin composition on top of this Drawer — never a
        reimplementation. Wrap Drawer.Content with the variant's opinionated
        header/footer and reuse everything else. (2) A new size should only
        be added if a genuine layout intent emerges. Add the pixel value to
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/drawer.ts
        </code>
        and the matching CSS variable in
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          variables.css
        </code>
        before adding a new CSS class.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "React portals",       detail: "createPortal renders the scrim + panel into document.body so stacking context is independent of the trigger's ancestors." },
    { name: "HC1 design tokens",   detail: "Every color, radius, spacing, elevation, motion, and z-index value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Dialog language", detail: "The panel intentionally mirrors Dialog — same elevated background, same border tone, same scrim, same focus + Escape + body-scroll-lock behavior. A Drawer reads as a Dialog extended sideways." },
    { name: "HC1 Card surface",    detail: "Header, body, and footer use the same padding rhythm and surface tokens as Card so drawer content aligns visually with the pages composing it." },
    { name: "HC1 Button focus ring", detail: "The built-in close button uses the same 2px brand outline used by Button, Input, Select, Card, and Dialog — cross-family consistency." },
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
    { name: "Patient Detail Panel",  detail: "Right drawer, size='md' or 'lg'. Composed for patient-record editing, chart drill-in, and inline review." },
    { name: "User Profile Panel",    detail: "Right drawer, size='md'. Shows profile details, stats, and quick actions without leaving the current page." },
    { name: "Advanced Filters",      detail: "Left drawer, size='sm'. Filter trays for lists (patient list, order list, audit log, search results)." },
    { name: "Settings Panel",        detail: "Right drawer, size='md'. Notification preferences, integrations, feature flags — anything the user tweaks in place." },
    { name: "Activity Details",      detail: "Right drawer, size='md'. Timelines, changelogs, audit trails composed as read-mostly panels." },
    { name: "AI Inspector",          detail: "Right drawer, size='lg'. Model reasoning, retrieved evidence, confidence — always the same drawer, always the same anchor." },
    { name: "Edit Forms (general)",  detail: "Right drawer, size='md'. Any 'edit in context' surface — never a page navigation, never a modal." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every side-panel flavor in HC1 should compose this Drawer. These are the anticipated consumers — none are shipped yet."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any side-anchored review panel or edit sheet in the BloodHealth flow — replace bespoke fixed-position divs with a right-anchored Drawer." },
    { area: "ClinicalIQ · HerCare",     detail: "Patient detail slide-overs and care-plan editors — same Drawer, same tokens, no more one-off transitions." },
    { area: "ClinicalIQ · Starter",     detail: "Filter and settings trays currently hand-rolled — swap to a left-anchored Drawer with size='sm'." },
    { area: "SourceIQ",                 detail: "Existing right-panel implementations should be migrated behind Drawer so they inherit the shared scrim, focus behavior, and animation." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce their own side-panel primitives. Compose Drawer from day one." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Drawer replaces existing side-panel implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — role='dialog', aria-modal, focus trap, focus restore, aria-labelledby, aria-describedby" },
          { text: "Keyboard supported — Tab / Shift+Tab cycle, Escape closes, focus returns to trigger" },
          { text: "Responsive — 100dvh height, size ladder covers narrow to fullscreen" },
          { text: "Composable API — 10 named subcomponents, no configuration booleans" },
          { text: "Reduced motion honored — slide animations collapse to 0ms" },
          { text: "Production ready — same primitives Dialog uses in the shipped design system" },
        ]}
      />
    </DocBlock>
  );
}
