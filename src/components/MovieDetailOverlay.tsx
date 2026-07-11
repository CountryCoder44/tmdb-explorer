import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { POSTER_BASE_URL, PROFILE_BASE_URL } from '../api/tmdb'
import { GenreChips } from './GenreChips'
import type { Movie } from '../types/tmdb'

interface MovieDetailOverlayProps {
  movie: Movie
  genresById: Record<number, string>
  onClose: () => void
}

const releaseYear = (releaseDate: string) => (releaseDate ? releaseDate.slice(0, 4) : 'TBA')

const formatRuntime = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`

// Poster + title/rating/overview render immediately from the `movie` summary
// already in hand from the grid — cast, runtime, and tagline are the only
// pieces waiting on the extra `/movie/{id}` fetch, so the modal never shows
// a blank loading state, only a small "more details" gap that fills in.
export function MovieDetailOverlay({ movie, genresById, onClose }: MovieDetailOverlayProps) {
  const { detail, loading, error } = useMovieDetails(movie.id)
  const reduceMotion = useReducedMotion()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const cast = detail?.credits.cast.slice(0, 8) ?? []

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-detail-title"
    >
      <motion.div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 sm:flex-row"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div
          className="flex-shrink-0 sm:w-64"
          initial={reduceMotion ? undefined : { x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut', delay: reduceMotion ? 0 : 0.1 }}
        >
          {movie.poster_path ? (
            <img
              src={`${POSTER_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="h-64 w-full object-cover sm:h-full"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-neutral-800 text-sm text-neutral-400 sm:h-full">
              No poster available
            </div>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="self-end rounded-full px-2 py-1 text-sm text-neutral-400 hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            aria-label="Close movie details"
          >
            ✕
          </button>

          <h2 id="movie-detail-title" className="text-2xl font-bold text-neutral-50">
            {movie.title}
          </h2>
          {detail?.tagline && <p className="text-sm italic text-neutral-400">{detail.tagline}</p>}

          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
            <span>{releaseYear(movie.release_date)}</span>
            {detail?.runtime ? <span>{formatRuntime(detail.runtime)}</span> : null}
            <span className="inline-flex items-center gap-1 text-amber-300">
              <span aria-hidden="true">★</span>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          <GenreChips genreIds={movie.genre_ids} genresById={genresById} max={6} />

          <p className="text-sm text-neutral-200">{movie.overview || 'No overview available.'}</p>

          {loading && <p className="text-sm text-neutral-500">Loading more details…</p>}
          {error && <p className="text-xs text-red-300/70">Additional details unavailable.</p>}

          {cast.length > 0 && (
            <div className="mt-2">
              <h3 className="mb-2 text-sm font-semibold text-neutral-300">Cast</h3>
              <ul className="flex flex-wrap gap-3">
                {cast.map((member) => (
                  <li key={member.id} className="flex w-20 flex-col items-center gap-1 text-center">
                    {member.profile_path ? (
                      <img
                        src={`${PROFILE_BASE_URL}${member.profile_path}`}
                        alt={member.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-center text-[10px] text-neutral-500">
                        No photo
                      </div>
                    )}
                    <span className="text-xs font-medium text-neutral-200">{member.name}</span>
                    <span className="text-[11px] text-neutral-500">{member.character}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
