export default function NewsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10 mb-6" />
      <div className="h-10 w-3/4 rounded bg-white/10 mb-4" />
      <div className="h-4 w-48 rounded bg-white/5 mb-8" />
      <div className="w-full h-[400px] rounded-2xl bg-white/5 mb-8" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 w-full rounded bg-white/5 mb-3" />
      ))}
    </div>
  )
}
