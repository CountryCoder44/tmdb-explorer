interface RatingBadgeProps {
  voteAverage: number
  className?: string
}

export function RatingBadge({ voteAverage, className = '' }: RatingBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur-sm ${className}`}
    >
      <span aria-hidden="true">★</span>
      {voteAverage.toFixed(1)}
    </span>
  )
}
