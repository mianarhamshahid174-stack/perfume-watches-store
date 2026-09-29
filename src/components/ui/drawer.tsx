"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: "right" | "left";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  side = "right",
  children,
  className,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 flex max-w-full",
          side === "right" ? "right-0 pl-10" : "left-0 pr-10"
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-screen max-w-md border-l border-white/10 bg-noir-950 p-6 sm:p-8 shadow-2xl transition-transform duration-300 flex flex-col justify-between",
            className
          )}
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              {title && (
                <h3 className="font-serif-luxury text-xl font-normal tracking-wide text-sand-50">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-platinum-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
