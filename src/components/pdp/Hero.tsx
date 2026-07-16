import type { Product } from '../../types/product'
import { formatUsd } from '../../lib/format'

interface HeroProps {
  product: Product
}

/** Returns the lowest MSRP across all bed variants, for a "from $X" summary. */
function startingPrice(product: Product): number {
  return Math.min(
    ...product.bedOptions.flatMap((o) => o.variants.map((v) => v.msrp)),
  )
}

export function Hero({ product }: HeroProps) {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="jump-target">
      <div className="grid items-center gap-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8 md:grid-cols-2">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold tracking-wide text-accent-ink uppercase">
            Supplier product detail
          </p>
          <h1 id="overview-heading" className="text-4xl font-extrabold text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-prose text-lg text-ink-soft">{product.tagline}</p>
          <p className="mt-4 text-ink">
            <span className="font-heading text-2xl font-extrabold">
              From {formatUsd(startingPrice(product))}
            </span>{' '}
            <span className="text-ink-soft">MSRP</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#bed-options"
              className="rounded-lg bg-ink px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              View options &amp; pricing
            </a>
            <a
              href="#coverage"
              className="rounded-lg border border-accent bg-accent/10 px-5 py-2.5 font-semibold text-accent-ink transition hover:bg-accent/20"
            >
              Check coverage
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-canvas">
          <img
            src={product.heroImage}
            alt={`${product.name} with canopy doors open`}
            className="mx-auto h-auto w-full object-contain"
            width={600}
            height={400}
          />
        </div>
      </div>
    </section>
  )
}
