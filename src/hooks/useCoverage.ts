import { useEffect, useState } from 'react'
import type { StateCode, StateCoverage } from '../types/coverage'
import { getStateCoverage } from '../services/coverageService'

export type CoverageState =
  | { status: 'idle' }
  | { status: 'loading'; code: StateCode }
  | { status: 'error'; code: StateCode; error: Error }
  | { status: 'success'; coverage: StateCoverage }

/** The last settled lookup, tagged with the code it was for. */
type Settled =
  | { code: StateCode; coverage: StateCoverage }
  | { code: StateCode; error: Error }

/**
 * Look up coverage for the currently selected state. `null` selection is idle.
 *
 * Status is DERIVED from the selected code and the last settled result rather than
 * written synchronously in the effect: if the settled result isn't for the current
 * code yet, we're loading. This keeps a slow earlier lookup from ever showing under a
 * newer selection, and avoids cascading setState-in-effect renders.
 */
export function useCoverage(code: StateCode | null): CoverageState {
  const [settled, setSettled] = useState<Settled | null>(null)

  useEffect(() => {
    if (code === null) return

    let active = true
    getStateCoverage(code)
      .then((coverage) => {
        if (active) setSettled({ code, coverage })
      })
      .catch((err: unknown) => {
        if (active) {
          setSettled({
            code,
            error: err instanceof Error ? err : new Error('Failed to load coverage'),
          })
        }
      })

    return () => {
      active = false
    }
  }, [code])

  if (code === null) return { status: 'idle' }
  if (settled && settled.code === code) {
    return 'error' in settled
      ? { status: 'error', code, error: settled.error }
      : { status: 'success', coverage: settled.coverage }
  }
  return { status: 'loading', code }
}
