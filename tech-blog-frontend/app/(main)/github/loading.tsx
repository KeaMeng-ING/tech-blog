export default function GithubLoading() {
  return (
    <div className="px-10 md:px-16 py-10 animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[420px] md:h-[520px] rounded-2xl bg-white/5 mb-12" />
      {/* Grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 h-[260px]" />
        ))}
      </div>
    </div>
  )
}
