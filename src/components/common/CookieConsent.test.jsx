import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CookieConsent from './CookieConsent'

const STORAGE_KEY = 'legalEase-cookie-consent'

beforeEach(() => {
  window.localStorage.removeItem(STORAGE_KEY)
})

afterEach(cleanup)

describe('CookieConsent', () => {
  it('shows the banner until a choice is stored', () => {
    render(<CookieConsent />)
    expect(screen.getByRole('region', { name: 'Cookie notice' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Accept' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Deny' })).toBeTruthy()
  })

  it('persists Accept and hides the banner', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    expect(screen.queryByRole('region', { name: 'Cookie notice' })).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('accepted')
  })

  it('persists Deny and stays hidden on re-render', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }))
    expect(screen.queryByRole('region')).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('denied')

    cleanup()
    render(<CookieConsent />)
    expect(screen.queryByRole('region')).toBeNull()
  })
})
