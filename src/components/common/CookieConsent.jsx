import { useState } from 'react'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'legalEase-cookie-consent'

function readStoredChoice() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return 'accepted'
  }
}

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => readStoredChoice())

  function decide(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* private mode — session-only */
    }
    setChoice(value)
  }

  if (choice) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-[#d8ccb8] bg-[#fdf9f2]/97 p-4 shadow-xl backdrop-blur sm:inset-x-6 sm:bottom-5 dark:border-[#2a3850] dark:bg-[#161d27]/95"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <p className="flex min-w-0 flex-1 items-start gap-2 text-xs leading-5 text-slate-700 dark:text-[#a8bbcc]">
          <Cookie size={15} className="mt-0.5 shrink-0 text-[#d4a843]" aria-hidden="true" />
          LegalEase uses one essential sign-in cookie and a few local preferences (theme, shortlist).
          No advertising or tracking cookies.
        </p>
        <span className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="min-h-10 rounded-lg border border-slate-300 dark:border-[#1c3050] px-4 text-sm font-semibold text-slate-600 dark:text-[#a8bbcc]"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="min-h-10 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800"
          >
            Accept
          </button>
        </span>
      </div>
      <p className="mt-2 text-[11px] text-slate-400 dark:text-[#7090a4]">Details in our Privacy Policy.</p>
    </div>
  )
}
