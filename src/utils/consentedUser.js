/**
 * Consent-scoped analytics user context.
 *
 * Stores a random analytics token plus the signup-time lead source in
 * localStorage ONLY after the user accepts the cookie banner, so no
 * identifier exists before consent. The token is not the account id,
 * not an email, and not reversible to a user — it only lets GA4 reports
 * group events from the same browser.
 */

const TOKEN_KEY = 'legalEase-analytics-token'
const LEAD_KEY = 'legalEase-lead-source'

function safeGet(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null // private mode / storage disabled
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore — analytics grouping is best-effort
  }
}

function randomToken() {
  const bytes = new Uint8Array(16)
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

/** Called from initGA4() — only runs after consent, never before. */
export function ensureAnalyticsUser() {
  if (!safeGet(TOKEN_KEY)) safeSet(TOKEN_KEY, randomToken())
}

/**
 * User-scoped GA4 event params. Returns safe, non-PII fields:
 * - analytics_token: random per-browser id (grouping only)
 * - lead_source: signup-time acquisition source, if captured
 */
export function getConsentedUserProperties() {
  const props = {}
  const token = safeGet(TOKEN_KEY)
  if (token) props.analytics_token = token
  const lead = safeGet(LEAD_KEY)
  if (lead) props.lead_source = lead
  return props
}

/** Called on logout so a shared computer does not mix sessions. */
export function clearAnalyticsUser() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

/** Records the signup-time acquisition source (called from lead capture). */
export function setLeadSource(source) {
  if (source) safeSet(LEAD_KEY, String(source).slice(0, 60))
}
