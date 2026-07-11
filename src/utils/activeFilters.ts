import type { MovieFilters } from '../types/tmdb'

export interface ActiveFilterDescriptor {
  key: string
  label: string
  clear: (filters: MovieFilters) => MovieFilters
}

// Shared between the "Filters" toggle button's count badge and the removable
// chips row, so "what counts as an active filter" is defined once, not
// duplicated between the two places that need to enumerate them.
export function getActiveFilters(filters: MovieFilters, genresById: Record<number, string>): ActiveFilterDescriptor[] {
  const active: ActiveFilterDescriptor[] = []

  for (const genreId of filters.genreIds) {
    const name = genresById[genreId]
    if (!name) continue
    active.push({
      key: `genre-${genreId}`,
      label: name,
      clear: (f) => ({ ...f, genreIds: f.genreIds.filter((id) => id !== genreId) }),
    })
  }

  if (filters.yearFrom !== null || filters.yearTo !== null) {
    const label =
      filters.yearFrom !== null && filters.yearTo !== null
        ? `${filters.yearFrom}–${filters.yearTo}`
        : filters.yearFrom !== null
          ? `${filters.yearFrom}+`
          : `Up to ${filters.yearTo}`
    active.push({
      key: 'year',
      label,
      clear: (f) => ({ ...f, yearFrom: null, yearTo: null }),
    })
  }

  if (filters.minRating !== null && filters.minRating > 0) {
    active.push({
      key: 'rating',
      label: `${filters.minRating.toFixed(1)}+ ★`,
      clear: (f) => ({ ...f, minRating: null }),
    })
  }

  return active
}
