export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white animate-pulse">
      {/* Hero skeleton */}
      <section className="grid md:grid-cols-[1.4fr_1fr] gap-12 px-12 md:px-20 py-16">
        <div className="w-full h-[400px] rounded-2xl bg-white/5" />
        <div className="flex flex-col gap-4 justify-center">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-12 w-3/4 rounded bg-white/10" />
          <div className="h-12 w-1/2 rounded bg-white/10" />
          <div className="h-20 w-full rounded bg-white/10" />
          <div className="flex gap-4 mt-2">
            <div className="h-12 w-32 rounded-full bg-white/10" />
            <div className="h-12 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Trending repos skeleton */}
      <section className="px-10 md:px-20 py-20">
        <div className="h-8 w-64 rounded bg-white/10 mb-3" />
        <div className="h-4 w-40 rounded bg-white/5 mb-12" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-white/5 h-[340px]" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 h-[200px]" />
            ))}
          </div>
        </div>
      </section>

      {/* News skeleton */}
      <section className="px-10 md:px-16 mt-20">
        <div className="h-8 w-48 rounded bg-white/10 mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 h-[320px]" />
          ))}
        </div>
      </section>
    </main>
  )
}
