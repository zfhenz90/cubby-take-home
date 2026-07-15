import type { Differentiator } from '../../types/product'
import { Section } from '../common/Section'

interface DifferentiatorsProps {
  items: Differentiator[]
}

export function Differentiators({ items }: DifferentiatorsProps) {
  return (
    <Section
      id="why-cubby"
      title="Why Cubby stands apart"
      description="What to tell a family evaluating the Cubby 2."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="rounded-xl border border-line bg-canvas/60 p-4">
            <h3 className="font-heading font-bold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
