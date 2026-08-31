export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type BadgeAppearance = "soft" | "solid" | "outline";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick"> {
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  dot?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  count?: number;
  maxCount?: number;
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}
