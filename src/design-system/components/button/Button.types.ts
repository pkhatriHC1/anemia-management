import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "danger-outline"
  | "success"
  | "cta"
  | "link"
  | "icon";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Visual variant.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Size ladder — one of xs / sm / md / lg / xl. See Standards → Sizes.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Show a loading spinner. The button remains focusable and keeps its
   * dimensions, but rejects clicks and announces via aria-busy.
   * @default false
   */
  loading?: boolean;
  /**
   * Grow to fill the width of the parent.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Render as a square (width = height at each size) with no horizontal padding.
   * Preserves the current variant's colors — use with `variant='primary'` for a
   * filled square action, `variant='ghost'` for a subtle square, etc. `variant='icon'`
   * already implies iconOnly. Requires `aria-label`.
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Icon rendered before the label. Ignored when variant is 'icon'.
   */
  leftIcon?: ReactNode;
  /**
   * Icon rendered after the label. Ignored when variant is 'icon'.
   */
  rightIcon?: ReactNode;
};
