import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Size ladder. Heights follow the Button + Input sizing philosophy —
 * `sm / md / lg` correspond to a compact / default / spacious tab
 * strip. Heights sit +4 above the matching Button so a 2px selection
 * underline fits inside without cramping the label.
 */
export type TabsSize = "sm" | "md" | "lg";

/* ══════ ROOT ══════════════════════════════════════════════════════ */

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /**
   * Controlled active value. Pair with `onValueChange`.
   */
  value?: string;
  /**
   * Uncontrolled initial active value. Ignored when `value` is provided.
   */
  defaultValue?: string;
  /**
   * Fired when the active tab changes — via click, arrow keys, Home,
   * or End. Consumers do not need to wire keyboard themselves.
   */
  onValueChange?: (value: string) => void;
  /**
   * Size ladder.
   * @default 'md'
   */
  size?: TabsSize;
  /**
   * Accessible name for the tab strip. Prefer wiring a visible heading
   * via `aria-labelledby` when one exists.
   */
  ariaLabel?: string;
  /**
   * Wire the tab strip to an existing heading's id.
   */
  ariaLabelledBy?: string;
  /**
   * Compose with Tabs.List, Tabs.Panels, and (inside them) Tabs.Tab
   * and Tabs.Panel.
   */
  children?: ReactNode;
};

/* ══════ LIST ══════════════════════════════════════════════════════ */

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * When true, the list becomes horizontally scrollable if its tabs
   * overflow the container width. Enabled by default — a tab strip
   * should never truncate.
   * @default true
   */
  scrollable?: boolean;
};

/* ══════ TAB ═══════════════════════════════════════════════════════ */

export type TabsTabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onClick"
> & {
  /**
   * The value that identifies this tab. Must match a `Tabs.Panel`'s
   * `value`. Required.
   */
  value: string;
  /**
   * Leading icon slot. Sized by the tab's `size`.
   */
  icon?: ReactNode;
  /**
   * Trailing badge slot. Usually an `<Badge>` — e.g. a count of
   * unread items or a "New" flag.
   */
  badge?: ReactNode;
  /**
   * When true, the tab is skipped by keyboard navigation and does not
   * fire selection on click. The rendered button is natively
   * `disabled`, so screen readers announce the state correctly.
   */
  disabled?: boolean;
  /**
   * Optional click callback. Fires after the internal selection
   * handler — you rarely need this, but it's there for click
   * telemetry or side effects.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
};

/* ══════ PANELS / PANEL ═══════════════════════════════════════════ */

export type TabsPanelsProps = HTMLAttributes<HTMLDivElement>;

export type TabsPanelProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The value that identifies this panel. Must match a `Tabs.Tab`'s
   * `value`. Required.
   */
  value: string;
  /**
   * When true, the panel is kept mounted while inactive (hidden via
   * `hidden` + `display: none`). Useful for panels that expensively
   * initialize — a data grid, a form with local state. Default is to
   * unmount inactive panels.
   * @default false
   */
  keepMounted?: boolean;
  children?: ReactNode;
};
