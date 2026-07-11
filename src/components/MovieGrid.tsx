import type { LayoutMode, Movie } from '../types/tmdb'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  genresById: Record<number, string>
  layout: LayoutMode
  onSelect: (movie: Movie) => void
}

export function MovieGrid({ movies, genresById, layout, onSelect }: MovieGridProps) {
  const className =
    layout === 'grid'
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      : 'flex flex-col gap-3'

  return (
    <ul className={className}>
      {movies.map((movie) => (
        // Keying on layout too, not just movie.id, is deliberate: grid and line
        // cards are structurally different DOM trees (portrait card vs. horizontal
        // row), so trying to FLIP-morph one into the other produced the confused,
        // stuttery reflow. Keying by layout forces a clean unmount/remount instead,
        // which plays the card's normal entrance (fade + slide) rather than a morph.
        <MovieCard key={`${movie.id}-${layout}`} movie={movie} genresById={genresById} layout={layout} onSelect={onSelect} />
      ))}
    </ul>
  )
}
