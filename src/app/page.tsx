import { Catalog } from "@/components/Catalog";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { PromoBanners } from "@/components/PromoBanners";
import { RegisterProcess } from "@/components/RegisterProcess";
import { SiteFooter } from "@/components/SiteFooter";
import { loadCatalog } from "@/lib/catalog";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cupon?: string }>;
}) {
  const { coupons, filters } = await loadCatalog();
  const { cupon } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <p className="bg-navy px-4 py-2 text-center text-xs font-medium text-white">
        Cupones vigentes de negocios verificados en Nicaragua
      </p>
      <Catalog initialCoupons={coupons} filters={filters} initialCode={cupon}>
        <PromoBanners />
      </Catalog>
      <CategoryShowcase categories={filters.categories} />
      <RegisterProcess />
      <SiteFooter categories={filters.categories} />
    </div>
  );
}
