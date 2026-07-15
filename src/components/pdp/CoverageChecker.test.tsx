import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoverageChecker } from './CoverageChecker'
import { CUBBY_2_PRODUCT } from '../../data/product'

/**
 * Protects the seam between the tested coverage logic and what Sarah actually sees.
 * Correct logic is worthless if the panel renders the wrong field or drops a group.
 */
describe('CoverageChecker', () => {
  it('shows both LMN groups and both guide links for a dual-group state', async () => {
    const user = userEvent.setup()
    render(<CoverageChecker documents={CUBBY_2_PRODUCT.documents} />)

    await user.selectOptions(screen.getByLabelText('State'), 'LA')

    // Result panel appears once the (mock-async) lookup resolves.
    expect(await screen.findByText(/coverage in Louisiana/i)).toBeInTheDocument()
    expect(screen.getByText('Group A')).toBeInTheDocument()
    expect(screen.getByText('Group B')).toBeInTheDocument()

    const groupALink = screen.getByRole('link', { name: /Group A/i })
    const groupBLink = screen.getByRole('link', { name: /Group B/i })
    expect(groupALink).toHaveAttribute('href', '#doc-lmn-guide-group-a')
    expect(groupBLink).toHaveAttribute('href', '#doc-lmn-guide-group-b')
  })

  it('shows the general Medicaid pathway note for an unlisted state', async () => {
    const user = userEvent.setup()
    render(<CoverageChecker documents={CUBBY_2_PRODUCT.documents} />)

    // Rhode Island is in an LMN group but not the Medicaid Requirements list.
    await user.selectOptions(screen.getByLabelText('State'), 'RI')

    expect(await screen.findByText(/coverage in Rhode Island/i)).toBeInTheDocument()
    expect(screen.getByText('General pathway')).toBeInTheDocument()
    expect(screen.getByText(/follow the general pathway/i)).toBeInTheDocument()
  })

  it('flags a Medicaid-listed state with state-specific requirements', async () => {
    const user = userEvent.setup()
    render(<CoverageChecker documents={CUBBY_2_PRODUCT.documents} />)

    await user.selectOptions(screen.getByLabelText('State'), 'TX')

    expect(await screen.findByText(/coverage in Texas/i)).toBeInTheDocument()
    expect(screen.getByText('State-specific requirements')).toBeInTheDocument()
  })
})
