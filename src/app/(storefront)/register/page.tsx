"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Toast } from "@/components/ui/toast";
import { BRAND } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration could not be completed.");
      }

      setToastMessage("Account registered. Welcoming to private salon...");
      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 sm:py-28 flex flex-col justify-center min-h-[75vh]">
      <Container size="narrow">
        <div className="max-w-md mx-auto border border-white/10 bg-noir-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-ultra uppercase text-gold-400">
              Maison Registration
            </span>
            <h1 className="font-serif-luxury text-3xl font-light text-sand-50 tracking-wide">
              Collector Privileges
            </h1>
            <p className="text-xs text-platinum-400 font-light">
              Register for exclusive allocation priority, private salon visits, and provenance certificates.
            </p>
          </div>

          {toastMessage && (
            <Toast type="success" title="Welcome" message={toastMessage} />
          )}

          {error && (
            <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Arthur"
                disabled={isLoading}
              />
              <Input
                label="Last Name"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Pendleton"
                disabled={isLoading}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="collector@domain.com"
              disabled={isLoading}
            />

            <Input
              label="Direct Telephone (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+44 20 7946 0000"
              disabled={isLoading}
            />

            <Input
              label="Passphrase (Min. 8 characters)"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              disabled={isLoading}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Create Collector Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-platinum-400 font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-400 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
