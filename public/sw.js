/**
 * LegalEase Service Worker — minimal offline shell (11-I-lite)
 * Strategy:
 *  - Page navigations: network-first, cached fallback
 *  - /api/* routes: never cached — always network
 *  - All other GET requests: stale-while-revalidate
 * SW is versioned via CACHE name — bump to force refresh on deploy.
 */

const CACHE = 'legalease-shell-v2'
const SHELL = ['/offline.html']

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  )
})

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  // Never intercept API calls — must always reach the network
  if (request.url.includes('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(async () => (
          (await caches.match(request)) || (await caches.match('/offline.html'))
        ))
    )
    return
  }

  const refreshed = fetch(request)
    .then((response) => {
      if (response.ok && response.type === 'basic') {
        const clone = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
      }
      return response
    })

  event.respondWith(
    caches.match(request)
      .then((cached) => cached || refreshed)
      .catch(() => caches.match('/offline.html'))
  )

  event.waitUntil(refreshed.catch(() => undefined))
})
