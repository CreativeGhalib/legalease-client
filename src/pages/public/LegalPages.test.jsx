import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import TermsOfServicePage from './TermsOfServicePage'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import RefundPolicyPage from './RefundPolicyPage'
import AttorneyPrivilegeDisclaimer, { DISCLAIMER_TEXT } from '../../components/common/AttorneyPrivilegeDisclaimer'
import SiteFooter from '../../components/common/SiteFooter'

afterEach(cleanup)

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('legal compliance pages', () => {
  it('Terms of Service establishes marketplace status and governing law', () => {
    renderWithRouter(<TermsOfServicePage />)
    expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeTruthy()
    expect(screen.getByText(/not a law firm/i)).toBeTruthy()
    expect(screen.getByText(/courts of Dhaka/i)).toBeTruthy()
  })

  it('Privacy Policy covers processors, retention, and DSA acknowledgment', () => {
    renderWithRouter(<PrivacyPolicyPage />)
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeTruthy()
    expect(screen.getByText(/MongoDB Atlas/i)).toBeTruthy()
    expect(screen.getAllByText(/Digital Security Act 2018/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/outside Bangladesh/i)).toBeTruthy()
  })

  it('Refund Policy states verification fee and consultation fee truthfully', () => {
    renderWithRouter(<RefundPolicyPage />)
    expect(screen.getByRole('heading', { name: 'Refund Policy' })).toBeTruthy()
    expect(screen.getByText(/non-refundable/i)).toBeTruthy()
    expect(screen.getByText(/never results in a charge/i)).toBeTruthy()
  })

  it('renders the attorney-client privilege disclaimer verbatim', () => {
    renderWithRouter(<AttorneyPrivilegeDisclaimer />)
    const note = screen.getByRole('note')
    expect(note.textContent).toContain(DISCLAIMER_TEXT)
  })

  it('SiteFooter links all legal pages', () => {
    renderWithRouter(<SiteFooter />)
    for (const label of ['Terms of Service', 'Privacy Policy', 'Refund Policy']) {
      const link = screen.getByText(label)
      expect(link.getAttribute('href')).toMatch(/^\/(terms|privacy|refund-policy)$/)
    }
  })
})
