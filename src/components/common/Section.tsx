import type { ReactNode } from 'react'

interface SectionProps {
  /** Anchor id — the target QuickFind and CoverageChecker scroll/link to. */
  id: string
  title: string
  /** Optional supporting line under the heading. */
  description?: string
  /** Optional element rendered at the right of the header row (e.g. a control). */
  action?: ReactNode
  children: ReactNode
}

/**
 * A titled page section wrapped in a white surface card. Owns the anchor `id`, which
 * is the contract the search and coverage features rely on to jump to content.
 */
export function Section({ id, title, description, action, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id={`${id}-heading`} className="text-2xl font-extrabold text-ink">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-2xl text-ink-soft">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  )
}
