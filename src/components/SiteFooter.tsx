import Link from "next/link";
import { NEGOCIO_URL, type CategoryItem } from "@/lib/types";

export function SiteFooter({ categories }: { categories: CategoryItem[] }) {
  return (
    <footer className="mt-auto bg-slate-950 text-sm text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-extrabold text-white">
            Descuento<span className="text-rose-400">Nic</span>
          </p>
          <p className="mt-3 leading-relaxed">
            Directorio de cupones de negocios verificados en Nicaragua. Encontrá descuentos cerca de vos y canjealos en tienda, delivery o WhatsApp.
          </p>
        </div>
        <div>
          <p className="font-display font-bold text-white">Categorías</p>
          <ul className="mt-3 space-y-2">
            {categories.slice(0, 7).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/categoria/${cat.slug}`} className="hover:text-white">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-white">Negocios</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/favoritos" className="hover:text-white">
                Favoritos
              </Link>
            </li>
            <li>
              <a href={`${NEGOCIO_URL}/register`} className="hover:text-white">
                Registrar negocio
              </a>
            </li>
            <li>
              <a href={`${NEGOCIO_URL}/login`} className="hover:text-white">
                Iniciar sesión
              </a>
            </li>
            <li>
              <a href="#registrar-negocio" className="hover:text-white">
                Cómo funciona el registro
              </a>
            </li>
            <li>
              <a href={`${NEGOCIO_URL}/register`} className="hover:text-white">
                Publicidad en banners
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-white">Contacto</p>
          <ul className="mt-3 space-y-2">
            <li>Managua, Nicaragua</li>
            <li>
              <a href="mailto:hola@descuentonic.com" className="hover:text-white">
                hola@descuentonic.com
              </a>
            </li>
            <li>Lunes a sábado, 8:00 a 18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/45">
          <span>© {new Date().getFullYear()} DescuentoNic. Todos los derechos reservados.</span>
          <span>Cupones sujetos a vigencia y disponibilidad de cada negocio.</span>
        </div>
      </div>
    </footer>
  );
}
