import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BadgeCheck, Building2, Gavel, Handshake, Scale, Search, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Autoplay, Keyboard, Pagination, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { getFeaturedLawyers, getTopLawyers } from '../../api/lawyerDiscoveryApi'
import HeroSlide from '../../components/home/HeroSlide'
import LawyerShowcase from '../../components/home/LawyerShowcase'
import LegalCategories from '../../components/home/LegalCategories'
import StatsBar from '../../components/home/StatsBar'
import RecentLawyers from '../../components/home/RecentLawyers'

const heroCategories = [
  ['Criminal Law', Gavel],
  ['Family Law', Handshake],
  ['Corporate Law', Building2],
  ['Property Law', ShieldCheck],
]

/**
 * HomePage Component
 *
 * Main public landing page with:
 * - Accessible 4-slide hero carousel (autoplay, loop, pagination dots, keyboard)
 * - Safe area padding for iOS notches
 * - Reduced-motion aware autoplay
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

      {/* Hero Carousel */}
      <section
        aria-roledescription="carousel"
        aria-label="LegalEase highlights"
        className="relative isolate overflow-hidden rounded-3xl bg-[#131820] px-4 pb-14 pt-10 text-white shadow-xl sm:px-6 sm:pb-16 sm:pt-14 md:px-10 safe-area-inset-padding"
        style={{
          paddingTop: 'max(var(--safe-area-inset-top, 0px), 2.5rem)',
        }}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_8%,rgba(212,168,67,0.22),transparent_30%),radial-gradient(circle_at_18%_85%,rgba(212,168,67,0.10),transparent_35%)]"
          aria-hidden="true"
        />

        <Swiper
          modules={[Autoplay, Pagination, Keyboard, A11y]}
          autoplay={reduceMotion ? false : { delay: 5000, disableOnInteraction: false }}
          loop
          keyboard={{ enabled: true, onlyInViewport: true }}
          pagination={{ clickable: true }}
          a11y={{
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            paginationBulletMessage: 'Go to slide {{index}}',
          }}
          className="hero-carousel"
        >
          {/* Slide 1 — primary value proposition */}
          <SwiperSlide>
            <HeroSlide
              as="h1"
              eyebrow="LEGAL CLARITY, HUMANLY CONNECTED"
              title="Find Expert Legal Help in Minutes"
              footer={
                <Link
                  to="/lawyers"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d4a843] px-6 py-3 text-sm font-semibold text-[#0d1117] transition hover:bg-[#e8bf58] focus:outline-2 focus:outline-offset-2 focus:outline-[#d4a843] active:scale-95 sm:min-h-11"
                  aria-label="Browse lawyers — primary call to action"
                >
                  Browse Lawyers
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              }
            >
              Find a lawyer whose experience fits your case, understand their practice at a glance,
              and take your next step with confidence.
            </HeroSlide>
          </SwiperSlide>

          {/* Slide 2 — how it works */}
          <SwiperSlide>
            <HeroSlide as="h2" eyebrow="SIMPLE BY DESIGN" title="How It Works">
              <ol className="mt-5 grid max-w-lg gap-4 sm:grid-cols-3">
                {[
                  ['01', 'Browse', Search],
                  ['02', 'Hire', Handshake],
                  ['03', 'Resolve', Gavel],
                ].map(([step, label, Icon]) => (
                  <li key={step} className="flex items-center gap-3 rounded-xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-3 sm:flex-col sm:items-start">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#d4a843]/15 text-[#d4a843]">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-white">
                      <span className="mr-1 text-[#d4a843]">{step}.</span> {label}
                    </span>
                  </li>
                ))}
              </ol>
            </HeroSlide>
          </SwiperSlide>

          {/* Slide 3 — lawyer recruitment */}
          <SwiperSlide>
            <HeroSlide
              as="h2"
              eyebrow="FOR PRACTITIONERS"
              title="Are You a Lawyer?"
              footer={
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d4a843] px-6 py-3 text-sm font-semibold text-[#0d1117] transition hover:bg-[#e8bf58] focus:outline-2 focus:outline-offset-2 focus:outline-[#d4a843] active:scale-95 sm:min-h-11"
                >
                  Join LegalEase
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              }
            >
              Join 450+ professionals on LegalEase. Publish a verified profile and let clients find
              you when it matters.
            </HeroSlide>
          </SwiperSlide>

          {/* Slide 4 — category showcase */}
          <SwiperSlide>
            <HeroSlide as="h2" eyebrow="PRACTICE AREAS" title="Start with your legal matter">
              <div className="mt-5 grid max-w-md grid-cols-2 gap-2 sm:max-w-lg sm:grid-cols-3">
                {heroCategories.map(([label, Icon]) => (
                  <Link
                    key={label}
                    to={`/lawyers?specialization=${encodeURIComponent(label)}&page=1`}
                    className="flex min-h-12 items-center gap-2 rounded-xl border border-[#d4a843]/25 bg-[#d4a843]/5 px-3 text-sm font-semibold text-[#e4d9c5] transition hover:border-[#d4a843]/60 hover:bg-[#d4a843]/10 focus-visible:ring-2 focus-visible:ring-[#d4a843]"
                    aria-label={`Browse ${label} lawyers`}
                  >
                    <Icon size={16} className="shrink-0 text-[#d4a843]" aria-hidden="true" />
                    <span className="truncate">{label.replace(' Law', '')}</span>
                  </Link>
                ))}
              </div>
            </HeroSlide>
          </SwiperSlide>
        </Swiper>

        {/* Trust badges — static beneath the carousel */}
        <motion.ul
          className="mt-8 grid max-w-2xl gap-2 sm:mt-10 sm:grid-cols-3 sm:gap-3"
          {...rise}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.18 }}
        >
          {[
            [BadgeCheck, 'Published profiles only'],
            [ShieldCheck, 'Clear practice details'],
            [Scale, 'Search by expertise'],
          ].map(([Icon, label]) => (
            <li
              key={label}
              className="flex min-h-12 items-center gap-2 rounded-xl border border-[#d4a843]/15 bg-[#d4a843]/10 px-3 py-3 text-xs text-[#e4d9c5] sm:text-sm"
            >
              <Icon size={18} className="shrink-0 text-[#d4a843]" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </motion.ul>
      </section>

      {/* Main content region */}
      <div id="main-content">
        {/* Live marketplace stats — hidden entirely while counts are zero */}
        <StatsBar />

        {/* Recently verified lawyers */}
        <RecentLawyers />

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
