"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
  readonly icon?: ReactNode;
  readonly suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, icon, suffix, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dc-text-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full py-2.5 rounded-xl text-sm text-dc-text placeholder:text-dc-text-muted/40",
              "bg-dc-surface border border-dc-border",
              "focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15",
              "transition-all duration-200",
              icon ? "pl-10 pr-4" : "px-4",
              suffix ? "pr-12" : "",
              error && "border-dc-danger focus:border-dc-danger focus:ring-dc-danger/15",
              className,
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dc-text-muted text-sm">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-dc-danger flex items-center gap-1">{error}</p>}
        {hint && !error && <p className="text-xs text-dc-text-muted">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly label?: string;
  readonly error?: string;
  readonly options: readonly { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-dc-text-muted uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full px-4 py-2.5 rounded-xl text-sm text-dc-text",
            "bg-dc-surface border border-dc-border",
            "focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15",
            "transition-all duration-200 appearance-none cursor-pointer",
            error && "border-dc-danger",
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dc-surface">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-dc-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";
