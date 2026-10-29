import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import { FavoritesProvider } from "@/lib/favorites";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DescuentoNic — Cupones en Nicaragua",
  description:
    "Encontrá códigos de descuento de restaurantes, farmacias, ferreterías y más negocios en Nicaragua.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-ink">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
