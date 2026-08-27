/**
 * Aliases barrel.
 *
 * The public API for components. Only these tokens should be imported
 * by anything that renders UI. Primitives stay behind the wall.
 */

import { color } from "./color";
import { typography } from "./typography";
import { spacingAlias } from "./spacing";
import { radiusAlias } from "./radius";
import { elevationAlias } from "./elevation";
import { motion } from "./motion";

export const aliases = {
  color,
  typography,
  spacing:   spacingAlias,
  radius:    radiusAlias,
  elevation: elevationAlias,
  motion,
} as const;

export type Aliases = typeof aliases;

export * from "./color";
export * from "./typography";
export * from "./spacing";
export * from "./radius";
export * from "./elevation";
export * from "./motion";
