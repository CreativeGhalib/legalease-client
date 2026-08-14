import { useEffect } from 'react'

// Keeps the page behind a drawer or dialog stationary on touch devices.
export default function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [locked])
}
