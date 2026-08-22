"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NEGOCIO_URL } from "@/lib/types";

const BANNERS = [
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

export function PromoBanners() {
  const [index, setIndex] = useState(0);
  const banner = BANNERS[index] ?? BANNERS[0];

  const go = useCallback((next: number) => {
    const total = BANNERS.length;
    setIndex(((next % total) + total) % total);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => go(index + 1), 7000);
    return () => window.clearInterval(id);
  }, [index, go]);

  return (
    <section className="w-full">
      <div className="relative h-56 overflow-hidden sm:h-80">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {BANNERS.map((item, i) => (
            <div key={item.title} className="relative h-full w-full shrink-0 grow-0 basis-full">
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

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-end justify-between gap-4 px-4 pb-6 sm:pb-10">
            <div
              key={banner.title}
              className="max-w-xl text-white animate-[bannerIn_650ms_ease-out] motion-reduce:animate-none"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{banner.kicker}</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                {banner.title}
              </h2>
              <p className="mt-2 text-sm text-white/85">{banner.text}</p>
              <a
                href={banner.href}
                className="mt-4 inline-flex w-fit rounded-xl bg-white px-4 py-2 font-display text-sm font-bold text-ink"
              >
                {banner.cta}
              </a>
            </div>
            <div className="mb-1 flex shrink-0 gap-2">
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
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
          {BANNERS.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Ir al anuncio ${i + 1}`}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-7 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
