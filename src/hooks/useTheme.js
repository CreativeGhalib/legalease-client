import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'legalEase-theme'

/**
 * Reads the theme already applied to <html> by the blocking inline script
 * in index.html, so React never has to guess or re-derive a default here.
 * This keeps a single source of truth and avoids the light/dark flash.
 */
function readAppliedTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function useTheme() {
  const [theme, setTheme] = useState(readAppliedTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme }
}
