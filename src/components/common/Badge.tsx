import type { ReactNode } from 'react'

export type BadgeTone =
  | 'accent'
  | 'gold'
  | 'neutral'
  | 'positive'
  | 'violet'
  | 'rose'

const TONE_CLASSES: Record<BadgeTone, string> = {
  accent: 'bg-accent/20 text-accent-ink',
  gold: 'bg-gold/30 text-ink',
  neutral: 'bg-canvas text-ink-soft',
  positive: 'bg-emerald-100 text-emerald-800',
  violet: 'bg-violet-100 text-violet-800',
  rose: 'bg-rose-100 text-rose-800',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

/** Small status pill used for coverage status, document categories, etc. */
export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  )
}
