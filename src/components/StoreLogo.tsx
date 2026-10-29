"use client";

import { useEffect, useMemo, useState } from "react";

const COLORS = [
  "#E11D48",
  "#2563EB",
  "#0F766E",
  "#C2410C",
  "#7C3AED",
  "#B45309",
  "#0369A1",
  "#BE123C",
  "#15803D",
  "#1D4ED8",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((part) => part.replace(/[^\p{L}]/gu, "").charAt(0).toUpperCase()).join("");
  return letters || "DN";
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % COLORS.length;
  return COLORS[hash] ?? COLORS[0];
}

export function StoreLogo({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const label = useMemo(() => initials(name), [name]);
  const bg = useMemo(() => colorFor(name), [name]);
  const box =
    size === "lg"
      ? "h-14 w-14 rounded-2xl text-lg"
      : size === "sm"
        ? "h-9 w-9 rounded-xl text-xs"
        : "h-14 w-14 rounded-2xl text-base";

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        key={src}
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`${box} shrink-0 bg-white object-cover ring-1 ring-line`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`${box} inline-flex shrink-0 items-center justify-center font-display font-extrabold text-white ring-1 ring-line`}
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
