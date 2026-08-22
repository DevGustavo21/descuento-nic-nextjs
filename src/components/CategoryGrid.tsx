import Link from "next/link";
import { categoryIcon } from "@/lib/icons";
import type { CategoryItem } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-2 pt-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Explorá</p>
          <h2 className="font-display text-xl font-extrabold">Categorías</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = categoryIcon(cat.icon);
          return (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-accent hover:text-accent"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="h-4 w-4" />
              </span>
              {cat.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
