import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
}

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-medium tracking-luxury uppercase text-platinum-400"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-11 w-full appearance-none rounded-none border border-white/15 bg-noir-900/60 px-3.5 py-2 pr-10 text-xs text-sand-50 transition-colors duration-200 focus-visible:outline-none focus-visible:border-gold-400 focus-visible:ring-1 focus-visible:ring-gold-400/40 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
              error && "border-rose-500/80 focus-visible:border-rose-500",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-noir-900 text-sand-100">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-platinum-400" />
        </div>
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
