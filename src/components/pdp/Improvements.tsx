import { Section } from '../common/Section'

interface ImprovementsProps {
  improvements: string[]
}

export function Improvements({ improvements }: ImprovementsProps) {
  return (
    <Section
      id="improvements"
      title="New improvements"
      description="What changed in the current Cubby 2 generation."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {improvements.map((improvement) => (
          <li key={improvement} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/40 text-xs font-bold text-ink"
            >
              ✓
            </span>
            <span className="text-ink">{improvement}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
