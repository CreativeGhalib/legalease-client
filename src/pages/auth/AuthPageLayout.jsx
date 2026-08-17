export default function AuthPageLayout({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 shadow-lg shadow-slate-200/50 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">LegalEase account</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-[#ece5d6] sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#a8bbcc]">{subtitle}</p>
      {children}
    </section>
  )
}
