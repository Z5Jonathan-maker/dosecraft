"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-dc-accent hover:bg-dc-accent-hover text-white shadow-lg shadow-dc-accent/20 border border-dc-accent/50",
  secondary:
    "bg-dc-surface-alt hover:bg-dc-surface-hover text-dc-text border border-dc-border hover:border-dc-text-muted",
  ghost:
    "bg-transparent hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-text border border-transparent",
  danger:
    "bg-dc-danger/10 hover:bg-dc-danger/20 text-dc-danger border border-dc-danger/30 hover:border-dc-danger/50",
  success:
    "bg-dc-neon-green/10 hover:bg-dc-neon-green/20 text-dc-neon-green border border-dc-neon-green/30 hover:border-dc-neon-green/50",
  outline:
    "bg-transparent hover:bg-dc-surface-alt text-dc-text border border-dc-border hover:border-dc-accent hover:text-dc-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1",
  sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4.5 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-dc-accent/40 focus:ring-offset-2 focus:ring-offset-dc-bg",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  ),
);
Button.displayName = "Button";
