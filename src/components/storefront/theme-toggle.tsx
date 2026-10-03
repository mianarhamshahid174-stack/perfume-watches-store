"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-full transition-all duration-300 cursor-pointer ${
        isLight
          ? "text-neutral-700 hover:text-black hover:bg-neutral-200/50"
          : "text-sand-200 hover:text-gold-300 hover:bg-white/5"
      } ${className}`}
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 text-amber-700" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 text-gold-400" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] font-sans uppercase tracking-wider">
          {isLight ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}
