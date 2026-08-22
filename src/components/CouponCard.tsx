"use client";

import { MapPin } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { FALLBACK_FILTERS } from "@/lib/fallback";
import { StoreLogo } from "@/components/StoreLogo";

const CHANNEL_LABELS = FALLBACK_FILTERS.channels;

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-NI", {
    day: "numeric",
    month: "short",
  });
}

const BADGES: Record<NonNullable<Coupon["badge"]>, { label: string; className: string }> = {
  hot: { label: "Popular", className: "bg-accent text-white" },
  new: { label: "Nuevo", className: "bg-navy text-white" },
  expires: { label: "Por vencer", className: "bg-gold text-white" },
};

export function CouponCard({
  coupon,
  onOpen,
}: {
  coupon: Coupon;
  onOpen: (coupon: Coupon) => void;
}) {
  const channel = coupon.channels[0];
  const badge = coupon.badge ? BADGES[coupon.badge] : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(225,29,72,0.08)]">
      <div className="flex items-start gap-3 px-4 pt-4">
        <StoreLogo src={coupon.logo_url} name={coupon.store} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy">
              {coupon.store}
            </p>
            {badge ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}>
                {badge.label}
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3" />
            {coupon.city} · {coupon.category}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <h3 className="min-h-[2.6rem] font-display text-[1.02rem] font-bold leading-snug text-ink">
          {coupon.title}
        </h3>
        <div className="mt-3 inline-flex items-baseline gap-1 rounded-xl bg-gold-soft px-3 py-1.5">
          <span className="font-display text-2xl font-extrabold leading-none text-amber-600">
            {coupon.discount_label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
            {coupon.discount_type === "amount" ? "OFF" : "dto."}
          </span>
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-line px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <span className="rounded-full bg-canvas px-2.5 py-1 font-medium">
            {CHANNEL_LABELS[channel] ?? channel}
          </span>
          <span>Vence {formatDate(coupon.expires_at)}</span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(coupon)}
          className="w-full rounded-xl bg-accent py-2.5 font-display text-sm font-bold text-white hover:bg-rose-600"
        >
          Ver cupón
        </button>
      </div>
    </article>
  );
}
