"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CompactMultiSelect({
  label,
  options,
  selected,
  onChange,
  emptyLabel = "Todos",
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const summary =
    selected.length === 0
      ? emptyLabel
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? "1"
        : `${selected.length} seleccionados`;

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <div className="border-b border-line py-3">
      <p className="mb-2 text-sm font-bold text-ink">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-100 px-3 text-sm font-medium text-ink"
      >
        <span className="truncate">{summary}</span>
        <ChevronDown className={`h-4 w-4 text-muted ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-2 max-h-48 overflow-auto rounded-xl bg-slate-50 p-2">
          <button
            type="button"
            className="mb-1 w-full rounded-lg px-2 py-1.5 text-left text-sm text-muted"
            onClick={() => onChange([])}
          >
            Limpiar
          </button>
          {options.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="accent-[var(--accent)]"
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CompactSingleSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? options[0]?.label;

  return (
    <div className="border-b border-line py-3">
      <p className="mb-2 text-sm font-bold text-ink">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-100 px-3 text-sm font-medium text-ink"
      >
        <span className="truncate">{current}</span>
        <ChevronDown className={`h-4 w-4 text-muted ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-2 overflow-hidden rounded-xl bg-slate-50 p-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                option.value === value ? "bg-accent-soft font-semibold text-accent" : "text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
