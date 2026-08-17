export function EmptyState({ title, description, action }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[#1c3050] bg-white px-6 py-12 text-center shadow-sm dark:bg-[#0c1728]"><h2 className="text-lg font-semibold text-slate-950 dark:text-[#ece5d6]">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}

export function ErrorState({ message, onRetry }) {
  return <div role="alert" className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-6 py-8 text-center shadow-sm"><h2 className="font-semibold text-rose-950 dark:text-rose-200">We could not load this information.</h2><p className="mt-2 text-sm text-rose-800 dark:text-rose-300">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-5 min-h-11 rounded-xl bg-rose-800 px-4 text-sm font-semibold text-white transition hover:bg-rose-900">Try again</button>}</div>
}
