/**
 * Local token shortcuts for standards docs.
 * Every helper in this folder imports from here so pages stay terse.
 */
import { aliases, primitives } from "../../../tokens";

export const t = {
  color:      aliases.color,
  type:       aliases.typography,
  space:      aliases.spacing,
  radius:     aliases.radius,
  elevation:  aliases.elevation,
  motion:     aliases.motion,
  font:       primitives.fontFamily,
  fontSize:   primitives.fontSize,
} as const;
