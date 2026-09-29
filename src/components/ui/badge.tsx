import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "gold" | "silver" | "noir" | "emerald" | "amber" | "rose";
}

export function Badge({
  className,
  variant = "noir",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "border-gold-500/30 bg-gold-500/10 text-gold-300",
    silver: "border-white/20 bg-white/5 text-platinum-200",
    noir: "border-white/10 bg-noir-850 text-platinum-400",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-[10px] font-medium tracking-luxury uppercase transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
