export const TOAST_EVENT = 'legalease:toast'

let lastToast = { message: '', shownAt: 0 }

export function showErrorToast(message) {
  if (typeof window === 'undefined') return
  const safeMessage = typeof message === 'string' && message.trim()
    ? message.trim()
    : 'Something went wrong. Please try again.'
  const now = Date.now()
  if (lastToast.message === safeMessage && now - lastToast.shownAt < 2500) return
  lastToast = { message: safeMessage, shownAt: now }
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message: safeMessage } }))
}
