import { aliases } from "../tokens";

const { color, typography, spacing } = aliases;

export function PageHeader() {
  return (
    <header style={{ marginBottom: spacing.section.md }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: color.action.primary,
          marginBottom: spacing.stack.sm,
        }}
      >
        hc1 design system
      </div>
      <h1
        style={{
          ...typography.headingXL,
          color: color.text.primary,
          margin: 0,
          marginBottom: spacing.stack.md,
        }}
      >
        Playground
      </h1>
      <p
        style={{
          ...typography.body,
          color: color.text.secondary,
          maxWidth: "62ch",
          margin: 0,
        }}
      >
        A living reference for every hc1 token, primitive, component, and pattern.
        Every IQ module — ClinicalIQ, SourceIQ, and future modules — will consume
        from this system.
      </p>
    </header>
  );
}
