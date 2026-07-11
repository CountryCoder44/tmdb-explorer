import type { SortDirection, SortProperty } from '../types/tmdb'

interface SortControlProps {
  property: SortProperty
  direction: SortDirection
  onPropertyChange: (property: SortProperty) => void
  onDirectionChange: (direction: SortDirection) => void
}

const selectClasses =
  'rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'

const PROPERTY_OPTIONS: { value: SortProperty; label: string }[] = [
  { value: 'vote_average', label: 'Rating' },
  { value: 'title', label: 'Title' },
  { value: 'release_date', label: 'Release date' },
  { value: 'popularity', label: 'Popularity' },
]

export function SortControl({ property, direction, onPropertyChange, onDirectionChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-300">
      <label className="flex items-center gap-2">
        Sort by
        <select
          className={selectClasses}
          style={{ colorScheme: 'dark' }}
          value={property}
          onChange={(event) => onPropertyChange(event.target.value as SortProperty)}
        >
          {PROPERTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-neutral-900 text-neutral-100">
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="sr-only">Sort direction</span>
        <select
          className={selectClasses}
          style={{ colorScheme: 'dark' }}
          value={direction}
          onChange={(event) => onDirectionChange(event.target.value as SortDirection)}
          aria-label="Sort direction"
        >
          <option value="desc" className="bg-neutral-900 text-neutral-100">
            High to low
          </option>
          <option value="asc" className="bg-neutral-900 text-neutral-100">
            Low to high
          </option>
        </select>
      </label>
    </div>
  )
}
