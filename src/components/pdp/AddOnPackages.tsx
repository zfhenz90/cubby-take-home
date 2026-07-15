import type { AddOnPackage } from '../../types/product'
import { formatUsd } from '../../lib/format'
import { Section } from '../common/Section'

interface AddOnPackagesProps {
  packages: AddOnPackage[]
}

export function AddOnPackages({ packages }: AddOnPackagesProps) {
  return (
    <Section
      id="add-ons"
      title="Add-on packages"
      description="Optional packages sold alongside the Cubby 2."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {packages.map((pkg) => (
          <article key={pkg.id} className="flex flex-col rounded-xl border border-line p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-bold text-ink">{pkg.name}</h3>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-soft">{pkg.sku}</p>
            <p className="mt-3 flex-1 text-sm text-ink-soft">{pkg.description}</p>

            <p className="mt-4 text-xs font-semibold tracking-wide text-ink-soft uppercase">
              Includes
            </p>
            <ul className="mt-1 space-y-1 text-sm text-ink">
              {pkg.contents.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>

            <p className="mt-4 font-heading text-lg font-extrabold text-ink">
              {formatUsd(pkg.msrp)}{' '}
              <span className="text-xs font-normal text-ink-soft">MSRP</span>
            </p>
          </article>
        ))}
      </div>
    </Section>
  )
}
