import { aliases } from "../tokens";

const { color, radius, spacing } = aliases;

export function ComingSoonCard({ note }: { note?: string }) {
  return (
    <div
      className="flex min-h-40 flex-col items-start justify-between"
      style={{
        border: `1px dashed ${color.border.strong}`,
        background: color.background.subtle,
        borderRadius: radius.surface,
        padding: spacing.inline.xl,
      }}
    >
      <div className="flex items-center" style={{ gap: spacing.inline.sm }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: radius.circular,
            background: color.action.primary,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: color.action.primary,
          }}
        >
          Coming in next PR
        </span>
      </div>
      <p
        style={{
          marginTop: spacing.inline.lg,
          maxWidth: "44ch",
          fontSize: 14,
          lineHeight: 1.5,
          color: color.text.secondary,
        }}
      >
        {note ??
          "This section is scaffolded and ready for content. A follow-up PR will fill it in without touching the playground shell."}
      </p>
    </div>
  );
}
