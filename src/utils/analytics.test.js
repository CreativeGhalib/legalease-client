import { beforeEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { getConsentedUserProperties, clearAnalyticsUser } from './consentedUser'

vi.mock('./consentedUser', () => ({
  ensureAnalyticsUser: vi.fn(),
  getConsentedUserProperties: vi.fn(() => ({ lead_source: 'test' })),
  clearAnalyticsUser: vi.fn(),
  setLeadSource: vi.fn(),
}))

// GA_ID is captured at module evaluation — set the env var before importing.
let analytics
beforeAll(async () => {
  import.meta.env.VITE_GA4_MEASUREMENT_ID = 'G-TEST123'
  analytics = await import('./analytics')
})

beforeEach(() => {
  vi.mocked(getConsentedUserProperties).mockClear()
  vi.mocked(clearAnalyticsUser).mockClear()
  window.localStorage.clear()
  if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0
})

describe('analytics helpers', () => {
  it('never loads GA4 without consent, even when an ID exists', () => {
    analytics.maybeInitGA4()
    expect(window.gtag).toBeUndefined()
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull()
  })

  it('initializes and tracks page_view once consent is accepted', () => {
    window.localStorage.setItem('legalEase-cookie-consent', 'accepted')
    analytics.maybeInitGA4()
    analytics.trackPageview('/lawyers')

    const pv = window.dataLayer.find(args => args[1] === 'page_view')
    expect(pv).toBeTruthy()
    expect(pv[2]).toEqual({ page_path: '/lawyers' })
  })

  it('tracks key conversion events with consented user context merged', () => {
    analytics.trackEvent('hire_request', { lawyer_specialization: 'family law' })
    analytics.trackEvent('payment_success', { gateway: 'stripe' })

    const hire = window.dataLayer.find(args => args[1] === 'hire_request')
    const pay = window.dataLayer.find(args => args[1] === 'payment_success')
    expect(hire[2]).toEqual({ lawyer_specialization: 'family law', lead_source: 'test' })
    expect(pay[2]).toEqual({ gateway: 'stripe', lead_source: 'test' })
    expect(vi.mocked(getConsentedUserProperties)).toHaveBeenCalledTimes(2)
  })

  it('tracks sign_up with method and role params', () => {
    analytics.trackEvent('sign_up', { method: 'google', role: 'lawyer' })
    const event = window.dataLayer.find(args => args[1] === 'sign_up')
    expect(event[2]).toEqual({ method: 'google', role: 'lawyer', lead_source: 'test' })
  })

  it('clears stored analytics user data on logout', () => {
    analytics.logoutAnalytics()
    expect(vi.mocked(clearAnalyticsUser)).toHaveBeenCalled()
  })
})
