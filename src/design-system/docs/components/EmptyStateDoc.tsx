import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BellOff,
  Bot,
  Filter,
  FileText,
  Inbox,
  LockKeyhole,
  Package,
  Rocket,
  Search,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Users,
  WifiOff,
} from "lucide-react";
import { EmptyState } from "../../components/empty-state";
import type {
  EmptyStateLayout,
  EmptyStateVariant,
} from "../../components/empty-state";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: EmptyStateVariant[] = ["default", "search", "onboarding", "error", "permission", "offline"];
const LAYOUTS:  EmptyStateLayout[]  = ["centered", "contained"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function EmptyStateDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <VariantsBlock />
      <LayoutsBlock />
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
      title="The canonical HC1 Empty State"
      lead="EmptyState is the canonical zero-state primitive of the HC1 design system. Empty tables, no-search-results screens, first-time setup panels, offline fallbacks, and permission-denied surfaces all compose this EmptyState rather than reimplementing centered stacks. It owns the layout ladder, the icon-container tint per variant, and the ARIA wiring — so every empty state in HC1 answers the same three questions the same way."
    />
    );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part maps 1:1 to a subcomponent. Children can be authored in any order — the root arranges them in the canonical vertical stack."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <EmptyState variant="default">
          <EmptyState.Icon><Users /></EmptyState.Icon>
          <EmptyState.Title>No patients yet</EmptyState.Title>
          <EmptyState.Description>
            Add your first patient to start tracking care plans and orders.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button variant="secondary">Import from CSV</Button>
            <Button leftIcon={<UserPlus />}>Add patient</Button>
          </EmptyState.Actions>
          <EmptyState.Footer>
            Need help? <a href="#" style={{ color: t.color.text.link }}>Read the getting-started guide</a>.
          </EmptyState.Footer>
        </EmptyState>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="EmptyState"              desc="Root <div role='status'>. Owns variant, layout, and loading state." />
        <Part name="EmptyState.Icon"         desc="Small icon inside a variant-tinted round container. Decorative — aria-hidden." />
        <Part name="EmptyState.Illustration" desc="Larger uncontained slot for a bespoke SVG. Wins over Icon if both are provided." />
        <Part name="EmptyState.Title"        desc="Short heading. Renders as h3 by default; set as={2} when the empty state is the page's main content." />
        <Part name="EmptyState.Description"  desc="One or two sentences explaining what happened and what the user can do." />
        <Part name="EmptyState.Actions"      desc="Row of Buttons. Primary on the right; ghost/secondary on the left. Skip when the user cannot act." />
        <Part name="EmptyState.Footer"       desc="Small footer text or link row for help pointers. Sits below a subtle divider." />
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
      lead="EmptyState is a compound component. Prefer composing named subcomponents over configuring booleans."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<EmptyState variant="search">
  <EmptyState.Icon><Search /></EmptyState.Icon>
  <EmptyState.Title>No results</EmptyState.Title>
  <EmptyState.Description>
    Try a different search term or clear the filters.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="ghost">Clear filters</Button>
  </EmptyState.Actions>
</EmptyState>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<EmptyState
  icon={<Search />}
  title="No results"
  description="Try a different search…"
  primaryAction={{ label: "Retry", onClick: … }}
  secondaryAction={{ label: "Clear filters", onClick: … }}
  showIcon
  showFooter
  variant="search"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Only EmptyState is structurally required. Icon, Illustration, Title, Description, Actions, and Footer are opt-in — compose only the pieces the surface needs." },
          { tone: "should",   text: "Author children in any order — the root arranges them in the canonical vertical stack (Icon/Illustration → Title → Description → Actions → Footer)." },
          { tone: "should",   text: "Use Icon (compact round container) for stock lucide glyphs. Use Illustration (larger uncontained slot) for bespoke SVGs. Never render both — Illustration wins." },
          { tone: "must-not", text: "Never introduce icon / title / description / actions as props on the root. This is a compound component — the child API is the whole point." },
          { tone: "must-not", text: "Never render EmptyState as a <button>. Only the Buttons inside Actions are interactive." },
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

const VARIANT_META: Record<EmptyStateVariant, { title: string; icon: ReactNode; description: string; hint: string }> = {
  default:    { title: "No records",            icon: <Inbox />,       description: "There's nothing to show here yet.",                                    hint: "The quiet default. Use for empty lists without a strong semantic signal." },
  search:     { title: "No results",            icon: <Search />,      description: "Try a different search term or clear the filters.",                    hint: "Zero-hit search or filter states. Same neutral tint as default." },
  onboarding: { title: "Welcome to ClinicalIQ", icon: <Rocket />,      description: "Let's set up your workspace. It only takes a minute.",                 hint: "First-time setup, welcome moments — soft brand tint on the icon container." },
  error:      { title: "Couldn't load reports", icon: <ShieldAlert />, description: "Something went wrong on our side. Retry or contact support.",          hint: "The surface failed to load. Soft danger tint — pair with a retry action." },
  permission: { title: "No access",             icon: <LockKeyhole />, description: "Your role doesn't include access to this section. Ask an admin.",     hint: "The user lacks permission. Soft warning tint. Usually no primary action." },
  offline:    { title: "You're offline",        icon: <WifiOff />,     description: "Check your connection. We'll retry automatically when you're back.",  hint: "Environment / connectivity issue. Muted tint — no primary action if it self-heals." },
};

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Six semantic variants. Only the icon container's tint changes — the surrounding layout, typography, and actions stay neutral so the content carries the meaning."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {VARIANTS.map((v) => (
          <div
            key={v}
            style={{
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: `${t.space.stack.sm} ${t.space.inline.lg}`, background: t.color.background.subtle, borderBottom: `1px solid ${t.color.border.subtle}` }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                variant=&quot;{v}&quot;
              </code>
              <div style={{ ...t.type.caption, color: t.color.text.tertiary, marginTop: 4 }}>{VARIANT_META[v].hint}</div>
            </div>
            <EmptyState variant={v} layout="contained">
              <EmptyState.Icon>{VARIANT_META[v].icon}</EmptyState.Icon>
              <EmptyState.Title>{VARIANT_META[v].title}</EmptyState.Title>
              <EmptyState.Description>{VARIANT_META[v].description}</EmptyState.Description>
            </EmptyState>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Layouts ══════════════════════════════════════════════════ */

function LayoutsBlock() {
  const LAYOUT_META: Record<EmptyStateLayout, { title: string; usage: string; minH: string }> = {
    centered:  { title: "Centered",  minH: "320px", usage: "Default. Generous padding, tall min-height, content vertically + horizontally centered. Use on a page or a full-height panel." },
    contained: { title: "Contained", minH: "240px", usage: "Compact. Shorter min-height, tighter padding. Use inside a Card content area, a Dialog body, or a Tab panel." },
  };
  return (
    <DocBlock
      title="Layouts"
      lead="Two layout modes. Pick by where the empty state lives — the page vs. a nested surface."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        {LAYOUTS.map((l) => (
          <div key={l}>
            <div style={{ display: "flex", alignItems: "baseline", gap: t.space.inline.sm, marginBottom: t.space.stack.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                layout=&quot;{l}&quot;
              </code>
              <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{LAYOUT_META[l].minH} — {LAYOUT_META[l].usage}</span>
            </div>
            <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
              <EmptyState variant="default" layout={l}>
                <EmptyState.Icon><FileText /></EmptyState.Icon>
                <EmptyState.Title>{LAYOUT_META[l].title} layout</EmptyState.Title>
                <EmptyState.Description>
                  Notice the padding and min-height difference compared to the other layout.
                </EmptyState.Description>
                <EmptyState.Actions>
                  <Button variant="secondary">Secondary</Button>
                  <Button>Primary action</Button>
                </EmptyState.Actions>
              </EmptyState>
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
    <DocBlock title="Features">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Icon only" hint="<EmptyState.Icon />">
          <EmptyState layout="contained">
            <EmptyState.Icon><Inbox /></EmptyState.Icon>
            <EmptyState.Title>Nothing to see here</EmptyState.Title>
            <EmptyState.Description>Icon in a compact round container.</EmptyState.Description>
          </EmptyState>
        </FeatureTile>

        <FeatureTile title="Illustration" hint="<EmptyState.Illustration />">
          <EmptyState layout="contained">
            <EmptyState.Illustration><FakeIllustration /></EmptyState.Illustration>
            <EmptyState.Title>Bring your own art</EmptyState.Title>
            <EmptyState.Description>Compose a bespoke SVG in the illustration slot.</EmptyState.Description>
          </EmptyState>
        </FeatureTile>

        <FeatureTile title="Two actions" hint="<EmptyState.Actions />">
          <EmptyState layout="contained">
            <EmptyState.Icon><Package /></EmptyState.Icon>
            <EmptyState.Title>No orders yet</EmptyState.Title>
            <EmptyState.Description>Import your first batch or add one manually.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="secondary">Import CSV</Button>
              <Button>Add order</Button>
            </EmptyState.Actions>
          </EmptyState>
        </FeatureTile>

        <FeatureTile title="Footer" hint="<EmptyState.Footer />">
          <EmptyState layout="contained">
            <EmptyState.Icon><Search /></EmptyState.Icon>
            <EmptyState.Title>No results</EmptyState.Title>
            <EmptyState.Description>Try adjusting the filters above.</EmptyState.Description>
            <EmptyState.Footer>
              Still stuck? <a href="#" style={{ color: t.color.text.link }}>Contact support</a>.
            </EmptyState.Footer>
          </EmptyState>
        </FeatureTile>

        <FeatureTile title="Loading placeholder" hint="loading">
          <EmptyState layout="contained" loading />
        </FeatureTile>

        <FeatureTile title="No action" hint="skip <EmptyState.Actions />">
          <EmptyState variant="permission" layout="contained">
            <EmptyState.Icon><LockKeyhole /></EmptyState.Icon>
            <EmptyState.Title>No access</EmptyState.Title>
            <EmptyState.Description>
              This section is restricted to admins. There's nothing you can do here directly — the empty state has no primary action.
            </EmptyState.Description>
          </EmptyState>
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
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
        {children}
      </div>
    </div>
  );
}

function FakeIllustration() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" role="img" aria-label="Empty box illustration">
      <rect x="20" y="30" width="120" height="70" rx="12" fill={t.color.background.subtle} stroke={t.color.border.default} strokeWidth="1.5" />
      <path d="M40 30 L80 12 L120 30" stroke={t.color.border.default} strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="65" r="14" fill={t.color.background.muted} />
      <circle cx="80" cy="65" r="6"  fill={t.color.background.default} />
    </svg>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The root uses role='status' with aria-live='polite' so screen readers announce the empty state when it appears. If the empty state renders on every re-render, wrap the surface in a conditional so the announcement fires once." },
          { tone: "must", text: "EmptyState.Title renders as an <h3> by default — pair with the surrounding page outline. Pass `as={2}` when the empty state IS the page's main content." },
          { tone: "must", text: "EmptyState.Icon and EmptyState.Illustration are aria-hidden by default. The meaning lives in the title + description. Add a role='img' + aria-label to the SVG inside Illustration if the visual carries information the text does not." },
          { tone: "must", text: "Every button inside EmptyState.Actions is a real HC1 Button — full keyboard support, native focus ring, and correct disabled semantics." },
          { tone: "must", text: "The loading state sets aria-busy='true' on the root. The skeleton itself is aria-hidden so it doesn't confuse assistive tech." },
          { tone: "must", text: "prefers-reduced-motion: reduce slows the skeleton pulse to 3500ms so it doesn't distract users with vestibular sensitivity." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <Callout tone="info" title="Every EmptyState should answer three questions">
        (1) What happened? &nbsp; (2) Why is the screen empty? &nbsp; (3) What
        should the user do next? &nbsp; If the answer to #3 is "nothing they can
        do", skip the primary action — never invent one for symmetry.
      </Callout>

      <DoDontGrid
        dos={[
          { title: "Answer the three questions",         description: "Title = what. Description = why. Actions = next step. Every empty state carries all three unless one is genuinely absent." },
          { title: "Use the semantic variant",           description: "search / onboarding / error / permission / offline all read differently to a user. The tint is subtle — pick by meaning, not aesthetics." },
          { title: "Match layout to context",            description: "Full-page empty → centered. Nested inside a Card / Dialog / Tab panel → contained." },
          { title: "Skip the primary action when moot",  description: "If the user genuinely cannot resolve the state (permission denied, offline), a disabled or dead-end button is worse than none." },
        ]}
        donts={[
          { title: "Decorate without guidance",           description: "A friendly icon and a title that says 'Nothing here' is not an empty state — it's a shrug. Explain the state and offer a next step." },
          { title: "Use EmptyState as a marketing surface", description: "Empty states are functional. If you need to sell a feature, that's an Onboarding Card or a Feature Callout — not an EmptyState." },
          { title: "Stack three primary actions",         description: "One primary, at most one secondary. If more actions are needed, the empty state is doing too much — split the surface." },
          { title: "Reuse the same empty state everywhere", description: "Every table / list / dashboard has its own zero-state semantics. Compose EmptyState per surface — do not ship a single 'DefaultEmpty' component that all lists reach for." },
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
          { tone: "must-not", text: "Don't wrap EmptyState in a role='button' or link — it's an inline surface, not an action." },
          { tone: "must-not", text: "Don't override the icon container's tint inline. The variant → tint map is a token contract; a hand-picked hex breaks the semantic-color-to-meaning rule across the product." },
          { tone: "must-not", text: "Don't render both Icon and Illustration in the same EmptyState — Illustration wins and Icon is ignored. Pick one." },
          { tone: "must-not", text: "Don't ship an OnboardingScreen / WalkthroughStep / AIWelcomeCard that reimplements this EmptyState. Compose EmptyState with variant='onboarding' + your content — the appearance-to-meaning map lives here." },
          { tone: "must-not", text: "Don't use EmptyState for a validation error next to a form field. Field-level errors belong on the Input (errorMessage). Form-level errors belong on an Alert. EmptyState is for zero-state surfaces, not error text." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]                 = useState<EmptyStateVariant>("search");
  const [layout, setLayout]                   = useState<EmptyStateLayout>("centered");
  const [title, setTitle]                     = useState("No results found");
  const [description, setDescription]         = useState("Try adjusting the filters or search for something different.");
  const [longDescription, setLongDescription] = useState(false);
  const [useIllustration, setUseIllustration] = useState(false);
  const [primaryAction, setPrimaryAction]     = useState(true);
  const [secondaryAction, setSecondaryAction] = useState(true);
  const [footer, setFooter]                   = useState(false);
  const [loading, setLoading]                 = useState(false);

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered empty state in real time. Live JSX is generated in the dark panel at the bottom.">
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
          <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
            <EmptyState variant={variant} layout={layout} loading={loading}>
              {useIllustration ? (
                <EmptyState.Illustration><FakeIllustration /></EmptyState.Illustration>
              ) : (
                <EmptyState.Icon>{iconFor(variant)}</EmptyState.Icon>
              )}
              {title && <EmptyState.Title>{title}</EmptyState.Title>}
              {description && (
                <EmptyState.Description>
                  {longDescription
                    ? `${description} A slightly longer explanation helps the user understand what happened and what they might try next — but keep it to two sentences at most so the surface stays scannable.`
                    : description}
                </EmptyState.Description>
              )}
              {(primaryAction || secondaryAction) && (
                <EmptyState.Actions>
                  {secondaryAction && <Button variant="ghost">Learn more</Button>}
                  {primaryAction   && <Button>Take action</Button>}
                </EmptyState.Actions>
              )}
              {footer && (
                <EmptyState.Footer>
                  Need help? <a href="#" style={{ color: t.color.text.link }}>Read the docs</a>.
                </EmptyState.Footer>
              )}
            </EmptyState>
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
          <SelectControl label="variant" value={variant} options={VARIANTS} onChange={(v) => setVariant(v as EmptyStateVariant)} />
          <SelectControl label="layout"  value={layout}  options={LAYOUTS}  onChange={(v) => setLayout(v as EmptyStateLayout)} />
          <TextControl   label="title"       value={title}       onChange={setTitle} />
          <TextControl   label="description" value={description} onChange={setDescription} />
          <ToggleControl label="illustration"      value={useIllustration} onChange={setUseIllustration} />
          <ToggleControl label="primary action"    value={primaryAction}   onChange={setPrimaryAction} />
          <ToggleControl label="secondary action"  value={secondaryAction} onChange={setSecondaryAction} />
          <ToggleControl label="long description"  value={longDescription} onChange={setLongDescription} />
          <ToggleControl label="footer"            value={footer}          onChange={setFooter} />
          <ToggleControl label="loading"           value={loading}         onChange={setLoading} />
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
{renderCode({ variant, layout, title, description, useIllustration, primaryAction, secondaryAction, footer, loading, longDescription })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function iconFor(v: EmptyStateVariant): ReactNode {
  switch (v) {
    case "search":     return <Search />;
    case "onboarding": return <Rocket />;
    case "error":      return <ShieldAlert />;
    case "permission": return <LockKeyhole />;
    case "offline":    return <WifiOff />;
    default:           return <Inbox />;
  }
}

function renderCode(s: {
  variant: EmptyStateVariant;
  layout: EmptyStateLayout;
  title: string;
  description: string;
  useIllustration: boolean;
  primaryAction: boolean;
  secondaryAction: boolean;
  footer: boolean;
  loading: boolean;
  longDescription: boolean;
}) {
  if (s.loading) {
    const rootAttrs: string[] = [];
    if (s.variant !== "default") rootAttrs.push(`variant="${s.variant}"`);
    if (s.layout !== "centered") rootAttrs.push(`layout="${s.layout}"`);
    rootAttrs.push(`loading`);
    return `<EmptyState ${rootAttrs.join(" ")} />`;
  }

  const rootAttrs: string[] = [];
  if (s.variant !== "default") rootAttrs.push(`variant="${s.variant}"`);
  if (s.layout !== "centered") rootAttrs.push(`layout="${s.layout}"`);
  const open = rootAttrs.length ? `<EmptyState ${rootAttrs.join(" ")}>` : `<EmptyState>`;

  const lines: string[] = [];
  lines.push(open);
  if (s.useIllustration) {
    lines.push(`  <EmptyState.Illustration><MyArt /></EmptyState.Illustration>`);
  } else {
    lines.push(`  <EmptyState.Icon><${iconName(s.variant)} /></EmptyState.Icon>`);
  }
  if (s.title)       lines.push(`  <EmptyState.Title>${esc(s.title)}</EmptyState.Title>`);
  if (s.description) lines.push(`  <EmptyState.Description>${esc(s.description)}</EmptyState.Description>`);
  if (s.primaryAction || s.secondaryAction) {
    lines.push(`  <EmptyState.Actions>`);
    if (s.secondaryAction) lines.push(`    <Button variant="ghost">Learn more</Button>`);
    if (s.primaryAction)   lines.push(`    <Button>Take action</Button>`);
    lines.push(`  </EmptyState.Actions>`);
  }
  if (s.footer) lines.push(`  <EmptyState.Footer>Need help? <a href="#">Read the docs</a>.</EmptyState.Footer>`);
  lines.push(`</EmptyState>`);
  return lines.join("\n");
}

function iconName(v: EmptyStateVariant) {
  switch (v) {
    case "search":     return "Search";
    case "onboarding": return "Rocket";
    case "error":      return "ShieldAlert";
    case "permission": return "LockKeyhole";
    case "offline":    return "WifiOff";
    default:           return "Inbox";
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
      lead="Illustrative — not shipped as reusable components. Every example uses the same primitive with different composition."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: t.space.inline.md }}>
        <ExampleTile title="No Patients">
          <EmptyState layout="contained">
            <EmptyState.Icon><Users /></EmptyState.Icon>
            <EmptyState.Title>No patients yet</EmptyState.Title>
            <EmptyState.Description>Add your first patient to start tracking care plans and orders.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="secondary">Import CSV</Button>
              <Button leftIcon={<UserPlus />}>Add patient</Button>
            </EmptyState.Actions>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="No Search Results">
          <EmptyState variant="search" layout="contained">
            <EmptyState.Icon><Search /></EmptyState.Icon>
            <EmptyState.Title>No results for &quot;asthma&quot;</EmptyState.Title>
            <EmptyState.Description>Try a different search term or clear the filters.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="ghost" leftIcon={<Filter />}>Clear filters</Button>
            </EmptyState.Actions>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="No Reports">
          <EmptyState layout="contained">
            <EmptyState.Icon><FileText /></EmptyState.Icon>
            <EmptyState.Title>No reports scheduled</EmptyState.Title>
            <EmptyState.Description>Schedule a recurring report to see it here.</EmptyState.Description>
            <EmptyState.Actions>
              <Button rightIcon={<ArrowRight />}>Create report</Button>
            </EmptyState.Actions>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="No Notifications">
          <EmptyState layout="contained">
            <EmptyState.Icon><BellOff /></EmptyState.Icon>
            <EmptyState.Title>You're all caught up</EmptyState.Title>
            <EmptyState.Description>No new notifications right now. We'll ping you when something needs your attention.</EmptyState.Description>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="No AI Insights">
          <EmptyState layout="contained">
            <EmptyState.Icon><Bot /></EmptyState.Icon>
            <EmptyState.Title>No insights yet</EmptyState.Title>
            <EmptyState.Description>The AI needs at least a week of data to surface trends. Come back after that.</EmptyState.Description>
            <EmptyState.Footer>
              Curious how insights are generated? <a href="#" style={{ color: t.color.text.link }}>Read the technical note</a>.
            </EmptyState.Footer>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="No Orders">
          <EmptyState layout="contained">
            <EmptyState.Icon><Package /></EmptyState.Icon>
            <EmptyState.Title>No orders in this range</EmptyState.Title>
            <EmptyState.Description>Widen the date range or clear the status filter to see historical orders.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="ghost">Clear filters</Button>
              <Button>New order</Button>
            </EmptyState.Actions>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="Offline">
          <EmptyState variant="offline" layout="contained">
            <EmptyState.Icon><WifiOff /></EmptyState.Icon>
            <EmptyState.Title>You're offline</EmptyState.Title>
            <EmptyState.Description>We'll retry automatically when your connection comes back. No action needed.</EmptyState.Description>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="Permission Denied">
          <EmptyState variant="permission" layout="contained">
            <EmptyState.Icon><LockKeyhole /></EmptyState.Icon>
            <EmptyState.Title>You don't have access</EmptyState.Title>
            <EmptyState.Description>This section is restricted to administrators. Ask your workspace admin for access.</EmptyState.Description>
            <EmptyState.Footer>
              <a href="#" style={{ color: t.color.text.link }}>Request access</a>
            </EmptyState.Footer>
          </EmptyState>
        </ExampleTile>

        <ExampleTile title="Welcome / First-time Setup">
          <EmptyState variant="onboarding" layout="contained">
            <EmptyState.Icon><Sparkles /></EmptyState.Icon>
            <EmptyState.Title>Welcome to ClinicalIQ</EmptyState.Title>
            <EmptyState.Description>Let's set up your workspace. It only takes a minute.</EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="ghost">Skip for now</Button>
              <Button rightIcon={<ArrowRight />}>Get started</Button>
            </EmptyState.Actions>
          </EmptyState>
        </ExampleTile>
      </div>

      <div style={{ marginTop: t.space.section.sm }}>
        <ExampleTile title="Inside a Card (contained layout)">
          <Card>
            <Card.Header>
              <Card.Title>Recent activity</Card.Title>
            </Card.Header>
            <Card.Content>
              <EmptyState layout="contained">
                <EmptyState.Icon><Inbox /></EmptyState.Icon>
                <EmptyState.Title>No activity yet</EmptyState.Title>
                <EmptyState.Description>Activity from your team will appear here as it happens.</EmptyState.Description>
              </EmptyState>
            </Card.Content>
          </Card>
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
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "variant",  type: "'default' | 'search' | 'onboarding' | 'error' | 'permission' | 'offline'", def: "'default'",  desc: "Semantic variant. Only tints the icon container." },
  { name: "layout",   type: "'centered' | 'contained'",                                                 def: "'centered'", desc: "Layout mode — full-page vs. nested-surface." },
  { name: "loading",  type: "boolean",                                                                  def: "false",      desc: "Render the skeleton placeholder + aria-busy='true'." },
  { name: "children", type: "ReactNode",                                                                def: "—",          desc: "Compose with EmptyState.Icon / Illustration / Title / Description / Actions / Footer." },
];

const PROPS_TITLE: PropRow[] = [
  { name: "as",       type: "1 | 2 | 3 | 4 | 5 | 6", def: "3", desc: "Heading level. Match to the surrounding page outline." },
  { name: "children", type: "ReactNode",              def: "—", desc: "Title text." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="EmptyState"       rows={PROPS_ROOT} />
      <PropsSubsection title="EmptyState.Title" rows={PROPS_TITLE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        EmptyState.Icon, EmptyState.Illustration, EmptyState.Description, EmptyState.Actions, and EmptyState.Footer have no props beyond standard HTML attributes.
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
    { role: "Layout padding",        alias: "components.emptyState.layout.{centered|contained}.padX/padY (24/48 · 16/32)" },
    { role: "Min-height",            alias: "components.emptyState.layout.minHeight (320px · 240px)" },
    { role: "Content max-width",     alias: "components.emptyState.layout.maxWidth (460px · 420px)" },
    { role: "Icon container",        alias: "56 × 56 · aliases.radius.full · aliases.color.background.subtle (default)" },
    { role: "Variant tints",         alias: "brand-50 · status.error.bg · status.warning.bg · bg.subtle — components.emptyState.icon.variant" },
    { role: "Icon glyph",            alias: "24 × 24 · color follows variant tint" },
    { role: "Illustration max size", alias: "200 × 160 max — components.emptyState.illustration" },
    { role: "Title typography",      alias: "aliases.typography.headingS (20 semibold — matches Card comfortable title)" },
    { role: "Description typography", alias: "aliases.typography.body (16 regular)" },
    { role: "Footer typography",     alias: "aliases.typography.bodyS (14) + border-top border.subtle" },
    { role: "Actions gap",           alias: "aliases.spacing.inline.sm (8 — matches Card.Actions + Dialog.Actions)" },
    { role: "Actions margin-top",    alias: "aliases.spacing.stack.lg (16)" },
    { role: "Loading skeleton",      alias: "aliases.color.background.subtle + 1400ms pulse (3500ms under prefers-reduced-motion)" },
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
          { tone: "note", text: "The root walks children and arranges them in the canonical vertical stack (Icon/Illustration → Title → Description → Actions → Footer). Consumers author children in any order; the layout is stable. Only one of Icon or Illustration renders — Illustration wins." },
          { tone: "note", text: "Variant only tints the icon container. Everything else (typography, padding, min-height, actions rhythm) stays neutral — the empty state's *content* carries the semantic weight." },
          { tone: "note", text: "The two layout modes are the same component with different padding + min-height + max-width tokens. Contained fits inside a Card / Dialog / Tab panel; centered is for a full page or a full-height panel." },
          { tone: "note", text: "The loading state renders a skeleton with a pulsing icon circle + two text bars. aria-busy='true' on the root and aria-hidden on the skeleton itself. Use for the one-shot moment before the empty state resolves so the surface doesn't jump when the real content mounts." },
          { tone: "note", text: "EmptyState.Icon and EmptyState.Illustration are both aria-hidden by default. If the illustration carries meaning the title/description don't cover, add role='img' + aria-label to the SVG inside Illustration." },
          { tone: "note", text: "The root uses role='status' + aria-live='polite'. Guard the surface with a conditional so the announcement fires once per state change (not on every re-render)." },
        ]}
      />

      <Callout tone="info" title="Extending EmptyState">
        (1) Downstream zero-state surfaces (WelcomePanel, FirstRunSetup,
        OfflineBanner, PermissionScreen, EmptyDashboard) should be thin
        compositions on top of this EmptyState — wrap it with the surface's
        opinionated content and reuse every visual choice. (2) A new
        variant should only be added if a genuine semantic role emerges.
        Add the tint to
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          tokens/components/emptyState.ts
        </code>
        and the matching CSS rule in EmptyState.css before using it.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",   detail: "Every color, spacing, radius, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Card language",   detail: "Centered layout mirrors Card comfortable padding rhythm; contained layout drops down to Card compact so a nested EmptyState reads as one continuous rhythm." },
    { name: "HC1 status palette",  detail: "Variant tints map through the same color.status.* / brand aliases used by Badge and Alert — same variant → same meaning across every primitive." },
    { name: "HC1 Button",          detail: "EmptyState.Actions hosts real Buttons (never bespoke tap targets). Focus rings and typography align across every family." },
    { name: "Native <div>",        detail: "The root is a real <div> with role='status'. No interactive wrapping, no <button> or <a> overloads on the surface itself." },
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
    { name: "Empty Table",       detail: "Empty state slot inside a Table body. Wraps EmptyState with layout='contained' + Actions for 'Clear filters' / 'Add row'." },
    { name: "No Search Results", detail: "Zero-hit search + filter surfaces. Wraps EmptyState with variant='search' + layout='contained' + a 'Clear filters' ghost action." },
    { name: "First-time Setup",  detail: "Welcome pages, onboarding wizard entries. Wraps EmptyState with variant='onboarding' + a primary 'Get started' action." },
    { name: "Permission Denied", detail: "Blocked-access panels. Wraps EmptyState with variant='permission' + optional 'Request access' Footer link. Usually no primary action." },
    { name: "Offline Fallback",  detail: "Connectivity-loss banners inside a page or a panel. Wraps EmptyState with variant='offline' — self-healing, so no primary action." },
    { name: "Empty Notifications", detail: "'All caught up' surfaces in the notification tray. Wraps EmptyState with variant='default' + no action." },
    { name: "AI Insights Empty", detail: "Pre-warm AI panels waiting on data. Wraps EmptyState with variant='default' + Footer link to a technical explainer." },
    { name: "Report / Export Empty", detail: "Empty report list. Wraps EmptyState with a primary 'Create report' Button in Actions." },
    { name: "Empty Dashboard",   detail: "Newly-provisioned dashboards. Wraps EmptyState with variant='onboarding' + a 'Add widget' action." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every zero-state surface in HC1 should compose this EmptyState. These are the anticipated consumers — none are shipped yet."
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
              <Inbox size={14} color={t.color.action.primary} />
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
    { name: "ClinicalIQ empty tables",       detail: "Bloodhealth + HerCare list pages currently render bespoke 'No records' spans. Migrate to EmptyState (contained) — no UX change, just token + a11y unification." },
    { name: "SourceIQ zero-state banners",    detail: "SourceIQ pipeline pages ship divergent gray-teal empty banners. Migrate to EmptyState (contained) — same message, unified palette." },
    { name: "Search zero-hits",               detail: "Any page rendering 'No results found' beneath a search input is EmptyState variant='search'. Migrate to inherit the shared tint + a11y wiring." },
    { name: "Ad-hoc offline screens",         detail: "Prototype 'offline' screens using inline styles + a lucide icon are EmptyState variant='offline'. Migrate for the shared tint + role='status'." },
    { name: "Onboarding welcome cards",       detail: "First-run welcome flows currently render as bespoke Card+CTA compositions. Migrate to EmptyState variant='onboarding' inside their existing Card." },
    { name: "Prototype 'nothing here' states", detail: "Any surface with a lone icon + short phrase that leaves the user stuck. Migrate to EmptyState and add the missing next-step Action (or omit it if genuinely dead-end)." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 EmptyState is the intended replacement for every zero-state screen across the HC1 ecosystem. Do not redesign — standardize."
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
    { label: "Responsive",               ok: true },
    { label: "Accessible",               ok: true },
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
