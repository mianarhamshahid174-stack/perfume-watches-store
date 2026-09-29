"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, KeyRound, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Administrative authentication failed.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-900/90 rounded-xl p-8 shadow-2xl backdrop-blur space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="h-10 w-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mx-auto text-emerald-400">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold font-mono text-zinc-100 tracking-tight">
            VELORA ATELIER OS
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Restricted Management Console • Role-Based Access
          </p>
        </div>

        {error && (
          <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-xs text-rose-300 rounded flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velora-ateliers.com"
              className="w-full h-10 px-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Security Key
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-10 px-3 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Authorize Console Entry"}
          </button>
        </form>

        {/* Role Quick-Fill Helpers */}
        <div className="border-t border-zinc-800/80 pt-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Role Profiles (1-Click Fill)</span>
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <button
              type="button"
              onClick={() =>
                handleQuickFill(
                  "superadmin@velora-ateliers.com",
                  "VeloraSuperAdmin2026!"
                )
              }
              className="p-2 border border-zinc-800 rounded bg-zinc-950/60 hover:bg-zinc-800/60 text-left transition-colors text-zinc-300 flex items-center justify-between"
            >
              <span>SUPER_ADMIN</span>
              <KeyRound className="h-3 w-3 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickFill(
                  "admin@velora-ateliers.com",
                  "VeloraAdmin2026!"
                )
              }
              className="p-2 border border-zinc-800 rounded bg-zinc-950/60 hover:bg-zinc-800/60 text-left transition-colors text-zinc-300 flex items-center justify-between"
            >
              <span>ADMIN</span>
              <KeyRound className="h-3 w-3 text-gold-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickFill(
                  "editor@velora-ateliers.com",
                  "VeloraEditor2026!"
                )
              }
              className="p-2 border border-zinc-800 rounded bg-zinc-950/60 hover:bg-zinc-800/60 text-left transition-colors text-zinc-300 flex items-center justify-between"
            >
              <span>EDITOR</span>
              <KeyRound className="h-3 w-3 text-blue-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickFill(
                  "support@velora-ateliers.com",
                  "VeloraSupport2026!"
                )
              }
              className="p-2 border border-zinc-800 rounded bg-zinc-950/60 hover:bg-zinc-800/60 text-left transition-colors text-zinc-300 flex items-center justify-between"
            >
              <span>SUPPORT</span>
              <KeyRound className="h-3 w-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
