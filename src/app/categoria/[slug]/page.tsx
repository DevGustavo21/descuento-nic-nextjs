import Link from "next/link";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { SiteFooter } from "@/components/SiteFooter";
import { loadCatalog } from "@/lib/catalog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { coupons, filters } = await loadCatalog(slug);
  const category = filters.categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <p className="bg-navy px-4 py-2 text-center text-xs font-medium text-white">
        Cupones vigentes de negocios verificados en Nicaragua
      </p>
      <div className="mx-auto w-full max-w-7xl px-4 pt-6">
        <Link href="/" className="text-sm font-medium text-navy hover:text-accent">
          ← Todas las categorías
        </Link>
      </div>
      <Catalog
        initialCoupons={coupons}
        filters={filters}
        lockedCategory={slug}
        heading={category.name}
      />
      <SiteFooter categories={filters.categories} />
    </div>
  );
}
