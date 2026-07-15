import type { BedOption } from '../../types/product'
import { formatUsd } from '../../lib/format'
import { Section } from '../common/Section'

interface BedOptionsProps {
  options: BedOption[]
}

export function BedOptions({ options }: BedOptionsProps) {
  return (
    <Section
      id="bed-options"
      title="Bed options & pricing"
      description="Configurations, SKUs, and MSRP. Search a SKU above to jump straight here."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {options.map((option) => (
          <article key={option.id} className="rounded-xl border border-line p-5">
            <h3 className="font-heading text-lg font-extrabold text-ink">{option.name}</h3>

            <p className="mt-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">
              Includes
            </p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {option.includes.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-canvas px-2 py-1 text-xs text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>

            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-xs tracking-wide text-ink-soft uppercase">
                  <th className="py-1 font-semibold">Configuration</th>
                  <th className="py-1 font-semibold">SKU</th>
                  <th className="py-1 text-right font-semibold">MSRP</th>
                </tr>
              </thead>
              <tbody>
                {option.variants.map((variant) => (
                  <tr key={variant.sku} className="border-t border-line">
                    <td className="py-2 text-ink">{variant.label}</td>
                    <td className="py-2 font-mono text-ink-soft">{variant.sku}</td>
                    <td className="py-2 text-right font-semibold text-ink">
                      {formatUsd(variant.msrp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>
    </Section>
  )
}
