"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL, NEGOCIO_URL } from "@/lib/types";

type BannerSlide = {
  id?: number;
  kicker: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  tone: string;
};

const FALLBACK_BANNERS: BannerSlide[] = [
  {
    kicker: "Espacio publicitario",
    title: "Llevá tu negocio a miles de clientes en Nicaragua",
    text: "Publicá cupones y aparecé en el banner destacado de DescuentoNic.",
    cta: "Quiero promocionar",
    href: `${NEGOCIO_URL}/register`,
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80",
    tone: "from-rose-700/85 to-rose-900/70",
  },
  {
    kicker: "Oferta destacada",
    title: "GymFit Pro: membresía con el primer mes incluido",
    text: "Válido en sucursales de Managua. Cupos limitados esta semana.",
    cta: "Ver cupones de gimnasios",
    href: "/categoria/gimnasios",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80",
    tone: "from-indigo-800/85 to-slate-900/70",
  },
  {
    kicker: "Sabores de la semana",
    title: "Restaurantes con hasta 50% en combos y delivery",
    text: "Managua, León, Granada y más. Pedí con código en caja o WhatsApp.",
    cta: "Ver restaurantes",
    href: "/categoria/restaurantes",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    tone: "from-amber-700/80 to-stone-900/70",
  },
];

function normalizeBanner(raw: Record<string, unknown>): BannerSlide | null {
  const title = String(raw.title ?? "").trim();
  const image = String(raw.image ?? "").trim();
  if (!title || !image) return null;

  return {
    id: typeof raw.id === "number" ? raw.id : undefined,
    kicker: String(raw.kicker ?? "Destacado"),
    title,
    text: String(raw.text ?? ""),
    cta: String(raw.cta ?? "Ver más"),
    href: String(raw.href ?? "/"),
    image,
    tone: String(raw.tone ?? "from-rose-700/85 to-rose-900/70"),
  };
}

export function PromoBanners() {
  const [banners, setBanners] = useState<BannerSlide[]>(FALLBACK_BANNERS);
  const [index, setIndex] = useState(0);
  const banner = banners[index] ?? banners[0];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/banners`);
        if (!res.ok) return;
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        const mapped = rows
          .map((row: Record<string, unknown>) => normalizeBanner(row))
          .filter(Boolean) as BannerSlide[];
        if (!cancelled && mapped.length > 0) {
          setBanners(mapped);
          setIndex(0);
        }
      } catch {
        // keep fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const go = useCallback(
    (next: number) => {
      const total = banners.length;
      setIndex(((next % total) + total) % total);
    },
    [banners.length],
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = window.setInterval(() => go(index + 1), 7000);
    return () => window.clearInterval(id);
  }, [index, go, banners.length]);

  if (!banner) return null;

  return (
    <section className="w-full">
      <div className="relative min-h-[17.5rem] overflow-hidden sm:min-h-0 sm:h-80">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((item, i) => (
            <div key={item.id ?? item.title} className="relative h-full w-full shrink-0 grow-0 basis-full">
              <img
                src={item.image}
                alt=""
                className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-linear ${
                  i === index ? "scale-110" : "scale-100"
                }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${item.tone}`} />
            </div>
          ))}
        </div>

        {banners.length > 1 ? (
          <div className="absolute right-3 top-3 z-10 hidden gap-2 sm:flex">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
              onClick={() => go(index - 1)}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
              onClick={() => go(index + 1)}
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="relative z-[1] mx-auto flex min-h-[17.5rem] max-w-7xl flex-col justify-end px-4 pb-9 pt-8 sm:h-80 sm:min-h-0 sm:pb-10 sm:pt-10">
          <div
            key={banner.title}
            className="w-full max-w-xl min-w-0 text-white animate-[bannerIn_650ms_ease-out] motion-reduce:animate-none"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 sm:text-xs">
              {banner.kicker}
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold leading-snug break-words sm:text-3xl sm:leading-tight">
              {banner.title}
            </h2>
            {banner.text ? (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/85 sm:line-clamp-none">
                {banner.text}
              </p>
            ) : null}
            <a
              href={banner.href}
              className="mt-3 inline-flex max-w-full truncate rounded-xl bg-white px-4 py-2.5 font-display text-sm font-bold text-ink sm:mt-4"
            >
              {banner.cta}
            </a>
          </div>
        </div>

        {banners.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
            {banners.map((item, i) => (
              <button
                key={item.id ?? item.title}
                type="button"
                aria-label={`Ir al anuncio ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
