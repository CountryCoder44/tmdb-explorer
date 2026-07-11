import type { Movie, SortDirection, SortProperty } from '../types/tmdb'

// Direction is applied inside the comparator (rather than sorting ascending
// then reversing the array) so that special cases like "undated movies sort
// last" can be pinned regardless of direction, instead of flipping to "first"
// whenever descending order reverses the whole result.
function compareValues(a: Movie, b: Movie, property: SortProperty, direction: SortDirection): number {
  const sign = direction === 'asc' ? 1 : -1

  if (property === 'title') {
    return sign * a.title.localeCompare(b.title)
  }

  if (property === 'release_date') {
    // TMDB returns "" (not null) for undated entries.
    if (a.release_date === '' && b.release_date === '') return 0
    if (a.release_date === '') return 1
    if (b.release_date === '') return -1
    return sign * a.release_date.localeCompare(b.release_date)
  }

  return sign * (a[property] - b[property])
}

export function sortMovies(movies: Movie[], property: SortProperty, direction: SortDirection): Movie[] {
  return [...movies].sort((a, b) => compareValues(a, b, property, direction))
}
