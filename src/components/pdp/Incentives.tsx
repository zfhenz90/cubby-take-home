import type { Incentive } from '../../types/product'
import { formatUsd } from '../../lib/format'
import { Badge } from '../common/Badge'
import { Section } from '../common/Section'

interface IncentivesProps {
  incentives: Incentive[]
}

/**
 * Placeholder progress toward each incentive, keyed by incentive id.
 *
 * Hardcoded for this slice to make "sale #1 -> sale #5" tangible. Real per-supplier
 * progress belongs to the authenticated experience (pitch "Opportunity 2"): it would
 * come from the CRM/orders system, not the product payload, and must be scoped to the
 * signed-in partner.
 */
const DEMO_PROGRESS: Record<string, number> = {
  'demo-bed': 1,
  'rewards-1m': 120_000,
}

function formatProgress(value: number, unit: Incentive['unit']): string {
  return unit === 'usd' ? formatUsd(value) : String(value)
}

function IncentiveCard({ incentive }: { incentive: Incentive }) {
  const current = DEMO_PROGRESS[incentive.id] ?? 0
  const pct = Math.min(100, Math.round((current / incentive.target) * 100))

  return (
    <article className="flex flex-col rounded-xl border border-gold/60 bg-gold/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading font-extrabold text-ink">{incentive.title}</h3>
        <Badge tone="gold">{incentive.reward}</Badge>
      </div>
      <p className="mt-2 text-sm text-ink-soft">{incentive.description}</p>

      {incentive.unit === 'beds' ? (
        <ol
          className="mt-5 flex items-center gap-2"
          aria-label={`Progress: ${current} of ${incentive.target} beds`}
        >
          {Array.from({ length: incentive.target }, (_, i) => {
            const step = i + 1
            const reached = step <= current
            return (
              <li key={step} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    reached ? 'bg-ink text-white' : 'bg-canvas text-ink-soft'
                  }`}
                >
                  {step}
                </span>
                <span className="text-[10px] text-ink-soft">
                  {step === incentive.target ? 'Reward' : `Sale ${step}`}
                </span>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="mt-5">
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-canvas"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={incentive.title}
          >
            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <p className="mt-3 text-sm font-semibold text-ink">
        {formatProgress(current, incentive.unit)} of{' '}
        {formatProgress(incentive.target, incentive.unit)}
        {incentive.unit === 'beds' ? ' beds' : ''} ({pct}%)
      </p>
    </article>
  )
}

export function Incentives({ incentives }: IncentivesProps) {
  return (
    <Section
      id="incentives"
      title="Supplier incentives"
      description="Your path from the first sale to bigger rewards."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {incentives.map((incentive) => (
          <IncentiveCard key={incentive.id} incentive={incentive} />
        ))}
      </div>
    </Section>
  )
}
