export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  overview: string
  vote_average: number
  release_date: string
  genre_ids: number[]
  popularity: number
}

export interface DiscoverMovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface GenreListResponse {
  genres: Genre[]
}

export type SortProperty = 'vote_average' | 'title' | 'release_date' | 'popularity'
export type SortDirection = 'asc' | 'desc'
export type LayoutMode = 'grid' | 'line'

// genreIds is OR'd via '|' in with_genres ([] = no genre filter); yearFrom/yearTo
// map to primary_release_date.gte/.lte; minRating maps to vote_average.gte, with
// 0 treated as "no minimum" rather than being sent as an explicit filter.
export interface MovieFilters {
  genreIds: number[]
  yearFrom: number | null
  yearTo: number | null
  minRating: number | null
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

// The `/movie/{id}?append_to_response=credits` response, trimmed to only the
// fields the detail overlay actually reads. It deliberately re-fetches
// title/poster/overview/rating/genres too, but the overlay renders those from
// the `Movie` summary already in hand instead (render what's already fetched
// immediately, stream in the rest) — so they're left out here rather than
// typed and never read.
export interface MovieDetail {
  runtime: number | null
  tagline: string | null
  credits: {
    cast: CastMember[]
  }
}
