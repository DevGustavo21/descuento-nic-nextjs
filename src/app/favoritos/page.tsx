import { FavoritesPage } from "@/components/FavoritesPage";
import { SiteFooter } from "@/components/SiteFooter";
import { loadCatalog } from "@/lib/catalog";

export default async function FavoritosRoute() {
  const { coupons, filters } = await loadCatalog();

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <p className="bg-navy px-4 py-2 text-center text-xs font-medium text-white">
        Cupones vigentes de negocios verificados en Nicaragua
      </p>
      <div className="flex flex-1 flex-col">
        <FavoritesPage coupons={coupons} filters={filters} />
      </div>
      <SiteFooter categories={filters.categories} />
    </div>
  );
}
