"use client";

import * as React from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { DEFAULT_MARKETING_CONFIG } from "@/app/api/marketing/settings/route";

export function AnnouncementBar() {
  const [config, setConfig] = React.useState(DEFAULT_MARKETING_CONFIG.announcementBar);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("velora_announcement_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }

    // Fetch live config from server
    fetch("/api/marketing/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config?.announcementBar) {
          setConfig(data.config.announcementBar);
        }
      })
      .catch((err) => console.error("Announcement bar error:", err))
      .finally(() => setIsLoaded(true));
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("velora_announcement_dismissed", "true");
  };

  if (!isLoaded || !config.enabled || isDismissed) {
    return null;
  }

  const themeClasses =
    config.theme === "gold"
      ? "bg-metallic text-black font-medium"
      : config.theme === "charcoal"
      ? "bg-charcoal-900 text-sand-100 border-b border-white/10"
      : "bg-black text-metallic border-b border-metallic/30";

  return (
    <div
      className={`relative z-50 w-full py-2 px-4 text-xs transition-all duration-300 ${themeClasses}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center truncate">
          {config.badge && (
            <span
              className={`text-[9px] uppercase tracking-ultra px-2 py-0.5 rounded-full font-bold shrink-0 ${
                config.theme === "gold"
                  ? "bg-black/20 text-black border border-black/20"
                  : "bg-metallic/20 text-metallic border border-metallic/30"
              }`}
            >
              {config.badge}
            </span>
          )}
          <span className="truncate text-[11px] sm:text-xs tracking-wide">
            {config.text}
          </span>
          {config.linkText && config.linkUrl && (
            <Link
              href={config.linkUrl}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 ml-1 hover:opacity-80 shrink-0 text-[11px] sm:text-xs"
            >
              <span>{config.linkText}</span>
              <ArrowRight className="h-3 w-3 stroke-[2]" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
