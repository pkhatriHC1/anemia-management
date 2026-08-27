import { t } from "./tokens";

export type RuleTone = "must" | "must-not" | "should" | "note";

export type Rule = {
  tone: RuleTone;
  text: string;
  reason?: string;
};

const TONE_MAP: Record<RuleTone, { symbol: string; color: string; label: string }> = {
  "must":     { symbol: "✓", color: t.color.status.success.fg, label: "Must" },
  "must-not": { symbol: "✗", color: t.color.status.error.fg,   label: "Never" },
  "should":   { symbol: "→", color: t.color.action.primary,    label: "Should" },
  "note":     { symbol: "i", color: t.color.text.tertiary,     label: "Note" },
};

export function RuleList({ rules }: { rules: Rule[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      {rules.map((rule, i) => {
        const tone = TONE_MAP[rule.tone];
        return (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr",
              gap: t.space.inline.sm,
              alignItems: "flex-start",
            }}
          >
            <span
              aria-label={tone.label}
              style={{
                width: 22,
                height: 22,
                borderRadius: t.radius.circular,
                background: `${tone.color}18`,
                color: tone.color,
                fontWeight: 700,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
                lineHeight: 1,
              }}
            >
              {tone.symbol}
            </span>
            <div>
              <div style={{ ...t.type.body, color: t.color.text.primary }}>{rule.text}</div>
              {rule.reason && (
                <div
                  style={{
                    ...t.type.bodyS,
                    color: t.color.text.tertiary,
                    marginTop: 2,
                  }}
                >
                  {rule.reason}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
