"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  User,
  ShieldCheck,
  Package,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AccountData {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    preferredCurrency: string;
    notes?: string;
  } | null;
  addresses: Array<{
    id: string;
    type: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number | string;
    trackingNumber?: string;
    createdAt: string;
    items: Array<{
      id: string;
      productName: string;
      productSku: string;
      quantity: number;
      unitPrice: number | string;
    }>;
  }>;
  wishlist: {
    items: Array<{
      id: string;
      product: {
        id: string;
        name: string;
        slug: string;
        price: number | string;
      };
    }>;
  } | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [data, setData] = React.useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login?callbackUrl=/account");
          return;
        }
        const json = await res.json();
        if (json.success && json.user) {
          setData(json.user);
        }
      } catch (err) {
        console.error("Failed to load account:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <Container size="default" className="space-y-8">
          <Skeleton className="h-10 w-64 bg-noir-850" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 bg-noir-850" />
            <Skeleton className="h-48 md:col-span-2 bg-noir-850" />
          </div>
        </Container>
      </div>
    );
  }

  if (!data) return null;

  const isVip = data.role === "VIP_CUSTOMER";

  return (
    <div className="py-16 sm:py-24">
      <Container size="wide">
        {/* Salon Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-sand-50 font-light">
                Private Salon of {data.profile?.firstName || "Collector"} {data.profile?.lastName || ""}
              </h1>
              <Badge variant={isVip ? "gold" : "silver"}>
                {isVip ? "VIP Patron" : "Registered Client"}
              </Badge>
            </div>
            <p className="text-xs text-platinum-400 font-light mt-1">
              Member since {formatDate(data.createdAt)} • Private Atelier Vault #ZV-{data.id.slice(-6).toUpperCase()}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="self-start sm:self-auto gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            Terminate Salon Session
          </Button>
        </div>

        {/* Account Details & Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Profile & Privileges */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Collector Credentials</CardTitle>
                  <User className="h-4 w-4 text-gold-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-platinum-500 block text-[10px] uppercase font-mono">
                    Direct Email
                  </span>
                  <span className="text-sand-100 font-medium">{data.email}</span>
                </div>
                {data.profile?.phone && (
                  <div>
                    <span className="text-platinum-500 block text-[10px] uppercase font-mono">
                      Telephone
                    </span>
                    <span className="text-sand-100">{data.profile.phone}</span>
                  </div>
                )}
                <div>
                  <span className="text-platinum-500 block text-[10px] uppercase font-mono">
                    Preferred Currency
                  </span>
                  <span className="text-sand-100 font-mono">
                    {data.profile?.preferredCurrency || "USD"}
                  </span>
                </div>
                {data.profile?.notes && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-gold-400 block text-[10px] uppercase font-mono mb-1">
                      Atelier Curator Note
                    </span>
                    <p className="text-[11px] text-platinum-400 italic">
                      &quot;{data.profile.notes}&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Delivery Sanctuary</CardTitle>
                  <MapPin className="h-4 w-4 text-gold-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {data.addresses.length > 0 ? (
                  data.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border border-white/5 p-3 rounded bg-noir-850/50 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-sand-50 uppercase font-mono">
                          {addr.type} Address
                        </span>
                        {addr.isDefault && <Badge variant="gold">Default</Badge>}
                      </div>
                      <p className="text-platinum-300 font-light">{addr.street1}</p>
                      <p className="text-platinum-400 font-light">
                        {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-platinum-500 text-xs italic">
                    No private delivery address saved yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Column 2 & 3: Timepiece Allocations & Orders */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Timepiece & Fragrance Acquisitions
                    </CardTitle>
                    <p className="text-xs text-platinum-400 font-light">
                      Track high-security assembly and armored courier dispatch.
                    </p>
                  </div>
                  <Package className="h-4 w-4 text-gold-400" />
                </div>
              </CardHeader>
              <CardContent>
                {data.orders.length > 0 ? (
                  <div className="space-y-4">
                    {data.orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="border border-white/10 p-5 rounded-none bg-noir-850/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                          <div>
                            <span className="text-xs font-mono font-medium text-gold-400">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-platinum-500 ml-3">
                              {formatDate(ord.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="gold">{ord.status}</Badge>
                            <span className="text-xs font-mono font-semibold text-sand-50">
                              {formatCurrency(Number(ord.total) * 100)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {ord.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-sand-100 font-light">
                                {item.productName}{" "}
                                <span className="text-platinum-500 font-mono text-[10px]">
                                  (Qty: {item.quantity})
                                </span>
                              </span>
                              <span className="font-mono text-platinum-300">
                                {formatCurrency(Number(item.unitPrice) * 100)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Armored tracking note */}
                        {ord.trackingNumber && (
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-platinum-400 font-mono">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                              Courier Waybill: {ord.trackingNumber}
                            </span>
                            <span className="text-emerald-400">Armored Transit</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border border-dashed border-white/10 rounded">
                    <Sparkles className="h-6 w-6 text-gold-400/60 mx-auto mb-2" />
                    <p className="text-xs text-platinum-400 font-light">
                      You have no commissioned timepieces or orders in progress.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Wishlist */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Curated Wishlist</CardTitle>
                  <Heart className="h-4 w-4 text-gold-400" />
                </div>
              </CardHeader>
              <CardContent>
                {data.wishlist && data.wishlist.items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.wishlist.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-white/10 p-3 bg-noir-850/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-serif-luxury text-sand-50">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] font-mono text-gold-400">
                            {formatCurrency(Number(item.product.price) * 100)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="text-[10px] h-7 px-2">
                          View Piece
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-platinum-500 italic">
                    Your salon wishlist is currently empty.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
