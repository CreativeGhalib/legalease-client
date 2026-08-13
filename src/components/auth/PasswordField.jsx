import { useState } from 'react'

export default function PasswordField({ label, autoComplete, error, registration }) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${registration.name}-error`

  return (
    <label className="block text-sm font-medium text-slate-800">
      {label}
      <span className="relative mt-1 block">
        <input
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
          className="absolute inset-y-0 right-0 min-w-14 px-3 text-xs font-semibold text-slate-700 underline-offset-2 hover:text-slate-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-slate-900"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </span>
      {error && <span id={errorId} className="mt-1 block text-sm text-red-700">{error.message}</span>}
    </label>
  )
}
