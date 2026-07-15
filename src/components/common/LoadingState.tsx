/** Full-page loading placeholder shown while the product payload is fetched. */
export function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
      <p className="font-heading text-lg font-bold text-ink">Loading product details…</p>
      <p className="text-ink-soft">Fetching the latest Cubby 2 information.</p>
    </div>
  )
}
