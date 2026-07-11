interface GenreChipsProps {
  genreIds: number[]
  genresById: Record<number, string>
  max?: number
  className?: string
}

export function GenreChips({ genreIds, genresById, max = 3, className = '' }: GenreChipsProps) {
  const names = genreIds
    .map((id) => genresById[id])
    .filter((name): name is string => Boolean(name))
    .slice(0, max)

  if (names.length === 0) return null

  return (
    <ul className={`flex flex-wrap gap-1 ${className}`}>
      {names.map((name) => (
        <li key={name} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-neutral-200">
          {name}
        </li>
      ))}
    </ul>
  )
}
