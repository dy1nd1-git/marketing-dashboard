/**
 * Top page loading skeleton — shown by Next.js while fetchDashboardData resolves.
 * Matches the exact layout of the real page to prevent layout shift on reveal.
 */
export default function TopLoading() {
  return (
    <main className="p-xl max-w-[1400px] animate-pulse">
      {/* Header skeleton */}
      <section className="flex justify-between items-center pb-4 border-b border-outline-variant/20 mb-xl">
        <div className="space-y-2">
          <div className="h-9 w-32 bg-surface-container-high rounded-xl" />
          <div className="h-4 w-64 bg-surface-container rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-40 bg-surface-container-high rounded-full" />
          <div className="h-10 w-28 bg-surface-container-high rounded-full" />
        </div>
      </section>

      {/* KPI cards skeleton — 4列 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card-professional flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex justify-between items-start mb-lg">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high" />
              <div className="h-8 w-20 rounded-full bg-surface-container-high" />
            </div>
            <div className="mb-md space-y-2">
              <div className="h-3 w-24 rounded bg-surface-container" />
              <div className="h-8 w-32 rounded-lg bg-surface-container-high" />
            </div>
            <div className="h-16 w-full rounded-xl bg-surface-container" />
          </div>
        ))}
      </section>

      {/* Funnel + AI section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-xl">
        <div className="lg:col-span-4 card-professional min-h-[300px] bg-surface-container-low rounded-3xl" />
        <div className="lg:col-span-8 card-professional min-h-[300px] bg-surface-container-low rounded-3xl" />
      </div>

      {/* Channel table skeleton */}
      <div className="card-professional min-h-[200px] bg-surface-container-low rounded-3xl" />
    </main>
  );
}
