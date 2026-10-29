"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, X } from "lucide-react";
import { categoryIcon } from "@/lib/icons";
import { useFavorites } from "@/lib/favorites";
import { NEGOCIO_URL, type CategoryItem } from "@/lib/types";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  categories: CategoryItem[];
  navOpen: boolean;
  onNavOpen: () => void;
  onNavClose: () => void;
};

export function SiteHeader({
  query,
  onQueryChange,
  categories,
  navOpen,
  onNavOpen,
  onNavClose,
}: Props) {
  const [openCats, setOpenCats] = useState(false);
  const [mounted, setMounted] = useState(false);
  const catsRef = useRef<HTMLDivElement>(null);
  const { favoriteIds } = useFavorites();
  const pathname = usePathname();
  const onFavorites = pathname === "/favoritos";
  const favoritesCount = favoriteIds.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!openCats) return;

    function handlePointerDown(event: PointerEvent) {
      if (catsRef.current && !catsRef.current.contains(event.target as Node)) {
        setOpenCats(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenCats(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openCats]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onNavClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [navOpen, onNavClose]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 lg:gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-sm font-extrabold text-white shadow-sm shadow-rose-300">
            D%
          </span>
          <span className="hidden font-display text-[1.05rem] font-extrabold tracking-tight sm:inline">
            Descuento<span className="text-accent">Nic</span>
          </span>
        </Link>

        <div className="relative hidden lg:block" ref={catsRef}>
          <button
            type="button"
            onClick={() => setOpenCats((v) => !v)}
            className="inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-canvas"
          >
            Categorías
            <ChevronDown className={`h-4 w-4 transition ${openCats ? "rotate-180" : ""}`} />
          </button>
          {openCats ? (
            <div className="absolute left-0 top-12 z-50 grid w-[420px] grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-3 shadow-xl">
              {categories.map((cat) => {
                const Icon = categoryIcon(cat.icon);
                return (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    onClick={() => setOpenCats(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-accent-soft hover:text-accent"
                  >
                    <Icon className="h-4 w-4 text-navy" strokeWidth={1.8} />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <label className="relative min-w-0 flex-1 lg:mx-auto lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar cupones o negocios"
            className="h-10 w-full rounded-xl border border-line bg-canvas pl-9 pr-3 text-sm outline-none transition focus:border-accent focus:bg-white"
          />
        </label>

        <nav className="ml-1 hidden items-center gap-2 text-sm lg:flex">
          <Link
            href="/favoritos"
            aria-label="Favoritos"
            aria-current={onFavorites ? "page" : undefined}
            className={`relative grid h-10 w-10 place-items-center rounded-xl border ${
              onFavorites
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-white text-muted hover:text-accent"
            }`}
          >
            <Heart className={`h-5 w-5 ${onFavorites ? "fill-current" : ""}`} />
            {favoritesCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            ) : null}
          </Link>
          <a
            href={`${NEGOCIO_URL}/login`}
            className="rounded-lg px-3 py-2 font-medium text-muted hover:text-ink"
          >
            Iniciar sesión
          </a>
          <a
            href={`${NEGOCIO_URL}/register`}
            className="rounded-xl bg-accent px-3.5 py-2 font-display text-sm font-semibold text-white shadow-sm shadow-rose-200 hover:bg-rose-600"
          >
            Registrar negocio
          </a>
        </nav>

        <Link
          href="/favoritos"
          aria-label="Favoritos"
          aria-current={onFavorites ? "page" : undefined}
          className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border lg:hidden ${
            onFavorites
              ? "border-accent bg-accent-soft text-accent"
              : "border-line bg-white text-ink"
          }`}
        >
          <Heart className={`h-5 w-5 ${onFavorites ? "fill-current" : ""}`} />
          {favoritesCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {favoritesCount}
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
          onClick={onNavOpen}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mounted && navOpen
        ? createPortal(
            <div className="lg:hidden">
              <button
                type="button"
                className="fixed inset-0 z-[80] bg-slate-900/45"
                aria-label="Cerrar menú"
                onClick={() => onNavClose()}
              />
              <aside className="fixed inset-y-0 right-0 z-[90] flex h-dvh w-[min(20rem,88vw)] flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="font-display font-bold">Menú</p>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-lg hover:bg-canvas"
                    onClick={() => onNavClose()}
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-4">
                  <Link
                    href="/favoritos"
                    onClick={() => onNavClose()}
                    className={`mb-5 flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left ${
                      onFavorites
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-canvas"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${
                        onFavorites ? "text-accent" : "text-ink"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${onFavorites ? "fill-current" : "text-accent"}`} />
                      Guardados
                    </span>
                    <span className="text-xs font-bold text-muted">{favoritesCount}</span>
                  </Link>

                  <p className="px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    Cuenta de negocio
                  </p>
                  <div className="mt-3 grid gap-2">
                    <a
                      href={`${NEGOCIO_URL}/login`}
                      className="block rounded-xl bg-navy px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-800"
                    >
                      Iniciar sesión
                    </a>
                    <a
                      href={`${NEGOCIO_URL}/register`}
                      className="block rounded-xl bg-accent px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-rose-600"
                    >
                      Registrar negocio
                    </a>
                  </div>

                  <p className="mt-7 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    Categorías
                  </p>
                  <div className="mt-2 grid gap-0.5">
                    {categories.map((cat) => {
                      const Icon = categoryIcon(cat.icon);
                      return (
                        <Link
                          key={cat.slug}
                          href={`/categoria/${cat.slug}`}
                          onClick={() => onNavClose()}
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent-soft hover:text-accent"
                        >
                          <Icon className="h-4 w-4 text-navy" strokeWidth={1.8} />
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-line bg-canvas px-3 py-4">
                  <p className="px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                    Ayuda
                  </p>
                  <a
                    href="/#registrar-negocio"
                    onClick={() => onNavClose()}
                    className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-white"
                  >
                    Cómo registrar mi negocio
                  </a>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
