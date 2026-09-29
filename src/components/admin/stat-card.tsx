import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  subtext,
  trend,
  icon,
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{title}</span>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
          {value}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-mono font-medium",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-zinc-500">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}
