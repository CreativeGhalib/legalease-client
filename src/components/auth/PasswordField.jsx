import { useState } from 'react'

export default function PasswordField({ label, autoComplete, error, registration }) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${registration.name}-error`

  return (
    <div className="block text-sm font-medium text-slate-800">
      <label htmlFor={registration.name}>{label}</label>
      <span className="relative mt-1 block">
        <input
          id={registration.name}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-h-11 w-full rounded-md border border-slate-300 py-2 pl-3 pr-16 text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 grid min-w-11 place-items-center text-slate-600 transition hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-slate-900"
        >
          {isVisible ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4.3 9.7 6.1a1.9 1.9 0 0 1 0 1.8 17 17 0 0 1-3.2 3.9M6.2 6.2A17.2 17.2 0 0 0 2.3 10a1.9 1.9 0 0 0 0 1.8C3.3 13.7 6.8 18 12 18c.9 0 1.8-.1 2.6-.4" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.3 10.1C3.3 8.3 6.8 4 12 4s8.7 4.3 9.7 6.1a1.9 1.9 0 0 1 0 1.8C20.7 13.7 17.2 18 12 18S3.3 13.7 2.3 11.9a1.9 1.9 0 0 1 0-1.8Z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          )}
        </button>
      </span>
      {error && <span id={errorId} className="mt-1 block text-sm text-red-700">{error.message}</span>}
    </div>
  )
}
