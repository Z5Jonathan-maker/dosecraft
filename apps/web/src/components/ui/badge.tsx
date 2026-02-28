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
  | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
  readonly size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-dc-surface-alt text-dc-text-muted border-dc-border",
  clinical: "bg-dc-clinical/10 text-dc-clinical border-dc-clinical/30",
  expert: "bg-dc-expert/10 text-dc-expert border-dc-expert/30",
  experimental: "bg-dc-experimental/10 text-dc-experimental border-dc-experimental/30",
  conservative: "bg-dc-neon-green/10 text-dc-neon-green border-dc-neon-green/30",
  standard: "bg-dc-warning/10 text-dc-warning border-dc-warning/30",
  aggressive: "bg-dc-danger/10 text-dc-danger border-dc-danger/30",
  success: "bg-dc-neon-green/10 text-dc-neon-green border-dc-neon-green/30",
  warning: "bg-dc-warning/10 text-dc-warning border-dc-warning/30",
  danger: "bg-dc-danger/10 text-dc-danger border-dc-danger/30",
};

export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium border rounded-full",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
