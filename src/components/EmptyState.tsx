export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-24 text-center text-neutral-400">
      <p className="text-lg font-semibold text-neutral-200">No movies found</p>
      <p className="text-sm">Try adjusting your filters.</p>
    </div>
  )
}
