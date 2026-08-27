/**
 * Typography aliases.
 *
 * Named text roles — every one composes primitive size / line-height /
 * weight / tracking values. Components apply a role, never a raw size.
 */

import {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
} from "../primitives/typography";
import type { TypographyStyle } from "../types";

export const displayXL: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[64],
  lineHeight:    lineHeight[72],
  fontWeight:    fontWeight.bold,
  letterSpacing: letterSpacing.tighter,
};

export const displayL: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[48],
  lineHeight:    lineHeight[56],
  fontWeight:    fontWeight.bold,
  letterSpacing: letterSpacing.tighter,
};

export const headingXL: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[36],
  lineHeight:    lineHeight[44],
  fontWeight:    fontWeight.bold,
  letterSpacing: letterSpacing.tight,
};

export const headingL: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[30],
  lineHeight:    lineHeight[36],
  fontWeight:    fontWeight.bold,
  letterSpacing: letterSpacing.tight,
};

export const headingM: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[24],
  lineHeight:    lineHeight[32],
  fontWeight:    fontWeight.semibold,
  letterSpacing: letterSpacing.normal,
};

export const headingS: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[20],
  lineHeight:    lineHeight[28],
  fontWeight:    fontWeight.semibold,
  letterSpacing: letterSpacing.normal,
};

export const bodyL: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[18],
  lineHeight:    lineHeight[28],
  fontWeight:    fontWeight.regular,
  letterSpacing: letterSpacing.normal,
};

export const body: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[16],
  lineHeight:    lineHeight[24],
  fontWeight:    fontWeight.regular,
  letterSpacing: letterSpacing.normal,
};

export const bodyS: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[14],
  lineHeight:    lineHeight[20],
  fontWeight:    fontWeight.regular,
  letterSpacing: letterSpacing.normal,
};

export const caption: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[12],
  lineHeight:    lineHeight[16],
  fontWeight:    fontWeight.regular,
  letterSpacing: letterSpacing.normal,
};

export const label: TypographyStyle = {
  fontFamily:    fontFamily.sans,
  fontSize:      fontSize[12],
  lineHeight:    lineHeight[16],
  fontWeight:    fontWeight.semibold,
  letterSpacing: letterSpacing.wide,
};

export const typography = {
  displayXL,
  displayL,
  headingXL,
  headingL,
  headingM,
  headingS,
  bodyL,
  body,
  bodyS,
  caption,
  label,
} as const;

export type TypographyAlias = keyof typeof typography;
