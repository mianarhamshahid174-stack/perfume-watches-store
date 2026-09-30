"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "metallic"
    | "ivory"
    | "secondary"
    | "outline"
    | "outline-gold"
    | "outline-ivory"
    | "ghost"
    | "editorial-link"
    | "danger"
    | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
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
      "relative inline-flex items-center justify-center font-sans uppercase font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-metallic/70 disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.98] select-none";

    const variantStyles = {
      primary:
        "bg-metallic text-black hover:bg-metallic-light shadow-[0_0_24px_rgba(197,168,128,0.22)] hover:shadow-[0_0_32px_rgba(197,168,128,0.35)] font-semibold tracking-editorial",
      metallic:
        "bg-gradient-to-r from-metallic via-metallic-light to-metallic text-black hover:brightness-105 shadow-[0_4px_20px_rgba(197,168,128,0.25)] font-semibold tracking-editorial border border-metallic-light/40",
      ivory:
        "bg-ivory text-black hover:bg-white shadow-[0_4px_24px_rgba(250,248,245,0.15)] font-semibold tracking-editorial border border-white/20",
      secondary:
        "bg-charcoal-850 text-ivory hover:bg-charcoal-800 border border-white/10 hover:border-metallic/40 tracking-editorial",
      outline:
        "bg-transparent text-ivory border border-white/20 hover:border-metallic hover:text-metallic hover:bg-metallic/5 tracking-editorial",
      "outline-gold":
        "bg-transparent text-metallic border border-metallic/40 hover:border-metallic hover:bg-metallic/10 hover:shadow-[0_0_20px_rgba(197,168,128,0.18)] tracking-editorial",
      "outline-ivory":
        "bg-transparent text-ivory border border-ivory/30 hover:border-ivory hover:bg-ivory/5 tracking-editorial",
      ghost:
        "bg-transparent text-neutral-stone hover:text-ivory hover:bg-white/[0.04] tracking-editorial",
      "editorial-link":
        "bg-transparent text-ivory hover:text-metallic p-0 h-auto normal-case tracking-normal group inline-flex items-center gap-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-metallic hover:after:w-full after:transition-all after:duration-300",
      danger:
        "bg-rose-950/40 text-rose-300 border border-rose-800/50 hover:bg-rose-900/50 tracking-editorial",
      link:
        "bg-transparent text-metallic underline-offset-4 hover:underline p-0 h-auto tracking-normal",
    };

    const sizeStyles = {
      xs: "h-7 px-3 text-[10px] tracking-editorial",
      sm: "h-9 px-4 text-[11px] tracking-editorial",
      md: "h-11 px-6 text-xs tracking-editorial",
      lg: "h-13 px-8 text-xs tracking-editorial",
      xl: "h-14 px-10 text-sm tracking-luxury",
      icon: "h-10 w-10 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-current shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
