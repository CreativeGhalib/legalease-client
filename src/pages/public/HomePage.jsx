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
        className="relative isolate overflow-hidden rounded-3xl bg-[#131820] px-4 py-16 text-white shadow-xl sm:px-6 sm:py-24 md:px-10 md:py-32 safe-area-inset-padding"
        style={{
          paddingTop: 'max(var(--safe-area-inset-top, 0px), 4rem)',
          paddingBottom: 'max(var(--safe-area-inset-bottom, 0px), 4rem)'
        }}
      >
        {/* Warm gold radial gradient — no indigo */}
        <div 
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_8%,rgba(212,168,67,0.22),transparent_30%),radial-gradient(circle_at_18%_85%,rgba(212,168,67,0.10),transparent_35%)]" 
          aria-hidden="true"
        />

        {/* Decorative scales icon - responsive sizing */}
        <div 
          className="absolute right-4 top-4 md:right-14 md:top-12"
          aria-hidden="true"
        >
          <div className="grid h-20 w-20 place-items-center rounded-full border border-[#d4a843]/25 bg-[#d4a843]/5 text-[#d4a843] md:h-56 md:w-56">
            <Scale className="h-10 w-10 md:h-22 md:w-22" strokeWidth={1.2} />
          </div>
        </div>

        {/* Hero content - properly responsive text */}
        <motion.div 
          className="relative z-10 max-w-2xl pr-24 md:pr-0"
          {...rise}
          transition={{ duration: 0.55 }}
        >
          {/* Eyebrow text */}
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a843] sm:text-sm">
            LEGAL CLARITY, HUMANLY CONNECTED
          </p>

          {/* Main headline - fluid typography, no truncation */}
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl break-words">
            Find &amp; Hire Expert Legal Counsel
          </h1>

          {/* Descriptive text - optimized for mobile readability */}
          <p className="mt-4 max-w-xl text-sm leading-7 sm:mt-6 sm:text-base sm:leading-8 text-[#96a8b8]">
            Find a lawyer whose experience fits your case, understand their practice at a glance, and take your next step with confidence.
          </p>

          {/* CTA Buttons - IMPROVED HIERARCHY: Single primary, secondary is subtle */}
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* PRIMARY CTA - Large, prominent */}
            <Link 
              to="/lawyers"
              className="inline-flex items-center justify-center gap-2 min-h-12 sm:min-h-11 rounded-xl bg-[#d4a843] px-6 py-3 text-sm font-semibold text-[#0d1117] transition hover:bg-[#e8bf58] focus:outline-2 focus:outline-offset-2 focus:outline-[#d4a843] active:scale-95"
              aria-label="Browse lawyers - primary call to action"
            >
              Browse Lawyers
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            {/* SECONDARY CTA - Outline, lower emphasis */}
            <a 
              href="#practice-areas"
              className="inline-flex items-center justify-center gap-2 min-h-12 sm:min-h-11 rounded-xl border border-[#d4a843]/40 px-6 py-3 text-sm font-semibold text-[#e4d9c5] transition hover:bg-[#d4a843]/10 focus:outline-2 focus:outline-offset-2 focus:outline-[#d4a843] active:scale-95"
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
            className="flex items-center gap-2 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/15 px-3 py-3 text-xs sm:text-sm text-[#e4d9c5] min-h-12"
            role="listitem"
          >
            <BadgeCheck size={18} className="text-[#d4a843] flex-shrink-0" aria-hidden="true" />
            <span>Published profiles only</span>
          </div>

          <div 
            className="flex items-center gap-2 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/15 px-3 py-3 text-xs sm:text-sm text-[#e4d9c5] min-h-12"
            role="listitem"
          >
            <ShieldCheck size={18} className="text-[#d4a843] flex-shrink-0" aria-hidden="true" />
            <span>Clear practice details</span>
          </div>

          <div 
            className="flex items-center gap-2 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/15 px-3 py-3 text-xs sm:text-sm text-[#e4d9c5] min-h-12"
            role="listitem"
          >
            <Scale size={18} className="text-[#d4a843] flex-shrink-0" aria-hidden="true" />
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
