"use client";

import { type HTMLAttributes } from "react";
import clsx from "clsx";

type BadgeVariant =
  | "default"
  | "clinical"
  | "expert"
  | "experimental"
  | "conservative"
  | "standard"
  | "aggressive"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
  readonly size?: "xs" | "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/5 text-dc-text-muted border-dc-border",
  clinical: "bg-dc-clinical/10 text-dc-clinical border-dc-clinical/25",
  expert: "bg-dc-expert/10 text-dc-expert border-dc-expert/25",
  experimental: "bg-dc-experimental/10 text-dc-experimental border-dc-experimental/25",
  conservative: "bg-dc-neon-green/10 text-dc-neon-green border-dc-neon-green/25",
  standard: "bg-dc-warning/10 text-dc-warning border-dc-warning/25",
  aggressive: "bg-dc-danger/10 text-dc-danger border-dc-danger/25",
  success: "bg-dc-neon-green/10 text-dc-neon-green border-dc-neon-green/25",
  warning: "bg-dc-warning/10 text-dc-warning border-dc-warning/25",
  danger: "bg-dc-danger/10 text-dc-danger border-dc-danger/25",
  neutral: "bg-white/5 text-dc-text-muted border-dc-border",
};

const sizeStyles: Record<"xs" | "sm" | "md", string> = {
  xs: "px-1.5 py-0.5 text-[9px] rounded-md",
  sm: "px-2.5 py-0.5 text-[10px] rounded-full",
  md: "px-3 py-1 text-xs rounded-full",
};

export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium border tracking-wide",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
