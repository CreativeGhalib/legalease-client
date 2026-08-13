import { expect, test } from '@playwright/test'

const password = 'Phase12Stripe!2026'
const imagePath = 'C:/Projects/Project-10/Assets/stitch_legalease_visual_identity_system/a_professional_legal_portrait_of_a_mature_male_lawyer_in_his_50s_specializing/screen.png'

function email(role) { return `phase12-stripe-${role}-${Date.now()}@example.test` }

async function register(page, role, accountEmail) {
  await page.goto('/register')
  await page.getByLabel('Full name').fill(`Phase 12 ${role} payment`)
  await page.getByLabel('Email').fill(accountEmail)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password', { exact: true }).fill(password)
  await page.getByRole('radio', { name: role === 'user' ? 'Client' : 'Lawyer' }).check()
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

async function login(page, accountEmail) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(accountEmail)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
}

async function completeStripeCardPayment(page, accountEmail, holderName) {
  await page.getByPlaceholder('email@example.com').fill(accountEmail)
  await page.getByPlaceholder('1234 1234 1234 1234').fill('4242 4242 4242 4242')
  await page.getByPlaceholder('MM / YY').fill('12 / 34')
  await page.getByPlaceholder('CVC').fill('123')
  await page.getByPlaceholder('Full name on card').fill(holderName)
  await page.getByRole('button', { name: 'Pay', exact: true }).click()
  await page.waitForURL(/legalease-sand\.vercel\.app\/payment\/success/, { timeout: 60_000 })
  await expect(page.getByText(/successful|Verification successful/i)).toBeVisible({ timeout: 60_000 })
}

test('production Stripe publishing and hiring flow', async ({ browser }) => {
  test.setTimeout(300_000)
  const lawyerEmail = email('lawyer')
  const userEmail = email('user')
  const lawyerContext = await browser.newContext()
  const lawyer = await lawyerContext.newPage()
  const userContext = await browser.newContext()
  const user = await userContext.newPage()

  try {
    await register(lawyer, 'lawyer', lawyerEmail)
    await lawyer.goto('/dashboard/lawyer/manage-legal-profile')
    await lawyer.getByRole('button', { name: /professional photo/i }).click()
    await lawyer.locator('input[type=file]').setInputFiles(imagePath)
    await lawyer.getByLabel('Primary specialization').fill('Commercial law')
    await lawyer.getByLabel('Professional summary').fill('Phase 12 production Stripe verification profile for a controlled deployment test.')
    await lawyer.getByLabel('Consultation fee (USD)').fill('19.99')
    await lawyer.getByLabel('Experience (years)').fill('8')
    await lawyer.getByLabel('License number').fill(`P12-${Date.now()}`)
    await lawyer.getByLabel('Location').fill('Dhaka, Bangladesh')
    await lawyer.getByLabel('Languages').fill('Bangla, English')
    await lawyer.getByRole('button', { name: /create draft profile/i }).click()
    await expect(lawyer.getByText('Your profile contains the required publishing information.')).toBeVisible({ timeout: 45_000 })
    await lawyer.getByRole('button', { name: /Pay & Verify/i }).click()
    await lawyer.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 })
    await expect(lawyer).toHaveURL(/checkout\.stripe\.com/)
    await lawyer.waitForTimeout(15_000)
    await completeStripeCardPayment(lawyer, lawyerEmail, 'Phase Twelve Lawyer')
    await lawyer.getByRole('link', { name: 'Return to legal profile' }).click()
    await expect(lawyer.getByRole('button', { name: 'Publish profile' })).toBeVisible({ timeout: 30_000 })
    await lawyer.getByRole('button', { name: 'Publish profile' }).click()
    await expect(lawyer.getByText('Verified and publicly published.')).toBeVisible({ timeout: 30_000 })

    await register(user, 'user', userEmail)
    await user.goto('/lawyers?search=Phase%2012%20lawyer%20payment')
    await expect(user.getByRole('link', { name: 'View details' }).first()).toBeVisible({ timeout: 30_000 })
    await user.getByRole('link', { name: 'View details' }).first().click()
    await user.getByRole('button', { name: 'Hire lawyer' }).click()
    await user.getByRole('button', { name: 'Send hiring request' }).click()
    await expect(user.getByText('Request pending lawyer review')).toBeVisible({ timeout: 30_000 })

    await lawyer.goto('/dashboard/lawyer/hiring-history')
    await expect(lawyer.getByRole('button', { name: 'Accept' })).toBeVisible({ timeout: 30_000 })
    await lawyer.getByRole('button', { name: 'Accept' }).click()
    await lawyer.getByRole('button', { name: /Confirm decision/i }).click()
    await expect(lawyer.getByText('Request: Accepted')).toBeVisible({ timeout: 30_000 })

    await user.goto('/dashboard/user/hiring-history')
    await expect(user.getByRole('button', { name: /Pay consultation fee/i })).toBeVisible({ timeout: 30_000 })
    await user.getByRole('button', { name: /Pay consultation fee/i }).click()
    await user.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 })
    await user.waitForTimeout(15_000)
    await completeStripeCardPayment(user, userEmail, 'Phase Twelve User')
    await user.getByRole('link', { name: 'Return to my hiring requests' }).click()
    await expect(user.getByText('Payment: Paid')).toBeVisible({ timeout: 30_000 })

    await lawyer.goto('/dashboard/lawyer/hiring-history')
    await expect(lawyer.getByText('Payment: Paid')).toBeVisible({ timeout: 30_000 })
    await lawyer.goto('/dashboard/lawyer/transactions')
    await expect(lawyer.getByText('Hiring consultation fee')).toBeVisible({ timeout: 30_000 })
  } finally {
    await lawyerContext.close()
    await userContext.close()
  }
})
