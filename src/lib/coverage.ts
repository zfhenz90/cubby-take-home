import type { LmnGroup, StateCode, StateCoverage } from '../types/coverage'
import { STATE_NAME_BY_CODE } from '../data/states'
import {
  LMN_GROUP_A_STATES,
  LMN_GROUP_B_STATES,
  LMN_GROUP_DOC_ID,
  MEDICAID_FALLBACK_NOTE,
  MEDICAID_LISTED_NOTE,
  MEDICAID_LISTED_STATES,
} from '../data/coverage'

/**
 * Resolve the coverage guidance for a single state.
 *
 * This is the correctness-critical core of the product: it answers "is this covered
 * in <state>, and what does the provider follow?" A wrong answer here misleads a DME
 * partner on reimbursement, so the function is pure (no I/O, no React) and exhaustively
 * unit-tested. It reads only the verbatim membership sets in data/coverage.ts.
 *
 * Notably it must handle a state belonging to MULTIPLE LMN groups (LA and NC are in
 * both A and B), and Medicaid listing is independent of LMN grouping.
 */
export function resolveCoverage(code: StateCode): StateCoverage {
  const name = STATE_NAME_BY_CODE[code]
  if (!name) {
    // A code outside the known 51 is a programming error, not a user path.
    throw new Error(`Unknown state code: ${code}`)
  }

  const lmnGroups: LmnGroup[] = []
  if (LMN_GROUP_A_STATES.has(code)) lmnGroups.push('A')
  if (LMN_GROUP_B_STATES.has(code)) lmnGroups.push('B')

  const guideDocIds = lmnGroups.map((group) => LMN_GROUP_DOC_ID[group])

  const medicaidListed = MEDICAID_LISTED_STATES.has(code)

  return {
    code,
    name,
    medicaidListed,
    medicaidNote: medicaidListed ? MEDICAID_LISTED_NOTE : MEDICAID_FALLBACK_NOTE,
    lmnGroups,
    guideDocIds,
  }
}
