import { useId, useMemo, useState } from 'react'
import type { ProductDocument } from '../../types/product'
import type { StateCode, StateCoverage } from '../../types/coverage'
import { US_STATES } from '../../data/states'
import { useCoverage } from '../../hooks/useCoverage'
import { documentAnchorId } from '../../lib/anchors'
import { Badge } from '../common/Badge'
import { Section } from '../common/Section'

interface CoverageCheckerProps {
  documents: ProductDocument[]
}

/**
 * "Is the Cubby 2 covered in <state>?" — the highest-stakes findability feature.
 *
 * We deliberately answer with *requirements and guidance*, never a bare yes/no
 * coverage guarantee: the source data describes Medicaid requirement categories and
 * LMN guide groups, not per-patient approval. The panel surfaces exactly what the
 * data supports and links to the authoritative PDF, so Sarah is never handed an
 * invented coverage rule. (Same fail-safe principle the README applies to AI.)
 */
export function CoverageChecker({ documents }: CoverageCheckerProps) {
  const [code, setCode] = useState<StateCode | null>(null)
  const coverage = useCoverage(code)
  const selectId = useId()

  const docsById = useMemo(
    () => new Map(documents.map((d) => [d.id, d])),
    [documents],
  )

  return (
    <Section
      id="coverage"
      title="Coverage & Medicaid by state"
      description="Pick a state to see its Medicaid pathway and the applicable LMN guide."
      action={
        <div className="flex flex-col gap-1">
          <label htmlFor={selectId} className="text-xs font-semibold text-ink-soft">
            State
          </label>
          <select
            id={selectId}
            value={code ?? ''}
            onChange={(e) => setCode((e.target.value || null) as StateCode | null)}
            className="rounded-lg border border-line bg-surface px-3 py-2 font-semibold text-ink focus:border-accent focus:outline-none"
          >
            <option value="">Select a state…</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {coverage.status === 'idle' && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-canvas/40 px-6 py-10 text-center">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div>
            <p className="font-heading font-bold text-ink">Check coverage by state</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
              Choose a state to see its Medicaid pathway and the LMN guide a provider
              should follow.
            </p>
          </div>
        </div>
      )}

      {coverage.status === 'loading' && (
        <p
          role="status"
          className="flex min-h-72 items-center justify-center rounded-xl border border-line p-6 text-center text-ink-soft"
        >
          Checking coverage…
        </p>
      )}

      {coverage.status === 'error' && (
        <p
          role="alert"
          className="flex min-h-72 items-center justify-center rounded-xl border border-line p-6 text-center text-ink-soft"
        >
          We couldn’t load coverage for that state. Please try again.
        </p>
      )}

      {coverage.status === 'success' && (
        <CoverageResult coverage={coverage.coverage} docsById={docsById} />
      )}
    </Section>
  )
}

function CoverageResult({
  coverage,
  docsById,
}: {
  coverage: StateCoverage
  docsById: Map<string, ProductDocument>
}) {
  const guideDocs = coverage.guideDocIds
    .map((id) => docsById.get(id))
    .filter((d): d is ProductDocument => Boolean(d))

  return (
    <div className="min-h-72 rounded-xl border border-line p-5">
      <h3 className="font-heading text-lg font-extrabold text-ink">
        Cubby 2 coverage in {coverage.name}
      </h3>

      {/* Medicaid pathway */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Medicaid
          </span>
          <Badge tone={coverage.medicaidListed ? 'positive' : 'neutral'}>
            {coverage.medicaidListed
              ? 'State-specific requirements'
              : 'General pathway'}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-ink">{coverage.medicaidNote}</p>
      </div>

      {/* LMN guide group(s) — may be zero, one, or two */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            LMN guide
          </span>
          {coverage.lmnGroups.map((group) => (
            <Badge key={group} tone="accent">
              Group {group}
            </Badge>
          ))}
        </div>
        {coverage.lmnGroups.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            No specific LMN guide group is listed for {coverage.name}. Use the LMN
            outline and worksheet in Documents to prepare a submission.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {guideDocs.map((doc) => (
              <li key={doc.id}>
                <a
                  href={`#${documentAnchorId(doc.id)}`}
                  className="inline-flex items-center gap-1 font-semibold text-accent-ink hover:underline"
                >
                  {doc.title} ↓
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 border-t border-line pt-4 text-xs text-ink-soft">
        Requirements and guidance only — this is not a per-patient coverage
        determination. Confirm current payer rules before submitting.
      </p>
    </div>
  )
}
