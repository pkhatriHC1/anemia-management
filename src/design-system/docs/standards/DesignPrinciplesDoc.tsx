import { DocPage, DocBlock, RuleList, Callout, t } from "./_shared";

export function DesignPrinciplesDoc() {
  return (
    <DocPage>
      <DocBlock
        eyebrow="Purpose"
        title="The principles every component must obey"
        lead="These are load-bearing rules, not suggestions. Every component built for the hc1 design system — today or in five years — must be reviewable against this list. If a component violates a principle, the component is wrong, not the principle."
      />

      <DocBlock title="Rules">
        <RuleList
          rules={[
            { tone: "must",     text: "Design tokens are the only source of truth.",           reason: "Values live in one place — the tokens package. Everything downstream references them." },
            { tone: "must-not", text: "Components never use primitive tokens directly.",       reason: "Reaching past the alias layer breaks the wall that makes theming possible." },
            { tone: "must",     text: "Components consume semantic aliases only.",             reason: "Aliases name what a value means, not what it is. Roles survive redesigns; hex values don't." },
            { tone: "must-not", text: "Components never hardcode colors.",                    reason: "Any hex, rgb, or hsl literal inside a component is a lint-level failure." },
            { tone: "must-not", text: "Components never hardcode spacing.",                   reason: "Every padding, margin, and gap resolves to a spacing token." },
            { tone: "must-not", text: "Components never hardcode typography.",                reason: "Font size, line-height, weight, and tracking come from typography roles, not raw values." },
            { tone: "must-not", text: "Components never create custom shadows.",              reason: "Shadow is elevation — an idea, not a decoration. Use the five elevation aliases." },
            { tone: "must",     text: "Components remain composable.",                        reason: "Prefer small primitives that compose over monolithic components with many props." },
            { tone: "must",     text: "Every interactive element supports keyboard navigation.", reason: "Tab, Shift+Tab, Enter, Space, Arrow keys — no exceptions, ever." },
            { tone: "must",     text: "Accessibility is mandatory, never optional.",          reason: "Ship-blocker, not nice-to-have. The Accessibility standards page is a checklist, not a wish list." },
            { tone: "should",   text: "Consistency is preferred over creativity.",            reason: "Novelty within a component library is a cost, not a feature. When in doubt, look for prior art in this system first." },
          ]}
        />
      </DocBlock>

      <Callout tone="info">
        A pull request that violates any <em>must</em> or <em>must-not</em> rule is not ready for review.
        Reviewers should quote the specific principle in their comment so the standard remains the reference,
        not the reviewer's taste. Deviations require an ADR — never a one-off exception.
      </Callout>

      <DocBlock title="Implementation Notes">
        <p style={{ ...t.type.bodyS, color: t.color.text.secondary, margin: 0, maxWidth: "62ch" }}>
          These principles predate every specific component. A new component starts by listing which primitives
          and aliases it needs, then requests any additions to the alias layer <em>before</em> writing render
          code. Adding aliases mid-implementation is a signal the component is trying to invent something the
          system doesn't yet know about.
        </p>
      </DocBlock>
    </DocPage>
  );
}
