"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { CompactMultiSelect, CompactSingleSelect } from "@/components/CompactSelect";
import type { FiltersPayload } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  filters: FiltersPayload;
  resultCount: number;
  selectedCategories: string[];
  onCategories: (next: string[]) => void;
  departments: string[];
  onDepartments: (next: string[]) => void;
  minDiscount: number;
  onMinDiscount: (next: number) => void;
  channels: string[];
  onChannels: (next: string[]) => void;
  payments: string[];
  onPayments: (next: string[]) => void;
  vigencia: string;
  onVigencia: (next: string) => void;
  hideCategories?: boolean;
};

export function FilterSheet({
  open,
  onClose,
  filters,
  resultCount,
  selectedCategories,
  onCategories,
  departments,
  onDepartments,
  minDiscount,
  onMinDiscount,
  channels,
  onChannels,
  payments,
  onPayments,
  vigencia,
  onVigencia,
  hideCategories,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="lg:hidden">
      <button
        type="button"
        className="fixed inset-0 z-[80] bg-slate-900/45"
        aria-label="Cerrar filtros"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[90dvh] flex-col rounded-t-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="font-display text-lg font-extrabold">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {!hideCategories ? (
            <CompactMultiSelect
              label="Categorías"
              emptyLabel="Todas"
              selected={selectedCategories}
              onChange={onCategories}
              options={filters.categories.map((c) => ({ value: c.slug, label: c.name }))}
            />
          ) : null}
          <CompactMultiSelect
            label="Ciudad / departamento"
            emptyLabel="Todas"
            selected={departments}
            onChange={onDepartments}
            options={filters.departments.map((d) => ({ value: d, label: d }))}
          />
          <CompactSingleSelect
            label="Descuento mínimo"
            value={String(minDiscount)}
            onChange={(v) => onMinDiscount(Number(v))}
            options={[
              { value: "0", label: "Cualquiera" },
              { value: "10", label: "10%+ o en C$" },
              { value: "20", label: "20%+ o en C$" },
              { value: "30", label: "30%+ o en C$" },
              { value: "50", label: "50%+ o en C$" },
            ]}
          />
          <CompactMultiSelect
            label="Canal de venta"
            emptyLabel="Todos"
            selected={channels}
            onChange={onChannels}
            options={Object.entries(filters.channels).map(([value, label]) => ({ value, label }))}
          />
          <CompactSingleSelect
            label="Vigencia"
            value={vigencia}
            onChange={onVigencia}
            options={[
              { value: "all", label: "Todos" },
              { value: "hot", label: "Populares" },
              { value: "new", label: "Nuevos" },
              { value: "expires", label: "Por vencer" },
            ]}
          />
          <CompactMultiSelect
            label="Medio de pago"
            emptyLabel="Todos"
            selected={payments}
            onChange={onPayments}
            options={Object.entries(filters.payment_methods).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-accent py-3.5 font-display text-sm font-bold text-white"
          >
            Ver {resultCount} {resultCount === 1 ? "cupón" : "cupones"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
