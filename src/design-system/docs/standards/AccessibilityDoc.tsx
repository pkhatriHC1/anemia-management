import { DocPage, DocBlock, RuleList, DoDontGrid, Callout, t } from "./_shared";

type Standard = { name: string; requirement: string; verification: string };

const STANDARDS: Standard[] = [
  {
    name: "Keyboard navigation",
    requirement: "Every interactive element is reachable via Tab / Shift+Tab and operable via Enter, Space, or arrow keys as appropriate.",
    verification: "Unplug the mouse. Navigate the whole feature end-to-end. If any step is impossible, the component fails.",
  },
  {
    name: "Focus visibility",
    requirement: "Focus is visible via a 2px outline offset by 2px, using the brand color, on every focusable element.",
    verification: "Tab to every element. If the focus ring is invisible, hidden, or ambiguous — fix it.",
  },
  {
    name: "Minimum touch targets",
    requirement: "Interactive controls meet 44×44 CSS px on touch inputs. Extend hit area invisibly if the visual is smaller.",
    verification: "Enable Chrome DevTools 'Show hit-testable area' or manually measure. Sub-44px touch targets are a defect.",
  },
  {
    name: "ARIA support",
    requirement: "Semantic HTML first. ARIA only when HTML can't express the role. Every widget follows the WAI-ARIA Authoring Practices for its pattern.",
    verification: "Screen-reader smoke test with VoiceOver (macOS) or NVDA (Windows). The component must announce its role, name, and state.",
  },
  {
    name: "Contrast requirements",
    requirement: "Body text ≥ 4.5:1, large text (18px+ or 14px bold+) ≥ 3:1, UI controls and graphical objects ≥ 3:1. Applies to every state.",
    verification: "Chrome DevTools contrast panel on hover, focus, disabled — every state, not just rest.",
  },
  {
    name: "Disabled states",
    requirement: "Disabled elements set aria-disabled=true and remove focus (tabIndex=-1). They remain readable (may be below AA — documented exception).",
    verification: "Tab past a disabled control — it should not receive focus. Screen readers should announce 'dimmed' or 'unavailable'.",
  },
  {
    name: "Loading announcements",
    requirement: "Async work sets aria-busy=true on the affected region and uses a polite live region to announce completion.",
    verification: "Trigger a loading state with VoiceOver on. Confirm the state is announced without interrupting the user.",
  },
  {
    name: "Reduced motion",
    requirement: "Respect prefers-reduced-motion: reduce. Transform-based transitions become instant; only opacity crossfades may remain (and only if brief).",
    verification: "Enable Reduce Motion in system preferences. Reload. Every animation should stop or shorten.",
  },
];

export function AccessibilityDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Accessibility is a ship gate"
        lead="Every component is reviewed against this list before it merges. There is no 'iterate on a11y later.' Retrofitting accessibility is disproportionately expensive and, in practice, is what causes long-tail defects. The list below is short because every item is mandatory — none are optional."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every standard on this page is verified before a component is marked ready." },
            { tone: "must",     text: "Semantic HTML is the default. Reach for ARIA only to express what HTML can't." },
            { tone: "must-not", text: "Never ship a component that fails any of these standards, even 'temporarily'." },
            { tone: "should",   text: "Regressions are treated as build-blockers, not backlog items." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Standards">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: t.space.stack.md,
          }}
        >
          {STANDARDS.map(s => (
            <div
              key={s.name}
              style={{
                border: `1px solid ${t.color.border.subtle}`,
                borderRadius: t.radius.control,
                background: t.color.background.default,
                padding: t.space.inline.lg,
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: t.space.inline.lg,
              }}
            >
              <div>
                <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.text.primary }}>{s.name}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
                <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{s.requirement}</div>
                <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>
                  <strong style={{ color: t.color.text.secondary }}>How to verify — </strong>
                  {s.verification}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Test with the keyboard first",       description: "Every feature. Every review. This catches ~70% of a11y defects before code review starts." },
            { title: "Announce state changes politely",    description: "Loading, saved, validation error — the user's screen reader hears the change." },
          ]}
          donts={[
            { title: "Suppress focus ring",                description: "The most common a11y failure. Fix the ring style; never turn it off." },
            { title: "Color as sole signal",               description: "Red text alone is not an error indicator to a color-blind user. Add an icon or label." },
            { title: "Placeholder as label",               description: "Placeholder disappears on focus. Always pair inputs with a persistent label." },
          ]}
        />
      </DocBlock>

      <Callout tone="warning">
        The Component Checklist page turns each standard on this page into a machine-checkable line. A component is not
        ready to ship until every line on that checklist is green.
      </Callout>
    </DocPage>
  );
}
