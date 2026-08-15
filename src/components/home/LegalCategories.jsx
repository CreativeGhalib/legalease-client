import { BriefcaseBusiness, Building2, Fingerprint, Gavel, Handshake, House, Scale, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const categories = [
  ['Family Law', Handshake],
  ['Criminal Law', Gavel],
  ['Corporate Law', Building2],
  ['Property Law', House],
  ['Immigration Law', Fingerprint],
  ['Employment Law', BriefcaseBusiness],
  ['Civil Litigation', Scale],
  ['Intellectual Property', ShieldCheck],
]

/**
 * LegalCategories Component
 * 
 * Displays practice area categories with:
 * - 48px+ minimum touch targets
 * - Proper ARIA labels for screen readers
 * - Responsive grid (2 cols mobile, 4 cols desktop)
 * - Focus-visible states
 * - Semantic HTML structure
 */
export default function LegalCategories() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mt-20" id="practice-areas" aria-labelledby="practice-areas-heading">
      {/* Section header */}
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">
          PRACTICE AREAS
        </p>
        <h2 
          id="practice-areas-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-slate-950"
        >
          Start with the legal matter at hand
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          Choose an area of law to explore lawyers with relevant professional expertise.
        </p>
      </div>

      {/* Categories grid - Responsive layout */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        <>
          {categories.map(([label, Icon], index) => (
            <motion.div
              key={label}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduceMotion ? undefined : { duration: 0.3, delay: index * 0.05 }}
            >
              {/* Category Link - 48px+ minimum height for mobile */}
              <Link
                to={`/lawyers?specialization=${encodeURIComponent(label)}&page=1`}
                aria-label={`Browse ${label} lawyers`}
                className="group flex min-h-32 sm:min-h-40 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
              >
                {/* Icon */}
                <Icon
                  className="text-indigo-700 transition group-hover:scale-110"
                  size={28}
                  aria-hidden="true"
                />

                {/* Category label */}
                <span className="text-sm font-semibold text-slate-900 leading-snug">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </>
      </div>
    </section>
  )
}
