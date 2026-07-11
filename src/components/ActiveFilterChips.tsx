import type { MovieFilters } from '../types/tmdb'
import { getActiveFilters } from '../utils/activeFilters'

interface ActiveFilterChipsProps {
  filters: MovieFilters
  genresById: Record<number, string>
  onChange: (filters: MovieFilters) => void
}

// Shown regardless of whether the Filters panel is expanded, so what's
// actually being applied is visible without reopening it.
export function ActiveFilterChips({ filters, genresById, onChange }: ActiveFilterChipsProps) {
  const active = getActiveFilters(filters, genresById)

  if (active.length === 0) return null

  return (
    <ul className="mb-6 flex flex-wrap gap-2">
      {active.map((filter) => (
        <li key={filter.key}>
          <button
            type="button"
            onClick={() => onChange(filter.clear(filters))}
            className="flex items-center gap-1.5 rounded-full bg-amber-300/15 px-3 py-1 text-xs text-amber-200 transition-colors duration-150 hover:bg-amber-300/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            {filter.label}
            <span aria-hidden="true">×</span>
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
