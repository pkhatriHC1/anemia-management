import { aliases } from "../tokens";

const { color, typography, spacing } = aliases;

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: spacing.section.sm }}>
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
        {eyebrow}
      </div>
      <h2
        style={{
          ...typography.headingL,
          color: color.text.primary,
          margin: 0,
          marginBottom: spacing.stack.sm,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          ...typography.bodyS,
          color: color.text.secondary,
          maxWidth: "62ch",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
