import type { LayoutMode } from '../types/tmdb'

interface LayoutToggleProps {
  layout: LayoutMode
  onChange: (layout: LayoutMode) => void
}

const buttonBase =
  'rounded-lg border border-white/15 px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'

export function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div className="flex gap-1" role="group" aria-label="Layout">
      <button
        type="button"
        className={`${buttonBase} ${layout === 'grid' ? 'bg-amber-300 text-black' : 'bg-white/5 text-neutral-300'}`}
        aria-pressed={layout === 'grid'}
        onClick={() => onChange('grid')}
      >
        Grid
      </button>
      <button
        type="button"
        className={`${buttonBase} ${layout === 'line' ? 'bg-amber-300 text-black' : 'bg-white/5 text-neutral-300'}`}
        aria-pressed={layout === 'line'}
        onClick={() => onChange('line')}
      >
        Line
      </button>
    </div>
  )
}
