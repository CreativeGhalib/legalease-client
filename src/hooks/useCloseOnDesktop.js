import { useEffect, useRef } from 'react'

const desktopQuery = '(min-width: 1024px)'

export default function useCloseOnDesktop(onDesktop) {
  const onDesktopRef = useRef(onDesktop)
  onDesktopRef.current = onDesktop

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const media = window.matchMedia(desktopQuery)
    const closeAtDesktop = () => { if (media.matches) onDesktopRef.current?.() }
    closeAtDesktop()
    media.addEventListener('change', closeAtDesktop)
    return () => media.removeEventListener('change', closeAtDesktop)
  }, [])
}
