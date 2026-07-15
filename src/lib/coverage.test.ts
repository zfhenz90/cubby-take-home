import { describe, expect, it } from 'vitest'
import { resolveCoverage } from './coverage'
import { US_STATES } from '../data/states'
import {
  MEDICAID_FALLBACK_NOTE,
  MEDICAID_LISTED_NOTE,
} from '../data/coverage'
import type { StateCode } from '../types/coverage'

/**
 * These tests protect the single most damaging failure mode: telling a DME partner
 * the wrong coverage pathway. They lock the transcribed membership from the design doc
 * (including its quirks) and the composition rules in resolveCoverage.
 */
describe('resolveCoverage', () => {
  it('returns BOTH LMN groups for states listed under Group A and Group B', () => {
    // Louisiana and North Carolina appear in both group lists in the source doc.
    for (const code of ['LA', 'NC'] as StateCode[]) {
      const c = resolveCoverage(code)
      expect(c.lmnGroups).toEqual(['A', 'B'])
      expect(c.guideDocIds).toEqual(['lmn-guide-group-a', 'lmn-guide-group-b'])
    }
  })

  it('returns exactly one LMN group for single-group states', () => {
    expect(resolveCoverage('ID').lmnGroups).toEqual(['A']) // Group A only
    expect(resolveCoverage('TX').lmnGroups).toEqual(['B']) // Group B only
    expect(resolveCoverage('ID').guideDocIds).toEqual(['lmn-guide-group-a'])
    expect(resolveCoverage('TX').guideDocIds).toEqual(['lmn-guide-group-b'])
  })

  it('treats Medicaid listing independently of LMN grouping', () => {
    // Rhode Island is in an LMN group (A) but NOT in the Medicaid Requirements list.
    const ri = resolveCoverage('RI')
    expect(ri.lmnGroups).toEqual(['A'])
    expect(ri.medicaidListed).toBe(false)
    expect(ri.medicaidNote).toBe(MEDICAID_FALLBACK_NOTE)
  })

  it('flags states explicitly named in the Medicaid Requirements list', () => {
    const tx = resolveCoverage('TX')
    expect(tx.medicaidListed).toBe(true)
    expect(tx.medicaidNote).toBe(MEDICAID_LISTED_NOTE)
  })

  it('resolves the display name from the canonical state table', () => {
    expect(resolveCoverage('FL').name).toBe('Florida')
    expect(resolveCoverage('DC').name).toBe('District of Columbia')
  })

  it('resolves every one of the 51 states to at least one LMN group without throwing', () => {
    // The two group lists union to all 51 states; if a state is ever dropped from
    // both, this guard fails rather than silently showing "no guide" to a partner.
    for (const state of US_STATES) {
      const c = resolveCoverage(state.code)
      expect(c.name).toBeTruthy()
      expect(c.lmnGroups.length).toBeGreaterThan(0)
    }
  })

  it('throws on an unknown state code (programming error, not a user path)', () => {
    expect(() => resolveCoverage('ZZ' as StateCode)).toThrow()
  })
})
