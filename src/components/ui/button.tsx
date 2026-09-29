import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "outline-gold"
    | "ghost"
    | "danger"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans tracking-luxury uppercase text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-400 disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-gold-500 text-obsidian hover:bg-gold-400 shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]",
      secondary:
        "bg-noir-850 text-sand-100 hover:bg-noir-800 border border-white/10 hover:border-white/20",
      outline:
        "bg-transparent text-sand-100 border border-white/20 hover:border-white/60 hover:bg-white/[0.03]",
      "outline-gold":
        "bg-transparent text-gold-400 border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 hover:shadow-[0_0_20px_rgba(197,160,89,0.2)]",
      ghost:
        "bg-transparent text-sand-200 hover:text-white hover:bg-white/[0.05]",
      danger:
        "bg-rose-900/40 text-rose-200 border border-rose-700/50 hover:bg-rose-900/60",
      link:
        "bg-transparent text-gold-400 underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-[11px]",
      md: "h-11 px-6 text-xs",
      lg: "h-13 px-8 text-xs tracking-[0.25em]",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-current" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
