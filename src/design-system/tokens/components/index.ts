/**
 * Component tokens barrel.
 *
 * Every component the design system will eventually ship gets a token
 * module here. Modules contain values only — no rendering code, no
 * React imports. A component-shipping PR imports these and applies them.
 */

import { button } from "./button";
import { card } from "./card";
import { badge } from "./badge";
import { input } from "./input";
import { dialog } from "./dialog";
import { select } from "./select";
import { table } from "./table";
import { alert } from "./alert";
import { tabs } from "./tabs";
import { emptyState } from "./emptyState";
import { skeleton } from "./skeleton";
import { toast } from "./toast";
import { pagination } from "./pagination";
import { drawer } from "./drawer";
import { checkbox } from "./checkbox";
import { radio } from "./radio";
import { switchToken } from "./switch";
import { textarea } from "./textarea";
import { tooltip } from "./tooltip";
import { popover } from "./popover";
import { breadcrumb } from "./breadcrumb";

export const components = {
  button,
  card,
  badge,
  input,
  dialog,
  select,
  table,
  alert,
  tabs,
  emptyState,
  skeleton,
  toast,
  pagination,
  drawer,
  checkbox,
  radio,
  switch: switchToken,
  textarea,
  tooltip,
  popover,
  breadcrumb,
} as const;

export type ComponentTokens = typeof components;

export * from "./button";
export * from "./card";
export * from "./badge";
export * from "./input";
export * from "./dialog";
export * from "./select";
export * from "./table";
export * from "./alert";
export * from "./tabs";
export * from "./emptyState";
export * from "./skeleton";
export * from "./toast";
export * from "./pagination";
export * from "./drawer";
export * from "./checkbox";
export * from "./radio";
export * from "./switch";
export * from "./textarea";
export * from "./tooltip";
export * from "./popover";
export * from "./breadcrumb";
