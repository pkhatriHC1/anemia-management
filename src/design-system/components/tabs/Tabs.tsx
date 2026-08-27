import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type {
  TabsListProps,
  TabsPanelProps,
  TabsPanelsProps,
  TabsProps,
  TabsSize,
  TabsTabProps,
} from "./Tabs.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Tabs.
import "../../tokens/css/variables.css";
import "./Tabs.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:            "hc-tabs",
  size:            (s: TabsSize) => `hc-tabs--size-${s}`,

  list:            "hc-tabs__list",
  listScrollable:  "hc-tabs__list--scrollable",

  tab:             "hc-tabs__tab",
  tabSelected:     "hc-tabs__tab--selected",
  tabDisabled:     "hc-tabs__tab--disabled",
  tabIcon:         "hc-tabs__tab-icon",
  tabLabel:        "hc-tabs__tab-label",
  tabBadge:        "hc-tabs__tab-badge",

  panels:          "hc-tabs__panels",
  panel:           "hc-tabs__panel",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ CONTEXT ═══════════════════════════════════════════════════ */

type TabsContextValue = {
  baseId:         string;
  activeValue:    string | undefined;
  setActiveValue: (value: string) => void;
  size:           TabsSize;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Tabs>.`);
  }
  return ctx;
}

const tabIdFor   = (base: string, value: string) => `${base}-tab-${value}`;
const panelIdFor = (base: string, value: string) => `${base}-panel-${value}`;

/* ══════ ROOT ══════════════════════════════════════════════════════ */

/**
 * HC1 Tabs — the canonical section-navigation primitive.
 *
 * Compose with `Tabs.List`, `Tabs.Tab`, `Tabs.Panels`, and `Tabs.Panel`.
 * The root owns the active-value state (controlled or uncontrolled),
 * the size, and the shared ID prefix used to wire `aria-controls` and
 * `aria-labelledby` between tabs and panels.
 *
 * Automatic activation is used — moving focus with arrow keys / Home /
 * End also selects the tab. This matches the WAI-ARIA "automatic"
 * activation pattern, which is preferred for tab strips whose panel
 * content doesn't require an explicit confirmation.
 */
const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  {
    value,
    defaultValue,
    onValueChange,
    size           = "md",
    ariaLabel,
    ariaLabelledBy,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const activeValue = isControlled ? value : internal;

  const setActiveValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const baseId = useId();

  const contextValue = useMemo<TabsContextValue>(
    () => ({ baseId, activeValue, setActiveValue, size }),
    [baseId, activeValue, setActiveValue, size],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={ref}
        className={cx(CLASS.root, CLASS.size(size), className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        style={style as CSSProperties}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});
TabsRoot.displayName = "Tabs";

/* ══════ LIST ══════════════════════════════════════════════════════ */

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { scrollable = true, className, children, onKeyDown, ...rest },
  ref,
) {
  const listRef  = useRef<HTMLDivElement | null>(null);
  const setRefs  = (node: HTMLDivElement | null) => {
    listRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };
  const ctx = useTabsContext("Tabs.List");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const el = listRef.current;
    if (!el) return;

    // Enabled tabs, in DOM order.
    const tabs = Array.from(
      el.querySelectorAll<HTMLButtonElement>('button[role="tab"]:not(:disabled)'),
    );
    if (tabs.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIdx = tabs.findIndex((t) => t === active);

    let nextIdx: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIdx = currentIdx === -1 ? tabs.length - 1 : (currentIdx - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIdx = 0;
        break;
      case "End":
        nextIdx = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextEl = tabs[nextIdx!];
    nextEl.focus();
    const nextValue = nextEl.getAttribute("data-value");
    if (nextValue) ctx.setActiveValue(nextValue);
  };

  return (
    <div
      {...rest}
      ref={setRefs}
      role="tablist"
      aria-orientation="horizontal"
      className={cx(CLASS.list, scrollable && CLASS.listScrollable, className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
});
TabsList.displayName = "Tabs.List";

/* ══════ TAB ═══════════════════════════════════════════════════════ */

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  { value, icon, badge, disabled, className, children, onClick, ...rest },
  ref,
) {
  const ctx = useTabsContext("Tabs.Tab");
  const isSelected = ctx.activeValue === value;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    ctx.setActiveValue(value);
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="tab"
      id={tabIdFor(ctx.baseId, value)}
      aria-selected={isSelected}
      aria-controls={panelIdFor(ctx.baseId, value)}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      disabled={disabled}
      onClick={handleClick}
      className={cx(
        CLASS.tab,
        isSelected && CLASS.tabSelected,
        disabled && CLASS.tabDisabled,
        className,
      )}
    >
      {icon  && <span className={CLASS.tabIcon}  aria-hidden="true">{icon}</span>}
      {children != null && <span className={CLASS.tabLabel}>{children}</span>}
      {badge && <span className={CLASS.tabBadge} aria-hidden="true">{badge}</span>}
    </button>
  );
});
TabsTab.displayName = "Tabs.Tab";

/* ══════ PANELS ════════════════════════════════════════════════════ */

const TabsPanels = forwardRef<HTMLDivElement, TabsPanelsProps>(function TabsPanels(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS.panels, className)} {...rest}>
      {children}
    </div>
  );
});
TabsPanels.displayName = "Tabs.Panels";

/* ══════ PANEL ═════════════════════════════════════════════════════ */

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value, keepMounted = false, className, children, ...rest },
  ref,
) {
  const ctx = useTabsContext("Tabs.Panel");
  const isActive = ctx.activeValue === value;

  if (!isActive && !keepMounted) return null;

  return (
    <div
      {...rest}
      ref={ref}
      role="tabpanel"
      id={panelIdFor(ctx.baseId, value)}
      aria-labelledby={tabIdFor(ctx.baseId, value)}
      hidden={!isActive || undefined}
      tabIndex={isActive ? 0 : -1}
      className={cx(CLASS.panel, className)}
    >
      {children}
    </div>
  );
});
TabsPanel.displayName = "Tabs.Panel";

/* ══════ COMPOUND EXPORT ═══════════════════════════════════════════ */

type TabsCompound = typeof TabsRoot & {
  List:   typeof TabsList;
  Tab:    typeof TabsTab;
  Panels: typeof TabsPanels;
  Panel:  typeof TabsPanel;
};

const Tabs = TabsRoot as TabsCompound;
Tabs.List   = TabsList;
Tabs.Tab    = TabsTab;
Tabs.Panels = TabsPanels;
Tabs.Panel  = TabsPanel;

export { Tabs, useTabsContext };
