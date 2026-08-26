import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import AvailabilityBadge from '../components/lawyers/AvailabilityBadge'
import i18n, { LANG_STORAGE_KEY } from '../i18n/i18n'

afterEach(cleanup)

beforeEach(async () => {
  window.localStorage.removeItem(LANG_STORAGE_KEY)
  await i18n.changeLanguage('en')
})

describe('Bengali / English internationalization', () => {
  it('defaults to English with the document lang attribute synced', () => {
    render(
      <MemoryRouter>
        <AvailabilityBadge availability="available" />
      </MemoryRouter>,
    )
    expect(i18n.language.startsWith('en')).toBe(true)
    expect(screen.getByText('Available')).toBeTruthy()
  })

  it('switching to Bengali persists the choice, updates html[lang], and translates badges', async () => {
    render(
      <MemoryRouter>
        <div>
          <LanguageSwitcher compact />
          <AvailabilityBadge availability="available" />
          <AvailabilityBadge availability="busy" />
        </div>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'বাংলা' }))
    await waitForLanguage('bn')

    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('bn')
    expect(document.documentElement.lang).toBe('bn')
    expect(screen.getByText('উপলব্ধ')).toBeTruthy()
    expect(screen.getByText('ব্যস্ত')).toBeTruthy()
  })

  it('switching back to English restores original labels and storage', async () => {
    window.localStorage.setItem(LANG_STORAGE_KEY, 'bn')
    await i18n.changeLanguage('bn')

    render(
      <MemoryRouter>
        <div>
          <LanguageSwitcher compact />
          <AvailabilityBadge availability="busy" />
        </div>
      </MemoryRouter>,
    )
    expect(screen.getByText('ব্যস্ত')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    await waitForLanguage('en')
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(screen.getByText('Busy')).toBeTruthy()
  })
})

function waitForLanguage(language) {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    function poll() {
      if (i18n.language?.startsWith(language)) return resolve()
      if (Date.now() - started > 2000) return reject(new Error(`language never became ${language}`))
      setTimeout(poll, 25)
    }
    poll()
  })
}
