import { useEffect, useState } from 'react'
import { discoverMovies } from '../api/tmdb'
import type { Movie, MovieFilters } from '../types/tmdb'

interface UseMoviesResult {
  movies: Movie[]
  loading: boolean
  error: string | null
}

// With multiple adjustable controls (year inputs, a rating slider) instead of
// one discrete <select>, rapid intermediate changes would otherwise fire a
// request per keystroke/drag-tick — debounce the fetch itself so the
// controls stay instantly responsive while the network call waits for input
// to settle.
const DEBOUNCE_MS = 400

export function useMovies(filters: MovieFilters): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // `filters` is a new object reference every render, so it can't be a
  // dependency directly (would refetch on every render). This key captures
  // the same information as primitives — the effect only re-runs when it
  // actually changes, and `filters` read inside always matches whichever
  // render produced the current key.
  const filterKey = `${filters.genreIds.join(',')}|${filters.yearFrom}|${filters.yearTo}|${filters.minRating}`

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const timeoutId = window.setTimeout(() => {
      discoverMovies(filters, controller.signal)
        .then((data) => setMovies(data.results))
        .catch((err: unknown) => {
          // A newer filter change aborts the in-flight (or not-yet-fired)
          // request for the old one — expected, not a real error.
          if (err instanceof DOMException && err.name === 'AbortError') return
          setError(err instanceof Error ? err.message : 'Failed to load movies')
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
    // filterKey is the intentional dependency in place of `filters` itself — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  return { movies, loading, error }
}
