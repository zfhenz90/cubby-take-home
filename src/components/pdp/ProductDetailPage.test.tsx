import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductDetailPage } from './ProductDetailPage'

/**
 * Smoke test for the whole page: it mounts the full component tree, shows a loading
 * state first, then renders the product once the mock service resolves. This catches
 * wiring/runtime regressions across every section in one place.
 */
describe('ProductDetailPage', () => {
  it('shows loading, then renders the product and its key sections', async () => {
    render(<ProductDetailPage />)

    // Loading state is visible before the mock service resolves.
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Product name (h1) appears after load.
    expect(
      await screen.findByRole('heading', { level: 1, name: /Cubby 2 Bed/i }),
    ).toBeInTheDocument()

    // A representative sample of sections rendered.
    expect(
      screen.getByRole('heading', { name: /Coverage & Medicaid by state/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Bed options & pricing/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Documents & resources/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Supplier incentives/i }),
    ).toBeInTheDocument()
  })
})
