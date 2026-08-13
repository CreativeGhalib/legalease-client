export default function AuthPageLayout({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">LegalEase account</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
      {children}
    </section>
  )
}
