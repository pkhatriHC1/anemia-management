import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  AlertTriangle,
  FileText,
  Loader2,
  Pencil,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { Dialog, type DialogSize } from "../../components/dialog";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: DialogSize[] = ["sm", "md", "lg", "xl", "fullscreen"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function DialogDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <SizesBlock />
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
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Dialog"
      lead="Dialog is the canonical overlay primitive of the HC1 design system. Alert Dialogs, Confirmation Dialogs, Form Dialogs, Detail Dialogs, and Wizards all compose with this Dialog rather than reimplementing overlay behavior. It owns the scrim, the panel, the focus trap, the ESC handling, and the composition surface — so every downstream overlay reads as part of the same family."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [open, setOpen] = useState(false);
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. Open the dialog to see how the pieces stack."
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
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>Open example dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content size="md">
            <Dialog.Header>
              <Dialog.Title>Care plan overview</Dialog.Title>
              <Dialog.Description>
                Every named part inside a Dialog is a subcomponent — Header, Title, Description, Body, Footer, Actions.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              The Body area scrolls when its content exceeds the panel height, so the header and footer stay pinned. Compose whichever pieces you need and skip the rest.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Actions>
                <Dialog.Close>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button>Save</Button>
              </Dialog.Actions>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Dialog"             desc="Root controller. Owns open state; passes it through context to the trigger + content." />
        <Part name="Dialog.Trigger"     desc="Wraps any interactive element and opens the dialog on activation." />
        <Part name="Dialog.Content"     desc="Portalled panel + scrim. Sizes, close-on-Escape, close-on-overlay, loading, and close button live here." />
        <Part name="Dialog.Header"      desc="Top row. Composes Dialog.Title and Dialog.Description." />
        <Part name="Dialog.Title"       desc="The heading. Renders as an h2 by default; auto-wires aria-labelledby on the panel." />
        <Part name="Dialog.Description" desc="Secondary text. Auto-wires aria-describedby on the panel." />
        <Part name="Dialog.Body"        desc="Scrollable content area. Padding aligns with header + footer." />
        <Part name="Dialog.Footer"      desc="Bottom row. Usually houses the action set." />
        <Part name="Dialog.Actions"     desc="Right-aligned row of buttons. Same shape as Card.Actions." />
        <Part name="Dialog.Close"       desc="Wraps any button to make it close the dialog on click." />
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
      lead="Dialog is a compound component. Prefer composing named subcomponents over configuring booleans. Only Dialog and Dialog.Content are structurally required."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Dialog>
  <Dialog.Trigger>
    <Button>Edit patient</Button>
  </Dialog.Trigger>
  <Dialog.Content size="md">
    <Dialog.Header>
      <Dialog.Title>Edit patient</Dialog.Title>
      <Dialog.Description>Update fields and save.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>…</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Actions>
        <Dialog.Close><Button variant="ghost">Cancel</Button></Dialog.Close>
        <Button>Save</Button>
      </Dialog.Actions>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<Dialog
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
          { tone: "must",     text: "Only Dialog and Dialog.Content are required. Header, Body, Footer, Actions, and Close are opt-in." },
          { tone: "should",   text: "Order matters visually — Header → Body → Footer is the canonical rhythm." },
          { tone: "should",   text: "Nest Dialog.Actions inside Dialog.Footer. Actions belong at the bottom-right of the panel." },
          { tone: "must-not", text: "Never introduce boolean props like `showHeader` or `withFooter`. If a piece is needed, compose it." },
          { tone: "must-not", text: "Never reimplement overlay behavior in a downstream component. Confirmation, Alert, and Form Dialog compose this Dialog." },
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

/* ══════ Sizes ═════════════════════════════════════════════════════ */

const SIZE_META: Record<DialogSize, { label: string; width: string; usage: string }> = {
  sm:         { label: "Small",      width: "400px",  usage: "One-question dialogs — Confirm / Cancel / Delete." },
  md:         { label: "Medium",     width: "560px",  usage: "Default. Most edit and detail dialogs live here." },
  lg:         { label: "Large",      width: "720px",  usage: "Forms with grouped sections; larger reads." },
  xl:         { label: "Extra Large", width: "960px", usage: "Wide detail views, two-column layouts, tables inside a dialog." },
  fullscreen: { label: "Fullscreen", width: "100vw",  usage: "Mobile-first flows or immersive edit modes. No radius, no shadow." },
};

function SizesBlock() {
  return (
    <DocBlock
      title="Sizes"
      lead="Five width steps. Choose by the dialog's role, not by how much content you have — content should shape itself to the smallest size that reads well."
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

function SizeCell({ size }: { size: DialogSize }) {
  const [open, setOpen] = useState(false);
  const meta = SIZE_META[size];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="secondary" fullWidth>
            {meta.label}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content size={size}>
          <Dialog.Header>
            <Dialog.Title>{meta.label} dialog · {meta.width}</Dialog.Title>
            <Dialog.Description>{meta.usage}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <p style={{ margin: 0 }}>
              Sample body content for the <code style={{ fontFamily: t.font.mono, color: t.color.action.primary }}>size="{size}"</code> width.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Close</Button>
              </Dialog.Close>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
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

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="States" lead="Every animation state maps to a control. Loading is a body-level scrim so header and footer keep their context.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Closed" note="The default. Nothing rendered." >
          <StateStatic label="No panel in the DOM" />
        </StateTile>
        <StateTile name="Opening" note="Scrim fades in; panel scales from 98% to 100%.">
          <StateStatic label="Enter — 250ms" />
        </StateTile>
        <StateTile name="Open" note="Focus trapped; body scroll locked.">
          <StateOpen />
        </StateTile>
        <StateTile name="Closing" note="Scrim fades out; focus returns to the trigger.">
          <StateStatic label="Exit — 150ms" />
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="sm">Preview</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>Open state</Dialog.Title>
          <Dialog.Description>Focus is trapped; Escape closes.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Actions>
            <Dialog.Close>
              <Button size="sm" variant="ghost">Close</Button>
            </Dialog.Close>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

function StateLoading() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="sm" variant="secondary">Preview loading</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm" loading loadingLabel="Saving changes…">
        <Dialog.Header>
          <Dialog.Title>Saving…</Dialog.Title>
          <Dialog.Description>The body is dimmed under the spinner.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>Body content is not visible while loading.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Actions>
            <Button size="sm" disabled>Save</Button>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The panel has role='dialog' + aria-modal='true'. When Dialog.Title and Dialog.Description are present, aria-labelledby and aria-describedby are wired automatically." },
          { tone: "must", text: "Focus moves into the panel on open — to the first focusable element, or to the panel itself if none exists (tabIndex=-1)." },
          { tone: "must", text: "Focus is trapped inside the panel — Tab cycles forward, Shift+Tab cycles backward." },
          { tone: "must", text: "On close, focus is restored to the element that opened the dialog." },
          { tone: "must", text: "Escape closes the dialog (unless closeOnEscape={false})." },
          { tone: "must", text: "The scrim intercepts pointer events, preventing interaction with the background." },
          { tone: "must", text: "The body scroll is locked while a dialog is open. The scrollbar gutter is reserved to prevent layout shift." },
          { tone: "must", text: "The built-in close button uses the same 2px brand focus ring as Button, Input, Select, and Card." },
          { tone: "must", text: "loading sets aria-busy=true on the panel. The loading overlay uses role='status' + aria-live='polite'." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the enter/exit animations to 0ms and slows the loading spinner to 2500ms." },
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
    { keys: "Escape",    effect: "Close the dialog (when closeOnEscape is true, the default). Focus returns to the trigger." },
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
          { title: "Reach for the smallest size that reads", description: "sm for single questions, md for most work, lg/xl only when the content genuinely earns the width." },
          { title: "Put actions in the footer",              description: "Primary action on the right, secondary (Cancel) immediately to its left. Same rhythm every time." },
          { title: "Compose Dialog.Close on Cancel buttons", description: "Wrap the ghost Cancel button in Dialog.Close so it closes without a bespoke handler." },
          { title: "Use loading for async writes",           description: "The overlay preserves the panel context so users know which dialog is working." },
        ]}
        donts={[
          { title: "Multiple dialogs at once",                description: "Stacked dialogs confuse focus order and trap chains. Model the flow as a wizard inside one dialog instead." },
          { title: "Suppress the close button silently",      description: "If a dialog cannot be dismissed, communicate why — a loading state, a required decision, or a confirmation step." },
          { title: "Disable overlay-click + escape together", description: "Removing both dismissal paths leaves users trapped. Reserve for confirmations that truly need a decision." },
          { title: "Nest interactive surfaces",               description: "Don't put popovers, tooltips, or another dialog inside a dialog body. Redesign the flow." },
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
          { tone: "must-not", text: "Don't hand-render a scrim div. Dialog.Content already portals the scrim into document.body and handles overlay clicks." },
          { tone: "must-not", text: "Don't put focus-stealing content (auto-focused inputs, live regions) inside the panel — the Dialog manages initial focus for you." },
          { tone: "must-not", text: "Don't render a Dialog inside a table row or a list item's own click handler. The trigger belongs to a button-shaped element that a keyboard user can reach." },
          { tone: "must-not", text: "Don't use Dialog for tooltips, popovers, dropdowns, or side sheets. Those get their own primitives — Tooltip, Popover, DropdownMenu, Drawer." },
          { tone: "must-not", text: "Don't reimplement Alert Dialog or Confirmation Dialog. Both are thin compositions on top of this Dialog — they inherit its focus, ESC, and scrim behavior." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [open, setOpen] = useState(false);

  const [size, setSize]                       = useState<DialogSize>("md");
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [closeOnOverlay, setCloseOnOverlay]   = useState(true);
  const [closeOnEsc, setCloseOnEsc]           = useState(true);
  const [loading, setLoading]                 = useState(false);
  const [scrollable, setScrollable]           = useState(false);

  const [title, setTitle]             = useState("Confirm changes");
  const [description, setDescription] = useState("Review the updates below before saving.");
  const [hasFooter, setHasFooter]     = useState(true);

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered dialog in real time. Live JSX is generated in the dark panel at the bottom.">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
              <Button>Open dialog</Button>
            </Dialog.Trigger>
            <Dialog.Content
              size={size}
              showCloseButton={showCloseButton}
              closeOnOverlayClick={closeOnOverlay}
              closeOnEscape={closeOnEsc}
              loading={loading}
              loadingLabel="Working…"
            >
              <Dialog.Header>
                <Dialog.Title>{title || "Untitled"}</Dialog.Title>
                {description && <Dialog.Description>{description}</Dialog.Description>}
              </Dialog.Header>
              <Dialog.Body>
                {scrollable ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
                    {Array.from({ length: 14 }, (_, i) => (
                      <p key={i} style={{ margin: 0 }}>
                        Paragraph {i + 1}. The body area scrolls when content exceeds the panel height, so the header and footer remain pinned.
                      </p>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0 }}>
                    Standard body content. Compose forms, lists, previews, or plain prose here.
                  </p>
                )}
              </Dialog.Body>
              {hasFooter && (
                <Dialog.Footer>
                  <Dialog.Actions>
                    <Dialog.Close>
                      <Button variant="ghost">Cancel</Button>
                    </Dialog.Close>
                    <Button>Save</Button>
                  </Dialog.Actions>
                </Dialog.Footer>
              )}
            </Dialog.Content>
          </Dialog>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="size" value={size} options={SIZES} onChange={(v) => setSize(v as DialogSize)} />
          <TextControl   label="title"       value={title}       onChange={setTitle} />
          <TextControl   label="description" value={description} onChange={setDescription} />
          <ToggleControl label="footer"            value={hasFooter}       onChange={setHasFooter} />
          <ToggleControl label="close button"      value={showCloseButton} onChange={setShowCloseButton} />
          <ToggleControl label="close on overlay"  value={closeOnOverlay}  onChange={setCloseOnOverlay} />
          <ToggleControl label="close on escape"   value={closeOnEsc}      onChange={setCloseOnEsc} />
          <ToggleControl label="loading"           value={loading}         onChange={setLoading} />
          <ToggleControl label="scrollable body"   value={scrollable}      onChange={setScrollable} />
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
  size, showCloseButton, closeOnOverlay, closeOnEsc, loading, hasFooter,
  title, description,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  size: DialogSize;
  showCloseButton: boolean;
  closeOnOverlay: boolean;
  closeOnEsc: boolean;
  loading: boolean;
  hasFooter: boolean;
  title: string;
  description: string;
}) {
  const contentAttrs: string[] = [];
  if (s.size !== "md")            contentAttrs.push(`size="${s.size}"`);
  if (!s.showCloseButton)         contentAttrs.push(`showCloseButton={false}`);
  if (!s.closeOnOverlay)          contentAttrs.push(`closeOnOverlayClick={false}`);
  if (!s.closeOnEsc)              contentAttrs.push(`closeOnEscape={false}`);
  if (s.loading)                  contentAttrs.push(`loading loadingLabel="Working…"`);

  const contentOpen = contentAttrs.length > 1
    ? `  <Dialog.Content\n    ${contentAttrs.join("\n    ")}\n  >`
    : `  <Dialog.Content${contentAttrs.length ? " " + contentAttrs[0] : ""}>`;

  const lines: string[] = [];
  lines.push(`<Dialog>`);
  lines.push(`  <Dialog.Trigger>`);
  lines.push(`    <Button>Open dialog</Button>`);
  lines.push(`  </Dialog.Trigger>`);
  lines.push(contentOpen);
  lines.push(`    <Dialog.Header>`);
  lines.push(`      <Dialog.Title>${esc(s.title || "Untitled")}</Dialog.Title>`);
  if (s.description) lines.push(`      <Dialog.Description>${esc(s.description)}</Dialog.Description>`);
  lines.push(`    </Dialog.Header>`);
  lines.push(`    <Dialog.Body>…</Dialog.Body>`);
  if (s.hasFooter) {
    lines.push(`    <Dialog.Footer>`);
    lines.push(`      <Dialog.Actions>`);
    lines.push(`        <Dialog.Close>`);
    lines.push(`          <Button variant="ghost">Cancel</Button>`);
    lines.push(`        </Dialog.Close>`);
    lines.push(`        <Button>Save</Button>`);
    lines.push(`      </Dialog.Actions>`);
    lines.push(`    </Dialog.Footer>`);
  }
  lines.push(`  </Dialog.Content>`);
  lines.push(`</Dialog>`);
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
      lead="Six sketches of how downstream surfaces compose the same Dialog. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <ConfirmationExample />
        <EditFormExample />
        <PatientDetailExample />
        <SettingsExample />
        <DeleteConfirmationExample />
        <LoadingExample />
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
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>{trigger}</Dialog.Trigger>
        {children(setOpen)}
      </Dialog>
    </div>
  );
}

function ConfirmationExample() {
  return (
    <ExampleShell
      title="Confirmation"
      trigger={<Button variant="secondary" fullWidth>Publish care plan</Button>}
    >
      {() => (
        <Dialog.Content size="sm">
          <Dialog.Header>
            <Dialog.Title>Publish care plan?</Dialog.Title>
            <Dialog.Description>Once published, the plan is visible to the whole care team.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button>Publish</Button>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </ExampleShell>
  );
}

function EditFormExample() {
  return (
    <ExampleShell
      title="Edit form"
      trigger={<Button variant="secondary" fullWidth leftIcon={<Pencil />}>Edit profile</Button>}
    >
      {() => (
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Update the fields below and save.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <FakeField label="Display name" value="Dr. Paresh Cooper" />
            <FakeField label="Email"        value="p.cooper@hc1.com" />
            <FakeField label="Specialty"    value="Internal Medicine" />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button>Save changes</Button>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </ExampleShell>
  );
}

function PatientDetailExample() {
  return (
    <ExampleShell
      title="Patient detail"
      trigger={<Button variant="secondary" fullWidth leftIcon={<User />}>View patient</Button>}
    >
      {() => (
        <Dialog.Content size="lg">
          <Dialog.Header>
            <Dialog.Title>Jane Cooper</Dialog.Title>
            <Dialog.Description>MRN 4482991 · 62F · A+ · Cardiology</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.md }}>
              <DetailStat label="BP"   value="128 / 82" />
              <DetailStat label="HR"   value="76 bpm" />
              <DetailStat label="SpO2" value="98%" />
              <DetailStat label="Temp" value="98.4°F" />
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Close</Button>
              </Dialog.Close>
              <Button>Open chart</Button>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
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
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title>Notification preferences</Dialog.Title>
            <Dialog.Description>Choose what triggers a page or email.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <SettingRow label="Critical lab results"  hint="Sent immediately, 24/7" />
            <SettingRow label="New consult requests"  hint="Batched every 15 minutes" />
            <SettingRow label="Weekly digest"         hint="Monday 8 AM summary" />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button>Save preferences</Button>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </ExampleShell>
  );
}

function DeleteConfirmationExample() {
  return (
    <ExampleShell
      title="Delete confirmation"
      trigger={<Button variant="danger" fullWidth leftIcon={<Trash2 />}>Delete order set</Button>}
    >
      {() => (
        <Dialog.Content size="sm">
          <Dialog.Header>
            <Dialog.Title>Delete order set?</Dialog.Title>
            <Dialog.Description>
              This will permanently remove the Sepsis Adult v3 order set. This cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <div style={{ display: "flex", alignItems: "flex-start", gap: t.space.inline.sm, padding: t.space.inline.md, background: t.color.status.error.bg, border: `1px solid ${t.color.status.error.border}`, borderRadius: t.radius.control, color: t.color.status.error.fg }}>
              <AlertTriangle size={16} />
              <span style={{ fontSize: 13 }}>This order set is currently referenced by 3 active care plans.</span>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button variant="danger">Delete permanently</Button>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      )}
    </ExampleShell>
  );
}

function LoadingExample() {
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
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>Loading dialog</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="secondary" fullWidth leftIcon={<Loader2 />}>Sync with Epic</Button>
        </Dialog.Trigger>
        <Dialog.Content size="sm" loading loadingLabel="Contacting Epic…">
          <Dialog.Header>
            <Dialog.Title>Verifying access</Dialog.Title>
            <Dialog.Description>This usually takes a few seconds.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>Body content hidden while loading.</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Actions>
              <Dialog.Close>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
            </Dialog.Actions>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
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
  { name: "onOpenChange", type: "(open: boolean) => void",     def: "—",     desc: "Fired whenever the dialog wants to open or close." },
  { name: "children",     type: "ReactNode",                   def: "—",     desc: "Compose with Dialog.Trigger and Dialog.Content." },
];

const PROPS_CONTENT: PropRow[] = [
  { name: "size",                type: "'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'", def: "'md'",  desc: "Panel width step." },
  { name: "showCloseButton",     type: "boolean",                                  def: "true",  desc: "Render the built-in close (X) button in the top-right." },
  { name: "closeLabel",          type: "string",                                   def: "'Close'", desc: "Accessible name for the close button." },
  { name: "closeOnOverlayClick", type: "boolean",                                  def: "true",  desc: "Clicking the scrim closes the dialog." },
  { name: "closeOnEscape",       type: "boolean",                                  def: "true",  desc: "Pressing Escape closes the dialog." },
  { name: "loading",             type: "boolean",                                  def: "false", desc: "Overlay spinner + aria-busy on the panel." },
  { name: "loadingLabel",        type: "ReactNode",                                def: "—",     desc: "Text under the loading spinner." },
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
  { name: "children", type: "ReactElement", def: "—", desc: "A single interactive element. onClick is composed to close the dialog." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Dialog"          rows={PROPS_ROOT} />
      <PropsSubsection title="Dialog.Trigger"  rows={PROPS_TRIGGER} />
      <PropsSubsection title="Dialog.Content"  rows={PROPS_CONTENT} />
      <PropsSubsection title="Dialog.Title"    rows={PROPS_TITLE} />
      <PropsSubsection title="Dialog.Actions"  rows={PROPS_ACTIONS} />
      <PropsSubsection title="Dialog.Close"    rows={PROPS_CLOSE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Dialog.Header, Dialog.Description, Dialog.Body, and Dialog.Footer have no props beyond standard HTML attributes.
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
    { role: "Panel radius",       alias: "aliases.radius.surface (12px — matches Card)" },
    { role: "Panel background",   alias: "aliases.color.background.elevated (matches Card default variant)" },
    { role: "Panel border",       alias: "aliases.color.border.subtle" },
    { role: "Panel shadow",       alias: "primitives.shadow.xl via aliases.elevation.modal" },
    { role: "Scrim",              alias: "color-mix from aliases.color.background.inverse at 50% opacity" },
    { role: "Scrim z-index",      alias: "primitives.zIndex.modalScrim (60) / .modal (70)" },
    { role: "Size ladder",        alias: "components.dialog.size (400 / 560 / 720 / 960 / 100vw)" },
    { role: "Header padding",     alias: "aliases.spacing.stack.lg + inline.xl" },
    { role: "Body padding",       alias: "aliases.spacing.stack.md + inline.xl" },
    { role: "Footer padding",     alias: "aliases.spacing.stack.lg + inline.xl · bg = background.default" },
    { role: "Title",              alias: "font-size 20 · weight semibold · color text.primary" },
    { role: "Description",        alias: "font-size 14 · color text.tertiary" },
    { role: "Body text",          alias: "aliases.color.text.secondary + font-size 16" },
    { role: "Footer text",        alias: "aliases.color.text.tertiary + font-size 14" },
    { role: "Actions gap",        alias: "aliases.spacing.inline.sm (matches Card + Button rhythm)" },
    { role: "Close button",       alias: "aliases.color.text.tertiary → text.primary on hover · bg.subtle on hover" },
    { role: "Focus ring",         alias: "aliases.color.border.focus (identical to Button + Input + Select + Card)" },
    { role: "Enter animation",    alias: "aliases.motion.overlayEnter (duration 250, easing entrance)" },
    { role: "Exit animation",     alias: "aliases.motion.overlayExit (duration 150, easing exit)" },
    { role: "Loading overlay",    alias: "color-mix from aliases.color.background.elevated at 85% opacity" },
    { role: "Loading spinner",    alias: "aliases.color.border.default + action.primary on the top arc" },
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
          { tone: "note", text: "Dialog.Content is portalled into document.body — the panel is not a child of the trigger in the DOM. This keeps the scrim and stacking context predictable no matter where the Dialog is composed." },
          { tone: "note", text: "Open state can be controlled (open + onOpenChange) or uncontrolled (defaultOpen). Both are supported by the same root component — no separate ControlledDialog." },
          { tone: "note", text: "Body scroll is locked while any dialog is open. The scrollbar gutter is preserved so opening a dialog does not shift the underlying layout." },
          { tone: "note", text: "The focus trap cycles Tab and Shift+Tab within the panel. Focus falls back to the panel itself if there are no focusable children — so keyboard users are never dumped back to the page." },
          { tone: "note", text: "Dialog.Title and Dialog.Description register with the root via context and generate the ids that get wired into aria-labelledby / aria-describedby. Omit either — the corresponding aria attribute is not set." },
          { tone: "note", text: "The scrim animates with color-mix on the inverse background rather than a raw rgba literal. Retinting the inverse alias retints every dialog scrim in the product." },
        ]}
      />

      <Callout tone="info" title="Extending Dialog">
        (1) A new dialog variant (Alert Dialog, Confirmation Dialog, Wizard,
        Form Dialog) should be a thin composition on top of this Dialog —
        never a reimplementation. Wrap Dialog.Content with the variant's
        opinionated header/footer and reuse everything else. (2) A new size
        should only be added if a genuine layout intent emerges. Add the
        pixel value to
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/dialog.ts
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
    { name: "React portals",     detail: "createPortal renders the scrim + panel into document.body so stacking context is independent of the trigger's ancestors." },
    { name: "HC1 design tokens", detail: "Every color, radius, spacing, elevation, motion, and z-index value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Card language", detail: "The panel intentionally mirrors Card — same radius, same elevated background, same border tone. A Dialog reads as a Card floated above the scrim." },
    { name: "HC1 Button focus ring", detail: "The built-in close button uses the same 2px brand outline used by Button, Input, Select, and Card — cross-family consistency." },
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
    { name: "Alert Dialog",         detail: "One-question warning dialogs. Preconfigures size='sm' + closeOnOverlayClick={false} + danger action styling." },
    { name: "Confirmation Dialog",  detail: "Yes/No decision dialogs. Preconfigures size='sm' + Cancel + primary confirm actions." },
    { name: "Form Dialog",          detail: "Multi-field edit dialogs. Preconfigures size='md' + submit/cancel footer + loading during submit." },
    { name: "Detail Dialog",        detail: "Read-mostly dialogs. Preconfigures size='lg' or 'xl' + close-only footer for detail views." },
    { name: "Wizard Dialog",        detail: "Multi-step flows inside one dialog. Preconfigures size='md' + Back/Next/Finish footer + step indicator in the header." },
    { name: "Command Palette",      detail: "Search-driven interaction surface. Uses Dialog for the shell; adds its own input + result list inside Dialog.Body." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every overlay flavor in HC1 should compose this Dialog. These are the anticipated consumers — none are shipped yet."
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
