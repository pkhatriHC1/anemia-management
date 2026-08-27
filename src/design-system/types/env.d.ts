/**
 * Ambient type declarations for build-time environment flags.
 *
 * The package reads `import.meta.env.DEV` in a few components to gate
 * dev-only assertions (accessible-name checks, warning logs). Every
 * modern browser bundler exposes this — Vite natively, Webpack/Next
 * via plugins that mirror the shape. Declaring the type here keeps
 * the package independent of any specific bundler's ambient types
 * (so we do not add `vite/client` as a build-time contract).
 *
 * Fields are optional because consumers using a bundler that does not
 * populate them will get `undefined` — the guarded branch simply does
 * not run. This is the correct behaviour: dev-only assertions are a
 * best-effort convenience, never load-bearing at runtime.
 */

interface ImportMetaEnv {
  readonly DEV?: boolean;
  readonly PROD?: boolean;
  readonly MODE?: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}
