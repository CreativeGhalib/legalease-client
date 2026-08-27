/**
 * Consent-gated GA4 analytics helpers (12-C).
 * GA4 script is NEVER loaded until the user explicitly accepts cookies.
 * All functions are no-ops when GA4 is not initialized.
 */

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
let initialized = false

export function initGA4() {
  if (!GA_ID || initialized || typeof window === 'undefined') return

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line no-undef
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
  initialized = true
}

/** Call after consent is already stored — e.g. on app boot if already accepted */
export function maybeInitGA4() {
  try {
    const consent = window.localStorage.getItem('legalEase-cookie-consent')
    if (consent === 'accepted') initGA4()
  } catch {
    // private mode
  }
}

export function trackPageview(path) {
  if (!initialized || !window.gtag) return
  window.gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(name, params = {}) {
  if (!initialized || !window.gtag) return
  window.gtag('event', name, params)
}
