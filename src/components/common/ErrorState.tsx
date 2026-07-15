interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Full-page error placeholder with an optional retry. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p className="font-heading text-xl font-extrabold text-ink">
        We couldn’t load the product details
      </p>
      <p className="text-ink-soft">
        {message ?? 'Something went wrong. Please try again.'}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-ink px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
