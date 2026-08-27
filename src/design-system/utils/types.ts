import type { ComponentType } from "react";

export type SectionCategory =
  | "standards"
  | "foundations"
  | "components"
  | "patterns"
  | "templates";

export type SectionEntry = {
  id: string;
  label: string;
  category: SectionCategory;
  Component: ComponentType;
};

export type CategoryMeta = {
  id: SectionCategory;
  label: string;
  description: string;
};
