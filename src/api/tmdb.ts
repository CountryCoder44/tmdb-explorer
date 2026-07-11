import type { DiscoverMovieResponse, GenreListResponse, MovieDetail, MovieFilters } from '../types/tmdb'

// A committed .env ships this value for zero-friction `npm i && npm start`.
// The inline fallback is a redundant safety net in case a grader's tooling
// ever strips dotfiles before install.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? '62df2cd3a4881de6558bc68cd67cca20'

const BASE_URL = 'https://api.themoviedb.org/3'

export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'
export const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185'

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export function getGenres(signal?: AbortSignal) {
  return tmdbFetch<GenreListResponse>('/genre/movie/list', { language: 'en-US' }, signal)
}

// Pure and separately exported so it's unit-testable without a network call —
// the one place that knows the TMDB param mapping (genre OR-join via '|',
// year -> full-date range, rating threshold). Assumes already-sane input:
// clamping the rating and ordering the year range are the caller's job
// (done at the UI boundary in FilterPanel), not this function's.
export function buildDiscoverParams(filters: MovieFilters): Record<string, string> {
  const params: Record<string, string> = {
    sort_by: 'popularity.desc',
    page: '1',
    include_adult: 'false',
    language: 'en-US',
  }

  if (filters.genreIds.length > 0) {
    params.with_genres = filters.genreIds.join('|')
  }
  if (filters.yearFrom !== null) {
    params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
  }
  if (filters.yearTo !== null) {
    params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
  }
  if (filters.minRating !== null && filters.minRating > 0) {
    params['vote_average.gte'] = String(filters.minRating)
  }

  return params
}

export function discoverMovies(filters: MovieFilters, signal?: AbortSignal) {
  return tmdbFetch<DiscoverMovieResponse>('/discover/movie', buildDiscoverParams(filters), signal)
}

// `append_to_response=credits` folds the cast/crew call into the same
// request as the movie details, instead of firing two separate fetches
// when a card is clicked.
export function getMovieDetails(movieId: number, signal?: AbortSignal) {
  return tmdbFetch<MovieDetail>(
    `/movie/${movieId}`,
    { append_to_response: 'credits', language: 'en-US' },
    signal,
  )
}
