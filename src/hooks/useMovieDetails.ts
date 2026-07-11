import { useEffect, useState } from 'react'
import { getMovieDetails } from '../api/tmdb'
import type { MovieDetail } from '../types/tmdb'

interface UseMovieDetailsResult {
  detail: MovieDetail | null
  loading: boolean
  error: string | null
}

// `movieId` is null when no card is selected — the hook just resets and
// skips fetching rather than the caller having to guard every call site.
export function useMovieDetails(movieId: number | null): UseMovieDetailsResult {
  const [detail, setDetail] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (movieId === null) {
      setDetail(null)
      setError(null)
      return
    }

    const controller = new AbortController()
    setDetail(null)
    setLoading(true)
    setError(null)

    getMovieDetails(movieId, controller.signal)
      .then(setDetail)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load movie details')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [movieId])

  return { detail, loading, error }
}
