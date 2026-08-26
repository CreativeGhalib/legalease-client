import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './i18n/i18n'
import { AuthProvider } from './auth/AuthProvider'
import AppErrorBoundary from './components/common/AppErrorBoundary'
import ToastViewport from './components/common/ToastViewport'
import './index.css'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  import('@sentry/react')
    .then((Sentry) => {
      Sentry.init({ dsn: sentryDsn })
      window.__legaleaseSentry = Sentry
    })
    .catch(() => undefined)
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary><AuthProvider><App /><ToastViewport /></AuthProvider></AppErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)
