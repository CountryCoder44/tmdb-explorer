import { useEffect, useState } from 'react'
import { getGenres } from '../api/tmdb'
import type { Genre } from '../types/tmdb'

interface UseGenresResult {
  genres: Genre[]
  genresById: Record<number, string>
  loading: boolean
  error: string | null
}

export function useGenres(): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    getGenres(controller.signal)
      .then((data) => setGenres(data.genres))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load genres')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const genresById = Object.fromEntries(genres.map((g) => [g.id, g.name]))

  return { genres, genresById, loading, error }
}
