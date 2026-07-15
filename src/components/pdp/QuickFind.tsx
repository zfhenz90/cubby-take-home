import { useMemo, useRef, useState } from 'react'
import type { Product } from '../../types/product'
import { buildSearchIndex, searchProduct, type SearchEntry } from '../../lib/search'

interface QuickFindProps {
  product: Product
}

const MAX_RESULTS = 8

/**
 * Sticky in-page search. Builds a keyword index from the product once, then jumps to
 * the matching section on selection. Deterministic (not AI) so a SKU or spec search
 * lands in the same place every time — see lib/search.ts.
 */
export function QuickFind({ product }: QuickFindProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(() => buildSearchIndex(product), [product])
  const results = useMemo(
    () => searchProduct(index, query).slice(0, MAX_RESULTS),
    [index, query],
  )

  const showDropdown = open && query.trim().length > 0

  function jumpTo(entry: SearchEntry) {
    const el = document.getElementById(entry.sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Move focus to the section for keyboard/screen-reader users.
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const entry = results[activeIndex]
      if (entry) jumpTo(entry.entry)
    } else if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <label htmlFor="quick-find" className="sr-only">
        Search product details, SKUs, and coverage
      </label>
      <input
        id="quick-find"
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="quick-find-results"
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Search specs, SKUs, coverage…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-line bg-surface px-4 py-2 text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none"
      />

      {showDropdown && (
        <ul
          id="quick-find-results"
          role="listbox"
          className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-line bg-surface shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-soft">
              No matches for “{query.trim()}”.
            </li>
          ) : (
            results.map((result, i) => (
              <li
                key={`${result.entry.sectionId}-${result.entry.title}`}
                role="option"
                aria-selected={i === activeIndex}
                // preventDefault keeps the input focused so onClick fires before blur
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => jumpTo(result.entry)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 ${
                  i === activeIndex ? 'bg-accent/15' : ''
                }`}
              >
                <span className="truncate text-sm font-semibold text-ink">
                  {result.entry.title}
                </span>
                <span className="shrink-0 rounded-full bg-canvas px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink-soft uppercase">
                  {result.entry.sectionLabel}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
