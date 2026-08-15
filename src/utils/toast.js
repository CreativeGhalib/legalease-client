export const TOAST_EVENT = 'legalease:toast'

let lastToast = { message: '', shownAt: 0, variant: 'error' }

function dispatchToast(message, variant) {
  if (typeof window === 'undefined') return
  const safeMessage = typeof message === 'string' && message.trim()
    ? message.trim()
    : variant === 'success'
      ? 'Your update was saved.'
      : variant === 'info'
        ? 'Update queued.'
        : 'Something went wrong. Please try again.'
  const now = Date.now()
  if (lastToast.message === safeMessage && lastToast.variant === variant && now - lastToast.shownAt < 2500) return
  lastToast = { message: safeMessage, shownAt: now, variant }
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message: safeMessage, variant } }))
}

export function showErrorToast(message) {
  dispatchToast(message, 'error')
}

export function showSuccessToast(message) {
  dispatchToast(message, 'success')
}

export function showInfoToast(message) {
  dispatchToast(message, 'info')
}
