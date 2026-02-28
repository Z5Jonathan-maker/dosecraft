"use client";

import { forwardRef, type HTMLAttributes } from "react";
import clsx from "clsx";

type CardVariant = "default" | "clinical" | "expert" | "experimental" | "success" | "warning" | "danger";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly hoverable?: boolean;
  readonly glowColor?: "accent" | "cyan" | "purple" | "green";
  readonly variant?: CardVariant;
  readonly noPad?: boolean;
}

const variantClass: Record<CardVariant, string> = {
  default: "",
  clinical: "card-clinical",
  expert: "card-expert",
  experimental: "card-experimental",
  success: "card-success",
  warning: "card-warning",
  danger: "card-danger",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, glowColor, variant = "default", noPad = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "glass rounded-2xl transition-all duration-200",
        !noPad && "p-5",
        hoverable && "glass-hover",
        glowColor === "accent" && "glow-accent",
        glowColor === "cyan" && "glow-cyan",
        glowColor === "purple" && "glow-purple",
        glowColor === "green" && "glow-green",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("mb-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx("text-base font-semibold text-dc-text tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("text-sm text-dc-text-muted", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("mt-4 pt-4 border-t border-dc-border flex items-center justify-between", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";
