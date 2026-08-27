/**
 * Color aliases — HC1 platform semantic layer (v0.9.1).
 *
 * Every semantic role a component might need — surfaces, borders, ink,
 * actions, CTAs, AI moments, medical severity, event feedback. Every
 * value references a primitive; nothing hardcoded here.
 *
 * This is the ONLY color source components may consume. Never reach
 * past this layer to grab a raw scale value.
 *
 * Values sourced verbatim from the approved HC1 platform palette
 * (ClinicalIQ/tokens.json v3.0-draft `semantics.color`). See
 * ../../../BRAND_AUDIT.md for reasoning.
 *
 * SEMANTIC MODEL — one alias per role, roles do not overlap:
 *   background  — page/surface/scrim tints
 *   border      — subtle → default → strong ladder + focus + inverse
 *   text        — primary → tertiary ladder + inverse + link
 *   action      — primary + secondary + accent (amber) + danger
 *   cta         — execute / irreversible only. Amber. Never the default.
 *   ai          — AI-generated content only. Violet. Never decorative.
 *   severity    — state-scoped medical status (critical/high/medium/low/normal).
 *   status      — event-scoped feedback (success/info/warning/error).
 *
 * SEVERITY vs STATUS (deliberately kept distinct — see FOUNDATION.md):
 *   severity describes a persistent state ("this patient is critical").
 *   status   describes a momentary event ("the save succeeded").
 *   Same underlying palette, different semantic scope. Do not merge.
 */

import { brand, accent, violet, neutral, green, yellow, red, blue, white } from "../primitives/colors";

export const background = {
  default:  white,
  surface:  white,          // v3: surface = white (elevated white on page grey)
  elevated: white,
  subtle:   neutral[100],
  muted:    neutral[200],
  inverse:  neutral[900],
  page:     neutral[50],    // v3 page background — subtle grey behind surfaces
  scrim:    "rgba(14, 17, 22, 0.5)",  // v3 scrim — grey.900 @ 50% for overlays
} as const;

export const border = {
  subtle:  neutral[100],
  default: neutral[200],
  strong:  neutral[300],
  focus:   brand[500],
  inverse: neutral[700],
} as const;

export const text = {
  primary:   neutral[900],
  secondary: neutral[700],
  tertiary:  neutral[500],
  disabled:  neutral[400],
  inverse:   white,
  link:      brand[600],
  linkHover: brand[700],
  onSolid:   white,           // v3: fg on solid colored fills
} as const;

export const action = {
  primary:          brand[500],
  primaryHover:     brand[600],
  primaryActive:    brand[700],
  primaryDisabled:  neutral[200],
  primaryOnDark:    brand[300],

  secondary:        neutral[900],
  secondaryHover:   neutral[800],
  secondaryActive:  neutral[950],

  /** Accent = amber ramp. `cta.*` is the canonical name for this role.
   *  Retained on `action` for backward compatibility with existing docs. */
  accent:           accent[500],
  accentHover:      accent[600],
  accentActive:     accent[700],

  danger:           red[500],
  dangerHover:      red[600],
  dangerActive:     red[700],
} as const;

/**
 * CTA — execute / irreversible actions. Amber. Reserved.
 *
 * Use for: "Publish", "Send", "Approve", "Finalize", "Delete" — actions
 * that cannot be undone by clicking again. Never use as the default
 * action; the primary action is `action.primary` (teal).
 *
 * See FOUNDATION.md §8. The amber-500 anchor is contrast-adjusted from
 * the previous bright #F58126 to carry white text at ≥4.5:1 contrast.
 */
export const cta = {
  default:  accent[500],
  hover:    accent[600],
  active:   accent[700],
  border:   accent[600],
} as const;

/**
 * AI — AI-generated content moments ONLY.
 *
 * Reserved for surfaces where the product is showing a clinician a
 * genuine AI-generated result: suggested care plan, anomaly detected,
 * summarized report. Never decorative. Never brand chrome. Never for
 * a section banner that has no AI content behind it.
 *
 * See FOUNDATION.md §8: "using the AI gradient decoratively devalues
 * the signal so that when a real AI moment appears, the clinician has
 * already tuned it out."
 */
export const ai = {
  default:      violet[500],
  hover:        violet[600],
  subtleBg:     violet[50],
  gradientFrom: violet[700],
  gradientVia:  violet[500],
  gradientTo:   brand[300],
} as const;

/**
 * Severity — state-scoped medical status.
 *
 * Five tiers: critical / high / medium / low / normal. Each carries
 * text + bg + bgSubtle + border. Icon color equals text color.
 *
 * v3 medical convention: color is never used alone. Every severity
 * chip pairs color with an icon glyph so colorblind users get the
 * signal from shape as well as hue.
 *
 * Distinct from `status` — severity describes a persistent patient/
 * data state; status describes a momentary event.
 */
export const severity = {
  critical: {
    text:     red[500],
    bg:       red[50],
    bgSubtle: red[50],   // v3: red.025 dropped — bgSubtle placeholders to bg
    border:   red[100],
  },
  high: {
    text:     accent[700],
    bg:       accent[100],
    bgSubtle: accent[50],
    border:   accent[200],
  },
  medium: {
    text:     accent[700],
    bg:       yellow[50],
    bgSubtle: yellow[50],
    border:   yellow[100],
  },
  low: {
    text:     neutral[600],
    bg:       neutral[200],
    bgSubtle: neutral[100],
    border:   neutral[300],
  },
  normal: {
    text:     green[500],
    bg:       green[50],
    bgSubtle: green[50],  // v3: green.025 dropped — bgSubtle placeholders to bg
    border:   green[100],
  },
} as const;

/**
 * SeverityTier — the tier union used everywhere severity is expressed
 * (StatusChip, Gauge, severity-aware Badges, and any product-scoped
 * risk-score visualization). Kept adjacent to the `severity` alias so
 * the taxonomy and the color palette move together.
 */
export type SeverityTier = keyof typeof severity;

/**
 * Status — event-scoped feedback (toast, inline alert, form validation).
 *
 * Four events: success / info / warning / error. Each carries
 * fg + bg + border + icon. Icon color is deliberately dimmer than fg
 * (500-step) so the message text reads primary.
 *
 * Info uses the primary brand teal, not blue. Blue is retained as a
 * supporting utility palette (see primitives) but does not carry a
 * semantic role yet.
 *
 * Distinct from `severity` — see severity docstring.
 */
export const status = {
  success: {
    fg:     green[500],
    bg:     green[50],
    border: green[100],
    icon:   green[500],
  },
  warning: {
    fg:     accent[700],
    bg:     yellow[50],
    border: yellow[100],
    icon:   accent[600],
  },
  error: {
    fg:     red[500],
    bg:     red[50],
    border: red[100],
    icon:   red[500],
  },
  info: {
    fg:     brand[500],  // v3: info uses primary teal, not blue
    bg:     brand[50],
    border: brand[100],
    icon:   brand[500],
  },
} as const;

export const color = {
  background,
  border,
  text,
  action,
  cta,
  ai,
  severity,
  status,
} as const;

export type ColorAlias = typeof color;

/** Blue as a supporting utility. Not a semantic role.
 *  Consumers that need blue (chart series, distinct-from-brand data-viz)
 *  can import from primitives directly. This alias exists ONLY so a
 *  future v3 blue-semantic definition has a slot to inhabit. */
export const supportingBlue = blue;
