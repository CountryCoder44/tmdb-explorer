import { POSTER_BASE_URL } from '../api/tmdb'
import type { LayoutMode } from '../types/tmdb'

interface PosterImageProps {
  posterPath: string | null
  title: string
  layout: LayoutMode
}

export function PosterImage({ posterPath, title, layout }: PosterImageProps) {
  const className =
    layout === 'grid'
      ? 'w-full aspect-[2/3] object-cover rounded-t-xl bg-neutral-800'
      : 'w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg bg-neutral-800 flex-shrink-0'

  if (!posterPath) {
    return (
      <div
        className={`${className} flex items-center justify-center text-center text-xs text-neutral-400 px-2`}
        role="img"
        aria-label={`No poster available for ${title}`}
      >
        No poster available
      </div>
    )
  }

  return <img src={`${POSTER_BASE_URL}${posterPath}`} alt={title} loading="lazy" className={className} />
}
