export default function FutureDashboardPage({ title, phase }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">Planned workspace</p><h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1><p className="mt-3 max-w-xl text-slate-600">This area will be implemented in {phase}. LegalEase does not show placeholder statistics or simulated records.</p></section>
}
