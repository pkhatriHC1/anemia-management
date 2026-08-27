import { DocPage, DocBlock, RuleList, DoDontGrid, Callout, t } from "./_shared";

const INTERACTIONS: {
  name: string;
  token: string;
  description: string;
}[] = [
  { name: "Hover in",     token: "motion.hoverIn (150ms · standard)",       description: "Fast on entry — feedback that the pointer is over an interactive element." },
  { name: "Hover out",    token: "motion.hoverOut (250ms · standard)",      description: "Slower on exit — accidental un-hovers don't strobe." },
  { name: "Focus transition", token: "motion.hoverIn (150ms · standard)",   description: "Focus ring appears in the same rhythm as hover — same fast, same easing." },
  { name: "Overlay enter", token: "motion.overlayEnter (250ms · entrance)", description: "Modals, drawers, popovers arrive gently, easing in from suppressed opacity." },
  { name: "Overlay exit",  token: "motion.overlayExit (150ms · exit)",      description: "Dismissal is snappier — get out of the user's way." },
  { name: "Loading",       token: "custom (repeating, 900ms linear)",       description: "Spinner rotation is the one indefinite motion. Every other motion has a defined end." },
];

export function MotionRulesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Motion has a job"
        lead="Motion in hc1 is never decorative. Every transition either provides feedback (something responded to my input) or preserves continuity (this thing is the same thing that was here). Motion for delight is out of scope for the current language."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every transition uses a motion token — never a raw duration or curve." },
            { tone: "must",     text: "Hover pairs are asymmetric: fast in, slower out. Never a symmetric duration for both." },
            { tone: "must",     text: "Overlay enter uses the entrance curve; overlay exit uses the exit curve. They are different, on purpose." },
            { tone: "must",     text: "Respect prefers-reduced-motion — reduce transforms and opacity animations to instant." },
            { tone: "must-not", text: "Never spring, bounce, or oscillate. hc1 motion is calm, not playful." },
            { tone: "must-not", text: "Never animate a color and a size at the same time in the same element — pick one channel." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Interaction map">
        <div
          style={{
            border: `1px solid ${t.color.border.subtle}`,
            borderRadius: t.radius.control,
            background: t.color.background.default,
            padding: t.space.inline.lg,
            display: "flex",
            flexDirection: "column",
            gap: t.space.stack.md,
          }}
        >
          {INTERACTIONS.map(i => (
            <div
              key={i.name}
              style={{
                display: "grid",
                gridTemplateColumns: "160px minmax(220px, 320px) 1fr",
                gap: t.space.inline.lg,
                alignItems: "start",
                paddingBottom: t.space.stack.sm,
                borderBottom: `1px dashed ${t.color.border.subtle}`,
              }}
            >
              <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{i.name}</div>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary }}>{i.token}</code>
              <div style={{ ...t.type.caption, color: t.color.text.secondary }}>{i.description}</div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Reference tokens by role",   description: "'hoverIn' says why. '150ms cubic-bezier(...)' says what — and rots." },
            { title: "Cap transition length",      description: "Nothing in a UI transition should exceed 350ms. If it does, it's not a transition — it's an animation." },
          ]}
          donts={[
            { title: "Bouncy modals",              description: "Overlay-enter is a gentle easing curve, not a bounce. No exceptions." },
            { title: "Simultaneous opacity + scale + translate", description: "Composite effects fight readability. Pick the one channel that carries the meaning." },
          ]}
        />
      </DocBlock>

      <Callout tone="info">
        The prefers-reduced-motion media query is not optional — every motion helper the design system ships must set
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>transition-duration: 0ms</code>
        when the user asks for reduced motion.
      </Callout>
    </DocPage>
  );
}
