import Link from "next/link";
import { categoryImage } from "@/lib/category-images";
import type { CategoryItem } from "@/lib/types";

export function CategoryShowcase({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Rubros</p>
      <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Explorá por categoría</h2>
      <p className="mt-2 max-w-2xl text-muted">
        Encontrá descuentos de restaurantes, farmacias, ferreterías y más negocios verificados.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <article
            key={cat.slug}
            className="group relative min-h-[220px] overflow-hidden rounded-3xl shadow-md"
          >
            <img
              src={categoryImage(cat)}
              alt={cat.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5 text-white">
              <h3 className="font-display text-xl font-extrabold">{cat.name}</h3>
              <Link
                href={`/categoria/${cat.slug}`}
                className="mt-3 inline-flex w-fit rounded-xl bg-accent px-4 py-2 text-sm font-bold hover:bg-rose-600"
              >
                Ver cupones
              </Link>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
