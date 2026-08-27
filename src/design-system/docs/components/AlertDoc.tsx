import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileText,
  Info,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";
import { Alert } from "../../components/alert";
import type {
  AlertAppearance,
  AlertVariant,
} from "../../components/alert";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: AlertVariant[]       = ["info", "success", "warning", "danger", "neutral"];
const APPEARANCES: AlertAppearance[] = ["soft", "outline", "solid"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function AlertDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <VariantsBlock />
      <AppearancesBlock />
      <FeaturesBlock />
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
      title="The canonical HC1 Alert"
      lead="Alert is the canonical inline-feedback primitive of the HC1 design system. Success messages, error banners, warning notices, information banners, AI insight blocks, empty notices, and inline validation summaries all compose this Alert rather than reimplementing color pairings, spacing, or dismiss behavior. It owns the color-to-meaning map, the layout ladder, and the ARIA role — so a 'Danger' Alert in one product reads exactly like a 'Danger' Alert in another."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="An Alert is a compound of five subcomponents. Children can be authored in any order — the root places Icon on the left, the body (Title + Description + Actions) in the middle, and Close on the right."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <Alert variant="success">
          <Alert.Icon><CheckCircle2 /></Alert.Icon>
          <Alert.Title>Data saved successfully</Alert.Title>
          <Alert.Description>Your changes have been written to the record.</Alert.Description>
          <Alert.Actions>
            <Button size="sm" variant="ghost">Undo</Button>
            <Button size="sm">View record</Button>
          </Alert.Actions>
          <Alert.Close onClick={() => {}} />
        </Alert>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Alert"             desc="Root <div>. Owns variant, appearance, ARIA role, and disabled state." />
        <Part name="Alert.Icon"        desc="Optional leading icon slot. Decorative — the meaning lives in the title + description." />
        <Part name="Alert.Title"       desc="Short heading. Renders as a <div> by default; pass as={4} etc. for landmark-level notices." />
        <Part name="Alert.Description" desc="Longer explanation. May contain paragraphs, lists, and inline links." />
        <Part name="Alert.Actions"     desc="Row of Buttons. Placed at the bottom of the body stack — primary on the right, ghost/secondary on the left." />
        <Part name="Alert.Close"       desc="Trailing X — a real <button> with aria-label='Dismiss'. Only interactive part of the Alert." />
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

/* ══════ Variants ═════════════════════════════════════════════════ */

const VARIANT_META: Record<AlertVariant, { title: string; example: string; icon: ReactNode; usage: string }> = {
  info:    { title: "Info",    example: "A newer version is available",     icon: <Info />,          usage: "Informational, non-actionable notice — a version bump, a documentation pointer." },
  success: { title: "Success", example: "Data saved successfully",           icon: <CheckCircle2 />, usage: "The action completed. Prefer inline confirmation over a Toast when the surface is right there." },
  warning: { title: "Warning", example: "Some required fields are missing",  icon: <AlertTriangle />, usage: "Attention needed, non-blocking. Prompts the user to look before proceeding." },
  danger:  { title: "Danger",  example: "Unable to connect to server",       icon: <XCircle />,       usage: "The action failed, or the surface is broken. Pair with role='alert' when the message needs immediate announcement." },
  neutral: { title: "Neutral", example: "Scheduled maintenance begins tonight", icon: <BellRing />,   usage: "System messages, hints, muted meta. The quietest alert — a heads-up, not a status." },
};

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Five semantic tones. Pick by meaning, not color — the token layer decides the exact palette. Same variant → same meaning across every HC1 product."
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
            <Alert variant={v}>
              <Alert.Icon>{VARIANT_META[v].icon}</Alert.Icon>
              <Alert.Title>{VARIANT_META[v].title}</Alert.Title>
              <Alert.Description>{VARIANT_META[v].example}</Alert.Description>
            </Alert>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Appearances ═════════════════════════════════════════════ */

function AppearancesBlock() {
  const APPEARANCE_NOTE: Record<AlertAppearance, string> = {
    soft:    "Subtle wash + colored ink + colored border. The default — quiet enough to sit inside a Card or a form section without stealing focus.",
    outline: "Page background + colored border + colored ink. For alerts on colored parent surfaces where the soft wash would clash.",
    solid:   "Filled variant color + inverse ink. Reserved for high-emphasis moments — an outage banner, a scheduled-downtime notice. Loud; use sparingly.",
  };
  return (
    <DocBlock
      title="Appearances"
      lead="Three visual weights. Every variant is defined under every appearance — so switching appearance never changes meaning."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        {APPEARANCES.map((a) => (
          <div key={a}>
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, marginBottom: t.space.stack.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                appearance=&quot;{a}&quot;
              </code>
              <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>— {APPEARANCE_NOTE[a]}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
              {VARIANTS.map((v) => (
                <Alert key={v} variant={v} appearance={a}>
                  <Alert.Icon>{VARIANT_META[v].icon}</Alert.Icon>
                  <Alert.Title>{VARIANT_META[v].title}</Alert.Title>
                  <Alert.Description>{VARIANT_META[v].example}</Alert.Description>
                </Alert>
              ))}
            </div>
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
      lead="Every feature is a one-subcomponent opt-in. There is no configuration explosion — compose only the pieces you need."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Title only" hint="<Alert.Title />">
          <Alert variant="warning">
            <Alert.Icon><AlertTriangle /></Alert.Icon>
            <Alert.Title>Some required fields are missing</Alert.Title>
          </Alert>
        </FeatureTile>

        <FeatureTile title="Title + description" hint="+ <Alert.Description />">
          <Alert variant="info">
            <Alert.Icon><Info /></Alert.Icon>
            <Alert.Title>A newer version is available</Alert.Title>
            <Alert.Description>Refresh the page to load version 3.4.1.</Alert.Description>
          </Alert>
        </FeatureTile>

        <FeatureTile title="Actions" hint="+ <Alert.Actions />">
          <Alert variant="danger">
            <Alert.Icon><XCircle /></Alert.Icon>
            <Alert.Title>Unable to connect to server</Alert.Title>
            <Alert.Description>Your last change hasn't been saved. Retry or copy your work.</Alert.Description>
            <Alert.Actions>
              <Button size="sm" variant="ghost">Copy work</Button>
              <Button size="sm">Retry</Button>
            </Alert.Actions>
          </Alert>
        </FeatureTile>

        <FeatureTile title="Dismissible" hint="+ <Alert.Close onClick={…} />">
          <Alert variant="success">
            <Alert.Icon><CheckCircle2 /></Alert.Icon>
            <Alert.Title>Data saved successfully</Alert.Title>
            <Alert.Description>Your changes have been written to the record.</Alert.Description>
            <Alert.Close onClick={() => {}} />
          </Alert>
        </FeatureTile>

        <FeatureTile title="Multi-line description" hint="paragraphs / lists">
          <Alert variant="neutral">
            <Alert.Icon><BellRing /></Alert.Icon>
            <Alert.Title>Scheduled maintenance begins tonight</Alert.Title>
            <Alert.Description>
              <p>Between 22:00 and 23:00 UTC the following services will be unavailable:</p>
              <p>• Report exports<br />• Weekly digest email<br />• Third-party sync</p>
            </Alert.Description>
          </Alert>
        </FeatureTile>

        <FeatureTile title="Disabled (visual only)" hint="disabled">
          <Alert variant="info" disabled>
            <Alert.Icon><Info /></Alert.Icon>
            <Alert.Title>A newer version is available</Alert.Title>
            <Alert.Description>Grayed out — for archived or expired notices.</Alert.Description>
            <Alert.Close onClick={() => {}} />
          </Alert>
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
          { tone: "must", text: "The Alert renders with role='status' by default (announced politely). Reserve role='alert' for messages that require immediate announcement — form-submit failures, lost connections, danger surfaces. Non-critical status/info/success/warning alerts should stay on 'status'." },
          { tone: "must", text: "aria-live is wired to match the role — 'polite' for status, 'assertive' for alert. Consumers do not need to pass aria-live directly." },
          { tone: "must", text: "Alert.Icon is aria-hidden by default. Meaning must live in the title + description. If a variant color is the only signal (e.g. an icon-only Alert), pass an aria-label on the root." },
          { tone: "must", text: "Alert.Close is a real <button> with an accessible name (via `label`, default 'Dismiss'). It uses the same 2px brand focus ring as Button, Input, Select, Card, Dialog, Table, and Badge." },
          { tone: "must", text: "disabled sets aria-disabled='true' on the Alert root and disables Alert.Close so it is skipped in the tab order. The Alert itself is not a form control." },
          { tone: "must", text: "The Alert root is never a button and never wraps a link. Only Alert.Close is interactive — preserves the 'an Alert is a message, not an action' rule." },
          { tone: "must", text: "Every variant × appearance pairing meets WCAG AA (4.5:1 for body text; 3:1 for ≥18px title) on the design-system background swatches." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the color/background/opacity transitions to 0ms." },
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
          { title: "One alert, one message",           description: "Every Alert communicates one thing. If two things need saying, that's two Alerts — not one paragraph mash-up." },
          { title: "Prefer inline feedback over toast", description: "When the affected surface is on-screen, use Alert. Toast is for messages the user can't see the source of." },
          { title: "Use role='alert' sparingly",       description: "Only for messages that need immediate announcement — form-submit failures, lost connections, danger surfaces. Everything else is role='status'." },
          { title: "Pair color with an icon and text", description: "Add Alert.Icon and Alert.Title — never rely on the variant color alone to convey meaning." },
        ]}
        donts={[
          { title: "Use Alert for a workflow decision", description: "If the user must click Yes/No to proceed, that's a Dialog. Alert is a message, not a modal question." },
          { title: "Stack four Alerts on a page",      description: "The wall becomes wallpaper. Consolidate into one Alert with a list, or move less-critical messages into a Toast queue." },
          { title: "Use Alert for a persistent status", description: "'Server offline' is a system-level status — surface it via a persistent banner or a top-of-page slot, not as a dismissible Alert that returns after every action." },
          { title: "Nest an Alert inside another Alert", description: "Nested Alerts confuse ARIA announcements and double the visual noise. Redesign the message into one." },
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
          { tone: "must-not", text: "Don't render an Alert as a <button> or wrap the whole thing in a link. Only Alert.Close is interactive." },
          { tone: "must-not", text: "Don't override the palette inline. Every variant × appearance is a token contract — a hand-picked hex breaks the color-to-meaning map for the whole product." },
          { tone: "must-not", text: "Don't build a Toast, Snackbar, Notification Center, or Modal Alert on top of this. Those are separate primitives with different lifetimes and ARIA models. Alert is inline and stateless." },
          { tone: "must-not", text: "Don't use Alert for a form field's validation message. Field-level validation belongs on the Input (via errorMessage / warningMessage / successMessage). Alert is for form-level or page-level feedback." },
          { tone: "must-not", text: "Don't ship a specialized SuccessMessage / ErrorMessage / WarningNotice / InfoBanner component that reimplements this Alert. Compose Alert with a typed variant — the color-to-meaning map lives here, not in each product." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]           = useState<AlertVariant>("info");
  const [appearance, setAppearance]     = useState<AlertAppearance>("soft");
  const [title, setTitle]               = useState("A newer version is available");
  const [description, setDescription]   = useState("Refresh the page to load version 3.4.1.");
  const [longContent, setLongContent]   = useState(false);
  const [hasIcon, setHasIcon]           = useState(true);
  const [dismissible, setDismissible]   = useState(false);
  const [primaryAction, setPrimaryAction]     = useState(false);
  const [secondaryAction, setSecondaryAction] = useState(false);

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered alert in real time. Live JSX is generated in the dark panel at the bottom.">
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
          <Alert variant={variant} appearance={appearance}>
            {hasIcon && <Alert.Icon>{VARIANT_META[variant].icon}</Alert.Icon>}
            {title && <Alert.Title>{title}</Alert.Title>}
            {description && (
              <Alert.Description>
                {longContent ? (
                  <>
                    <p>{description}</p>
                    <p>Additional context: this notice will remain visible until you dismiss it, and it will not reappear on the next page load.</p>
                    <p>• Item one about this change<br />• Item two with more detail<br />• Item three closing the summary</p>
                  </>
                ) : (
                  description
                )}
              </Alert.Description>
            )}
            {(primaryAction || secondaryAction) && (
              <Alert.Actions>
                {secondaryAction && <Button size="sm" variant="ghost">Learn more</Button>}
                {primaryAction   && <Button size="sm">Take action</Button>}
              </Alert.Actions>
            )}
            {dismissible && <Alert.Close onClick={() => {}} />}
          </Alert>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="variant"    value={variant}    options={VARIANTS}    onChange={(v) => setVariant(v as AlertVariant)} />
          <SelectControl label="appearance" value={appearance} options={APPEARANCES} onChange={(v) => setAppearance(v as AlertAppearance)} />
          <TextControl   label="title"       value={title}       onChange={setTitle} />
          <TextControl   label="description" value={description} onChange={setDescription} />
          <ToggleControl label="leading icon"     value={hasIcon}         onChange={setHasIcon} />
          <ToggleControl label="dismissible"      value={dismissible}     onChange={setDismissible} />
          <ToggleControl label="primary action"   value={primaryAction}   onChange={setPrimaryAction} />
          <ToggleControl label="secondary action" value={secondaryAction} onChange={setSecondaryAction} />
          <ToggleControl label="long content"     value={longContent}     onChange={setLongContent} />
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
{renderCode({ variant, appearance, title, description, hasIcon, dismissible, primaryAction, secondaryAction, longContent })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: AlertVariant;
  appearance: AlertAppearance;
  title: string;
  description: string;
  hasIcon: boolean;
  dismissible: boolean;
  primaryAction: boolean;
  secondaryAction: boolean;
  longContent: boolean;
}) {
  const attrs: string[] = [];
  if (s.variant !== "info")    attrs.push(`variant="${s.variant}"`);
  if (s.appearance !== "soft") attrs.push(`appearance="${s.appearance}"`);
  const open = attrs.length ? `<Alert ${attrs.join(" ")}>` : `<Alert>`;

  const lines: string[] = [];
  lines.push(open);
  if (s.hasIcon)      lines.push(`  <Alert.Icon><Info /></Alert.Icon>`);
  if (s.title)        lines.push(`  <Alert.Title>${esc(s.title)}</Alert.Title>`);
  if (s.description) {
    if (s.longContent) {
      lines.push(`  <Alert.Description>`);
      lines.push(`    <p>${esc(s.description)}</p>`);
      lines.push(`    <p>Additional paragraph…</p>`);
      lines.push(`  </Alert.Description>`);
    } else {
      lines.push(`  <Alert.Description>${esc(s.description)}</Alert.Description>`);
    }
  }
  if (s.primaryAction || s.secondaryAction) {
    lines.push(`  <Alert.Actions>`);
    if (s.secondaryAction) lines.push(`    <Button size="sm" variant="ghost">Learn more</Button>`);
    if (s.primaryAction)   lines.push(`    <Button size="sm">Take action</Button>`);
    lines.push(`  </Alert.Actions>`);
  }
  if (s.dismissible) lines.push(`  <Alert.Close onClick={() => {}} />`);
  lines.push(`</Alert>`);
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
      lead="Illustrative — not shipped as reusable components. Every example uses the same primitive with different composition."
    >
      <div style={{ display: "grid", gap: t.space.inline.md }}>
        <Alert variant="success">
          <Alert.Icon><CheckCircle2 /></Alert.Icon>
          <Alert.Title>Data saved successfully</Alert.Title>
          <Alert.Description>Your changes have been written to the patient record.</Alert.Description>
          <Alert.Close onClick={() => {}} />
        </Alert>

        <Alert variant="warning">
          <Alert.Icon><AlertTriangle /></Alert.Icon>
          <Alert.Title>Some required fields are missing</Alert.Title>
          <Alert.Description>Fill in <strong>Date of Birth</strong> and <strong>Primary Care Provider</strong> before submitting.</Alert.Description>
        </Alert>

        <Alert variant="danger" role="alert">
          <Alert.Icon><XCircle /></Alert.Icon>
          <Alert.Title>Unable to connect to server</Alert.Title>
          <Alert.Description>Your last change hasn't been saved. Retry the sync or copy your work to another surface.</Alert.Description>
          <Alert.Actions>
            <Button size="sm" variant="ghost">Copy work</Button>
            <Button size="sm">Retry</Button>
          </Alert.Actions>
        </Alert>

        <Alert variant="info">
          <Alert.Icon><Info /></Alert.Icon>
          <Alert.Title>A newer version is available</Alert.Title>
          <Alert.Description>Refresh the page to load version 3.4.1. Your work will be preserved.</Alert.Description>
          <Alert.Actions>
            <Button size="sm">Refresh</Button>
          </Alert.Actions>
          <Alert.Close onClick={() => {}} />
        </Alert>

        <Alert variant="info" appearance="outline">
          <Alert.Icon><Sparkles /></Alert.Icon>
          <Alert.Title>AI detected an unusual trend in patient admissions</Alert.Title>
          <Alert.Description>Cardiology admissions are up 34% week-over-week compared to the 4-week rolling average. Consider reviewing the ED throughput dashboard.</Alert.Description>
          <Alert.Actions>
            <Button size="sm" variant="ghost">Dismiss</Button>
            <Button size="sm" rightIcon={<ArrowRight />}>Open dashboard</Button>
          </Alert.Actions>
        </Alert>

        <Alert variant="neutral">
          <Alert.Icon><Wrench /></Alert.Icon>
          <Alert.Title>Scheduled maintenance begins tonight</Alert.Title>
          <Alert.Description>Between 22:00 and 23:00 UTC, report exports and third-party sync will be unavailable.</Alert.Description>
          <Alert.Close onClick={() => {}} />
        </Alert>

        <Alert variant="warning" appearance="solid" role="alert">
          <Alert.Icon><AlertCircle /></Alert.Icon>
          <Alert.Title>System-wide outage</Alert.Title>
          <Alert.Description>Live for illustration — solid appearance reserved for high-emphasis moments only.</Alert.Description>
        </Alert>
      </div>
    </DocBlock>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "variant",    type: "'info' | 'success' | 'warning' | 'danger' | 'neutral'", def: "'info'",    desc: "Semantic tone." },
  { name: "appearance", type: "'soft' | 'outline' | 'solid'",                          def: "'soft'",    desc: "Visual weight." },
  { name: "role",       type: "'alert' | 'status'",                                    def: "'status'",  desc: "ARIA role. Use 'alert' only for messages requiring immediate announcement." },
  { name: "disabled",   type: "boolean",                                               def: "false",     desc: "Dim the Alert and disable Alert.Close. Visual only." },
  { name: "children",   type: "ReactNode",                                             def: "—",         desc: "Compose with Alert.Icon, Alert.Title, Alert.Description, Alert.Actions, Alert.Close." },
];

const PROPS_TITLE: PropRow[] = [
  { name: "as",       type: "'div' | 1 | 2 | 3 | 4 | 5 | 6", def: "'div'", desc: "Heading level. Default is <div> — set as={4} for landmark-level notices." },
  { name: "children", type: "ReactNode",                     def: "—",     desc: "Title text." },
];

const PROPS_CLOSE: PropRow[] = [
  { name: "onClick",  type: "(e) => void",   def: "—",         desc: "Fired when the dismiss control activates." },
  { name: "label",    type: "string",        def: "'Dismiss'", desc: "Accessible name for the dismiss control." },
  { name: "disabled", type: "boolean",       def: "—",         desc: "Explicit disable. Automatically true when the parent Alert is disabled." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Alert"           rows={PROPS_ROOT} />
      <PropsSubsection title="Alert.Title"     rows={PROPS_TITLE} />
      <PropsSubsection title="Alert.Close"     rows={PROPS_CLOSE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Alert.Icon, Alert.Description, and Alert.Actions have no props beyond standard HTML attributes.
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
    { role: "Radius",            alias: "aliases.radius.surface (12 — matches Card + Dialog + Table)" },
    { role: "Padding",           alias: "aliases.spacing.stack.md (12 vertical) + inline.lg (16 horizontal) — matches Card comfortable" },
    { role: "Outer gap",         alias: "aliases.spacing.inline.md (12 — icon / body / close)" },
    { role: "Body gap",          alias: "aliases.spacing.stack.xs (4 — title / description / actions)" },
    { role: "Actions gap",       alias: "aliases.spacing.inline.sm (8 — matches Card.Actions + Dialog.Actions)" },
    { role: "Actions padding",   alias: "aliases.spacing.stack.sm (8 — separates the row from the description)" },
    { role: "Soft palette",      alias: "aliases.color.status.{success|warning|error|info}.{bg,fg,border} · text.secondary + border.default (neutral)" },
    { role: "Outline palette",   alias: "aliases.color.background.default bg · variant.fg text · variant.border border" },
    { role: "Solid palette",     alias: "variant.fg bg (danger uses action.danger, neutral uses action.secondary) · text.inverse ink" },
    { role: "Icon color",        alias: "aliases.color.status.*.icon (soft/outline) · text.inverse (solid) · text.tertiary (neutral soft/outline)" },
    { role: "Title typography",  alias: "16 semibold — matches Card title rhythm" },
    { role: "Description font",  alias: "aliases.typography.bodyS (14 regular) — matches Input body text" },
    { role: "Close hover wash",  alias: "color-mix(currentColor 12%, transparent) — works uniformly across every variant × appearance" },
    { role: "Close focus ring",  alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog + Table + Badge)" },
    { role: "Disabled opacity",  alias: "components.alert.disabled.opacity (0.5)" },
    { role: "Transition",        alias: "aliases.motion.hoverIn — duration 150, easing standard (matches Button + Card)" },
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
          { tone: "note", text: "The Alert splits its children into three slots — Icon (left), Body (middle: Title + Description + Actions), Close (right) — by inspecting each child's component type. The consumer can author the children in any order and the layout stays stable." },
          { tone: "note", text: "The variant × appearance matrix is 5 × 3 = 15 combinations. Each is a single CSS selector that sets four vars (bg, fg, border, icon). The base .hc-alert selector reads those vars, so layout code is written once." },
          { tone: "note", text: "The Alert is stateless — it does not manage its own dismissal. Consumers own the visible/hidden state and unmount the Alert on dismiss. This keeps the primitive small and lets a downstream Toast queue (or an animated presence library) wrap it without fighting internal state." },
          { tone: "note", text: "Alert.Title defaults to a plain <div> — most Alerts are inline notices, not page-level landmarks. Set `as={4}` (or another heading level) when the Alert *is* a landmark — a form-level validation summary at the top of a form." },
          { tone: "note", text: "The Alert never becomes a button or a link. Only Alert.Close is interactive. Wrapping the Alert in a link would create an ambiguous focus target and mix message semantics with navigation." },
          { tone: "note", text: "The close-button hover wash uses `color-mix(currentColor 12%, transparent)` so the same rule works across every variant × appearance without a per-variant override — same trick as Badge." },
        ]}
      />

      <Callout tone="info" title="Extending Alert">
        (1) Downstream feedback surfaces (SuccessMessage, ErrorMessage,
        WarningNotice, InfoBanner, AIInsightBlock, EmptyNotice,
        ValidationSummary) should be thin compositions on top of this Alert
        — wrap it with the surface's opinionated content and reuse every
        visual choice. (2) A new variant should only be added if a genuine
        semantic role emerges (e.g. a compliance-mandated 'legal' tone).
        Add the tone to
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/alert.ts
        </code>
        and the matching CSS rule in Alert.css before using it.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",   detail: "Every color, radius, spacing, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Card language",   detail: "Same radius.surface (12), same inline.lg padding (16), same body-stack rhythm — an Alert reads as a compact Card carrying a single message." },
    { name: "HC1 Badge palette",   detail: "Variants map through the same color.status.* aliases used by Badge — success in one primitive reads exactly like success in the other." },
    { name: "HC1 Button",          detail: "Alert.Actions hosts real Buttons (never bespoke tap targets). Focus rings and typography align across every family." },
    { name: "Native <div>",        detail: "The root is a real <div> with the appropriate ARIA role. No interactive wrapping, no <button> or <a> overloads." },
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
    { name: "Success Message",       detail: "Post-save confirmations inside forms and detail pages. Wraps Alert with variant='success' + dismissible." },
    { name: "Error Message",         detail: "Form-level or page-level error summaries. Wraps Alert with variant='danger' + role='alert' + retry action." },
    { name: "Warning Notice",        detail: "Non-blocking heads-up inside a workflow. Wraps Alert with variant='warning'." },
    { name: "Info Banner",           detail: "Top-of-page info banners (new-version prompts, environment reminders). Wraps Alert with variant='info' + solid appearance." },
    { name: "AI Insight Block",      detail: "Ambient AI-generated observations. Wraps Alert with variant='info' + outline appearance + Sparkles icon + open-detail action." },
    { name: "Empty Notice",          detail: "Empty-state messaging inside dashboards and tables. Wraps Alert with variant='neutral'." },
    { name: "Validation Summary",    detail: "Form-level validation aggregation. Wraps Alert with variant='warning' + Alert.Title as an h4 landmark + a description that lists the field errors." },
    { name: "Maintenance Notice",    detail: "Scheduled-downtime banners. Wraps Alert with variant='neutral' + solid appearance + dismissible." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every inline feedback surface in HC1 should compose this Alert. These are the anticipated consumers — none are shipped yet."
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
    { name: "ClinicalIQ inline notices",     detail: "Bloodhealth + HerCare panels currently render bespoke coloured banners for post-save / retry / validation messages. Migrate to Alert with the semantic variant — no UX changes, just token unification." },
    { name: "SourceIQ pipeline warnings",     detail: "SourceIQ pipeline banners use divergent yellow-green palettes. Migrate to Alert with variant='warning' + outline appearance — same tone, unified palette." },
    { name: "Form-level error summaries",     detail: "Ad-hoc red boxes at the top of forms should switch to Alert with variant='danger' + role='alert' + Alert.Title as h3/h4 for landmark navigation." },
    { name: "AI insight cards",               detail: "Existing AI insight blocks that render an icon + message + open-detail action are just Alert with variant='info' + outline + Sparkles icon." },
    { name: "Scheduled-maintenance banners",  detail: "System-message banners at the top of the shell should switch to Alert with variant='neutral' + solid appearance for high visibility." },
    { name: "Prototype toasts (mis-labelled)", detail: "Some prototype code labels inline messages 'Toast' but renders them inline — those are Alerts. Migrate; keep Toast for time-limited, out-of-flow notifications." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Alert is the intended replacement for every inline notice, banner, and feedback message across the HC1 ecosystem. Do not redesign — standardize."
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
    { label: "Uses HC1 Design Tokens only",         ok: true },
    { label: "Uses semantic aliases only",          ok: true },
    { label: "No hardcoded values",                 ok: true },
    { label: "Keyboard accessible",                 ok: true },
    { label: "Responsive",                          ok: true },
    { label: "Composable API",                      ok: true },
    { label: "Consistent with Button, Card, Badge", ok: true },
    { label: "Production ready",                    ok: true },
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
