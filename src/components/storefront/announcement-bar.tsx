import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-noir-950 border-b border-white/5 py-2 px-4 text-center">
      <p className="text-[10px] tracking-ultra uppercase text-platinum-400 font-light">
        Complimentary Armored Courier Delivery & Private Salon Consultations{" "}
        <span className="text-white/20 mx-2">•</span>
        <Link
          href="/concierge"
          className="text-gold-400 hover:text-gold-300 transition-colors underline-offset-4 hover:underline"
        >
          Reserve Bespoke Allocation
        </Link>
      </p>
    </div>
  );
}
