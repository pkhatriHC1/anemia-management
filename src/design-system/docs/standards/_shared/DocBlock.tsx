import type { ReactNode } from "react";
import { t } from "./tokens";

/**
 * A titled documentation subsection. Every standards page composes of
 * DocBlock instances — Purpose, Rules, Visual Examples, Best Practices,
 * Common Mistakes, Implementation Notes.
 */
export function DocBlock({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
      {eyebrow && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: t.color.text.tertiary,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h3
        style={{
          ...t.type.headingS,
          color: t.color.text.primary,
          margin: 0,
        }}
      >
        {title}
      </h3>
      {lead && (
        <p
          style={{
            ...t.type.body,
            color: t.color.text.secondary,
            margin: 0,
            maxWidth: "62ch",
          }}
        >
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}
