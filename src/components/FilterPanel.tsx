import { useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Genre, MovieFilters } from '../types/tmdb'
import { getActiveFilters } from '../utils/activeFilters'

interface FilterPanelProps {
  genres: Genre[]
  filters: MovieFilters
  genresById: Record<number, string>
  onChange: (filters: MovieFilters) => void
}

const EMPTY_FILTERS: MovieFilters = { genreIds: [], yearFrom: null, yearTo: null, minRating: null }
const MIN_YEAR = 1900
const CURRENT_YEAR = new Date().getFullYear()

const inputClasses =
  'w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'

const clampYear = (value: number) => Math.min(Math.max(value, MIN_YEAR), CURRENT_YEAR)

export function FilterPanel({ genres, filters, genresById, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeCount = getActiveFilters(filters, genresById).length

  const toggleGenre = (genreId: number) => {
    const genreIds = filters.genreIds.includes(genreId)
      ? filters.genreIds.filter((id) => id !== genreId)
      : [...filters.genreIds, genreId]
    onChange({ ...filters, genreIds })
  }

  // Setting "From" above the current "To" (or vice versa) would otherwise
  // silently AND into a zero-result request — bump the other bound to match
  // instead of letting the range invert.
  const handleYearFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const yearFrom = raw === '' ? null : clampYear(Number(raw))
    const yearTo = yearFrom !== null && filters.yearTo !== null && filters.yearTo < yearFrom ? yearFrom : filters.yearTo
    onChange({ ...filters, yearFrom, yearTo })
  }

  const handleYearToChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const yearTo = raw === '' ? null : clampYear(Number(raw))
    const yearFrom = yearTo !== null && filters.yearFrom !== null && filters.yearFrom > yearTo ? yearTo : filters.yearFrom
    onChange({ ...filters, yearTo, yearFrom })
  }

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, minRating: Number(event.target.value) })
  }

  const ratingLabel = filters.minRating && filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : 'Any'

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="filter-panel"
        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-300 transition-colors duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
      >
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-xs font-semibold text-black">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-neutral-400">Genres (any of)</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => {
                    const selected = filters.genreIds.includes(genre.id)
                    return (
                      <button
                        key={genre.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleGenre(genre.id)}
                        className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                          selected ? 'bg-amber-300 text-black' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                        }`}
                      >
                        {genre.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold text-neutral-400">
                  From
                  <input
                    type="number"
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    value={filters.yearFrom ?? ''}
                    onChange={handleYearFromChange}
                    className={inputClasses}
                    style={{ colorScheme: 'dark' }}
                    placeholder={String(MIN_YEAR)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-neutral-400">
                  To
                  <input
                    type="number"
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    value={filters.yearTo ?? ''}
                    onChange={handleYearToChange}
                    className={inputClasses}
                    style={{ colorScheme: 'dark' }}
                    placeholder={String(CURRENT_YEAR)}
                  />
                </label>

                <label className="flex flex-1 min-w-48 flex-col gap-1 text-xs font-semibold text-neutral-400">
                  Minimum rating: {ratingLabel}
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={filters.minRating ?? 0}
                    onChange={handleRatingChange}
                    className="accent-amber-300"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => onChange(EMPTY_FILTERS)}
                className="self-start text-xs text-neutral-400 underline decoration-dotted hover:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Clear filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
