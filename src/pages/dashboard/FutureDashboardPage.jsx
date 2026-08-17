export default function FutureDashboardPage({ title, phase }) {
  return <section className="rounded-2xl border border-slate-200 dark:border-[#1c3050] bg-white dark:bg-[#0c1728] p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">Planned workspace</p><h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-[#ece5d6]">{title}</h1><p className="mt-3 max-w-xl text-slate-600 dark:text-[#a8bbcc]">This area will be implemented in {phase}. LegalEase does not show placeholder statistics or simulated records.</p></section>
}
