export function CouponSkeleton({ dense = false }: { dense?: boolean }) {
  return (
    <article
      className={`flex animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-white ${
        dense ? "p-3 sm:p-4" : "p-4"
      }`}
    >
      <div className={`flex items-center ${dense ? "gap-2" : "gap-3"}`}>
        <div className={`shrink-0 rounded-2xl bg-slate-200 ${dense ? "h-9 w-9" : "h-14 w-14"}`} />
        <div className="flex-1 space-y-2">
          <div className={`rounded bg-slate-200 ${dense ? "h-2.5 w-16" : "h-3 w-28"}`} />
          <div className={`rounded bg-slate-100 ${dense ? "h-2 w-12" : "h-3 w-20"}`} />
        </div>
      </div>
      <div className={`space-y-2 ${dense ? "mt-3" : "mt-4"}`}>
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className={`mt-auto flex items-end justify-between ${dense ? "mt-3" : "mt-4"}`}>
        <div className={`rounded-lg bg-rose-100 ${dense ? "h-6 w-14" : "h-8 w-20"}`} />
        <div className="h-3 w-12 rounded bg-slate-100" />
      </div>
      <div className={`w-full rounded-xl bg-slate-200 ${dense ? "mt-3 h-9" : "mt-5 h-10"}`} />
    </article>
  );
}
