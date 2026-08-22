"use client";

import { useEffect, useState } from "react";
import { Copy, MapPin, X } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { FALLBACK_FILTERS } from "@/lib/fallback";
import { ScratchOff } from "@/components/ScratchOff";
import { StoreLogo } from "@/components/StoreLogo";

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-NI", {
    day: "numeric",
    month: "long",
  });
}

export function CouponModal({
  coupon,
  onClose,
  onCopy,
}: {
  coupon: Coupon;
  onClose: () => void;
  onCopy: (code: string) => void;
}) {
  const [readyToCopy, setReadyToCopy] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-canvas text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pr-10">
          <StoreLogo src={coupon.logo_url} name={coupon.store} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{coupon.store}</p>
            <h2 className="font-display text-xl font-extrabold leading-tight">{coupon.title}</h2>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center rounded-2xl bg-gold-soft px-4 py-2">
          <span className="font-display text-3xl font-extrabold text-amber-600">{coupon.discount_label}</span>
          <span className="ml-2 text-xs font-bold uppercase tracking-wide text-amber-700">
            {coupon.discount_type === "amount" ? "de descuento" : "de descuento"}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-4 w-4" /> {coupon.city} · {coupon.category}
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-ink">Descubrí tu código</p>
          <ScratchOff code={coupon.code} onReveal={() => setReadyToCopy(true)} />
        </div>

        <button
          type="button"
          disabled={!readyToCopy}
          onClick={() => onCopy(coupon.code)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-display text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Copy className="h-4 w-4" />
          {readyToCopy ? "Copiar código" : "Rascá el cupón para copiar"}
        </button>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Vence</dt>
            <dd>{formatDate(coupon.expires_at)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Canjes restantes</dt>
            <dd>
              {coupon.remaining} / {coupon.max_redemptions}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Canal</dt>
            <dd>{coupon.channels.map((c) => FALLBACK_FILTERS.channels[c] ?? c).join(", ")}</dd>
          </div>
        </dl>
        {coupon.terms ? <p className="mt-4 text-sm leading-relaxed text-muted">{coupon.terms}</p> : null}
      </div>
    </div>
  );
}
