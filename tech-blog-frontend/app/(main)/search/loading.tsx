export default function SearchLoading() {
  return (
    <div className="px-10 md:px-16 py-10 animate-pulse">
      <div className="h-8 w-48 rounded bg-white/10 mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 h-[300px]" />
        ))}
      </div>
    </div>
  )
}
