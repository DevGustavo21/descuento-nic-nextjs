"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

type Props = {
  couponId: number;
  label?: string;
  className?: string;
  size?: "sm" | "md";
};

export function FavoriteButton({
  couponId,
  label = "cupón",
  className = "",
  size = "md",
}: Props) {
  const { isFavorite, toggleFavorite, ready } = useFavorites();
  const active = ready && isFavorite(couponId);
  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon = size === "sm" ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]";

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(couponId);
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar ${label} de favoritos` : `Agregar ${label} a favoritos`}
      className={`grid ${box} shrink-0 place-items-center rounded-full border transition ${
        active
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-line bg-white text-muted hover:border-accent/40 hover:text-accent"
      } ${className}`}
    >
      <Heart className={icon} fill={active ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  );
}
