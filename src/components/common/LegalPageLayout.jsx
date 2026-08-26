export default function LegalPageLayout({ eyebrow = 'LEGAL', title, updated = '26 August 2026', children }) {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-[#ece5d6]">{title}</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-[#a8bbcc]">Last updated {updated}</p>
      <div className="mt-9 space-y-10">{children}</div>
    </section>
  )
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-[#ece5d6]">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700 dark:text-[#a8bbcc] sm:text-base">
        {children}
      </div>
    </section>
  )
}
