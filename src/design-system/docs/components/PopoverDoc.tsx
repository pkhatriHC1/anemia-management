import { forwardRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  Filter,
  User,
  Palette,
  Calendar,
  Command,
  Zap,
  FileText,
  ChevronDown,
  Search,
  LogOut,
  Settings as SettingsIcon,
  UserCircle,
  Check,
} from "lucide-react";
import { Popover, type PopoverPlacement } from "../../components/popover";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  Checklist,
  t,
} from "../standards/_shared";

const PLACEMENTS: PopoverPlacement[] = ["top", "bottom", "left", "right", "auto"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function PopoverDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <PlacementBlock />
      <ModalBlock />
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
      title="The canonical HC1 Popover"
      lead="Popover is the canonical floating surface primitive of the HC1 design system. Every downstream floating panel — dropdown menus, user menus, filter panels, colour pickers, date pickers, comboboxes, command palettes, context menus — composes this Popover rather than reinventing anchored floating surfaces. Popover carries interactive content: if the floating panel needs to be clicked into or typed into, this is the primitive."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="Compose Popover → Trigger → Content. Arrow renders automatically inside Content. Close is optional and composed inside Content when a dismiss control is needed. Content portals to document.body so it escapes overflow-hidden ancestors."
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: t.space.section.md,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
          minHeight: 200,
        }}
      >
        <Popover defaultOpen placement="bottom">
          <Popover.Trigger>
            <Button size="md" variant="secondary">
              Open panel <ChevronDown size={14} style={{ marginLeft: 6 }} />
            </Button>
          </Popover.Trigger>
          <Popover.Content ariaLabel="Anatomy example">
            <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
              <div style={{ fontWeight: 600, color: t.color.text.primary }}>Popover content</div>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
                Interactive floating panel anchored to the trigger.
              </div>
              <div style={{ marginTop: t.space.stack.xs }}>
                <Popover.Close>
                  <Button size="sm" variant="secondary">Close</Button>
                </Popover.Close>
              </div>
            </div>
          </Popover.Content>
        </Popover>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Popover"         desc="Root. Owns open state, placement, modality, dismiss policy, and shares an id for aria-controls wiring." />
        <Part name="Popover.Trigger" desc="Clones its single child and attaches an onClick handler + ref + aria-haspopup, aria-expanded, aria-controls." />
        <Part name="Popover.Content" desc="Floating panel. Portaled to document.body with role='dialog' and tabIndex=-1. Focus moves in on open." />
        <Part name="Popover.Arrow"   desc="Triangular pointer. Auto-rendered inside Content when arrow is true; exposed as a standalone for custom Content shells." />
        <Part name="Popover.Close"   desc="Clones its single child and attaches an onClick handler that closes the popover. Compose inside Content." />
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

/* ══════ Placement ═════════════════════════════════════════════════ */

function PlacementBlock() {
  return (
    <DocBlock
      title="Placement"
      lead="Four cardinal placements plus `auto`. When the requested side would collide with the viewport edge, the popover flips to the opposite side; when nothing fits, it picks the side with the most room. The resolved side is exposed as `data-side` on the content for downstream tests + themes."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <PlacementTile name="top"    label="Top" />
        <PlacementTile name="bottom" label="Bottom" />
        <PlacementTile name="left"   label="Left" />
        <PlacementTile name="right"  label="Right" />
        <PlacementTile name="auto"   label="Auto" />
      </div>
      <div style={{ marginTop: t.space.section.sm }}>
        <RuleList
          rules={[
            { tone: "note", text: "Positioning re-measures on scroll + resize while open so the popover follows its trigger through layout shifts." },
            { tone: "note", text: "The arrow tracks the trigger centre horizontally (top/bottom sides) or vertically (left/right sides) so it always points at the trigger even when the popover is clamped away from centre by a viewport edge." },
            { tone: "note", text: "`auto` prefers bottom → top → right → left when they fit. Popovers open on click; bottom is the canonical resting place for menu-like surfaces." },
          ]}
        />
      </div>
    </DocBlock>
  );
}

function PlacementTile({ name, label }: { name: PopoverPlacement; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
        {label}
      </div>
      <div
        style={{
          padding: t.space.inline.xl,
          background: t.color.background.subtle,
          borderRadius: t.radius.control,
          minHeight: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Popover placement={name} defaultOpen>
          <Popover.Trigger>
            <Button size="sm" variant="secondary">Trigger</Button>
          </Popover.Trigger>
          <Popover.Content ariaLabel={`Placement ${name}`} minWidth={160}>
            <div style={{ ...t.type.bodyS, color: t.color.text.primary }}>Placement · {name}</div>
          </Popover.Content>
        </Popover>
      </div>
      <code style={{ ...t.type.caption, color: t.color.action.primary, fontFamily: t.font.mono }}>
        placement=&quot;{name}&quot;
      </code>
    </div>
  );
}

/* ══════ Modal vs Non-Modal ════════════════════════════════════════ */

function ModalBlock() {
  return (
    <DocBlock
      title="Modal vs non-modal"
      lead="Popover defaults to non-modal — the panel opens next to the trigger and the underlying surface stays interactive. `modal` upgrades the panel with a scrim, focus trap, and body-scroll lock — a hybrid of Popover positioning and Dialog dismissal for focused sub-tasks that must not compete with the underlying page."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: t.space.inline.lg,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
          <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
            Non-modal (default)
          </div>
          <div
            style={{
              padding: t.space.inline.xl,
              background: t.color.background.subtle,
              borderRadius: t.radius.control,
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Popover placement="bottom">
              <Popover.Trigger>
                <Button size="sm" variant="secondary">Open</Button>
              </Popover.Trigger>
              <Popover.Content ariaLabel="Non-modal example">
                <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
                  <div style={{ fontWeight: 600 }}>Non-modal</div>
                  <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>Click outside dismisses.</div>
                </div>
              </Popover.Content>
            </Popover>
          </div>
          <RuleList
            rules={[
              { tone: "note", text: "No scrim; the underlying surface stays clickable." },
              { tone: "note", text: "Escape or a pointer-down outside closes the panel." },
              { tone: "note", text: "Best for menus, filters, quick actions." },
            ]}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
          <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
            Modal
          </div>
          <div
            style={{
              padding: t.space.inline.xl,
              background: t.color.background.subtle,
              borderRadius: t.radius.control,
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Popover placement="bottom" modal>
              <Popover.Trigger>
                <Button size="sm">Open modal</Button>
              </Popover.Trigger>
              <Popover.Content ariaLabel="Modal example">
                <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
                  <div style={{ fontWeight: 600 }}>Modal popover</div>
                  <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>
                    Scrim gates the underlying surface. Tab cycles within.
                  </div>
                  <div>
                    <Popover.Close>
                      <Button size="sm" variant="secondary">Done</Button>
                    </Popover.Close>
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </div>
          <RuleList
            rules={[
              { tone: "note", text: "Scrim overlays the page; underlying content is inert." },
              { tone: "note", text: "Focus is trapped inside the panel until close." },
              { tone: "note", text: "Body scroll is locked while open." },
            ]}
          />
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The panel has role='dialog' — assistive tech treats the popover as a focused sub-surface. Modal mode adds aria-modal='true'." },
          { tone: "must", text: "The Trigger receives aria-haspopup='dialog' + aria-expanded={open} + aria-controls={content id} so screen readers announce the relationship and current state." },
          { tone: "must", text: "Focus moves into the panel on open — first focusable child, falling back to the panel itself (which sets tabIndex=-1). Focus restores to the trigger on close." },
          { tone: "must", text: "Escape closes the popover whether focus is on the panel or has drifted elsewhere — a document keydown listener catches both cases. Consumers can disable with closeOnEscape={false} for narrow cases." },
          { tone: "must", text: "Outside pointer-down closes the panel in non-modal mode. Modal mode dismisses on scrim click." },
          { tone: "must", text: "Modal mode traps Tab / Shift+Tab inside the panel — the same shape Dialog uses — and locks body scroll so the page underneath stays put." },
          { tone: "must", text: "Provide either ariaLabel on Content or an aria-labelledby via a heading inside Content — never both. The role='dialog' element must be nameable." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the fade + scale animation to 0ms — the popover appears instantly." },
          { tone: "must-not", text: "Never rely on hover alone. Popover opens on click / activation — hover is not a discoverable interaction on touch or keyboard." },
          { tone: "must-not", text: "Never nest Popover.Content inside a scrollable ancestor without letting it portal — the panel would clip. The default portals to document.body." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard shortcuts ════════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Enter / Space",  effect: "When focused on the trigger, opens the popover and moves focus to the first focusable child of Content." },
    { keys: "Escape",         effect: "Closes the popover from anywhere — trigger, panel, or elsewhere on the page. Focus restores to the trigger." },
    { keys: "Tab",            effect: "Non-modal: focus moves normally and may leave the panel (outside pointer-down will close on next interaction). Modal: focus is trapped inside the panel." },
    { keys: "Shift+Tab",      effect: "Non-modal: focus moves normally. Modal: cycles to the last focusable inside the panel." },
    { keys: "Click outside",  effect: "Non-modal: closes the popover on pointer-down outside the trigger + panel. Modal: only the scrim + Escape close." },
  ];
  return (
    <DocBlock title="Keyboard">
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
              gridTemplateColumns: "220px 1fr",
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
          { title: "Use for interactive floating content",  description: "Menus, filter panels, colour pickers, date pickers, comboboxes, command palettes. Popover is the primitive; the downstream components compose it." },
          { title: "Anchor to a real button",               description: "Trigger must be focusable and activatable — a Button, plain button, or <a>. Screen readers rely on it." },
          { title: "Keep panels focused on one job",        description: "Filter this table, pick this colour, choose this date. If you need a multi-step flow, use Dialog." },
          { title: "Use modal for focused sub-tasks",       description: "When the popover must complete before the user goes back — the scrim + focus trap prevent accidental dismissal." },
        ]}
        donts={[
          { title: "Hover-only opening",                    description: "Hover is not a discoverable interaction on touch or keyboard. Open on click." },
          { title: "Whole workflows inside a popover",      description: "If the content needs a scrollable body + a footer with primary + secondary buttons, use Dialog. Popover is a lightweight surface." },
          { title: "Nested popovers with unclear ownership",description: "A popover trigger inside another popover trigger creates confusing dismiss cascades. Restructure the surface — a submenu is a downstream composition, not a raw Popover." },
          { title: "Popover for informational hints",       description: "Hints go in Tooltip. Popover is heavier and opens with a click; it competes with product content." },
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
          { tone: "must-not", text: "Don't confuse Popover with Tooltip. Tooltip = passive hint on hover/focus, never focusable. Popover = interactive content opened on click, focus moves in." },
          { tone: "must-not", text: "Don't confuse Popover with Dialog. Popover is anchored to a trigger and dismisses on outside click; Dialog is centred, blocks the underlying surface, and gates a focused task-completion flow." },
          { tone: "must-not", text: "Don't reinvent Dropdown Menu, Date Picker, Combobox, etc. Those are downstream compositions ON Popover. When they ship, they compose this primitive." },
          { tone: "must-not", text: "Don't put unrelated content inside a Popover. One purpose per panel. If you're tempted to add a tab bar, you want a Dialog." },
          { tone: "must-not", text: "Don't disable Escape or outside-click dismissal unless the panel absolutely cannot be lost mid-input. Both are learned dismiss gestures — surprise the user by removing them and they'll be stuck." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [placement, setPlacement] = useState<PopoverPlacement>("bottom");
  const [arrow, setArrow]         = useState(true);
  const [modal, setModal]         = useState(false);
  const [longContent, setLongContent] = useState(false);
  const [showClose, setShowClose] = useState(true);
  const [controlledOpen, setControlledOpen] = useState<boolean>(false);
  const [useControlled, setUseControlled]   = useState(false);

  const body = longContent ? (
    <>
      <div style={{ fontWeight: 600, marginBottom: t.space.stack.xs }}>Longer panel</div>
      <div style={{ ...t.type.bodyS, color: t.color.text.secondary, marginBottom: t.space.stack.sm }}>
        Popovers stay lightweight. A longer body is still fine — filter chips, a small form,
        a short list — but the panel should have one purpose. Multi-step flows belong in a Dialog.
      </div>
      <Input placeholder="Search…" size="sm" />
    </>
  ) : (
    <>
      <div style={{ fontWeight: 600, marginBottom: t.space.stack.xs }}>Quick action</div>
      <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>
        Interactive floating panel anchored to the trigger.
      </div>
    </>
  );

  return (
    <DocBlock title="Playground" lead="Every control rebinds the rendered Popover in real time. Click the trigger to open.">
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
            justifyContent: "center",
            alignItems: "center",
            minHeight: 220,
          }}
        >
          <Popover
            placement={placement}
            modal={modal}
            open={useControlled ? controlledOpen : undefined}
            onOpenChange={useControlled ? setControlledOpen : undefined}
          >
            <Popover.Trigger>
              <Button size="md">
                Open popover <ChevronDown size={14} style={{ marginLeft: 6 }} />
              </Button>
            </Popover.Trigger>
            <Popover.Content arrow={arrow} ariaLabel="Playground popover">
              <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
                {body}
                {showClose && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: t.space.inline.sm, marginTop: t.space.stack.xs }}>
                    <Popover.Close>
                      <Button size="sm" variant="secondary">Cancel</Button>
                    </Popover.Close>
                    <Popover.Close>
                      <Button size="sm">Done</Button>
                    </Popover.Close>
                  </div>
                )}
              </div>
            </Popover.Content>
          </Popover>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="placement" value={placement} options={PLACEMENTS} onChange={(v) => setPlacement(v as PopoverPlacement)} />
          <ToggleControl label="arrow"          value={arrow}          onChange={setArrow} />
          <ToggleControl label="modal"          value={modal}          onChange={setModal} />
          <ToggleControl label="long content"   value={longContent}    onChange={setLongContent} />
          <ToggleControl label="close button"   value={showClose}      onChange={setShowClose} />
          <ToggleControl label="controlled"     value={useControlled}  onChange={setUseControlled} />
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
{renderCode({ placement, arrow, modal, longContent, showClose, useControlled })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  placement: PopoverPlacement;
  arrow: boolean;
  modal: boolean;
  longContent: boolean;
  showClose: boolean;
  useControlled: boolean;
}) {
  const attrs: string[] = [];
  if (s.placement !== "bottom") attrs.push(`placement="${s.placement}"`);
  if (s.modal)                  attrs.push(`modal`);
  if (s.useControlled)          attrs.push(`open={open}`, `onOpenChange={setOpen}`);

  const rootOpen = attrs.length > 0
    ? `<Popover\n  ${attrs.join("\n  ")}\n>`
    : `<Popover>`;

  const contentAttrs: string[] = [`ariaLabel="Popover"`];
  if (!s.arrow) contentAttrs.push(`arrow={false}`);
  const contentOpen = `<Popover.Content ${contentAttrs.join(" ")}>`;

  const body = s.longContent ? "…longer content with an input…" : "…quick action content…";
  const close = s.showClose
    ? `\n    <Popover.Close><Button size="sm">Done</Button></Popover.Close>`
    : ``;

  return [
    rootOpen,
    `  <Popover.Trigger>`,
    `    <Button>Open popover</Button>`,
    `  </Popover.Trigger>`,
    `  ${contentOpen}`,
    `    ${body}${close}`,
    `  </Popover.Content>`,
    `</Popover>`,
  ].join("\n");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Six sketches of how downstream surfaces compose Popover. These are illustrative — the actual Dropdown Menu, Date Picker, Colour Picker, and Command Palette ship as their own components on top of this primitive."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <ProfileMenuExample />
        <QuickActionsExample />
        <FilterPanelExample />
        <ColorPickerExample />
        <DatePickerExample />
        <CommandPaletteExample />
      </div>
    </DocBlock>
  );
}

function ExampleShell({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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
      <div style={{ minHeight: 44, display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
        {children}
      </div>
    </div>
  );
}

const TriggerButton = forwardRef<
  HTMLButtonElement,
  { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
>(function TriggerButton({ children, style, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: `0 ${t.space.inline.md}`,
        border: `1px solid ${t.color.border.default}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        color: t.color.text.primary,
        fontFamily: t.font.sans,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
});

function MenuRow({ icon, label, hint }: { icon: ReactNode; label: string; hint?: string }) {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: t.space.inline.sm,
        width: "100%",
        padding: `${t.space.stack.sm} ${t.space.inline.sm}`,
        border: 0,
        borderRadius: t.radius.control,
        background: "transparent",
        color: t.color.text.primary,
        fontFamily: t.font.sans,
        fontSize: 14,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ color: t.color.text.tertiary, display: "inline-flex" }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {hint && (
        <span style={{ fontFamily: t.font.mono, fontSize: 11, color: t.color.text.tertiary }}>{hint}</span>
      )}
    </button>
  );
}

function ProfileMenuExample() {
  return (
    <ExampleShell title="Profile menu" icon={<User size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <TriggerButton>
            <UserCircle size={16} /> Puja P. <ChevronDown size={14} />
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Profile menu" minWidth={220}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ padding: `${t.space.stack.xs} ${t.space.inline.sm}`, marginBottom: t.space.stack.xs, borderBottom: `1px solid ${t.color.border.subtle}` }}>
              <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>Puja Patel</div>
              <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>puja@hc1.com</div>
            </div>
            <MenuRow icon={<UserCircle size={14} />} label="Profile" hint="⌘P" />
            <MenuRow icon={<SettingsIcon size={14} />} label="Settings" />
            <MenuRow icon={<LogOut size={14} />} label="Sign out" />
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
  );
}

function QuickActionsExample() {
  return (
    <ExampleShell title="Quick actions" icon={<Zap size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <TriggerButton>
            <Zap size={14} /> Actions <ChevronDown size={14} />
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Quick actions" minWidth={220}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <MenuRow icon={<Zap size={14} />} label="Generate care plan" />
            <MenuRow icon={<FileText size={14} />} label="Export as PDF" />
            <MenuRow icon={<Command size={14} />} label="Open command palette" hint="⌘K" />
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
  );
}

function FilterPanelExample() {
  const [status, setStatus] = useState<Record<string, boolean>>({ open: true, pending: false, resolved: false });
  const toggle = (key: string) => setStatus((s) => ({ ...s, [key]: !s[key] }));
  const activeCount = Object.values(status).filter(Boolean).length;

  return (
    <ExampleShell title="Filter panel" icon={<Filter size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <TriggerButton>
            <Filter size={14} /> Status {activeCount > 0 && <span style={{ padding: `0 6px`, background: t.color.action.primary, color: t.color.text.inverse, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{activeCount}</span>}
            <ChevronDown size={14} />
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Filter by status" minWidth={220}>
          <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
              Status
            </div>
            {(["open", "pending", "resolved"] as const).map((key) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, cursor: "pointer", fontSize: 14, color: t.color.text.primary, textTransform: "capitalize" }}>
                <input type="checkbox" checked={status[key]} onChange={() => toggle(key)} />
                {key}
              </label>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: t.space.stack.sm, paddingTop: t.space.stack.sm, borderTop: `1px solid ${t.color.border.subtle}` }}>
              <Popover.Close>
                <Button size="sm" variant="secondary">Cancel</Button>
              </Popover.Close>
              <Popover.Close>
                <Button size="sm">Apply</Button>
              </Popover.Close>
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
  );
}

const SWATCHES = ["#0D7782", "#044A50", "#B75E0B", "#6C4DD1", "#B00A2F", "#2E7028", "#767C84", "#0E1116"];

function ColorPickerExample() {
  const [color, setColor] = useState("#0D7782");
  return (
    <ExampleShell title="Color picker" icon={<Palette size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <TriggerButton>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: color, border: `1px solid ${t.color.border.default}` }} />
            Colour
            <ChevronDown size={14} />
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Choose a colour" minWidth={200}>
          <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
              Swatches
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: t.space.inline.sm }}>
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`Choose ${s}`}
                  onClick={() => setColor(s)}
                  style={{
                    width: 32, height: 32, padding: 0,
                    background: s,
                    border: `2px solid ${color === s ? t.color.action.primary : t.color.border.default}`,
                    borderRadius: t.radius.control,
                    cursor: "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: t.color.text.inverse,
                  }}
                >
                  {color === s && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
  );
}

function DatePickerExample() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const [picked, setPicked] = useState<number | null>(15);
  return (
    <ExampleShell title="Date picker" icon={<Calendar size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <TriggerButton>
            <Calendar size={14} /> {picked ? `Aug ${picked}, 2026` : "Pick date"}
            <ChevronDown size={14} />
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Pick a date" minWidth={260}>
          <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 600, color: t.color.text.primary }}>August 2026</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPicked(d)}
                  style={{
                    height: 28, padding: 0,
                    border: 0,
                    borderRadius: t.radius.control,
                    background: picked === d ? t.color.action.primary : "transparent",
                    color: picked === d ? t.color.text.inverse : t.color.text.primary,
                    fontFamily: t.font.sans,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
  );
}

function CommandPaletteExample() {
  return (
    <ExampleShell title="Command palette" icon={<Command size={16} color={t.color.action.primary} />}>
      <Popover placement="bottom" modal>
        <Popover.Trigger>
          <TriggerButton>
            <Command size={14} /> Command <span style={{ fontFamily: t.font.mono, fontSize: 11, color: t.color.text.tertiary }}>⌘K</span>
          </TriggerButton>
        </Popover.Trigger>
        <Popover.Content ariaLabel="Command palette" minWidth={320}>
          <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, padding: `${t.space.stack.xs} ${t.space.inline.sm}`, background: t.color.background.subtle, borderRadius: t.radius.control }}>
              <Search size={14} color={t.color.text.tertiary} />
              <Input placeholder="Type a command…" size="sm" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MenuRow icon={<Zap size={14} />} label="Generate care plan" />
              <MenuRow icon={<FileText size={14} />} label="Open patient chart" />
              <MenuRow icon={<UserCircle size={14} />} label="Switch account" />
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </ExampleShell>
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

const PROPS_POPOVER: PropRow[] = [
  { name: "open",                type: "boolean",                                        def: "—",         desc: "Controlled open state. Pair with onOpenChange." },
  { name: "defaultOpen",         type: "boolean",                                        def: "false",     desc: "Uncontrolled initial open state." },
  { name: "onOpenChange",        type: "(open: boolean) => void",                        def: "—",         desc: "Fires whenever open flips (both controlled + uncontrolled)." },
  { name: "placement",           type: "'top' | 'bottom' | 'left' | 'right' | 'auto'",   def: "'bottom'",  desc: "Preferred side. auto picks the side with the most room." },
  { name: "modal",               type: "boolean",                                        def: "false",     desc: "Modal mode: adds scrim, focus trap, and body scroll lock." },
  { name: "closeOnOutsideClick", type: "boolean",                                        def: "true",      desc: "Non-modal: close on pointer-down outside. Modal: close on scrim click." },
  { name: "closeOnEscape",       type: "boolean",                                        def: "true",      desc: "Close when the user presses Escape." },
  { name: "children",            type: "ReactNode",                                      def: "—",         desc: "Compose Popover.Trigger + Popover.Content." },
];

const PROPS_TRIGGER: PropRow[] = [
  { name: "children", type: "ReactElement", def: "—", desc: "A single React element (Button, plain button, <a>, etc.). Trigger clones and attaches onClick + ref + aria-haspopup + aria-expanded + aria-controls." },
];

const PROPS_CONTENT: PropRow[] = [
  { name: "arrow",     type: "boolean",         def: "true", desc: "Show the arrow. Auto-positioned per side." },
  { name: "minWidth",  type: "number | string", def: "200",  desc: "Override min inline width of the panel." },
  { name: "maxWidth",  type: "number | string", def: "360",  desc: "Override max inline width of the panel." },
  { name: "ariaLabel", type: "string",          def: "—",    desc: "Accessible label for the dialog role. Use this OR a labelledby heading — never both." },
  { name: "children",  type: "ReactNode",       def: "—",    desc: "Popover content." },
];

const PROPS_ARROW: PropRow[] = [
  { name: "className", type: "string", def: "—", desc: "Custom classes for the arrow element." },
];

const PROPS_CLOSE: PropRow[] = [
  { name: "children", type: "ReactElement", def: "—", desc: "A single React element. Close clones and attaches an onClick handler that flips the popover closed." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Popover"         rows={PROPS_POPOVER} />
      <PropsSubsection title="Popover.Trigger" rows={PROPS_TRIGGER} />
      <PropsSubsection title="Popover.Content" rows={PROPS_CONTENT} />
      <PropsSubsection title="Popover.Arrow"   rows={PROPS_ARROW} />
      <PropsSubsection title="Popover.Close"   rows={PROPS_CLOSE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Popover.Content forwards all standard <code style={{ fontFamily: t.font.mono }}>&lt;div&gt;</code> HTML attributes (className, style, data-*) to the panel.
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
    { role: "Panel background",       alias: "aliases.color.background.elevated (white — reads as floating Card)" },
    { role: "Panel text",             alias: "aliases.color.text.primary (primary ink for product content)" },
    { role: "Panel border",           alias: "aliases.color.border.subtle (matches Card family)" },
    { role: "Panel radius",           alias: "aliases.radius.surface (12 — full surface radius, not compact)" },
    { role: "Panel shadow",           alias: "aliases.elevation.overlay (shadow-lg — lifted overlay tier)" },
    { role: "Panel min width",        alias: "200 — small floating menus don't collapse" },
    { role: "Panel max width",        alias: "360 — long content doesn't span the viewport" },
    { role: "Panel padding",          alias: "aliases.spacing.stack.lg (16) vertical × aliases.spacing.inline.lg (16) horizontal — Card family" },
    { role: "Panel typography",       alias: "aliases.typography.bodyS (14/20 · regular)" },
    { role: "Arrow size",             alias: "8px base (4px half). Rotated square gives a clean tip on any monitor without polygon anti-alias fuzz." },
    { role: "Offset from trigger",    alias: "8px including arrow" },
    { role: "z-index (non-modal)",    alias: "--hc-z-popover (40) — above sticky, below tooltip / modal" },
    { role: "z-index (modal)",        alias: "--hc-z-modal (70) with scrim at --hc-z-modal-scrim (60) — same tier as Dialog" },
    { role: "Modal scrim",            alias: "--hc-popover-scrim — reuses --hc-dialog-scrim so the overlay family stays cohesive" },
    { role: "Motion",                 alias: "aliases.motion.hoverIn (150ms, standard) — subtle scale + fade" },
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
          { tone: "note", text: "Content is rendered into a portal on document.body — same technique Dialog and Tooltip use — so it escapes overflow-hidden ancestors and always paints above the surrounding surface. No z-index gymnastics on the parent required." },
          { tone: "note", text: "Positioning runs in a useLayoutEffect that measures the trigger + panel before paint, computes the placement (with viewport-fit checks and side-flip fallback), and writes inline top/left. One measure pass per open; the panel mounts with visibility: hidden until measured so no flash at 0,0." },
          { tone: "note", text: "Positioning re-measures on scroll + resize while open. The arrow position tracks the trigger centre and is clamped to stay inside the panel so it always points at the trigger even when the panel is clamped away from centre by a viewport edge." },
          { tone: "note", text: "Focus management: on open, focus moves to the first focusable child of Content (falling back to the panel itself with tabIndex=-1). On close, focus restores to the trigger. This is true for BOTH modal and non-modal — Popover content is always focusable, unlike Tooltip." },
          { tone: "note", text: "Non-modal dismissal is bound to document pointerdown (capture phase) so the popover closes on the leading edge of a click outside — feels tighter than click, matches Radix / floating-ui defaults." },
          { tone: "note", text: "Modal mode adds a scrim, traps Tab / Shift+Tab inside the panel (Dialog-shape focus trap), and locks body scroll via a shared counter — nested overlays decrement correctly and don't fight each other." },
          { tone: "note", text: "Trigger uses cloneElement to attach onClick + ref + aria attributes to a single child. The child must forward its ref and spread props to a real DOM element (a plain Button or an <a> works; wrapper components must be forwardRefs that spread props to their inner element)." },
          { tone: "note", text: "Popover.Close is a compound sub-component (like Dialog.Close). It clones a single child and adds an onClick that closes the popover — compose inside Content for a 'Done' / 'Cancel' button that participates in the same close flow as Escape / outside click." },
        ]}
      />

      <Callout tone="info" title="Foundation for downstream components">
        Dropdown Menu, User Menu, Date Picker, Color Picker, Filter Menu, Combobox, Command Palette, and Context Menu will all compose this Popover rather than reinventing floating surfaces. They add semantics on top (menu items, keyboard navigation, selection state) but the anchoring, portalling, arrow, focus, and dismissal behavior come from here. Do not fork this primitive.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "React portals",         detail: "Content renders into a portal on document.body via createPortal — same technique Dialog + Tooltip use. Escapes overflow-hidden ancestors and paints above the surrounding surface." },
    { name: "HC1 Tooltip positioning", detail: "Placement engine (measure → fit → flip → clamp) mirrors Tooltip's so both floating surfaces behave identically at the viewport edges." },
    { name: "HC1 Dialog dismissal",   detail: "Focus utilities, body scroll lock, and the modal-mode focus trap all use the same shape as Dialog. Nested overlays share the scroll-lock counter." },
    { name: "HC1 Card visual",        detail: "Surface radius, elevated background, subtle border tone follow the Card family — popovers read as floating Cards." },
    { name: "HC1 design tokens",      detail: "Every color, radius, spacing, motion, and typography value is a token alias — no hex, no raw pixels, no bespoke shadows." },
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
    { name: "Dropdown Menu",     detail: "Anchored menu of actions or navigation items. Composes Popover for anchoring + dismissal; adds menu semantics on top (role='menu', arrow-key navigation, activeDescendant)." },
    { name: "User / Profile Menu", detail: "Header-avatar menu with profile, settings, sign-out. Same shape as Dropdown Menu — a Popover with a menu inside." },
    { name: "Filter Menu",       detail: "Column-header filter panels in a Table. A Popover holding checkboxes, radios, or a small form with Apply / Cancel." },
    { name: "Color Picker",      detail: "Swatch grid or slider anchored to a colour trigger. A Popover with a colour-selection surface inside." },
    { name: "Date Picker",       detail: "Calendar month view anchored to a date input. A Popover framing a calendar composition." },
    { name: "Combobox",          detail: "Input + filtered listbox — the listbox floats out of the input on focus. A Popover anchored to the input, opening on focus / type." },
    { name: "Command Palette",   detail: "Global keyboard-shortcut launcher. A modal Popover (⌘K) with a search input + result list." },
    { name: "Context Menu",      detail: "Right-click contextual actions. Uses Popover for the floating surface; the anchor is a synthetic point at the cursor rather than a trigger element." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every anchored floating surface in HC1 will compose Popover. These are the downstream consumers — the ones the DO-NOT list at the top of the prompt calls out."
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
    { area: "ClinicalIQ · BloodHealth", detail: "Any bespoke floating panels — filter dropdowns, action menus, quick-pickers — swap to Popover so anchor, focus, and dismissal behave uniformly." },
    { area: "ClinicalIQ · HerCare",     detail: "Any dropdown-like or floating-form surfaces attached to a trigger — adopt Popover with modal={false} unless the flow needs the scrim." },
    { area: "ClinicalIQ · Starter",     detail: "Existing prototype menus / pickers currently hand-rolled — sweep to the canonical primitive so keyboard + focus stay consistent." },
    { area: "SourceIQ",                 detail: "Existing floating surfaces — adopt the shared tokens + primitive so tone and geometry stay consistent across products." },
    { area: "Future HC1 IQ modules",    detail: "New products should never introduce bespoke floating anchored surfaces. Compose Popover from day one so click-outside, Escape, focus, and modal behavior all work uniformly." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="Where this Popover replaces existing floating-panel implementations. Standardize behavior — do not redesign the interactions."
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
          { text: "Accessible — role='dialog', aria-haspopup + aria-expanded + aria-controls on trigger, ariaLabel or aria-labelledby on panel" },
          { text: "Focus management — first focusable receives focus on open; focus restores to the trigger on close" },
          { text: "Keyboard supported — Enter/Space opens, Escape closes, Tab moves focus (trapped in modal mode)" },
          { text: "Placement — top / bottom / left / right / auto; flips when the requested side collides with the viewport" },
          { text: "Arrow — auto-positioned to track trigger centre; rotated square gives clean tips on any monitor" },
          { text: "Dismissal — Escape, outside pointer-down (non-modal), scrim click (modal), Popover.Close, or programmatic setOpen" },
          { text: "Modal mode — scrim + focus trap + body scroll lock; shares the counter with Dialog for correct nested overlay behavior" },
          { text: "Reuses overlay infrastructure — createPortal + Escape pattern shared with Dialog, positioning engine shared with Tooltip" },
          { text: "Production ready — controlled + uncontrolled, all 5 placements, arrow / no-arrow, modal / non-modal, closeOnEscape / closeOnOutsideClick opt-outs" },
        ]}
      />
    </DocBlock>
  );
}
