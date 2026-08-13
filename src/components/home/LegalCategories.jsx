import { BriefcaseBusiness, Building2, Fingerprint, Gavel, Handshake, House, Scale, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const categories = [
  ['Family Law', Handshake], ['Criminal Law', Gavel], ['Corporate Law', Building2], ['Property Law', House],
  ['Immigration Law', Fingerprint], ['Employment Law', BriefcaseBusiness], ['Civil Litigation', Scale], ['Intellectual Property', ShieldCheck],
]

export default function LegalCategories() {
  const reduceMotion = useReducedMotion()
  return <section className="mt-20"><div className="max-w-2xl"><p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">PRACTICE AREAS</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Start with the legal matter at hand</h2><p className="mt-3 leading-7 text-slate-600">Choose an area of law to explore lawyers with relevant professional expertise.</p></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><motion.div className="contents" initial={reduceMotion ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>{categories.map(([label, Icon]) => <motion.div key={label} variants={reduceMotion ? undefined : { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}><Link to={`/lawyers?specialization=${encodeURIComponent(label)}&page=1`} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><Icon className="text-indigo-700" size={25} /><span className="text-sm font-semibold text-slate-900">{label}</span></Link></motion.div>)}</motion.div></div></section>
}
