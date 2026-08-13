import { expect, test } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

async function assertNoHorizontalOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('admin dashboard routes are responsive, readable, and free of client errors', async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD for the authenticated dashboard audit.')
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/login')
  await page.getByLabel('Email').fill(adminEmail)
  await page.getByLabel('Password', { exact: true }).fill(adminPassword)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('admin account')).toBeVisible()
  errors.length = 0

  for (const path of ['/dashboard/admin/manage-users', '/dashboard/admin/manage-lawyers', '/dashboard/admin/all-transactions', '/dashboard/admin/analytics']) {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(path)
    await expect(page.getByText('We could not load this information.')).toHaveCount(0)
    await assertNoHorizontalOverflow(page)
  }

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/dashboard/admin/manage-users')
  const drawer = page.getByRole('button', { name: 'Open dashboard menu' })
  await drawer.click()
  await expect(page.getByRole('navigation', { name: 'Dashboard navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open dashboard menu' })).toBeVisible()
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
  await assertNoHorizontalOverflow(page)
  await expect(errors).toEqual([])
})
