import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useGenres } from './hooks/useGenres'
import { useMovies } from './hooks/useMovies'
import { sortMovies } from './utils/sortMovies'
import { FilterPanel } from './components/FilterPanel'
import { ActiveFilterChips } from './components/ActiveFilterChips'
import { SortControl } from './components/SortControl'
import { LayoutToggle } from './components/LayoutToggle'
import { MovieGrid } from './components/MovieGrid'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'
import { EmptyState } from './components/EmptyState'
import { AnimatedBackground } from './components/AnimatedBackground'
import { MovieDetailOverlay } from './components/MovieDetailOverlay'
import type { LayoutMode, Movie, MovieFilters, SortDirection, SortProperty } from './types/tmdb'

// No genre/year/rating pre-selected — the app opens showing the broadest
// popularity-ranked results, and the Filters panel is how you narrow down
// from there, rather than starting narrowed and having to clear a default.
const DEFAULT_FILTERS: MovieFilters = { genreIds: [], yearFrom: null, yearTo: null, minRating: null }

function App() {
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS)
  const [sortProperty, setSortProperty] = useState<SortProperty>('vote_average')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [layout, setLayout] = useState<LayoutMode>('grid')
  // Holds the full movie object rather than just an id, so the open detail
  // overlay keeps working off the data it was opened with even if a filter
  // or sort change makes the movie drop out of the current list underneath it.
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const { genres, genresById } = useGenres()
  const { movies, loading, error } = useMovies(filters)

  const sortedMovies = useMemo(
    () => sortMovies(movies, sortProperty, sortDirection),
    [movies, sortProperty, sortDirection],
  )

  return (
    <div className="min-h-screen text-neutral-50">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-bold">TMDB Explorer</h1>
          <p className="text-neutral-400">Browse movies from The Movie Database, filtered and sorted your way.</p>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
          <FilterPanel genres={genres} filters={filters} genresById={genresById} onChange={setFilters} />
          <SortControl
            property={sortProperty}
            direction={sortDirection}
            onPropertyChange={setSortProperty}
            onDirectionChange={setSortDirection}
          />
          <LayoutToggle layout={layout} onChange={setLayout} />
        </div>

        <ActiveFilterChips filters={filters} genresById={genresById} onChange={setFilters} />

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && sortedMovies.length === 0 && <EmptyState />}
        {!loading && !error && sortedMovies.length > 0 && (
          <MovieGrid movies={sortedMovies} genresById={genresById} layout={layout} onSelect={setSelectedMovie} />
        )}
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailOverlay
            key="movie-detail"
            movie={selectedMovie}
            genresById={genresById}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
