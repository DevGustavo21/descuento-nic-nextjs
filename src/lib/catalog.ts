import { FALLBACK_COUPONS, FALLBACK_FILTERS } from "@/lib/fallback";
import { API_URL, type Coupon, type FiltersPayload } from "@/lib/types";

export async function loadCatalog(category?: string) {
  const params = new URLSearchParams({ per_page: "48" });
  if (category) params.set("category", category);

  try {
    const [couponsRes, filtersRes] = await Promise.all([
      fetch(`${API_URL}/coupons?${params}`, { next: { revalidate: 30 } }),
      fetch(`${API_URL}/filters`, { next: { revalidate: 120 } }),
    ]);

    if (!couponsRes.ok || !filtersRes.ok) {
      throw new Error("API unavailable");
    }

    const couponsJson = await couponsRes.json();
    const filters = (await filtersRes.json()) as FiltersPayload;
    const coupons = (couponsJson.data ?? couponsJson) as Coupon[];

    return { coupons, filters };
  } catch {
    const coupons = category
      ? FALLBACK_COUPONS.filter((c) => c.category_slug === category)
      : FALLBACK_COUPONS;
    return { coupons, filters: FALLBACK_FILTERS };
  }
}
