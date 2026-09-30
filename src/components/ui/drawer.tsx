"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { LUXURY_EASE, EXIT_EASE, backdropVariants } from "@/lib/motion";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  side?: "right" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  side = "right",
  size = "md",
  children,
  footer,
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

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const drawerAnimation = {
    hidden: { x: side === "right" ? "100%" : "-100%", opacity: 0.8 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: LUXURY_EASE },
    },
    exit: {
      x: side === "right" ? "100%" : "-100%",
      opacity: 0.8,
      transition: { duration: 0.35, ease: EXIT_EASE },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          <div
            className={cn(
              "fixed inset-y-0 flex max-w-full pointer-events-none",
              side === "right" ? "right-0 pl-10" : "left-0 pr-10"
            )}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              variants={drawerAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "pointer-events-auto w-screen border-white/10 bg-charcoal-950 p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto",
                side === "right" ? "border-l" : "border-r",
                sizeStyles[size],
                className
              )}
            >
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                  <div>
                    {title && (
                      <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-ivory">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="font-sans text-[11px] text-neutral-stone font-light mt-0.5">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-full text-neutral-stone hover:text-ivory hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4">{children}</div>
              </div>

              {/* Optional Sticky Footer */}
              {footer && (
                <div className="pt-6 mt-6 border-t border-white/10 bg-charcoal-950 sticky bottom-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
