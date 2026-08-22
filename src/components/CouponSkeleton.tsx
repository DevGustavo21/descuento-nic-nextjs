export function CouponSkeleton() {
  return (
    <article className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="h-3 w-40 rounded bg-slate-100" />
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-9 w-24 rounded-xl bg-amber-100" />
      </div>
      <div className="mt-auto space-y-3 border-t border-line px-5 py-4">
        <div className="h-4 w-36 rounded bg-slate-100" />
        <div className="h-10 w-full rounded-xl bg-slate-200" />
      </div>
    </article>
  );
}
