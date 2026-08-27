import type { SectionEntry } from "../utils";

import {
  DesignPrinciplesDoc,
  AnatomyDoc,
  VariantsDoc,
  SizesDoc,
  StatesDoc,
  SpacingRulesDoc,
  LayoutRulesDoc,
  MotionRulesDoc,
  ElevationRulesDoc,
  ColorUsageDoc,
  TypographyRulesDoc,
  AccessibilityDoc,
  ComponentChecklistDoc,
} from "./standards";

import {
  ColorsDoc,
  TypographyDoc,
  SpacingDoc,
  RadiusDoc,
  BordersDoc,
  ShadowsDoc,
  MotionDoc,
  IconsDoc,
  BreakpointsDoc,
} from "./foundations";

import {
  ButtonDoc,
  InputDoc,
  SelectDoc,
  CardDoc,
  BadgeDoc,
  AvatarDoc,
  AlertDoc,
  TabsDoc,
  DialogDoc,
  DrawerDoc,
  TooltipDoc,
  PopoverDoc,
  BreadcrumbDoc,
  TableDoc,
  PaginationDoc,
  EmptyStateDoc,
  SkeletonDoc,
  ToastDoc,
  CheckboxDoc,
  RadioDoc,
  SwitchDoc,
  TextareaDoc,
  GaugeDoc,
} from "./components";

import {
  DashboardPatternDoc,
  FormsDoc,
  TablesDoc,
  FiltersDoc,
  NavigationDoc,
} from "./patterns";

import {
  DashboardTemplateDoc,
  DetailPageDoc,
  SettingsDoc,
} from "./templates";

export const SECTIONS: SectionEntry[] = [
  // Standards — the constitution of the design system
  { id: "std-principles",  label: "Design Principles",   category: "standards", Component: DesignPrinciplesDoc },
  { id: "std-anatomy",     label: "Anatomy",             category: "standards", Component: AnatomyDoc },
  { id: "std-variants",    label: "Variants",            category: "standards", Component: VariantsDoc },
  { id: "std-sizes",       label: "Sizes",               category: "standards", Component: SizesDoc },
  { id: "std-states",      label: "States",              category: "standards", Component: StatesDoc },
  { id: "std-spacing",     label: "Spacing Rules",       category: "standards", Component: SpacingRulesDoc },
  { id: "std-layout",      label: "Layout Rules",        category: "standards", Component: LayoutRulesDoc },
  { id: "std-motion",      label: "Motion Rules",        category: "standards", Component: MotionRulesDoc },
  { id: "std-elevation",   label: "Elevation Rules",     category: "standards", Component: ElevationRulesDoc },
  { id: "std-color",       label: "Color Usage",         category: "standards", Component: ColorUsageDoc },
  { id: "std-typography",  label: "Typography Rules",    category: "standards", Component: TypographyRulesDoc },
  { id: "std-a11y",        label: "Accessibility",       category: "standards", Component: AccessibilityDoc },
  { id: "std-checklist",   label: "Component Checklist", category: "standards", Component: ComponentChecklistDoc },

  // Foundations
  { id: "colors",       label: "Colors",       category: "foundations", Component: ColorsDoc },
  { id: "typography",   label: "Typography",   category: "foundations", Component: TypographyDoc },
  { id: "spacing",      label: "Spacing",      category: "foundations", Component: SpacingDoc },
  { id: "radius",       label: "Radius",       category: "foundations", Component: RadiusDoc },
  { id: "borders",      label: "Borders",      category: "foundations", Component: BordersDoc },
  { id: "shadows",      label: "Shadows",      category: "foundations", Component: ShadowsDoc },
  { id: "motion",       label: "Motion",       category: "foundations", Component: MotionDoc },
  { id: "icons",        label: "Icons",        category: "foundations", Component: IconsDoc },
  { id: "breakpoints",  label: "Breakpoints",  category: "foundations", Component: BreakpointsDoc },

  // Components
  { id: "button",       label: "Button",       category: "components",  Component: ButtonDoc },
  { id: "input",        label: "Input",        category: "components",  Component: InputDoc },
  { id: "select",       label: "Select",       category: "components",  Component: SelectDoc },
  { id: "card",         label: "Card",         category: "components",  Component: CardDoc },
  { id: "badge",        label: "Badge",        category: "components",  Component: BadgeDoc },
  { id: "avatar",       label: "Avatar",       category: "components",  Component: AvatarDoc },
  { id: "alert",        label: "Alert",        category: "components",  Component: AlertDoc },
  { id: "tabs",         label: "Tabs",         category: "components",  Component: TabsDoc },
  { id: "dialog",       label: "Dialog",       category: "components",  Component: DialogDoc },
  { id: "drawer",       label: "Drawer",       category: "components",  Component: DrawerDoc },
  { id: "tooltip",      label: "Tooltip",      category: "components",  Component: TooltipDoc },
  { id: "popover",      label: "Popover",      category: "components",  Component: PopoverDoc },
  { id: "breadcrumb",   label: "Breadcrumb",   category: "components",  Component: BreadcrumbDoc },
  { id: "table",        label: "Table",        category: "components",  Component: TableDoc },
  { id: "pagination",   label: "Pagination",   category: "components",  Component: PaginationDoc },
  { id: "empty-state",  label: "Empty State",  category: "components",  Component: EmptyStateDoc },
  { id: "skeleton",     label: "Skeleton",     category: "components",  Component: SkeletonDoc },
  { id: "toast",        label: "Toast",        category: "components",  Component: ToastDoc },
  { id: "checkbox",     label: "Checkbox",     category: "components",  Component: CheckboxDoc },
  { id: "radio",        label: "Radio",        category: "components",  Component: RadioDoc },
  { id: "switch",       label: "Switch",       category: "components",  Component: SwitchDoc },
  { id: "textarea",     label: "Textarea",     category: "components",  Component: TextareaDoc },
  { id: "gauge",        label: "Gauge",        category: "components",  Component: GaugeDoc },

  // Patterns
  { id: "pattern-dashboard",  label: "Dashboard",  category: "patterns", Component: DashboardPatternDoc },
  { id: "pattern-forms",      label: "Forms",      category: "patterns", Component: FormsDoc },
  { id: "pattern-tables",     label: "Tables",     category: "patterns", Component: TablesDoc },
  { id: "pattern-filters",    label: "Filters",    category: "patterns", Component: FiltersDoc },
  { id: "pattern-navigation", label: "Navigation", category: "patterns", Component: NavigationDoc },

  // Templates
  { id: "template-dashboard", label: "Dashboard",   category: "templates", Component: DashboardTemplateDoc },
  { id: "template-detail",    label: "Detail Page", category: "templates", Component: DetailPageDoc },
  { id: "template-settings",  label: "Settings",    category: "templates", Component: SettingsDoc },
];
