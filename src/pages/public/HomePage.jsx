import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BadgeCheck, Scale, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedLawyers, getTopLawyers } from '../../api/lawyerDiscoveryApi'
import LawyerShowcase from '../../components/home/LawyerShowcase'
import LegalCategories from '../../components/home/LegalCategories'

/**
 * HomePage Component
 * 
 * Main public landing page with:
 * - Accessible hero section with proper text wrapping
 * - Safe area padding for iOS notches
 * - Optimized button hierarchy (single primary CTA)
 * - Responsive design for all viewports
 * - Proper ARIA labels and focus management
 * - Lazy-loaded featured lawyers section
 */
export default function HomePage() {
  const reduceMotion = useReducedMotion()
  const featuredQuery = useQuery({ queryKey: ['featured-lawyers'], queryFn: getFeaturedLawyers })
  const topQuery = useQuery({ queryKey: ['top-lawyers'], queryFn: getTopLawyers })
  const rise = reduceMotion ? undefined : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

  return (
    <>
      {/* Skip to content link for screen readers and keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-indigo-700 focus:text-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Hero Section - Fixed: text truncation, safe areas, touch targets */}
      <section 
        className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-4 py-16 text-white shadow-xl sm:px-6 sm:py-24 md:px-10 md:py-32 safe-area-inset-padding"
        style={{
          paddingTop: 'max(var(--safe-area-inset-top, 0px), 4rem)',
          paddingBottom: 'max(var(--safe-area-inset-bottom, 0px), 4rem)'
        }}
      >
        {/* Gradient background */}
        <div 
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.5),transparent_25%),radial-gradient(circle_at_25%_80%,rgba(245,158,11,0.22),transparent_30%)]" 
          aria-hidden="true"
        />

        {/* Decorative scales icon - responsive sizing */}
        <div 
          className="absolute right-4 top-6 sm:right-6 sm:top-10 md:right-14"
          aria-hidden="true"
        >
          <div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-white/5 text-indigo-200 sm:h-40 sm:w-40 md:h-56 md:w-56">
            <Scale className="h-12 w-12 sm:h-16 sm:w-16 md:h-22 md:w-22" strokeWidth={1.2} />
          </div>
        </div>

        {/* Hero content - properly responsive text */}
        <motion.div 
          className="relative z-10 max-w-2xl pr-20 sm:pr-32 md:pr-0"
          {...rise}
          transition={{ duration: 0.55 }}
        >
          {/* Eyebrow text */}
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-200 sm:text-sm">
            LEGAL CLARITY, HUMANLY CONNECTED
          </p>

          {/* Main headline - fluid typography, no truncation */}
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl break-words">
            Find &amp; Hire Expert Legal Counsel
          </h1>

          {/* Descriptive text - optimized for mobile readability */}
          <p className="mt-4 max-w-xl text-sm leading-7 sm:mt-6 sm:text-base sm:leading-8 text-slate-300">
            Find a lawyer whose experience fits your case, understand their practice at a glance, and take your next step with confidence.
          </p>

          {/* CTA Buttons - IMPROVED HIERARCHY: Single primary, secondary is subtle */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* PRIMARY CTA - Large, prominent */}
            <Link 
              to="/lawyers"
              className="inline-flex items-center justify-center gap-2 min-h-12 sm:min-h-11 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50 focus:outline-2 focus:outline-offset-2 focus:outline-white active:scale-95"
              aria-label="Browse lawyers - primary call to action"
            >
              Browse Lawyers
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            {/* SECONDARY CTA - Outline, lower emphasis */}
            <a 
              href="#practice-areas"
              className="inline-flex items-center justify-center gap-2 min-h-12 sm:min-h-11 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white active:scale-95"
              aria-label="Explore practice areas"
            >
              Explore areas
              <span className="sr-only">of practice</span>
            </a>
          </div>
        </motion.div>

        {/* Feature badges - proper touch targets, accessible icons */}
        <motion.div 
          className="mt-10 grid max-w-2xl gap-2 sm:gap-3 sm:grid-cols-3 sm:mt-12"
          {...rise}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.18 }}
          role="list"
        >
          {/* Each feature is a list item with proper min-height for touch */}
          <div 
            className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-xs sm:text-sm text-slate-200 min-h-12"
            role="listitem"
          >
            <BadgeCheck size={18} className="text-amber-300 flex-shrink-0" aria-hidden="true" />
            <span>Published profiles only</span>
          </div>

          <div 
            className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-xs sm:text-sm text-slate-200 min-h-12"
            role="listitem"
          >
            <ShieldCheck size={18} className="text-amber-300 flex-shrink-0" aria-hidden="true" />
            <span>Clear practice details</span>
          </div>

          <div 
            className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-xs sm:text-sm text-slate-200 min-h-12"
            role="listitem"
          >
            <Scale size={18} className="text-amber-300 flex-shrink-0" aria-hidden="true" />
            <span>Search by expertise</span>
          </div>
        </motion.div>
      </section>

      {/* Main content region */}
      <div id="main-content">
        {/* Featured lawyers section */}
        <LawyerShowcase
          eyebrow="NEWLY AVAILABLE"
          title="Featured Lawyers"
          description="Meet our newest featured legal professionals available to take on cases."
          lawyersQuery={featuredQuery}
          topExperts={false}
        />

        {/* Practice areas/categories section */}
        <div id="practice-areas">
          <LegalCategories />
        </div>

        {/* Top lawyers section */}
        <LawyerShowcase
          eyebrow="MOST SOUGHT"
          title="Top Rated Lawyers"
          description="The most hired legal experts across all practice areas."
          lawyersQuery={topQuery}
          allLink="/lawyers"
          topExperts={true}
        />
      </div>
    </>
  )
}
