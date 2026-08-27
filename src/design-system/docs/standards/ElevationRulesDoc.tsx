import { DocPage, DocBlock, RuleList, DoDontGrid, Callout, t } from "./_shared";

type Level = { name: string; alias: string; usage: string; shadow: string };

const LEVELS: Level[] = [
  { name: "Flat",     alias: "elevation.surface", usage: "Cards, panels, list rows. The default — the base layer of the page.",         shadow: t.elevation.surface },
  { name: "Raised",   alias: "elevation.raised",  usage: "Hover state on cards, sticky headers just barely detached from the surface.",  shadow: t.elevation.raised },
  { name: "Floating", alias: "elevation.popover", usage: "Popovers, dropdown menus, autocomplete lists — attached to a trigger.",        shadow: t.elevation.popover },
  { name: "Overlay",  alias: "elevation.overlay", usage: "Drawers, side sheets — surfaces that own a region of the viewport.",           shadow: t.elevation.overlay },
  { name: "Modal",    alias: "elevation.modal",   usage: "Modals that block interaction with the underlying page.",                      shadow: t.elevation.modal },
];

export function ElevationRulesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="Elevation is a hierarchy, not a decoration"
        lead="Each of the five elevation levels means something. Higher = more attention-grabbing. Cards do not float 'because it looks nice' — they float because they are detached from the page in a specific, meaningful way. Overloading elevation flattens its meaning."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Every shadow comes from an elevation alias — surface / raised / popover / overlay / modal." },
            { tone: "must-not", text: "Never author a custom box-shadow. Not even 'just for this one case'." },
            { tone: "must",     text: "Only one Modal-level surface is visible at a time. Modals are exclusive." },
            { tone: "should",   text: "Cards are flat by default. Elevate only during hover, drag, or when they detach from the page." },
            { tone: "must",     text: "Overlay and Modal surfaces render above a scrim (0.5 opacity) — never bare over content." },
          ]}
        />
      </DocBlock>

      <DocBlock title="Elevation ladder">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: t.space.section.sm,
            padding: t.space.section.sm,
            background: t.color.background.subtle,
            borderRadius: t.radius.control,
          }}
        >
          {LEVELS.map(l => (
            <div key={l.name} style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm, alignItems: "center" }}>
              <div
                style={{
                  width: "100%",
                  height: 96,
                  background: t.color.background.default,
                  border: l.shadow === "none" ? `1px solid ${t.color.border.subtle}` : "none",
                  borderRadius: t.radius.control,
                  boxShadow: l.shadow,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{l.name}</div>
                <code style={{ fontFamily: t.font.mono, fontSize: 11, color: t.color.action.primary }}>{l.alias}</code>
                <div style={{ ...t.type.caption, color: t.color.text.secondary, marginTop: 4 }}>{l.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </DocBlock>

      <DocBlock title="Best practices vs common mistakes">
        <DoDontGrid
          dos={[
            { title: "Match elevation to detachment",  description: "The more a surface is 'floating away' from the page, the higher its elevation." },
            { title: "Elevate on hover, not at rest",  description: "Card hover from surface → raised is a well-earned signal. Cards raised at rest are noise." },
          ]}
          donts={[
            { title: "Custom drop-shadow for 'depth'",  description: "The system already has depth. Use the alias — never write your own." },
            { title: "Nested elevation stacks",         description: "A popover inside a modal that itself casts a shadow reads as clutter. Keep depth grammatical." },
          ]}
        />
      </DocBlock>

      <Callout tone="note">
        The elevation ladder is intentionally short (5 levels). Proposing a sixth is proposing a language change — see the
        design-system ADR process before adding one.
      </Callout>
    </DocPage>
  );
}
