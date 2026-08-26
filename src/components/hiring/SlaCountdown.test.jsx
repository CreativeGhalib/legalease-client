import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import SlaCountdown from './SlaCountdown'

afterEach(cleanup)

const HOUR = 60 * 60 * 1000

describe('SlaCountdown', () => {
  it('shows a neutral countdown well inside the window', () => {
    render(<SlaCountdown expiresAt={new Date(Date.now() + 40 * HOUR)} />)
    expect(screen.getByText(/Respond within 3[89]h \d+m/)).toBeTruthy()
  })

  it('turns urgent red inside one hour and closes at expiry', () => {
    const { container: urgent } = render(<SlaCountdown expiresAt={new Date(Date.now() + 30 * 60 * 1000)} />)
    expect(urgent.textContent).toMatch(/Respond within \d{1,2}m/)
    expect(urgent.firstChild.className).toContain('rose')

    const { container: closed } = render(<SlaCountdown expiresAt={new Date(Date.now() - 1000)} />)
    expect(closed.textContent).toContain('SLA window closed')
  })

  it('renders nothing for grandfathered requests without a deadline', () => {
    const { container } = render(<SlaCountdown expiresAt={null} />)
    expect(container.firstChild).toBeNull()
  })
})
