import { describe, expect, it } from 'vitest'
import { buildSearchIndex, searchProduct } from './search'
import { CUBBY_2_PRODUCT } from '../data/product'

/**
 * Protects the core findability promise: a SKU or spec search must land Sarah on the
 * right section. A silent regression here reintroduces the "hunting and luck" problem
 * the PDP exists to solve.
 */
describe('searchProduct', () => {
  const index = buildSearchIndex(CUBBY_2_PRODUCT)

  it('returns nothing for an empty or whitespace query', () => {
    expect(searchProduct(index, '')).toEqual([])
    expect(searchProduct(index, '   ')).toEqual([])
  })

  it('finds a bed variant by exact SKU and points to the bed-options section', () => {
    const results = searchProduct(index, 'CUB-2101')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].entry.sectionId).toBe('bed-options')
    expect(results[0].entry.title).toContain('Dream Hub')
  })

  it('is case-insensitive', () => {
    const upper = searchProduct(index, 'CUB-2101')
    const lower = searchProduct(index, 'cub-2101')
    expect(lower[0].entry.title).toBe(upper[0].entry.title)
  })

  it('finds the sensory package by name', () => {
    const results = searchProduct(index, 'sensory')
    expect(results[0].entry.sectionId).toBe('add-ons')
    expect(results[0].entry.title).toContain('Sensory')
  })

  it('routes coverage-style queries (a state name) to the coverage section', () => {
    const results = searchProduct(index, 'medicaid')
    expect(results.some((r) => r.entry.sectionId === 'coverage')).toBe(true)
  })

  it('narrows results as more tokens are added (AND semantics)', () => {
    const broad = searchProduct(index, 'package')
    const narrow = searchProduct(index, 'package sensory')
    expect(narrow.length).toBeLessThan(broad.length)
    expect(narrow.every((r) => r.entry.title.toLowerCase().includes('sensory'))).toBe(true)
  })

  it('excludes entries missing any query token', () => {
    // "wheels" matches bed variants; "unicorn" matches nothing -> zero results.
    expect(searchProduct(index, 'wheels unicorn')).toEqual([])
  })
})
