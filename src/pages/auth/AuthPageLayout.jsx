export default function AuthPageLayout({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-medium text-slate-600">LegalEase account</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      {children}
    </section>
  )
}
