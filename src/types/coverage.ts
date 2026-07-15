/**
 * Types for the state-by-state coverage lookup.
 *
 * "Coverage" here means *rules and guidance* — which Medicaid requirements apply and
 * which Letter of Medical Necessity (LMN) guide a provider should follow in a given
 * state. It is NOT patient data: no names, dates of birth, diagnoses, or claims. See
 * README "PHI handling".
 */

import type { LmnGroup } from './product'

// Re-exported so coverage-layer modules can import it from one place.
export type { LmnGroup }

/** USPS code for each of the 50 states plus DC. */
export type StateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL'
  | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME'
  | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH'
  | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI'
  | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI'
  | 'WY'

/** A US state/territory entry for the selector. */
export interface UsState {
  code: StateCode
  name: string
}

/**
 * Resolved coverage guidance for a single state.
 *
 * `lmnGroups` is an array because a state can belong to more than one LMN guide
 * group (Louisiana and North Carolina are listed under BOTH Group A and Group B in
 * the design source). It can also be empty when no guide group lists the state.
 */
export interface StateCoverage {
  code: StateCode
  name: string
  /**
   * True when the state is named explicitly in the Medicaid Requirements list.
   * False falls back to the "All other states" general guidance.
   */
  medicaidListed: boolean
  /** Guidance shown to the supplier for this state's Medicaid pathway. */
  medicaidNote: string
  /** LMN guide group(s) that apply — may be zero, one, or two. */
  lmnGroups: LmnGroup[]
  /** ProductDocument ids for the applicable LMN guide(s), for deep-linking. */
  guideDocIds: string[]
}
