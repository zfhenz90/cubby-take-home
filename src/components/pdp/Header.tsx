import type { Product } from '../../types/product'
import { QuickFind } from './QuickFind'

interface HeaderProps {
  product: Product
}

/** In-page jump links to the major sections. */
const NAV = [
  { href: '#bed-options', label: 'Pricing' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#documents', label: 'Documents' },
  { href: '#incentives', label: 'Incentives' },
]

/** Sticky top bar: logo, section nav, and the QuickFind search. */
export function Header({ product }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <a href="#overview" className="flex shrink-0 items-center gap-2">
          <img src="/images/Cubby-Logo.png" alt="Cubby" className="h-7 w-auto" />
          <span className="sr-only">Cubby supplier portal</span>
        </a>

        <nav aria-label="Product sections" className="order-3 w-full sm:order-2 sm:w-auto">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink-soft">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-accent-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-2 ml-auto w-full max-w-sm sm:order-3">
          <QuickFind product={product} />
        </div>
      </div>
    </header>
  )
}
