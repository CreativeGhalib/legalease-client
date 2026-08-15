import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'

const THEME_KEY = 'legalEase-theme'

export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedTheme = window.localStorage.getItem(THEME_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextTheme = storedTheme || (prefersDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }, [])

  return <RouterProvider router={router} />
}
