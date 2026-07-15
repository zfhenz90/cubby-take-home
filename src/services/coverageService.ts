import type { StateCode, StateCoverage } from '../types/coverage'
import { resolveCoverage } from '../lib/coverage'
import { delay } from './delay'

/**
 * Mock coverage service. Wraps the pure `resolveCoverage` logic behind the same async
 * seam as the product service, so a state lookup can later become a call to a
 * coverage-rules API (the true source of truth for Medicaid/LMN rules) without
 * touching the UI. See README "Systems integration" for how staleness would be
 * handled against a real source.
 *
 * @param latencyMs simulated latency; pass 0 in tests.
 */
export async function getStateCoverage(
  code: StateCode,
  latencyMs = 250,
): Promise<StateCoverage> {
  await delay(latencyMs)
  return resolveCoverage(code)
}
