"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-dc-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg text-sm text-dc-text placeholder:text-dc-text-muted/50",
            "bg-dc-surface border border-dc-border",
            "focus:outline-none focus:border-dc-accent focus:ring-1 focus:ring-dc-accent/30",
            "transition-all duration-200",
            error && "border-dc-danger focus:border-dc-danger focus:ring-dc-danger/30",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-dc-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
