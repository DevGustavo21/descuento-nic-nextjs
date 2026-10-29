"use client";

import type { Coupon } from "@/lib/types";
import { StoreLogo } from "@/components/StoreLogo";
import { FavoriteButton } from "@/components/FavoriteButton";

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-NI", {
    day: "numeric",
    month: "short",
  });
}

export function CouponCard({
  coupon,
  onOpen,
  dense = false,
}: {
  coupon: Coupon;
  onOpen: (coupon: Coupon) => void;
  dense?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-line bg-white transition hover:border-accent/40 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] ${
        dense ? "p-3 sm:p-4" : "p-4"
      }`}
    >
      <div className={`absolute z-10 ${dense ? "right-2 top-2" : "right-3 top-3"}`}>
        <FavoriteButton size="sm" couponId={coupon.id} label={coupon.title} />
      </div>

      <button
        type="button"
        onClick={() => onOpen(coupon)}
        className="flex flex-1 flex-col text-left"
      >
        <div className={`flex items-center pr-9 ${dense ? "gap-2" : "gap-3"}`}>
          <StoreLogo src={coupon.logo_url} name={coupon.store} size={dense ? "sm" : "md"} />
          <div className="min-w-0">
            <p className={`truncate font-semibold text-ink ${dense ? "text-xs sm:text-sm" : "text-sm"}`}>
              {coupon.store}
            </p>
            <p className={`truncate text-muted ${dense ? "text-[10px] sm:text-xs" : "text-xs"}`}>
              {coupon.city}
            </p>
          </div>
        </div>

        <h3
          className={`line-clamp-2 font-display font-bold leading-snug text-ink ${
            dense
              ? "mt-3 min-h-[2.4rem] text-sm sm:min-h-[2.75rem] sm:text-base"
              : "mt-4 min-h-[2.75rem] text-base"
          }`}
        >
          {coupon.title}
        </h3>

        <div className={`mt-auto flex items-end justify-between gap-2 ${dense ? "mt-3" : "mt-4"}`}>
          <p
            className={`font-display font-extrabold leading-none tracking-tight text-accent ${
              dense ? "text-xl sm:text-3xl" : "text-3xl"
            }`}
          >
            {coupon.discount_label}
            <span
              className={`ml-0.5 font-bold text-accent/70 ${dense ? "text-[10px] sm:text-sm" : "text-sm"}`}
            >
              {coupon.discount_type === "amount" ? "OFF" : "dto."}
            </span>
          </p>
          <p className={`pb-0.5 text-muted ${dense ? "text-[10px] sm:text-xs" : "text-xs"}`}>
            {formatDate(coupon.expires_at)}
          </p>
        </div>

        <span
          className={`inline-flex w-full items-center justify-center rounded-xl bg-accent font-display font-bold text-white transition group-hover:bg-rose-600 ${
            dense ? "mt-3 h-9 text-xs sm:mt-5 sm:h-10 sm:text-sm" : "mt-5 h-10 text-sm"
          }`}
        >
          Ver cupón
        </span>
      </button>
    </article>
  );
}
