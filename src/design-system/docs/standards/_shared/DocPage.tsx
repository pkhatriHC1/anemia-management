import type { ReactNode } from "react";
import { t } from "./tokens";

/**
 * Whole-page wrapper for a standards doc. Renders the six canonical
 * blocks in order (Purpose, Rules, Visual Examples, Best Practices,
 * Common Mistakes, Implementation Notes) with consistent rhythm.
 *
 * Any block may be omitted — the wrapper does not enforce their
 * presence, only their spacing when present.
 */
export function DocPage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.section.sm,
      }}
    >
      {children}
    </div>
  );
}
