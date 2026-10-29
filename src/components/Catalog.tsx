"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { CouponCard } from "@/components/CouponCard";
import { CouponModal } from "@/components/CouponModal";
import { SiteHeader } from "@/components/SiteHeader";
import { CategoryMultiSelect } from "@/components/CategoryMultiSelect";
import { FilterSheet } from "@/components/FilterSheet";
import { CouponSkeleton } from "@/components/CouponSkeleton";
import type { Coupon, FiltersPayload } from "@/lib/types";

const PAGE_SIZES = [12, 24, 48, 60, 100];

type CatalogProps = {
  initialCoupons: Coupon[];
  filters: FiltersPayload;
  lockedCategory?: string | null;
  heading?: string;
  children?: React.ReactNode;
  initialCode?: string | null;
};

export function Catalog({
  initialCoupons,
  filters,
  lockedCategory = null,
  heading,
  children,
  initialCode = null,
}: CatalogProps) {
  const [query, setQuery] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [channels, setChannels] = useState<string[]>(Object.keys(filters.channels));
  const [payments, setPayments] = useState<string[]>(Object.keys(filters.payment_methods));
  const [vigencia, setVigencia] = useState("all");
  const [sort, setSort] = useState("recent");
  const [listView, setListView] = useState(false);
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const skipPageFx = useRef(true);
  const couponsTopRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState<Coupon | null>(
    () => initialCoupons.find((c) => c.code === initialCode) ?? null,
  );
  const coupons = useMemo(() => {
    let items = initialCoupons.filter((c) => {
      if (lockedCategory && c.category_slug !== lockedCategory) return false;
      if (selectedCategories.length && !selectedCategories.includes(c.category_slug)) return false;
      if (departments.length && !departments.includes(c.department)) return false;
      if (
        query &&
        !`${c.title} ${c.store} ${c.category}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (minDiscount) {
        const matchesPercent =
          c.discount_type === "percent" && c.discount_value >= minDiscount;
        // Descuentos en C$ no se pueden comparar con %; se mantienen en el filtro.
        const matchesAmount = c.discount_type === "amount";
        if (!matchesPercent && !matchesAmount) return false;
      }
      if (channels.length && !c.channels.some((ch) => channels.includes(ch))) return false;
      if (payments.length && !c.payment_methods.some((p) => payments.includes(p))) return false;
      if (vigencia === "new" && c.badge !== "new") return false;
      if (vigencia === "hot" && c.badge !== "hot") return false;
      if (vigencia === "expires" && c.badge !== "expires") return false;
      return true;
    });

    if (sort === "discount") {
      items = [...items].sort((a, b) => b.discount_value - a.discount_value);
    } else if (sort === "popular") {
      items = [...items].sort((a, b) => a.remaining - b.remaining);
    }

    return items;
  }, [
    initialCoupons,
    lockedCategory,
    selectedCategories,
    departments,
    query,
    minDiscount,
    channels,
    payments,
    vigencia,
    sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(coupons.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedCoupons = coupons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, departments, selectedCategories, minDiscount, channels, payments, vigencia, sort, pageSize, lockedCategory]);

  useEffect(() => {
    if (skipPageFx.current) {
      skipPageFx.current = false;
      return;
    }

    setLoadingPage(true);
    couponsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const id = window.setTimeout(() => setLoadingPage(false), 450);
    return () => window.clearTimeout(id);
  }, [currentPage, pageSize, sort]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function closeCoupon() {
    setActive(null);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("cupon")) return;
    url.searchParams.delete("cupon");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, "", next);
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
    setToast(`Código ${code} copiado`);
  }

  return (
    <>
      <SiteHeader
        query={query}
        onQueryChange={setQuery}
        categories={filters.categories}
        navOpen={navOpen}
        onNavOpen={() => {
          setShowFilters(false);
          setNavOpen(true);
        }}
        onNavClose={() => setNavOpen(false)}
      />
      {children}

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <FilterBlock title="Departamento">
            <div className="flex flex-wrap gap-1.5">
              <Chip active={departments.length === 0} onClick={() => setDepartments([])}>
                Todas
              </Chip>
              {filters.departments.map((dept) => (
                <Chip
                  key={dept}
                  active={departments.includes(dept)}
                  onClick={() =>
                    setDepartments(
                      departments.includes(dept)
                        ? departments.filter((d) => d !== dept)
                        : [...departments, dept],
                    )
                  }
                >
                  {dept}
                </Chip>
              ))}
            </div>
          </FilterBlock>
          <FilterBlock title="Descuento mínimo">
            {[0, 10, 20, 30, 50].map((n) => (
              <label key={n} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-ink/80">
                <input
                  type="radio"
                  name="min"
                  checked={minDiscount === n}
                  onChange={() => setMinDiscount(n)}
                  className="accent-[var(--accent)]"
                />
                {n === 0 ? "Cualquiera" : `${n}%+ o en C$`}
              </label>
            ))}
          </FilterBlock>
          <FilterBlock title="Canal de venta">
            {Object.entries(filters.channels).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={channels.includes(key)}
                  onChange={() => toggle(channels, key, setChannels)}
                  className="accent-[var(--accent)]"
                />
                {label}
              </label>
            ))}
          </FilterBlock>
          <FilterBlock title="Vigencia">
            {[
              ["all", "Todos"],
              ["hot", "Populares"],
              ["new", "Nuevos"],
              ["expires", "Por vencer"],
            ].map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="radio"
                  name="vigencia"
                  checked={vigencia === value}
                  onChange={() => setVigencia(value)}
                  className="accent-[var(--accent)]"
                />
                {label}
              </label>
            ))}
          </FilterBlock>
          <FilterBlock title="Medio de pago">
            {Object.entries(filters.payment_methods).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={payments.includes(key)}
                  onChange={() => toggle(payments, key, setPayments)}
                  className="accent-[var(--accent)]"
                />
                {label}
              </label>
            ))}
          </FilterBlock>
        </aside>

        <main className="min-w-0 flex-1">
          {heading ? (
            <h1 className="mb-4 font-display text-2xl font-extrabold text-ink">{heading}</h1>
          ) : null}
          <div ref={couponsTopRef} className="mb-4 flex scroll-mt-24 flex-wrap items-end justify-between gap-3">
            <p className="font-display text-sm font-bold">
              {coupons.length} descuentos{" "}
              <span className="font-sans font-normal text-muted">
                de {initialCoupons.length} disponibles
              </span>
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink shadow-sm lg:hidden"
                onClick={() => {
                  setNavOpen(false);
                  setShowFilters(true);
                }}
              >
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                Filtros
              </button>
              {!lockedCategory ? (
                <div className="hidden lg:block">
                  <CategoryMultiSelect
                    categories={filters.categories}
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>
              ) : null}
              <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
                Ordenar
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink"
                >
                  <option value="recent">Más recientes</option>
                  <option value="discount">Mayor descuento</option>
                  <option value="popular">Más canjeados</option>
                </select>
              </label>
              <div className="flex h-10 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setListView(false)}
                  className={`grid h-10 w-10 place-items-center rounded-xl border ${
                    !listView ? "border-accent text-accent bg-accent-soft" : "border-line bg-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setListView(true)}
                  className={`grid h-10 w-10 place-items-center rounded-xl border ${
                    listView ? "border-accent text-accent bg-accent-soft" : "border-line bg-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {coupons.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center">
              <p className="font-display font-bold">Sin resultados</p>
              <p className="mt-1 text-sm text-muted">Probá otra categoría, ciudad o filtro.</p>
            </div>
          ) : (
            <div
              className={`grid ${
                listView
                  ? "grid-cols-1 gap-4"
                  : "grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3"
              }`}
            >
              {loadingPage
                ? Array.from({ length: Math.min(pageSize, 12) }).map((_, i) => (
                    <CouponSkeleton key={i} dense={!listView} />
                  ))
                : pagedCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onOpen={setActive}
                      dense={!listView}
                    />
                  ))}
            </div>
          )}

          {coupons.length > 0 ? (
            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                Cupones por página
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-10 rounded-xl border border-line bg-white px-3 font-medium text-ink"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1 || loadingPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={loadingPage}
                    onClick={() => setPage(n)}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold ${
                      n === currentPage ? "bg-accent text-white" : "border border-line bg-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages || loadingPage}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      <FilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        resultCount={coupons.length}
        selectedCategories={selectedCategories}
        onCategories={setSelectedCategories}
        departments={departments}
        onDepartments={setDepartments}
        minDiscount={minDiscount}
        onMinDiscount={setMinDiscount}
        channels={channels}
        onChannels={setChannels}
        payments={payments}
        onPayments={setPayments}
        vigencia={vigencia}
        onVigencia={setVigencia}
        hideCategories={Boolean(lockedCategory)}
      />

      {active ? (
        <CouponModal coupon={active} onClose={closeCoupon} onCopy={copyCode} />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white">
          {toast}
        </div>
      ) : null}
    </>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 rounded-2xl border border-line bg-white p-4">
      <h2 className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs ${
        active ? "border-accent bg-accent-soft font-semibold text-accent" : "border-line text-muted"
      }`}
    >
      {children}
    </button>
  );
}
