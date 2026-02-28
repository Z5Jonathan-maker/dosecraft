"use client";

import { forwardRef, type HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly hoverable?: boolean;
  readonly glowColor?: "accent" | "cyan" | "purple" | "green";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, glowColor, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "glass rounded-xl p-5 transition-all duration-300",
        hoverable && "glass-hover cursor-pointer",
        glowColor === "accent" && "glow-accent",
        glowColor === "cyan" && "glow-cyan",
        glowColor === "purple" && "glow-purple",
        glowColor === "green" && "glow-green",
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
    <h3 ref={ref} className={clsx("text-lg font-semibold text-dc-text", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("text-sm text-dc-text-muted", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";
