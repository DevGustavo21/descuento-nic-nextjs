import { BadgeCheck, Building2, Mail, Ticket } from "lucide-react";
import { NEGOCIO_URL } from "@/lib/types";

const STEPS = [
  {
    icon: Building2,
    title: "Creá tu cuenta",
    text: "Ingresá tu nombre, el negocio que representás, teléfono y un correo corporativo (@tuempresa.com).",
  },
  {
    icon: Mail,
    title: "Verificá el correo",
    text: "Te enviamos un enlace de confirmación. Sin verificar, no se publica ningún cupón.",
  },
  {
    icon: BadgeCheck,
    title: "Esperá la aprobación",
    text: "Revisamos que el negocio sea real. Cuando quede aprobado, ya podés operar en el panel.",
  },
  {
    icon: Ticket,
    title: "Publicá tus cupones",
    text: "Definí título, descuento, vencimiento y canjes. El código lo genera DescuentoNic.",
  },
];

export function RegisterProcess() {
  return (
    <section id="registrar-negocio" className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Negocios</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
          Proceso para registrar mi negocio en DescuentoNic
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Solo comercios verificados publican cupones. Así protegemos a los clientes y la marca de cada negocio.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <article key={step.title} className="rounded-3xl border border-line bg-canvas p-5">
              <span className="font-display text-sm font-bold text-accent">0{i + 1}</span>
              <step.icon className="mt-3 h-6 w-6 text-navy" strokeWidth={1.75} />
              <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </article>
          ))}
        </div>
        <a
          href={`${NEGOCIO_URL}/register`}
          className="mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-display text-sm font-bold text-white hover:bg-rose-600"
        >
          Registrar mi negocio
        </a>
      </div>
    </section>
  );
}
