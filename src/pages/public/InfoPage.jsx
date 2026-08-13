export default function InfoPage({ eyebrow, title, children }) {
  return <section className="mx-auto max-w-3xl"><p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">{eyebrow}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1><div className="mt-7 space-y-5 leading-7 text-slate-700">{children}</div></section>
}
