/**
 * Production smoke test — GA4 consent gate + key events + core flows.
 * Run against the deployed site:
 *   E2E_BASE_URL=https://legalease-sand.vercel.app npx playwright test e2e/production-smoke-ga4.spec.js
 *
 * Assertions read window.dataLayer directly, so no GA dashboard access is
 * needed. A unique timestamped account is created and cleaned up via the
 * public API where possible.
 */
import { test, expect } from '@playwright/test'

const BASE = process.env.E2E_BASE_URL || 'https://legalease-sand.vercel.app'
const STAMP = Date.now()
const TEST_EMAIL = `smoke_${STAMP}@example.com`
const TEST_PASSWORD = 'SmokeTest-Passw0rd!23'

async function acceptCookies(page) {
  const banner = page.getByRole('button', { name: 'Accept' })
  if (await banner.isVisible().catch(() => false)) await banner.click()
}

async function dataLayerEvents(page) {
  return page.evaluate(() =>
    (window.dataLayer || []).map(args => (Array.from(args)[1] ?? Array.from(args)[0])),
  )
}

test.describe('GA4 consent-gated loading', () => {
  test('gtag script does NOT load before consent', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const gtagScripts = await page.evaluate(() =>
      document.querySelectorAll('script[src*="googletagmanager"]').length,
    )
    expect(gtagScripts).toBe(0)
  })

  test('gtag loads + page_view fires after Accept', async ({ page }) => {
    await page.goto('/')
    await acceptCookies(page)
    await page.waitForTimeout(1500)
    const loaded = await page.evaluate(() =>
      Boolean(document.querySelector('script[src*="googletagmanager"]')),
    )
    expect(loaded).toBe(true)
    const events = await dataLayerEvents(page)
    expect(events).toContain('page_view')
  })
})

test.describe('signup → login → hire flow', () => {
  let lawyerUrl = ''

  test('register a fresh client account (sign_up event)', async ({ page }) => {
    await page.goto('/register')
    await acceptCookies(page)
    await page.getByLabel('Full name').fill(`Smoke Test ${STAMP}`)
    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByLabel('Password', { exact: false }).first().fill(TEST_PASSWORD)
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD)
    await page.getByText('Client', { exact: true }).first().click()
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.waitForURL(/dashboard/, { timeout: 15_000 })
    const events = await dataLayerEvents(page)
    expect(events).toContain('sign_up')
  })

  test('login with the fresh account', async ({ page, request }) => {
    // ensure account exists even if the register test ran in a fresh context
    await request.post(`${process.env.E2E_API_URL || 'https://legalease-api.vercel.app'}/api/v1/auth/register`, {
      data: {
        fullName: `Smoke Test ${STAMP}`,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        confirmPassword: TEST_PASSWORD,
        role: 'user',
      },
    })
    await page.goto('/login')
    await acceptCookies(page)
    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByLabel('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL(/dashboard/, { timeout: 15_000 })
    await expect(page.getByText(/Smoke Test/).first()).toBeVisible()
  })

  test('hire request fires hire_request event', async ({ page, request }) => {
    // pick an available lawyer from the public API
    const res = await request.get(`${process.env.E2E_API_URL || 'https://legalease-api.vercel.app'}/api/v1/lawyers?availability=available&limit=1`)
    const list = await res.json()
    const lawyer = list?.data?.lawyers?.[0] ?? list?.data?.items?.[0] ?? list?.data?.[0]
    test.skip(!lawyer, 'no available lawyer in production data')
    lawyerUrl = `/lawyers/${lawyer.id ?? lawyer._id}`

    await page.goto('/login')
    await acceptCookies(page)
    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByLabel('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL(/dashboard/, { timeout: 15_000 })

    await page.goto(lawyerUrl)
    await page.getByRole('button', { name: 'Hire lawyer' }).click()
    await page.getByRole('button', { name: 'Send hiring request' }).click()
    await page.getByText('Demo email notification queued').waitFor({ timeout: 10_000 })
    const events = await dataLayerEvents(page)
    expect(events).toContain('hire_request')
  })
})
