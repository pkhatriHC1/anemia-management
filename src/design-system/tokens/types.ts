/**
 * Shared token types.
 *
 * Every token module exports typed `as const` values. These types define
 * the shape of the two shared token structures (color scales, semantic
 * ramps) so consumers can build type-safe theme mappings.
 *
 * This file is intentionally framework-agnostic — the tokens package
 * ships as pure TS. Runtime imports (React, CSS) live elsewhere.
 */

export type ColorScaleStep =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorScale = Record<ColorScaleStep, string>;

export type FontWeight = 400 | 500 | 600 | 700;

export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: FontWeight;
  letterSpacing: string;
};

export type ShadowDefinition = string;
