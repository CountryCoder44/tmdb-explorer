import type { KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { LayoutMode, Movie } from '../types/tmdb'
import { PosterImage } from './PosterImage'
import { RatingBadge } from './RatingBadge'
import { GenreChips } from './GenreChips'

interface MovieCardProps {
  movie: Movie
  genresById: Record<number, string>
  layout: LayoutMode
  onSelect: (movie: Movie) => void
}

const releaseYear = (releaseDate: string) => (releaseDate ? releaseDate.slice(0, 4) : 'TBA')

export function MovieCard({ movie, genresById, layout, onSelect }: MovieCardProps) {
  const reduceMotion = useReducedMotion()

  // The card is an <li>, not a <button>, so Enter/Space need to be wired
  // manually to open the detail overlay for keyboard users the same way a
  // click does — native elements get this for free, custom ones don't.
  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(movie)
    }
  }

  // `layout` drives the grid<->line reflow (a brief, functional transition,
  // kept even under reduced motion). The scroll-triggered entrance below is
  // ambient/decorative, so it's the one we skip for reduced-motion users.
  const entrance = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      }

  if (layout === 'line') {
    return (
      <motion.li
        layout
        transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.35 }, y: { duration: 0.35 } }}
        {...entrance}
        className="group flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors duration-200 hover:bg-white/10 focus-within:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        onClick={() => onSelect(movie)}
        onKeyDown={handleKeyDown}
      >
        <PosterImage posterPath={movie.poster_path} title={movie.title} layout={layout} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-neutral-50">{movie.title}</h3>
            <RatingBadge voteAverage={movie.vote_average} className="flex-shrink-0" />
          </div>
          <p className="text-xs text-neutral-400">{releaseYear(movie.release_date)}</p>
          <GenreChips genreIds={movie.genre_ids} genresById={genresById} />
          <p className="mt-1 line-clamp-2 text-sm text-neutral-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            {movie.overview || 'No overview available.'}
          </p>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li
      layout
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.35 }, y: { duration: 0.35 } }}
      {...entrance}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      onClick={() => onSelect(movie)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <PosterImage posterPath={movie.poster_path} title={movie.title} layout={layout} />
        <RatingBadge voteAverage={movie.vote_average} className="absolute top-2 right-2" />

        <div className="absolute inset-0 flex translate-y-full flex-col justify-end gap-2 bg-gradient-to-t from-black/95 via-black/70 to-black/10 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <p className="line-clamp-5 text-xs text-neutral-100">{movie.overview || 'No overview available.'}</p>
          <GenreChips genreIds={movie.genre_ids} genresById={genresById} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate font-semibold text-neutral-50">{movie.title}</h3>
        <p className="text-xs text-neutral-400">{releaseYear(movie.release_date)}</p>
      </div>
    </motion.li>
  )
}
