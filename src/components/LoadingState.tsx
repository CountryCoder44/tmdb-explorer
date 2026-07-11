export function LoadingState() {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-24 text-neutral-400">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-amber-300" />
      <p>Loading movies…</p>
    </div>
  )
}
