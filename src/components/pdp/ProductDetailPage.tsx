import { useProduct } from '../../hooks/useProduct'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'
import { SiteHeader } from '../common/SiteHeader'
import { AddOnPackages } from './AddOnPackages'
import { BedOptions } from './BedOptions'
import { Contact } from './Contact'
import { CoverageChecker } from './CoverageChecker'
import { Differentiators } from './Differentiators'
import { Documents } from './Documents'
import { Hero } from './Hero'
import { Improvements } from './Improvements'
import { Incentives } from './Incentives'
import { QuickFind } from './QuickFind'
import { ResearchStats } from './ResearchStats'
import { SectionNav } from './SectionNav'

/**
 * Orchestrates the Cubby 2 product detail page: loads the product through the service
 * seam, handles loading/error, then lays out every section. Kept route-ready so a
 * router can wrap it later without refactoring (see README "Scope").
 */
export function ProductDetailPage() {
  const state = useProduct()

  if (state.status === 'loading') return <LoadingState />
  if (state.status === 'error') {
    return <ErrorState message={state.error.message} onRetry={() => location.reload()} />
  }

  const { product } = state

  return (
    <div className="min-h-screen">
      <SiteHeader>
        <QuickFind product={product} />
      </SiteHeader>
      <SectionNav />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Hero product={product} />
        <CoverageChecker documents={product.documents} />
        <Differentiators items={product.differentiators} />
        <ResearchStats stats={product.researchStats} />
        <Improvements improvements={product.improvements} />
        <BedOptions options={product.bedOptions} />
        <AddOnPackages packages={product.addOnPackages} />
        <Documents documents={product.documents} />
        <Incentives incentives={product.incentives} />
        <Contact contact={product.contact} />
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-ink-soft">
        <p>
          Cubby supplier portal prototype
        </p>
        <p className="mt-1">
          {product.contact.website} ·{' '}{product.contact.phone}
        </p>
      </footer>
    </div>
  )
}
