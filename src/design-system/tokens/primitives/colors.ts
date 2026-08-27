/**
 * Primitive color tokens — HC1 platform palette (v0.9.1).
 *
 * Values sourced verbatim from the approved HC1 platform palette
 * (ClinicalIQ/tokens.json v3.0-draft). See ../../../BRAND_AUDIT.md for
 * the audit that produced these values and the reasoning behind every
 * anchor.
 *
 * NEVER consumed by components directly — the alias layer wraps every
 * primitive in a semantic role (see ../aliases/color.ts).
 *
 * ANCHORS (500 step in every family):
 *   brand    — #0D7782 — HC1 platform primary. Derived in HSL space
 *              from ClinicalIQ's original #1C6882 (blue-steel) and
 *              SourceIQ's original #00A79D (green-teal). Not arbitrary,
 *              not Material. Locked as the platform brand.
 *   accent   — #B75E0B — CTA / warm accent / severity roles. Anchor
 *              contrast-adjusted from the previous bright #F58126 to
 *              meet white-on-fill contrast (≥4.5:1). Bright shades of
 *              the family (accent-300/400) remain available for
 *              identity uses (decorative accents, chart series) but
 *              must not carry white text.
 *   violet   — #6C4DD1 — AI moments ONLY. Hue distinct from brand teal
 *              so 'AI-speaking' reads at a glance. See ../aliases/color.ts
 *              `ai.*` semantic — do not consume violet outside that role.
 *   neutral  — #767C84 — Cool-neutral bluish (~215° hue at low L,
 *              near-0 chroma at high L). Chosen to unify with the teal
 *              brand and read clinical rather than consumer-warm.
 *   green    — #2E7028 — Success. 500 anchor contrast-adjusted from
 *              #388032 to clear WCAG AA (previous failed at ~4.1:1).
 *   yellow   — #B78810 — Medium severity, BACKGROUND ONLY. Text on a
 *              yellow surface uses accent-700 (see severity.medium.text).
 *              Yellow ships only tint steps (50–400); darker slots
 *              placeholder to yellow-400 pending design definition.
 *   red      — #B00A2F — Critical severity. Medical UI convention.
 *   blue     — retained pending platform decision (see BRAND_AUDIT §8.6).
 *              Currently a supporting utility palette, NOT a brand.
 *              Do not use blue for a semantic role until v3 defines
 *              blue's platform meaning.
 *
 * RAMP STRUCTURE:
 *   Eleven steps: 50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 /
 *   900 / 950 — preserved from HC1's original architecture. The 950
 *   slot is not defined by v3; it holds the same value as 900 as a
 *   placeholder pending design. Do not treat 900 and 950 as distinct
 *   shades until a designed 950 value lands.
 *
 * DROPPED FROM v3 (no HC1 slot):
 *   v3 defines a 025 ultra-tint per family (e.g., teal.025 = #EEF7F8,
 *   used for subtle backgrounds). HC1's 11-slot structure has no
 *   room below 50 without a public-API change. If a consumer needs
 *   the 025 tint, propose extending the ramp — do not inline hex.
 */

import type { ColorScale } from "../types";

export const white = "#FFFFFF";
export const black = "#000000";

export const brand: ColorScale = {
  50:  "#DAEEF0",
  100: "#B4DDE2",
  200: "#85C6CD",
  300: "#4EAAB4",
  400: "#248892",
  500: "#0D7782",
  600: "#086068",
  700: "#044A50",
  800: "#023138",
  900: "#011B20",
  950: "#011B20", // placeholder — v3 has no 950 for teal
};

export const accent: ColorScale = {
  50:  "#FDECD1",
  100: "#FBD79E",
  200: "#F7B95E",
  300: "#F1972E",
  400: "#E17E15",
  500: "#B75E0B",
  600: "#914A08",
  700: "#703906",
  800: "#4A2504",
  900: "#291402",
  950: "#291402", // placeholder — v3 has no 950 for amber
};

/**
 * Violet — RESERVED FOR AI. Consumed only through the `ai.*` semantic
 * alias in ../aliases/color.ts. Do not use for a supporting color, a
 * decorative accent, or any non-AI role.
 */
export const violet: ColorScale = {
  50:  "#E7DEF8",
  100: "#D0BFF1",
  200: "#B29AE7",
  300: "#9575DD",
  400: "#7A5CD5",
  500: "#6C4DD1",
  600: "#563AB0",
  700: "#422B8B",
  800: "#2D1D63",
  900: "#1A1140",
  950: "#1A1140", // placeholder — v3 has no 950 for violet
};

export const neutral: ColorScale = {
  50:  "#F4F6F8",
  100: "#EBEDF0",
  200: "#DBDEE3",
  300: "#C1C5CC",
  400: "#9EA3AB",
  500: "#767C84",
  600: "#565C66",
  700: "#3A3F48",
  800: "#21252B",
  900: "#0E1116",
  950: "#0E1116", // placeholder — v3 has no 950 for grey
};

export const green: ColorScale = {
  50:  "#DDF0D9",
  100: "#BFDFB9",
  200: "#93C48C",
  300: "#64A65D",
  400: "#3F8837",
  500: "#2E7028",
  600: "#235920",
  700: "#1A4318",
  800: "#112C10",
  900: "#071607",
  950: "#071607", // placeholder — v3 has no 950 for green
};

/**
 * Yellow — BACKGROUND FILLS ONLY (medium-severity surface tint,
 * warning bg). v3 defines only 025–400; text on yellow must use
 * accent-700 (see severity.medium.text). Darker slots (500–950)
 * are placeholders to yellow-400 pending design definition.
 */
export const yellow: ColorScale = {
  50:  "#FDF0C9",
  100: "#FBDC85",
  200: "#F5C443",
  300: "#E3AD19",
  400: "#B78810",
  500: "#B78810", // placeholder — v3 defines yellow bg-only, no 500+
  600: "#B78810", // placeholder
  700: "#B78810", // placeholder
  800: "#B78810", // placeholder
  900: "#B78810", // placeholder
  950: "#B78810", // placeholder
};

export const red: ColorScale = {
  50:  "#F9D9DE",
  100: "#F0AEB8",
  200: "#E67888",
  300: "#D24358",
  400: "#B71C3A",
  500: "#B00A2F",
  600: "#8F0725",
  700: "#6E051D",
  800: "#4A0313",
  900: "#260109",
  950: "#260109", // placeholder — v3 has no 950 for red
};

/**
 * Blue — SUPPORTING UTILITY, not a brand or semantic role.
 * v3 does not define a blue scale (info uses primary teal instead).
 * Retained here for chart series, data-viz, and any consumer that
 * needs a blue distinct from the brand teal. Do not promote blue
 * to a semantic role until v3 defines its platform meaning.
 * See BRAND_AUDIT.md §8.6.
 */
export const blue: ColorScale = {
  50:  "#EBF2FE",
  100: "#CFDFFB",
  200: "#A5C2F7",
  300: "#77A2F1",
  400: "#4A82E9",
  500: "#2263DB",
  600: "#1B4EB0",
  700: "#143B84",
  800: "#0D2757",
  900: "#07152F",
  950: "#030A18",
};

export const primitiveColors = {
  white,
  black,
  brand,
  accent,
  violet,
  neutral,
  green,
  yellow,
  red,
  blue,
} as const;
