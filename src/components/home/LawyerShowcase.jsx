import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState } from '../common/QueryFeedback'
import LawyerCard from '../lawyers/LawyerCard'
import LawyerCardSkeleton from '../lawyers/LawyerCardSkeleton'

export default function LawyerShowcase({ eyebrow, title, description, lawyersQuery, allLink, topExperts = false }) {
  const reduceMotion = useReducedMotion()
  const items = lawyersQuery.data ?? []
  return <section className="mt-20"><div className="flex flex-wrap items-end justify-between gap-4"><div className="max-w-2xl"><p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{description}</p></div>{allLink && <Link className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50" to={allLink}>Browse all lawyers <ArrowRight size={17} /></Link>}</div>{lawyersQuery.isLoading ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">{Array.from({ length: topExperts ? 3 : 6 }, (_, index) => <LawyerCardSkeleton key={index} />)}</div> : lawyersQuery.isError ? <div className="mt-8"><ErrorState message="Please try loading this section again." onRetry={() => lawyersQuery.refetch()} /></div> : items.length === 0 ? <div className="mt-8"><EmptyState title="Profiles will appear here soon" description="Published lawyer profiles are shown here as they become available." /></div> : <motion.div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3" initial={reduceMotion ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>{items.map((lawyer) => <motion.div key={lawyer.id} variants={reduceMotion ? undefined : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}><LawyerCard lawyer={lawyer} compact showHireCount={topExperts} /></motion.div>)}</motion.div>}</section>
}
