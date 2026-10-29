"use client";

import { useEffect, useState } from "react";
import { Copy, MapPin, QrCode, X } from "lucide-react";
import type { Coupon } from "@/lib/types";
import { API_URL } from "@/lib/types";
import { FALLBACK_FILTERS } from "@/lib/fallback";
import { ScratchOff } from "@/components/ScratchOff";
import { StoreLogo } from "@/components/StoreLogo";
import { FavoriteButton } from "@/components/FavoriteButton";

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-NI", {
    day: "numeric",
    month: "short",
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
  const [tab, setTab] = useState<"codigo" | "qr">("codigo");

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

  useEffect(() => {
    if (readyToCopy) setTab("codigo");
  }, [readyToCopy]);

  const channels = coupon.channels
    .map((c) => FALLBACK_FILTERS.channels[c] ?? c)
    .join(" · ");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-start gap-3 border-b border-line px-4 pb-3 pt-3 sm:px-5 sm:pt-5">
          <StoreLogo src={coupon.logo_url} name={coupon.store} />
          <div className="min-w-0 flex-1 pr-16">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {coupon.store}
              </p>
              <span className="rounded-lg bg-gold-soft px-2 py-0.5 font-display text-sm font-extrabold text-amber-700">
                {coupon.discount_label}
              </span>
            </div>
            <h2 className="mt-0.5 font-display text-lg font-extrabold leading-snug sm:text-xl">
              {coupon.title}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {coupon.city} · {coupon.category}
              </span>
            </p>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <FavoriteButton size="sm" couponId={coupon.id} label={coupon.title} />
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-ink"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {!readyToCopy ? (
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Rascá para ver tu código</p>
              <ScratchOff code={coupon.code} onReveal={() => setReadyToCopy(true)} compact />
            </div>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
                <button
                  type="button"
                  onClick={() => setTab("codigo")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
                    tab === "codigo"
                      ? "bg-surface text-ink shadow-sm"
                      : "text-muted"
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  Código
                </button>
                <button
                  type="button"
                  onClick={() => setTab("qr")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
                    tab === "qr"
                      ? "bg-surface text-ink shadow-sm"
                      : "text-muted"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  QR en caja
                </button>
              </div>

              {tab === "codigo" ? (
                <div className="rounded-2xl border border-line bg-gold-soft px-3 py-4 text-center">
                  <p className="font-mono text-2xl font-extrabold tracking-[0.22em] text-ink sm:text-3xl">
                    {coupon.code}
                  </p>
                  <p className="mt-2 text-xs text-muted">Decí o mostrá este código en caja</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-3">
                  <img
                    src={
                      coupon.qr_url ??
                      `${API_URL}/coupons/${encodeURIComponent(coupon.code)}/qr`
                    }
                    alt={`QR del cupón ${coupon.code}`}
                    className="h-28 w-28 shrink-0 rounded-xl bg-white p-1.5 sm:h-32 sm:w-32"
                  />
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-ink">Para escanear</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      El negocio escanea el QR, pide tu teléfono y registra el canje.
                    </p>
                    <p className="mt-2 font-mono text-sm font-bold tracking-widest text-ink">
                      {coupon.code}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-line bg-canvas px-2 py-3 text-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Vence</p>
              <p className="mt-0.5 text-xs font-semibold text-ink">{formatDate(coupon.expires_at)}</p>
            </div>
            <div className="border-x border-line">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Canjes</p>
              <p className="mt-0.5 text-xs font-semibold text-ink">
                {coupon.remaining}/{coupon.max_redemptions}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Canal</p>
              <p className="mt-0.5 truncate px-1 text-xs font-semibold text-ink" title={channels}>
                {channels}
              </p>
            </div>
          </div>

          {coupon.terms ? (
            <p className="mt-3 text-[11px] leading-relaxed text-muted">{coupon.terms}</p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-line bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <button
            type="button"
            disabled={!readyToCopy}
            onClick={() => onCopy(coupon.code)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-display text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Copy className="h-4 w-4" />
            {readyToCopy ? "Copiar código" : "Rascá el cupón primero"}
          </button>
        </div>
      </div>
    </div>
  );
}
