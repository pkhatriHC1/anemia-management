/**
 * @hc1/design-system — public API
 *
 * The curated surface every HC1 IQ product consumes. Anything not
 * re-exported here is internal and not covered by the semver contract.
 *
 * Entry points:
 *   .              → this file (components + tokens namespace)
 *   ./tokens       → primitives, aliases, and component tokens directly
 *   ./styles       → the CSS variables bridge (import once at app entry)
 *   ./playground   → the interactive documentation app (dev-mode only)
 */

// Components — the shipped component surface.
export * from "./components";

// Tokens namespace — for consumers that want a single import path.
// (Also available directly at "@hc1/design-system/tokens".)
export * as tokens from "./tokens";
