"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Toast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = React.useState(tokenFromUrl);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passphrases do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to reset password.");
      }

      setToastMessage(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 sm:py-28 flex flex-col justify-center min-h-[75vh]">
      <Container size="narrow">
        <div className="max-w-md mx-auto border border-white/10 bg-noir-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400">
              Security Protocol
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-sand-50 tracking-wide">
              Establish New Passphrase
            </h1>
            <p className="text-xs text-platinum-400 font-light">
              Enter your reset verification token and choose a secure new passphrase.
            </p>
          </div>

          {toastMessage && (
            <Toast type="success" title="Passphrase Updated" message={toastMessage} />
          )}

          {error && (
            <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Reset Verification Token"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token or open from email"
              disabled={isLoading}
            />

            <Input
              label="New Passphrase (Min. 8 characters)"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isLoading}
            />

            <Input
              label="Confirm New Passphrase"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Update Passphrase
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-platinum-400 hover:text-gold-400 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
