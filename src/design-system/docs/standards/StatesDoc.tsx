import { DocPage, DocBlock, RuleList, DoDontGrid, Callout, t } from "./_shared";

type StateSpec = {
  name: string;
  description: string;
  visual: (props: { children?: React.ReactNode }) => React.ReactElement;
  requirement: string;
};

function baseButton(overrides: React.CSSProperties = {}): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `${t.space.stack.sm} ${t.space.inline.lg}`,
    borderRadius: t.radius.control,
    background: t.color.action.primary,
    color: t.color.text.inverse,
    fontFamily: t.font.sans,
    fontSize: 14,
    fontWeight: 600,
    border: `1px solid ${t.color.action.primary}`,
    transition: `all ${t.motion.hoverIn.duration} ${t.motion.hoverIn.easing}`,
    ...overrides,
  };
}

const STATES: StateSpec[] = [
  {
    name: "Default",
    description: "Rest state. What the component looks like when nothing is happening.",
    visual: () => <div style={baseButton()}>Label</div>,
    requirement: "Must render without any hover / focus / active affordances.",
  },
  {
    name: "Hover",
    description: "Pointer is over the element. Signals affordance without commitment.",
    visual: () => <div style={baseButton({ background: t.color.action.primaryHover, borderColor: t.color.action.primaryHover })}>Label</div>,
    requirement: "Uses hoverIn motion pair (fast in, slower out). Never a color the user has to guess at.",
  },
  {
    name: "Focused",
    description: "Element has keyboard focus. Must be visible without a mouse.",
    visual: () => (
      <div
        style={baseButton({
          outline: `2px solid ${t.color.border.focus}`,
          outlineOffset: 2,
        })}
      >
        Label
      </div>
    ),
    requirement: "2px outline, 2px offset, brand color. Never suppressed with outline:none.",
  },
  {
    name: "Pressed",
    description: "Actively being clicked / tapped / activated with Enter or Space.",
    visual: () => <div style={baseButton({ background: t.color.action.primaryActive, borderColor: t.color.action.primaryActive })}>Label</div>,
    requirement: "Uses the -active alias. Provides immediate feedback under 100ms.",
  },
  {
    name: "Disabled",
    description: "Not interactive. Retains its layout footprint; does not receive focus.",
    visual: () => (
      <div style={baseButton({ background: t.color.action.primaryDisabled, borderColor: t.color.action.primaryDisabled, color: t.color.text.disabled, cursor: "not-allowed" })}>
        Label
      </div>
    ),
    requirement: "aria-disabled + tabIndex=-1. Never rely on cursor:not-allowed alone.",
  },
  {
    name: "Loading",
    description: "Async work in flight. The component is temporarily non-interactive.",
    visual: () => (
      <div style={baseButton({ opacity: 0.9, pointerEvents: "none" })}>
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            border: `2px solid ${t.color.text.inverse}`,
            borderTopColor: "transparent",
            borderRadius: t.radius.circular,
            marginRight: t.space.inline.xs,
            animation: "hc-spin 900ms linear infinite",
          }}
        />
        Loading
      </div>
    ),
    requirement: "Announces via aria-busy=true and a polite live region. Preserves width to prevent layout shift.",
  },
];

export function StatesDoc() {
  return (
    <DocPage>
      <style>{`@keyframes hc-spin { to { transform: rotate(360deg); } }`}</style>

      <DocBlock
        eyebrow="Purpose"
        title="Six states, exhaustively"
        lead="Every interactive component must support all six states — default, hover, focused, pressed, disabled, loading. Missing a state is a defect, not a nice-to-have. Users experience each of these; the design system does not get to skip one."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every interactive component implements all six states." },
            { tone: "must",     text: "Focus must be visible on a light background AND a dark background." },
            { tone: "must-not", text: "Never remove focus outline. If the default is ugly, restyle it — do not suppress it." },
            { tone: "must",     text: "Loading preserves the component's rendered dimensions — no layout shift." },
            { tone: "must",     text: "Disabled sets aria-disabled and removes focus (tabIndex=-1); it does not vanish visually." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Visual examples">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.md,
          }}
        >
          {STATES.map(s => (
            <div
              key={s.name}
              style={{
                border: `1px solid ${t.color.border.subtle}`,
                borderRadius: t.radius.control,
                background: t.color.background.default,
                padding: t.space.inline.lg,
                display: "flex",
                flexDirection: "column",
                gap: t.space.stack.sm,
              }}
            >
              <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
                {s.name}
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control }}>
                <s.visual />
              </div>
              <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{s.description}</div>
              <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{s.requirement}</div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Test each state with the keyboard",        description: "Tab to it. Enter it. Confirm the focus ring, hover, and pressed all look right." },
            { title: "Announce loading with aria-busy",          description: "Screen readers must know the component is working, not broken." },
            { title: "Preserve dimensions in loading",           description: "A shifting layout is a broken layout — reserve label width or use a fixed spinner region." },
          ]}
          donts={[
            { title: "outline: none",                            description: "Never. Restyle if the default is ugly, but keyboard focus must remain visible." },
            { title: "'It's disabled — no need for aria'",       description: "Aria-disabled matters even more when the visual affordance is subtle." },
            { title: "Hover-only affordances",                   description: "Touch users have no hover. Any information conveyed on hover must also be available another way." },
          ]}
        />
      </DocBlock>

      <Callout tone="info">
        A quick QA gate: with the browser's Force Element State panel, cycle through hover / focus / active / disabled — every
        transition must land in a defined visual, not a partial one.
      </Callout>
    </DocPage>
  );
}
