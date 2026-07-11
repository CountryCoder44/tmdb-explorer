interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 py-24 text-center text-neutral-300">
      <p className="text-lg font-semibold text-red-300">Something went wrong</p>
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  )
}
