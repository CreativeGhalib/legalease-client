import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState } from '../common/QueryFeedback'
import LawyerCard from '../lawyers/LawyerCard'
import LawyerCardSkeleton from '../lawyers/LawyerCardSkeleton'

/**
 * LawyerShowcase Component
 * 
 * Displays a grid of lawyer cards with:
 * - Loading states with skeleton loaders
 * - Error handling with retry capability
 * - Empty state messaging
 * - Responsive grid layout
 * - Lazy loading on scroll
 */
export default function LawyerShowcase({
  eyebrow,
  title,
  description,
  lawyersQuery,
  allLink,
  topExperts = false,
}) {
  const reduceMotion = useReducedMotion()
  const items = lawyersQuery.data ?? []

  return (
    <section className="mt-20" aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Section header */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-indigo-700">
            {eyebrow}
          </p>
          <h2 
            id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-950"
          >
            {title}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            {description}
          </p>
        </div>

        {/* Browse All Link */}
        {allLink && (
          <Link
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 transition"
            to={allLink}
            aria-label={`Browse all ${title.toLowerCase()}`}
          >
            Browse all lawyers
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Content Area - Loading, Error, Empty, or Success */}
      {lawyersQuery.isLoading ? (
        // Loading State - Skeleton loaders
        <div 
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3"
          role="status"
          aria-live="polite"
          aria-label="Loading lawyers"
        >
          {Array.from({ length: topExperts ? 3 : 6 }, (_, index) => (
            <LawyerCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : lawyersQuery.isError ? (
        // Error State - With retry capability
        <div className="mt-8" role="alert" aria-live="assertive">
          <ErrorState
            message="We encountered an issue loading this section. Please try again."
            onRetry={() => lawyersQuery.refetch()}
          />
        </div>
      ) : items.length === 0 ? (
        // Empty State - No lawyers available
        <div className="mt-8">
          <EmptyState
            title="Profiles will appear here soon"
            description={`Published ${title.toLowerCase()} are shown here as they become available. Check back later or browse other practice areas.`}
            action={
              allLink ? (
                <Link
                  to="/lawyers"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 text-white px-4 py-2 font-semibold hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 transition"
                >
                  Browse all lawyers
                </Link>
              ) : null
            }
          />
        </div>
      ) : (
        // Success State - Display lawyer cards
        <motion.div
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {items.map((lawyer) => (
            <motion.div
              key={lawyer.id}
              variants={
                reduceMotion
                  ? undefined
                  : {
                      hidden: { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0 },
                    }
              }
            >
              <LawyerCard
                lawyer={lawyer}
                compact
                showHireCount={topExperts}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
