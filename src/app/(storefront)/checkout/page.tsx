"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useCart } from "@/context/cart-context";
import { formatPKR, usdToPKR, PAKISTAN_PROVINCES, MAJOR_PAKISTAN_CITIES } from "@/lib/currency";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Lock,
  Tag,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Contact
  const [contact, setContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    createAccount: false,
    password: "",
  });

  // Step 2: Shipping (Pakistan)
  const [shippingAddress, setShippingAddress] = useState({
    street1: "",
    street2: "",
    city: "Karachi",
    state: "Sindh",
    postalCode: "74000",
  });

  // Step 3: Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer" | "online">("cod");

  // Notes & Coupon
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountUSD: number;
    discountPKR: number;
    formattedDiscountPKR: string;
  } | null>(null);

  // Financial calculations
  const subtotalPKR = usdToPKR(subtotal);
  const discountUSD = appliedCoupon ? appliedCoupon.discountUSD : 0;
  const discountPKR = appliedCoupon ? appliedCoupon.discountPKR : 0;
  const shippingUSD = deliveryMethod === "express" ? 50 : 0;
  const shippingPKR = usdToPKR(shippingUSD);
  const totalUSD = Math.max(0, subtotal - discountUSD + shippingUSD);
  const totalPKR = Math.max(0, subtotalPKR - discountPKR + shippingPKR);

  // Handle coupon application
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotalUSD: subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid coupon code.");
      }

      setAppliedCoupon(data.coupon);
      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Could not validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Validation per step
  const validateStep = (step: CheckoutStep): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!contact.email.includes("@")) {
        setErrorMessage("Please provide a valid email address.");
        return false;
      }
      if (!contact.firstName.trim() || !contact.lastName.trim()) {
        setErrorMessage("Please enter both first and last names.");
        return false;
      }
      if (contact.createAccount && (!contact.password || contact.password.length < 6)) {
        setErrorMessage("Password must be at least 6 characters to create an account.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!shippingAddress.street1.trim()) {
        setErrorMessage("Please enter your street address in Pakistan.");
        return false;
      }
      if (!shippingAddress.city.trim()) {
        setErrorMessage("Please specify your city in Pakistan.");
        return false;
      }
      return true;
    }

    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1) as CheckoutStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as CheckoutStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Order Submission
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        contact,
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          sku: i.sku,
          price: i.price,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        notes: orderNotes,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to complete order. Please verify your details.");
      }

      // Clear local bag
      clearCart();

      // Save order to recent orders list in localStorage for seamless guest retrieval
      try {
        const orderNum = data.orderNumber || data.orderId;
        const saved = JSON.parse(localStorage.getItem("velora_recent_orders") || "[]");
        saved.unshift({
          orderNumber: orderNum,
          orderId: data.orderId || orderNum,
          createdAt: new Date().toISOString(),
          totalPKR: totalPKR,
          itemsCount: items.length,
          paymentMethod: paymentMethod.toUpperCase(),
          customerEmail: contact.email,
        });
        localStorage.setItem("velora_recent_orders", JSON.stringify(saved.slice(0, 10)));
      } catch (e) {
        // ignore
      }

      // Redirect to confirmation page with order number
      router.push(`/order-confirmation/${data.orderNumber || data.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setSubmitting(false);
    }
  };

  // If bag is empty and not submitting, offer return link
  if (items.length === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-obsidian text-sand-100 pt-32 pb-20 transition-colors duration-300">
        <Container size="narrow">
          <div className="text-center py-20 bg-neutral-950 border border-white/10 p-8 space-y-6">
            <h1 className="font-serif-luxury text-3xl text-sand-50">Your Bag is Empty</h1>
            <p className="text-sm text-neutral-400 font-light">
              Your shopping bag is currently empty. Please select a watch or fragrance to proceed to checkout.
            </p>
            <div className="pt-4">
              <Link
                href="/watches"
                className="px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-obsidian text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                Browse Watches
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: "Contact" },
    { num: 2, title: "Shipping" },
    { num: 3, title: "Delivery" },
    { num: 4, title: "Payment" },
    { num: 5, title: "Review" },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 pt-24 pb-24 selection:bg-gold-500/20 selection:text-gold-200 transition-colors duration-300">
      <Container size="wide">
        {/* Top Header & Breadcrumb */}
        <div className="border-b border-white/10 pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold-500 dark:text-gold-400 block mb-1">
                VELORA • Pakistan Delivery
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-sand-50 font-light">
                Checkout
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light mt-1">
                Place your order directly as a guest. Cash on Delivery (COD) available with open-parcel inspection across Pakistan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-sans font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Guest Checkout • No Login Required</span>
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-gold-500" />
                <span>256-Bit SSL Secure</span>
              </div>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 overflow-x-auto pb-2">
            {stepsList.map((s, idx) => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;

              return (
                <div key={s.num} className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    disabled={s.num > currentStep}
                    onClick={() => setCurrentStep(s.num as CheckoutStep)}
                    className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                      isCurrent
                        ? "text-gold-400 font-semibold"
                        : isPast
                        ? "text-sand-200 hover:text-gold-300 cursor-pointer"
                        : "text-neutral-600 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        isCurrent
                          ? "bg-gold-400 text-obsidian font-bold"
                          : isPast
                          ? "bg-neutral-800 text-gold-400 border border-gold-400/40"
                          : "bg-neutral-900 text-neutral-600 border border-white/10"
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.title}</span>
                  </button>
                  {idx < stepsList.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-white/20 mx-1 sm:mx-2 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/40 rounded-sm flex items-center gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Stepper Form (Col 1 to 7) */}
          <div className="lg:col-span-7 bg-neutral-950 border border-white/10 p-6 sm:p-8 space-y-8 rounded-sm">
            {/* STEP 1: CONTACT */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-serif-luxury text-xl text-sand-50">
                    Step 1 of 5: Contact Information
                  </h2>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Your order confirmation and tracking updates will be sent to this email.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@example.com"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq"
                        value={contact.firstName}
                        onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mansoor"
                        value={contact.lastName}
                        onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Phone Number (Pakistan) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Required for courier delivery updates and order verification.
                    </p>
                  </div>

                  {/* Create Account Checkbox */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contact.createAccount}
                        onChange={(e) =>
                          setContact({ ...contact, createAccount: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-gold-500 focus:ring-0"
                      />
                      <span className="text-xs text-neutral-300">
                        Create an account to track your orders and save details for future visits
                      </span>
                    </label>

                    {contact.createAccount && (
                      <div className="pl-7 pt-2">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          Account Password *
                        </label>
                        <input
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={contact.password}
                          onChange={(e) => setContact({ ...contact, password: e.target.value })}
                          className="w-full sm:w-2/3 h-10 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-8 h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING (PAKISTAN) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-serif-luxury text-xl text-sand-50">
                    Step 2 of 5: Delivery Address in Pakistan
                  </h2>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Free, fully insured delivery directly to your doorstep in Pakistan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Province / Territory *
                      </label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-xs text-sand-50 focus:outline-none focus:border-gold-400 cursor-pointer"
                      >
                        {PAKISTAN_PROVINCES.map((prov) => (
                          <option key={prov} value={prov} className="bg-neutral-950">
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        City *
                      </label>
                      <select
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-xs text-sand-50 focus:outline-none focus:border-gold-400 cursor-pointer"
                      >
                        {MAJOR_PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c} className="bg-neutral-950">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Street Address & Area / Phase *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 42-B, Street 5, Phase 6, DHA"
                      value={shippingAddress.street1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, street1: e.target.value })
                      }
                      className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Apartment, Suite, Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Floor 4 / Near Creek Club"
                        value={shippingAddress.street2}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, street2: e.target.value })
                        }
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="74000"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                        }
                        className="w-full h-11 bg-neutral-900 border border-white/10 px-4 text-sm text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      Delivery Instructions / Landmark (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any instructions for the courier, gate pass, or nearby landmarks..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-xs text-sand-50 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-sand-100 font-mono uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Contact</span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-8 h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DELIVERY METHOD */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-serif-luxury text-xl text-sand-50">
                    Step 3 of 5: Delivery Method
                  </h2>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Choose how you would like your order delivered across Pakistan.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Standard Armored Courier */}
                  <label
                    onClick={() => setDeliveryMethod("standard")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      deliveryMethod === "standard"
                        ? "bg-gold-950/20 border-gold-400"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="mt-1 text-gold-500 focus:ring-0"
                        />
                        <div className="space-y-1">
                          <span className="font-serif-luxury text-base text-sand-50 block">
                            Standard Insured Delivery (Pakistan)
                          </span>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Free, fully insured courier delivery with direct parcel tracking.
                          </p>
                          <span className="text-[10px] font-mono text-gold-400 block pt-1">
                            Estimated Delivery: 3 to 5 Business Days
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono text-emerald-400 text-sm font-semibold">
                        Free
                      </div>
                    </div>
                  </label>

                  {/* Express VIP Air Dispatch */}
                  <label
                    onClick={() => setDeliveryMethod("express")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "bg-gold-950/20 border-gold-400"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="mt-1 text-gold-500 focus:ring-0"
                        />
                        <div className="space-y-1">
                          <span className="font-serif-luxury text-base text-sand-50 block">
                            Express Priority Air Delivery
                          </span>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Fast priority air delivery with expedited dispatch and direct delivery handoff.
                          </p>
                          <span className="text-[10px] font-mono text-gold-400 block pt-1">
                            Estimated Delivery: 24 to 48 Hours
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sand-100 text-sm font-semibold">
                          {formatPKR(14000)}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          $50 USD
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-sand-100 font-mono uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-8 h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT METHOD (Pakistan Focus, COD + Abstraction) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-serif-luxury text-xl text-sand-50">
                    Step 4 of 5: Payment Method
                  </h2>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Choose how you would like to pay for your order in Pakistan.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "bg-gold-950/20 border-gold-400"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 text-gold-500 focus:ring-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-gold-400" />
                          <span className="font-serif-luxury text-base text-sand-50">
                            Cash on Delivery (COD)
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-full">
                            Available in Pakistan
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          Pay in cash directly upon physical delivery and inspection of the sealed packaging at your address.
                        </p>
                        <p className="text-[10px] font-mono text-gold-300/80 pt-1">
                          No advance payment needed. We will call you to confirm before dispatch.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Bank Wire (Meezan Bank IBAN) */}
                  <label
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "bg-gold-950/20 border-gold-400"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                        className="mt-1 text-gold-500 focus:ring-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gold-400" />
                          <span className="font-serif-luxury text-base text-sand-50">
                            Bank Transfer (Direct IBAN)
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          Transfer directly from your banking app or ATM to our corporate Meezan Bank account.
                        </p>
                        {paymentMethod === "bank_transfer" && (
                          <div className="mt-3 p-3 bg-neutral-950 border border-white/10 space-y-1 text-xs font-mono">
                            <div className="text-gold-400 font-semibold">Meezan Bank Limited (Pakistan)</div>
                            <div className="text-neutral-300">Account: VELORA Private Ltd</div>
                            <div className="text-sand-100 font-mono">IBAN: PK42MEZN0001090102938475</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Configurable Online Payment (Card / Gateway) */}
                  <label
                    onClick={() => setPaymentMethod("online")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "bg-gold-950/20 border-gold-400"
                        : "bg-neutral-900/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="mt-1 text-gold-500 focus:ring-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gold-400" />
                          <span className="font-serif-luxury text-base text-sand-50">
                            Credit / Debit Card (Visa, Mastercard, UnionPay)
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          Secure online card gateway with 3D Secure OTP verification.
                        </p>
                        {paymentMethod === "online" && (
                          <div className="mt-2 p-2.5 bg-neutral-900 border border-white/10 text-[11px] text-neutral-400">
                            Note: For instant processing in Pakistan, Cash on Delivery (COD) and Direct Bank Transfer are fully supported.
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-sand-100 font-mono uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-8 h-12 bg-gold-500 hover:bg-gold-400 text-obsidian font-semibold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-serif-luxury text-xl text-sand-50">
                    Step 5 of 5: Review & Place Order
                  </h2>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Please review your order details before confirming.
                  </p>
                </div>

                {/* Review Cards */}
                <div className="space-y-4 text-xs font-sans">
                  {/* Contact Summary */}
                  <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono uppercase text-[10px] tracking-wider text-gold-400 font-semibold">
                        Contact Information
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[11px] text-neutral-400 hover:text-gold-300 underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sand-100 font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-neutral-400">{contact.email}</div>
                    <div className="text-neutral-400">{contact.phone || "No phone provided"}</div>
                  </div>

                  {/* Shipping Summary */}
                  <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono uppercase text-[10px] tracking-wider text-gold-400 font-semibold">
                        Shipping Address
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[11px] text-neutral-400 hover:text-gold-300 underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sand-100">{shippingAddress.street1}</div>
                    {shippingAddress.street2 && (
                      <div className="text-neutral-400">{shippingAddress.street2}</div>
                    )}
                    <div className="text-neutral-400">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}, Pakistan
                    </div>
                    {orderNotes && (
                      <div className="text-gold-400/80 text-[11px] pt-1">
                        Delivery instructions: {orderNotes}
                      </div>
                    )}
                  </div>

                  {/* Delivery & Payment Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-1">
                      <span className="font-mono uppercase text-[10px] tracking-wider text-gold-400 font-semibold block">
                        Delivery Method
                      </span>
                      <div className="text-sand-100 font-medium">
                        {deliveryMethod === "standard"
                          ? "Standard Insured Delivery"
                          : "Express Air Delivery"}
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        {deliveryMethod === "standard"
                          ? "Free (3-5 Business Days)"
                          : "24-48 Hours Express Dispatch"}
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-900/60 border border-white/10 space-y-1">
                      <span className="font-mono uppercase text-[10px] tracking-wider text-gold-400 font-semibold block">
                        Payment Method
                      </span>
                      <div className="text-sand-100 font-medium">
                        {paymentMethod === "cod"
                          ? "Cash on Delivery (COD)"
                          : paymentMethod === "bank_transfer"
                          ? "Bank Transfer (Meezan Bank)"
                          : "Credit / Debit Card"}
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        {paymentMethod === "cod"
                          ? "Pay upon physical delivery"
                          : paymentMethod === "bank_transfer"
                          ? "Direct IBAN deposit"
                          : "Online card payment"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms of Order */}
                <div className="p-4 bg-neutral-950 border border-gold-500/20 text-xs text-neutral-400 space-y-2">
                  <div className="flex items-center gap-2 text-gold-300 font-mono text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>Order & Delivery Terms</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    By placing this order, you confirm your purchase of the items listed above. For Cash on Delivery orders, our team will call your phone number to confirm your address before dispatch.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-sand-100 font-mono uppercase tracking-wider disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="px-8 h-14 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian font-semibold text-xs uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
                  >
                    {submitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary (Col 8 to 12) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-neutral-950 border border-white/10 p-6 space-y-6 rounded-sm">
              <h2 className="font-serif-luxury text-lg text-sand-50 border-b border-white/10 pb-3">
                Order Items ({items.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-white/5">
                {items.map((item) => {
                  const linePKR = usdToPKR(item.price * item.quantity);

                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-4 text-xs">
                      <div className="w-16 h-20 bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[9px] font-mono text-gold-400 uppercase tracking-wider">
                          REF. {item.sku}
                        </span>
                        <h4 className="font-serif-luxury text-sm text-sand-100 truncate">
                          {item.name}
                        </h4>
                        {item.variantTitle && (
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.variantTitle}
                          </p>
                        )}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-neutral-400 font-mono text-[11px]">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-mono text-gold-300 font-medium">
                            {formatPKR(linePKR)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Discount Code
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-gold-950/20 border border-gold-500/30 rounded-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-gold-400" />
                      <span className="font-mono text-gold-300 text-xs">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        (-{appliedCoupon.formattedDiscountPKR})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-neutral-400 hover:text-rose-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. VELORA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 h-9 bg-neutral-900 border border-white/10 px-3 text-xs text-sand-50 uppercase tracking-wider focus:outline-none focus:border-gold-400"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-3 h-9 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-[10px] font-semibold uppercase tracking-wider text-sand-100 border border-white/10 transition-colors"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-rose-400 font-light">{couponError}</p>
                )}
              </div>

              {/* Summary Financials */}
              <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-sand-100">
                    {formatPKR(subtotalPKR)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-gold-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Discount</span>
                    </span>
                    <span className="font-mono">
                      -{appliedCoupon.formattedDiscountPKR}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-neutral-400">
                  <span>Shipping (Pakistan)</span>
                  <span className="font-mono text-sand-100">
                    {shippingPKR === 0 ? (
                      <span className="text-emerald-400">Free</span>
                    ) : (
                      formatPKR(shippingPKR)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                  <div>
                    <span className="font-serif-luxury text-base text-sand-50 block">
                      Total
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500">
                      Currency: PKR (₨)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl text-gold-300 font-medium">
                      {formatPKR(totalPKR, { includeCode: true })}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Approx. ${totalUSD.toLocaleString()} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance card */}
            <div className="p-4 bg-neutral-950/60 border border-white/5 space-y-2 text-center text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block">
                Need Help?
              </span>
              <p className="text-neutral-400 font-light text-[11px]">
                Have questions before completing your order? Contact our support team:
              </p>
              <div className="font-mono text-sand-200 text-xs">
                +92 (021) 111-VELORA / support@velora.com
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
