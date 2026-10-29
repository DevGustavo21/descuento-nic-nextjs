"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "descuentonic.favorites.coupons.v2";

type FavoritesContextValue = {
  favoriteIds: number[];
  ids: Set<number>;
  ready: boolean;
  isFavorite: (couponId: number) => boolean;
  toggleFavorite: (couponId: number) => void;
  removeFavorite: (couponId: number) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "number" ? item : Number((item as { id?: number })?.id)))
      .filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavoriteIds(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds, ready]);

  const ids = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback((couponId: number) => ids.has(couponId), [ids]);

  const toggleFavorite = useCallback((couponId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(couponId) ? prev.filter((id) => id !== couponId) : [couponId, ...prev],
    );
  }, []);

  const removeFavorite = useCallback((couponId: number) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== couponId));
  }, []);

  const clearFavorites = useCallback(() => setFavoriteIds([]), []);

  const value = useMemo(
    () => ({
      favoriteIds,
      ids,
      ready,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [favoriteIds, ids, ready, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      <div className="flex min-h-dvh flex-1 flex-col">{children}</div>
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
