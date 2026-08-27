/**
 * Primitive z-index tokens.
 *
 * Named layers, never raw numeric z-index in components. Gaps between
 * values (10 → 20 → 30) leave room for future insertion without
 * renumbering downstream consumers.
 */

export const zIndex = {
  base:         0,
  dropdown:     10,
  sticky:       20,
  overlay:      30,
  popover:      40,
  tooltip:      50,
  "modal-scrim": 60,
  modal:        70,
  toast:        80,
  max:          999,
} as const;

export type ZIndexToken = keyof typeof zIndex;
