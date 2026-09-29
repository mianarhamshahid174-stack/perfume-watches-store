"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id?: string;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  type = "info",
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />,
    info: <Info className="h-4 w-4 text-gold-400 shrink-0" />,
  };

  const borderStyles = {
    success: "border-emerald-500/30 bg-noir-900/95",
    error: "border-rose-500/30 bg-noir-900/95",
    info: "border-gold-500/30 bg-noir-900/95",
  };

  return (
    <div
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 border p-4 shadow-xl backdrop-blur-md transition-all duration-300",
        borderStyles[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 space-y-1">
        <h4 className="text-xs font-medium tracking-luxury uppercase text-sand-50">
          {title}
        </h4>
        {message && (
          <p className="text-xs text-platinum-400 font-light leading-relaxed">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-platinum-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
