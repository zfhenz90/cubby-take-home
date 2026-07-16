/** Page-specific "on this page" jump links for the product detail page. */
const SECTIONS = [
  { href: '#bed-options', label: 'Pricing' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#documents', label: 'Documents' },
  { href: '#incentives', label: 'Incentives' },
]

/**
 * In-page navigation for the PDP. This is page content, not site chrome, so it lives
 * on the page rather than in the shared SiteHeader. Sticks just under the header so
 * the jump links stay reachable while scrolling.
 */
export function SectionNav() {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-20 border-b border-line bg-canvas/90 backdrop-blur"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 py-2.5 text-sm font-semibold text-ink-soft">
          {SECTIONS.map((section) => (
            <li key={section.href}>
              <a href={section.href} className="hover:text-accent-ink">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
