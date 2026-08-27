import type { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "standards",
    label: "Standards",
    description:
      "The constitution of the design system — rules every future component must follow.",
  },
  {
    id: "foundations",
    label: "Foundations",
    description: "The atoms — tokens every IQ module reads from.",
  },
  {
    id: "components",
    label: "Components",
    description: "Reusable primitives shared across products.",
  },
  {
    id: "patterns",
    label: "Patterns",
    description: "Recipes that combine primitives for common jobs.",
  },
  {
    id: "templates",
    label: "Templates",
    description: "Whole-page layouts a new IQ module can start from.",
  },
];
