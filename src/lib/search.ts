import type { Product } from '../types/product'
import { formatUsd } from './format'

/**
 * Deterministic in-page "Quick-Find".
 *
 * This is intentionally NOT an LLM. Sarah needs to trust that searching a SKU or a
 * spec jumps to the right place every time; a keyword index gives explainable,
 * reproducible results with zero risk of an invented answer. Semantic/AI search is a
 * later opportunity (see README "Scope"), not this slice.
 */

/** One searchable chunk of the page, tagged with the section anchor to jump to. */
export interface SearchEntry {
  /** DOM id of the <Section> to scroll to when this result is chosen. */
  sectionId: string
  /** Short label for the section, shown as a result group hint. */
  sectionLabel: string
  /** Primary text (weighted highest). */
  title: string
  /** Supporting text (weighted lowest). */
  body: string
  /** Exact-ish tokens such as SKUs and tags (weighted between title and body). */
  keywords: string[]
}

export interface SearchResult {
  entry: SearchEntry
  score: number
}

const WEIGHT = { title: 3, keyword: 2, body: 1 } as const

/**
 * Build the search index from a loaded product. Called once per product load; the
 * result is memoized by the caller.
 */
export function buildSearchIndex(product: Product): SearchEntry[] {
  const entries: SearchEntry[] = []

  entries.push({
    sectionId: 'overview',
    sectionLabel: 'Overview',
    title: product.name,
    body: product.tagline,
    keywords: ['cubby 2', 'overview'],
  })

  for (const d of product.differentiators) {
    entries.push({
      sectionId: 'why-cubby',
      sectionLabel: 'Why Cubby',
      title: d.title,
      body: d.description,
      keywords: [],
    })
  }

  for (const s of product.researchStats) {
    entries.push({
      sectionId: 'research',
      sectionLabel: 'Research',
      title: s.headline,
      body: s.detail,
      keywords: ['research', 'outcomes', 'sleep', 'elopement', 'wakeups'],
    })
  }

  for (const imp of product.improvements) {
    entries.push({
      sectionId: 'improvements',
      sectionLabel: 'Improvements',
      title: imp,
      body: '',
      keywords: ['improvement', 'new'],
    })
  }

  for (const option of product.bedOptions) {
    for (const v of option.variants) {
      entries.push({
        sectionId: 'bed-options',
        sectionLabel: 'Bed options',
        title: `${option.name} — ${v.label}`,
        body: `${option.includes.join(', ')}. MSRP ${formatUsd(v.msrp)}.`,
        keywords: [v.sku, v.hasWheels ? 'wheels' : 'no wheels', 'msrp', 'price'],
      })
    }
  }

  for (const pkg of product.addOnPackages) {
    entries.push({
      sectionId: 'add-ons',
      sectionLabel: 'Add-on packages',
      title: pkg.name,
      body: `${pkg.description} Includes ${pkg.contents.join(', ')}. MSRP ${formatUsd(pkg.msrp)}.`,
      keywords: [pkg.sku, 'add-on', 'package', 'msrp', 'price'],
    })
  }

  for (const doc of product.documents) {
    entries.push({
      sectionId: 'documents',
      sectionLabel: 'Documents',
      title: doc.title,
      body: doc.description,
      keywords: ['document', 'pdf', doc.category, ...(doc.lmnGroup ? [`group ${doc.lmnGroup}`] : [])],
    })
  }

  // A single entry that routes coverage-style queries (state names, "medicaid",
  // "covered") to the interactive Coverage Checker.
  entries.push({
    sectionId: 'coverage',
    sectionLabel: 'Coverage',
    title: 'Coverage & Medicaid requirements by state',
    body: 'Check Medicaid requirements and the applicable LMN guide for any state.',
    keywords: ['coverage', 'covered', 'medicaid', 'lmn', 'state', 'requirements'],
  })

  for (const inc of product.incentives) {
    entries.push({
      sectionId: 'incentives',
      sectionLabel: 'Incentives',
      title: inc.title,
      body: `${inc.description} Reward: ${inc.reward}.`,
      keywords: ['incentive', 'reward', 'demo bed'],
    })
  }

  entries.push({
    sectionId: 'contact',
    sectionLabel: 'Contact',
    title: 'Contact Cubby',
    body: `${product.contact.website} ${product.contact.email} ${product.contact.phone}`,
    keywords: ['contact', 'phone', 'email', 'support'],
  })

  return entries
}

/** Split a query into lowercased, non-empty tokens. */
function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/** Best field weight at which `token` appears in `entry`, or 0 if absent. */
function tokenWeight(entry: SearchEntry, token: string): number {
  if (entry.title.toLowerCase().includes(token)) return WEIGHT.title
  if (entry.keywords.some((k) => k.toLowerCase().includes(token))) return WEIGHT.keyword
  if (entry.body.toLowerCase().includes(token)) return WEIGHT.body
  return 0
}

/**
 * Search the index. AND semantics: an entry qualifies only if EVERY query token
 * matches somewhere in it, so adding words narrows results. Score is the summed field
 * weight of each token's best match; ties keep the index's original order (stable).
 */
export function searchProduct(index: SearchEntry[], query: string): SearchResult[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const results: SearchResult[] = []
  index.forEach((entry) => {
    let score = 0
    for (const token of tokens) {
      const weight = tokenWeight(entry, token)
      if (weight === 0) return // missing token -> entry disqualified
      score += weight
    }
    results.push({ entry, score })
  })

  return results.sort((a, b) => b.score - a.score)
}
