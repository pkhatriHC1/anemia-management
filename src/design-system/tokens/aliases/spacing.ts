/**
 * Spacing aliases.
 *
 * Three families of role-named spacing:
 *   inline  — padding within an element
 *   stack   — gap between vertical siblings
 *   section — space between whole page sections
 *
 * Every value references a spacing primitive; components address roles.
 */

import { spacing } from "../primitives/spacing";

export const inline = {
  xs: spacing[4],
  sm: spacing[8],
  md: spacing[12],
  lg: spacing[16],
  xl: spacing[24],
} as const;

export const stack = {
  xs: spacing[4],
  sm: spacing[8],
  md: spacing[12],
  lg: spacing[16],
  xl: spacing[24],
} as const;

export const section = {
  sm: spacing[32],
  md: spacing[48],
  lg: spacing[64],
  xl: spacing[96],
} as const;

export const spacingAlias = { inline, stack, section } as const;

export type SpacingAlias = typeof spacingAlias;
