"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Toast } from "@/components/ui/toast";
import { BRAND } from "@/lib/constants";
import { ShieldCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      setToastMessage("Session authenticated. Redirecting to private salon...");
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="py-20 sm:py-28 flex flex-col justify-center min-h-[75vh]">
      <Container size="narrow">
        <div className="max-w-md mx-auto border border-white/10 bg-noir-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400">
              Private Client Portal
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-sand-50 tracking-wide">
              Maison {BRAND.name}
            </h1>
            <p className="text-xs text-platinum-400 font-light">
              Enter your credentials to access your private salon allocations and orders.
            </p>
          </div>

          {toastMessage && (
            <Toast type="success" title="Access Granted" message={toastMessage} />
          )}

          {error && (
            <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collector@kensington-vaults.com"
              disabled={isLoading}
            />

            <div className="space-y-1">
              <Input
                label="Passphrase"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-platinum-400 hover:text-gold-400 transition-colors"
                >
                  Forgot passphrase?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In to Atelier
            </Button>
          </form>

          {/* Demo Collector Quick Fill */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-mono text-platinum-500 uppercase tracking-wider text-center">
              Quick Test Credentials
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "collector@kensington-vaults.com",
                    "CollectorSecret2026!"
                  )
                }
                className="text-[11px] font-mono py-1.5 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-platinum-300 rounded text-left transition-colors flex items-center justify-between"
              >
                <span>VIP Collector (Arthur Pendleton)</span>
                <KeyRound className="h-3 w-3 text-gold-400" />
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-xs text-platinum-400 font-light">
            New to Maison {BRAND.name}?{" "}
            <Link
              href="/register"
              className="text-gold-400 hover:underline font-medium"
            >
              Register for Privileges
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
