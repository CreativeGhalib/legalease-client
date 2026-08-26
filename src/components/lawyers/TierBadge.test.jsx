import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import TierBadge from './TierBadge'
import LawyerCard from './LawyerCard'

afterEach(cleanup)

const baseLawyer = {
  id: '507f1f77bcf86cd799439011',
  fullName: 'Adv. Tier Test',
  specialization: 'Criminal Law',
  consultationFeeMinor: 25000,
  availability: 'available',
}

describe('TierBadge', () => {
  it('renders each known tier with a capitalized label', () => {
    for (const tier of ['bronze', 'silver', 'gold']) {
      render(<TierBadge tier={tier} />)
      expect(screen.getByText(tier)).toBeTruthy()
      cleanup()
    }
  })

  it('renders nothing for missing or unknown tiers', () => {
    const { container: empty } = render(<TierBadge tier={undefined} />)
    const { container: unknown } = render(<TierBadge tier="platinum" />)
    expect(empty.firstChild).toBeNull()
    expect(unknown.firstChild).toBeNull()
  })
})

describe('LawyerCard tier integration', () => {
  it('shows the tier chip beside availability when present and omits it otherwise', () => {
    const { container: withTier } = render(
      <MemoryRouter><LawyerCard lawyer={{ ...baseLawyer, tier: 'silver' }} compact /></MemoryRouter>,
    )
    expect(withTier.textContent).toContain('silver')

    const { container: withoutTier } = render(
      <MemoryRouter><LawyerCard lawyer={baseLawyer} compact /></MemoryRouter>,
    )
    expect(withoutTier.textContent).not.toContain('silver')
  })
})
