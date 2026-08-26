import { useCallback, useState } from 'react'

const BASE_KEY = 'legalEase-tour-completed'

export function useOnboarding(tourKey) {
  const storageKey = `${BASE_KEY}-${tourKey}`
  const [completed, setCompleted] = useState(() => {
    try {
      return window.localStorage.getItem(storageKey) === '1'
    } catch {
      return true
    }
  })

  const markComplete = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      /* private mode — session-only completion */
    }
    setCompleted(true)
  }, [storageKey])

  const restart = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setCompleted(false)
  }, [storageKey])

  return { completed, markComplete, restart, storageKey }
}
