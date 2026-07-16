import type { ReactNode } from 'react'

interface SiteHeaderProps {
  /** Optional search control rendered on the right — injected per page. */
  children?: ReactNode
}

/**
 * Shared site chrome, intended to be common across every page. It stays
 * page-agnostic: logo + an optional search slot only. Page-specific navigation (e.g.
 * a product's section links) does NOT belong here — it lives on the page. The search
 * is passed in as a slot so a global catalog search can replace the PDP's Quick-Find
 * without changing this component.
 */
export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#overview" className="flex shrink-0 items-center gap-2">
          <img src="/images/Cubby-Logo.png" alt="Cubby" className="h-7 w-auto" />
          <span className="sr-only">Cubby supplier portal — home</span>
        </a>
        {children ? <div className="ml-auto w-full max-w-sm">{children}</div> : null}
      </div>
    </header>
  )
}
