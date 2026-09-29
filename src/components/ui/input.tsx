import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-none border border-white/15 bg-noir-900/60 px-3.5 py-2 text-sm text-sand-50 placeholder:text-platinum-500/50 transition-colors duration-200 focus-visible:outline-none focus-visible:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400/40 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500/80 focus-visible:border-rose-500 focus-visible:ring-rose-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-platinum-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
