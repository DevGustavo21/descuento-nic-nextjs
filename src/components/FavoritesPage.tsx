"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { CouponCard } from "@/components/CouponCard";
import { CouponModal } from "@/components/CouponModal";
import { SiteHeader } from "@/components/SiteHeader";
import { useFavorites } from "@/lib/favorites";
import type { Coupon, FiltersPayload } from "@/lib/types";

type Props = {
  coupons: Coupon[];
  filters: FiltersPayload;
};

export function FavoritesPage({ coupons, filters }: Props) {
  const { favoriteIds, ids } = useFavorites();
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const favoriteCoupons = useMemo(() => {
    let items = coupons.filter((coupon) => ids.has(coupon.id));

    // Keep the order the user favorited them
    items = [...items].sort(
      (a, b) => favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id),
    );

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((coupon) =>
        `${coupon.title} ${coupon.store} ${coupon.category}`.toLowerCase().includes(q),
      );
    }

    return items;
  }, [coupons, ids, favoriteIds, query]);

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
    setToast(`Código ${code} copiado`);
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        query={query}
        onQueryChange={setQuery}
        categories={filters.categories}
        navOpen={navOpen}
        onNavOpen={() => setNavOpen(true)}
        onNavClose={() => setNavOpen(false)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">Favoritos</h1>
            <p className="mt-1 text-sm text-muted">
              {favoriteIds.length === 0
                ? "Guardá cupones con el corazón para verlos acá."
                : `${favoriteCoupons.length} cupón${favoriteCoupons.length === 1 ? "" : "es"} guardados`}
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-navy hover:text-accent">
            ← Volver al catálogo
          </Link>
        </div>

        {favoriteIds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <Heart className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 font-display font-bold">Empezá a guardar cupones</p>
            <p className="mt-1 text-sm text-muted">
              Usá el corazón en un cupón y va a aparecer acá.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white"
            >
              Explorar cupones
            </Link>
          </div>
        ) : favoriteCoupons.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
            <p className="font-display font-bold">Sin cupones activos</p>
            <p className="mt-1 text-sm text-muted">
              Tus favoritos ya no están vigentes o no coinciden con la búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} onOpen={setActive} dense />
            ))}
          </div>
        )}
      </main>

      {active ? (
        <CouponModal coupon={active} onClose={() => setActive(null)} onCopy={copyCode} />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
