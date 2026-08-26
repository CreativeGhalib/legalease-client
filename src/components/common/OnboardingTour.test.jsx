import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import OnboardingTour from './OnboardingTour'

vi.mock('driver.js', () => ({ driver: vi.fn(() => ({ drive: vi.fn() })) }))

const { driver } = await import('driver.js')

function seedStorage(key, value) {
  if (value === null) window.localStorage.removeItem(key)
  else window.localStorage.setItem(key, value)
}

const steps = [
  { element: '#tour-target-a', popover: { title: 'Step A', description: 'First' } },
  { element: '#tour-target-b', popover: { title: 'Step B', description: 'Second' } },
]

describe('OnboardingTour', () => {
  beforeEach(() => {
    driver.mockClear()
    seedStorage('legalEase-tour-completed-test', null)
    document.body.innerHTML = '<div id="tour-target-a"></div><div id="tour-target-b"></div>'
  })

  afterEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('auto-drives once after the settle delay when every target exists', async () => {
    const first = render(<OnboardingTour tourKey="test" steps={steps} autoStartDelay={10} />)
    await waitFor(() => expect(driver).toHaveBeenCalledTimes(1), { timeout: 2000 })
    const config = driver.mock.calls[0][0]
    expect(config.animate).toBe(true)
    expect(config.steps).toHaveLength(2)

    // Simulate the user finishing/closing the real tour, which persists the flag.
    config.onDestroyed?.()
    first.unmount()

    render(<OnboardingTour tourKey="test" steps={steps} autoStartDelay={10} />)
    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(driver).toHaveBeenCalledTimes(1)
  })

  it('aborts silently and marks completion when a selector is missing', async () => {
    document.querySelector('#tour-target-b').remove()
    render(<OnboardingTour tourKey="test-missing" steps={steps} autoStartDelay={10} />)
    await waitFor(() => {
      expect(window.localStorage.getItem('legalEase-tour-completed-test-missing')).toBe('1')
    }, { timeout: 2000 })
    expect(driver).not.toHaveBeenCalled()
  })

  it('never starts for accounts that already completed the tour', async () => {
    seedStorage('legalEase-tour-completed-test-done', '1')
    render(<OnboardingTour tourKey="test-done" steps={steps} autoStartDelay={10} />)
    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(driver).not.toHaveBeenCalled()
  })
})
