import { expect, test } from '@playwright/test'

function auditEmail(role) {
  return `phase12-${role}-${Date.now()}@example.test`
}

async function createAccount(page, role) {
  const email = auditEmail(role)
  const password = 'Phase12Audit!2026'
  await page.goto('/register')
  await page.getByLabel('Full name').fill(`Phase 12 ${role} audit`)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password', { exact: true }).fill(password)
  await page.getByRole('radio', { name: role === 'user' ? 'Client' : 'Lawyer' }).check()
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

async function assertNoHorizontalOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

for (const [role, routes] of Object.entries({
  user: ['/dashboard', '/dashboard/user/hiring-history', '/dashboard/user/update-profile', '/dashboard/user/comments', '/dashboard/user/transactions'],
  lawyer: ['/dashboard', '/dashboard/lawyer/hiring-history', '/dashboard/lawyer/manage-legal-profile', '/dashboard/lawyer/transactions'],
})) {
  test(`${role} production dashboard supports reload, mobile navigation, focus, and route access`, async ({ page }) => {
    const errors = []
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('pageerror', (error) => errors.push(error.message))

    await createAccount(page, role)
    errors.length = 0

    for (const path of routes) {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(path)
      await expect(page).not.toHaveURL(/\/login|\/unauthorized/)
      await assertNoHorizontalOverflow(page)
      await page.reload()
      await expect(page).not.toHaveURL(/\/login|\/unauthorized/)
      await assertNoHorizontalOverflow(page)
    }

    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(routes[0])
    await page.getByRole('button', { name: 'Open dashboard menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Dashboard navigation' })).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
    await assertNoHorizontalOverflow(page)
    await expect(errors).toEqual([])
  })
}
