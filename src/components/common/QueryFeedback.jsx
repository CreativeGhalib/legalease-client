export function EmptyState({ title, description, action }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h2 className="text-lg font-semibold text-slate-950">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}

export function ErrorState({ message, onRetry }) {
  return <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center"><h2 className="font-semibold text-rose-950">We could not load this information.</h2><p className="mt-2 text-sm text-rose-800">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900">Try again</button>}</div>
}
