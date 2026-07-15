import type { ResearchStat } from '../../types/product'
import { Section } from '../common/Section'

interface ResearchStatsProps {
  stats: ResearchStat[]
}

export function ResearchStats({ stats }: ResearchStatsProps) {
  return (
    <Section
      id="research"
      title="Backed by peer-reviewed research"
      description="Caregiver-reported outcomes you can cite in a submission."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.headline}
            className="rounded-xl border border-accent/40 bg-accent/10 p-5"
          >
            <p className="font-heading text-lg font-extrabold text-accent-ink">
              {stat.headline}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{stat.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
