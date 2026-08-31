import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "cta" | "ghost" | "icon";
type Size = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconOnly?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-1.5 font-semibold rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[#0D7782] text-white hover:bg-[#0B626B] active:bg-[#0B626B] shadow-sm",
  secondary:
    "bg-white text-[#545D5E] border border-[#CFD1D1] hover:bg-[#F7F7F7] active:bg-[#E7E7E7]",
  cta:
    "bg-[#F58126] text-white hover:bg-[#E0741F] active:bg-[#C7671B] shadow-sm",
  ghost:
    "bg-transparent text-[#545D5E] hover:bg-[#F7F7F7] active:bg-[#E7E7E7]",
  icon:
    "bg-transparent text-[#737E7F] hover:bg-[#F7F7F7] active:bg-[#E7E7E7] rounded-md",
};

const SIZES: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
};

export function Button({
  variant = "primary",
  size = "md",
  iconOnly = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE,
        VARIANTS[variant],
        iconOnly ? "p-1.5" : SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
