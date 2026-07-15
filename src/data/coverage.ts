import type { LmnGroup, StateCode } from '../types/coverage'

/**
 * Raw coverage membership, transcribed VERBATIM from design/product-detail-page.md.
 *
 * Keep this module a faithful copy of the source document and nothing more — no
 * derived logic lives here. `lib/coverage.ts` composes these sets into the shape a
 * view consumes. Splitting "source data" from "resolution logic" is what lets us
 * unit-test the logic and eyeball the data against the doc during review.
 *
 * KNOWN QUIRKS in the source (intentionally preserved, covered by tests):
 *  - Louisiana (LA) and North Carolina (NC) appear in BOTH LMN Group A and Group B.
 *  - The LMN groups include states (ID, RI, SD, DC, ...) that are NOT in the Medicaid
 *    Requirements list, which ends with an "All other states" catch-all. Medicaid
 *    listing and LMN grouping are therefore independent.
 */

/** States named explicitly in the "Medicaid Requirements" section (30 states). */
export const MEDICAID_LISTED_STATES: ReadonlySet<StateCode> = new Set<StateCode>([
  'AL', 'AZ', 'CA', 'CO', 'CT', 'FL', 'GA', 'IL', 'IN', 'IA',
  'KY', 'LA', 'MD', 'MA', 'MI', 'MN', 'MO', 'NH', 'NY', 'NC',
  'OH', 'OK', 'OR', 'PA', 'SC', 'TN', 'TX', 'VA', 'WA', 'WI',
])

/** "LMN Guides by state — Group A". */
export const LMN_GROUP_A_STATES: ReadonlySet<StateCode> = new Set<StateCode>([
  'AL', 'CA', 'CO', 'GA', 'IA', 'ID', 'KY', 'LA', 'MD', 'NC',
  'OH', 'PA', 'RI', 'SD', 'VA',
])

/** "LMN Guides by state — Group B". */
export const LMN_GROUP_B_STATES: ReadonlySet<StateCode> = new Set<StateCode>([
  'AK', 'AR', 'AZ', 'CT', 'DC', 'DE', 'FL', 'HI', 'IL', 'IN',
  'KS', 'LA', 'MA', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC',
  'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OK', 'OR', 'SC',
  'TN', 'TX', 'UT', 'VT', 'WA', 'WI', 'WV', 'WY',
])

/** Maps each LMN group to the id of its guide document in the product payload. */
export const LMN_GROUP_DOC_ID: Readonly<Record<LmnGroup, string>> = {
  A: 'lmn-guide-group-a',
  B: 'lmn-guide-group-b',
}

/** Guidance shown when a state is explicitly listed in Medicaid Requirements. */
export const MEDICAID_LISTED_NOTE =
  'State-specific Medicaid requirements apply. Communicate regularly with the ' +
  'family and providers to improve the chance of approval.'

/** Guidance shown for "All other states" (not individually listed). */
export const MEDICAID_FALLBACK_NOTE =
  'No state-specific Medicaid requirement is published here — follow the general ' +
  'pathway ("All other states"). Communicate regularly with the family and ' +
  'providers to improve the chance of approval.'
