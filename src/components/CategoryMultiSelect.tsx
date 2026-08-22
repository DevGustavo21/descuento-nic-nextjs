"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryItem } from "@/lib/types";

export function CategoryMultiSelect({
  categories,
  selected,
  onChange,
}: {
  categories: CategoryItem[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const label =
    selected.length === 0
      ? "Todas"
      : selected.length === 1
        ? categories.find((c) => c.slug === selected[0])?.name ?? "1 categoría"
        : `${selected.length} categorías`;

  function toggle(slug: string) {
    onChange(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  }

  return (
    <label className="flex min-w-[180px] flex-col gap-1 text-xs font-semibold text-muted">
      Categorías
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-full min-w-[200px] items-center justify-between gap-2 rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink"
        >
          <span className="truncate">{label}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-20 cursor-default"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 z-30 mt-1 max-h-72 w-64 overflow-auto rounded-xl border border-line bg-white p-2 shadow-xl">
              <button
                type="button"
                className="mb-1 w-full rounded-lg px-2 py-1.5 text-left text-sm text-muted hover:bg-canvas"
                onClick={() => onChange([])}
              >
                Limpiar selección
              </button>
              {categories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-canvas"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(cat.slug)}
                    onChange={() => toggle(cat.slug)}
                    className="accent-[var(--accent)]"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </label>
  );
}
