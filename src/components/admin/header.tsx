"use client";

import { Bell, Search, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input for Admin Records */}
      <div className="relative w-80 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
        <input
          type="search"
          placeholder="Search SKUs, order numbers, collectors..."
          className="w-full h-9 pl-9 pr-3 rounded bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <button
          className="relative p-2 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Admin Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        <div className="flex items-center space-x-3 pl-3 border-l border-zinc-800">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-medium text-zinc-200">Maison Director</p>
            <p className="text-[10px] text-zinc-500 font-mono">admin@zaven-atelier.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
