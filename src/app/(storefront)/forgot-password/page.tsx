"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Toast } from "@/components/ui/toast";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [devToken, setDevToken] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setDevToken(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to request password reset.");
      }

      setMessage(data.message);
      if (data.devResetToken) {
        setDevToken(data.devResetToken);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending request");
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
              Account Recovery
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-sand-50 tracking-wide">
              Forgot Password
            </h1>
            <p className="text-xs text-platinum-400 font-light">
              Enter your email address to receive password reset instructions.
            </p>
          </div>

          {message && (
            <Toast
              type="info"
              title="Reset Link Sent"
              message={message}
            />
          )}

          {devToken && (
            <div className="p-4 border border-gold-500/40 bg-gold-950/20 text-xs space-y-2">
              <p className="font-mono text-gold-400 text-[11px] font-medium">
                [Dev Mode] Verification Token Generated:
              </p>
              <p className="font-mono text-[10px] text-platinum-300 break-all bg-black/40 p-2">
                {devToken}
              </p>
              <Link
                href={`/reset-password?token=${devToken}`}
                className="inline-block text-[11px] text-gold-400 underline font-medium"
              >
                Proceed to Reset Password Form →
              </Link>
            </div>
          )}

          {error && (
            <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs text-platinum-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
