import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock,
  Cloud,
  FileText,
  Info,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
  WifiOff,
  XCircle,
} from "lucide-react";
import { Toast } from "../../components/toast";
import type { ToastVariant } from "../../components/toast";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: ToastVariant[] = ["info", "success", "warning", "danger", "neutral"];

const VARIANT_META: Record<ToastVariant, { title: string; description: string; icon: ReactNode; usage: string }> = {
  info:    { title: "New version available",       description: "Refresh the page to load version 3.4.1.",       icon: <Info />,          usage: "Informational, non-actionable notice — a version bump, an availability change." },
  success: { title: "Changes saved",                description: "Your record was updated successfully.",          icon: <CheckCircle2 />, usage: "The action completed. The most common Toast — save, delete, upload confirmations." },
  warning: { title: "Session expiring soon",       description: "You'll be signed out in 2 minutes. Save your work.", icon: <AlertTriangle />, usage: "Attention needed, non-blocking. A soft heads-up before something happens." },
  danger:  { title: "Unable to save",              description: "Check your connection and retry.",                icon: <XCircle />,       usage: "The action failed. Pair with role='alert' when the message needs immediate announcement." },
  neutral: { title: "Sync paused",                  description: "Background sync is paused until you reconnect.",    icon: <BellRing />,      usage: "System messages, hints, muted meta. The quietest Toast — a heads-up, not a status." },
};

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function ToastDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <VariantsBlock />
      <FeaturesBlock />
      <StatesBlock />
      <A11yBlock />
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
      title="The canonical HC1 Toast"
      lead="Toast is the canonical transient-feedback primitive of the HC1 design system. Save confirmations, delete confirmations, upload completions, background-job completions, validation summaries, connection warnings, session reminders, and system errors all compose this Toast rather than reimplementing floating-notification treatments. It owns the surface, the accent-to-meaning map, the auto-close lifecycle, and the ARIA role — so a 'Success' Toast in one product reads exactly like a 'Success' Toast in another."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="A Toast is a compound of five subcomponents. Children can be authored in any order — the root places Icon on the left, the body (Title + Description + Actions) in the middle, and Close on the right."
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
        <Toast variant="success" persistent>
          <Toast.Icon><CheckCircle2 /></Toast.Icon>
          <Toast.Title>Changes saved</Toast.Title>
          <Toast.Description>Your record was updated successfully.</Toast.Description>
          <Toast.Actions>
            <Button size="sm" variant="ghost">Undo</Button>
          </Toast.Actions>
          <Toast.Close />
        </Toast>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Toast"             desc="Root <div>. Owns variant, role, auto-close timer, dismissibility, and the exit lifecycle." />
        <Part name="Toast.Icon"        desc="Optional leading icon slot. Decorative — the meaning lives in the title + description." />
        <Part name="Toast.Title"       desc="Short heading. Renders as a <div> by default; pass as={4} etc. for landmark-level cases." />
        <Part name="Toast.Description" desc="Supporting body. Keep to one or two lines — a Toast is transient." />
        <Part name="Toast.Actions"     desc="Row for a primary action. Prefer a single action — a Toast is not a decision matrix." />
        <Part name="Toast.Close"       desc="Trailing X — a real <button> with aria-label='Dismiss'. Wired through Toast context." />
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
      lead="Toast is a compound component — the root positions the slots, and the consumer authors the content. Toast does not portal itself, queue itself, or manage sibling stacking."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: t.space.inline.md }}>
        <CodeCard title="Do — one message, one Toast">
{`<Toast variant="success" onDismiss={remove}>
  <Toast.Icon><CheckCircle2 /></Toast.Icon>
  <Toast.Title>Changes saved</Toast.Title>
  <Toast.Description>Your record was updated.</Toast.Description>
  <Toast.Close />
</Toast>`}
        </CodeCard>
        <CodeCard title="Don't — Toast as a modal">
{`{/* Toasts are non-blocking. If the user MUST
    make a decision, use Dialog instead. */}
<Toast variant="warning" persistent>
  <Toast.Title>Delete this record?</Toast.Title>
  <Toast.Actions>
    <Button>Cancel</Button>
    <Button>Delete</Button>
  </Toast.Actions>
</Toast>`}
        </CodeCard>
      </div>

      <Callout tone="info" title="Toast owns the lifecycle — the consumer owns mounting">
        Toast manages its own auto-close timer, hover/focus pause, and
        exit animation. When the exit completes, <code style={codeInline}>onDismiss</code> fires — the
        consumer should unmount the Toast in response. Toast never portals
        itself, never queues, and never removes itself from the DOM.
      </Callout>
    </DocBlock>
  );
}

const codeInline: React.CSSProperties = {
  fontFamily: t.font.mono,
  background: t.color.background.muted,
  padding: "0 4px",
  borderRadius: 3,
  fontSize: 12,
};

function CodeCard({ title, children }: { title: string; children: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: t.space.stack.sm,
      padding: t.space.inline.lg,
      border: `1px solid ${t.color.border.subtle}`,
      borderRadius: t.radius.control,
      background: t.color.background.default,
    }}>
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
      <pre style={{
        margin: 0, padding: t.space.inline.md,
        background: t.color.background.inverse,
        color: t.color.text.inverse,
        borderRadius: t.radius.control,
        fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6,
        whiteSpace: "pre", overflowX: "auto",
      }}>{children}</pre>
    </div>
  );
}

/* ══════ Variants ═════════════════════════════════════════════════ */

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Five semantic tones. Pick by meaning, not color — the accent stripe and icon color come from the token layer. Same variant → same meaning across every HC1 product."
    >
      <div style={{ display: "grid", gap: t.space.inline.md }}>
        {VARIANTS.map((v) => (
          <div
            key={v}
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
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                variant=&quot;{v}&quot;
              </code>
              <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>— {VARIANT_META[v].usage}</span>
            </div>
            <Toast variant={v} persistent>
              <Toast.Icon>{VARIANT_META[v].icon}</Toast.Icon>
              <Toast.Title>{VARIANT_META[v].title}</Toast.Title>
              <Toast.Description>{VARIANT_META[v].description}</Toast.Description>
            </Toast>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ═════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Every feature is a one-prop opt-in. Compose the subcomponents you need — nothing more."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Icon" hint="<Toast.Icon>…</Toast.Icon>">
          <Toast variant="success" persistent>
            <Toast.Icon><CheckCircle2 /></Toast.Icon>
            <Toast.Title>Changes saved</Toast.Title>
          </Toast>
        </FeatureTile>

        <FeatureTile title="Title + Description" hint="Toast.Title + Toast.Description">
          <Toast variant="info" persistent>
            <Toast.Icon><Info /></Toast.Icon>
            <Toast.Title>New version available</Toast.Title>
            <Toast.Description>Refresh to load 3.4.1.</Toast.Description>
          </Toast>
        </FeatureTile>

        <FeatureTile title="Primary action" hint="Toast.Actions">
          <Toast variant="warning" persistent>
            <Toast.Icon><AlertTriangle /></Toast.Icon>
            <Toast.Title>Session expiring</Toast.Title>
            <Toast.Description>2 minutes left.</Toast.Description>
            <Toast.Actions>
              <Button size="sm">Extend</Button>
            </Toast.Actions>
          </Toast>
        </FeatureTile>

        <FeatureTile title="Dismiss" hint="<Toast.Close />">
          <Toast variant="neutral" persistent>
            <Toast.Icon><BellRing /></Toast.Icon>
            <Toast.Title>Sync paused</Toast.Title>
            <Toast.Close />
          </Toast>
        </FeatureTile>

        <FeatureTile title="Auto close" hint="autoClose={5000}">
          <Toast variant="success" persistent>
            <Toast.Icon><Clock /></Toast.Icon>
            <Toast.Title>Auto-dismisses</Toast.Title>
            <Toast.Description>Pauses on hover / focus.</Toast.Description>
          </Toast>
        </FeatureTile>

        <FeatureTile title="Persistent" hint="persistent">
          <Toast variant="danger" persistent role="alert">
            <Toast.Icon><XCircle /></Toast.Icon>
            <Toast.Title>Sticks until dismissed</Toast.Title>
            <Toast.Close />
          </Toast>
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
      <div style={{ display: "flex", justifyContent: "center", padding: t.space.inline.sm, background: t.color.background.subtle, borderRadius: t.radius.control }}>
        {children}
      </div>
    </div>
  );
}

/* ══════ States ═══════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="States"
      lead="Three lifecycle states exposed as data-state on the root. Consumers can hook animations or observe transitions — Toast handles the wiring."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: t.space.inline.md }}>
        <StatePill state="visible" description="Mounted; slide-up + fade enter animation runs; auto-close timer active." />
        <StatePill state="closing" description="Dismiss requested; slide-down + fade exit animation runs; pointer events disabled." />
        <StatePill state="dismissed" description="Exit animation completed; onDismiss has fired; the Toast renders nothing. Parent should unmount." />
      </div>
    </DocBlock>
  );
}

function StatePill({ state, description }: { state: string; description: string }) {
  return (
    <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default, display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
        data-state=&quot;{state}&quot;
      </code>
      <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{description}</span>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The Toast renders with role='status' by default (announced politely, and aria-live='polite'). Reserve role='alert' for messages that require immediate announcement — a save failure, a lost connection, a danger surface. Non-critical info/success/warning/neutral Toasts should stay on 'status'." },
          { tone: "must", text: "aria-live is wired to match the role — 'polite' for status, 'assertive' for alert. Consumers do not need to pass aria-live directly." },
          { tone: "must", text: "aria-atomic='true' is set on the root so screen readers announce the whole Toast (title + description) as a single unit, not each subcomponent separately." },
          { tone: "must", text: "Auto-dismiss must not steal focus — the Toast never programmatically focuses itself on mount. Users continue their current interaction and the Toast is announced in the background." },
          { tone: "must", text: "Auto-close timer pauses while the pointer is over the Toast, and while any descendant is focused (per WCAG 2.2.1 Timing Adjustable — 'pausable'). It resumes on leave/blur with the remaining time preserved." },
          { tone: "must", text: "Toast.Close is a real <button> with an accessible name (via `label`, default 'Dismiss'). It uses the same 2px brand focus ring as Button, Input, Select, Card, Dialog, Table, Badge, and Alert." },
          { tone: "must", text: "Pressing Escape while any descendant of the Toast is focused dismisses the Toast (short-circuited if dismissible={false})." },
          { tone: "must", text: "The Toast root is never a button and never wraps a link. Only Toast.Close and any Buttons authored inside Toast.Actions are interactive." },
          { tone: "must", text: "The variant accent stripe and icon color meet WCAG AA (3:1) against the elevated card background — the body ink stays neutral so long descriptions clear 4.5:1." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses enter/exit animations to ~1ms — the Toast still appears and dismisses, it just doesn't slide." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "One toast, one message",           description: "Every Toast communicates one thing. If two things need saying, that's two Toasts — never a paragraph mash-up." },
          { title: "Use Toast for out-of-flow feedback", description: "When the affected surface is off-screen, or the user is no longer looking at the source, Toast is the right primitive. Inline surfaces should use Alert." },
          { title: "Give errors an action",             description: "'Unable to save' with no Retry is a dead end. A danger Toast without a recovery action should be a full Alert / Dialog instead." },
          { title: "Prefer 4–5 seconds",                description: "Long enough to read a short sentence, short enough to stay temporary. Use `persistent` only for irreversible errors that need explicit dismissal." },
        ]}
        donts={[
          { title: "Use Toast for a workflow decision", description: "If the user must click Yes/No to proceed, that's a Dialog. Toast is transient — the user might not even see it before it dismisses." },
          { title: "Stack ten toasts on screen",        description: "The wall becomes noise. A Toast queue should collapse duplicates and cap visible siblings — this primitive doesn't queue for you, but the container that hosts it should." },
          { title: "Put critical persistent status in a Toast", description: "'Server offline' is a system-level status — surface it via a persistent banner (Alert with solid appearance), not a Toast the user might miss." },
          { title: "Use Toast as a decorative flourish", description: "Every Toast interrupts the reading order for screen-reader users. Don't fire 'Nice choice!' on a benign click." },
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
          { tone: "must-not", text: "Don't build a NotificationCenter, Inbox, or ActivityFeed on top of this. Those are separate primitives with persistence, filtering, and read/unread models. Toast is transient — one message, one lifetime, gone." },
          { tone: "must-not", text: "Don't override the accent stripe or icon color inline. The variant is a token contract — a hand-picked hex breaks the color-to-meaning map for the whole product." },
          { tone: "must-not", text: "Don't stack multiple actions inside Toast.Actions. A Toast has too little dwell time for a real decision. If two actions are needed, promote it to an Alert or a Dialog." },
          { tone: "must-not", text: "Don't set autoClose={2000} to 'feel snappy'. Users cannot read a whole sentence in 2 seconds; screen-reader users cannot hear it. Stick to the 4-second default unless there is a specific reason to change." },
          { tone: "must-not", text: "Don't render a Toast for a synchronous state (e.g. inline validation as the user types). Field-level feedback belongs on the Input, not in a floating notification." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]               = useState<ToastVariant>("success");
  const [title, setTitle]                   = useState("Changes saved");
  const [description, setDescription]       = useState("Your record was updated successfully.");
  const [autoCloseMs, setAutoCloseMs]       = useState(4000);
  const [persistent, setPersistent]         = useState(true);
  const [dismissible, setDismissible]       = useState(true);
  const [primaryAction, setPrimaryAction]   = useState(false);
  const [longContent, setLongContent]       = useState(false);
  const [stackCount, setStackCount]         = useState(1);
  const [nonce, setNonce]                   = useState(0);

  const relaunch = useCallback(() => setNonce((n) => n + 1), []);

  const toasts = Array.from({ length: Math.max(1, Math.min(4, stackCount)) });

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered Toast in real time. Press Relaunch to restart the enter animation. Live JSX is generated in the dark panel at the bottom.">
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
            flexDirection: "column",
            alignItems: "center",
            gap: t.space.stack.md,
            minHeight: 220,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm, alignItems: "stretch" }}>
            {toasts.map((_, i) => (
              <Toast
                key={`${nonce}-${i}`}
                variant={variant}
                autoClose={persistent ? false : autoCloseMs}
                persistent={persistent}
                dismissible={dismissible}
                onDismiss={() => {/* consumer would unmount here */}}
              >
                <Toast.Icon>{VARIANT_META[variant].icon}</Toast.Icon>
                {title && <Toast.Title>{title}</Toast.Title>}
                {description && (
                  <Toast.Description>
                    {longContent
                      ? `${description} This longer description shows how the Toast wraps text at the token-controlled max width without breaking the accent stripe alignment.`
                      : description}
                  </Toast.Description>
                )}
                {primaryAction && (
                  <Toast.Actions>
                    <Button size="sm">View</Button>
                  </Toast.Actions>
                )}
                {dismissible && <Toast.Close />}
              </Toast>
            ))}
          </div>
          <Button size="sm" variant="ghost" leftIcon={<RefreshCw />} onClick={relaunch}>Relaunch</Button>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="variant"          value={variant} options={VARIANTS}                        onChange={(v) => setVariant(v as ToastVariant)} />
          <TextControl   label="title"            value={title}                                              onChange={setTitle} />
          <TextControl   label="description"      value={description}                                        onChange={setDescription} />
          <NumberControl label="autoClose (ms)"   value={autoCloseMs}   min={1000} max={20000} step={500}   onChange={setAutoCloseMs} disabled={persistent} />
          <ToggleControl label="persistent"       value={persistent}                                          onChange={setPersistent} />
          <ToggleControl label="dismissible"      value={dismissible}                                         onChange={setDismissible} />
          <ToggleControl label="primary action"   value={primaryAction}                                       onChange={setPrimaryAction} />
          <ToggleControl label="long content"     value={longContent}                                         onChange={setLongContent} />
          <NumberControl label="stack (visual)"   value={stackCount}    min={1} max={4}                     onChange={setStackCount} />
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
{renderCode({ variant, title, description, autoCloseMs, persistent, dismissible, primaryAction, longContent })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: ToastVariant;
  title: string;
  description: string;
  autoCloseMs: number;
  persistent: boolean;
  dismissible: boolean;
  primaryAction: boolean;
  longContent: boolean;
}) {
  const attrs: string[] = [];
  if (s.variant !== "info")     attrs.push(`variant="${s.variant}"`);
  if (s.persistent)             attrs.push(`persistent`);
  else if (s.autoCloseMs !== 4000) attrs.push(`autoClose={${s.autoCloseMs}}`);
  if (!s.dismissible)           attrs.push(`dismissible={false}`);
  const open = attrs.length ? `<Toast ${attrs.join(" ")}>` : `<Toast>`;

  const lines: string[] = [];
  lines.push(open);
  lines.push(`  <Toast.Icon><${iconName(s.variant)} /></Toast.Icon>`);
  if (s.title)       lines.push(`  <Toast.Title>${esc(s.title)}</Toast.Title>`);
  if (s.description) {
    const desc = s.longContent ? `${s.description} …extended description…` : s.description;
    lines.push(`  <Toast.Description>${esc(desc)}</Toast.Description>`);
  }
  if (s.primaryAction) {
    lines.push(`  <Toast.Actions>`);
    lines.push(`    <Button size="sm">View</Button>`);
    lines.push(`  </Toast.Actions>`);
  }
  if (s.dismissible) lines.push(`  <Toast.Close />`);
  lines.push(`</Toast>`);
  return lines.join("\n");
}

function iconName(v: ToastVariant): string {
  switch (v) {
    case "info":    return "Info";
    case "success": return "CheckCircle2";
    case "warning": return "AlertTriangle";
    case "danger":  return "XCircle";
    case "neutral": return "BellRing";
  }
}

function esc(v: string) {
  return v.replace(/</g, "&lt;");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Illustrative — not shipped as reusable components. Every example composes the same primitive with different variants and content."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: t.space.inline.md }}>
        <ExampleTile title="Changes Saved">
          <Toast variant="success" persistent>
            <Toast.Icon><CheckCircle2 /></Toast.Icon>
            <Toast.Title>Changes saved</Toast.Title>
            <Toast.Description>Your record was updated successfully.</Toast.Description>
            <Toast.Actions>
              <Button size="sm" variant="ghost">Undo</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Patient Created">
          <Toast variant="success" persistent>
            <Toast.Icon><UserPlus /></Toast.Icon>
            <Toast.Title>Patient created</Toast.Title>
            <Toast.Description>Riley Kim was added to your patient list.</Toast.Description>
            <Toast.Actions>
              <Button size="sm" rightIcon={<ArrowRight />}>Open record</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Upload Complete">
          <Toast variant="success" persistent>
            <Toast.Icon><Upload /></Toast.Icon>
            <Toast.Title>Upload complete</Toast.Title>
            <Toast.Description>All 12 files have been attached to the case.</Toast.Description>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Delete Successful">
          <Toast variant="neutral" persistent>
            <Toast.Icon><Trash2 /></Toast.Icon>
            <Toast.Title>Record deleted</Toast.Title>
            <Toast.Description>The draft has been removed.</Toast.Description>
            <Toast.Actions>
              <Button size="sm" variant="ghost">Undo</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Connection Lost">
          <Toast variant="danger" persistent role="alert">
            <Toast.Icon><WifiOff /></Toast.Icon>
            <Toast.Title>Connection lost</Toast.Title>
            <Toast.Description>Reconnect to sync your latest changes.</Toast.Description>
            <Toast.Actions>
              <Button size="sm">Retry</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Validation Failed">
          <Toast variant="warning" persistent>
            <Toast.Icon><AlertCircle /></Toast.Icon>
            <Toast.Title>Some fields need attention</Toast.Title>
            <Toast.Description>Review the highlighted items and resubmit.</Toast.Description>
            <Toast.Actions>
              <Button size="sm">Review</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="AI Analysis Complete">
          <Toast variant="info" persistent>
            <Toast.Icon><Sparkles /></Toast.Icon>
            <Toast.Title>AI analysis complete</Toast.Title>
            <Toast.Description>4 new insights are ready to review.</Toast.Description>
            <Toast.Actions>
              <Button size="sm" rightIcon={<ArrowRight />}>Open insights</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Background Sync Finished">
          <Toast variant="neutral" persistent>
            <Toast.Icon><Cloud /></Toast.Icon>
            <Toast.Title>Sync complete</Toast.Title>
            <Toast.Description>All records are up to date.</Toast.Description>
            <Toast.Close />
          </Toast>
        </ExampleTile>

        <ExampleTile title="Session Expiring">
          <Toast variant="warning" persistent>
            <Toast.Icon><Clock /></Toast.Icon>
            <Toast.Title>Session expiring in 2 minutes</Toast.Title>
            <Toast.Description>Extend your session to keep working without interruption.</Toast.Description>
            <Toast.Actions>
              <Button size="sm">Extend</Button>
            </Toast.Actions>
            <Toast.Close />
          </Toast>
        </ExampleTile>
      </div>
    </DocBlock>
  );
}

function ExampleTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary, marginBottom: t.space.stack.sm }}>
        {title}
      </div>
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.subtle, padding: t.space.inline.lg, display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "variant",     type: "'info' | 'success' | 'warning' | 'danger' | 'neutral'", def: "'info'",   desc: "Semantic tone. Sets the accent-stripe color and the icon tint." },
  { name: "role",        type: "'alert' | 'status'",                                    def: "'status'", desc: "ARIA role. Use 'alert' only for messages that must be announced immediately." },
  { name: "autoClose",   type: "number | false",                                        def: "4000",     desc: "Auto-close duration in ms. Pauses on hover / focus. Pass false to disable." },
  { name: "persistent",  type: "boolean",                                               def: "false",    desc: "Sugar for autoClose={false} — the Toast stays until dismissed." },
  { name: "dismissible", type: "boolean",                                               def: "true",     desc: "When false, Toast.Close renders nothing. Use for persistent toasts with a self-dismissing action." },
  { name: "onDismiss",   type: "() => void",                                            def: "—",        desc: "Fires after the exit animation completes. Consumer should unmount in response." },
  { name: "children",    type: "ReactNode",                                             def: "—",        desc: "Compose with Toast.Icon, Toast.Title, Toast.Description, Toast.Actions, Toast.Close." },
];

const PROPS_TITLE: PropRow[] = [
  { name: "as",       type: "'div' | 1 | 2 | 3 | 4 | 5 | 6", def: "'div'", desc: "Heading level. Default is <div> — set as={4} etc. for landmark-level cases." },
  { name: "children", type: "ReactNode",                     def: "—",     desc: "Title text." },
];

const PROPS_CLOSE: PropRow[] = [
  { name: "label",   type: "string",      def: "'Dismiss'", desc: "Accessible name for the dismiss control." },
  { name: "onClick", type: "(e) => void", def: "—",         desc: "Optional handler fired before the parent's dismiss flow starts. Rarely needed." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Toast"         rows={PROPS_ROOT} />
      <PropsSubsection title="Toast.Title"   rows={PROPS_TITLE} />
      <PropsSubsection title="Toast.Close"   rows={PROPS_CLOSE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Toast.Icon, Toast.Description, and Toast.Actions have no props beyond standard HTML attributes.
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
        <div style={{ display: "grid", gridTemplateColumns: "160px 1.6fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
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
              gridTemplateColumns: "160px 1.6fr 100px 2fr",
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
    { role: "Surface background",  alias: "aliases.color.background.elevated (white — matches Card + Dialog panel)" },
    { role: "Surface border",      alias: "aliases.color.border.default" },
    { role: "Surface radius",      alias: "aliases.radius.surface (12 — matches Card + Dialog + Alert)" },
    { role: "Surface shadow",      alias: "aliases.elevation.overlay (shadow-lg — matches floating popovers)" },
    { role: "Accent stripe",       alias: "aliases.color.status.{success|warning|error|info}.fg · action.danger (danger) · border.strong (neutral)" },
    { role: "Icon color",          alias: "aliases.color.status.{success|warning|error|info}.icon · text.tertiary (neutral)" },
    { role: "Padding",             alias: "aliases.spacing.stack.md (12 vertical) + inline.lg (16 horizontal) + 4px inset for the accent stripe" },
    { role: "Outer gap",           alias: "aliases.spacing.inline.md (12 — icon / body / close)" },
    { role: "Body gap",            alias: "aliases.spacing.stack.xs (4 — title / description / actions)" },
    { role: "Actions gap",         alias: "aliases.spacing.inline.sm (8 — matches Card.Actions + Dialog.Actions + Alert.Actions)" },
    { role: "Title typography",    alias: "14 semibold — compact toast title (smaller than Alert's 16 since Toasts are transient)" },
    { role: "Description font",    alias: "aliases.typography.bodyS (14 regular)" },
    { role: "Enter animation",     alias: "aliases.motion.overlayEnter — 250ms cubic-bezier(0,0,0.2,1)" },
    { role: "Exit animation",      alias: "aliases.motion.overlayExit — 150ms cubic-bezier(0.4,0,1,1)" },
    { role: "Auto-close default",  alias: "components.toast.motion.autoCloseDefaultMs (4000)" },
    { role: "Close focus ring",    alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Table + Badge + Alert)" },
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
          { tone: "note", text: "The Toast owns its auto-close timer and exit lifecycle. The consumer owns whether it's mounted — Toast never portals itself, never queues, and never removes itself from the DOM. When the exit animation completes, `onDismiss` fires and the parent should unmount." },
          { tone: "note", text: "Auto-close pauses on mouseenter + focusin, and resumes on mouseleave + focusout. Remaining time is preserved across pauses so a Toast set to 4s that pauses at 1s remaining still gets a full 1s on resume — no user gets robbed of reading time." },
          { tone: "note", text: "The variant matrix is 5 combinations. Each is a single CSS selector that sets two vars (--hc-toast-accent, --hc-toast-icon-color). The base .hc-toast selector reads those vars, so layout code is written once." },
          { tone: "note", text: "The accent stripe is a 4px inset ::before element on the left edge, painted with the variant accent color. The body typography stays neutral so the message reads consistently across every tone." },
          { tone: "note", text: "Exit animation duration (150ms) is duplicated between the CSS keyframe and a JS setTimeout in Toast.tsx — the two must stay in sync. Both reference the same overlayExit motion role in the token layer." },
          { tone: "note", text: "The Toast child-splitter walks Children.forEach and buckets by subcomponent type. First Icon / Close wins if the consumer accidentally authors two; everything else falls into the body stack in author order — same trick as Alert." },
        ]}
      />

      <Callout tone="info" title="Building on top of Toast">
        A downstream ToastProvider / ToastQueue / ToastRegion should wrap
        this primitive to handle: (1) mounting to a fixed portal region,
        (2) stacking / limiting visible siblings, (3) deduplicating repeat
        messages, (4) reordering by priority. This primitive is intentionally
        minimal — one Toast, one message, one lifetime — so those higher-level
        concerns compose cleanly without fighting internal state.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",   detail: "Every color, radius, spacing, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Card language",   detail: "Same radius.surface (12), same elevated white background, same inline.lg padding rhythm — a Toast reads as a floating Card." },
    { name: "HC1 Alert content",   detail: "Same body stack (Icon left, Title + Description + Actions middle, Close right), same variant-to-meaning map, same actions gap." },
    { name: "HC1 Button",          detail: "Toast.Actions hosts real Buttons (never bespoke tap targets). Focus rings and typography align across every family." },
    { name: "HC1 status palette",  detail: "Variants map through the same color.status.* aliases used by Alert + Badge — success in one primitive reads exactly like success in the others." },
    { name: "Native <div>",        detail: "The root is a real <div> with role='status' or role='alert'. No interactive wrapping, no <button> overloads." },
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
    { name: "Toast Region",         detail: "The fixed-portal region that hosts Toasts. Owns stacking, spacing between siblings, and the entrance/exit choreography of the queue. Not built yet." },
    { name: "Toast Queue",          detail: "A downstream queue provider that deduplicates repeat messages, caps visible siblings, and reorders by priority. Wraps this primitive; consumers push messages via a useToast() hook." },
    { name: "Save confirmations",   detail: "Post-save success feedback in forms and detail pages. Wraps Toast with variant='success' + auto-close default." },
    { name: "Delete confirmations", detail: "Post-delete success feedback, typically with an Undo action. Wraps Toast with variant='neutral' + Toast.Actions." },
    { name: "Upload notifications", detail: "'Upload complete' feedback after long-running attachment / import tasks. Wraps Toast with variant='success' + Upload icon." },
    { name: "Background jobs",      detail: "'Sync finished' / 'Report ready' notifications after asynchronous work. Wraps Toast with variant='neutral' + Cloud icon." },
    { name: "Validation summaries", detail: "'Some fields need attention' feedback after failed submit. Wraps Toast with variant='warning' + a Review action." },
    { name: "Connection warnings",  detail: "'Connection lost' / 'Server unreachable' notifications. Wraps Toast with variant='danger' + role='alert' + persistent + Retry action." },
    { name: "Session reminders",    detail: "'Session expiring in 2 minutes' style timeouts. Wraps Toast with variant='warning' + persistent + Extend action." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every transient feedback surface in HC1 should compose this Toast. These are the anticipated consumers — none are shipped yet."
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
              <BellRing size={14} color={t.color.action.primary} />
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
    { name: "ClinicalIQ save/delete notifications",  detail: "Bloodhealth + HerCare panels render bespoke floating banners for post-save / post-delete feedback. Migrate to Toast — same intent, unified elevation + accent stripe." },
    { name: "SourceIQ pipeline notifications",       detail: "SourceIQ pipeline banners use divergent green-teal floating pills. Migrate to Toast with variant='success' — same shape, unified surface." },
    { name: "Ad-hoc floating divs",                  detail: "Any prototype rendering an absolutely-positioned notification div should switch to Toast for the shared surface + auto-close + reduced-motion support." },
    { name: "Snackbar / notification widgets",       detail: "Third-party or hand-rolled snackbar components with divergent close-button, spacing, and animation. Migrate to Toast — the color-to-meaning map lives here, not per widget." },
    { name: "Error toasts using role='alert' everywhere", detail: "Existing implementations that use role='alert' on every message (including success). Migrate to Toast — the primitive defaults to role='status' and reserves 'alert' for genuine errors." },
    { name: "Non-pausable auto-close notifications", detail: "Existing toasts that dismiss after N seconds regardless of hover / focus. Migrate to Toast — the primitive pauses on hover/focus per WCAG 2.2.1." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Toast is the intended replacement for every transient floating notification across the HC1 ecosystem. Do not redesign — standardize."
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
    { label: "Accessible",               ok: true },
    { label: "Reduced-motion support",   ok: true },
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

function TextControl({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
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

function NumberControl({ label, value, onChange, min, max, step, disabled }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
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

